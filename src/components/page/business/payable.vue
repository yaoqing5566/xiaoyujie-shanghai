<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 应付款管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-back"  @click="$store.commit('goBack')"></el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,'add')">新建</el-button>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <tbody>
            <tr>
              <th colspan="7">
                <div class="cell">基本单信息</div>
              </th>
            </tr>
            <tr>
              <td colspan="7">
                <div class="cell">工作单：{{workDetail.work_number}}（{{workDetail.name}}）</div>
              </td>
            </tr>
            </tbody>
            <tbody>
            <tr>
              <th><div class="cell">日期</div></th>
              <th><div class="cell">供应方</div></th>
              <th><div class="cell">类型</div></th>
              <th><div class="cell">费用</div></th>
              <th><div class="cell">账户</div></th>
              <th><div class="cell">备注</div></th>
              <th style="width: 150px"><div class="cell">操作</div></th>
            </tr>
            </tbody>
            <tbody v-for="item in tableData" v-if="item.list.length>0">
              <tr><th style="background-color: oldlace" colspan="7"><div class="cell">{{config.payable_department[item.type]}}</div></th></tr>
              <tr v-for="item2 in item.list">
                <td><div class="cell">{{formatDate(item2.payable_date)}}</div></td>
                <td><div class="cell">{{item2.number}}({{item2.supplier_name}})</div></td>
                <td width="150">
                  <div class="cell">
                    <div v-if="$store.state.userInfo.type==1">
                      <el-button  size="small" type="primary" @click="handleState(item2)" plain>{{item2.payable_state==0?'确定已付':'取消已付'}}</el-button>
                    </div>
                    <span v-else>{{item2.payable_state==0?'':'已付'}}</span>
                  </div>
                </td>
                <td><div class="cell">{{item2.payable_cost}}</div></td>
                <td><div class="cell">{{config.financial_account[item2.payable_account]}}</div></td>
                <td><div class="cell">{{item2.payable_remarks}}</div></td>
                <td><div class="cell">
                  <el-button size="small" type="primary" @click="handleEdit(item2,'edit')" plain>编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(item2)">删除</el-button>
                </div></td>
              </tr>
              <tr style="background-color: #fdfdfd">
                <td><div class="cell" style="color: #0f74a8">合计</div></td>
                <td><div class="cell">{{item.list[0].number}}({{item.list[0].supplier_name}})</div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell">{{item.total}}</div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell"></div></td>
              </tr>
            </tbody>
            <!--<tbody>-->
            <!--<tr><th style="background-color: oldlace" colspan="7"><div class="cell">本工作单余额</div></th></tr>-->
            <!--<tr>-->
              <!--<td><div class="cell"></div></td>-->
              <!--<td><div class="cell">合计</div></td>-->
              <!--<td><div class="cell"></div></td>-->
              <!--<td><div class="cell">0</div></td>-->
              <!--<td><div class="cell"></div></td>-->
              <!--<td><div class="cell"></div></td>-->
              <!--<td><div class="cell"></div></td>-->
            <!--</tr>-->
            <!--</tbody>-->
          </table>
        </div>
      </div>

      <div style="font-size: 12px">应付款以红色呈现<br />余额为系统根据供应方自动计算的费用总和：应付款综合</div>


    </div>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="480px">
      <el-form ref="form" :model="form" label-width="101px" :rules="rules">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.payable_date" style="width: 100%" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="费用">
          <el-input v-model="form.payable_cost"></el-input>
        </el-form-item>
        <el-form-item label="供应方(设定)" prop="work_supplier_id">
          <el-select v-model="form.work_supplier_id"  placeholder="请选择" style="width: 200px" >
            <el-option v-for="item in workSupplierList" :key="item.id" :label="item.supplier_name+'('+item.identity+')'" :value="item.id"></el-option>
          </el-select>
          <el-button style="float: right" @click="setWorkSupplier" plain>去设定供应方</el-button>
        </el-form-item>
        <el-form-item label="部门">
          <el-radio-group v-model="form.payable_department">
            <el-radio style="padding-bottom: 0px; margin-bottom: 0px" v-for="(item,index) in config.payable_department" :label="index" :key="index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.payable_remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 确认已付款 -->
    <el-dialog :close-on-click-modal="false" title="选择账户" :visible.sync="editVisible2" width="500" class="add-receivables">
      <el-form style="padding-left: 50px">
        <el-col :span="24">
          <el-form-item label="财务账户:">
            <el-radio-group v-model="payable_account">
              <el-radio style="padding-bottom: 0px" v-for="(item,index) in config.financial_account" :label="index" :key="index">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="submitForm2()">确 定</el-button>
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
        workDetail:'',
        tableData: [],
        workSupplierList:[],
        supplierItem:'',
        form: {
          payable_date:'',
          payable_cost:'',//费用
          work_supplier_id:'',
          payable_department:0,//部门
          payable_remarks:'',
          work_id:'',
        },
        config: CONFIG,
        rules: {
          payable_date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          work_supplier_id: [
            { required: true, message: '请选择供应方', trigger: 'blur' }
          ],
        },
        isAllType:false, //payable_state为3 记录已付总额  0是未付款 1是已经付款
        payable_account:'0',
        delVisible: false,
        editVisible: false,
        editVisible2:false
      }
    },
    created() {
      let _this=this;
      this.form.work_id=this.$route.query.workId;
      if(this.form.work_id){
        this.getData();
      }

      //获取工作单基本信息
      $_get('/Views/admin/getByIdDetail.aspx?T=work_sheet&id=' + _this.form.work_id).then(function (response) {
        if (response.code == 1) {
          let da = response.data;
          _this.workDetail=da[0];
        } else {
          _this.$message.error(response.msg);
        }
      })
      //获取设定供应方
      $_get('/Views/admin/business/getWorkIdByDetail.aspx?T=work_supplier&workId=' + _this.form.work_id).then(function (response) {
        if (response.code == 1) {
          let da = response.data;
          _this.workSupplierList=da;
        } else {
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
      getSupplier(id){
        let da=this.workSupplierList;
        console.log(id,da)
        for(let i in da){
          if(id==da[i].id){
            return da[i];
          }
        }
      },
      addLog(behavior,log_remarks){
        let _this=this;
        let saveData={
          data:JSON.stringify({
            work_id:_this.form.work_id,
            behavior:behavior,
            log_remarks:log_remarks,
            user_id:_this.$store.state.userInfo.id
          })
        }
        $_post('/Views/admin/business/addLog.aspx',saveData).then(function (response) {})
      },
      formatDate(d) {
        var date='';
        if(d){
          date=moment(d).format("YYYY-MM-DD");
        }
        return date;
      },
      setWorkSupplier(){
        this.$router.push({path:'/addWorkSupplier',query:{workId:this.form.work_id}});
      },
      handleState(item){
        this.item=item;
        this.payable_account=item.payable_account?parseInt(item.payable_account):'';
        this.editVisible2=true;
      },
      submitForm2(){
        let _this=this;
        let item=this.item;
        let state=item.payable_state==0?1:0;
        let sdata={payable_state:state,payable_account:_this.payable_account};
        let supplier_id=item.work_supplier_id;
        if(item.payable_state==0){
          sdata.payable_account=_this.payable_account;
        }else{
          sdata.payable_account='';
        }
        let saveData={
          id:item.id,
          data:JSON.stringify(sdata)
        }
        $_post("/Views/admin/updateTable.aspx?T=work_payable",saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
           _this.getData();
            let  uData=_this.getSupplier(supplier_id);
            if(state==1) {//新建
              _this.addLog('确认应付款','已经付给'+uData.supplier_name+'费用；费用:'+item.payable_cost);
            }else {
              _this.addLog('取消应付款','取消付给'+uData.supplier_name+'费用；费用:'+item.payable_cost);
            }
            _this.editVisible2=false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      submitForm(saveData) {
        let _this=this;
        let supplier_id=this.form.work_supplier_id;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/addTable.aspx?T=work_payable';
            let ms_user=JSON.parse(localStorage.getItem('ms_user'));
            if(!_this.eidx) {//新建
              _this.form.user_id=ms_user.id;
              _this.form.user_name=ms_user.name;
            }
            let cloneObj=JSON.parse(JSON.stringify(_this.form));
            cloneObj.payable_date=new Date(_this.form.payable_date).getTime();
            let saveData={
              data:JSON.stringify(cloneObj)
            }
            if(_this.eidx){//更新
              url='/Views/admin/updateTable.aspx?T=work_payable';
              saveData.id=_this.eidx.id;
            }
            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                _this.getData();
                let  uData=_this.getSupplier(supplier_id);
                if(!_this.eidx) {//新建
                  _this.addLog('新增应付款','新增'+uData.supplier_name+'费用；费用:'+_this.form.payable_cost);
                }else {
                  _this.addLog('修改应付款','修改'+uData.supplier_name+'费用；费用:'+_this.form.payable_cost);
                }
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
      handleDelete(row) {
        this.idx = row;
        this.removeId = row.id;
        let  uData=this.getSupplier(row.work_supplier_id);
        this.deleteStr='删除'+uData.supplier_name+'应付款；费用:'+row.payable_cost;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_payable&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.getData();
            _this.$message.success('删除成功');
            _this.addLog('删除应付款',_this.deleteStr);
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleEdit(row,type) {
        this.dialogName='新建';
        this.eidx='';
        this.form.payable_date='';
        this.form.payable_cost='';
        this.form.work_supplier_id='';
        this.form.payable_department=0;
        this.form.payable_remarks='';
        if(type=='edit'){
          this.dialogName='修改';
          console.log(row)
          this.eidx = row;
          const item = row;
          this.form.payable_date=item.payable_date;
          this.form.payable_cost=item.payable_cost;
          this.form.work_supplier_id=item.work_supplier_id;
          this.form.payable_department=item.payable_department;
          this.form.payable_remarks=item.payable_remarks;
        }

        this.editVisible = true;
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getPayable.aspx?workId=' + _this.form.work_id).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            let newData=[{type:'',total:0,list:[]},{type:'',total:0,list:[]},{type:'',total:0,list:[]}];
            let dataAllRow={// 计算已付款总和
              payable_date:new Date().getTime(),
              payable_state:3,
              payable_cost:0,
              payable_department:0,
              work_supplier_id:0,
              work_id:_this.form.work_id
            }
            for (let i in da) {
              if(da[i].payable_state!=3){
                let t=parseFloat(da[i].payable_department);
                newData[t].type=t;
                newData[t].total+=parseFloat(da[i].payable_cost);
                newData[t].list.push(da[i]);
              }

              if(da[i].payable_state==3){
                _this.isAllType=da[i].id;
              }
              if(da[i].payable_state==1){
                dataAllRow.payable_cost+=parseFloat(da[i].payable_cost);
              }
            }

            _this.computePaidleSave(dataAllRow);
            _this.tableData=newData;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      computePaidleSave(data){
        let _this=this;
        if(this.isOne){

          let url='/Views/admin/addTable.aspx?T=work_payable';
          let saveData={
            data:JSON.stringify(data)
          }
          if(this.isAllType){
            url='/Views/admin/updateTable.aspx?T=work_payable';
            saveData.id=_this.isAllType;
          }
          console.log(saveData)
          $_post(url,saveData).then(function (response) {
            if(response.code==1){
            }else {
            }
          })
        }

        this.isOne=true;
      },

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

