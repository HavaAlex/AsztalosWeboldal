<script setup lang="ts">
import {ref} from "vue";
import type { ChangePasswordData,ChangeUserNameData } from "@/api/auth";
import { useChangePassword,useChangeUsername } from "@/api/userQuery";

const { mutate: ChangePassword } = useChangePassword();
const { mutate: ChangeUserName } = useChangeUsername()
const changePasswordData = ref<ChangePasswordData>({
    userName:'',
    currentPassword:'',
    currentPasswordAgain:'',
    newPassword:''
})

const changeUserNameData = ref<ChangeUserNameData>({
    currentUserName:'',
    newUserName:'',
    password:''
})


const showPassword = ref(false)

const showCurrentPassword = ref(false);
const showCurrentPasswordAgain = ref(false);
const newPassword = ref(false);


const confirmNameChangeDialog = ref(false)
const confirmPasswordChangeDialog = ref(false)
</script>

<template>
    <v-card style="margin-top: 15vh; width: 75vw;">
        <v-card-title>
            Fiókműveletek
        </v-card-title>
        <v-card-text>

        
            <v-card color="background">
                <v-card-title>Felhasználónév változtatás</v-card-title>
                <v-card-text>
                    <v-text-field label="Jelenlegi felhasználónév" v-model="changeUserNameData.currentUserName">

                    </v-text-field>
                    <v-text-field label="Új felhasználónév" v-model="changeUserNameData.newUserName">

                    </v-text-field>
                    <v-text-field label="Jelszó" v-model="changeUserNameData.password"  :type="showPassword ? 'text' : 'password'" variant="outlined" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showPassword =! showPassword">

                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn style="background-color: #5592FC; color:white" @click="confirmNameChangeDialog = true">Módosítás</v-btn>
                    <v-btn style="background-color: #ff0000; color:white" @click="changeUserNameData.currentUserName='';changeUserNameData.newUserName='';changeUserNameData.password='';">Visszaállítás</v-btn>
                </v-card-actions>
            </v-card>
            <br>
            <v-card color="background" >
                <v-card-title>Jelszóváltoztatás</v-card-title>
                <v-card-text>
                    <v-text-field label="Jelenlegi felhasznalónév"  v-model="changePasswordData.userName"></v-text-field>
                    <v-text-field label="Jelenlegi jelszó" v-model="changePasswordData.currentPassword":type="showCurrentPassword ? 'text' : 'password'" variant="outlined" :append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showCurrentPassword =! showCurrentPassword">

                    </v-text-field>
                    <v-text-field label="Jelenlegi jelszó újra" v-model="changePasswordData.currentPasswordAgain" :type="showCurrentPasswordAgain ? 'text' : 'password'" variant="outlined" :append-icon="showCurrentPasswordAgain ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showCurrentPasswordAgain =! showCurrentPasswordAgain">

                    </v-text-field>
                    <v-text-field label="Új jelszó" v-model="changePasswordData.newPassword" :type="newPassword ? 'text' : 'password'" variant="outlined" :append-icon="newPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="newPassword =! newPassword">

                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn style="background-color: #5592FC; color:white" @click="confirmPasswordChangeDialog = true;">Módosítás</v-btn>
                    <v-btn style="background-color: #ff0000; color:white" 
                    @click="changePasswordData.userName=''; changePasswordData.currentPassword=''; 
                            changePasswordData.currentPasswordAgain=''; changePasswordData.newPassword='';">
                            Visszaállítás</v-btn>
                </v-card-actions>
            </v-card>
        </v-card-text>
    </v-card>
    <v-dialog v-model="confirmNameChangeDialog">
        <v-card style="width: 50vw; margin: 0 auto;">
            <v-card-title>
                Biztos megváltoztatod a felhasználóneved?
            </v-card-title>
            <v-card-text>
                Ha megváltoztatod, az oldal automatikusan kijelenkeztet. Az új, módosított adatokkal tudsz csak visszalépni.
            </v-card-text>
            <v-card-actions>
                <v-btn style="background-color: #ff0000; color:white" @click="confirmNameChangeDialog=false">Mégse</v-btn>
                <v-btn style="background-color: #5592FC; color:white" @click="ChangeUserName(changeUserNameData)">Megváltoztatás</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="confirmPasswordChangeDialog">
        <v-card style="width: 50vw; margin: 0 auto;">
            <v-card-title>
                Biztos megváltoztatod a jelszavad?
            </v-card-title>
            <v-card-text>
                Ha megváltoztatod, az oldal automatikusan kijelenkeztet. Az új, módosított adatokkal tudsz csak visszalépni.
            </v-card-text>
            <v-card-actions>
                <v-btn style="background-color: #ff0000; color:white" @click="confirmPasswordChangeDialog=false">Mégse</v-btn>
                <v-btn style="background-color: #5592FC; color:white" @click="ChangePassword(changePasswordData)">Megváltoztatás</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
