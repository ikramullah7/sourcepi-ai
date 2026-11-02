import { PageContainer } from '@/layouts/components/page-container';
import { Applications } from './applications';
import { Datasets } from './datasets';
import { WorkspaceComposer } from './workspace-composer';
import { RecentConversations } from './recent-conversations';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <article className="aw-workspace">
        <header className="aw-hero">
          <h1>
            {t('workspace.heroTitle')} <span>{t('workspace.heroAccent')}</span>
          </h1>
          <p>{t('workspace.heroDescription')}</p>
        </header>
        <WorkspaceComposer />
        <div className="aw-workspace-lists">
          <RecentConversations />
          <Datasets />
        </div>
        <Applications />
      </article>
    </PageContainer>
  );
};

export default Home;
