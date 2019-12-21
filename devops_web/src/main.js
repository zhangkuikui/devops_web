// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'

import apiUrl from './comment/comment'
Axios.defaults.withCredentials = true;
Vue.prototype.$axios=Axios;


// console.log(axios.defaults.withCredentials)


Vue.prototype.$apiUrl=apiUrl;

// router.beforeEach((to, from, next) => {
//      document.title=to.name;   //让页面title显示路由对应的name值--xlz
//     if (to.path == '/login') {
//       sessionStorage.removeItem('user');
//     }
//     let user = JSON.parse(sessionStorage.getItem('user')); 
//     if (!user && to.path != '/login') {   //如果获取不到user说明登录失效了
//         if( to.path == '/regist/regist' || to.path == '/mobile/exampaper'){
//           next();
//         }else{
//           next({ 
//               path: '/login',
//               query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由-xlz
//           });
//         }
//     } else {
//       next()
//     }
//   });





Vue.use(ElementUI);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
