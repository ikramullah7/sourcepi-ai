/*
 *  Copyright 2026 The InfiniFlow Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { IconFontFill } from '@/components/icon-font';
import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import ThemeSwitch from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-login-request';
import {
  useFetchSystemVersion,
  useFetchUserInfo,
} from '@/hooks/use-user-setting-request';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { TFunction } from 'i18next';
import {
  LucideBox,
  LucideLogOut,
  LucideMessagesSquare,
  LucideServer,
  LucideUnplug,
  LucideUser,
  LucideUsers,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHandleMenuClick } from './hooks';

const menuItems = (t: TFunction) => [
  {
    icon: <LucideBox className="size-[1em]" />,
    label: t('setting.model'),
    key: Routes.Model,
    'data-testid': 'settings-nav-model-providers',
  },
  {
    icon: <LucideServer className="size-[1em]" />,
    label: t('setting.dataSources'),
    key: Routes.DataSource,
  },
  {
    icon: <LucideMessagesSquare className="size-[1em]" />,
    label: t('setting.chatChannels'),
    key: Routes.ChatChannel,
  },
  {
    icon: <IconFontFill name="mcp" className="size-[1em]" />,
    label: 'MCP',
    key: Routes.Mcp,
  },
  {
    icon: <LucideUsers className="size-[1em]" />,
    label: t('setting.team'),
    key: Routes.Team,
  },
  {
    icon: <LucideUser className="size-[1em]" />,
    label: t('setting.profile'),
    key: Routes.Profile,
  },
  {
    icon: <LucideUnplug className="size-[1em]" />,
    label: t('setting.api'),
    key: Routes.Api,
  },
];

export function SideBar() {
  const { data: userInfo } = useFetchUserInfo();
  const { handleMenuClick, active: activeItemKey } = useHandleMenuClick();
  const { version, fetchSystemVersion } = useFetchSystemVersion();
  const { t } = useTranslation();
  useEffect(() => {
    fetchSystemVersion();
  }, [fetchSystemVersion]);
  const { logout } = useLogout();

  return (
    <aside className="shrink-0 w-16 xl:w-[232px] bg-transparent flex flex-col overflow-hidden">
      <header>
        <h1 className="px-2 xl:px-6 flex gap-2.5 items-center justify-center xl:justify-start font-normal">
          <RAGFlowAvatar
            avatar={userInfo?.avatar}
            name={userInfo?.nickname}
            isPerson
          />

          <p className="hidden xl:block text-sm text-text-primary truncate">
            {userInfo?.email}
          </p>
        </h1>
      </header>

      <nav className="flex-1 overflow-auto mt-4 py-1">
        <ul className="px-2 xl:px-6 flex flex-col gap-2 xl:gap-5 items-center xl:items-stretch">
          {menuItems(t).map((item) => {
            const { key, icon, label, ...rest } = item;

            return (
              <li key={key} className="w-full xl:w-auto">
                <Button
                  {...rest}
                  block
                  variant="ghost"
                  aria-label={label}
                  className={cn(
                    'relative h-10 text-base max-xl:size-10 max-xl:p-0 max-xl:justify-center justify-start gap-2.5 px-2 xl:px-3',
                    activeItemKey === key && 'bg-bg-card text-text-primary',
                  )}
                  onClick={handleMenuClick(key)}
                >
                  <span className="flex items-center gap-2.5 max-xl:gap-0">
                    {icon}
                    <span className="hidden xl:inline">{label}</span>
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="p-2 xl:p-6 mt-auto">
        <div className="hidden xl:flex items-center gap-2 mb-6 justify-between">
          <span className="text-xs text-accent-primary">{version}</span>

          <ThemeSwitch />
        </div>

        <Button
          block
          size="lg"
          variant="transparent"
          aria-label={t('setting.logout')}
          className="max-xl:size-10 max-xl:p-0 max-xl:mx-auto max-xl:justify-center"
          onClick={() => logout()}
        >
          <LucideLogOut className="size-[1em] xl:hidden" />
          <span className="hidden xl:inline">{t('setting.logout')}</span>
        </Button>
      </footer>
    </aside>
  );
}
