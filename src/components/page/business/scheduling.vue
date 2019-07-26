<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 工作单排班表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-back"  @click="$store.commit('goBack')"></el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleEdit(-1,'add')">新建</el-button>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
            <tbody>
            <tr>
              <th colspan="2"><div class="cell">基本单信息</div></th>
            </tr>
            <tr>
              <td><div class="cell">工作单：{{workDetail.work_number}}</div></td>
              <td><div class="cell">客户：{{workDetail.customer_name}}{{'('+workDetail.customer_number+')'}}</div></td>
            </tr>
            <tr>
              <td colspan="2"><div class="cell">备注：{{workDetail.remark}}</div></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>



      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <thead>
            <tr>
              <th style="min-width: 110px"><div class="cell">开始->结束时间</div></th>
              <th style="min-width: 100px"><div class="cell">录音室</div></th>
              <th style="min-width: 100px"><div class="cell">录音师</div></th>
              <th style="min-width: 100px"><div class="cell">供应方</div></th>
              <th style="min-width: 80px"><div class="cell">类别</div></th>
              <th style="min-width: 130px"><div class="cell">备注</div></th>
              <th style="min-width: 80px"><div class="cell">工作内容</div></th>
              <th style="min-width: 220px; text-align: center"><div class="cell">操作</div></th>
            </tr>
            </thead>

            <tbody v-for="item in tableData">
            <tr>
              <th colspan="8" style="background-color: #fdfcf9;">
                <div class="cell">{{item.date}}</div>
              </th>
            </tr>
            <tr v-for="item2 in item.lists">
              <td>
                <div class="cell">{{item2.start_time | formatTime("HH:mm")}}->{{item2.end_time | formatTime("HH:mm")}}</div>
              </td>
              <td>
                <div class="cell">{{item2.sound_studio_name}}</div>
              </td>
              <td>
                <div class="cell">{{item2.cms_supplier_name}}</div>
              </td>
              <td>
                <div class="cell">{{item2.suppliers | formatSuppliers}}</div>
              </td>
              <td>
                <div class="cell">{{config.schedulingCategory[item2.pb_category]}}</div>
              </td>
              <td>
                <div class="cell">
                  <el-tag  v-if="item2.work_scheduling_state==1" size="mini" type="success">已审核</el-tag>{{item2.remarks}}
                </div>
              </td>
              <td>
                <div class="cell">{{config.workNature[item2.content]}}</div>
              </td>
              <td>
                <div class="cell" style="text-align: center">
                  <el-button size="small" :disabled="!(item2.work_scheduling_state==0||userInfo.type==1)" type="primary" @click="handleEdit(item2,'edit')" plain>编辑</el-button>
                  <el-button style="margin-left: 0px" size="small" type="danger" @click="handleDelete(item2)">删除</el-button>
                  <el-button style="margin-left: 0px; padding: 9px 10px" v-if="userInfo.type==1" size="small" type="warning" @click="examine(item2)" plain>
                    {{item2.work_scheduling_state==0?'审核通过':'取消审核'}}
                  </el-button>
                </div>
              </td>
            </tr>
            </tbody>

          </table>
        </div>
      </div>

      <div class="pagination" style="display: none">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>


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
        userInfo:JSON.parse(localStorage.getItem('ms_user')),
        tableData: [],
        pageIndex:1,
        pageSize:10,
        count:0,
        form: {
          remarks:'',
          total_price:0,
          projects:[{category:'',project:'',price:0}]
        },
        work_id:'',
        workDetail:'',
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
        config:CONFIG
      }
    },
    filters:{
      formatTime(date,f){
        return moment(date).format(f);;
      },
      formatSuppliers(arr){
        let d=JSON.parse(arr);
        let str='';
        for(let i in d){
          str+="["+d[i].supplier_name+"]"+d[i].supplier_number+'；';
        }
        return str;
      }
    },
    created() {
      let _this=this;
      this.work_id=this.$route.query.workId;
      if(this.work_id){
        this.getData();
      }
      //获取工作单基本信息
      $_get('/Views/admin/getByIdDetail.aspx?T=work_sheet&id=' + _this.work_id).then(function (response) {
        if (response.code == 1) {
          let da = response.data;
          _this.workDetail=da[0];
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
      goMyWork(){
        this.$router.push({path:'/mywork'})
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getData();
      },
      handleDelete(row) {
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_scheduling&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.$message.success('删除成功');
            _this.getData();
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      examine(row){
        let _this=this;

        let url='/Views/admin/updateTable.aspx?T=work_scheduling';
        let state=row.work_scheduling_state==0?1:0;
        let saveData={
          data:JSON.stringify({work_scheduling_state:state}),
          id:row.id
        }
        $_post(url,saveData).then(function (response) {
          if(response.code==1){
            _this.work_scheduling_state=state;
            row.work_scheduling_state=state;
            _this.$message.success('审核成功');
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleEdit(row,type) {
        if(type=='add'){
          this.$router.push({path:'/scheduling-add',query:{workId:this.work_id}})
        }else {
          this.$router.push({path:'/scheduling-add',query:{workId:this.work_id,id:row.id}})
        }

      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getScheduling.aspx?workId=' + _this.work_id).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            _this.tableData=_this.resetDate(da);
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      resetDate(arr){
        let arrs=[];
        for(let i in arr){
          let key=arr[i].scheduling_date;
          let da=arrs.filter(function (val,index,arr) {
            if(val.date==key){
              return val
            }
          })
          if(da.length>0){
            da[0].lists.push(arr[i]);
          }else {
            arrs.push(
              {
                date:key,
                lists:[arr[i]]
              }
            )
          }
        }
        return arrs;
      }

    }
  }

</script>

<style scoped>
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

