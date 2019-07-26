<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 设定奖金</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <div class="handle-box" style="text-align: left">
        <el-button type="primary" icon="el-icon-back"  @click="$store.commit('goBack')"></el-button>
        <el-button type="primary" style="float: right" icon="delete" class="handle-del mr10" @click="handleEdit(-1,'add')">添加奖金</el-button>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <thead>
            <tr>
              <th style="background:#f0f0f0" colspan="6">
                <div class="cell">已设置奖金信息</div>
              </th>
            </tr>
            <tr>
              <th colspan="6">
                <div class="cell">工作单：{{workDetail.name}}</div>
              </th>
            </tr>
            <tr>
              <td><div class="cell">日期</div></td>
              <td><div class="cell">人员</div></td>
              <td><div class="cell">工作内容</div></td>
              <td><div class="cell" style="text-align: right">奖金</div></td>
              <td><div class="cell">备注</div></td>
              <td width="150"><div class="cell">操作</div></td>
            </tr>
            </thead>
            <tbody v-for="item in tableData">
            <tr>
              <th colspan="6" style="background-color: #fdfcf9;">
                <div class="cell">{{config.workNature[item.bonus_work_nature]}}</div>
              </th>
            </tr>
            <tr v-for="item2 in item.lists">
              <td><div class="cell">{{item2.bonus_date | formatTime("YYYY-MM-DD") }}</div></td>
              <td><div class="cell">{{item2.supplier_name}}</div></td>
              <td><div class="cell">{{item2.work_content.length>1?item2.work_content:config.wagesType[item2.work_content]}}</div></td>
              <td><div class="cell" style="text-align: right">{{item2.bonus}}</div></td>
              <td><div class="cell">{{item2.bonus_remarks}}</div></td>
              <td>
                <div class="cell">
                  <el-button size="small" type="primary" @click="handleEdit(item2,'edit')" plain>编辑</el-button>
                  <el-button style="margin-left: 5px" size="small" type="danger" @click="handleDelete(item2)">删除</el-button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody>
              <tr>
                <td><div class="cell" style="font-size: 15px; font-weight: bold">合计</div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell" style="text-align: right">{{total}}</div></td>
                <td><div class="cell"></div></td>
                <td><div class="cell"></div></td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>


    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="480px">
      <el-form ref="form" :model="form" label-width="101px" :rules="rules">
        <el-form-item label="日期" prop="bonus_date">
          <el-date-picker v-model="form.bonus_date" type="datetime"
                          :default-time="dqTime" style="width: 100%" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作类型" prop="bonus_work_nature">
          <el-select v-model="form.bonus_work_nature" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in workDetail.work_nature" :key="item" :label="config.workNature[item]" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="supplier_id">
          <el-select v-model="form.supplier_id" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作内容" prop="work_content">
          <el-select v-model="form.work_content"  placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in config.wagesType" :key="item" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <div class="el-input el-input--small">
            <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.bonus">
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.bonus_remarks"></el-input>
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
        form: {
          bonus_date:'',
          bonus_work_nature:'',
          supplier_id:'',
          work_content:'',
          bonus:'',
          bonus_remarks:'',
          work_id:''
        },
        isOne:false,
        workDetail:JSON.parse(localStorage.getItem("workDetail")),
        config:CONFIG,
        rules: {
          bonus_date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          bonus_work_nature: [
            { required: true, message: '请选择工作类型', trigger: 'blur' }
          ],
          work_content: [
            { required: true, message: '请选择工作内容', trigger: 'blur' }
          ],
          supplier_id: [
            { required: true, message: '请选择人员', trigger: 'blur' }
          ],
          bonus: [
            { required: true, message: '请输入奖金', trigger: 'blur' }
          ]
        },
        dqTime:moment().format("HH:mm:ss"),
        workId:'',
        total:0,
        supplierList:[],
        editVisible: false,
        delVisible: false,
      }
    },
    filters: {
      formatTime(date, f) {
        return moment(date).format(f);
      }
    },
    created() {
      let _this=this;
      this.workId=this.$route.query.workId;
      if(this.workId){
        this.getData();
        this.form.work_id=this.workId;
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
    computed: {

    },
    methods: {
      getSupplier(id){
        let da=this.supplierList;
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
            work_id:_this.workId,
            behavior:behavior,
            log_remarks:log_remarks,
            user_id:_this.$store.state.userInfo.id
          })
        }
        $_post('/Views/admin/business/addLog.aspx',saveData).then(function (response) {})
      },
      handleEdit(row,type) {
        this.dialogName='新建';
        this.eidx='';
        this.form.bonus_date='';
        this.form.bonus_work_nature='';
        this.form.supplier_id='';
        this.form.work_content='';
        this.form.bonus='';
        this.form.bonus_remarks='';

        if(type=='edit'){
          this.dialogName='修改';
          this.eidx = row;
          const item = row;
          this.form.bonus_date=item.bonus_date;
          this.form.bonus_work_nature=item.bonus_work_nature;
          this.form.supplier_id=item.supplier_id;
          this.form.work_content=item.work_content.length>1?item.work_content:parseInt(item.work_content);
          this.form.bonus=item.bonus;
          this.form.bonus_remarks=item.bonus_remarks;
        }
        this.editVisible = true;
      },
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let time=moment(_this.form.bonus_date).startOf("month").format('X')*1000;
            let supplier_id=_this.form.supplier_id;
            $_get('/Views/admin/business/readWages.aspx?time='+time+"&sId="+supplier_id).then(function (response) {
              if(response.data.length>0){
                _this.$message.error("该人员这个月的工资已经发放！如果要加奖金可以去工资里面去补交或者删除工资后重新添加！");
              }else {

                let url='/Views/admin/addTable.aspx?T=work_bonus';
                if(_this.dialogName=='新建'){//新建
                  _this.form.user_id=_this.$store.state.userInfo.id;

                }
                _this.form.bonus_date=new Date(_this.form.bonus_date).getTime();
                let saveData={
                  data:JSON.stringify(_this.form)
                }
                if(_this.eidx){//编辑
                  url="/Views/admin/updateTable.aspx?T=work_bonus";
                  saveData.id=_this.eidx.id;
                }
                $_post(url,saveData).then(function (response) {
                  if(response.code==1){
                    _this.$message.success('操作成功');
                    _this.getData();

                    let  uData=_this.getSupplier(supplier_id);
                    if(_this.dialogName=='新建'){
                      _this.addLog('新增奖金','新增'+uData.name+'奖金；奖金:'+_this.form.bonus);
                    }else {
                      _this.addLog('修改奖金','修改'+uData.name+'奖金；奖金:'+_this.form.bonus);
                    }
                    _this.editVisible = false;
                  }else {
                    _this.$message.error(response.msg);
                  }
                })

              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      formatIsEmpty(row, column, cellValue, index){
        return cellValue?cellValue:0;
      },
      isNumber(e){
        console.log(e.target.value)
        if(/[^\-?\d.]/g.test(e.target.value)){
          e.target.value=''
        }
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getBonus.aspx?workID=' + _this.workId).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            _this.tableData=_this.resetData(da);
            console.log(_this.tableData)
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      resetData(arrayOld){
        this.total=0;
        let newArr=[];
        let allId='';
        for (let i in arrayOld) {
          if(arrayOld[i].bonus_type=='all'){
            allId=arrayOld[i].id;
          }else {
            this.total+=arrayOld[i].bonus?parseFloat(arrayOld[i].bonus):0;
            let bonus_work_nature=arrayOld[i].bonus_work_nature;
            let da=newArr.filter(function (val,index,arr) {
              if(val.bonus_work_nature==bonus_work_nature){
                return val
              }
            })
            if(da.length>0){
              da[0].lists.push(arrayOld[i])
            }else {
              newArr.push(
                {
                  bonus_work_nature:bonus_work_nature,
                  lists:[arrayOld[i]]
                }
              )
            }
          }
        }
        if(this.isOne){
          this.addAllTotal(this.total,allId);
        }
        this.isOne=true;
        return newArr;
      },
      addAllTotal(bonus,id){
        let _this=this;
        let data={
          bonus_type:'all', //总和
          work_id:this.workId,
          bonus:bonus
        }
        let saveData={
          data:JSON.stringify(data)
        }
        let url='/Views/admin/addTable.aspx?T=work_bonus';
        if(id){//编辑
          saveData.id=id;
          url="/Views/admin/updateTable.aspx?T=work_bonus";
        }
        console.log(data);

        $_post(url,saveData).then(function (response) {
          if(response.code==1){
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleDelete(row) {
        this.removeId = row.id;
        let  uData=this.getSupplier(row.supplier_id);
        this.deleteStr='删除'+uData.name+'排班；奖金:'+row.bonus;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_bonus&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.$message.success('删除成功');
            _this.addLog('删除排班',_this.deleteStr);
            _this.getData();
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
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

