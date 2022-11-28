<template>
    <div>
        <b-navbar-nav>
        <b-nav-item v-if="user?.roles?.includes('student')" href="/student">I want to go to student's screen</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('professor')" href="/professor">I want to go to professor </b-nav-item>
        <!-- <b-nav-item v-if="user?.name == null" href="/api/login">Login</b-nav-item>
        <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" /> -->
      </b-navbar-nav>
    <router-view/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'

const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}
</script>