<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 已付款年报</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!--<el-select v-model="select.type" placeholder="按日统计" class="handle-select mr10" @change="onSelectedDrug($event)">-->
          <!--<el-option label="按月统计" value="1"></el-option>-->
          <!--<el-option label="按年统计" value="2"></el-option>-->
        <!--</el-select>-->
        <el-date-picker  v-if="select.type==1" v-model="select.year" type="year" placeholder="付款年份"></el-date-picker>
        <el-date-picker  v-if="select.type==2" v-model="select.year" type="year" placeholder="付款年份"></el-date-picker>
        <el-select v-model="select.supplier_id" filterable placeholder="供应方编号" style="width: 160px">
          <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <!--<el-button type="primary" style="float: right" >导出</el-button>-->
      </div>

      <div class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small" style="width:800px; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <tbody>
            <tr>
              <th>
                <div class="cell">总额：<strong style="color: red; font-size: 16px">{{total}}</strong></div>
              </th>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


      <el-table :data="tableData" border style="width: 800px">
        <el-table-column prop="date" label="月份"></el-table-column>
        <el-table-column prop="total" label="数额" align="right"></el-table-column>
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
          supplier_id:'',
          year:''
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
      let _this=this;
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
      searchData(){
        if(this.select.year&&this.select.supplier_id){
          console.log(this.select)
          this.getData();
        }else {
          this.$message.error("请选择日期和供应方编号！")
        }
      },
      getData(){
        let _this=this;
        let startTime=moment(new Date(_this.select.year)).startOf('year').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('year').format('X')*1000;
        $_get('/Views/admin/statistics/paidYear.aspx?startTime='+startTime+"&endTime="+endTime+"&sid="+_this.select.supplier_id).then(function (response) {
          if(response.code==1){
            _this.formatData(response.data);
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      formatData(arrs){
        let _this=this;
        this.tableData=[];
        _this.total=0;
        let year=moment(_this.select.year).format("YYYY");
        let newData={};
        for(var i=1;i<13;i++){
          let mounth=i<10?('0')+i:i;
          let key=year+'-'+mounth;
          newData[key]={
            total:0
          }
        }
        for(let j in arrs) {
          let row = arrs[j];
          let rowDate = moment(row.date).format("YYYY-MM");
          newData[rowDate].total+=(row.cost?parseInt(row.cost):0);
          _this.total+=(row.cost?parseInt(row.cost):0);
        }
        let newArr=[];
        for(let m in newData){
          let nD=newData[m];
          nD.date=m.split("-")[1];
          newArr.push(nD);
        }
        this.tableData=newArr;
        console.log(this.tableData)
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

