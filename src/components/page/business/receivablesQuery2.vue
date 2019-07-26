<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 已收款查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12" style="padding-left: 10px">指定年月</span>
        <el-date-picker v-model="select.year" type="month" placeholder="年份"></el-date-picker>
        <el-select v-model="select.finance" placeholder="银行账户" class="handle-select mr10">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(items,index) in config.financial_account" :key="index" :label="items" :value="index"></el-option>
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
                <div class="cell">总额：<strong style="color: red; font-size: 16px">{{total}}</strong></div>
              </th>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="receivables_date" :formatter="formatDate" width="86" sortable label="日期"></el-table-column>
        <el-table-column prop="customer_name" label="公司名称"></el-table-column>
        <el-table-column prop="liaison" label="联系人" width="60"></el-table-column>
        <el-table-column prop="work_number" label="业务">
          <template slot-scope="scope">
            {{scope.row.work_name}}（{{scope.row.work_number}}）
          </template>
        </el-table-column>
        <el-table-column prop="receivables_zqf" :formatter="formatIsEmpty" align="right" width="55"  label="作曲费"></el-table-column>
        <el-table-column prop="receivables_bqyyf" :formatter="formatIsEmpty" align="right" width="55"  label="版权音乐"></el-table-column>
        <el-table-column prop="receivables_tgf" :formatter="formatIsEmpty" align="right" width="55"  label="退稿费"></el-table-column>
        <el-table-column prop="receivables_ycf" :formatter="formatIsEmpty" align="right" width="55"  label="演唱费"></el-table-column>
        <el-table-column prop="receivables_jingle" :formatter="formatIsEmpty" align="right" width="55"  label="jingle"></el-table-column>
        <el-table-column prop="receivables_xqf" :formatter="formatIsEmpty" align="right" width="55"  label="选曲费"></el-table-column>
        <el-table-column prop="receivables_lyf" :formatter="formatIsEmpty" align="right" width="55"  label="录音费"></el-table-column>
        <el-table-column prop="receivables_pyf" :formatter="formatIsEmpty" align="right" width="55"  label="配音费"></el-table-column>
        <el-table-column prop="receivables_gz" :formatter="formatIsEmpty" align="right" width="55"  label="广州"></el-table-column>
        <el-table-column prop="receivables_gzpy" :formatter="formatIsEmpty" align="right" width="55"  label="广州配音"></el-table-column>
        <el-table-column prop="receivables_khfy" :formatter="formatIsEmpty" align="right" width="55"  label="客户费用"></el-table-column>
        <el-table-column prop="receivables_tax" :formatter="formatIsEmpty" align="right" width="55"  label="税"></el-table-column>
        <el-table-column prop="receivables_bqjy" :formatter="formatIsEmpty" align="right" width="55"  label="版权交易"></el-table-column>
        <el-table-column prop="receivables_authorize" :formatter="formatIsEmpty" align="right" width="55"  label="授权"></el-table-column>
        <el-table-column prop="receivables_other" :formatter="formatIsEmpty"  align="right" width="55"  label="其他"></el-table-column>
        <el-table-column prop="receivables_total_cost" :formatter="formatIsEmpty" align="right" width="65" label="总费用"></el-table-column>
        <el-table-column prop="receivables_remarks" label="备注"></el-table-column>
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
          finance:'',
          year:moment().format('YYYY-MM')
        },
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
      this.getData();
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      formatDate(row, column) {
        return moment(row.receivables_date).format("YYYY-MM-DD");
      },
      formatIsEmpty(row, column, cellValue, index){
        return cellValue?cellValue:0;
      },
      searchData(){
        if(this.select.year){
          console.log(this.select)
          this.getData();
        }
      },
      getData(){
        let _this=this;
        _this.total=0;
        let startTime=moment(new Date(_this.select.year)).startOf('month').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('month').format('X')*1000;
        $_get('/Views/admin/business/receivablesQuery2.aspx?startTime='+startTime+"&endTime="+endTime+"&finance="+_this.select.finance).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data;
            for (let i in _this.tableData) {
              _this.total+=_this.tableData[i].receivables_total_cost;
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

