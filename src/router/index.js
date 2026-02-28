import { createRouter, createWebHistory } from 'vue-router'
import MusicHall from '../views/MusicHall.vue'
import Login from '../views/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'musichall',
      component: MusicHall,
    },
    {
      path: '/musicList',
      name: 'musicList',
      component: () => import("../views/MusicList.vue"),
    },
    {
      path: '/mymusic',
      name:"mymusic",
      component:() => import("../views/MyMusic.vue")
    },
    {
      path: '/player',
      name:"player",
      component:() => import("../views/Player.vue")
    },
    {
      path: '/search',
      name:"search",
      component:() => import("../views/Search.vue")
    },


    
  ],
})

export default router
