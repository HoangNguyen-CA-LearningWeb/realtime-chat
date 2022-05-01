import { ref } from 'vue';
import type { User } from '../types';

export const authUser = ref<User | null>(null);
const token = ref(sessionStorage.getItem('token'));

export function clearAuthUser() {
  authUser.value = null;
  sessionStorage.removeItem('token');
}

export async function loadUser() {
  try {
    if (token.value) {
      const res = await fetch('/api/users/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value,
        },
        method: 'GET',
      });
      const user = await res.json();
      authUser.value = initAPIUser(user);
      return token.value;
    }
  } catch (e) {
    token.value = null;
    sessionStorage.removeItem('token');
  }
}

export async function login(username: string, password: string) {
  try {
    const res = await fetch('/api/users/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();
    token.value = data.token;
    authUser.value = initAPIUser(data.user);
    sessionStorage.setItem('token', data.token);
    return token.value;
  } catch (e) {
    console.log(e);
  }
}

const initAPIUser = (u: {
  username: string;
  _id: string;
  connected: boolean;
}) => {
  if (
    u._id === undefined ||
    u.username === undefined ||
    u.connected === undefined
  )
    throw new Error('API User incorrect format');
  return {
    userID: u._id,
    connected: u.connected,
    username: u.username,
  };
};
