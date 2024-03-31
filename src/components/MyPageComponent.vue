<template>
  <HeaderComponent />
  <section class="container">
    <hgroup>
      <h2>마이페이지</h2>
      <h3>회원 정보 관리</h3>
    </hgroup>
    <div class="user-actions">
      <button class="button" @click="deleteAccount">회원 탈퇴</button>
      <button class="button" @click="changePassword">비밀번호 변경</button>
    </div>
    <div class="login-records">
      <h3>유저 점수 기록</h3>
      <p v-for="(record, index) in userScores" :key="index">
         총문제 : {{ record.maxQuestions}}개 <br>정답 : {{ record.score }}개 <br>날짜 :  {{ record.dateValue }}
      </p>
    </div>
  </section>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue';
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, deleteUser, sendPasswordResetEmail } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
//import {  deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from './useAuth'
export default {
  name: 'MyPageComponent',
  components: {
    HeaderComponent
  },

 

  setup() {
    useAuth(); 
    const userScores = ref([]);

    onMounted(() => {
      const auth = getAuth();
      
      // 인증 상태 변화 감지
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            userScores.value = []; // 기존 데이터 초기화
            for (const [key, value] of Object.entries(userData)) {
              if (typeof value === 'object' && value !== null && value.timestamp) {
                userScores.value.push({
                  date: key,
                  score: value.score,
                  maxQuestions: value.maxQuestions,
                  dateValue: value.timestamp.toDate().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZone: 'Asia/Seoul'
                  })
                });
              }
            }
          }
        } 
      });
    });

    return {
      userScores
    };
  },

  methods: {
    async deleteAccount() {
      try {
        const auth = getAuth();
        await deleteUser(auth.currentUser);
        alert('계정이 성공적으로 삭제되었습니다.');
        // 로그인 페이지 또는 홈으로 리디렉션 할 수 있음
      } catch (error) {
        console.error('계정 삭제 중 오류 발생:', error);
        alert('계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    changePassword() {
      const auth = getAuth();
      const user = auth.currentUser;
      sendPasswordResetEmail(auth, user.email).then(() => {
        alert('비밀번호 재설정 이메일을 성공적으로 보냈습니다.');
      }).catch((error) => {
        console.error('비밀번호 재설정 이메일 전송 오류:', error);
        alert('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
    }
  }
};
</script>

  <style scoped>
 
.container {
  max-width: 1130px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
}
hgroup{
  margin: 2rem 0;
 

}
hgroup h2{
  color: #24333e;
  font-size: 2.5rem;
  margin:0; 
}
hgroup h3{
  color: hsl(205, 10%, 50%);
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 20px;
  margin:0; 
}
.user-actions button{
  margin-right: 10px;
}
.login-records{
  margin-top: 2.5rem;

}
.login-records h3{
  color: #24333e;
  font-size: 2rem;
  margin:0; 
}
.login-records p{
  font-size: 1.4rem;
}
.button{
background-color: #007bff;
color:#fff;
padding: 20px;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 1.1rem;
max-width: 220px;
width: 100%;
}
.button:hover{
  background-color: #0056b3;
}

/* Laptops */
@media (min-width: 1024px) {
  .container {
    padding: 0 20px;
  }
  .user-actions button, .login-records p {
    padding: 1rem;
    font-size: 1.1rem;
  }
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 15px;
  }
  .user-actions button, .login-records p {
    padding: 0.9rem;
    font-size: 1rem;
  }
}

/* Large Mobiles */
@media (min-width: 480px) and (max-width: 767px) {
  .container {
    padding: 0 10px;
  }
  .user-actions button, .login-records p {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px){
  .user-actions{
    display: flex;
    flex-direction: row;
  }
}

/* Medium Mobiles */
@media (min-width: 320px) and (max-width: 479px) {
  .container {
    padding: 0 5px;
  }
  .user-actions button {
    padding: 0.7rem;
    font-size: 0.8rem;
  }
  .login-records p {
    font-size: 0.8rem;
  }
}

/* Small Mobiles */
@media (max-width: 319px) {
  .container {
    padding: 0 2px;
  }
  .user-actions {
    flex-direction: column;
  }
  .user-actions button {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.7rem;
    margin-bottom: 10px;
  }
  .user-actions button:last-child {
    margin-bottom:0;
  }
  .login-records p {
    font-size: 0.7rem;
  }
 
}

/* Watches */
@media (max-width: 200px) {
  .container {
    padding: 0 1px;
  }
  .user-actions button {
    padding: 0.5rem;
    font-size: 0.6rem;
  }
  .login-records p {
    font-size: 0.6rem;
  }
}


</style>