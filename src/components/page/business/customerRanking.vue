<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 客户营收信息排行榜</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker v-model="select.year" type="year" placeholder="工作单年份"></el-date-picker>
        <el-button type="primary"  @click="searchData">查询</el-button>
      </div>

      <el-table :data="tableData" border :default-sort = "{prop: 'cost', order: 'descending'}">
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="cName" label="客户"></el-table-column>
        <el-table-column label="工作单量" align="right">
          <template slot-scope="scope">
            {{scope.row.lists.length}}
          </template>
        </el-table-column>
        <el-table-column label="已完成工作单量" align="right">
          <template slot-scope="scope">
            {{scope.row.lists | getCount(2)}}
          </template>
        </el-table-column>
        <el-table-column label="已取消工作单量" align="right">
          <template slot-scope="scope">
            {{scope.row.lists | getCount(3)}}
          </template>
        </el-table-column>
        <el-table-column prop="cost" sortable label="已收款" align="right"></el-table-column>
      </el-table>


    </div>




  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        pageIndex:1,
        pageSize:10,
        count:0,
        select:{
          year:''
        },
        total:0,
        config:CONFIG
      }
    },
    filters: {
      formatTime(date, f) {
        return moment(date).format(f);
      },
      getCount(arr,type){
        console.log(arr)
        if(type==2){
          let newArr=arr.filter((val)=>{
           return val.state==2;
          })
          return newArr.length;
        }
        if(type==3){
          let newArr=arr.filter((val)=>{
            return val.state>2;
          })
          return newArr.length;
        }
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
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
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
        $_get('/Views/admin/statistics/customerRanking.aspx?startTime='+startTime+"&endTime="+endTime).then(function (response) {
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
        let newArr=[];
        for(let i in arrs){
            var cId = arrs[i].cid;
            var cName = arrs[i].name;
            var cost = parseInt(arrs[i].cost?arrs[i].cost:0);
            let da = newArr.filter(function (val, index, arr) {
              if (val.cId == cId) {
                return val
              }
            })
            if (da.length > 0) {
              da[0].cost+=cost;
              da[0].lists.push(arrs[i])
            } else {
              newArr.push(
                {
                  cId: cId,
                  cName:cName,
                  cost:cost,
                  lists: [arrs[i]]
                }
              )
            }
        }
        this.tableData=newArr;
        console.log(newArr)
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

