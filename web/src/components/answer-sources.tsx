import { IReferenceChunk } from '@/interfaces/database/chat';
import { citationMarkerReg, parseCitationIndex } from '@/utils/citation-utils';
import { FileText, ArrowUpRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function getCitedSources(content: string, chunks: IReferenceChunk[]) {
  const indices = new Set<number>();
  for (const match of content.matchAll(new RegExp(citationMarkerReg))) {
    const index = parseCitationIndex(match[0]);
    if (typeof index === 'number' && chunks[index]) indices.add(index);
  }
  return [...indices].map((index) => ({ index, chunk: chunks[index] }));
}

type Source = ReturnType<typeof getCitedSources>[number];
type Props = {
  sources: Source[];
  onOpen: (documentId: string, chunk: IReferenceChunk) => void;
};

function SourceCard({
  source: { index, chunk },
  onOpen,
}: {
  source: Source;
  onOpen: Props['onOpen'];
}) {
  const { t } = useTranslation();
  const handleOpen = () => onOpen(chunk.document_id, chunk);
  const page = chunk.positions?.[0]?.[0];
  // Render excerpts as text; retrieved documents must never inject markup.
  const excerpt =
    typeof chunk.content === 'string'
      ? chunk.content.replace(/<[^>]*>/g, '').trim()
      : '';
  return (
    <button
      type="button"
      className="aw-source-card"
      onClick={handleOpen}
      aria-label={`${t('workspace.openSource')}: ${chunk.document_name}`}
    >
      <span className="flex w-full items-center gap-2 text-sm font-semibold">
        <span className="text-accent-primary">[{index + 1}]</span>
        <FileText className="size-4 shrink-0 text-accent-primary" />
        <span className="min-w-0 flex-1 break-words">
          {chunk.document_name}
        </span>
        <ArrowUpRight className="size-4 shrink-0" />
      </span>
      {Number.isFinite(page) && page > 0 && (
        <small>{t('workspace.page', { page })}</small>
      )}
      <blockquote>{excerpt || t('workspace.sourceExcerpt')}</blockquote>
    </button>
  );
}

function SourceList({ sources, onOpen }: Props) {
  return (
    <>
      {sources.map((source) => (
        <SourceCard
          key={`${source.index}-${source.chunk.id}`}
          source={source}
          onOpen={onOpen}
        />
      ))}
    </>
  );
}

export function AnswerSources({ sources, onOpen }: Props) {
  const { t } = useTranslation();
  if (!sources.length) return null;
  return (
    <aside
      className="aw-source-panel aw-desktop-sources"
      aria-label={t('workspace.sourcesForAnswer')}
    >
      <h2 className="aw-section-title flex items-center justify-between">
        {t('workspace.sources')}
        <span className="text-sm text-text-secondary">{sources.length}</span>
      </h2>
      <p className="mt-2 text-xs text-text-secondary">
        {t('workspace.sourcesForAnswer')}
      </p>
      <SourceList sources={sources} onOpen={onOpen} />
    </aside>
  );
}

export function MobileAnswerSources({ sources, onOpen }: Props) {
  const { t } = useTranslation();
  if (!sources.length) return null;
  return (
    <div className="aw-mobile-sources">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="min-h-10">
            <BookOpen />
            {t('workspace.sources')} ({sources.length})
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80dvh] overflow-auto rounded-t-xl bg-bg-base p-5"
        >
          <SheetHeader>
            <SheetTitle>{t('workspace.sourcesForAnswer')}</SheetTitle>
          </SheetHeader>
          <SourceList sources={sources} onOpen={onOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
