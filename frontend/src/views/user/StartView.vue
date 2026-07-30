<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Post } from '@/api/admin/post';
import { useGetCategories, useGetPosts,useGetPostsByNewest } from '@/api/siteQuery';
import { ref, onMounted, onUnmounted,computed } from 'vue';
import arrowRight from '@/icons/arrow_right.png'
import arrowLeft from '@/icons/arrow_left.png'
import Thumbnail from '@/assets/start_image.jpg'
import woodTexture_Light from '@/assets/woodtexture_light.jpg'
import woodTexture_Dark from '@/assets/woodtexture_dark.jpg'
import { useTheme } from 'vuetify'

const theme = useTheme()

const postBackground = computed(() => {
    return theme.global.current.value.dark
        ? `url(${woodTexture_Dark})`
        : `url(${woodTexture_Light})`
})


//const { mutate: getPosts } = useGetPosts()
const { mutate: getPostsByNewest } = useGetPostsByNewest()
const { data: categories } = useGetCategories();

const fetchedPosts = ref<Post[]>([])
const fetchedPostIDs = ref<number[]>([])
/* ---------- IntersectionObserver ---------- */
const isFetching = ref(false)


const sentinel = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

function fetchNextPosts() {
    
  if (isFetching.value) return
  isFetching.value = true

  getPostsByNewest(fetchedPostIDs.value, {
    onSuccess(posts: Post[]) {
      fetchedPosts.value.push(...posts)

      const ids = new Set(fetchedPostIDs.value)
      posts.forEach(p => ids.add(p.ID))
      fetchedPostIDs.value = [...ids]

      isFetching.value = false
    },
    onError() {
      isFetching.value = false
    }
  })
}

onMounted(() => {
  if (!scrollContainer.value || !sentinel.value) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if(entry){
        if (entry.isIntersecting) {
          fetchNextPosts()
        }
      } 
    },
    {
      root: scrollContainer.value,
      threshold: 0.1
    }
  )

  observer.observe(sentinel.value)
})

onUnmounted(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value)
    observer.disconnect()
  }
})

/* ---------- View post logic ---------- */
const viewPostDialog = ref(false)
const viewedPost = ref<Post>({
  title: '',
  subtitle: '',
  desc: '',
  categoryID: null,
  files:[]
})

function formatDate(date : Date|undefined) : string|undefined{
   
    if(date){
        return date.toString().split("T")[0];
    }
    return "NINCS/HIBÁS DÁTUM"
}  

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(
    urlRegex,
    url => `<a href="${url}" target="_blank" onclick="event.stopPropagation()">${url}</a>`
  )
}




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
    <main id="main" ref="scrollContainer">
        <div class="titleContainer" >
            <h1 class="title">A Te Otthonod</h1>
            <h2 class="subtitle">XYZ bútorasztalos  hivatalos oldala</h2>
        </div>
        <div class="postContainer">
          <h1 class="latestTitle bg-primary">Legutóbbi munkák<hr></h1>
            <div class="postContainerBlock"   
                :style="{
                backgroundImage: postBackground,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat'
                }">
                <!--<v-card style="opacity: 0;" >
                    <v-card-text>-->
                        <v-row>
                            <v-col v-for="post in fetchedPosts" class="postContainerBox" cols="12" sm="6" md="6">

                            
                                <v-card class="postContainerCard" color="secondary" @click="viewedPost = JSON.parse(JSON.stringify(post)); viewPostDialog=true;" style="border-radius: 1em;">
                                <v-card-title><h1 class="textbox" v-html="linkify(post.title)"></h1><h3 class="textbox" v-html="(linkify(post.subtitle))"></h3> 
                                        <!----<i>{{ formatDate(post.uploadDate) }}</i>--></v-card-title>
                                <v-card-text>
                                    <p class="textbox" v-html="linkify(post.desc)"></p>
                                   <!--<p class="texbox" v-html="linkify(post.desc)"></p>--> 
                                    <v-carousel hide-delimiters hide-delimiter-background  
                                                crossfade :continuous="false" show-arrows style="">
                                        <template v-slot:prev="{ props }">
                                            <v-btn
                                                variant="elevated"
                                                @click.stop="props.onClick"
                                                style="border-radius: 15%;"

                                            >
                                                <v-img 
                                                :src="arrowLeft"
                                                width="24"
                                                height="24"
                                                contain
                                                ></v-img>
                                            </v-btn>
                                        </template>
                                        <template v-slot:next="{ props }">
                                            
                                        <v-btn
                                            variant="elevated"
                                            @click.stop="props.onClick"
                                            style="border-radius: 15%;"
                                        >
                                            <v-img 
                                            :src="arrowRight"
                                            width="24"
                                            height="24"
                                            contain
                                            ></v-img>
                                        </v-btn>

                                        </template>
                                        
                                        <v-carousel-item v-for="image in post.images"  v-if="post.images" 
                                            :src="`http://localhost:3000/img/${post.ID}/medium/${image.filename}`" aspect-ratio="1" 
                                        class="carouselItem">
                                        </v-carousel-item>
                                        
                                    </v-carousel>
                                </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                   <!-- </v-card-text>
                </v-card>-->
            </div>
        </div>
        <v-dialog v-model="viewPostDialog" height="90vh" max-height="90vh">
            <v-card class="postDialogStart" height="100%">
                <v-card-text>
                    <div v-if="isPortrait">
                        <v-row>
                            <v-col cols="9">
                                <h1 class="texbox" v-html="linkify(viewedPost.title)"></h1><h3 class="texbox" v-html="linkify(viewedPost.subtitle)"></h3> 
                                                Feltöltés dátuma:<br><i>{{ formatDate(viewedPost.uploadDate) }}</i>
                            </v-col>
                            <v-col cols ="1">
                                <v-btn @click="viewPostDialog = false" style="background-color: #ff0000; color:white;font-size: 1vw;">×</v-btn>
                            </v-col>
                            <v-col cols="12">

                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-row>
                            <v-col sm="5">
                                <h1 class="texbox" v-html="linkify(viewedPost.title)"></h1><h3 class="texbox" v-html="linkify(viewedPost.subtitle)"></h3> 
                                                Feltöltés dátuma: <i>{{ formatDate(viewedPost.uploadDate) }}</i>
                            </v-col>
                            <v-col sm="6"></v-col>
                            <v-col sm="1">
                                <v-btn @click="viewPostDialog = false" style="background-color: #ff0000; color:white;font-size: 1vw;">×</v-btn>
                            </v-col>
                        </v-row>
                    </div>

                    <p class="textbox" v-html="linkify(viewedPost.desc)"></p><br>
                    <v-carousel hide-delimiters hide-delimiter-background  
                                crossfade :continuous="false" show-arrows style="margin-top: 0 auto; margin-bottom: 0 auto; ">
                        <template v-slot:prev="{ props }">
                            <v-btn
                                variant="elevated"
                                @click="props.onClick"
                                style="border-radius: 15%;"
                            >
                                <v-img 
                                :src="arrowLeft"
                                width="24"
                                height="24"
                                contain
                                ></v-img>
                            </v-btn>
                        </template>
                        <template v-slot:next="{ props }">
                            
                        <v-btn
                            variant="elevated"
                            @click="props.onClick"
                            style="border-radius: 15%;"
                        >
                            <v-img 
                            :src="arrowRight"
                            width="24"
                            height="24"
                            contain
                            ></v-img>
                        </v-btn>

                        </template>
                        
                        <v-carousel-item v-for="image in viewedPost.images"  v-if="viewedPost.images" 
                            :src="`http://localhost:3000/img/${viewedPost.ID}/medium/${image.filename}`"  
                        class="carouselItem">
                        </v-carousel-item>
                        
                    </v-carousel>
                </v-card-text>
            </v-card>
        </v-dialog>
        
        <div ref="sentinel" class="sentinel my-6">
                <v-progress-circular
                v-if="isFetching"
                indeterminate
            />
        </div>
    </main>
    
