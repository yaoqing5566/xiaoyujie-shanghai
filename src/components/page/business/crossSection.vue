<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 交片统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span class="font-size12" style="padding-left: 10px">年份</span>
        <el-date-picker v-model="select.year" type="month" placeholder="年份"></el-date-picker>
        <el-select v-model="select.work_content" clearable  placeholder="请选择" >
          <el-option v-for="(item,index) in config.wagesType" :key="item" :label="item" :value="index"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
      </div>


      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
            <thead>
            <tr>
              <th colspan="3">
                <div class="cell">
                  合计&nbsp;&nbsp;<span style="color: #00a854">{{total}}</span>
                </div>
              </th>
            </tr>
            <tr>
              <th><div class="cell">工作单</div></th>
              <th><div class="cell">完成时间</div></th>
              <th><div class="cell">备注</div></th>
            </tr>
            </thead>

            <tbody v-for="pitem in tableData">
               <tr>
                 <th colspan="3" style="background-color: #fdfcf9;">
                   <div class="cell">{{pitem.supplier_name}}
                     <a href="javascript:;;" style="color: #0f74a8">月交片百分比：{{pitem.lists.length | percentage }}</a>
                   </div>
                 </th>
               </tr>
               <tr v-for="titem in pitem.lists">
                 <td><div class="cell">{{titem.work_number+'&nbsp;&nbsp;'+titem.work_name}}</div></td>
                 <td><div class="cell">{{titem.bonus_date}}</div></td>
                 <td><div class="cell">{{titem.bonus_remarks}}</div></td>
               </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>




  </div>
</template>

<script>
  let vm;
  export default {
    data() {
      vm=this;
      return {
        tableData: [],
        total:0,
        select:{
          work_content:'',
          year:moment().format('YYYY-MM')
        },
        config:CONFIG,
        delVisible: false
      }
    },
    filters: {
      percentage(da){
         let per=((da/vm.total)*100).toFixed(2);
         return per+'%';
         console.log(da)
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
        if(this.select.year){
          console.log(this.select)
          this.getData();
        }
      },
      getData(){
        let _this=this;
        let startTime=moment(new Date(_this.select.year)).startOf('month').format('X')*1000;
        let endTime=moment(new Date(_this.select.year)).endOf('month').format('X')*1000;
        $_get('/Views/admin/statistics/getCrossSection.aspx?startTime='+startTime+"&endTime="+endTime+"&workContent="+_this.select.work_content).then(function (response) {
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
          this.total++;
          arrayOld[i].bonus_date=moment(arrayOld[i].bonus_date).format("YYYY-MM-DD HH:mm:ss");
          let supplier_id=arrayOld[i].supplier_id;
          let da=newArr.filter(function (val,index,arr) {
            if(val.supplier_id==supplier_id){
              return val
            }
          })
          if(da.length>0){
            da[0].lists.push(arrayOld[i])
          }else {
            newArr.push(
              {
                supplier_id:supplier_id,
                supplier_name:arrayOld[i].supplier_name,
                supplier_number:arrayOld[i].supplier_number,
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

