package parser

import (
	"context"
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"
)

type paddleRoundTripperFunc func(*http.Request) (*http.Response, error)

func (f paddleRoundTripperFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

func TestPaddleOCRRequestDeadlinesAreCanceled(t *testing.T) {
	cases := []struct {
		name string
		body string
		call func(*PaddleOCRClient, time.Time) error
	}{
		{
			name: "submit",
			body: `{"jobId":"job-1"}`,
			call: func(client *PaddleOCRClient, deadline time.Time) error {
				_, err := client.submitJob([]byte("document"), "document.pdf", deadline)
				return err
			},
		},
		{
			name: "poll",
			body: `{"state":"done"}`,
			call: func(client *PaddleOCRClient, deadline time.Time) error {
				_, err := client.pollJob("job-1", deadline)
				return err
			},
		},
		{
			name: "fetch",
			body: "{}\n",
			call: func(client *PaddleOCRClient, deadline time.Time) error {
				_, err := client.fetchResult(map[string]any{"resultJsonUrl": "https://paddle.test/result"}, deadline)
				return err
			},
		},
	}
	for _, tc := range cases {
		for _, name := range []string{"success", "transport error", "HTTP error"} {
			t.Run(tc.name+"/"+name, func(t *testing.T) {
				var requestCtx context.Context
				deadline := time.Now().Add(time.Minute)
				client := &PaddleOCRClient{
					BaseURL:   "https://paddle.test",
					Algorithm: defaultPaddleOCRAlgo,
					httpClient: &http.Client{Transport: paddleRoundTripperFunc(func(req *http.Request) (*http.Response, error) {
						requestCtx = req.Context()
						if got, ok := requestCtx.Deadline(); !ok || !got.Equal(deadline) {
							t.Errorf("request deadline = %v, want %v", got, deadline)
						}
						if name == "transport error" {
							return nil, errors.New("transport failure")
						}
						status := http.StatusOK
						if name == "HTTP error" {
							status = http.StatusServiceUnavailable
						}
						return &http.Response{StatusCode: status, Body: io.NopCloser(strings.NewReader(tc.body)), Header: make(http.Header)}, nil
					})},
				}
				err := tc.call(client, deadline)
				fail := name != "success"
				if (err != nil) != fail {
					t.Fatalf("error = %v, want failure %v", err, fail)
				}
				if requestCtx == nil || requestCtx.Err() != context.Canceled {
					t.Fatal("request context was not canceled after completion")
				}
			})
		}
	}
}
