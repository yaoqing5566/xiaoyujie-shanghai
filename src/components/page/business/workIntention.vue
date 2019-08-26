<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 工作意向单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <div class="handle-box" style="">
        <el-button type="primary" icon="search" @click="workSelect">筛选</el-button>
        <el-button icon="search" type="danger" @click="clearSelect">清除</el-button>
        <el-button type="primary" style="float: right" icon="delete" class="handle-del mr10" @click="handleEdit(-1,'add')">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="intention_number"  label="单号"></el-table-column>
        <el-table-column   label="关联单号">
          <template slot-scope="scope">
            {{scope.row.work_number?scope.row.work_number:'无'}}
          </template>
        </el-table-column>
        <el-table-column prop="creat_time"  label="日期" :formatter="formatDate" sortable></el-table-column>
        <el-table-column  label="客户">
          <template slot-scope="scope">
           {{scope.row.customer_number}} （{{scope.row.customer_name_new}}）
          </template>
        </el-table-column>
        <el-table-column prop="name"  label="名称"></el-table-column>
        <el-table-column prop="work_number"  label="状态">
          <template slot-scope="scope">
              <div v-if="scope.row.state==0">录入</div>
              <div v-if="scope.row.state==1" style="color: #0f74a8; font-weight: bold">完成</div>
              <div v-if="scope.row.state==2" style="color: red">取消</div>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="220">
          <template slot-scope="scope">
            <div v-if="scope.row.state!=1">
              <el-button plain type="primary" size="mini" @click="handleEdit(scope.row,'edit')">修改</el-button >
              <el-button plain type="success" @click="goQuotation(scope.row)" size="mini" style="margin-left: 0px">报价单</el-button >
              <el-button plain size="mini" @click="closeIntention(scope.row)" type="danger" style="margin-left: 0px">关闭</el-button>
            </div>
            <div v-else>
              <el-button plain type="primary" size="mini" @click="seeDetail(scope.row)">查看</el-button >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count" :current-page.sync="pageIndex">
        </el-pagination>
      </div>

    </div>

    <!-- 赛选弹出框 -->
    <el-dialog :close-on-click-modal="false" title="工作单查询条件" :visible.sync="workDialog" width="550px">
      <el-form ref="select" :model="select" label-width="68px" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="单号" prop="number">
              <el-input  @keyup.enter.native="selectForm()" clearable v-model="select.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input  @keyup.enter.native="selectForm()" clearable v-model="select.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户">
              <el-input  @keyup.enter.native="selectForm()" clearable v-model="select.cName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日期">
              <el-date-picker style="width: 100%" v-model="select.date" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="my-work-check">
            <el-form-item label="状态" style=" margin-bottom: 8px">
              <el-radio v-model="select.state" label="-1">全部</el-radio>
              <el-radio v-model="select.state" label="0" style="margin-left: 10px">录入</el-radio>
              <el-radio v-model="select.state" label="1" style="margin-left: 10px">完成</el-radio>
              <el-radio v-model="select.state" label="2" style="margin-left: 10px">取消</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="workDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectForm()">查 询</el-button>
            </span>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="480px">
      <el-form ref="form" :model="form" label-width="101px" :rules="rules">
        <el-form-item label="公司 " prop="customer_id">
          <el-select clearable class="inline-input" v-model="form.customer_id" filterable placeholder="请输入公司" style="width: 100%">
            <el-option v-for="item in restaurants" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input clearable v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input clearable v-model="form.remarks"></el-input>
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
                <el-button type="primary">确 定</el-button>
            </span>
    </el-dialog>


    <!-- 关闭工作单 -->
    <el-dialog :close-on-click-modal="false" title="关闭工作意向单" :visible.sync="editVisible3" width="400px">
      <el-select clearable v-model="work_number_id" filterable placeholder="请输入编号" style="width: 100%">
        <el-option  v-for="item in workList" :key="item.id" :label="item.work_number+'  '+item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="confirmClose()">确定直接关闭</el-button>
                <el-button type="primary" @click="transformation()">确定转为工作单</el-button>
                 <el-button type="danger" @click="deleteRow()">直接删除</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogName:'添加',
        pageIndex:1,
        pageSize:10,
        count:0,
        tableData: [],
        restaurants:[],
        form: {
          customer_id:'',
          name:'',
          remarks:''
        },
        workList:[],
        select:{
          number:'',
          name:'',
          cName:'',//客户
          fName:'',//制片
          date:'',
          state:'-1'
        },
        work_number_id:'',
        editVisible3:false,
        repeatRb:false,
        workDialog:false,
        config:CONFIG,
        rules: {
          name: [
            { required: true, message: '请输入名字', trigger: 'blur' }
          ],
          customer_id: [
            { required: true, message: '请选择客户编号', trigger: 'change' }
          ]
        },
        rowItem:'',
        workId:'',
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
      let workIntentionSelect=JSON.parse(sessionStorage.getItem('workIntentionSelect'));
      if(workIntentionSelect){
        this.select=workIntentionSelect;
      }
      let _this=this;
      this.getData();

      $_get('/Views/admin/business/getCustomerNumber.aspx').then(function (response) {
        if(response.code==1){
          _this.restaurants=response.data.list
        }else {
          _this.$message.error(response.msg);
        }
      })
      $_get('/Views/admin/business/readWorkSimple.aspx?pageIndex=1&pageSize=2000').then(function (response) {
        if(response.code==1){
          _this.workList=response.data.list;
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
      deleteRow(){
        let _this = this;
        $_get('/Views/admin/business/deleteIntention.aspx?id=' + _this.rowItem.id).then(function (response) {
          if (response.code == 1) {
            _this.$message.success('删除成功');
            _this.getData();
            _this.editVisible3 = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      transformation(){
        if(!this.work_number_id){
          this.$message.error("请选择工作单！");
          return;
        }
        let _this=this;
        let url="/Views/admin/business/transformationWork.aspx";
        let saveData={
          data:JSON.stringify({work_id:this.work_number_id,state:1}),
          id:this.rowItem.id
        }
        $_post(url,saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.getData();
            _this.editVisible3 = false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      seeDetail(data){
        let search={
          number:data.work_number,
          name:'',
          cName:'',//客户
          fName:'',//制片
          date:'',
          state:[],
          isAddMe:false,//由我创建
          offerChecked:false
        }
        sessionStorage.setItem("myworkSelect",JSON.stringify(search))
        this.$router.push('/mywork')
        console.log(data)
      },
      closeIntention(data){
        this.rowItem=data;
        this.editVisible3 = true;
      },
      confirmClose(){
        let _this=this;
        let saveData={
          data:JSON.stringify({state:2}),
          id:this.rowItem.id
        }
        let url="/Views/admin/updateTable.aspx?T=work_intention";
        $_post(url,saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.getData();
            _this.editVisible3 = false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      goQuotation(data){
        this.$router.push({path:'/quotation2',query:{id:data.id}});
        let workName=data.intention_number+' '+data.name+' ';
        localStorage.setItem('workIntentionName',workName)
      },
      workSelect(){
        this.workDialog=true;
      },
      selectForm(){
        sessionStorage.setItem("workIntentionSelect",JSON.stringify(this.select))
        this.getData();
        this.workDialog=false;
      },
      clearSelect(){
        sessionStorage.removeItem("workIntentionSelect");
        this.select={
          number:'',
          name:'',
          cName:'',//客户
          fName:'',//制片
          date:'',
          state:'-1'
        }
        this.getData();
      },
      formatDate(row, column) {
        return moment(row.creat_time).format("YYYY-MM-DD");
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.$router.push({path:'/workIntention',query:{pageIndex:val}})
        this.getData();
      },
      handleEdit(row,type) {
        this.dialogName='新建';
        this.eidx='';
        this.form={
            customer_id:'',
            name:'',
            remarks:''
        };

        if(type=='edit'){
          this.dialogName='修改';
          this.eidx = row;
          const item = row;
          this.form={
            customer_id:item.customer_id,
            name:item.name,
            remarks:item.remarks
          };
        }
        this.editVisible = true;
      },
      submitForm(saveData) {
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/business/addIntention.aspx';
            let saveData={
              data:JSON.stringify(_this.form)
            }
            if(_this.dialogName=='新建'){//新建
              _this.form.user_id=_this.$store.state.userInfo.id;
              let startDate = moment().format("YYYY/MM/DD")+" 00:00:00";
              let endDate = moment().format("YYYY/MM/DD")+" 23:59:59";
              saveData.startTime=new Date(startDate).getTime();
              saveData.endTime=new Date(endDate).getTime();
            }
            if(_this.eidx){//编辑
              url="/Views/admin/updateTable.aspx?T=work_intention";
              saveData.id=_this.eidx.id;
            }

            if(_this.repeatRb){
              _this.$message.error("不能重复点击");
              return;
            }
            _this.repeatRb=true;
            $_post(url,saveData).then(function (response) {
              _this.repeatRb=false;
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
      getData(){
        let date='',state='';
        if(this.select.date){
          let d=[];
          d.push(new Date(this.select.date[0]).getTime());
          d.push(new Date(this.select.date[1]).getTime());
          date='&date='+d;
        }
        if(this.select.state!=-1){
          state='&state='+this.select.state;
        }
        let _this=this;
        $_get('/Views/admin/business/getIntention.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+
          '&workNumber='+_this.select.number+'&name='+_this.select.name+'&cName='+_this.select.cName+'&fName='+_this.select.fName+date+state).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data.list;
            _this.count=response.data.count;
          }else {
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

