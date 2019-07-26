<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 报价单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <strong>工作单：{{workNumber}}</strong>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,-1,'add')">新建</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="version_number"  label="版本号"></el-table-column>
        <el-table-column prop="creat_time"  label="日期" :formatter="formatDate" width="90"></el-table-column>
        <el-table-column prop="total_price"  label="总价" width="80"></el-table-column>
        <el-table-column prop="remarks"  label="描述"></el-table-column>
        <el-table-column label="确认" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.type==0">否</div>
            <div v-else style="color: red">是</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row,'edit')" plain>编辑</el-button>
            <el-button size="small" style="margin-left: 5px" type="primary" @click="handleEdit(scope.$index, scope.row,'copy')" plain>复制</el-button>
            <!--<el-button style="margin-left: 5px" size="small" type="success" @click="confirmType(scope.$index)" plain>{{scope.row.type==0?'确认':'取消'}}</el-button>-->
            <el-button style="margin-left: 5px" size="small" type="info" @click="seeData(scope.$index)" plain>查看</el-button>
            <el-button style="margin-left: 5px" size="small" type="warning" @click="exportData(scope.row)" plain>导出</el-button>
            <el-button style="margin-left: 5px" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>




    <!-- 查看 -->
    <el-dialog :close-on-click-modal="false" title="查看报价单" :visible.sync="showVisible" width="650px" class="quotation-showVisible">
      <el-form ref="form" :model="form" label-width="70px" :rules="rules">
        <el-form-item label="备注" style="margin-bottom: 0px; font-weight: bold">
          {{rowData.remarks}}
        </el-form-item>
        <div style="padding: 0 0 0 30px">
          <h4 style=" line-height: 50px">
            总价&nbsp;&nbsp;&nbsp;{{rowData.total_price}}
          </h4>
          <el-table :data="rowData.projects" border style="width: 100%">
            <el-table-column label="可选分类" prop="category"></el-table-column>
            <el-table-column label="备注" prop="project"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
          </el-table>

        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="goMyWork">返回</el-button>
       </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName+'报价单'" :visible.sync="editVisible" width="850px">
      <el-form ref="form" :model="form" label-width="70px" :rules="rules">
        <el-form-item label="备注">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
        <div style="padding: 0 0 0 30px">
          <h4 style=" line-height: 50px">
            总价&nbsp;&nbsp;&nbsp;<el-input class="tongji" readonly style="width: 100px; text-align: right"  v-model="form.total_price"></el-input>
            <el-button style="float: right;margin-top:9px" @click="addProjects"  type="primary"  class="handle-del mr10">添加</el-button>
          </h4>
          <el-table :data="form.projects" border style="width: 100%">
            <el-table-column label="可选分类" width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.category" placeholder="请选择"  style="width: 100%"  @change="handleSelect(scope.row)">
                  <el-option v-for="(items,index) in config.offerCategory" :key="index" :label="items" :value="items"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input   v-model="scope.row.project"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="160">
              <template slot-scope="scope">
                <el-input  @keyup.native="isNumber(scope.row)"  placeholder="0"  v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="deleteProjects(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="goMyWork">返回</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
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
        workNumber:'',
        workId:'',
        form: {
          version_number:'',
          intention_id:'',
          user_id:'',
          user_name:'',
          remarks:'',
          total_price:0,
          projects:[{category:'',project:'',price:''}]
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
        editVisible: false,
        showVisible: false,
        rowData:'',
        logStr:'',
        config:CONFIG
      }
    },
    created() {
      this.$store.commit('superCanSee'); //
      this.workNumber=localStorage.getItem('workIntentionName');
      console.log(this.workNumber)
      this.workId = this.$route.query.id;
      if(this.workId){
        this.getData();
        this.form.intention_id=this.workId;
      }

    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {
        isTypeTrue(){
          let d=this.tableData;
          for(let i in d){
            if(d[i].type==1){
               return true;
            }
          }
          return false;
        }
    },
    methods: {
      handleSelect(item) {
        item.project=item.category
        console.log(item);
      },
      exportData(da){
        window.open("/Views/admin/business/exportQuotation2.aspx?T=quotation&id="+da.id)
      },

      confirmType(index){
        let _this=this;
        let rowData=this.tableData[index];
        let url='/Views/admin/business/updateWork.aspx';
        let type=rowData.type;
        if(this.isTypeTrue&&type==0){
          this.$message.error("操作失败，请先取消已经确认的报价单后重试！");
          return false;
        }
        let saveData={
          data:JSON.stringify({type:type==0?1:0}),
          id:rowData.id
        }
        let saveDataWork={
          data:JSON.stringify({offer:type==0?rowData.total_price:0,offer_version_number:type==0?rowData.version_number:''}),
          id:rowData.work_id
        }
        $_post("/Views/admin/updateTable.aspx?T=quotation",saveData).then(function (response) {
          if(response.code==1){
            $_post("/Views/admin/business/updateWork.aspx",saveDataWork).then(function (response) {
              if(response.code==1){
                rowData.type=rowData.type==0?1:0;
                _this.$message.success('操作成功');
               // _this.addLog(type==0?"确认报价单价格":"取消报价单价格","价格为："+rowData.total_price);
              }else {
                _this.$message.error("操作失败，请重新操作！");
              }
            })
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      seeData(index){
        let dd=JSON.parse(JSON.stringify(this.tableData[index]));
        this.rowData=dd;
        this.rowData.projects=JSON.parse(this.rowData.projects);
        this.showVisible=true;
      },
      submitForm(){
        let _this=this;
        let url='/Views/admin/addTable.aspx?T=quotation';
        if(this.form.total_price==0){
          _this.$message.error("报价单总价不能为0");
          return;
        }
        let ms_user=JSON.parse(localStorage.getItem('ms_user'));
        _this.form.user_id=ms_user.id;
        _this.form.user_name=ms_user.name;
        _this.form.version_number='V'+new Date().getTime();
        if(this.addId) {//编辑
          delete this.form.user_id;
          delete this.form.user_name;
          delete this.form.version_number;
          delete this.form.work_id;
        }
        let saveData={
          data:JSON.stringify(_this.form)
        }
        if(this.addId){//编辑
          url="/Views/admin/updateTable.aspx?T=quotation";
          saveData.id=this.addId;
        }

        $_post(url,saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.getData();
            if(_this.addId) {//编辑
             // _this.addLog(_this.logStr.str1,_this.logStr.str2+'；'+'现总价：'+_this.form.total_price);
            }else {
             // _this.addLog(_this.logStr.str1+'('+_this.form.version_number+')','总价：'+_this.form.total_price);
            }
            _this.editVisible=false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      addLog(behavior,log_remarks){
        let _this=this;
        let saveData={
          data:JSON.stringify({
            work_id:_this.workId,
            behavior:behavior,
            log_remarks:log_remarks,
            user_id:_this.$store.state.userInfo.id
          })
        }
        $_post('/Views/admin/business/addLog.aspx',saveData).then(function (response) {})
      },
      goMyWork(){
        this.$router.push({path:'/mywork'})
      },
      addProjects(){
        this.form.projects.push({category:'',project:'',price:''});
      },
      deleteProjects(index){
        this.form.projects.splice(index,1)
      },
      isNumber(data){
        if(/[^\-?\d.]/g.test(data.price)){
          data.price='';
        }
        // if(data.price==''){
        //   data.price=0;
        // }
        let tol=0;
        let arr=this.form.projects;
        for(let i in arr){
          tol+=parseFloat(arr[i].price?arr[i].price:0);
        }
        console.log(tol)
        this.form.total_price=tol;
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getData();
      },
      handleDelete(index, row) {
        console.log(row)
        this.idx = index;
        this.removeId = row.id;
        this.deleteNumber=row.version_number;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=quotation&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            //_this.addLog("删除报价单"+'('+_this.deleteNumber+')',"删除报价单");
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
        this.addId='';
        this.form.remarks='';
        this.form.total_price=0;
        this.form.projects=[{category:'',project:'',price:''}];
        if(type=='edit'){
          this.dialogName='修改';
          const item = this.tableData[index];
          this.addId=item.id;
          this.form.remarks=item.remarks;
          this.form.total_price=item.total_price;
          this.form.projects=JSON.parse(item.projects);
        }
        if(type=='copy'){
          this.dialogName='复制';
          const item = this.tableData[index];
          this.form.remarks=item.remarks;
          this.form.total_price=item.total_price;
          this.form.projects=JSON.parse(item.projects);
        }
        this.logStr={
          str1:this.dialogName+'报价单',
          str2:'总价格：'+this.form.total_price
        }
        if(type=='edit'){
          const item = this.tableData[index];
          this.logStr.str1=this.dialogName+'报价单'+'('+item.version_number+')';
          this.logStr.str2="原总价："+this.form.total_price
        }
        if(type=='copy'){
          this.logStr.str2="原总价："+this.form.total_price
        }

        this.editVisible = true;
      },
      formatDate(row, column) {
        return moment(row.creat_time).format("YYYY-MM-DD");
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getQuotation2.aspx?T=quotation&workId=' + _this.workId).then(function (response) {
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

<style>
  .quotation-showVisible .el-dialog__body{ padding-top: 10px}
  .tongji .el-input__inner{text-align: right}
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

