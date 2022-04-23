import { ref } from 'vue';
import type { User } from '../types';

const authUser = ref<User | null>(null);
const token = ref(sessionStorage.getItem('token'));

export function getAuthUser() {
  return authUser.value;
}

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
      const data = await res.json();
      authUser.value = data;
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
    authUser.value = data.user;
    sessionStorage.setItem('token', data.token);
    return token.value;
  } catch (e) {
    console.log(e);
  }
}
