<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 已收款年报</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12" style="padding-left: 10px">指定年月</span>
        <el-date-picker v-model="select.year" type="year" placeholder="收款年份"></el-date-picker>
        <el-select clearable class="inline-input" v-model="select.customer_id" filterable placeholder="客户编号" style="width: 160px">
          <el-option v-for="item in restaurants" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
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
        <el-table-column prop="date" label="月份"></el-table-column>
        <el-table-column prop="zqfTotal" label="作曲费" align="right"></el-table-column>
        <el-table-column prop="lyOther" label="录音及其余" align="right"></el-table-column>
        <el-table-column prop="taxTotal" label="税" align="right"></el-table-column>
        <el-table-column prop="otherTotal" label="其他" align="right"></el-table-column>
        <el-table-column prop="zqfTotal" :formatter="formatPercentage" label="作曲费比例" align="right"></el-table-column>
        <el-table-column prop="lyOther" :formatter="formatPercentage" label="录音及其余比例" align="right"></el-table-column>
        <el-table-column prop="taxTotal" :formatter="formatPercentage" label="税比例" align="right"></el-table-column>
        <el-table-column prop="otherTotal" :formatter="formatPercentage" label="其他比例" align="right"></el-table-column>
        <el-table-column prop="total" label="总额" align="right"></el-table-column>
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
          customer_id:'',
          year:''
        },
        restaurants:[],
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
      $_get('/Views/admin/business/getCustomerNumber.aspx').then(function (response) {
        if(response.code==1){
          _this.restaurants=response.data.list
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
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
      formatPercentage(row, column, cellValue, index) {
        let str=0;
        let total=row.total;
        if(total==0){
          str=0;
        }else {
          str=((cellValue/total)*100).toFixed(2)
        }
        return str+"%";
      },
      searchData(){
        if(this.select.year){
          console.log(this.select)
          this.getData();
        }else {
          this.$message.error("请选择日期！")
        }
      },
      getData(){
        let _this=this;
        let startTime=moment(new Date(_this.select.year)).startOf('year').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('year').format('X')*1000;
        let cid=_this.select.customer_id?_this.select.customer_id:0;
        $_get('/Views/admin/business/receivablesYear.aspx?startTime='+startTime+"&endTime="+endTime+"&cid="+cid).then(function (response) {
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
            zqfTotal:0,
            lyOther:0,
            taxTotal:0,
            otherTotal:0,
            total:0
          }
        }
        console.log(newData)
        for(let j in arrs){
          let row=arrs[j];
          let rowDate=moment(row.date).format("YYYY-MM");

          //作曲费包含以下
          let allZqf=(row.zqf?parseInt(row.zqf):0) //作曲费
                      +(row.bqyyf?parseInt(row.bqyyf):0)//版权音乐费
                      +(row.tgf?parseInt(row.tgf):0)//退稿费
                      +(row.ycf?parseInt(row.ycf):0)//演唱费
                      +(row.jingle?parseInt(row.jingle):0)//jingle
                      +(row.khfy?parseInt(row.khfy):0)//客户费用
                      +(row.bqjy?parseInt(row.bqjy):0)//版权交易
                      +(row.authorize?parseInt(row.authorize):0);//授权
          newData[rowDate].zqfTotal+=allZqf;

          //录音及其余
          let allLyqy=(row.xqf?parseInt(row.xqf):0) //选曲费
                      +(row.lyf?parseInt(row.lyf):0)//录音费
                      +(row.pyf?parseInt(row.pyf):0)//配音费
                      +(row.gz?parseInt(row.gz):0)//广州
                      +(row.gzpy?parseInt(row.gzpy):0)//广州配音
          newData[rowDate].lyOther+=allLyqy;
          newData[rowDate].taxTotal+=(row.tax?parseInt(row.tax):0);
          newData[rowDate].total+=(row.total?parseInt(row.total):0);
          _this.total+=(row.total?parseInt(row.total):0);
          console.log(rowDate)
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

