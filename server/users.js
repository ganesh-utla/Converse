let users = [];

const addUser = ({ id, name, roomId }) => {
  name = name.toLowerCase().split(' ').join('_');
  roomId = roomId.trim().toLowerCase();

  const existingUser = users.find((user) => user.roomId === roomId && user.name === name);

  if(!name || !roomId) return { error: 'Username and roomId are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, roomId };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const user = getUser(id);
  if (user) {
    users = users.filter(user => user.id !== id);
  }
  return user;
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };