<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { defineComponent, ref , computed} from 'vue';
import {useRouter} from 'vue-router'

const router=useRouter();
const routerKey = computed(() => {
  return router.path + Math.random()
})
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <RouterView :key="routerKey"></RouterView>
</template>
