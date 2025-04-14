'use client';
import React, { useEffect, useRef } from 'react';
import MessageInput from './MessageInput';

const ChatWindow = ({ currentUserId, selectedUser, messages, onSendMessage }) => {
  console.log(messages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return <div className="chat-window">Select a chat to start messaging</div>;
  }

  // Get messages for current conversation
  const conversationMessages = messages[selectedUser._id] || [];

  return (
    <div className="chat-window">
      <div className="messages">
        <h4>Chat with {selectedUser.username || selectedUser._id}</h4>

        {conversationMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.from === currentUserId ? 'sent' : 'received'}`}
          >
            <strong>
              {msg.from === currentUserId ? 'You' : selectedUser.username || 'Them'}:
            </strong>{' '}
            {msg.text}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
