import { PixelMark } from '@/components/pixel-mark';
import {
  useFetchChatList,
  useFetchSessionList,
} from '@/hooks/use-chat-request';
import { ChatSearchParams } from '@/constants/chat';
import { Routes } from '@/routes';
import { formatDate } from '@/utils/date';
import { ArrowUpRight } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

function RecentSessions({ chatId }: { chatId: string }) {
  const { t } = useTranslation();
  const { data, loading } = useFetchSessionList(chatId);
  const sessions = [...data]
    .sort((a, b) => b.update_time - a.update_time)
    .slice(0, 4);
  if (loading && !data.length)
    return (
      <p className="p-5 text-sm text-text-secondary" role="status">
        {t('common.loading')}
      </p>
    );
  if (!sessions.length)
    return (
      <p className="p-5 text-sm text-text-secondary">
        {t('workspace.noConversations')}
      </p>
    );
  return (
    <ul className="aw-recent-sessions">
      {sessions.map((session) => (
        <li key={session.id}>
          <Link
            to={`${Routes.Chat}/${chatId}?${new URLSearchParams({ [ChatSearchParams.ConversationId]: session.id })}`}
            className="aw-recent-session"
          >
            <span className="aw-card-symbol">
              <PixelMark className="size-5" />
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">
              {session.name}
            </span>
            <span className="text-xs text-text-secondary">
              {formatDate(session.update_time)}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-text-secondary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function RecentConversations() {
  const { t } = useTranslation();
  const { data } = useFetchChatList();
  const [selectedChat, setSelectedChat] = useState('');
  const chats = data?.chats ?? [];
  const chatId =
    chats.find((chat) => chat.id === selectedChat)?.id ?? chats[0]?.id;
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedChat(event.target.value);
  if (!chatId) return null;
  return (
    <section className="aw-workspace-section">
      <header className="aw-section-header">
        <h2>{t('workspace.recentConversations')}</h2>
        <label className="aw-assistant-select">
          <span className="sr-only">{t('workspace.assistant')}</span>
          <select value={chatId} onChange={handleChange}>
            {chats.map((chat) => (
              <option key={chat.id} value={chat.id}>
                {chat.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <RecentSessions key={chatId} chatId={chatId} />
    </section>
  );
}
