import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import {
  BookOpen,
  Bot,
  Files,
  House,
  Menu,
  MessagesSquare,
  Brain,
  Settings,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BrandLogo } from '@/components/brand-logo';
import { Routes } from '@/routes';

const MenuItems = [
  {
    path: Routes.Root,
    label: 'workspace.navigation',
    fallback: 'Workspace',
    icon: House,
    matches: [Routes.Root],
  },
  {
    path: Routes.Chats,
    label: 'header.chat',
    icon: MessagesSquare,
    matches: [Routes.Chats, Routes.Chat],
    testId: 'nav-chat',
  },
  {
    path: Routes.Datasets,
    label: 'header.dataset',
    icon: BookOpen,
    matches: [Routes.Datasets, Routes.DatasetBase],
  },
  {
    path: Routes.Searches,
    label: 'header.search',
    icon: Search,
    matches: [Routes.Searches, Routes.Search],
    testId: 'nav-search',
  },
  {
    path: Routes.Agents,
    label: 'header.flow',
    icon: Bot,
    matches: [Routes.Agents, Routes.Agent, Routes.AgentTemplates],
    testId: 'nav-agent',
  },
  {
    path: Routes.Memories,
    label: 'header.memories',
    icon: Brain,
    matches: [Routes.Memories, Routes.Memory, Routes.MemoryMessage],
  },
  {
    path: Routes.Files,
    label: 'header.fileManager',
    icon: Files,
    matches: [Routes.Files],
  },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <nav
      aria-label={t('workspace.mainNavigation', 'Main navigation')}
      className="aw-navigation"
    >
      <ul>
        {MenuItems.map(
          ({ path, label, fallback, icon: Icon, matches, testId }) => {
            const active = matches.some(
              (candidate) =>
                pathname === candidate ||
                (candidate !== '/' && pathname.startsWith(`${candidate}/`)),
            );
            return (
              <li key={path}>
                <Link
                  to={path}
                  onClick={onNavigate}
                  className="aw-nav-link"
                  aria-current={active ? 'page' : undefined}
                  data-testid={testId}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={1.7} />
                  <span>{t(label, { defaultValue: fallback ?? label })}</span>
                </Link>
              </li>
            );
          },
        )}
      </ul>
      <Link
        to={Routes.UserSetting}
        onClick={onNavigate}
        className="aw-nav-link aw-settings-link"
        aria-current={
          pathname.startsWith(Routes.UserSetting) ? 'page' : undefined
        }
      >
        <Settings className="size-5" strokeWidth={1.7} />
        {t('workspace.settings', 'Settings')}
      </Link>
    </nav>
  );
}

export function DesktopNavbar() {
  return <Navigation />;
}

export function MobileNavbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={t('workspace.openNavigation', 'Open navigation')}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="aw-mobile-navigation flex w-[min(88vw,18rem)] flex-col p-5"
      >
        <SheetTitle>
          <BrandLogo />
        </SheetTitle>
        <Navigation onNavigate={close} />
      </SheetContent>
    </Sheet>
  );
}
