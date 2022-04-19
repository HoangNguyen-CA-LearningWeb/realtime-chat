import { ref } from 'vue';

const authUser = ref('');
const token = ref(localStorage.getItem('token'));

export const useAuth = () => {
  function setAuthUser(user: string) {
    authUser.value = user;
  }
  return { authUser, token, setAuthUser };
};
