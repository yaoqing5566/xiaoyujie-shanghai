import Vue from 'vue';
import App from './App';
import router from './router';
import store from  './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import "babel-polyfill";

import {post,fetch,patch,put} from './components/common/http'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' });
axios.defaults.withCredentials = true //允许跨域
global.$axios = axios;
//定义全局变量
global.$_post=post;
global.$_get=fetch;
global.$_patch=patch;
global.$_put=put;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {

  let ms_user =JSON.parse(localStorage.getItem('ms_user'));
  let role='';
  if(ms_user){
    role=ms_user.name;
  }

  if(!role && to.path !== '/login'){
    next('/login');
  }else if(to.meta.permission){
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  }else{
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    }else{
      next();
    }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
