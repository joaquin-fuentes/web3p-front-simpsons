const STORAGE_KEY = "usuarios";

export function getUsers() {
  try {
    const datosLocalStorage = localStorage.getItem(STORAGE_KEY);
    const datos = JSON.parse(datosLocalStorage);
    return Array.isArray(datos) ? datos : [];
  } catch (err) {
    console.error("getUsers error:", err);
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("saveUsers error:", err);
  }
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function removeUserById(id) {
  const users = getUsers().filter((user) => user.id !== id);
  saveUsers(users);
}

export function clearAllUsers() {
  saveUsers([]);
}

export function getUserById(id) {
  return getUsers().find((user) => user.id === id);
}

export function updateUser(id, changes) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;

  if (changes.email) {
    const dup = users.some(
      (user) => user.email === changes.email && user.id !== id
    );
    if (dup) {
      const err = new Error("EMAIL_EXISTS");
      err.code = "EMAIL_EXISTS";
      throw err;
    }
  }

  users[index] = {
    ...users[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  saveUsers(users);
  return true;
}
