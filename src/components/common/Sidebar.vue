<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#f7c2cc"
             text-color="#84361d" active-text-color="#e81176" unique-opened router>
      <template v-for="item in items" v-if="item.show">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="(subItem,i) in item.subs" v-if="subItem.show">
              <template v-if="subItem.subs">
                <el-submenu :index="subItem.index" :key="subItem.index">
                  <template slot="title">
                    {{ subItem.title }}
                  </template>
                  <el-menu-item v-for="(subItem2,i) in subItem.subs" :key="i" :index="subItem2.index" v-if="subItem2.show">
                    {{ subItem2.title }}
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="subItem.index" :key="subItem.index">
                  {{ subItem.title }}
                </el-menu-item>
              </template>

            </template>


          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus';

  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'el-icon-edit-outline',
            index: '0',
            show:this.$store.state.userInfo.type==1,
            title: '用户管理',
            subs: [
              {
                show:this.$store.state.userInfo.type==1,
                index: 'user',
                title: '管理员'
              },
            ]
          },
          {
            icon: 'el-icon-edit-outline',
            index: '1',
            title: '基础信息',
            show:true,
            subs: [
              {
                index: 'soundStudio',
                show:true,
                title: '录音室'
              },
              {
                index: 'supplier',
                show:true,
                title: '供应方'
              },
              {
                index: 'customerInfo',
                show:true,
                title: '客户资料'
              }
            ]
          },
          {
            icon: 'el-icon-edit-outline',
            index: '2',
            title: '业务功能',
            show:true,
            subs: [
              {
                index: 'myworkAdd',
                show:true,
                title: '录入工作单'
              },
              {
                index: 'mywork',
                show:true,
                title: '我的工作单'
              },
              {
                index: 'seeScheduling',
                show:true,
                title: '排班表查看'
              },
              // {
              //   index: '2-4',
              //   title: '我的工作日志'
              // },

              {
                index: 'summaryPage',
                show:this.$store.state.userInfo.type==1,
                title: '制作部经理汇总页'
              },
              {
                index: '2-6',
                title: '工作单管理',
                show:this.$store.state.userInfo.type==1,
                subs: [
                  {
                    index: 'workLog',
                    show:this.$store.state.userInfo.type==1,
                    title: '工作单日志'
                  },
                  {
                    index: 'workIntention',
                    show:this.$store.state.userInfo.type==1,
                    title: '工作单意向'
                  }
                  // {
                  //   index: '2-6-1',
                  //   title: '工作单查询'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '归档工作单查询'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '工作单日志查询'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '交片审核'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '工作单取消工作完成'
                  // },

                ]
              },
              {
                index: '2-7',
                show:this.$store.state.userInfo.type==1,
                title: '工作单费用',
                subs: [
                  {
                    index: 'receivablesQuery',
                    show:true,
                    title: '应收款查询'
                  },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款排序'
                  // },
                  {
                    index: 'receivablesQuery2',
                    show:true,
                    title: '已收款查询'
                  },
                  {
                    index: 'payableQuery',
                    show:true,
                    title: '应付款查询'
                  },
                  {
                    index: 'paidQuery',
                    show:true,
                    title: '已付款查询'
                  },
                  // {
                  //   index: '2-6-1',
                  //   title: '坏账查询'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '已收款余额转移'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款负责人'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款催收'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款打印'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款催收管理'
                  // },
                  // {
                  //   index: '2-6-1',
                  //   title: '应收款超时'
                  // }
                ]
              },
              {
                index: 'reimbursement',
                show:true,
                title: '报销管理'
              }
            ]
          },
          // {
          //   icon: 'el-icon-edit-outline',
          //   index: '3',
          //   title: '财务相关',
          //   subs: [
          //     {
          //       index: 'banner',
          //       title: '考勤日志'
          //     },
          //     {
          //       index: 'banner',
          //       title: '已付款复核'
          //     }
          //   ]
          // },
          {
            icon: 'el-icon-edit-outline',
            index: '4',
            show:true,
            title: '统计分析',
            subs: [
              {
                index: 'workloadDetail',
                show:this.$store.state.userInfo.type==1,
                title: '工作量明细表'
              },
              {
                index: 'turnover',
                show:this.$store.state.userInfo.type==1,
                title: '营业额统计'
              },
              // {
              //   index: 'banner',
              //   title: '业务量月报'
              // },
              {
                index: 'crossSection',
                show:true,
                title: '交片统计'
              },
              // {
              //   index: 'banner',
              //   title: '客户付款周期排行榜'
              // },
              {
                index: 'customerRanking',
                show:this.$store.state.userInfo.type==1,
                title: '客户营收信息排行榜'
              },
              // {
              //   index: 'banner',
              //   title: '客户排班修改排行榜'
              // },
              {
                index: 'receivablesYear',
                show:this.$store.state.userInfo.type==1,
                title: '已收款年报'
              },
              {
                index: 'paidYear',
                show:this.$store.state.userInfo.type==1,
                title: '已付款年报'
              }
            ]
          },
          {
            icon: 'el-icon-edit-outline',
            index: '5',
            show:this.$store.state.userInfo.type==1,
            title: '工资管理',
            subs: [
              {
                index: 'wages',
                show:this.$store.state.userInfo.type==1,
                title: '工资管理'
              }
            ]
          }
        ]
      }
    },
    computed: {
      onRoutes() {
       if(this.$route.path.lastIndexOf('-')>0){
         return this.$route.path.split('-')[0].replace('/', '');
       }else {
         return this.$route.path.replace('/', '');
       }

      }
    },
    created() {
      console.log(this.$store.state.userInfo)

     // console.log(loginUser)
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })

    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
  }
  .el-submenu__title i{ color:#84361d}
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px; overflow-y: auto;
  }

  /*.el-menu-item:hover{*/
    /*background-color: #f4b5d0 !important;*/
  /*}*/
  /*.el-submenu__title:hover{*/
    /*background-color: #f4b5d0 !important;*/
  /*}*/
  .sidebar > ul {
    height: 100%;
  }
</style>
