<script setup lang="ts">
import type { LoginData } from '@/api/auth';
import { useLogin } from '@/api/authQuery';
import { ref ,onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
 

const LoginDataRef = ref<LoginData>({
    username: '',
    password:''
})
const Router = useRouter()
const { mutate: login, isPending} = useLogin()

const showPassword = ref(false);
</script>

<template>
    <v-card style="width: 75vw;" color="secondary">
        <v-card-title>Bejelentkezés</v-card-title>
        <v-card-text>
            <v-text-field color="primary" v-model="LoginDataRef.username" placeholder="Felhasználónév" variant="outlined"></v-text-field>
            <v-text-field color="primary" v-model="LoginDataRef.password" placeholder="Jelszó" :type="showPassword ? 'text' : 'password'" variant="outlined" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showPassword = !showPassword"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn class="loginbtn" style="background-color: #4f54eb; color:white" @click="() => {
                login(LoginDataRef)
            }" :loading="isPending"> 
                Bejelentkezés
                
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
