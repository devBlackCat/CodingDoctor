// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '@/components/LoginComponent.vue';
import RegisterComponent from '@/components/RegisterComponent.vue';
import QuizComponent from '@/components/QuizComponent.vue';
import OutComponent from '@/components/OutComponent.vue';
import MyPageComponent from '@/components/MyPageComponent.vue';
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  },
    {
        path: '/quiz',
        name: 'Quiz',
        component: QuizComponent
    }
,
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPageComponent
    }
,
    {
      path: '/logout',
      name: 'Out',
      component: OutComponent
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
