'use client';
import React, { useEffect, useState } from 'react';

const Sidebar = ({ onUserSelect, selectedUser, currentUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/users?currentUserId=${currentUserId}`);
        const data = await res.json();
        console.log(data)
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (currentUserId) getUsers();
  }, [currentUserId]);

  return (
    <div className="sidebar">
      <h3>Chats</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onUserSelect(user)}
            style={{
              backgroundColor: selectedUser?._id === user._id ? '#ccc' : 'transparent',
            }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
