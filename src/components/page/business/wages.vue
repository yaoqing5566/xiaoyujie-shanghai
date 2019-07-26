<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 工资管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="text-align: left; overflow: hidden">
        <el-date-picker v-model="select.year" type="month" placeholder="月份"></el-date-picker>
        <el-button type="primary"  @click="searchData">查询</el-button>
        <el-button style="float: right" type="primary" class="handle-del mr10" @click="handleAdd('add')">新增</el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="supplier_name" width="80" label="姓名"></el-table-column>
        <el-table-column prop="wages_date" width="85" label="日期" :formatter="formatDate"></el-table-column>
        <el-table-column label="工资">
          <template slot-scope="scope">
            <div>
              <strong>底薪部分></strong>
              <span>应发工资:</span>{{scope.row.wages_yfgz}},
              <span>单位缴纳基数:</span>{{scope.row.wages_dwjnjs}},
              <span>养老:</span>{{scope.row.wages_yl}},
              <span>医保:</span>{{scope.row.wages_yb}},
              <span>失业保险:</span>{{scope.row.wages_sybx}},
              <span>合计:</span>{{scope.row.wages_hj}},
              <span>代扣公积金:</span>{{scope.row.wages_dkgjj}},
              <span>实发薪资:</span>{{scope.row.wages_sfxz}}
            </div>
            <div>
              <strong>奖金部分></strong>
              <span>底薪补差:</span>{{scope.row.wages_dxbc}},
              <span>车贴饭贴:</span>{{scope.row.wages_ctft}},
              <span>录音提成:</span>{{scope.row.wages_lytc}},
              <span>作曲提成:</span>{{scope.row.wages_zqtc}},
              <span>游戏音效提成:</span>{{scope.row.wages_yxyxtc}},
              <span>选曲提成:</span>{{scope.row.wages_xqtc}},
              <span>歌手演唱:</span>{{scope.row.wages_gsyc}},
              <span>个人补缴返回:</span>{{scope.row.wages_grbjfh}},
              <span>奖金合计:</span>{{scope.row.wages_jjhj}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="small" style="margin-left: 5px" type="primary" @click="handleAdd('edit',scope.$index, scope.row)" plain>编辑</el-button>
            <el-button style="margin-left: 5px" size="small" type="warning" @click="exportData(scope.row)" plain>导出</el-button>
            <el-button size="small" style="margin-left: 5px" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="600" class="add-receivables">

      <el-form ref="form" :model="form" label-width="111px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item clearable label="日期" prop="wages_date">
              <el-date-picker  @change="changeDate" v-model="form.wages_date" type="month" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员" prop="supplier_id">
              <el-select clearable v-model="form.supplier_id"  @change="handleSelect(form.supplier_id)" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <h4 style="padding: 10px 0px 10px 55px;">底薪部分</h4>
          <el-col :span="12">
            <el-form-item label="应发工资">
              <div class="el-input el-input--small">
                <input clearable @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_yfgz">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位缴纳基数">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_dwjnjs">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="养老">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_yl">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医保">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_yb">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失业保险">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_sybx">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合计">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_hj">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代扣公积金">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_dkgjj">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实发薪资">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_sfxz">
              </div>
            </el-form-item>
          </el-col>
          <h4 style="padding: 10px 0px 10px 55px;">奖金部分</h4>
          <el-col :span="12">
            <el-form-item label="底薪补差">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_dxbc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车贴饭贴">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_ctft">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录音提成">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_lytc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作曲提成">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_zqtc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游戏音效提成">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_yxyxtc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选曲提成">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_xqtc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="歌手演唱">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_gsyc">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人补缴返回">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_grbjfh">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖金合计">
              <div class="el-input el-input--small">
                <input clearable  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.wages_jjhj">
              </div>
            </el-form-item>
          </el-col>


        </el-row>
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
        supplierList:[],
        dialogName:'新增',
        tableData:[],
        select:{
          year:new Date()
        },
        form: {
          supplier_id:'',
          wages_date:'',
          wages_yfgz:'', //应发工资
          wages_dwjnjs:'', //单位缴纳基数
          wages_yl:'', //养老
          wages_yb:'', //医保
          wages_sybx:'', //失业保险
          wages_hj:'', //合计
          wages_dkgjj:'', //代扣公积金
          wages_sfxz:'', //实发薪资
          wages_dxbc:'', //底薪补差
          wages_ctft:'', //车贴饭贴
          wages_lytc:'', //录音提成
          wages_zqtc:'', //作曲提成
          wages_yxyxtc:'', //游戏音效提成
          wages_xqtc:'', //选曲提成
          wages_gsyc:'', //歌手演唱
          wages_grbjfh:'', //个人补缴返回
          wages_jjhj:'', //奖金合计
        },
        rules: {
          wages_date: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          supplier_id: [
            { required: true, message: '请选择人员', trigger: 'change' }
          ]
        },
        editVisible:false,
        delVisible:false
      }
    },
    filters:{
      formatIsEmpty(data){
        return data?data:0;
      },
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

      _this.getData();
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      exportData(da){
        window.open("/Views/admin/business/exportWages.aspx?id="+da.id+"&month="+moment(da.wages_date).format("MM"))
      },
      computedSum(){//计算总和
        this.form.wages_jjhj=0;
        this.form.wages_jjhj+=this.form.wages_dxbc?parseFloat(this.form.wages_dxbc):0;
        this.form.wages_jjhj+=this.form.wages_ctft?parseFloat(this.form.wages_ctft):0;
        this.form.wages_jjhj+=this.form.wages_lytc?parseFloat(this.form.wages_lytc):0;
        this.form.wages_jjhj+=this.form.wages_zqtc?parseFloat(this.form.wages_zqtc):0;
        this.form.wages_jjhj+=this.form.wages_yxyxtc?parseFloat(this.form.wages_yxyxtc):0;
        this.form.wages_jjhj+=this.form.wages_xqtc?parseFloat(this.form.wages_xqtc):0;
        this.form.wages_jjhj+=this.form.wages_gsyc?parseFloat(this.form.wages_gsyc):0;
        this.form.wages_jjhj+=this.form.wages_grbjfh?parseFloat(this.form.wages_grbjfh):0;
      },
      handleSelect(id) {
       this.changeDateAndSupplier();
      },
      changeDate(date){
        this.changeDateAndSupplier()
      },
      changeDateAndSupplier(){
        let _this=this;
        if(_this.form.wages_date&&_this.form.supplier_id){
          let startTime=moment(new Date(_this.form.wages_date)).startOf('month').format('X')*1000;
          let endTime=moment(new Date(_this.form.wages_date)).endOf('month').format('X')*1000;
          $_get('/Views/admin/business/getBonusBySupplierId.aspx?startTime='+startTime+'&endTime='+endTime+'&supplierId='+_this.form.supplier_id).then(function (response) {
            if(response.code==1){
                let da=response.data;
                let map={};
                for(let i in da){
                  if(map.hasOwnProperty(da[i].work_content)){
                    map[da[i].work_content]+=parseInt(da[i].bonus);
                  }else {
                    map[da[i].work_content]=parseInt(da[i].bonus);
                  }
                }
                // 奖金关联
              _this.form.wages_lytc=map[0];
              _this.form.wages_zqtc=map[1];
              _this.form.wages_yxyxtc=map[2];
              _this.form.wages_xqtc=map[3];
              _this.form.wages_gsyc=map[4];
              _this.computedSum();
            }else {
              _this.$message.error(response.msg);
            }
          })
        }
      },
      searchData(){
        if(this.select.year){
          console.log(this.select)
          this.getData();
        }
      },
      getData(){
        let _this=this;
        let time=moment(_this.select.year).startOf("month").format('X')*1000;
        $_get('/Views/admin/business/readWages.aspx?time='+time+"&endTime=1").then(function (response) {
          if(response.code==1){
            _this.tableData=response.data;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/business/wages.aspx';
            if(_this.dialogName=='新增'){//新增
              _this.form.user_id=_this.$store.state.userInfo.id;
            }
            _this.form.wages_date=moment(_this.form.wages_date).startOf("month").format('X')*1000;
            let dataObj=JSON.parse(JSON.stringify(_this.form))
            for(let i in dataObj){
              if(!dataObj[i]){
                delete dataObj[i]
              }
            }

            let saveData={
              data:JSON.stringify(dataObj),
              id:'add'
            }
            if(_this.eidx){//编辑
              saveData.id=_this.eidx.id;
            }
            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                _this.getData();
                _this.editVisible = false;
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
      handleAdd(data,index,row){
        this.eidx = '';
        this.editVisible=true;
        this.dialogName='新增';
        for(let key in this.form){
          this.form[key]='';
        }
        if(data!='add'){
          this.dialogName='修改';
          this.eidx = row;
          const item = row;
          for(let key in this.form){
            this.form[key]=item[key];
          }
        }
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=wages&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.tableData.splice(_this.idx, 1);
            _this.$message.success('删除成功');
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      isNumber(e){
        // console.log(e.target.value)
        if(/[^\-?\d.]/g.test(e.target.value)){
          e.target.value=''
        }
        this.computedSum();
      },
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
    }
  }

</script>

<style>
  .add-receivables .el-dialog__body{ padding-left: 0px}
  .add-receivables .el-form-item__label{overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; }
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
  .receivables-cost{ max-width: 60px}
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

