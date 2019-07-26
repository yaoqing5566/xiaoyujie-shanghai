<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 设定供应方</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-back"  @click="$store.commit('goBack')"></el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,-1,'add')">新建</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="identity"  label="身份"></el-table-column>
        <el-table-column prop="supplier_name"  label="供应方名称"></el-table-column>
        <el-table-column prop="supplier_number"  label="供应方编号"></el-table-column>
        <el-table-column prop="job_content"  label="工作内容"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row,'edit')" plain>编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="450px">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="身份" prop="identity">
          <el-input v-model="form.identity"></el-input>
        </el-form-item>
        <el-form-item label="供应方" prop="work_id">
          <el-select v-model="form.supplier_id" filterable placeholder="请选择" style="width: 100%" @change="choseSupplier">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作内容" prop="job_content">
          <el-input v-model="form.job_content"></el-input>
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
        supplierItem:'',
        form: {
          identity:'',//身份
          job_content:'',//工作内容
          work_id:'',
          supplier_id:'',
          supplier_number:'',
          supplier_name:'',
          supplier_mobile:'',
        },
        rules: {
          identity: [
            { required: true, message: '请输入身份', trigger: 'blur' }
          ],
          job_content: [
            { required: true, message: '请输入工作内容', trigger: 'blur' }
          ],
          work_id: [
            { required: true, message: '请输选择供应方', trigger: 'blur' }
          ]
        },
        delVisible: false,
        editVisible: false
      }
    },
    created() {
      let _this=this;
      this.form.work_id=this.$route.query.workId;
      if(this.form.work_id){
        this.getData();
      }
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
      choseSupplier(id){
        let item=this.getSupplierRow(id);
        if(item){
          this.form.supplier_id=item.id;
          this.form.supplier_number=item.number;
          this.form.supplier_name=item.name;
          this.form.supplier_mobile=item.mobile;
        }

      },
      getSupplierRow(id){
        let d=this.supplierList;
        for(let index in d){
          if(id==d[index].id){
            return d[index];
          }
        }
        return false;
      },
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/addTable.aspx?T=work_supplier';
            let ms_user=JSON.parse(localStorage.getItem('ms_user'));
            if(!_this.eidx) {//新建
              _this.form.user_id=ms_user.id;
              _this.form.user_name=ms_user.name;
            }
            let saveData={
              data:JSON.stringify(_this.form)
            }
            if(_this.eidx){//更新
              url='/Views/admin/updateTable.aspx?T=work_supplier';
              saveData.id=_this.eidx;
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
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_supplier&id=' + _this.removeId).then(function (response) {
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
        this.eidx='';
        this.form.identity='';
        this.form.job_content='';
        this.form.supplier_id='';
        this.form.supplier_number='';
        this.form.supplier_name='';
        this.form.supplier_mobile='';
        if(type=='edit'){
          this.dialogName='修改';
          console.log(row)
          this.eidx = row.id;
          const item = row;
          this.form.identity=item.identity;
          this.form.job_content=item.job_content;
          this.form.supplier_id=parseInt(item.supplier_id);
          this.form.supplier_number=item.supplier_number;
          this.form.supplier_name=item.supplier_name;
          this.form.supplier_mobile=item.supplier_mobile;
        }

        this.editVisible = true;
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getWorkIdByDetail.aspx?T=work_supplier&workId=' + _this.form.work_id).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            _this.tableData=da;
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

