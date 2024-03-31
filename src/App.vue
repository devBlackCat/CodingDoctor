<template>
  <div id="app">

    <main>
      <router-view></router-view> <!-- 현재 라우트에 따라 컴포넌트를 동적으로 표시 -->
    </main>

  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* 전역 스타일을 여기에 정의할 수 있습니다 */
</style>
