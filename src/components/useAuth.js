// useAuth.js 파일
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const auth = getAuth();
  const isLoggingOut = ref(false); // 로그아웃 중 상태를 추적하는 ref 생성
  let unsubscribe; // 리스너 해제 함수를 저장할 변수

  watch(isLoggingOut, (newValue) => {
    if (newValue === false) {
      // 로그아웃 과정이 완료되면 리스너를 재설정하거나 다른 처리를 수행
    }
  });

  onMounted(() => {
    unsubscribe = auth.onAuthStateChanged(user => {
      if (!user && !isLoggingOut.value) { // 로그아웃 중이 아닐 때만 리다이렉션 실행
        alert('로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.');
        router.push('/');
      }
    });
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return { isLoggingOut }; // isLoggingOut 상태를 반환하여 외부에서 접근 가능하게 함
}
