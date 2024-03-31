<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login" >
      <input type="email" v-model="email" placeholder="이메일" class="input-field" @blur="validateEmail" />
      <span v-if="emailError" class="error-message">유효한 이메일 주소를 입력해주세요.</span>
      <input type="password" v-model="password" placeholder="비밀번호" class="input-field" @blur="validatePassword" />
      <span v-if="passwordError"  class="error-message">비밀번호는 최소 8자 이상이어야 합니다.</span>

      <div id="recaptcha-container"></div>
      <button type="submit" class="login-button">로그인</button>
      <router-link to="/register" class="register-link">회원가입</router-link>
    </form>
  </div>
</template>

<script>
/* global grecaptcha */
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: false,
      passwordError: false
    };
  },
  methods: {
    validateEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = !re.test(this.email);
    },
    validatePassword() {
      this.passwordError = this.password.length < 8;
    },
    async login() {
      this.validateEmail();
      this.validatePassword();

      if (this.emailError || this.passwordError) {
        alert("유효하지 않은 이메일 또는 비밀번호입니다.");
        return;
      }

      const auth = getAuth();
      try {
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;

      // 문서 존재 여부 확인
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // 문서가 존재하지 않는 경우에만 새 문서 생성
      if (!docSnap.exists()) {
        await setDoc(docRef, {});
      }

      alert("로그인 성공!");
      router.push('/quiz'); // 퀴즈 페이지로 리다이렉션
    } catch (error) {
      console.error('로그인 실패:', error);
      //if Firebase: Error (auth/invalid-credential). 라면 '로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.'로 변경
      if (error.code === 'auth/invalid-credential') {
        alert('로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
    }
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

/* eslint-disable-next-line no-unused-vars */
function onRecaptchaLoad() {
  grecaptcha.render('recaptcha-container', {
    'sitekey' : '6Le9aagpAAAAAIMJ6i9w8Xa24Ah2rPrfBc0v9Y1C',
    'callback' : onRecaptchaSuccess
  });
}


function onRecaptchaSuccess(token) {
  console.log('reCAPTCHA success:', token);
  // 토큰을 사용하여 로그인 폼 제출 또는 추가 검증을 수행할 수 있습니다.
}
</script>

<style scoped>
/* 로그인 컨테이너 스타일, 회원가입 섹션과 유사하게 설정 */
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.login-container h2 {
  text-align: center;
  color: #333;
}

/* 입력 필드 스타일, 회원가입 섹션과 유사 */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* 로그인 버튼 스타일, 인증 버튼과 유사하지만 다른 클래스 사용 */
.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.login-button:hover {
  background-color: #0056b3;
}

/* 회원가입 링크 스타일 */
.register-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #007bff;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  text-decoration: none;
}
.register-link:hover {
  background-color: white;
  opacity: 0.6;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
.error-message {
  display: block; /* span을 블록 요소로 변경 */
  margin-bottom: 20px; /* 마진 설정 */
  color: red; /* 빨간색으로 표시 */
}

/* 노트북 크기 */
@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 1rem;
  }
}
/* 모바일 환경에서 보기 좋게 조정 */
@media (max-width: 767px) {
  .login-container{
    width: 90%; /* 화면의 90%를 차지하도록 조정 */
    max-width: none; /* 최대 너비 설정을 해제 */
    padding: 15px; /* 모바일 환경에서는 패딩을 약간 줄임 */
    margin:20px auto; /* 상단 여백을 20px로 설정하고 자동으로 가운데 정렬 */
    transform: none; /* 변환 제거 */
    position: static; /* 위치 설정 제거 */
  }
}
/* 태블릿 크기 */
@media (min-width: 768px) and (max-width: 1023px) {
  html {
    font-size: 16px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 0.9rem;
  }
}

/* 큰 모바일 크기 */
@media (min-width: 480px) and (max-width: 767px) {
  html {
    font-size: 14px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 0.8rem;
  }
}

/* 보통 모바일 크기 */
@media (min-width: 320px) and (max-width: 479px) {
  html {
    font-size: 12px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 0.7rem;
  }
}

/* 작은 모바일 크기 */
@media (max-width: 319px) {
  html {
    font-size: 10px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 0.6rem;
  }
}

/* 워치 크기 */
@media (max-width: 200px) {
  html {
    font-size: 8px;
  }
  .login-container, .input-field, .login-button, .register-link {
    padding: 0.5rem;
  }
}

</style>
