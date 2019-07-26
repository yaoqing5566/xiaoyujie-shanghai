import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      //console.log("后退")
      return savedPosition
    } else {
     // console.log("前进")
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children:[
        {
          path: '/user',
          component: resolve => require(['../components/page/user.vue'], resolve),
          meta: { title: '管理员管理' }
        },
        {
          path: '/customerInfo',
          component: resolve => require(['../components/page/baseInfo/customerInfo.vue'], resolve),
          meta: { title: '客户资料' }
        },
        {
          path: '/customerInfo-add',
          component: resolve => require(['../components/page/baseInfo/addCustomer.vue'], resolve),
          meta: { title: '新加客户资料' }
        },
        {
          path: '/soundStudio',
          component: resolve => require(['../components/page/baseInfo/soundStudio.vue'], resolve),
          meta: { title: '录音室' }
        },
        {
          path: '/supplier',
          component: resolve => require(['../components/page/baseInfo/supplier.vue'], resolve),
          meta: { title: '供应方' }
        },
        {
          path: '/supplier-add',
          component: resolve => require(['../components/page/baseInfo/addSupplier.vue'], resolve),
          meta: { title: '新增供应方' }
        },
        {
          path: '/mywork',
          component: resolve => require(['../components/page/business/mywork.vue'], resolve),
          meta: { title: '我的工作单' }
        },
        {
          path: '/myworkAdd',
          component: resolve => require(['../components/page/business/myworkAdd.vue'], resolve),
          meta: { title: '新增工作单' }
        },
        {
          path: '/quotation',
          component: resolve => require(['../components/page/business/quotation.vue'], resolve),
          meta: { title: '报价单' }
        }, {
          path: '/quotation2',
          component: resolve => require(['../components/page/business/quotation2.vue'], resolve),
          meta: { title: '报价单' }
        },
        {
          path: '/scheduling',
          component: resolve => require(['../components/page/business/scheduling.vue'], resolve),
          meta: { title: '排班' }
        },
        {
          path: '/scheduling-add',
          component: resolve => require(['../components/page/business/schedulingAdd.vue'], resolve),
          meta: { title: '新建排班' }
        },
        {
          path: '/manageMyWork',
          component: resolve => require(['../components/page/business/manageMyWork.vue'], resolve),
          meta: { title: '管理工作单' }
        },
        {
          path: '/addContacts',
          component: resolve => require(['../components/page/business/addContacts.vue'], resolve),
          meta: { title: '新建联系人' }
        },
        {
          path: '/addWorkSupplier',
          component: resolve => require(['../components/page/business/addWorkSupplier.vue'], resolve),
          meta: { title: '设定供应方' }
        },
        {
          path: '/payable',
          component: resolve => require(['../components/page/business/payable.vue'], resolve),
          meta: { title: '应付款管理' }
        },
        {
          path: '/receivables',
          component: resolve => require(['../components/page/business/receivables.vue'], resolve),
          meta: { title: '应收款管理' }
        },
        {
          path: '/seeScheduling',
          component: resolve => require(['../components/page/business/seeScheduling.vue'], resolve),
          meta: { title: '排班表查看' }
        },
        {
          path: '/receivablesQuery',
          component: resolve => require(['../components/page/business/receivablesQuery.vue'], resolve),
          meta: { title: '应收款查询' }
        },
        {
          path: '/receivablesQuery2',
          component: resolve => require(['../components/page/business/receivablesQuery2.vue'], resolve),
          meta: { title: '已收款查询' }
        },
        {
          path: '/payableQuery',
          component: resolve => require(['../components/page/business/payableQuery.vue'], resolve),
          meta: { title: '应付款查询' }
        },
        {
          path: '/paidQuery',
          component: resolve => require(['../components/page/business/paidQuery.vue'], resolve),
          meta: { title: '已付款查询' }
        },
        {
          path: '/bonus',
          component: resolve => require(['../components/page/business/bonus.vue'], resolve),
          meta: { title: '设定奖金' }
        },
        {
          path: '/summaryPage',
          component: resolve => require(['../components/page/business/summaryPage.vue'], resolve),
          meta: { title: '制作部经理汇总页' }
        },
        {
          path: '/reimbursement',
          component: resolve => require(['../components/page/business/reimbursement.vue'], resolve),
          meta: { title: '报销管理' }
        },
        {
          path: '/workloadDetail',
          component: resolve => require(['../components/page/business/workloadDetail.vue'], resolve),
          meta: { title: '工作量报表' }
        },
        {
          path: '/turnover',
          component: resolve => require(['../components/page/business/turnover.vue'], resolve),
          meta: { title: '营业额统计' }
        },
        {
          path: '/receivablesYear',
          component: resolve => require(['../components/page/business/receivablesYear.vue'], resolve),
          meta: { title: '已收款年报' }
        },
        {
          path: '/paidYear',
          component: resolve => require(['../components/page/business/paidYear.vue'], resolve),
          meta: { title: '已付款年报' }
        },
        {
          path: '/customerRanking',
          component: resolve => require(['../components/page/business/customerRanking.vue'], resolve),
          meta: { title: '客户营收信息排行榜' }
        },
        {
          path: '/wages',
          component: resolve => require(['../components/page/business/wages.vue'], resolve),
          meta: { title: '工资管理' }
        },
        {
          path: '/workLog',
          component: resolve => require(['../components/page/business/workLog.vue'], resolve),
          meta: { title: '工作单日志' }
        },
        {
          path: '/crossSection',
          component: resolve => require(['../components/page/business/crossSection.vue'], resolve),
          meta: { title: '交片统计' }
        },
        {
          path: '/workIntention',
          component: resolve => require(['../components/page/business/workIntention.vue'], resolve),
          meta: { title: '工作意向单' }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
