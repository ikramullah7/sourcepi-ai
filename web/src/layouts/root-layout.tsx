import { Outlet } from 'react-router';
import { Header } from './components/header';
import { useTranslation } from 'react-i18next';

export function RootLayoutContainer({ children }: React.PropsWithChildren) {
  const { t } = useTranslation();
  return (
    <div className="aw-shell">
      <a className="aw-skip-link" href="#workspace-content">
        {t('workspace.skipToContent')}
      </a>
      <Header />

      <main id="workspace-content" className="aw-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout() {
  return (
    <RootLayoutContainer>
      <Outlet />
    </RootLayoutContainer>
  );
}
