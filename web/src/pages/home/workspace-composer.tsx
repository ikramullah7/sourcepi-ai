import { PixelMark, PixelPattern } from '@/components/pixel-mark';
import { useFetchChatList } from '@/hooks/use-chat-request';
import { Routes } from '@/routes';
import { ArrowRight, MessagesSquare } from 'lucide-react';
import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

const Prompts: { key: string; pattern: PixelPattern; tone: string }[] = [
  { key: 'summarise', pattern: 'spark', tone: 'forest' },
  { key: 'compare', pattern: 'compare', tone: 'plum' },
  { key: 'answer', pattern: 'answer', tone: 'orange' },
  { key: 'report', pattern: 'report', tone: 'yellow' },
];

function PromptCard({
  prompt,
  onChoose,
}: {
  prompt: (typeof Prompts)[number];
  onChoose: (question: string) => void;
}) {
  const { t } = useTranslation();
  const handleChoose = () => onChoose(t(`workspace.${prompt.key}Prompt`));
  return (
    <button
      type="button"
      className={`aw-prompt aw-tone-${prompt.tone}`}
      onClick={handleChoose}
    >
      <PixelMark pattern={prompt.pattern} className="size-11" />
      <div>
        <h2>{t(`workspace.${prompt.key}Title`)}</h2>
        <p>{t(`workspace.${prompt.key}Description`)}</p>
      </div>
      <ArrowRight className="size-5" />
    </button>
  );
}

export function WorkspaceComposer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading } = useFetchChatList();
  const [question, setQuestion] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chats = data?.chats ?? [];
  const chatId =
    chats.find((chat) => chat.id === selectedChat)?.id ?? chats[0]?.id ?? '';

  const handleQuestionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setQuestion(event.target.value);
  const handleChatChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedChat(event.target.value);
  const choosePrompt = (prompt: string) => {
    setQuestion(prompt);
    inputRef.current?.focus();
  };
  const continueToChat = () => {
    if (!question.trim() || !chatId) return;
    navigate(`${Routes.Chat}/${chatId}`, {
      state: { workspaceQuestion: question.trim() },
    });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    continueToChat();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      continueToChat();
    }
  };

  return (
    <>
      <form
        className="aw-composer"
        onSubmit={handleSubmit}
        aria-label={t('workspace.askQuestion')}
      >
        <label htmlFor="workspace-question" className="sr-only">
          {t('workspace.askQuestion')}
        </label>
        <textarea
          id="workspace-question"
          ref={inputRef}
          value={question}
          onChange={handleQuestionChange}
          onKeyDown={handleKeyDown}
          placeholder={t('workspace.questionPlaceholder')}
          aria-describedby="workspace-composer-help"
        />
        <div className="aw-composer-footer">
          <label className="aw-assistant-select">
            <MessagesSquare className="size-4 shrink-0" />
            <span className="sr-only">{t('workspace.assistant')}</span>
            <select
              value={chatId}
              onChange={handleChatChange}
              disabled={loading || !chats.length}
            >
              {!chats.length && (
                <option value="">
                  {t(loading ? 'common.loading' : 'workspace.noAssistant')}
                </option>
              )}
              {chats.map((chat) => (
                <option key={chat.id} value={chat.id}>
                  {chat.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="aw-send"
            type="submit"
            disabled={!question.trim() || !chatId || loading}
          >
            <span className="aw-send-label" aria-hidden="true">
              {t('workspace.continue')}
            </span>
            <ArrowRight className="size-5" />
            <span className="sr-only">{t('workspace.continue')}</span>
          </button>
        </div>
      </form>
      <p className="aw-composer-help" id="workspace-composer-help">
        {chats.length ? (
          t('workspace.composerHelp')
        ) : (
          <Link to={`${Routes.Chats}?isCreate=true`}>
            {t('workspace.createAssistant')}
          </Link>
        )}
      </p>
      <section className="aw-prompts" aria-label={t('workspace.suggestions')}>
        {Prompts.map((prompt) => (
          <PromptCard
            key={prompt.key}
            prompt={prompt}
            onChoose={choosePrompt}
          />
        ))}
      </section>
    </>
  );
}
