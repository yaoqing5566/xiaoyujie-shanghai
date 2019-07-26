<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 录音室</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input style="width: 120px" clearable v-model="select.number" placeholder="编号" class="handle-input mr10"></el-input>
        <el-input style="width: 120px" clearable v-model="select.name" placeholder="名称" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="searchData">查询</el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,-1,'add')">新建</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="number"  label="编号"></el-table-column>
        <el-table-column prop="name"  label="名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.type=='1'?'启用':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
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
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="350px">
      <el-form ref="form" :model="form" label-width="70px" :rules="rules">
        <el-form-item label="编号" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="form.type" label="1">启用</el-radio>
          <el-radio v-model="form.type" label="2" style="margin-left: 10px">关闭</el-radio>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
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
        pageIndex:1,
        pageSize:10,
        count:0,
        select:{
          number:'',
          name:''
        },
        form: {
          number: '',
          name: '',
          type:"1",
          address:''
        },
        rules: {
          number: [
            { required: true, message: '请输入编号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        delVisible: false,
        editVisible: false
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
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/info/addStudio.aspx';

            if(!_this.idx){//新建
              _this.form.user_id=_this.$store.state.userInfo.id;
            }
            let saveData={
              data:JSON.stringify(_this.form)
            }
            if(_this.idx){//更新
              url='/Views/admin/info/updateStudio.aspx';
              saveData.id=_this.idx;
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
        $_get('/Views/admin/deleteTable.aspx?T=sound_studio&id=' + _this.removeId).then(function (response) {
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
          number: '',
          name: '',
          type:"1",
          address:''
        }
        if(type=='edit'){
          this.dialogName='修改';
          this.idx = row.id;
          const item = row;
          this.form = {
            number: item.number,
            name: item.name,
            type:item.type,
            address:item.address,
          }
        }

        this.editVisible = true;
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/info/readStudio.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+
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

