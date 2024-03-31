<!-- /src/components/HeaderComponent.vue -->
<template>
  <header class="header">
    <p class="navigation">{{ currentPageName }}</p>
    <nav>
      <!-- 네비게이션 링크에 조건부 class="active" 추가 -->
      <router-link :to="{ name: 'Quiz' }" :class="{ active: currentRoute.name === 'Quiz' }">퀴즈</router-link> |
      <router-link :to="{ name: 'MyPage' }" :class="{ active: currentRoute.name === 'MyPage' }">마이페이지</router-link> |
      <router-link to="/logout">로그아웃</router-link>
    </nav>
  </header>
</template>


<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'HeaderComponent',
  setup() {
    const currentRoute = useRoute();


    const currentPageName = computed(() => {
      switch (currentRoute.name) {
        case 'Quiz': // 'quiz'가 아닌 'Quiz'로 변경
          return '퀴즈';
        case 'MyPage': // 'mypage'가 아닌 'MyPage'로 변경
          return '마이페이지';
        default:
          return '';
      }
    });


    return {
      currentRoute,
      currentPageName
    };
  }
}
</script>

<style scoped>
.header {
  
  position: sticky;
  top: 0;
  z-index: 1000; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin:5px 0;
 
}
.header p{
  margin:0; 
  width:fit-content;
  padding: 15px;
  font-weight: bold;
  font-size: 1.2rem;
}
.header nav {
  display: flex;
  justify-content: center;
  align-items: center;
 
}

.header nav a {
  color: #007bff;
  text-decoration: none; 
  margin: 0 10px;
  border-radius: 5px; 
  text-align: center;
  padding: 15px 0;
  width: 140px;
}

.header nav a:hover {
  background-color: #007bff;
color:#fff;
}

.header nav a.active {
background-color: #007bff;
color:#fff;

}
.header nav a.active:hover {
background-color: #0056b3;
}
/* 태블릿 크기 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header p {
    padding: 10px;
    font-size: 1rem;
  }

  .header nav {
    width: 100%;
  }
  .navigation{
    display:none;
  }
}



/* 작은 모바일 크기 */
@media (max-width: 480px) {
  .header nav a{
    width: calc(33% - 3px);
    font-size: 0.8rem;
  }
}
/* 워치 화면 크기 */
@media (max-width: 319px) {
  .header nav a{
    width: calc(33% - 3px);
    font-size: 0.8rem;
    margin: 0;
  }
  nav{font-size:0}
  .quiz-container{
    width: calc(100% - 5px);
  }
}

</style>
