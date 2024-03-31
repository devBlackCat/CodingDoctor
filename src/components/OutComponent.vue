<template>
  <div class="registration-container">
    <!-- 로그아웃 관련 UI 요소들 -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

function useLogout() {
  const router = useRouter();
  const isLoggingOut = ref(false);

  async function logout() {
    const auth = getAuth();
    isLoggingOut.value = true;
    try {
      await signOut(auth);
      alert('로그아웃 되었습니다.');
      router.push('/');
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    } finally {
      isLoggingOut.value = false;
    }
  }

  return { logout, isLoggingOut };
}

export default {
  setup() {
    const { logout, isLoggingOut } = useLogout();

    onMounted(logout);

    return { isLoggingOut };
  },
};
</script>
<style>
/* 스타일 정의 */
</style>
