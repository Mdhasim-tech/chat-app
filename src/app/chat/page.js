'use client';
import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './components/chat.css';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log(currentUser);
    if (!currentUser?._id) return;

    setCurrentUserId(currentUser._id);

    const newSocket = io('http://localhost:5000');
    socketRef.current = newSocket;

    console.log('🔌 Connecting to socket...');

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      console.log('📡 Emitting join with ID:', currentUser._id);
      newSocket.emit('join', currentUser._id);
    });

    newSocket.on('receive-message', ({ from, text }) => {
      console.log('📥 Message received from server:', { from, text });

      if (!from || !text) {
        console.error('⚠️ Invalid message format received');
        return;
      }

      setChatHistory((prev) => {
        const updated = {
          ...prev,
          [from]: [...(prev[from] || []), { from, text }],
        };
        console.log('🔄 Updated chatHistory:', updated);
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
      console.log('🔌 Disconnected from socket');
    };
  }, []);

  // ✅ Log updated chatHistory when it changes
  useEffect(() => {
    console.log('🧠 Updated chatHistory:', chatHistory);
  }, [chatHistory]);

  const handleSendMessage = (user, message) => {
    console.log('📦 Selected user object:', user);
    if (!user?._id) return;

    // Update local chat history
    setChatHistory((prev) => ({
      ...prev,
      [user._id]: [...(prev[user._id] || []), { from: currentUserId, text: message }],
    }));

    // Emit message to server
    if (socketRef.current && socketRef.current.connected) {
      console.log('🚀 Sending message to userId:', user._id);
      socketRef.current.emit('send-message', {
        to: user._id,
        message,
      });
    } else {
      console.warn('⚠️ Socket not connected!');
    }
  };

  const handleUserSelect = (user) => {
    console.log('👤 User selected:', user);
    setSelectedUser(user);
  };

  return (
    <div className="chat-container">
      <Sidebar
        onUserSelect={handleUserSelect}
        selectedUser={selectedUser}
        currentUserId={currentUserId}
      />
      <ChatWindow
        currentUserId={currentUserId}
        selectedUser={selectedUser}
        messages={chatHistory}
        onSendMessage={(msg) => handleSendMessage(selectedUser, msg)}
      />
    </div>
  );
};

export default Chat;
