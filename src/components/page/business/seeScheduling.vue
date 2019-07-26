<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 排班表查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12">工作单号</span>
        <el-input clearable style="width: 120px" v-model="select.number" placeholder="工作单号" class="handle-input mr10"></el-input>
        <span class="font-size12" style="padding-left: 10px">年份</span>
        <el-date-picker v-model="select.year" type="month" placeholder="年份"></el-date-picker>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <el-button type="primary" style="float: right"  @click="exportScheduling">导出</el-button>
      </div>


      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
            <thead>
            <tr>
              <th colspan="11">
                <div class="cell">
                  当月&nbsp;&nbsp;<span style="display: inline-block; margin-right: 10px" v-for="(item,index) in categoryCount" v-if="item>0">
                  {{config.schedulingCategory[index]}}班：<span style="color: #00a854">{{item}}</span>
                </span>
                </div>
              </th>
            </tr>
            <tr>
              <th width="110"><div class="cell">开始->结束时间</div></th>
              <th><div class="cell">工作单</div></th>
              <th><div class="cell">客户</div></th>
              <th><div class="cell">名称</div></th>
              <th><div class="cell">录音室</div></th>
              <th><div class="cell">录音师</div></th>
              <th><div class="cell">供应方</div></th>
              <th><div class="cell">类别</div></th>
              <th><div class="cell">备注</div></th>
              <th><div class="cell">工作内容</div></th>
              <th><div class="cell">排班人</div></th>
            </tr>
            </thead>

            <tbody v-for="item in tableData">
               <tr>
                 <th colspan="11" style="background-color: #fdfcf9;">
                   <div class="cell">{{item.date}}</div>
                 </th>
               </tr>
               <tr v-for="item2 in item.lists">
                 <td>
                   <div class="cell">{{item2.start_time | formatTime("HH:mm")}}->{{item2.end_time | formatTime("HH:mm")}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.work_number}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.customer_name}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.name?item2.name:''}}  {{item2.gz_title?item2.gz_title:''}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.sound_studio_name}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.cms_supplier_name}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.suppliers | formatSuppliers}}</div>
                 </td>
                 <td>
                   <div class="cell">{{config.schedulingCategory[item2.pb_category]}}</div>
                 </td>
                 <td>
                   <div class="cell">
                     <el-tag  v-if="item2.work_scheduling_state==1" size="mini" type="success">已审核</el-tag>{{item2.remarks}}
                   </div>
                 </td>
                 <td>
                   <div class="cell">{{config.workNature[item2.content]}}</div>
                 </td>
                 <td>
                   <div class="cell">{{item2.user_name}}</div>
                 </td>
               </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>



    <!-- 删除提示框 -->
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        categoryCount:[0,0,0,0,0],
        tableData: [],
        listDates:[],
        select:{
          number:'',
          year:moment().format('YYYY-MM')
        },
        form: {
          number: '',
          year: '',
          type:"1",
          address:''
        },
        config:CONFIG,
        delVisible: false
      }
    },
    filters: {
      formatTime(date, f) {
        return moment(date).format(f);
      },
      formatSuppliers(arr){
        let d=JSON.parse(arr);
        let str='';
        for(let i in d){
          str+="["+d[i].supplier_name+"]"+d[i].supplier_number+'；';
        }
        return str;
      }
    },
    created() {
      this.getData();
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      searchData(){
        console.log(this.select)
        this.getData();
      },
      exportScheduling(){
        if(this.listDates.length==0){
          return;
        }
        window.open("/Views/admin/business/exportScheduling.aspx?dates="+this.listDates)
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getSchedulingByDate.aspx?date='+moment(new Date(_this.select.year)).format('YYYY-MM')+'&workNumber='+_this.select.number).then(function (response) {
          if(response.code==1){
            _this.tableData=_this.resetDate(response.data);
            console.log(_this.tableData)
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      resetDate(arr){
        this.listDates=[];
        this.categoryCount=[0,0,0,0,0];
        let arrs=[];
        for(let i in arr){
          let lb=arr[i].pb_category;
          this.categoryCount[lb]++;
          let key=arr[i].scheduling_date;
          let da=arrs.filter(function (val,index,arr) {
            if(val.date==key){
              return val
            }
          })
          if(da.length>0){
            da[0].lists.push(arr[i]);
          }else {
            this.listDates.push(key);
            arrs.push(
              {
                date:key,
                lists:[arr[i]]
              }
            )
          }
        }
        return arrs;
      }
    }
  }

</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  .up-img-banner {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 10px
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
</style>

