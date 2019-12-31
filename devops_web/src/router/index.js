import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Header from '../components/base/Header'
import Home from '../components/Home'
import HostAll from '../components/page/host/HostAll'
import Login from '../components/page/Login'
import WebSSH from '../components/WebSSH'
import Error from '../components/page/Error'
import SiteMenu from '../components/page/site/siteMenu'



Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component: Header,
      children: [
        {
          //home页面
          path:'',
          name: 'Home',
          component: Home,
        },
        {
          //所有机器
          path:'/host/hostAll',
          name: 'HostAll',
          component: HostAll,
        },
        {
          //webssh
          path: '/ssh',
          name: 'WebSSH',
          component: WebSSH
        },
        {
        //  站点设置
          path: '/site/menu',
          name: 'SiteMenu',
          component: SiteMenu

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
