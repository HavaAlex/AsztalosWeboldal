<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import type { SortOrd, SortKey } from '@/api/site'
import type { Category } from '@/api/admin/category'
import { useAddCategory,useDeleteCategory,useModifyCategory } from '@/api/admin/categoryQuery';
import { computed, ref } from 'vue';
import CategoryItem from '@/components/CategoryItem.vue'
import { tr } from 'vuetify/locale';

const Router = useRouter()

const { mutate: modifyCategory } = useModifyCategory();
const { mutate: deleteCategory } = useDeleteCategory();
const { mutate: addCategory } = useAddCategory();

const confirmDeleteDialog = ref(false);
const modifyDialog= ref(false);
const newCategory = ref({
  name:'',
  parentID:-1,
})
const editedCategory = ref();
const deletedCategory = ref();



defineProps<{
  category: any
}>()

function formatDate(date : Date|undefined) : string|undefined{
   
    if(date){
        return date.toString().split("T")[0];
    }
    return "NINCS/HIBÁS DÁTUM"
}   

function sumPostCount(categories: Category[]): number {
  let sum = 0;

  for (const category of categories) {
    if (!category) continue;

    if (category.children && category.children.length > 0) {
      sum += sumPostCount(category.children);
    } else if (category.postCount) {
      sum += category.postCount;
    }
  }

  return sum;
}

function sumImgCount(categories: Category[]): number {
  let sum = 0;

  for (const category of categories) {
    if (!category) continue;

    if (category.children && category.children.length > 0) {
      sum += sumImgCount(category.children);
    } else if (category.imageCount) {
      sum += category.imageCount;
    }
  }

  return sum;
}
</script>

<template>
  <div style="border-style: solid; border-color: #ff0000; border-width: 0.5vw;">
    <v-list-item>
      <v-row style="margin: 1vw ; ">
        <v-talbe style="width: 75vw;">
          <thead>
            <tr>
              <th>Kategória neve</th><v-spacer/>
              <th>Műveletek</th>
            </tr>

          </thead>
          <tbody>
            <tr>
              <td>
                <v-list-item-title cols='6' >{{ category.name }}</v-list-item-title>
              </td>
              <v-spacer/>
              <td>
                  <v-row>
                    <v-col>
                      
                    </v-col>
                  </v-row>
                <v-btn :text='`"${category.name}" átnevezése `' style="background-color: #5592FC; color:white" @click="editedCategory = JSON.parse(JSON.stringify(category)); modifyDialog=true"></v-btn>
                <v-btn :text='`"${category.name}" törlése `' style="background-color: #ff0000; color:white" @click="deletedCategory = JSON.parse(JSON.stringify(category)); confirmDeleteDialog= true"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-talbe>
        

      </v-row>
      <v-row>
        <v-text-field label="Új alkategória neve" cols="4" v-model="newCategory.name" color="background"></v-text-field>

        <v-btn :text='`Alkatekória hozzáadása "${category.name}"-hoz `' style="background-color: #4f54eb; color:white" cols="8"
        @click="newCategory.parentID = category.ID;addCategory(newCategory,{onSuccess:()=>{newCategory.name='';}}); "></v-btn>
      </v-row>
      
    </v-list-item>


      <div v-if="category.children && category.children.length" class="tree-children" >
        <p>Alkategóriák száma: {{ category.children.length }}<br> Posztok száma (összesítve): {{ sumPostCount(category.children)  }}<br> Képek száma (összesítve): {{ sumImgCount(category.children) }}</p>
        <v-list> 
            <CategoryItem
            v-for="child in category.children"
            :key="child.ID"
            :category="child"
            />
        </v-list> 
      </div>
      <div v-else>
        <p>Posztok száma: {{ category.postCount }}<br> Képek száma: {{ category.imageCount }}<br> Utolsó bejegyzés dátuma: {{ formatDate(category.lastDate) }}</p>
      </div>
    </div><br>
    <v-dialog v-model="modifyDialog">
        <v-card>
            <v-card-title>
                Kategória módosítása:
            </v-card-title>
            <v-card-text>
                <v-text-field label="Név" v-model="editedCategory.name" maxlength="100"></v-text-field>
                <p>Maximum 100 karakter. Hátravan: {{ (100-editedCategory.name.length) }}</p>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="modifyDialog=false">Mégse</v-btn>
                <v-btn @click="modifyCategory(editedCategory, {onSuccess: () => { modifyDialog = false}})" style="background-color: #5592FC; color:white">Módosítás</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDeleteDialog">
        <v-card>
            <v-card-title>Kategória törlése</v-card-title>
            <v-card-text>
                <h1>Biztos törölni akarod?</h1>
                <p>Ha kitörlöd a(z) {{ deletedCategory.name }} nevű kategóriát, az abba tartozó bejegyzések és azok képei továbbra is törlődnek.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="confirmDeleteDialog = false">Mégse</v-btn>
                <v-btn @click="deleteCategory(deletedCategory.ID, {onSuccess: () => { confirmDeleteDialog = false}})" style="background-color: #ff0000; color:white">Megerősít</v-btn>
            </v-card-actions>
        </v-card>
        
        
    </v-dialog>

</template>

<style lang="css">
.tree-children {
  border-left: 2px solid #ccc;
  margin-left: 16px;
  padding-left: 12px;
}
</style>