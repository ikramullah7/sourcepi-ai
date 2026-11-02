import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChangeLanguage } from '@/hooks/logic-hooks';
import {
  useFetchUserInfo,
  useListTenant,
} from '@/hooks/use-user-setting-request';
import { supportedLanguages } from '@/locales/config';
import { TenantRole } from '@/pages/user-setting/constants';
import { Routes } from '@/routes';
import { Languages, Plus, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BellButton } from './bell-button';
import { DesktopNavbar, MobileNavbar } from './global-navbar';
import ThemeButton from './theme-button';

function LanguageOption({
  code,
  displayName,
}: {
  code: string;
  displayName: string;
}) {
  const changeLanguage = useChangeLanguage();
  const handleSelect = () => changeLanguage(code);
  return (
    <DropdownMenuItem onSelect={handleSelect}>{displayName}</DropdownMenuItem>
  );
}

export function Header() {
  const { t } = useTranslation();
  const {
    data: { language = 'en', avatar, nickname },
  } = useFetchUserInfo();
  const { data: tenantData } = useListTenant();
  const hasNotification = tenantData?.some(
    (tenant) => tenant.role === TenantRole.Invite,
  );
  const currentLanguage = supportedLanguages.find(
    (item) => item.code === language,
  );

  return (
    <header className="aw-sidebar">
      <div className="aw-brand-row">
        <div className="aw-mobile-menu">
          <MobileNavbar />
        </div>
        <Link to={Routes.Root}>
          <BrandLogo />
        </Link>
      </div>
      <Link to={Routes.Root} className="aw-new-chat">
        <Plus className="size-5" />
        {t('chat.newConversation')}
      </Link>
      <div className="aw-desktop-navigation">
        <DesktopNavbar />
      </div>
      <div className="aw-account" data-testid="auth-status">
        <div className="aw-account-tools">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="max-sm:w-8"
                aria-label={
                  currentLanguage?.displayName ??
                  t('workspace.language', 'Language')
                }
                title={currentLanguage?.displayName}
              >
                <Languages className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {supportedLanguages.map((item) => (
                <LanguageOption
                  key={item.code}
                  code={item.code}
                  displayName={item.displayName}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeButton className="size-10 max-sm:w-8 lg:size-10" />
          {hasNotification && <BellButton className="!size-10" />}
        </div>
        <Link
          to={Routes.UserSetting}
          className="aw-profile"
          data-testid="settings-entrypoint"
          aria-label={t('workspace.settings', 'Settings')}
        >
          <RAGFlowAvatar
            name={nickname}
            avatar={avatar}
            isPerson
            className="size-9"
          />
          <span className="aw-profile-name">
            {nickname || t('workspace.yourWorkspace', 'Your workspace')}
            <small>{t('workspace.account', 'Account & preferences')}</small>
          </span>
          <ChevronRight className="aw-profile-chevron size-4" />
        </Link>
      </div>
    </header>
  );
}
