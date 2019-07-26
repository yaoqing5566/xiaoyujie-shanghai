<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 我的工作单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="workSelect">筛选</el-button>
        <el-button icon="search" type="danger" @click="clearSelect">清除</el-button>
        <el-button type="primary" style="float: right" icon="delete" class="handle-del mr10" @click="handleEdit()">新建</el-button>
      </div>

      <div class="my-work">
        <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column prop="work_number"  label="工作单号"></el-table-column>
          <el-table-column  prop="date" width="85" label="日期" :formatter="formatDate" sortable></el-table-column>
          <el-table-column prop="customer_name_new"  label="客户"></el-table-column>
          <el-table-column  label="名称">
            <template slot-scope="scope">
              {{scope.row.name+' '+(scope.row.gz_title?scope.row.gz_title:'')}}
            </template>
          </el-table-column>
          <el-table-column prop="business_nature"  label="业务性质">
            <template slot-scope="scope">
              <div v-html="$options.filters.formatBusiness(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column prop="work_nature"  label="工作性质" :formatter="formatWorkNature"></el-table-column>
          <el-table-column prop="user_pwd"  label="报价" width="70" v-if="$store.state.userInfo.type==1">
            <template slot-scope="scope">
              <div v-if="scope.row.offer==0" style="color: #d6d6d6">未定价</div>
              <div v-else>{{scope.row.offer}}</div>
            </template>
          </el-table-column>
          <el-table-column  width="60"  label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.state==2" style="color: red">{{config.myWorkState[scope.row.state]}}</div>
              <div v-else>{{config.myWorkState[scope.row.state]}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="user_name"  label="制片" width="80">
            <template slot-scope="scope">
              {{scope.row.supplier_name?scope.row.supplier_name:scope.row.new_user_name}}
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="70">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <!--<p>姓名: {{ scope.row.user_email }}</p>-->
                <div v-if="scope.row.state==0">
                  <el-button plain size="mini" @click="goTo(2,scope.row)" type="primary">管理</el-button>
                  <el-button  size="mini" type="success" @click="subState(scope.$index,scope.row)">提交</el-button>
                  <el-button plain size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </div>
                <div v-else>
                  <el-button plain type="primary"  @click="goTo(2,scope.row)" size="mini">管理</el-button >

                  <el-button plain type="warning"  @click="goTo(5,scope.row)" size="mini">排班</el-button >
                  <!--<el-button plain type="info"  @click="goTo(4,scope.row)" size="mini">查看</el-button >-->
                  <el-button plain size="mini" type="success"  v-if="$store.state.userInfo.type==1"  @click="goTo(7,scope.row)">奖金分配</el-button>
                  <div style="height: 10px"></div>
                  <el-button plain type="success"  v-if="$store.state.userInfo.type==1||$store.state.userInfo.type==2" @click="goTo(3,scope.row)" size="mini">报价单</el-button >
                  <el-button plain type="danger"  @click="goTo(6,scope.row)" size="mini" v-if="$store.state.userInfo.type==1||$store.state.userInfo.type==2">应付款</el-button>
                  <el-button  type="info" plain  @click="goTo(1,scope.row)" size="mini" v-if="$store.state.userInfo.type==1||$store.state.userInfo.type==2">应收款</el-button >

                  <el-button plain size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="$store.state.userInfo.type==1">删除</el-button>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">编辑</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count" :current-page.sync="pageIndex">
        </el-pagination>
      </div>
    </div>

    <!-- 删除提示框 -->
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">确定删除该工作单吗？<br/>删除该工作单将会删除工作单下面所有数据，如：<span style="color: red">报价单、排班、应付款，应收款！</span></div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>

    <!--确定提交 -->
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="stateVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确认提交？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="stateVisible = false">取 消</el-button>
                <el-button type="primary" @click="subStateConfirm">确 定</el-button>
            </span>
    </el-dialog>


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
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input  @keyup.enter.native="selectForm()" clearable v-model="select.liaison"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日期">
              <el-date-picker style="width: 100%" v-model="select.date" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性质">
              <el-select v-model="select.nature" placeholder="性质" class="handle-select mr10" style="width: 100%">
                <el-option v-for="(items,index) in config.workNature" :key="index" :label="items" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="my-work-check">
            <el-form-item label="状态" style=" margin-bottom: 8px">
              <el-checkbox-group v-model="select.state" >
                <el-checkbox v-for="(state,index) in config.myWorkState" :label="index" :key="index">{{state}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="my-work-check">
            <el-form-item label="其他选项">
              <el-checkbox  @change="handleCheckedAddChange" v-model="select.isAddMe">由我创建</el-checkbox>
              <el-checkbox v-model="select.offerChecked">价格未确认</el-checkbox>
              <!--<el-checkbox label="5" style="margin-left: 0px">进入应收款</el-checkbox>-->
              <!--<el-checkbox label="6">奖金设立未建立应收款</el-checkbox>-->

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="workDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectForm()">查 询</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  let vm;
  export default {
    data() {
      vm=this;
      return {
        pageType:"1",
        tableData: [],
        pageIndex:1,
        pageSize:10,
        delVisible: false,
        workDialog:false,
        stateVisible:false,
        count:0,
        select:{
          number:'',
          name:'',
          cName:'',//客户
          fName:'',//制片
          liaison:'',//联系人
          nature:'',//性质
          date:'',
          state:[],
          isAddMe:false,//由我创建
          offerChecked:false
        },
        config:CONFIG
      }
    },
    created() {
      let myworkSelect=JSON.parse(sessionStorage.getItem('myworkSelect'));
      if(myworkSelect){
        this.select=myworkSelect;
      }
      console.log(myworkSelect)
      if(this.$route.query.pageIndex){
        this.pageIndex=parseInt(this.$route.query.pageIndex);
      }
      this.getData();
    },
    watch: {
      '$route' (to, from) {
        this.pageIndex=this.$route.query.pageIndex;
        console.log(this.pageIndex)
      },
      pageIndex(){
        this.getData();
      }
    },
    computed: {
    },
    filters:{
      formatBusiness(row){
        // console.log(row)
        let d=JSON.parse(row.business_nature);
        let str='';
        for (let key in d){
          str+="<strong>"+vm.config.businessEnum[key]+"</strong>"+"："+vm.config.business[key][d[key]]+'</br> '
        }
        return str
      },
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        console.log(row.state)
        if (row.state === 2) {
          return 'warning-row';
        }
        return '';
      },
      clearSelect(){
        sessionStorage.removeItem("myworkSelect");
        this.select={
          number:'',
          name:'',
          cName:'',//客户
          fName:'',//制片
          liaison:'',//联系人
          nature:'',//性质
          date:'',
          state:[],
          isAddMe:false,//由我创建
          offerChecked:false
        }
        this.getData();
      },
      goTo(type,row){
        if(type==1){//
          // if(row.offer==0){
          //   this.$message.error("请先确认一个报价单！");
          //   return;
          // }
          this.$router.push({path:'/receivables',query:{workId:row.id}});
        }
        if(type==2){//
          this.$router.push({path:'/manageMyWork',query:{id:row.id}});
        }
        if(type==3){//
          this.$router.push({path:'/quotation',query:{id:row.id}});
          let workName=row.work_number+' '+row.name+' '+(row.gz_title?row.gz_title:'');
          localStorage.setItem('work_number',workName)
        }
        if(type==5){//
          this.$router.push({path:'/scheduling',query:{workId:row.id}});
        }
        if(type==6){//应付款
          this.$router.push({path:'/payable',query:{workId:row.id}});
        }
        if(type==7){//奖金分配
          let workDataNew={
            name:row.work_number+' '+row.name,
            work_nature:JSON.parse(row.work_nature)
          }
          localStorage.setItem('workDetail',JSON.stringify(workDataNew));
          this.$router.push({path:"/bonus",query:{workId:row.id}});
        }
      },
      handleCheckedAddChange(){
        if(this.select.isAddMe){
          let ms_user=JSON.parse(localStorage.getItem('ms_user'));
          this.select.fName=ms_user.name;
        }else {
          this.select.fName='';
        }
      },
      formatDate(row, column) {
        return moment(row.date).format("YYYY-MM-DD");
      },
      formatWorkNature(row, column) {
        let nature=JSON.parse(row.work_nature);
        let str='';
        for(let index in nature){
          str+=this.config.workNature[nature[index]]+"，";
        }
        str=str.substr(0,str.length-1)
        return str;
      },
      workSelect(){
        this.workDialog=true;
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/business/deleteWork.aspx?id=' + _this.removeId).then(function (response) {
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
        this.$router.push({path:'/mywork',query:{pageIndex:val}})
        this.getData();
      },
      handleEdit(a,b){
        this.$router.push('/myworkAdd');
      },
      getData(){
        let date='',state='';
        if(this.select.date){
          let d=[];
          d.push(new Date(this.select.date[0]).getTime());
          d.push(new Date(this.select.date[1]).getTime());
          date='&date='+d;
        }
        if(this.select.state.length>0){
          state='&state='+this.select.state;
        }
        let offer=this.select.offerChecked?0:1;
        let _this=this;
        $_get('/Views/admin/business/readWork.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+
          '&workNumber='+_this.select.number+'&name='+_this.select.name+'&cName='+_this.select.cName+'&fName='+_this.select.fName+'&liaison='+_this.select.liaison+'&nature='+_this.select.nature+'&offer='+offer+date+state).then(function (response) {
          if(response.code==1){
            _this.tableData=response.data.list;
            _this.count=response.data.count;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      selectForm(){
        sessionStorage.setItem("myworkSelect",JSON.stringify(this.select))
        this.getData();
        this.workDialog=false;
      },
      // 提交
      subState(index,row) {
        this.idx = index;
        this.subId = row.id;
        this.stateVisible = true;
      },
      subStateConfirm(){
        let _this=this;
        let save2={
          data:JSON.stringify({state:1}),
          id:this.subId
        }
        $_post('/Views/admin/business/updateWork.aspx',save2).then(function (response) {
          if(response.code==1){
            _this.tableData[_this.idx].state=1;
            _this.stateVisible = false;
            _this.$message.success('提交成功');
          }else {
            _this.$message.error(response.msg);
          }
        })
      }
    }
  }

</script>

<style>
  .my-work .el-table .warning-row {
    background: #f6faff;
  }
  .handle-box {
    margin-bottom: 20px;
  }
  .my-work-check .el-checkbox+.el-checkbox {
    margin-left: 15px;
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

