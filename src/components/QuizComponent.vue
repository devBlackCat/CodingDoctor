<template>
  <HeaderComponent />
  <div class="quiz-container">

    <div class="category-selection">
      개발 요소 : 
      <label for="frontend"><input type="radio" id="frontend" value="frontend" v-model="selectedCategory" @change="fetchQuizzes"> 프론트엔드</label>
      <label for="backend"><input type="radio" id="backend" value="backend" v-model="selectedCategory" @change="fetchQuizzes"> 백엔드</label>
      <label for="server"><input type="radio" id="server" value="server" v-model="selectedCategory" @change="fetchQuizzes"> 서버</label>
      <label for="database"><input type="radio" id="database" value="database" v-model="selectedCategory" @change="fetchQuizzes"> 데이터베이스</label>
    </div>
   

    <div v-if="quizzes.length > 0 && quizzes[0]">
      <ul id="quiz-list">
        <li>
          <p class="question-number">문제 : {{ questionCount }}.</p>

          <div v-if="quizzes[0].question_type === 'multiple_choice'" class="multiple-choice">
            <p @click="checkAnswer($event)" data-num="1">{{ quizzes[0].choice1 }}</p>
            <p @click="checkAnswer($event)" data-num="2">{{ quizzes[0].choice2 }}</p>
            <p @click="checkAnswer($event)" data-num="3">{{ quizzes[0].choice3 }}</p>
            <p @click="checkAnswer($event)" data-num="4">{{ quizzes[0].choice4 }}</p>
            <p @click="checkAnswer($event)" data-num="5" v-if="quizzes[0].choice5">{{ quizzes[0].choice5 }}</p>
          </div>
          <div v-else-if="quizzes[0].question_type === 'image_test'" class="image-test">
            <img :src="quizzes[0].image_url" alt="Quiz image">
            <p @click="checkAnswer($event)" data-num="1">{{ quizzes[0].choice1 }}</p>
            <p @click="checkAnswer($event)" data-num="2">{{ quizzes[0].choice2 }}</p>
            <p @click="checkAnswer($event)" data-num="3">{{ quizzes[0].choice3 }}</p>
            <p @click="checkAnswer($event)" data-num="4">{{ quizzes[0].choice4 }}</p>
            <p @click="checkAnswer($event)" data-num="5" v-if="quizzes[0].choice5">{{ quizzes[0].choice5 }}</p>
          </div>
          <div v-else-if="quizzes[0].question_type === 'ox_problem'" class="ox-problem">
            <p @click="checkAnswer($event)" data-num="1">{{ quizzes[0].choice1 }}</p>
            <p @click="checkAnswer($event)" data-num="2">{{ quizzes[0].choice2 }}</p>
          </div>
        </li>
      </ul>
    </div>
   
    <div v-else class="no-quiz">
      <p>개발 요소를 선택해주세요.</p>
    </div>

  </div> 
</template>

