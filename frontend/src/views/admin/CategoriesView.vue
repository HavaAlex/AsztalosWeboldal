<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import type { SortOrd, SortKey } from '@/api/site'
import type { Category } from '@/api/admin/category'
import { useGetCategories,useAddCategory,useDeleteCategory,useModifyCategory } from '@/api/admin/categoryQuery';
import { computed, ref } from 'vue';
import CategoryItem from '@/components/CategoryItem.vue'

const Router = useRouter()
const { data: categories } = useGetCategories();
const { mutate: modifyCategory } = useModifyCategory();
const { mutate: deleteCategory } = useDeleteCategory();
const { mutate: addCategory } = useAddCategory();
 


const newCategoryDialog = ref(false);
const confirmDeleteDialog = ref(false);
const modifyDialog = ref(false);


const newCategory = ref({
  name:'',
  parentID:-1,
})

const editedCategory = ref();
const deletedCategory = ref();
function formatDate(date : Date|undefined) : string|undefined{
   
    if(date){
        return date.toString().split("T")[0];
    }
    return "NINCS/HIBÁS DÁTUM"
}   

</script>

<template>
    <v-card color="surface" style="margin-top: 10vw" >
        <v-card-title>Kategóriák</v-card-title>
        <v-card-actions>
            <v-text-field label="Új kategória hozzáadása" v-model="newCategory.name"></v-text-field>
            <v-btn style="background-color: #4f54eb; color:white" @click="addCategory(newCategory,{onSuccess:()=>{newCategory.name='';}}); ">Új kategória hozzáadása</v-btn>
        </v-card-actions>
        
        <v-card-text>
            <v-list>
            <CategoryItem
                v-for="category in categories"
                :key="category.ID"
                :category="category"
                color="card-color"
            />
            </v-list>
            
        </v-card-text>


        
    </v-card>



</template>
<style land="css">
td{
    text-align: center
};
</style>