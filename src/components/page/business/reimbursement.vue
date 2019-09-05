<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报销管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input style="width: 120px" clearable v-model="select.rsNumber" placeholder="编号" class="handle-input mr10"></el-input>
        <el-select v-model="select.rsState" placeholder="状态" class="handle-select mr10">
          <el-option v-for="(item,index) in config.reimbursement.state" :label="item" :key="index" :value="index"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="searchData">查询</el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,-1,'add')">新建</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="rs_number"  label="编号"></el-table-column>
        <el-table-column label="关联工作单">
          <template slot-scope="scope">
            {{scope.row.work_number+scope.row.work_name}}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            {{config.reimbursement.cause[scope.row.rs_type]}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div  :class="'new-state'+scope.row.rs_state">
              <el-select v-if="$store.state.userInfo.type==1" v-model="scope.row.rs_state" @change="onSelectedDrug($event, scope.row)"
                         placeholder="状态" class="handle-select mr10" style="width: 100%">
                <el-option :class="'label-new-state'+index" v-for="(item,index) in config.reimbursement.state" :label="item" :key="index" :value="index"></el-option>
              </el-select>
              <span v-else>{{config.reimbursement.state[scope.row.rs_state]}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rs_cost"  label="费用" align="right"></el-table-column>
        <el-table-column   label="申请人">
          <template slot-scope="scope">
            {{scope.row.supplier_name?scope.row.supplier_name:scope.row.user_name}}
          </template>
        </el-table-column>
        <el-table-column prop="creat_time" :formatter="formatDate" sortable  label="申请时间"></el-table-column>
        <el-table-column prop="rs_remarks"  label="备注"></el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <!--<el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row,'edit')" plain>编辑</el-button>-->
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="350px">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="工作编号" prop="work_number_id">
          <el-select v-model="form.work_number_id" filterable placeholder="请输入编号" style="width: 100%">
            <el-option v-for="item in workList" :key="item.id" :label="item.work_number+'  '+item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="supplier_id">
          <el-select v-model="form.supplier_id" filterable placeholder="人员"  style="width: 100%">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用" prop="rs_cost">
          <el-input v-model="form.rs_cost"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="rs_type">
          <el-select v-model="form.rs_type" placeholder="" class="handle-select mr10" style="width: 100%">
            <el-option v-for="(item,index) in config.reimbursement.cause" :label="item" :key="index" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="address">
          <el-input v-model="form.rs_remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </span>
    </el-dialog>

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
        dialogName:'添加',
        tableData: [],
        supplierList:[],
        pageIndex:1,
        pageSize:10,
        count:0,
        select:{
          rsState:'',
          rsNumber:''
        },
        form: {
          work_number_id: '',
          rs_cost:'',
          rs_type:'',
          rs_remarks:'',
          user_id:'',
          supplier_id:''
        },
        workList:[],
        rules: {
          work_number_id: [
            { required: true, message: '请输入工作编号', trigger: 'blur' }
          ],
          supplier_id: [
            { required: true, message: '请选择人员', trigger: 'blur' }
          ],
          rs_cost: [
            { required: true, message: '请输入费用', trigger: 'blur' }
          ],
          rs_type: [
            { required: true, message: '请输入类型', trigger: 'blur' }
          ]
        },
        config:CONFIG,
        delVisible: false,
        editVisible: false
      }
    },
    created() {
      let _this=this;
      this.getData();
      this.getWork();
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
      onSelectedDrug(event,item) {
        console.log(item)
        let _this=this;
        let saveData={
          data:JSON.stringify({rs_state:item.rs_state}),
          id:item.id
        }
        $_post("/Views/admin/updateTable.aspx?T=work_reimbursement",saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.getData();
            _this.editVisible=false;
          }else {
            _this.$message.error(response.msg);
          }
        })

      },
      formatDate(row, column) {
        return moment(row.creat_time).format("YYYY-MM-DD");
      },
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/business/addReimbursement.aspx';
            if(!_this.idx){//新建
              _this.form.user_id=_this.$store.state.userInfo.id;
            }
            let saveData={
              data:JSON.stringify(_this.form)
            }
            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                _this.getData();
                _this.editVisible=false;
              }else {
                _this.$message.error(response.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      searchData(){
        console.log(this.select)
        this.getData();
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getData();
      },
      handleSelect(key, keyPath) {
        this.pageIndex=1;
        this.activeIndex=key;
        this.getData();
        console.log(key, keyPath);
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_reimbursement&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.tableData.splice(_this.idx, 1);
            _this.$message.success('删除成功');
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleEdit(index, row,type) {
        this.dialogName='新建';
        this.idx='';
        this.form = {
          work_number_id: '',
          rs_cost:'',
          rs_type:'',
          rs_remarks:'',
          supplier_id:''
        }
        if(type=='edit'){
          this.dialogName='修改';
          this.idx = row.id;
          const item = row;
          this.form = {
            work_number_id: item.work_number_id,
            rs_cost: item.rs_cost,
            rs_type:item.rs_type,
            rs_remarks:item.rs_remarks,
          }
        }

        this.editVisible = true;
      },
      getWork(){
        let _this=this;
        $_get('/Views/admin/business/readWorkSimple.aspx?pageIndex=1&pageSize=2000').then(function (response) {
          if(response.code==1){
            _this.workList=response.data.list;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      getData(){
        let _this=this;
        let state=_this.select.rsState?_this.select.rsState:-1;
        $_get('/Views/admin/business/getReimbursement.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+
          '&rsNumber='+_this.select.rsNumber+'&rsState='+state).then(function (response) {
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
  .new-state1 .el-input__inner{
    color: #f791a3;
  }
  .new-state2 .el-input__inner{
    color: red;
  }
</style>

