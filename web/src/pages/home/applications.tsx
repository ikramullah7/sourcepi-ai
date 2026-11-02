import { CardSineLineContainer } from '@/components/card-singleline-container';
import { EmptyCardType } from '@/components/empty/constant';
import { EmptyAppCard } from '@/components/empty/empty';
import { Segmented, SegmentedValue } from '@/components/ui/segmented';
import { Routes } from '@/routes';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Agents } from './agent-list';
import { SeeAllAppCard } from './application-card';
import { ChatList } from './chat-list';
import { MemoryList } from './memory-list';
import { SearchList } from './search-list';

const EmptyTypeMap = {
  [Routes.Chats]: EmptyCardType.Chat,
  [Routes.Searches]: EmptyCardType.Search,
  [Routes.Agents]: EmptyCardType.Agent,
  [Routes.Memories]: EmptyCardType.Memory,
};

export function Applications() {
  const [val, setVal] = useState(Routes.Chats);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listLength, setListLength] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNavigate = useCallback(
    ({ isCreate }: { isCreate?: boolean }) => {
      if (isCreate) {
        navigate(val + '?isCreate=true');
      } else {
        navigate(val);
      }
    },
    [navigate, val],
  );

  const options = useMemo(
    () => [
      { value: Routes.Chats, label: t('header.chat') },
      { value: Routes.Searches, label: t('header.search') },
      { value: Routes.Agents, label: t('header.flow') },
      { value: Routes.Memories, label: t('header.memories') },
    ],
    [t],
  );

  const handleChange = (path: SegmentedValue) => {
    setVal(path as Routes);
    setListLength(0);
    setLoading(true);
  };
  const handleViewAll = () => handleNavigate({ isCreate: false });
  const handleCreate = () => handleNavigate({ isCreate: true });

  return (
    <section className="aw-workspace-section">
      <header className="aw-section-header">
        <h2>{t('workspace.recentWork')}</h2>

        <Segmented
          buttonSize="sm"
          options={options}
          value={val}
          onChange={handleChange}
        />
      </header>

      <CardSineLineContainer>
        {val === Routes.Agents && (
          <Agents setListLength={setListLength} setLoading={setLoading} />
        )}
        {val === Routes.Chats && (
          <ChatList setListLength={setListLength} setLoading={setLoading} />
        )}
        {val === Routes.Searches && (
          <SearchList setListLength={setListLength} setLoading={setLoading} />
        )}
        {val === Routes.Memories && (
          <MemoryList setListLength={setListLength} setLoading={setLoading} />
        )}
        {listLength > 0 && <SeeAllAppCard click={handleViewAll} />}
      </CardSineLineContainer>

      {listLength <= 0 && !loading && (
        <div className="max-w-sm">
          <EmptyAppCard
            type={EmptyTypeMap[val as keyof typeof EmptyTypeMap]}
            onClick={handleCreate}
          />
        </div>
      )}
    </section>
  );
}
