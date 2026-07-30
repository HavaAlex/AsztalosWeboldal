import { createRouter, createWebHistory } from 'vue-router'


import ContactView from '@/views/user/ContactView.vue'
import CategoryView from '@/views/user/CategoryView.vue'
import StartView from '@/views/user/StartView.vue'

import SiteLayout from '@/layout/SiteLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'

import LoginView from '@/views/admin/LoginView.vue'
import CategoriesView from '@/views/admin/CategoriesView.vue'
import PostView from '@/views/admin/PostView.vue'
import UsersView from '@/views/admin/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'app',
      redirect:"/home",
      component: SiteLayout,
      children:[
        {
          path: '/home',
          name: 'home',
          component: StartView
        },

        {
          path: '/contact',
          name: 'contact',
          component: ContactView
        },
        {
          path: '/categories/:id/:categoryname',
          name: 'category',
          component: CategoryView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },  
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      children:[
        {
          path: 'posts',
          name: 'adminposts',
          component: PostView,
        },
                    {
          path: 'categories',
          name: 'admincategories',
          component: CategoriesView,
        },
                    {
          path: 'users',
          name: 'adminuser',
          component: UsersView,
        }
      ]
    }
    
  ],
})

export default router
