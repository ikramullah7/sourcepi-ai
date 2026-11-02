import { render } from '@testing-library/react';
import React from 'react';

import HighLightMarkdown from '..';

jest.mock('@/constants/markdown-remark-plugins', () => ({
  MarkdownRemarkPlugins: [],
}));

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: any) => {
    const react = jest.requireActual('react');
    return react.createElement('pre', null, children);
  },
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
  oneLight: {},
}));

jest.mock('rehype-katex', () => jest.fn());

jest.mock('../../theme-provider', () => ({
  useIsDarkTheme: () => false,
}));

describe('HighLightMarkdown', () => {
  it('sanitizes unsafe html before rendering', () => {
    const { container } = render(
      React.createElement(
        HighLightMarkdown,
        null,
        'hello <img src=/safe.png onerror="alert(1)" /><script>alert(1)</script><b>safe</b>',
      ),
    );

    // <b>safe</b> is allowed by the sanitizer default profile, so it should
    // render as a real <b> element with text "safe".
    expect(container.querySelector('b')?.textContent).toBe('safe');

    // <script> is removed entirely by the sanitizer.
    expect(container.querySelector('script')).toBeNull();

    // <img> is kept but its dangerous handler attribute must be stripped.
    // (the sanitizer default profile removes on* event attributes.)
    const imgs = container.querySelectorAll('img');
    imgs.forEach((img) => {
      expect(img.getAttribute('onerror')).toBeNull();
    });
  });

  it('strips html encoded as entities (preprocessLaTeX bypass)', () => {
    // preprocessLaTeX() decodes &lt;/&gt;/&amp; back to raw HTML before
    // rehypeRaw runs. Sanitization must occur AFTER preprocessLaTeX, so
    // a payload delivered as &lt;img onerror=...&gt; cannot survive.
    const { container } = render(
      React.createElement(
        HighLightMarkdown,
        null,
        '&lt;img src=/safe.png onerror="alert(1)" /&gt;&lt;script&gt;alert(1)&lt;/script&gt;safe',
      ),
    );

    // <script> entirely removed.
    expect(container.querySelector('script')).toBeNull();
    // <img> kept (allowed by default profile) but onerror must be stripped.
    container.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('onerror')).toBeNull();
    });
    // The literal word "safe" should still be visible.
    expect(container.textContent).toContain('safe');
  });
});