<script>
import { useAuth } from './useAuth'
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import HeaderComponent from './HeaderComponent.vue';
import { serverTimestamp } from 'firebase/firestore';
export default {
  name: 'QuizComponent',
  components: {
    HeaderComponent
  },
  setup() {
    useAuth(); 
  },
  data() {
    return {
      score: 0,
      selectedCategory: null,
      questionCount: 1,
      quizzes: [],
      maxQuestions: 20
    };
  },
  methods: {
    async fetchQuizzes() {
      if (!this.selectedCategory) {
        alert('카테고리를 선택해주세요.');
        return;
      }
      const quizzesColRef = collection(db, this.selectedCategory.toLowerCase());
      const querySnapshot = await getDocs(quizzesColRef);
      
      if (querySnapshot.empty) {
        alert('선택한 카테고리에 문제가 없습니다.');
        return;
      }

      let quizzesArray = [];
      querySnapshot.forEach((doc) => {
        // 문서 데이터에 문서 ID를 .idx 키로 포함하여 저장합니다.
        const quizWithId = {
          ...doc.data(),
          idx: doc.id // 문서 ID를 .idx 키에 저장합니다.
        };
        quizzesArray.push(quizWithId);
      });
      console.log("Original data:", quizzesArray);

      const selectedQuizzes = this.randomizeQuizzes(quizzesArray, this.maxQuestions);
      console.log("Selected quizzes:", selectedQuizzes);
      this.quizzes = selectedQuizzes;
      //만약 selectedQuizzes 의 갯수가 this.maxQuestions 보다 작다면 this.maxQuestions 를 selectedQuizzes 의 갯수로 변경해라
      if (selectedQuizzes.length < this.maxQuestions) {
        this.maxQuestions = selectedQuizzes.length;
      }
    },

    randomizeQuizzes(quizzes, count) {
      const maxCount = Math.min(quizzes.length, count);
      return quizzes.sort(() => 0.5 - Math.random()).slice(0, maxCount);
    },

  async updateDocumentField(collectionName, docId, isCorrect) {
        const docRef = doc(db, collectionName, docId);

        try {
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            // 문서가 존재하지 않는 경우, 새 문서 생성
            await setDoc(docRef, {
              o: isCorrect ? 1 : 0,
              x: isCorrect ? 0 : 1
            });
          } else {
            // 문서가 존재하는 경우, 필드 업데이트
            await updateDoc(docRef, {
              o: isCorrect ? docSnap.data().o + 1 : docSnap.data().o,
              x: isCorrect ? docSnap.data().x : docSnap.data().x + 1
            });
          }
        } catch (error) {
          console.error("Error updating document:", error);
        }
    }
,
async checkAnswer(event) {
  const selectedChoice = parseInt(event.target.getAttribute('data-num'));
  const correctAnswer = this.quizzes[0].correct_answer;
  const questionId = this.quizzes[0].idx; // 문제의 idx 값
  const userId = getAuth().currentUser.uid; // 현재 로그인한 사용자의 UID

  if (correctAnswer === selectedChoice) {
    alert('정답입니다!');
    this.score++;
    await this.updateDocumentField('score', questionId, true); // 정답인 경우 score 컬렉션 업데이트
   
  } else {
    alert('틀렸습니다!');
    await this.updateDocumentField('score', questionId, false); // 틀린 경우 score 컬렉션 업데이트
   
  }
  // this.quizzes 배열에서 첫 번째 요소를 제거합니다. 제거하면 0번쨰 요소는 
  this.quizzes.shift();
  if (this.quizzes.length === 0) {
    alert(`모든 문제가 끝났습니다! 총 ${this.maxQuestions}문제 중 ${this.score}문제를 맞혔습니다.`);
    await this.updateUserScore(userId,this.maxQuestions,this.score);
    this.resetQuiz();
  }
},
resetQuiz() {
    // 예시: 스코어와 문제 관련 데이터를 초기화
    this.score = 0;
    this.selectedCategory = null;
    this.questionCount = 1;
    this.quizzes = [];

  },
  async updateScore(questionId, isCorrect) {
    const scoreDocRef = doc(db, 'score', questionId);

    try {
      const docSnap = await getDoc(scoreDocRef);

      if (!docSnap.exists()) {
        // 문서가 존재하지 않는 경우, 새 문서 생성
        await setDoc(scoreDocRef, {
          o: isCorrect ? 1 : 0,
          x: isCorrect ? 0 : 1
        });
      } else {
        // 문서가 존재하는 경우, 필드 업데이트
        await updateDoc(scoreDocRef, {
          o: isCorrect ? docSnap.data().o + 1 : docSnap.data().o,
          x: isCorrect ? docSnap.data().x : docSnap.data().x + 1
        });
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  },
  async updateUserScore(userId, maxQuestions, score) {
      const userScoreDocRef = doc(db, 'users', userId);

      try {
      //  const docSnap = await getDoc(userScoreDocRef);
        
        // 현재 날짜와 시간을 'YYYYMMDD_HHMMSS' 포맷으로 생성
        const now = new Date();
        const dateTimeFormat = now.toISOString().replace(/[-:]/g, '').replace('T', '_').substring(0, 15);

        // maxQuestions와 score를 포함하는 객체 생성
        const scoreData = {
          maxQuestions: maxQuestions,
          score: score,
          timestamp: serverTimestamp() // Firestore 서버 타임스탬프
        };

          await updateDoc(userScoreDocRef, {
            [dateTimeFormat]: scoreData
          });
        console.log("사용자 점수가 업데이트 되었습니다.");
      } catch (error) {
        console.error("사용자 점수 업데이트 중 오류 발생:", error);
      }
    }
}
};
</script>

<style scoped>
body{position: relative;}
.quiz-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-height: 300px;
  position: relative;

  margin-top: 12vh;

}
.category-selection {
  display: flex;
  align-items: center;
}
.no-quiz{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-size: 2.5rem;
  color: #333;
  width: 100%;
  text-align: center;
}


.quiz-container label {
  display: block;
  cursor: pointer;
  margin-right: 10px;
}

#quiz-list {
  list-style: none;
  padding: 0;
}

#quiz-list li {
  margin-bottom: 10px;
}

.question-number {
  font-weight: bold;
  color: #333;
}

.multiple-choice p, .image-test p, .ox-problem p {
  margin: 10px 0;
  padding: 10px;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.multiple-choice p:hover, .image-test p:hover, .ox-problem p:hover {
  background-color: #e9ecef;
}

.image-test img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* 추가된 스타일 */
.error-message {
  color: red;
  margin-bottom: 20px;
}

/* 로그인 페이지 스타일 참고 */
.input-field {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* 버튼 스타일은 로그인 버튼 스타일을 참고하여 조정 */
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
/* Laptops */
@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
  .quiz-container, .input-field, .login-button {
    padding: 1rem;
  }
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  html {
    font-size: 16px;
  }
  .quiz-container, .input-field, .login-button {
    padding: 0.9rem;
  }
}
@media (max-width: 620px){
  .category-selection[data-v-66f59a28] {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
  .no-quiz{
    position: unset;
    transform: unset;
    font-size: 2rem;
    word-break: keep-all;
  }
  
}

/* Large Mobiles */
@media (min-width: 480px) and (max-width: 767px) {
  html {
    font-size: 14px;
  }
  .quiz-container {
    width: 90%;
    max-width: none;
    padding: 15px;
    margin: 20px auto;
    transform: none;

  }
  .input-field, .login-button {
    padding: 0.8rem;
  }
}

/* Medium Mobiles */
@media (min-width: 320px) and (max-width: 479px) {
  html {
    font-size: 12px;
  }
  .quiz-container {
    width: 90%;
    max-width: none;
    padding: 15px;
    margin: 20px auto;
    transform: none;
    position: static;
  }
  .input-field, .login-button {
    padding: 0.7rem;
  }
}

/* Small Mobiles */
@media (max-width: 319px) {
  html {
    font-size: 10px;
  }
  .quiz-container {
    width: 90%;
    max-width: none;
    padding: 15px;
    margin: 20px auto;
    transform: none;
    position: static;
  }
  .input-field, .login-button {
    padding: 0.6rem;
  }
  .no-quiz{
    font-size: 1.5rem;
  }
}

/* Watches */
@media (max-width: 200px) {
  html {
    font-size: 8px;
  }
  .quiz-container {
    width: 90%;
    max-width: none;
    padding: 15px;
    margin: 20px auto;
    transform: none;
    position: static;
  }
  .input-field, .login-button {
    padding: 0.5rem;
  }
}
</style>