</template>
<style lang="css">
.textbox{
    white-space: pre-wrap !important;    /* keeps \n */
    word-break: break-word !important; 
}



@media (orientation: landscape){
    #main{
        align-items: center;
        align-content: center;
    }
    .title{
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        color: rgb(255, 255, 255);
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
        font-size:10vw;
    }
    .subtitle{
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        color: rgb(255, 255, 255);
        align-items: center;
        align-content: center;
        justify-content:center;
        /*display:block;*/
        text-align: center;
        font-size:3vw;
    }
    
    .titleContainer{
        height: 100vh;
        width: 100vw;
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        background-image: url("/src/assets/start_image.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    .postContainer{
        width: 100vw;
        
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
    }
    .postContainerBlock{
        width: 74vw;
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        margin: 0 auto;
        padding: 2vw;
        border-radius: 1em;
    }
    .postContainerCard{
        /*width: 40vw;
        margin: 0 auto;*/
        margin-top: 2.5vh;
        margin-bottom: 2.5vh;
        min-height: 100%;
        
    }
    .postDialogStart{
        margin: 0 auto;
        width: 75vw;
        height: 85vh;
    }
    .latestTitle{
        text-shadow:0 2px 6px rgba(0, 0, 0, 0.6);
        color: rgba(0, 0, 0);
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
        font-size:3vw; 
        margin-bottom: 10vh;
    }

}
@media (orientation: portrait) {
    #main{
        align-items: center;
        align-content: center;
    }
    .title{
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        color: rgb(255, 255, 255);
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
        font-size:10vw;
    }
    .subtitle{
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        color: rgb(255, 255, 255);
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
        font-size:5vw;
    }
    .titleContainer{
        height: 75vh;
        width: 100vw;
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        background-image: url("/src/assets/start_image.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    .postContainer{
        width: 100vw;
        
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
    }
    .postContainerBlock{
        width: 100vw;
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        margin: 0 auto;
    }
    .postContainerCard{
        width: 90vw;
        margin: 0 auto;
        margin-bottom: 5vh;
    }
    .postDialogStart{
        margin: 0 auto;
        width: 85vw;
        height: 100vh;
    }
    .latestTitle{
        text-shadow:0 2px 6px rgba(0, 0, 0, 0.6);
        color: var(--title-color); 
        align-items: center;
        align-content: center;
        justify-content:center;
        display:block;
        text-align: center;
        
        font-size:10vw; 
        margin-bottom: 10vh;
    }
}

</style>