export const getSender = (loggedUser, users) => {
  if (Array.isArray(users) && users.length >= 2 && loggedUser) {
    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) return; // Return some message if user is deleted
    return user1._id === loggedUser._id ? user2.username : user1.username;
  }
  return;
};

export const getSenderFull = (loggedUser, user) => {
  if (!user || !loggedUser) return null; // Handle null cases
  return user[0]._id === loggedUser._id ? user[1] : user[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ) {
    return 0;
  }

  return "auto";
};

export const isSameUser = () => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
