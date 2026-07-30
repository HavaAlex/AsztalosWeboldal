<script setup lang="ts">
import { ref, onMounted, onUnmounted,watch  } from 'vue'
import type { Post,DeletedImage} from '@/api/admin/post'
import type { Category } from '@/api/admin/category'
import { useGetPosts, useAddPost, usedeletePost,usedeleteImage,useModifyPost } from '@/api/admin/postQuery'
import { useGetCategories } from '@/api/admin/categoryQuery'
import arrowRight from '@/icons/arrow_right.png'
import arrowLeft from '@/icons/arrow_left.png'

const { data: categories } = useGetCategories()
const { mutate: getPosts } = useGetPosts()
const { mutate: AddPost } = useAddPost()
const { mutate: modifyPost} = useModifyPost();
const { mutate: deletePost } = usedeletePost()
const { mutate: deleteImage} = usedeleteImage();


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

  getPosts(fetchedPostIDs.value, {
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

/* ---------- New post logic ---------- */
const newPostDialog = ref(false)
const newPost = ref<Post>({
  title: '',
  subtitle: '',
  desc: '',
  categoryID: null,
  files: [],
  showOnHomePage:true
})

const selectedFiles = ref<File[]>([])

function appendFiles(files: File | File[], post: Post) {
  if (!files) return
  const fileArray = Array.isArray(files) ? files : [files]
  if (!post.files) {
    post.files = []
  }
  post.files.push(...fileArray)
  
  
}

function filePreview(file: File): string {
  return window.URL.createObjectURL(file)
}



const AddPostHelper = async () => {
    await AddPost(newPost.value,{
        onSuccess: () =>{
            newPostDialog.value = false;
            newPost.value.title = '' ;
            newPost.value.subtitle ='';
            newPost.value.desc='';
            newPost.value.categoryID=null;
            newPost.value.files=[]
            newPost.value.showOnHomePage = true;

            
            activeItems.value = []
            fetchedPosts.value = []
            fetchedPostIDs.value = []
            getPosts(fetchedPostIDs.value);
        }
    })
}


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


/* ---------- Edit post logic ---------- */
const deletedImageIndex = ref(-1);
const editPostDialog = ref(false)
const laterAddedFiles = ref<File[]>([])


const editedPost = ref<Post>({
  title: '',
  subtitle: '',
  desc: '',
  categoryID: null,
  files: [],
  showOnHomePage: true
});


const downloadFile =async (filename: string,ID:number) => {
  try {
    const url = `http://localhost:3000/img/${ID}/original/${filename}`;

    // Fetch the file as a blob
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();

    // Create a link and download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error('Download failed:', err);
  }
};






const imageDeleteConfirmation = ref(false)
let deletedImageID = ref(-1)
const deleteImageHelper = async (ID:number) => {
    if(ID){
        await deleteImage(ID, {
            onSuccess: () => {
            }
        })
    }

}

const EditPostHelper = async () => {
  await modifyPost(editedPost.value, {
    onSuccess: () => {
      editPostDialog.value = false;
      editedPost.value = {
        title: '',
        subtitle: '',
        desc: '',
        categoryID: null,
        files: [],
        showOnHomePage: true
      };
      laterAddedFiles.value = [];
      activeItems.value = [];
      
      // Refresh posts list
      fetchedPosts.value = [];
      fetchedPostIDs.value = [];
      fetchNextPosts();
    }
  })
}

/* ---------- Delete post logic ---------- */

const deleteDialog = ref(false)
const deleteID = ref(-1)
const deleteIndex = ref(-1)
const deleteHelper = async () => {
    deleteDialog.value=false 
    await deletePost(deleteID.value);
    fetchedPosts.value.splice(deleteIndex.value,1)
    deleteID.value = -1
    deleteIndex.value =-1
}

const activeItems = ref<number[]>([])
watch(activeItems, (val : number[]) => {
  if (!val.length) return

  newPost.value.categoryID = val[0]
  editedPost.value.categoryID = val[0]
})
function isLeaf(node?: Category): boolean {
  return !!node && (!node.children || node.children.length === 0)
}

function findCategoryById(id: number, nodes: Category[]): Category | null {
  for (const node of nodes) {
    if (node.ID === id) return node
    if (node.children) {
      const found = findCategoryById(id, node.children)
      if (found) return found
    }
  }
  return null
}

watch(activeItems, (val: number[]) => {
  if (val.length && val[0]) {
      const selected = findCategoryById(val[0], categories.value || [])

    // HA NEM LEAF → töröljük a selection-t
    if (!selected || !isLeaf(selected)) {
        activeItems.value = []
        return
    }

    // HA LEAF → OK
    if (newPostDialog.value) newPost.value.categoryID = selected.ID
    if (editPostDialog.value) editedPost.value.categoryID = selected.ID
  }
  else{
    return
  }


})
watch(newPostDialog, () =>{
    
    if(!newPostDialog.value){
        activeItems.value = []
    }
})
watch(editPostDialog, () =>{
    if(!editPostDialog.value){
        activeItems.value = []
    }
})
</script>


<template>
    <div ref="scrollContainer"
    class="post-container">
    <v-card 
    color="surface"
    >
        <v-card-actions>
            
            <v-btn @click="newPostDialog = true" style="background-color: #4f54eb; color:white">
                Új bejegyzés
            </v-btn>
        </v-card-actions>
        <v-card-title>
            Bejegyzések: 
        </v-card-title>
        <v-card-text style="/*height: 50vw;*/">
            <v-row>
                <v-col
                v-for="(post, index) in fetchedPosts"
                :key="post.ID"
                cols="6"
                
                >
                <v-card color="card-color">
                    <v-card-title>
                    <h1 class="textbox" v-html="linkify(post.title)"></h1><h3 class="textbox" v-html="(linkify(post.subtitle))"></h3>
                    Feltöltés dátuma: <i>{{ formatDate(post.uploadDate) }}</i>
                    </v-card-title>
                    <v-card-text >
                        
                        <p class="texbox" v-html="linkify(post.desc)"></p>
                        <v-carousel hide-delimiters hide-delimiter-background  crossfade :continuous="false" show-arrows >
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
                            
                            <v-carousel-item v-if="post.images" v-for="image in post.images" :src="`http://localhost:3000/img/${post.ID}/medium/${image.filename}`" aspect-ratio="1" class="carouselItem">
                            </v-carousel-item>
                            
                        </v-carousel>
                        
                    </v-card-text>
                    <v-card-actions>
                    <v-btn style="background-color: #4f54eb; color:white" @click="viewedPost = JSON.parse(JSON.stringify(post)); viewPostDialog=true ">Megnyitás</v-btn>
                    <v-btn style="background-color: #5592FC; color:white" @click="editedPost = JSON.parse(JSON.stringify(post)); activeItems.push(editedPost.categoryID);editPostDialog=true;">Módosítás</v-btn>
                    <v-btn style="background-color: #ff0000; color:white" @click="deleteID = post.ID; deleteIndex=index; deleteDialog=true">Törlés</v-btn>
                    </v-card-actions>
                </v-card>
                </v-col>
            </v-row>

            <!-- Sentinel -->
            <div ref="sentinel" class="sentinel my-6">
                <v-progress-circular
                v-if="isFetching"
                indeterminate
            />
            </div>
        </v-card-text>

    </v-card>
    </div>
    <v-dialog v-model="viewPostDialog" height="90vh" max-height="90vh">
        <v-card class="postDialogStart" height="100%">
            <v-card-text>

                
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
                

                <p class="textbox" v-html="linkify(viewedPost.desc)"></p><br>
                <v-carousel hide-delimiters hide-delimiter-background  
                            crossfade :continuous="false" show-arrows style="height: 75vh;">
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
                        :src="`http://localhost:3000/img/${viewedPost.ID}/medium/${image.filename}`" aspect-ratio="1" 
                    class="carouselItem">
                    </v-carousel-item>
                    
                </v-carousel>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="newPostDialog">
        <v-card color="background">
            <v-card-title>
                Új bejegyzés
            </v-card-title>
            <v-card-text>
                <v-text-field label="Cím (nem kötelező)" v-model="newPost.title" maxlength = "500"></v-text-field>
                <p>Cím hossza: Maximum 500 karakter. Hátravan: {{ (500-newPost.title.length) }}</p><br><br>
                <v-text-field label="Alcím (nem kötelező)" v-model="newPost.subtitle" maxlength = "500"></v-text-field>
                <p>Alcím hossza: Maximum 500 karakter. Hátravan: {{ (500-newPost.subtitle.length) }}</p><br><br>
                <v-textarea label="Törzssszöveg (nem kötelező)" v-model="newPost.desc" maxlength = "1000"></v-textarea>
                <p>Törzsszöveg hossza: Maximum 1000 karakter. Hátravan: {{ (1000-newPost.desc.length) }}</p><br><br>
                
                <h4>Kategória (kötelező)</h4>
                <v-treeview
                :items="categories"
                activatable
                item-title="name"
                item-value="ID"
                v-model:activated="activeItems"
                color="success"
                open-all
                />

                

                <input type="checkbox" id="checkboxStartNew" v-model="newPost.showOnHomePage">
                <label for="checkboxStartNew"> Megjelenítés a kezdőlapon</label>
                <br><br><br><br><br>
                <v-row>
                    <v-col
                        v-for="(file, index) in newPost.files"
                        :key="index"
                        cols="12"
                        sm="4"
                        md="3"
                    >
                        <v-card>
                        <v-img
                            v-if="file.type.startsWith('image/')"
                            :src="filePreview(file)"
                            aspect-ratio="1"
                            
                            />

                        <v-card-text class="text-truncate">
                            {{ file.name }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                            style="background-color: #ff0000; color:white"
                            variant="text"
                            @click="newPost.files.splice(index, 1)"
                            >
                            Mégse
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-file-input
                label="Fájlok feltöltése"
                multiple
                show-size
                counter
                v-model="selectedFiles"
                @update:model-value="files => appendFiles(files, newPost)"
                accept=".png,.jpg,.jpeg,.heic,.gif,.svg,.webp,.bmp"
                />
            </v-card-text>


            <v-card-actions>
                <v-btn style="background-color: #ff0000; color:white" @click="newPost.title = '' ;newPost.subtitle ='';newPost.desc='';newPost.categoryID=null;newPost.files=[] ">Visszaállítás</v-btn>
                <v-btn style="background-color: #ff9500; color:white" @click="activeItems = []; newPostDialog = false">Mégse</v-btn>
                <v-btn style="background-color: #4f54eb; color:white" @click="AddPostHelper()">Feltöltés</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editPostDialog">
        <v-card color="background">
            <v-card-title>
                Új bejegyzés
            </v-card-title>
            
                <div v-if="editedPost">
                <v-card-text>
                        <v-text-field label="Cím" v-model="editedPost.title " maxlength="500"></v-text-field>
                        <p>Cím hossza: Maximum 500 karakter. Hátravan: {{ (500-editedPost.title.length) }}</p><br><br>
                        <v-text-field label="Alcím" v-model="editedPost.subtitle" maxlength="500"></v-text-field>
                        <p>Alcím hossza: Maximum 500 karakter. Hátravan: {{ (500-editedPost.subtitle.length) }}</p><br><br>
                        <v-textarea label="Törzssszöveg (nem kötelező)" v-model="editedPost.desc" maxlength="1000"></v-textarea>
                        <p>Törzsszöveg hossza: Maximum 1000 karakter. Hátravan: {{ (1000-editedPost.desc.length) }}</p><br><br>
                        <v-treeview
                        
                        :items="categories"
                        activatable
                        item-title="name"
                        item-value="ID"
                        v-model:activated="activeItems"
                        color="success"
                        open-all
                        />



                        <input type="checkbox" id="checkboxStartNew" v-model="editedPost.showOnHomePage">
                        <label for="checkboxStartNew"> Megjelenítés a kezdőlapon</label>
                        <h2>Jelenlegi képek:</h2>
                        <v-row>
                            <v-col
                                v-for="(image, index) in editedPost.images"
                                :key="index"
                                cols="12"
                                sm="4"
                                md="3"
                            >
                                <v-card>
                                <v-img
                                    :src="`http://localhost:3000/img/${editedPost.ID}/medium/${image.filename}`"
                                    aspect-ratio="1"
                                    />

                                <v-card-text class="text-truncate">
                                    {{ image.filename }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                    style="background-color: #ff0000; color:white"
                                    variant="text"
                                    @click="deletedImageID=image.ID; imageDeleteConfirmation=true;deletedImageIndex=index"
                                    >
                                    Törlés
                                    </v-btn>
                                    <div v-if="image">
                                        <v-btn
                                            style="background-color: #5592FC; color:white"
                                            variant="text"
                                            @click="downloadFile(image.filename,editedPost.ID)"
                                            >
                                            Letöltés
                                        </v-btn>
                                    </div>
                                    
                                </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                        <h2>Új képek</h2>
                        
                            <v-row>
                                <v-col
                                    v-for="(file, index) in editedPost.files"
                                    :key="index"
                                    cols="12"
                                    sm="4"
                                    md="3"
                                >
                                    <v-card>
                                    <v-img
                                        v-if="file.type.startsWith('image/')"
                                        :src="filePreview(file)"
                                        aspect-ratio="1"
                                        
                                        />

                                    <v-card-text class="text-truncate">
                                        {{ file.name }}
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                        style="background-color: #ff0000; color:white"
                                        variant="text"
                                        @click="newPost.files.splice(index, 1)"
                                        >
                                        Mégse
                                        </v-btn>

                                    </v-card-actions>
                                    </v-card>
                                </v-col>
                            </v-row>
                        <!--
                        <div v-else>
                            <p>Nincs új fájl hozzáadva</p>
                        </div>-->
                        

                        <v-file-input
                        label="Fájlok feltöltése"
                        multiple
                        show-size
                        counter
                        v-model="laterAddedFiles"
                        @update:model-value="files => appendFiles(files, editedPost)"
                        accept=".png,.jpg,.jpeg,.heic,.gif,.svg,.webp,.bmp"
                        />
                    </v-card-text>


                    <v-card-actions>
                        <v-btn @click="activeItems = []; editPostDialog = false">Mégse</v-btn>
                        <v-btn style="background-color: #5592FC; color:white" @click="EditPostHelper()">Feltöltés</v-btn>
                    </v-card-actions>   
                </div>
                
        </v-card>
    </v-dialog>

    <v-dialog v-model="imageDeleteConfirmation" style="width: 50vw;">
        <div v-if="editedPost.images">
            <v-card>
                <v-card-title>
                    Biztos törlöd?
                </v-card-title>
                <v-card-text>
                    Ha kitörlöd a képet nem lehet visszaszerezni.
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="deletedImageID = -1;imageDeleteConfirmation = false" >Mégse</v-btn>
                    <v-btn @click="deleteImage(deletedImageID);editedPost?.images.splice(deletedImageIndex, 1);
                            imageDeleteConfirmation  =false" style="background-color: #ff0000; color:white">Törlés</v-btn>
                </v-card-actions>
            </v-card>
        </div>

    </v-dialog>

    <v-dialog v-model="deleteDialog" style="width: 50vw;">
        <v-card>
            <v-card-title>
                Biztos törlöd?
            </v-card-title>
            <v-card-text>
                Ha kitörlöd a bejegyzést, az ahhoz tartozó képek elvesznek.
            </v-card-text>
            <v-card-actions>
                <v-btn @click="deleteID = -1; deleteIndex=-1; deleteDialog = false" >Mégse</v-btn>
                <v-btn @click="deleteHelper()" style="background-color: #ff0000; color:white">Törlés</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<style lang="css">

.texbox{
  white-space: pre-wrap;  
  word-break: break-word; 
}
.post-container {
  width: 70vw;
  height: 90vh; 
  margin-top: 10vh;
  overflow-y: auto;
}

.sentinel {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.postDialog{
    margin: 0 auto;
    width: 55vw;
    height: 100vh;
}
</style>