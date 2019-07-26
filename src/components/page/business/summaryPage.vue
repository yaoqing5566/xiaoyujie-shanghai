<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 制作部经理-业务信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12" style="padding-left: 10px">指定年月</span>
        <el-date-picker v-model="select.year" type="month" placeholder="年份"></el-date-picker>
        <el-button type="primary"  @click="searchData">查询</el-button>
      </div>


      <div class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <tbody>
            <tr>
              <th>
                <div class="cell">工资信息&nbsp;&nbsp;&nbsp;&nbsp;预付奖金：<strong style="color: red; font-size: 16px">{{total}}</strong></div>
              </th>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="work_number" label="工作人员">
          <template slot-scope="scope">
            {{scope.row.supplier_number+' （'+scope.row.supplier_name+"）"}}
          </template>
        </el-table-column>
        <el-table-column prop="supplier_type" :formatter="formatType" label="角色"></el-table-column>
        <el-table-column prop="total" align="right" label="工资"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 查看 -->
    <el-dialog :close-on-click-modal="false" :title="detailData[0].supplier_name+'奖金明细'" :visible.sync="showVisible" width="650px" class="seeDetail">
      <div style="padding: 0 0 20px 10px">
        <div style="text-align: right; padding-bottom: 10px"><el-button type="primary" @click="exportSp()">导出</el-button></div>
        <el-table :data="detailData" border style="width: 100%">
          <el-table-column label="日期" prop="bonus_date"></el-table-column>
          <el-table-column label="工作内容">
            <template slot-scope="scope">
              {{scope.row.work_content.length>1?scope.row.work_content:config.wagesType[scope.row.work_content]}}
            </template>
          </el-table-column>
          <el-table-column label="工作单名称">
            <template slot-scope="scope">
              {{scope.row.work_name}}
            </template>
          </el-table-column>
          <el-table-column label="奖金" prop="bonus" align="right"></el-table-column>
          <el-table-column label="备注" prop="bonus_remarks"></el-table-column>
        </el-table>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        select:{
          year:moment().format('YYYY-MM')
        },
        detailData:[{supplier_name:''}],
        total:0,
        config:CONFIG,
        showVisible:false
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
      exportSp(){
        let _this=this;
        let startTime=moment(new Date(_this.select.year)).startOf('month').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('month').format('X')*1000;
        let sId=this.detailData[0].supplier_id;
        window.open('/Views/admin/business/exportBonusDetails.aspx?startTime='+startTime+"&endTime="+endTime+"&sId="+sId)
      },
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
      handleEdit(data){
        this.detailData=data.lists;
        this.showVisible=true;
        console.log(data.lists)
      },
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
      formatType(row, column, cellValue, index) {
        let json=JSON.parse(cellValue);
        return json.join();
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
        let startTime=moment(new Date(_this.select.year)).startOf('month').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('month').format('X')*1000;
        $_get('/Views/admin/business/getWages.aspx?startTime='+startTime+"&endTime="+endTime).then(function (response) {
          if(response.code==1){
            _this.tableData=_this.resetData(response.data);

            console.log(_this.tableData)
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      resetData(arrayOld){
        this.total=0;
        let newArr=[];
        for (let i in arrayOld) {
          this.total+=arrayOld[i].bonus?parseInt(arrayOld[i].bonus):0;
          arrayOld[i].bonus_date=moment(arrayOld[i].bonus_date).format("YYYY-MM-DD");
          let supplier_id=arrayOld[i].supplier_id;
          let da=newArr.filter(function (val,index,arr) {
            if(val.supplier_id==supplier_id){
              return val
            }
          })
          if(da.length>0){
            da[0].total+=arrayOld[i].bonus?parseInt(arrayOld[i].bonus):0;
            da[0].lists.push(arrayOld[i])
          }else {
            newArr.push(
              {
                supplier_id:supplier_id,
                supplier_name:arrayOld[i].supplier_name,
                supplier_number:arrayOld[i].supplier_number,
                supplier_type:arrayOld[i].supplier_type,
                total:arrayOld[i].bonus?parseInt(arrayOld[i].bonus):0,
                lists:[arrayOld[i]]
              }
            )
          }
        }
        return newArr;
      }
    }
  }

</script>

<style >
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
  .seeDetail .el-dialog__body{ padding-top: 0px}
</style>

