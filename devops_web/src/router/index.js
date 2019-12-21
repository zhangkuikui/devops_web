import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Header from '../components/base/Header'
import Home from '../components/Home'
import HostAll from '../components/page/host/HostAll'
import Login from '../components/page/Login'
import WebSSH from '../components/WebSSH'
import Error from '../components/page/Error'



Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component: Header,
      children: [
        {
          path:'',
          name: 'Home',
          component: Home,
        },
        {
          path:'/host/hostAll',
          name: 'HostAll',
          component: HostAll,
        },
        {
          path: '/ssh',
          name: 'WebSSH',
          component: WebSSH
        }
      ]
    },
    {
      path:'/login',
      name:'Login',
      component:Login,
    },
    {
      path: '*',
      name:'Error',
      component: Error,
    }

  ]
})
