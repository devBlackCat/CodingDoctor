<template>
  <div class="registration-container">
    <h2>회원가입</h2>
    <form @submit.prevent="register">
      <input type="email" v-model="email" placeholder="이메일" @blur="validateEmail" />
      <span v-if="emailError" class="error-message">유효한 이메일 주소를 입력해주세요.</span>
      <input type="password" v-model="password" placeholder="비밀번호" @blur="validatePassword" />
      <span v-if="passwordError"  class="error-message">비밀번호는 최소 8자 이상이어야 합니다.</span>


      <button type="button" @click="sendVerificationEmail" class="verification-button">이메일 인증 보내기</button>
 
    </form>
  </div>
</template>

<script>
/* global grecaptcha */
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import router from '@/router';

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
      // 이메일 형식 검증
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = !re.test(this.email);
      return this.emailError;
    },
    validatePassword() {
      // 비밀번호 길이 검증
      this.passwordError = this.password.length < 8;
      return this.passwordError;
    }
    ,
    sendVerificationEmail() {
      if (this.validateEmail()) {
        alert('유효한 이메일 주소를 입력해주세요.');
        return;
      }
      if (this.validatePassword()) {
        alert('비밀번호는 최소 8자 이상이어야 합니다.');
        return;
      }

      
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // 사용자 생성 성공, 이메일 인증 메일 보내기
          sendEmailVerification(userCredential.user)
            .then(() => {
              alert('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
              // /페이지로 이동
              router.push('/');
            });
        })
        .catch((error) => {
          console.error('회원가입 실패', error);
          alert(error.message);
        });
    },

    async register() {
     
    
      if (this.email && this.password && !this.emailError && !this.passwordError) {
        if (typeof grecaptcha !== 'undefined') {
          grecaptcha.enterprise.ready(async () => {
            const token = await grecaptcha.enterprise.execute('API KEY', { action: 'submit' });
            this.registerWithRecaptchaToken(token);
          });
        } else {
          alert("reCAPTCHA 로드 실패. 페이지를 새로고침 해주세요.");
        }
      } else {
        alert("입력된 정보를 다시 확인해주세요.");
      }
    },
    
  },
 
};
</script>
<style scoped>
/* 기본 바디 설정으로 패딩과 마진을 초기화하고 폰트 설정 */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
}
main{
  position: relative;
}

/* 폼을 감싸는 div에 대한 스타일 */
.registration-container{
  width: 100%;
  max-width: 400px; /* 최대 너비 설정 */
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 간단한 그림자 효과 */
  border-radius: 8px; /* 모서리 둥글게 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%); /* 가운데 정렬 */
  z-index: 1;
}

.registration-container h2 {
  text-align: center; /* 제목 중앙 정렬 */
  color: #333;
}

/* 모든 입력 필드에 대한 스타일 */
input[type="email"],
input[type="password"] {
  width: 100%; /* 너비 100% 설정 */
  padding: 10px; /* 패딩 설정 */
  margin-bottom: 20px; /* 마진 설정 */
  border: 1px solid #ccc; /* 테두리 설정 */
  border-radius: 5px; /* 모서리 둥글게 */
  box-sizing: border-box; /* 박스 사이징 방식 변경 */
}

/* 인증 버튼 스타일 */
.verification-button{
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff; /* 부트스트랩의 기본 파란색 사용 */
  color: white;
  font-size: 16px;
  cursor: pointer; /* 클릭 가능한 요소임을 나타내는 커서 스타일 */
  border-radius: 5px; /* 모서리 둥글게 */
}

.verification-button:hover {
  background-color: #0056b3; /* 호버 시 색상 변경 */
}

/* 에러 메시지 스타일 */
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
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 1rem;
  }
}

/* 모바일 환경에서 보기 좋게 조정 */
@media (max-width: 767px) {
  .registration-container {
    width: 90%; /* 화면의 90%를 차지하도록 조정 */
    max-width: none; /* 최대 너비 설정을 해제 */
    padding: 15px; /* 모바일 환경에서는 패딩을 약간 줄임 */
    margin:20px auto; /* 가운데 정렬 */
    transform: none; /* 변환 제거 */
    position: static; /* 위치 설정 제거 */
  }
}
/* 태블릿 크기 */
@media (min-width: 768px) and (max-width: 1023px) {
  html {
    font-size: 16px;
  }
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 0.9rem;
  }
}

/* 큰 모바일 크기 */
@media (min-width: 480px) and (max-width: 767px) {
  html {
    font-size: 14px;
  }
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 0.8rem;
  }
}

/* 보통 모바일 크기 */
@media (min-width: 320px) and (max-width: 479px) {
  html {
    font-size: 12px;
  }
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 0.7rem;
  }
}

/* 작은 모바일 크기 */
@media (max-width: 319px) {
  html {
    font-size: 10px;
  }
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 0.6rem;
  }
}

/* 워치 크기 */
@media (max-width: 200px) {
  html {
    font-size: 8px;
  }
  .registration-container, input[type="email"], input[type="password"], .verification-button {
    padding: 0.5rem;
  }
}

</style>