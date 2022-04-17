import { ref } from 'vue';

const authUser = ref('');

export const useAuth = () => {
  function setAuthUser(user: string) {
    authUser.value = user;
  }
  return { authUser, setAuthUser };
};
