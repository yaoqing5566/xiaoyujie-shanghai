<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    $('#preloader').delay(550).fadeOut('slow');

    let us=localStorage.getItem('ms_user');
    if(us){
      console.log(us)
      let data={
        name:JSON.parse(us).name,
        pwd:JSON.parse(us).token
      }
      this.$store.commit('getUserByToken',data);
    }

  }
}
</script>

<style>
  @import "../static/css/main.css";
  @import "../static/css/color-dark.css";
  .el-table tr:hover{ background: #fdeef5}
  .el-table--enable-row-hover .el-table__body tr:hover>td{ background-color: transparent}
  #app .el-checkbox+.el-checkbox,#app .el-radio+.el-radio {
  margin:0  0px 0 0
  }
  .font-size12{color: #606266;font-size: 12px}
  #app .el-radio+.el-radio {
    margin-left: 0px;
  }
  #app  .el-checkbox.el-checkbox,#app .el-radio.el-radio {
    margin:0  15px 0 0
  }
  #app  .el-radio{ padding-bottom: 12px; margin-right: 15px}
  .tags-li.active,.el-button--primary,.el-button--primary:focus, .el-button--primary:hover {
    border: 1px solid #f791a3;
    background-color: #f4a2b0;
  }
  .el-tag{
    color: #ffa2b2;    background-color: rgb(255, 239, 242);border: 1px solid rgb(244, 162, 176)
  }
 #app .el-button--primary{
   border: 1px solid #f791a3;
   background-color: #f4a2b0;
   color: #fff;
  }
</style>
