<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useGetCategories } from '@/api/siteQuery';
import { ref ,onMounted, onUnmounted,onUpdated, computed,watch } from 'vue';
import { useTheme } from 'vuetify'
import type { Category } from '@/api/site';
import { ca } from 'vuetify/locale';

const theme = useTheme()


function toggleTheme() {
  const isDark = theme.global.current.value.dark
  theme.change(isDark ? 'themeLight' : 'themeDark')
}


const Router = useRouter()
const { data: categories } = useGetCategories();
const route = useRoute()
//@click="Router.push()"
let displayCategories = ref(false);


//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  // detect system theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  theme.change(prefersDark ? 'themeDark' : 'themeLight')
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
  
});//itt ér véget

const drawer = ref(false) // telós sidebar

/*

const formattedCategories = computed(() => {
  const mapNode = (cat: Category) => ({
    id: cat.ID,
    title: cat.name,
    children: cat.children?.map(mapNode) || []
  })

  return categories.value?.map(mapNode) || []
})
function findCategoryById(id: number, list: Category[]): Category | undefined {
  for (const cat of list) {
    if (cat.ID === id) return cat
    if (cat.children) {
      const found = findCategoryById(id, cat.children)
      if (found) return found
    }
  }
}

function onSelect(activeIds: number[]) {
  if (!activeIds.length || typeof(activeIds[0]) == Number) return

  const selectedId = activeIds[0]
  const selected = findCategoryById(selectedId, categories.value || [])

  if (!selected) return

  // if has children → do nothing (only expand)
  if (selected.children && selected.children.length > 0) return

  // leaf → navigate
  Router.push({
    name: 'category',
    params: {
      id: selected.ID,
      categoryname: selected.name
    }
  })
}*/
// Helper function to find a category deep in the tree
function findCategoryRecursive(list: any[], id: number): any | undefined {
  if (!list || !Array.isArray(list)) return undefined;

  for (const cat of list) {
    if (cat.ID === id) return cat;
    
    // Check if children is an actual array before recursing
    if (cat.children && Array.isArray(cat.children)) {
      const found = findCategoryRecursive(cat.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

const activated = ref([]);

watch(activated, (newVal) => {
  if (newVal.length > 0 && newVal[0]) {
    const categoryId = newVal[0];
    const category = findCategoryRecursive(categories.value || [], categoryId);
    
    if (category) {
      // CHECK: Only navigate if it's a leaf node (no children)
      if (!category.children || category.children.length === 0) {
        Router.push({
          name: 'category',
          params: {
            id: category.ID,
            categoryname: category.name
          }
        });
      } else {
        // Optional: If it's a folder, clear the selection so it can be clicked again
        // to toggle, or just do nothing so the tree stays open.
        activated.value = []; 
      }
    }
  }
});




function handleDesktopSelect(val: any[], searchList: any) {
  if (val && val.length > 0) {
    const categoryId = val[0];
    const category = findCategoryRecursive(searchList, categoryId);
    
    if (category) {
      // Navigate ONLY if it's a leaf node (no children array or empty children array)
      const hasChildren = Array.isArray(category.children) && category.children.length > 0;
      
      if (!hasChildren) {
        Router.push({
          name: 'category',
          params: {
            id: category.ID,
            categoryname: category.name
          }
        });
      }
    }
  }
}
</script>

<template>

    <div v-if="isPortrait">
      <v-layout>
        <v-app-bar class="appnavbar bg-secondary"
        flat
        theme="navbar">
          <v-btn @click.stop="drawer = !drawer" style="height: 100vh; width: 20vw;">
            <v-icon icon="mdi-format-list-bulleted" ></v-icon> <!--Mindenképpen meg kell ezt csinálni mert gagyi-->
          </v-btn>
          
          <v-spacer></v-spacer>
          <v-switch class="switch" @change="toggleTheme" hide-details
            inset  :label="theme.global.current.value.dark ? 'Sötét mód' : 'Világos mód'">  </v-switch>
        </v-app-bar>
        <RouterView></RouterView>

        <v-navigation-drawer v-model="drawer" color="secondary">
          <v-btn color="primary" class="appnav-item" @click="Router.push({name:'home'})">Kezdőlap</v-btn>
          <!--<div v-for="category in categories">
            <v-btn color="primary" class="appnav-item" @click="Router.push({name:'category',params:{id:category.ID,categoryname:category.name}})">{{ category.name }}</v-btn>
          </div>-->
          <v-treeview
            
            class="appnav-tree"
            :items="categories"
            activatable
            item-title="name"
            item-value="ID"
            v-model:activated="activated"
            open-all
          />
          <v-btn color="primary" class="appnav-item" @click="Router.push({name:'contact'})">Elérhetőség</v-btn>
        </v-navigation-drawer>
      </v-layout>
      
    </div>




    <div v-else>
      <v-layout class="rounded rounded-md">
        <v-app-bar class="appnavbar bg-secondary" flat theme="navbar">
          
          <v-btn class="appnav-item" @click="Router.push({name:'home'})">Kezdőlap</v-btn>

          <template v-for="category in categories" :key="category.ID">
            
            <v-menu v-if="category.children && category.children.length > 0" open-on-hover transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn class="appnav-item" v-bind="props">
                  {{ category.name }}
                  <v-icon icon="mdi-chevron-down" end></v-icon>
                </v-btn>
              </template>

              <v-card min-width="250">
                <v-treeview
                  :items="category.children"
                  item-title="name"
                  item-value="ID"
                  activatable
                  @update:activated="(val) => handleDesktopSelect(val as any[], category.children)"
                  class="desktop-tree"
                />
              </v-card>
            </v-menu>

            <v-btn 
              v-else 
              class="appnav-item" 
              @click="Router.push({name:'category', params:{id:category.ID, categoryname:category.name}})"
            >
              {{ category.name }}
            </v-btn>
          </template>

          <v-btn class="appnav-item" @click="Router.push({name:'contact'})">Elérhetőség</v-btn>
          
          <v-spacer></v-spacer>
          
          <v-switch 
            class="switch" 
            @change="toggleTheme" 
            hide-details 
            inset 
            :label="theme.global.current.value.dark ? 'Sötét mód' : 'Világos mód'"
          />
        </v-app-bar>
        
        <v-main>
          <RouterView></RouterView>
        </v-main>
      </v-layout>
    </div>



  </template>
<style lang="css">
.appnav-item {
  height: 15vw !important; 
  align-self: center;
}
.appnav-tree {
  background-color: transparent !important;
  color: inherit !important;
}

/* If you want to change the color of the active/selected item */
.appnav-tree .v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}


@media (orientation: landscape){
  .texbox{
      white-space: pre-wrap;   /* keeps \n */
      word-break: break-word; 
  }
    .appnav-item {
    height: 15vw !important; 
    align-self: center;
  }
  .switch{
      align-items: center;
      align-content: center;
      justify-content:center;
      display:block;
      margin-right: 5vw;
  }

}
@media (orientation: portrait) {
  .texbox{
      white-space: pre-wrap;   /* keeps \n */
      word-break: break-word; 
  }
  .appnav-item {
    height: 15vw !important; 
    width: 100vw;
    align-self: center;
  }
    .switch{
      align-items: center;
      align-content: center;
      justify-content:center;
      display:block;
      margin-right: 5vw;
  }

}




/* Fix the dropdown tree appearance */
.desktop-tree {
  padding: 8px;
}

/* Ensure the nav items don't stretch weirdly in desktop */
@media (min-width: 960px) {
  .appnav-item {
    height: 64px !important; /* Standard AppBar height */
    width: auto !important;
    padding: 0 16px;
  }
}
</style>