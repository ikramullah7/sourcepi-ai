import { NextMessageInput } from '@/components/message-input/next';
import MessageItem from '@/components/message-item';
import PdfSheet from '@/components/pdf-drawer';
import { useClickDrawer } from '@/components/pdf-drawer/hooks';
import { MessageType } from '@/constants/chat';
import { useFetchChat, useGetChatSearchParams } from '@/hooks/use-chat-request';
import { useFetchUserInfo } from '@/hooks/use-user-setting-request';
import { IClientConversation } from '@/interfaces/database/chat';
import { buildMessageUuidWithRole } from '@/utils/chat';
import { useEffect } from 'react';
import {
  AnswerSources,
  MobileAnswerSources,
  getCitedSources,
} from '@/components/answer-sources';
import {
  useGetSendButtonDisabled,
  useSendButtonDisabled,
} from '../../hooks/use-button-disabled';
import { useCreateConversationBeforeUploadDocument } from '../../hooks/use-create-conversation';
import { useSendMessage } from '../../hooks/use-send-chat-message';
import { useMessageReferences } from '../../hooks/use-message-references';
import { EmptyReference } from '../../utils';
import { useShowInternet } from '../use-show-internet';

interface IProps {
  conversation: IClientConversation;
}

export function SingleChatBox({ conversation }: IProps) {
  const {
    value,
    scrollRef,
    messageContainerRef,
    sendLoading,
    messages,
    isUploading,
    handleInputChange,
    handlePressEnter,
    regenerateMessage,
    removeMessageById,
    handleUploadFile,
    removeFile,
    hydrateFromServer,
    stopOutputMessage,
  } = useSendMessage();
  const { data: userInfo } = useFetchUserInfo();
  const { data: currentDialog } = useFetchChat();
  const { createConversationBeforeUploadDocument } =
    useCreateConversationBeforeUploadDocument();
  const { conversationId } = useGetChatSearchParams();
  const disabled = useGetSendButtonDisabled();
  const sendDisabled = useSendButtonDisabled(value);
  const { visible, hideModal, documentId, selectedChunk, clickDocumentButton } =
    useClickDrawer();

  const showInternet = useShowInternet();

  const messageReferences = useMessageReferences(
    messages,
    conversation.id === conversationId ? conversation.reference : undefined,
  );
  const latestAnswer = messages
    ?.slice()
    .reverse()
    .find((message) => message.role === MessageType.Assistant);
  const latestReference = latestAnswer
    ? messageReferences.get(latestAnswer)
    : undefined;
  const sources = getCitedSources(
    latestAnswer?.content ?? '',
    latestReference?.chunks ?? [],
  );

  useEffect(() => {
    // Skip when the conversation prop is stale — its id doesn't match the
    // URL's current conversationId. This happens during a switch (e.g.
    // clicking "+" to create a new session): child effects fire before the
    // parent's clear/load effect, so for one render the prop still holds the
    // previous conversation's messages. Applying them here would leak the old
    // conversation's content into the newly switched (or new) conversation.
    if (conversation?.id && conversation.id !== conversationId) return;

    const messages = conversation?.messages;
    if (Array.isArray(messages)) {
      // hydrateFromServer is a no-op while a stream is in flight, and rejects a
      // server list shorter than the local one, so it can never truncate an
      // answer the server hasn't persisted yet.
      hydrateFromServer(conversationId, messages);
    }
  }, [
    conversation?.messages,
    conversation?.id,
    conversationId,
    hydrateFromServer,
  ]);

  return (
    <section className="aw-chat-layout" data-has-sources={sources.length > 0}>
      <div className="flex min-w-0 min-h-0 flex-col">
        <MobileAnswerSources sources={sources} onOpen={clickDocumentButton} />
        <div
          ref={messageContainerRef}
          className="p-4 sm:p-6 flex-1 overflow-auto min-h-0 scrollbar-auto"
        >
          <div className="aw-chat-transcript">
            {messages?.map((message, i) => (
              <MessageItem
                loading={
                  message.role === MessageType.Assistant &&
                  sendLoading &&
                  messages.length - 1 === i
                }
                key={buildMessageUuidWithRole(message)}
                item={message}
                nickname={userInfo.nickname}
                avatar={userInfo.avatar}
                avatarDialog={currentDialog.icon}
                reference={messageReferences.get(message) ?? EmptyReference}
                clickDocumentButton={clickDocumentButton}
                index={i}
                isLast={i === messages.length - 1}
                removeMessageById={removeMessageById}
                deleteDisabled={message.awaitingServerId}
                regenerateMessage={regenerateMessage}
                sendLoading={sendLoading}
              />
            ))}
          </div>
          <div ref={scrollRef} />
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="aw-chat-composer">
            <NextMessageInput
              disabled={disabled}
              sendDisabled={sendDisabled}
              sendLoading={sendLoading}
              value={value}
              resize="vertical"
              onInputChange={handleInputChange}
              onPressEnter={handlePressEnter}
              conversationId={conversationId}
              createConversationBeforeUploadDocument={
                createConversationBeforeUploadDocument
              }
              stopOutputMessage={stopOutputMessage}
              onUpload={handleUploadFile}
              isUploading={isUploading}
              removeFile={removeFile}
              showReasoning
              showInternet={showInternet}
            />
          </div>
          {visible && (
            <PdfSheet
              visible={visible}
              hideModal={hideModal}
              documentId={documentId}
              chunk={selectedChunk}
            ></PdfSheet>
          )}
        </div>
      </div>
      <AnswerSources sources={sources} onOpen={clickDocumentButton} />
    </section>
  );
}
