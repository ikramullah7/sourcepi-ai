import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LucideBookText,
  LucideFolderOpen,
  LucideLogs,
  LucideSettings,
  LucideTextSearch,
} from 'lucide-react';

import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { PixelMark } from '@/components/pixel-mark';
import { Button } from '@/components/ui/button';
import { useSecondPathName } from '@/hooks/route-hook';
import { cn, formatBytes } from '@/lib/utils';
import { Routes } from '@/routes';
import { formatPureDate } from '@/utils/date';

import { IDataset } from '@/interfaces/database/dataset';
import { Link, useParams } from 'react-router';

type PropType = {
  refreshCount?: number;
  dataset: IDataset;
};

export function SideBar({ dataset: data }: PropType) {
  const pathName = useSecondPathName();
  const { id } = useParams();
  const { t } = useTranslation();

  const items = useMemo(() => {
    const list = [
      {
        icon: <LucideFolderOpen className="size-[1em]" />,
        label: t(`knowledgeDetails.subbarFiles`),
        key: Routes.Files,
      },
      {
        icon: <LucideTextSearch className="size-[1em]" />,
        label: t(`knowledgeDetails.testing`),
        key: Routes.DatasetTesting,
      },
      {
        icon: <LucideLogs className="size-[1em]" />,
        label: t(`knowledgeDetails.overview`),
        key: Routes.DataSetOverview,
      },
      {
        icon: <LucideSettings className="size-[1em]" />,
        label: t(`knowledgeDetails.configuration`),
        key: Routes.DataSetSetting,
      },
      {
        icon: <LucideBookText className="size-[1em]" />,
        label: 'Artifacts',
        key: Routes.Compilation,
      },
    ];

    return list;
  }, [t]);

  return (
    <aside className="aw-collection-header">
      <Link
        to={Routes.Datasets}
        className="mb-4 inline-flex text-xs text-text-secondary hover:text-accent-primary"
      >
        {t('header.dataset')} /
      </Link>
      <header
        className="pb-5 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-4"
        style={{
          gridTemplateAreas: '"avatar title" "avatar stats"',
        }}
      >
        {data.avatar ? (
          <RAGFlowAvatar
            avatar={data.avatar}
            name={data.name}
            className="size-12"
            style={{ gridArea: 'avatar' }}
          />
        ) : (
          <PixelMark className="size-12 row-span-2 text-accent-primary" />
        )}

        <h1
          className="aw-title truncate text-text-primary"
          style={{ gridArea: 'title' }}
        >
          {data.name}
        </h1>

        <div
          className="self-end text-text-secondary text-xs overflow-hidden"
          style={{ gridArea: 'stats' }}
        >
          <div className="flex flex-wrap gap-x-4">
            <span>
              {data.document_count} {t('knowledgeDetails.files')}
            </span>
            <span>{data.size ? formatBytes(data.size) : ''}</span>
          </div>

          <div className="mt-0.5">
            {t('knowledgeDetails.created')} {formatPureDate(data.create_time)}
          </div>
        </div>
      </header>

      <nav className="overflow-x-auto" aria-label={data.name}>
        <ul className="flex min-w-max gap-2">
          {items.map((item) => {
            const active = '/' + pathName === item.key;

            return (
              <li key={item.key}>
                <Button
                  asLink
                  block
                  variant="ghost"
                  className={cn(
                    'justify-start gap-2 px-4 relative h-11 rounded-b-none text-sm border-b-2 border-transparent',
                    active &&
                      'border-accent-primary bg-bg-accent text-accent-primary',
                  )}
                  aria-current={active ? 'page' : undefined}
                  to={`${Routes.DatasetBase}${item.key}/${id}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
