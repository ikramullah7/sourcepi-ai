import { fireEvent, render, screen } from '@testing-library/react';
import { AnswerSources, getCitedSources } from './answer-sources';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { page: number }) =>
      options?.page ? `Page ${options.page}` : key,
  }),
}));

const Chunk = {
  id: 'chunk-1',
  document_id: 'doc-1',
  document_name: 'Research.pdf',
  dataset_id: 'kb-1',
  image_id: '',
  content: '<b>Evidence</b> from the document.',
  similarity: 1,
  vector_similarity: 1,
  term_similarity: 1,
  positions: [[4, 0, 10, 0, 10]],
};

it('keeps inline citation numbers, deduplicates repeated citations and excludes missing sources', () => {
  const chunks = [Chunk, { ...Chunk, id: 'chunk-2' }];
  expect(
    getCitedSources('First [1], again [1], then [٠], missing [9].', chunks).map(
      (source) => source.index,
    ),
  ).toEqual([1, 0]);
  expect(getCitedSources('No cited evidence.', chunks)).toEqual([]);
});

it('opens the cited chunk with its original location and renders excerpt markup as text', () => {
  const onOpen = jest.fn();
  const { container } = render(
    <AnswerSources sources={[{ index: 0, chunk: Chunk }]} onOpen={onOpen} />,
  );
  expect(screen.getByText('Page 4')).toBeInTheDocument();
  expect(screen.getByText('Evidence from the document.')).toBeInTheDocument();
  expect(container.querySelector('blockquote b')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Research.pdf/ }));
  expect(onOpen).toHaveBeenCalledWith('doc-1', Chunk);
});

it('does not display an empty sources rail', () => {
  const { container } = render(
    <AnswerSources sources={[]} onOpen={jest.fn()} />,
  );
  expect(container).toBeEmptyDOMElement();
});
