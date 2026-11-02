import { useFetchKnowledgeBaseConfiguration } from '@/hooks/use-knowledge-request';
import { OwnerTenantIdContext } from '@/pages/agent/context';
import { KnowledgeBaseProvider } from '@/pages/dataset/contexts/knowledge-base-context';

import { Outlet } from 'react-router';
import { SideBar } from './sidebar';

export default function DatasetWrapper() {
  const { data, loading } = useFetchKnowledgeBaseConfiguration();

  return (
    <OwnerTenantIdContext.Provider value={data?.tenant_id ?? ''}>
      <KnowledgeBaseProvider knowledgeBase={data} loading={loading}>
        <article className="aw-dataset-detail size-full flex min-w-0 flex-col">
          <SideBar dataset={data} />

          <div className="min-h-0 min-w-0 flex-1 overflow-auto">
            <Outlet />
          </div>
        </article>
      </KnowledgeBaseProvider>
    </OwnerTenantIdContext.Provider>
  );
}
