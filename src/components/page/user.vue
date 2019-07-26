<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 管理员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="text-align: right">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,-1,'add')">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="user_email"  label="账号"></el-table-column>
        <el-table-column  label="类型">
          <template slot-scope="scope">
              <div v-if="scope.row.user_type==1">老板</div>
              <div v-if="scope.row.user_type==2">管理员</div>
              <div v-if="scope.row.user_type==3">员工(公司能登陆哦！)</div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="user_pwd"  label="密码"></el-table-column>-->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row,'edit')" plain>编辑</el-button>
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
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="85px" :rules="rules">
        <el-form-item label="账号" prop="user_email">
          <el-input v-model="form.user_email"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="user_type">
          <el-select  v-model="form.user_type" placeholder="" style="width: 100%">
            <el-option value="1" label="老板"></el-option>
            <el-option value="2" label="管理员"></el-option>
            <el-option value="3" label="员工(在公司才能登陆系统)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="user_pwd">
          <el-input type="password" v-model="form.user_pwd"></el-input>
        </el-form-item>
        <el-form-item label="绑定成员">
          <el-select v-model="form.supplier_id" filterable placeholder="未绑定" style="width: 100%">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
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
        pageType:"1",
        activeIndex: "1",
        tableData: [],
        dialogName:'添加',
        pageIndex:1,
        pageSize:10,
        count:0,
        subTitle:'',
        form: {
          user_email: '',
          user_pwd:'',
          user_type:'',
          supplier_id:''
        },
        rules: {
          user_email: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          user_pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          user_type: [
            {required: true, message: '请选择类型', trigger: 'change'},
          ]
        },
        supplierList:[],
        delVisible: false,
        editVisible: false
      }
    },
    created() {
      let _this=this;
      this.getData();
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
      getData(){
        let _this=this;
        $_get('/Views/admin/readUser.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+'&type='+_this.activeIndex).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data.list;
            _this.count=response.data.count;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      submitForm(formName) {
        let _this=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url='/Views/admin/addUser.aspx';
            let sa={
              user_email:this.form.user_email,
              user_pwd:this.form.user_pwd,
              user_name:this.form.user_email,
              user_type:this.form.user_type
            };

            if(this.form.supplier_id){
              sa.supplier_id=this.form.supplier_id;
            }

            let saveData={
              data:JSON.stringify(sa)
            }
            if(this.dialogName=='修改'){//修改
              url='/Views/admin/updateUser.aspx';
              saveData.id=_this.form.user_id;
            }
            console.log(this.form)
            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                _this.editVisible = false;
                _this.getData();
              }else {
                _this.$message.error(response.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
          console.log()
        })
      },
      handleEdit(index, row,type) {
        this.dialogName='添加';
        this.subTitle='';
        this.form = {
          user_email: '',
          user_pwd:'',
          user_type:'',
          supplier_id:''
        }
        if(type=='edit'){
          this.dialogName='修改';
          this.idx = index;
          const item = this.tableData[index];
          this.form = {
            user_email:item.user_email,
            user_pwd:item.user_pwd,
            user_id:item.user_id,
            user_type:item.user_type+"",
            supplier_id:item.supplier_id==0?'':item.supplier_id,
          }

        }
        this.editVisible = true;
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.user_id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow(){
        let _this = this;
        $_get('/Views/admin/deleteUser.aspx?ID=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.tableData.splice(_this.idx, 1);
            _this.$message.success('删除成功');
            _this.delVisible = false;
          } else {
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

