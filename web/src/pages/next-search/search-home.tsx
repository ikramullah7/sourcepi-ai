import message from '@/components/ui/message';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { IUserInfo } from '@/interfaces/database/user-setting';
import { Search } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { RAGFlowLogo } from './ragflow-logo';

export default function SearchHome({
  isSearching,
  setIsSearching,
  searchText,
  setSearchText,
  userInfo,
  canSearch,
  showEmbedLogo,
}: {
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  userInfo?: IUserInfo;
  canSearch?: boolean;
  showEmbedLogo?: boolean;
}) {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(searchInputRef, searchText);
  const handleStartSearch = useCallback(() => {
    if (canSearch === false) {
      message.warning(t('search.chooseDataset'));
      return;
    }
    if (!searchText.trim()) return;
    setIsSearching(!isSearching);
  }, [canSearch, isSearching, searchText, setIsSearching, t]);
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleStartSearch();
    }
  };
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (canSearch === false) {
      message.warning(t('search.chooseDataset'));
      return;
    }
    setSearchText(event.target.value);
  };
  return (
    <section className="aw-search-home">
      <RAGFlowLogo showEmbedIcon={showEmbedLogo} />
      <header className="aw-hero mt-12">
        <h2 className="aw-search-title">{t('workspace.searchTitle')}</h2>
        <p>{t('workspace.searchDescription')}</p>
      </header>
      {userInfo?.nickname && (
        <p className="mb-4 text-sm text-text-secondary">
          {t('search.welcomeBack')}, {userInfo.nickname}
        </p>
      )}
      <div className="aw-composer w-full">
        <label htmlFor="knowledge-search" className="sr-only">
          {t('search.searchGreeting')}
        </label>
        <textarea
          id="knowledge-search"
          ref={searchInputRef}
          rows={2}
          value={searchText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('search.searchGreeting')}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="aw-send"
            onClick={handleStartSearch}
            aria-label={t('header.search')}
          >
            <Search className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
