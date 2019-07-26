<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 工作单日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input clearable style="width: 120px" v-model="select.number" placeholder="工单号" class="handle-input mr10"></el-input>
        <el-date-picker style="vertical-align: middle" v-model="select.date" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-select v-model="select.supplier_id" filterable clearable placeholder="用户" style="width: 160px">
          <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
      </div>




      <el-table :data="tableData" border>
        <el-table-column prop="work_number" label="工作单号" width="130"></el-table-column>
        <el-table-column prop="creat_time" label="日期" width="140" :formatter="formatDate"></el-table-column>
        <el-table-column  label="用户" width="120">
          <template slot-scope="scope">
            {{scope.row.supplier_name?scope.row.supplier_name:scope.row.user_name}}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="120"></el-table-column>
        <el-table-column prop="behavior" label="行为"></el-table-column>
        <el-table-column prop="log_remarks" label="描述"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count" :current-page.sync="pageIndex">
        </el-pagination>
      </div>
    </div>


    <!-- 删除提示框 -->
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageIndex:1,
        pageSize:10,
        tableData: [],
        select:{
          number:"",
          supplier_id:'',
          date:''
        },
        supplierList:[],
        count:0,
        delVisible: false,
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
      this.getData();
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_log&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.tableData.splice(_this.idx, 1);
            _this.$message.success('删除成功');
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getData();
      },
      formatDate(row, column) {
        return moment(row.creat_time).format("YYYY-MM-DD HH:mm:ss");
      },
      searchData(){
        this.getData();
      },
      getData(){
        let _this=this;
        let date='';
        if(this.select.date){
          let d=[];
          d.push(new Date(this.select.date[0]).getTime());
          d.push(new Date(this.select.date[1]).getTime());
          date='&date='+d;
        }
        $_get('/Views/admin/business/getWorkLog.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+'&workNumber='+_this.select.number+'&supplierId='+(_this.select.supplier_id?_this.select.supplier_id:0)+date).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data.list;
            _this.count=response.data.count;
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

