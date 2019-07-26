import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 存放着组件中信息的状态
const state = {
  navState: 0,
  windowHeight: document.documentElement.clientHeight || document.body.clientHeight,
  userInfo:localStorage.getItem('ms_user')?JSON.parse(localStorage.getItem('ms_user')):''
}
const mutations = {
  goBack() {
    history.go(-1)
  },
  superCanSee(){
    if(state.userInfo.type!=1){
      window.location.href="#/mywork"
    }
  },
  adminCanSee(){
    if(state.userInfo.type!=1&&state.userInfo.type!=2){
      window.location.href="#/mywork"
    }
  },
  getUserByToken(status, userDatas) {
    let _this = this;
    $.ajax({
      type: "post",
      url: '/Views/login.aspx',
      dataType: "json",
      data:{
        data:JSON.stringify(userDatas)
      },
      async:false,
      success: function(data){
        state.userInfo=data.data;
      },
      error:function(e){
        console.log(e)
      }

    })
  },
}

const actions={
  switch_dialog(context){//这里的context和我们使用的$store拥有相同的对象和方法
    context.commit('goBack');
  }
}

const getters={  //getters 和 vue 中的 computed 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的
  not_show(){
    return state.navState;
  },


}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
