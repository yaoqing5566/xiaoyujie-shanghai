<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 营业额统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="select.type" placeholder="按日统计" class="handle-select mr10" @change="onSelectedDrug($event)">
          <el-option label="按日统计" value="1"></el-option>
          <el-option label="按月统计" value="2"></el-option>
          <el-option label="按年统计" value="3"></el-option>
        </el-select>
        <el-date-picker v-if="select.type==1" v-model="select.year" type="month" placeholder="指定年月(工作单日期)"></el-date-picker>
        <el-date-picker v-if="select.type==2" v-model="select.year" type="year" placeholder="指定年份(工作单日期)"></el-date-picker>
        <el-date-picker v-if="select.type==3" v-model="select.year" type="year"  placeholder="截止年份(工作单日期)"></el-date-picker>
        <el-button type="primary"  @click="searchData">查询</el-button>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small" style="max-width: 950px; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <tbody>
            <tr>
              <th>
                <div class="cell">
                  总额：<strong style="color: red; font-size: 16px">{{tableTotal.total}}</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  总单数：<strong style="color: red; font-size: 16px">{{tableTotal.count}}</strong></div>
              </th>
            </tr>
            </tbody>
          </table>
        </div>
      </div>


      <el-table :data="tableData" border style="max-width: 950px">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="total" label="营业额" align="right"></el-table-column>
        <el-table-column prop="count" label="单数" align="right"></el-table-column>
      </el-table>


    </div>




  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        tableTotal:{
          total:0,
          count:0
        },
        select:{
          type:'1',
          year:''
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
      let _this=this;

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
        if(this.select.year){
          console.log(this.select)
          this.getData();
        }
      },
      getData(){
        let _this=this;
        let startTime,endTime;
        if(this.select.type==3){
          let dq=parseInt(moment(_this.select.year).format("YYYY"))-7+"-01-01";
          startTime=moment(dq).format('X')*1000;
          endTime=moment(_this.select.year).endOf('year').format('X')*1000;
          console.log(startTime,endTime)
        }else {
         let d=this.select.type=='1'?'month':'year';
          startTime=moment(_this.select.year).startOf(d).format('X')*1000;
          endTime=moment(_this.select.year).endOf(d).format('X')*1000;
          //console.log(startTime,endTime)
        }
        $_get('/Views/admin/business/turnover.aspx?startTime='+startTime+"&endTime="+endTime).then(function (response) {
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
        this.tableTotal.total=0;
        this.tableTotal.count=0;
        if(this.select.type==1){
          let newData={};
          let start=moment(_this.select.year).startOf('month').format("YYYY-MM-DD");
          let end=moment(_this.select.year).endOf('month').format("YYYY-MM-DD");
          let length=end.split('-')[2];
          for(let i=0;i<length;i++){
            let date=moment(start).add(i, 'days').format("YYYY-MM-DD");
            newData[date]=[0,0];
          }
          for(let j in arrs){
            let row=arrs[j];
            let rowDate=moment(row.date).format("YYYY-MM-DD");
            newData[rowDate][0]+=row.offer?row.offer:0;
            if(row.offer>0){
              newData[rowDate][1]+=1
              this.tableTotal.count=this.tableTotal.count+1;
            }
            this.tableTotal.total+=row.offer?row.offer:0;

            console.log(rowDate)
          }
          let newArr=[];
          for(let m in newData){
            newArr.push({
              date:m.split('-')[2],
              total:newData[m][0],
              count:newData[m][1]
            })
          }
          this.tableData=newArr;
        }
        if(this.select.type==2){
          let year=moment(_this.select.year).format("YYYY");
          let newData={};
          for(var i=1;i<13;i++){
            let mounth=i<10?('0')+i:i;
            let key=year+'-'+mounth;
            newData[key]=[0,0]
          }
          for(let j in arrs){
            let row=arrs[j];
            let rowDate=moment(row.date).format("YYYY-MM");
            newData[rowDate][0]+=row.offer?row.offer:0;
            if(row.offer>0){
              newData[rowDate][1]+=1;
              this.tableTotal.count=this.tableTotal.count+1;
            }
            this.tableTotal.total+=row.offer?row.offer:0;

            console.log(rowDate)
          }
          let newArr=[];
          for(let m in newData){
            newArr.push({
              date:m.split('-')[1],
              total:newData[m][0],
              count:newData[m][1]
            })
          }
          this.tableData=newArr;
          console.log(newData)
        }
        if(this.select.type==3){
          let year=moment(_this.select.year).format("YYYY");
          let newData={};
          for(var i=0;i<7;i++){
            let key=year-i;
            newData[key]=[0,0]
          }
          console.log(newData)
          for(let j in arrs){
            let row=arrs[j];
            let rowDate=moment(row.date).format("YYYY");
            console.log(rowDate)
            newData[rowDate][0]+=row.offer?row.offer:0;
            if(row.offer>0){
              newData[rowDate][1]+=1;
              this.tableTotal.count=this.tableTotal.count+1;
            }

            this.tableTotal.total+=row.offer?row.offer:0;
            console.log(rowDate)
          }
          let newArr=[];
          for(let m in newData){
            newArr.push({
              date:m,
              total:newData[m][0],
              count:newData[m][1]
            })
          }
          this.tableData=newArr;
          console.log(newData)
        }





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

