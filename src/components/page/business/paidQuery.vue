<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 已付款查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12" style="padding-left: 10px">指定年月</span>
        <el-date-picker v-model="select.year" type="month" placeholder="年份"></el-date-picker>
        <span class="font-size12" style="padding-left: 10px">部门</span>
        <el-select v-model="select.department" placeholder="部门" class="handle-select mr10">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(items,index) in config.payable_department" :key="index" :label="items" :value="index"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <el-button type="primary" style="float: right" @click="exportPayable()">导出</el-button>
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
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="payable_date" :formatter="formatDate" width="86" sortable label="日期"></el-table-column>
        <el-table-column label="业务">
          <template slot-scope="scope">
            {{scope.row.work_number+'-'+scope.row.work_name}}
          </template>
        </el-table-column>
        <el-table-column prop="supplier_name"   label="收款人"></el-table-column>
        <el-table-column prop="payable_cost" :formatter="formatIsEmpty" align="right" label="费用"></el-table-column>
        <el-table-column  label="工种">
          <template slot-scope="scope">
            {{scope.row.work_supplier_identity+' '+scope.row.job_content}}
          </template>
        </el-table-column>
        <el-table-column prop="payable_remarks" label="备注"></el-table-column>
      </el-table>

    </div>




  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection:[],
        select:{
          department:'',
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      exportPayable(){
        let ids=[];
        let arrs=this.multipleSelection;
        if(arrs.length==0){
          this.$message.error("请选择导出的内容！")
          return
        }
        for(let i in arrs){
          ids.push(arrs[i].id)
        }
        window.open("/Views/admin/business/exportPayableQuery.aspx?type=2&ids="+ids)
      },
      formatDate(row, column) {
        return moment(row.payable_date).format("YYYY-MM-DD");
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
        $_get('/Views/admin/business/payableQuery.aspx?state=1&startTime='+startTime+"&endTime="+endTime+"&department="+_this.select.department).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data;
            for (let i in _this.tableData) {
              _this.total+=_this.tableData[i].payable_cost;
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

