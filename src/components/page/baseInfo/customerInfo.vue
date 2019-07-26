<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 客户资料</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input style="width: 120px" clearable v-model="select.number" placeholder="编号" class="handle-input mr10"></el-input>
        <el-input style="width: 120px" clearable v-model="select.name" placeholder="名称" class="handle-input mr10"></el-input>
        <el-select v-model="select.nature" placeholder="性质" class="handle-select mr10">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(items,index) in config.cpNature" :key="index" :label="items" :value="index"></el-option>
        </el-select>
        <el-select v-model="select.backdrop" placeholder="背景" class="handle-select mr10">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(items,index) in config.cpBackground" :key="index" :label="items" :value="index"></el-option>
        </el-select>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <el-button type="primary" style="float: right" icon="delete" class="handle-del mr10" @click="handleEdit()">新建</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="number"  label="编号"></el-table-column>
        <el-table-column prop="name"  label="名称"></el-table-column>
        <el-table-column prop="fullName"  label="全名"></el-table-column>
        <el-table-column prop="key_contacts"  label="主要联络人"></el-table-column>
        <el-table-column prop="phone"  label="电话"></el-table-column>
        <el-table-column prop="mobile"  label="手机"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count">
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
        tableData: [],
        pageIndex:1,
        pageSize:10,
        delVisible: false,
        count:0,
        select:{
          number:'',
          name:'',
          nature:'-1',
          backdrop:'-1'
        },
        config:CONFIG
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
        console.log(this.select)
        this.getData();
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=customer&id=' + _this.removeId).then(function (response) {
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
      handleEdit(a,b){
        console.log(b)
        if(b){
          this.$router.push({path:'/customerInfo-add',query:{id:b.id}});
        }else {
          this.$router.push({path:'/customerInfo-add'});
        }

      },
      getData(){
        let _this=this;
        $_get('/Views/admin/info/readCustomer.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+
          '&nature='+_this.select.nature+'&backdrop='+_this.select.backdrop+
          '&number='+_this.select.number+'&name='+_this.select.name).then(function (response) {
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

