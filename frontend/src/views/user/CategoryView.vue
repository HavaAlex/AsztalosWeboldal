<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Post } from '@/api/admin/post'
import type { SortKey,SortOrd,SortOption } from '@/api/site'
import { useGetPostsByCategory } from '@/api/siteQuery'
import arrowRight from '@/icons/arrow_right.png'
import arrowLeft from '@/icons/arrow_left.png'
import woodTexture_Light from '@/assets/woodtexture_light.jpg'
import woodTexture_Dark from '@/assets/woodtexture_dark.jpg'
import { useTheme } from 'vuetify'

const theme = useTheme()

const postBackground = computed(() => {
    return theme.global.current.value.dark
        ? `url(${woodTexture_Dark})`
        : `url(${woodTexture_Light})`
})
/* ---------- Route ---------- */
const route = useRoute()

const category = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? Number(raw) : NaN
})

/* ---------- Pagination state ---------- */
const fetchedIDs = ref<number[]>([])
const isFetching = ref(false)
const sortKey = ref<SortKey>('uploadDate')
const sortOrd = ref<SortOrd>('desc')



const sortOptions: SortOption[] = [
  { label: 'Feltöltési idő szerint csökkenő', key: 'uploadDate', ord: 'desc' },
  { label: 'Feltöltési idő szerint növekvő', key: 'uploadDate', ord: 'asc' },
  { label: 'Cím szerint csökkenő', key: 'title', ord: 'desc' },
  { label: 'Cím szerint növekvő', key: 'title', ord: 'asc' },
  { label: 'Alcím szerint csökkenő', key: 'subtitle', ord: 'desc' },   // change if you have better key
  { label: 'Alcím szerint növekvő', key: 'subtitle', ord: 'asc' }
]

const selectedSort = ref<SortOption | undefined>(sortOptions[0])

watch(selectedSort, (opt) => {
  if(!opt) return 
  fetchedIDs.value = []
  sortKey.value = opt.key
  sortOrd.value = opt.ord
})

/* ---------- Query ---------- */
const query = useGetPostsByCategory(fetchedIDs, category,sortKey,sortOrd)

const posts = computed<Post[]>(() => query.data.value ?? [])

/* ---------- IntersectionObserver ---------- */
const sentinel = ref<HTMLElement | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

function fetchNextPosts() {
  if (isFetching.value) return
  if (query.isFetching.value) return

  isFetching.value = true

  const currentIds = new Set(fetchedIDs.value)
  posts.value.forEach(p => currentIds.add(p.ID))
  fetchedIDs.value = [...currentIds]
}

/* ---------- Reset on category change ---------- */
watch(category, () => {
  fetchedIDs.value = []
})

/* ---------- Observer lifecycle ---------- */
onMounted(() => {
  if (!sentinel.value || !scrollContainer.value) return

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
  observer?.disconnect()
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
/* ---------- View post logic ---------- */
const viewPostDialog = ref(false)
const viewedPost = ref<Post>({
  title: '',
  subtitle: '',
  desc: '',
  categoryID: null,
  files:[]
})


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
  <div class="postContainer" >

  
    <v-card class="categoryPostContainer" :style="{
                backgroundImage: postBackground,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat'
                }">
        <v-card-title>
            <h1 style="align-self: center; align-content: center; align-content: center; justify-content:center;display:block; text-align: center;">{{ route.params.categoryname }}</h1>
            <hr style="margin-bottom: 5vh;">
            <v-select
            v-model="selectedSort"
            label="Rendezési szempont"
            :items="sortOptions"
            item-title="label"
            return-object
            variant= "solo"
            bg-color="primary"
            >
            </v-select>

        </v-card-title>
        <v-card-text>
            

            <v-row>
                <v-col v-for="(post,index) in posts"  cols="12" sm="6" md="6">
                    <v-card color="primary" @click="viewedPost = JSON.parse(JSON.stringify(post)); viewPostDialog=true;" style="min-height: 100%;"><!--:color="index%2===0 ? 'postEven':'postOdd'"-->
                        <v-card-title><h1 class="textbox" v-html="linkify(post.title)"></h1><h3 class="textbox" v-html="(linkify(post.subtitle))"></h3> </v-card-title>
                        <v-card-text>
                                    <p class="textbox" v-html="linkify(post.desc)"></p><br>
                                    <v-carousel hide-delimiters hide-delimiter-background  crossfade :continuous="false" show-arrows >
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
                                        
                                        <v-carousel-item v-if="post.images" v-for="image in post.images" :src="`http://localhost:3000/img/${post.ID}/medium/${image.filename}`" aspect-ratio="1" class="carouselItem">
                                        </v-carousel-item>
                                      
                                    </v-carousel>
                                    
                                
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!-- Sentinel -->
            <div ref="sentinel" class="sentinel my-6">
                <v-progress-circular
                v-if="query.isFetching.value || isFetching"
                indeterminate
                />
            </div>
        </v-card-text>
    </v-card>
  </div>

  <v-dialog v-model="viewPostDialog" height="90vh" max-height="90vh">
        <v-card class="postDialogStart" color="primary" height="100%">
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
                <p class="texbox" v-html="linkify(viewedPost.desc)"></p>
                <v-carousel hide-delimiters hide-delimiter-background  
                            crossfade :continuous="false" show-arrows style="height: 75vh;">
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
                    
                    <v-carousel-item v-for="image in viewedPost.images"  v-if="viewedPost.images" 
                        :src="`http://localhost:3000/img/${viewedPost.ID}/medium/${image.filename}`" aspect-ratio="1" 
                    class="carouselItem">
                    </v-carousel-item>
                    
                </v-carousel>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>
<style lang="css">
.carouselItem {
  background-color: black;
}
.texbox{
  white-space: pre-wrap;  
  word-break: break-word; 
}


@media (orientation: landscape){
  .categoryPostContainer{
    width: 80vw; 
    margin-top: 5vw;
    margin-left: auto;
    margin-right: auto;
  }
}
@media (orientation: portrait) {
  .categoryPostContainer{
    width: 95vw; 
    margin-top: 25vw;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>