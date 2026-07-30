<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useCookieHandler } from '@/stores/cookieHandler';
import { jwtDecode } from 'jwt-decode';
import { ref ,onMounted, onUnmounted,onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { useErrorHandler } from '@/stores/errorHandler';
const Router = useRouter()
const { push } =useRouter();
const cookieHandler = useCookieHandler()
const { time } = storeToRefs(cookieHandler);


import { useTheme } from 'vuetify'


const theme = useTheme()


function toggleTheme() {
  const isDark = theme.global.current.value.dark
  theme.change(isDark ? 'themeLight' : 'themeDark')
}

const cookieStatus = cookieHandler.hasValidCookie()
if (cookieStatus == true){

  const token = cookieHandler.getCookie("alap")
  if (token) {
    jwtDecode(token)
  }
 
  Router.push({name: 'adminposts'})
}
else{
  Router.push({name:"login"})
}
/*
onUpdated(()=>{
  const cookieStatus =  cookieHandler.hasValidCookie()
  if (cookieStatus == false){
    Router.push({name:"login"})
    useErrorHandler().setError(new Error("Süti lejárt!"))
    cookieHandler.resetTimer()
  }
  else if(cookieStatus == true){
    Router.push({name: 'adminposts'})
    cookieHandler.startTimer();
  }
})*/
onMounted(() => {
  const cookieStatus = cookieHandler.hasValidCookie()

  if (!cookieStatus) {
    useErrorHandler().setError(new Error("Süti lejárt!"))
    Router.push({ name: "login" })
    return
  }

  // valid cookie → start the countdown
  cookieHandler.startTimer()
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  theme.change(prefersDark ? 'themeDark' : 'themeLight')
})


const route = useRoute()

</script>

<template>

  
    <v-layout class="rounded rounded-md">
      <v-app-bar class="appnavbar bg-secondary"
        flat
      >
      
      <v-btn @click="push({name:'adminposts'})">
        Bejegyzések
      </v-btn>
      <v-btn @click="push({name:'admincategories'})">
        Kategóriák
      </v-btn>
      <!--<v-btn @click="push({name:'admingallery'})">
        Galéria
      </v-btn>-->
      <v-btn @click="push({name:'adminuser'})">
        Fiókműveletek
      </v-btn>
      <v-spacer></v-spacer>
      <v-switch class="switch" @change="toggleTheme" hide-details
            inset  :label="theme.global.current.value.dark ? 'Sötét mód' : 'Világos mód'">  </v-switch>
      <v-tooltip text="Ennyi idő múlva automatikusan kijelentkezel">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">{{ time }}</v-btn>
        </template>
      </v-tooltip>

      <v-btn @click="cookieHandler.deleteCookie('alap'); Router.push({ name: 'login' })">
        Kilépés
      </v-btn>
    </v-app-bar>
    <!--
    <v-app-bar height="fit-content" location="bottom" flat>
      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} - <strong>A te otthonod</strong>
      </v-col>
    </v-app-bar>-->
    <RouterView>
    
    </RouterView>
  </v-layout>




  </template>
<style lang="css">
.adminpanel{
  width: 80vw !important;
  max-height: 20vw !important;
  align-items: center !important;
  overflow-y: auto;
}
.adminpanel .v-card-text{
  max-height: 20vw !important;
  overflow-y: auto;
}  
</style>