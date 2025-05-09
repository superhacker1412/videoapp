import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/UseAuthStore';

const OnlineUsersList = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const onlineUsersData = useAuthStore((state) => state.onlineUsersData);
  const fetchOnlineUsersData = useAuthStore((state) => state.fetchOnlineUsersData);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (onlineUsers.length > 0 && !fetchedRef.current) {
      fetchOnlineUsersData(onlineUsers);
      fetchedRef.current = true;
    }
  }, [onlineUsers]);

  const filteredOnlineUsers = onlineUsersData.filter(
    (user) => user._id !== authUser?._id
  );

  return (
    <div>
      <h3>Online Users</h3>
      {filteredOnlineUsers.length === 0 ? (
        <p>No other users online.</p>
      ) : (
        <ul>
          {filteredOnlineUsers.map((user) => (
            <li key={user._id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnlineUsersList;
