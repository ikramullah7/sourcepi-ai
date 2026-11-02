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

import { Button } from '@/components/ui/button';
import { useFetchUserInfo } from '@/hooks/use-user-setting-request';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ISearchAppDetailProps,
  useFetchSearchDetail,
} from '../next-searches/hooks';
import { useCheckSettings } from './hooks';
import './index.less';
import SearchHome from './search-home';
import { SearchSetting } from './search-setting';
import SearchingPage from './searching';

export default function SearchPage() {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const { data: SearchData } = useFetchSearchDetail();

  const [openSetting, setOpenSetting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data: userInfo } = useFetchUserInfo();
  const { openSetting: checkOpenSetting } = useCheckSettings(
    SearchData as ISearchAppDetailProps,
  );
  useEffect(() => {
    setOpenSetting(checkOpenSetting);
  }, [checkOpenSetting]);

  useEffect(() => {
    if (isSearching) {
      setOpenSetting(false);
    }
  }, [isSearching]);
  const handleToggleSettings = () => setOpenSetting(!openSetting);

  return (
    <section
      className="aw-search-detail size-full min-w-0 flex-1 relative p-4 sm:p-6 flex"
      data-testid="search-detail"
    >
      <div className="flex gap-3 flex-1 min-w-0 rounded-xl bg-bg-base">
        <div className="flex-1 min-w-0 overflow-hidden">
          {!isSearching && (
            <div className="animate-fade-in-down h-full overflow-x-hidden overflow-y-auto">
              <SearchHome
                setIsSearching={setIsSearching}
                isSearching={isSearching}
                searchText={searchText}
                setSearchText={setSearchText}
                userInfo={userInfo}
                canSearch={!checkOpenSetting}
              />
            </div>
          )}
          {isSearching && (
            <div className="animate-fade-in-up h-full">
              <SearchingPage
                setIsSearching={setIsSearching}
                searchText={searchText}
                setSearchText={setSearchText}
                data={SearchData as ISearchAppDetailProps}
              />
            </div>
          )}
        </div>
        {openSetting && (
          <SearchSetting
            open={openSetting}
            setOpen={setOpenSetting}
            className="aw-search-settings shrink-0 max-w-full bg-bg-component"
            data={SearchData as ISearchAppDetailProps}
          />
        )}
      </div>

      <Button
        variant="transparent"
        className="bg-bg-card ml-2 shrink-0"
        aria-label={t('search.searchSettings')}
        onClick={handleToggleSettings}
      >
        <Settings className="text-text-secondary" />
      </Button>
    </section>
  );
}
