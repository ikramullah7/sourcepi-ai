import { EmptyCardType } from '@/components/empty/constant';
import { EmptyAppCard } from '@/components/empty/empty';
import { MoreButton } from '@/components/more-button';
import { PixelMark } from '@/components/pixel-mark';
import { RenameDialog } from '@/components/rename-dialog';
import { CardSkeleton } from '@/components/ui/skeleton';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useFetchNextKnowledgeListByPage } from '@/hooks/use-knowledge-request';
import { Routes } from '@/routes';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DatasetDropdown } from '../datasets/dataset-dropdown';
import { useRenameDataset } from '../datasets/use-rename-dataset';

export function Datasets() {
  const { t } = useTranslation();
  const { kbs, loading } = useFetchNextKnowledgeListByPage();
  const {
    datasetRenameLoading,
    initialDatasetName,
    onDatasetRenameOk,
    datasetRenameVisible,
    hideDatasetRenameModal,
    showDatasetRenameModal,
  } = useRenameDataset();
  const { navigateToDatasetList } = useNavigatePage();
  const handleCreate = () => navigateToDatasetList({ isCreate: true });
  return (
    <section className="aw-workspace-section">
      <header className="aw-section-header">
        <h2>{t('header.dataset')}</h2>
        <Link
          to={Routes.Datasets}
          className="inline-flex min-h-10 items-center gap-2 text-xs font-medium"
        >
          {t('common.seeAll')}
          <ArrowRight className="size-4" />
        </Link>
      </header>
      {loading && !kbs?.length ? (
        <CardSkeleton />
      ) : kbs?.length ? (
        <ul className="aw-recent-sessions">
          {kbs.slice(0, 4).map((dataset) => (
            <li key={dataset.id} className="flex min-w-0 items-center pr-3">
              <Link
                to={`${Routes.Dataset}/${dataset.id}`}
                className="aw-recent-session min-w-0 flex-1"
              >
                <span className="aw-card-symbol">
                  <PixelMark className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {dataset.name}
                  </span>
                  <span className="block text-xs text-text-secondary">
                    {dataset.document_count} {t('knowledgeDetails.files')}
                  </span>
                </span>
              </Link>
              <DatasetDropdown
                dataset={dataset}
                showDatasetRenameModal={showDatasetRenameModal}
              >
                <MoreButton />
              </DatasetDropdown>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyAppCard type={EmptyCardType.Dataset} onClick={handleCreate} />
      )}
      {datasetRenameVisible && (
        <RenameDialog
          hideModal={hideDatasetRenameModal}
          onOk={onDatasetRenameOk}
          initialName={initialDatasetName}
          loading={datasetRenameLoading}
        />
      )}
    </section>
  );
}
