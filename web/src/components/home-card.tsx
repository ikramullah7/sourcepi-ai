import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { PixelMark } from '@/components/pixel-mark';
import { TruncatedText } from '@/components/truncated-text';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
import { KeyboardEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: {
    name: string;
    description?: string;
    avatar?: string;
    update_time?: string | number;
    release_time?: number;
  };
  onClick?: () => void;
  moreDropdown: ReactNode;
  sharedBadge?: ReactNode;
  icon?: ReactNode;
  testId?: string;
  showReleaseTime?: boolean;
  extra?: ReactNode;
  cover?: boolean;
}

const Tones = ['forest', 'plum', 'orange', 'yellow'];

export function HomeCard({
  data,
  onClick,
  moreDropdown,
  sharedBadge,
  icon,
  testId,
  showReleaseTime = false,
  extra,
  cover = false,
}: IProps) {
  const { t } = useTranslation();
  const tone =
    Tones[
      Array.from(data.name).reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        Tones.length
    ];
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      onClick?.();
    }
  };
  return (
    <Card
      as="article"
      data-testid={testId}
      data-agent-name={data.name}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      aria-label={data.name}
      className={`aw-library-card group flex h-full w-full min-w-0 flex-col overflow-hidden bg-bg-component !shadow-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      {cover && (
        <div className={`aw-collection-cover aw-tone-${tone}`}>
          <PixelMark className="size-12" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
        <header className="flex min-w-0 items-start gap-3">
          {!cover &&
            (data.avatar ? (
              <RAGFlowAvatar
                className="size-10"
                avatar={data.avatar}
                name={data.name}
              />
            ) : (
              <div className="aw-card-symbol">
                <PixelMark className="size-6" />
              </div>
            ))}
          <div className="min-w-0 flex-1">
            <TruncatedText
              as="h3"
              className="truncate text-base font-semibold leading-snug tracking-tight"
              testId="agent-name"
              tooltip={data.name}
            >
              {data.name}
            </TruncatedText>
            {data.description && (
              <TruncatedText
                className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary"
                tooltip={data.description}
              >
                {data.description}
              </TruncatedText>
            )}
          </div>
          {icon}
          {moreDropdown}
        </header>
        {extra}
        {(data.update_time || data.release_time || sharedBadge) && (
          <footer className="mt-auto flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-border-button pt-3 text-xs text-text-secondary">
            <div className="min-w-0 space-y-1">
              <p className="truncate">
                {showReleaseTime && `${t('flow.lastSavedAt')}: `}
                {formatDate(data.update_time)}
              </p>
              {showReleaseTime && !!data.release_time && (
                <p className="truncate">
                  {t('flow.publishedAt')}: {formatDate(data.release_time)}
                </p>
              )}
            </div>
            {sharedBadge}
          </footer>
        )}
      </div>
    </Card>
  );
}
