<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 工作量明细表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="select.type" placeholder="按日统计" class="handle-select mr10" @change="onSelectedDrug($event)">
          <el-option label="按日统计" value="1"></el-option>
          <el-option label="按月统计" value="2"></el-option>
          <el-option label="按年统计" value="3"></el-option>
        </el-select>
        <el-date-picker v-if="select.type==1" v-model="select.year" type="date" placeholder="日期"></el-date-picker>
        <el-date-picker v-if="select.type==2" v-model="select.year" type="month" placeholder="月份"></el-date-picker>
        <el-date-picker v-if="select.type==3" v-model="select.year" type="year" placeholder="年份"></el-date-picker>
        <el-select v-model="select.supplier_id" filterable placeholder="用户账号" style="width: 160px">
          <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <!--<el-button type="primary" style="float: right" >导出</el-button>-->
      </div>


      <div class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <tbody>
            <tr>
              <th>
                <div class="cell">
                  <h5 style="display: inline-block; margin-right: 20px">奖金分配</h5>
                  合计：<strong style="color: red; font-size: 16px">{{total}}</strong></div>
              </th>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="work_number" label="工作单位"></el-table-column>
        <el-table-column prop="work_name" label="名称"></el-table-column>
        <el-table-column prop="bonus_date" :formatter="formatDate" sortable label="日期"></el-table-column>
        <el-table-column prop="bonus" label="奖金"></el-table-column>
        <el-table-column prop="bonus_remarks" label="备注"></el-table-column>
      </el-table>

    </div>




  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        select:{
          type:"1",
          year:"",
          supplier_id:''
        },
        supplierList:[],
        total:0,
        config:CONFIG
      }
    },
    filters: {
      formatTime(date, f) {
        return moment(date).format(f);
      }
    },
    created() {
      var _this=this;
      //this.getData();
      //获取供应方列表
      $_get('/Views/admin/info/readSupplier.aspx?pageIndex=1&pageSize=1000&number=&name=').then(function (response) {
        if(response.code==1){
          _this.supplierList=response.data.list;
        }else {
          _this.$message.error(response.msg);
        }
      })
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      onSelectedDrug(event) {
        this.select.year="";
      },
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
      formatIsEmpty(row, column, cellValue, index){
        return cellValue?cellValue:0;
      },
      searchData(){
        if(!this.select.year){
          this.$message.error("请选择赛选日期"); return;
        }
        if(!this.select.supplier_id){
          this.$message.error("请输入赛选用户"); return;
        }
        this.getData();
      },
      getData(){
        let _this=this;
        _this.total=0;
        var dateType="";
        if(_this.select.type==1){
          dateType="day";
        }else if(_this.select.type==2){
          dateType="month";
        }else {
          dateType="year";
        }
        let startTime=moment(new Date(_this.select.year)).startOf(dateType).format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf(dateType).format('X')*1000;
        console.log(moment(startTime).format("YYYY-MM-DD HH:mm:ss"),moment(endTime).format("YYYY-MM-DD HH:mm:ss"))
        $_get('/Views/admin/statistics/getWorkloadDetail.aspx?startTime='+startTime+"&endTime="+endTime+"&supId="+_this.select.supplier_id).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data;
            for (let i in _this.tableData) {
              _this.total+=_this.tableData[i].bonus;
            }
            console.log(_this.tableData)
          }else {
            _this.$message.error(response.msg);
          }
        })
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

