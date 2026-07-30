<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref ,onMounted, onUnmounted} from 'vue';
import ProfilePic from '@/assets/profile.jpg'


//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
  
});//itt ér véget

</script>

<template>

    <div v-if="isPortrait">
        <v-card class="textContainer" color="primary">
            <v-card-title class = "row">XYZ</v-card-title>
            <v-card-text>
                <v-row class="row">
                    <img :src="ProfilePic" class="imageContainer" style="border-radius: 50%;">
                </v-row>
                <v-row class="row">
                    <p class="textbox contact">
                        <v-icon icon="mdi-email"></v-icon> XYZ@gmail.com<br>
                        <v-icon icon="mdi-phone"></v-icon> 06 12 345 6789<br>
                        <v-icon icon="mdi-account-cash"></v-icon> Adózás típusa: KATA<br>
                    </p>
                </v-row>
                <v-row class="row" >
                    <p class="contact">
                    <v-icon icon="mdi-home"></v-icon><strong> Lakcím:</strong>
                    <iframe
                        width="100%"
                        height="400"
                        style="border:0"
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src="">
                    </iframe>
                    </p>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
    <div v-else>
        <v-card class="textContainer" color="primary">
            <v-card-title>XYZ</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <img :src="ProfilePic" class="imageContainer" style="border-radius: 15%;">
                    </v-col>
                    <v-col>
                        <p class="textbox contact">
                            <v-icon icon="mdi-email"></v-icon> XYZ@gmail.com<br>
                            <v-icon icon="mdi-phone"></v-icon> 06 12 345 6789<br>
                            <v-icon icon="mdi-account-cash"></v-icon> Adózás típusa: KATA<br>
                            <v-icon icon="mdi-home"></v-icon><strong>Lakcím:</strong>
                        </p>
                        
                            <iframe
                                width="100%"
                                height="450"
                                style="border:0"
                                loading="lazy"
                                allowfullscreen
                                referrerpolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d78463.80294006258!2d19.60164943946127!3d47.22555499538211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741763cc57dccf7%3A0x339fc38b08e59606!2sCegl%C3%A9dbercel%2C%202737!5e1!3m2!1shu!2shu!4v1785406964022!5m2!1shu!2shu">
                            ></iframe>
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>
    </div>
</template>
<style lang="css">

@media (orientation: landscape){
    .imageContainer{
        width: 30vw;
    }
    .textContainer{
        width: 80vw;
        margin-top: 5vw;
    }
    .contact{
        font-size: 5vh;
    }
}
@media (orientation: portrait) {
    .imageContainer{
        width: 30vw;
    }
    .textContainer{
        width: 100vw;
        margin-top: 20vw;
        margin-left: auto;
        margin-right: auto;
    }
    .row{
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
    }
    .contact{
        font-size: 5vh;
    }
}

</style>