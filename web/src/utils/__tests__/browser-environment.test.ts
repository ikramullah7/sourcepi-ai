describe('frontend browser test environment', () => {
  it('supports Requests with the same AbortSignal implementation', () => {
    const controller = new AbortController();
    const request = new Request('https://example.test/document', {
      signal: controller.signal,
    });
    controller.abort();
    expect(request.signal.aborted).toBe(true);
  });

  it('preserves Blob and FileReader interoperability', async () => {
    const file = new File([new Blob(['document contents'])], 'document.txt');
    expect(new TextDecoder().decode(await file.arrayBuffer())).toBe(
      'document contents',
    );
  });
});
