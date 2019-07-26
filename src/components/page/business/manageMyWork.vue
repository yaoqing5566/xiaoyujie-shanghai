<template>
  <div class="manageMyWork">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 管理工作单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 100%;">
        <el-row>
          <h4 style="padding: 10px 0 20px 0px" v-if="tableData.state==0">管理未提交的工作单</h4>
          <h4 style="padding: 10px 0 20px 0px" v-else>管理工作单--制片总监</h4>

          <el-col :span="16">
            <div style="margin-left: 0px">
              <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%;">
                <div class="el-table__body-wrapper is-scrolling-left">
                  <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                    <tbody>
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>工作单：{{tableData.work_number}}</strong>
                          <div style="float: right">
                            <el-button plain size="mini" type="primary" @click="editWork(0)">修改主要信息</el-button>
                            <el-button plain size="mini" type="primary" @click="editWork(1)">修改次要信息</el-button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><div class="cell">客户：{{tableData.customer_number}}({{tableData.customer_name_new}})</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">日期：{{tableData.date | formatDate}}</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">业务性质：<span v-html="$options.filters.formatBusiness(tableData.business_nature)"></span></div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">备注：{{tableData.remark}}</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">制单信息：制片（{{tableData.user_name}}） 时间（{{tableData.creat_time | formatDate}}）</div></td>
                    </tr>
                    </tbody>

                    <!--广告-->
                    <tbody v-if="typeKey=='ad'">
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>{{config.businessEnum[typeKey]}}</strong>
                        </div>
                      </td>
                    </tr>
                    <tr><td><div class="cell">片名：{{tableData.name}}</div></td></tr>
                    <tr><td><div class="cell">篇名：{{tableData.gz_title}}</div></td></tr>
                    <tr><td><div class="cell">长度：{{tableData.gz_size[0]}}小时{{tableData.gz_size[1]}}分钟{{tableData.gz_size[2]}}秒</div></td></tr>
                    </tbody>
                    <tbody v-else-if="typeKey=='mv'">
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>{{config.businessEnum[typeKey]}}</strong>
                        </div>
                      </td>
                    </tr>
                    <tr><td><div class="cell">片名：{{tableData.name}}</div></td></tr>
                    <tr><td><div class="cell">长度：{{tableData.gz_size[0]}}小时{{tableData.gz_size[1]}}分钟{{tableData.gz_size[2]}}秒</div></td></tr>
                    </tbody>
                    <tbody v-else-if="typeKey=='scene'">
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>{{config.businessEnum[typeKey]}}</strong>
                        </div>
                      </td>
                    </tr>
                    <tr><td><div class="cell">片名：{{tableData.name}}</div></td></tr>
                    <tr><td><div class="cell">长度：{{tableData.gz_size[0]}}小时{{tableData.gz_size[1]}}分钟{{tableData.gz_size[2]}}秒</div></td></tr>
                    </tbody>
                    <tbody v-else-if="typeKey=='record'">
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>{{config.businessEnum[typeKey]}}</strong>
                        </div>
                      </td>
                    </tr>
                    <tr><td><div class="cell">片名：{{tableData.name}}</div></td></tr>
                    <tr><td><div class="cell">曲目数：{{tableData.gz_size[0]}}</div></td></tr>
                    </tbody>
                    <tbody v-else>
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>{{config.businessEnum[typeKey]}}</strong>
                        </div>
                      </td>
                    </tr>
                    <tr><td><div class="cell">片名：{{tableData.name}}</div></td></tr>
                    <tr><td><div class="cell">长度：{{tableData.gz_size[0]}}小时{{tableData.gz_size[1]}}分钟{{tableData.gz_size[2]}}秒</div></td></tr>
                    </tbody>
                    <!--广告end-->


                    <!--报价单-->
                    <tbody v-if="tableData.state>0&&$store.state.userInfo.type==1" >
                      <tr>
                        <td style="background: #fafafa;">
                          <div class="cell">
                            <strong>报价单</strong>
                            <div style="float: right">
                              <el-button plain size="mini" type="primary"  @click="editQuotation">管理</el-button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr v-for="item in quotationList"><td><div class="cell">版本号:{{item.version_number}}&nbsp;&nbsp;&nbsp;总价:{{item.total_price}}<span v-if="item.type==1" style="margin-left: 10px; color: #0f74a8" class="el-icon-success"></span></div></td></tr>
                    </tbody>
                    <!--报价单end-->


                    <!--奖金分配-->
                    <tbody v-if="tableData.state>0&&$store.state.userInfo.type==1">
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>工作内容</strong>
                          <div style="float: right">
                            <el-button plain size="mini" type="success"   @click="bonus">奖金分配</el-button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell">
                          <div
                            class=" el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition el-table--small"
                            style="width:100%;">
                            <div class="el-table__body-wrapper is-scrolling-left">
                              <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%"
                                     style="table-layout: inherit">
                                <tbody>
                                  <tr>
                                    <th><div class="cell">人员</div></th>
                                    <th><div class="cell">时间</div></th>
                                    <th><div class="cell">录音室</div></th>
                                    <th><div class="cell">类型</div></th>
                                    <th><div class="cell">备注</div></th>
                                    <th><div class="cell">工作内容</div></th>
                                  </tr>
                                <tr v-for="item in scheduling">
                                  <td><div class="cell">{{item.cms_supplier_name}}</div></td>
                                  <td>
                                    <div class="cell" style="line-height: 18px">
                                      {{item.scheduling_date}}<br />{{item.start_time | formatTime("HH:mm")}}->{{item.end_time | formatTime("HH:mm")}}
                                    </div>
                                  </td>
                                  <td><div class="cell">{{item.cms_supplier_name}}</div></td>
                                  <td><div class="cell">{{config.schedulingCategory[item.pb_category]}}</div></td>
                                  <td>
                                    <div class="cell"> {{item.remarks}}</div>
                                  </td>
                                  <td>
                                    <div class="cell">{{config.workNature[item.content]}}</div>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <!--<div class="el-table el-table&#45;&#45;fit el-table&#45;&#45;border el-table&#45;&#45;scrollable-x el-table&#45;&#45;enable-row-hover el-table&#45;&#45;enable-row-transition el-table&#45;&#45;small" style="width:100%;">-->
                            <!--<div class="el-table__body-wrapper is-scrolling-left">-->
                            <!--<table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">-->
                            <!--<tbody v-for="item in tableData.work_nature">-->
                            <!--<tr>-->
                            <!--<th colspan="3">-->
                            <!--<div class="cell">-->
                            <!--{{config.workNature[item]}}-->
                            <!--<el-button plain size="mini" type="warning" @click="designatedWorkerAdd(item)" style="padding: 5px 6px;  margin-left: 30px">指派工作人员</el-button>-->
                            <!--</div>-->
                            <!--</th>-->
                            <!--</tr>-->
                            <!--<tr v-for="itemTaff in assignsTaff" v-if="item==itemTaff.taff_work_nature">-->
                            <!--<td width="80"><div class="cell">{{itemTaff.supplier_name}}</div></td>-->
                            <!--<td><div class="cell">{{itemTaff.taff_remarks}}</div></td>-->
                            <!--<td width="80"><div class="cell" style="text-align: center">-->
                            <!--<el-button plain size="mini" type="danger" @click="handleDelete(-1,itemTaff)">删除</el-button>-->
                            <!--</div></td>-->
                            <!--</tr>-->
                            <!--</tbody>-->
                            <!--</table>-->
                            <!--</div>-->
                            <!--</div>-->
                          </div>
                        </div>
                      </td>
                    </tr>


                    </tbody>



                    <!--供应方-->
                    <tbody v-if="tableData.state>0">
                      <tr>
                        <td style="background: #fafafa;">
                          <div class="cell">
                            <strong>供应方</strong>
                            <div style="float: right">
                              <el-button plain size="mini" type="primary" @click="payable">费用</el-button>
                              <el-button plain size="mini" type="primary" @click="setSupplier">设定</el-button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="cell">
                            <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%;">
                              <div class="el-table__body-wrapper is-scrolling-left">
                                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                                  <tbody>
                                  <tr>
                                    <th><div class="cell">身份</div></th>
                                    <th><div class="cell">名称</div></th>
                                    <th><div class="cell">手机</div></th>
                                    <th><div class="cell">工作内容</div></th>
                                    <th><div class="cell" style="text-align: right">费用</div></th>
                                  </tr>
                                  <tr v-for="item in workSupplier" v-if="item.payable_state!=3">
                                    <td><div class="cell">{{item.identity}}</div></td>
                                    <td><div class="cell">{{item.supplier_name}}</div></td>
                                    <td><div class="cell">{{item.supplier_mobile}}</div></td>
                                    <td><div class="cell">{{item.job_content}}</div></td>
                                    <td><div class="cell" style="text-align: right">{{item.payable_cost}}</div></td>
                                  </tr>
                                  <tr>
                                    <td><div class="cell">合计</div></td>
                                    <td colspan="4"><div class="cell" style="text-align: right">{{workSupplierTotal}}</div></td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <!--供应方end-->


                  </table>
                </div>
              </div>
            </div>
          </el-col>


          <el-col :span="8">
            <div style="padding-left: 10px">
              <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%;">
                <div class="el-table__body-wrapper is-scrolling-left">
                  <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%">
                    <tbody>
                    <tr>
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>主要联系人</strong>
                          <div style="float: right">
                            <el-button plain size="mini" type="primary" @click="editWork(1)">修改主要联系人</el-button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><div class="cell">身份：{{tableData.identity}}</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">联系人：{{tableData.liaison}}</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">手机：{{tableData.mobile}}</div></td>
                    </tr>
                    <tr>
                      <td><div class="cell">Email：{{tableData.email}}</div></td>
                    </tr>
                    </tbody>

                    <tbody v-for="da in contacts">
                      <tr>
                        <td style="border-top:2px solid #ebeef5"><div class="cell">身份：{{da.identity}}</div></td>
                      </tr>
                      <tr>
                        <td><div class="cell">联系人：{{da.name}}</div></td>
                      </tr>
                      <tr>
                        <td><div class="cell">手机：{{da.mobile}}</div></td>
                      </tr>
                      <tr>
                        <td><div class="cell">Email：{{da.email}}</div></td>
                      </tr>
                    </tbody>

                    <tbody>
                    <tr>
                      <td>
                        <div class="cell">
                          <el-button plain size="mini" type="primary" @click="addContacts">新建联系人</el-button>
                          <el-button style="float: right" plain size="mini" type="success" @click="otherContacts=!otherContacts">查看其它联系人</el-button>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <!--作废工作单-->
                    <tbody>
                    <tr v-if="tableData.state>0">
                      <td style="background: #fafafa;">
                        <div class="cell">
                          <strong>作废工作单（申请）</strong>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="tableData.state>0">
                      <td>
                        <div class="cell">作废原因：
                          <el-radio v-model="toVoid.cause" label="客户原因">客户原因</el-radio>
                          <el-radio v-model="toVoid.cause" label="内部原因">内部原因</el-radio>
                        </div>
                      </td>
                    </tr>
                    <tr  v-if="tableData.state>0">
                      <td>
                        <div class="cell">原因说明：
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="toVoid.explain"></el-input>
                        </div>
                        <div style="padding: 5px 0 0 10px">
                          <div v-if="tableData.state==3" style="color: red">作废待审</div>
                          <el-button plain size="mini" v-if="tableData.state<3" @click="toVoidSave()" type="danger">作废当前工作单</el-button>
                          <el-button type="danger" size="mini" @click="confirmVoid()" v-if="$store.state.userInfo.type==1&&tableData.state>=3">
                            {{tableData.state==3?'确认作废':'取消作废'}}
                          </el-button>
                        </div>
                      </td>
                    </tr>
                    <!--作废工作单 end-->

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </el-col>
          <div style="clear: both; height: 30px"></div>
          <div>
            <el-button type="primary" @click="goMyWork">返回</el-button>
            <el-button type="success" v-if="tableData.state>0&&tableData.state!=2" @click="setState(2)">当前工作单完成工作</el-button>
            <el-button type="warning" v-if="tableData.state>0&&tableData.state==2" @click="setState(1)">取消工作完成</el-button>
          </div>
        </el-row>
      </div>
    </div>


    <!-- 指派工作人员 -->
    <el-dialog :close-on-click-modal="false" title="指派工作人员" :visible.sync="designatedVisible" width="450px">
      <el-form  label-width="80px">
        <el-form-item label="工作内容">
          {{config.workNature[designatedWorker.taff_work_nature]}}
        </el-form-item>
        <el-form-item label="用户账号">
          <el-select  v-model="designatedWorker.supplier_id"  filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="designatedWorker.taff_remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="designatedVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitFormDesignated()">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 查看其它联系人 -->
    <el-dialog :close-on-click-modal="false" title="联系人" :visible.sync="otherContacts" width="550px" >
      <el-table :data="contacts" border style="width: 100%">
        <el-table-column prop="name"  label="名字"></el-table-column>
        <el-table-column prop="identity"  label="称呼"></el-table-column>
        <el-table-column prop="mobile"  label="手机"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{config.addContactsType[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
                <el-button @click="otherContacts = false">取 消</el-button>
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
<style>
 .manageMyWork .el-table tr:hover{  background: #fff;}
 .myWork .el-dialog__body{padding-top: 0px}
  .my-ywxz {
    color: #ff869b
  }
  .ganggao .el-input-group__append, .ganggao .el-input-group__prepend {
    padding: 0 10px
  }
</style>
<script>
  let vm;
  export default {
    components: {},
    data() {
      vm=this;
      return {
        tableData:{
          gz_size:["","",""]
        },
        typeKey:'',
        contacts:[],//联系人
        toVoid:{//作废
          cause:'',//原因
          explain:'',
          state:3
        },
        designatedWorker:{//指派工作人员
          taff_remarks:'',
          work_id:"",
          taff_work_nature:"",
          supplier_id:'',
        },
        quotationList:'',
        workSupplier:'',
        config: CONFIG,
        workId:'',
        otherContacts:false,
        delVisible:false,
        designatedVisible:false,
        supplierList:[],
        scheduling:[],
        assignsTaff:[]
      };
    },
    mounted() {

    },
    computed:{
      workSupplierTotal(){
        let total=0;
        for(let i in this.workSupplier){
          if(this.workSupplier[i].payable_state!=3){
            total+=parseInt(this.workSupplier[i].payable_cost);
          }
        }
        return total;
      }
    },
    created() {
      let _this=this;
      this.workId=this.$route.query.id;
      if(this.workId){
        this.getData();
        this.designatedWorker.work_id=this.workId;
      }

      //获取设定供应方
      $_get('/Views/admin/business/getPayable.aspx?workId=' + _this.workId).then(function (response) {
        if (response.code == 1) {
          let da = response.data;
          _this.workSupplier=da;
        } else {
          _this.$message.error(response.msg);
        }
      })

      //获取报价单
      $_get('/Views/admin/business/getWorkIdByDetail.aspx?T=quotation&workId=' + _this.workId).then(function (response) {
        if (response.code == 1) {
          let da = response.data;
          _this.quotationList=da;
        } else {
          _this.$message.error(response.msg);
        }
      })

      //获取供应方列表
      $_get('/Views/admin/info/readSupplier.aspx?pageIndex=1&pageSize=1000&number=&name=').then(function (response) {
        if(response.code==1){
          _this.supplierList=response.data.list;
        }else {
          _this.$message.error(response.msg);
        }
      })
      this.getDesignated();
    },
    filters:{
      formatTime(date,f){
        return moment(date).format(f);;
      },
      formatBusiness(da){
        if(!da){
          return '';
        }
        let d=JSON.parse(da);
        let str='';
        for (let key in d){
          str+=vm.config.businessEnum[key]+"-"+vm.config.business[key][d[key]]+'，';
          vm.typeKey=key;
        }
        return str.substr(0,str.length-1)
      },
      formatDate(date) {
        return moment(date).format("YYYY-MM-DD");;
      }
    },
    methods: {
      getDesignated(){
        let _this=this;
        $_get('/Views/admin/business/getScheduling.aspx?workId=' + _this.workId).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            _this.scheduling=da;
          } else {
            _this.$message.error(response.msg);
          }
        })

        // $_get('/Views/admin/business/getAssignsTaff.aspx?workID=' + _this.workId).then(function (response) {
        //   if (response.code == 1) {
        //     let da = response.data;
        //     _this.assignsTaff=da;
        //   } else {
        //     _this.$message.error(response.msg);
        //   }
        // })
      },
      submitFormDesignated() {
        let _this=this;
        if(_this.designatedWorker.supplier_id==''){
          _this.$message.error("用户账号必须填写！");
          return;
        }
        _this.designatedWorker.user_id=_this.$store.state.userInfo.id;
        let saveData={
          data:JSON.stringify(_this.designatedWorker)
        }
        console.log(saveData)
        $_post("/Views/admin/addTable.aspx?T=work_assigns_taff",saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.getDesignated();
            _this.designatedVisible=false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      bonus(){
        let workDataNew={
          name:this.tableData.work_number+' '+this.tableData.name,
          work_nature:this.tableData.work_nature
        }
        localStorage.setItem('workDetail',JSON.stringify(workDataNew));
        this.$router.push({path:"/bonus",query:{workId:this.workId}});
      },
      designatedWorkerAdd(type){
        this.designatedVisible=true;
        this.designatedWorker.taff_work_nature=type;
        this.designatedWorker.taff_remarks='';
        this.designatedWorker.supplier_id='';
      },
      toVoidSave(){
        let _this=this;
        if(!this.toVoid.cause){alert('请选择作废原因'); return; }
        if(!this.toVoid.explain){alert('请填写作废原因'); return;}
        let save={
          data:JSON.stringify({to_void_cause:_this.toVoid,state:3}),
          id:this.workId
        }
        $_post('/Views/admin/business/updateWork.aspx',save).then(function (response) {
          if(response.code==1){
            _this.$message.success('提交成功');
            _this.tableData.state=3;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      confirmVoid(){
        let _this=this;
        let state=this.tableData.state==3?4:1;
        let saveObj={to_void_cause:_this.toVoid,state:state};
        if(this.tableData.state==4){
          saveObj.to_void_cause='';
        }
        let save={
          data:JSON.stringify(saveObj),
          id:this.workId
        }
        $_post('/Views/admin/business/updateWork.aspx',save).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            if(_this.tableData.state==4){
              _this.toVoid={
                cause:'',
                explain:'',
                state:3
              };
            }
            _this.tableData.state=state;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      setState(state){
        let _this=this;
        let save2={
          data:JSON.stringify({state:state}),
          id:this.workId
        }
        $_post('/Views/admin/business/updateWork.aspx',save2).then(function (response) {
          if(response.code==1){
            _this.tableData.state=state;
            _this.$message.success('提交成功');
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      payable(){
        this.$router.push({path:"/payable",query:{workId:this.workId}});
      },
      setSupplier(){
        this.$router.push({path:"/addWorkSupplier",query:{workId:this.workId}});
      },
      addContacts(){
        this.$router.push({path:"/addContacts",query:{workId:this.workId}});
      },
      goMyWork(){
        this.$router.push({path:"/mywork"});
      },
      editWork(stepActive){
        this.$router.push({path:"/myworkAdd",query:{id:this.workId,stepActive:stepActive,type:'edit'}})
      },
      editQuotation(){
        localStorage.setItem('work_number',this.tableData.work_number)
        this.$router.push({path:"/quotation",query:{id:this.workId}})
      },
      getData() {
        let _this = this;
        //获取基本信息
        $_get('/Views/admin/business/getWorkDetail.aspx?workId=' + _this.workId).then(function (response) {
          if (response.code == 1) {
            var da = response.data[0];
            _this.tableData=da;

            if(_this.tableData.gz_size){
              _this.tableData.gz_size=JSON.parse(_this.tableData.gz_size)
            }else {
              _this.tableData.gz_size=[0,0,0]
            }
            if(_this.tableData.to_void_cause){
              _this.toVoid=JSON.parse(_this.tableData.to_void_cause);
              _this.toVoid.state=da.state;
            }
            if(_this.tableData.work_nature){
              _this.tableData.work_nature=JSON.parse(_this.tableData.work_nature);
            }

          } else {
            _this.$message.error(response.msg);
          }
        })

        //获取联系人
        $_get('/Views/admin/business/getWorkIdByDetail.aspx?T=contacts&workId=' + _this.workId).then(function (response) {
          if (response.code == 1) {
            var da = response.data;
            _this.contacts=da;
            console.log(_this.contacts)
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleDelete(index, row) {
        this.idx = index;
        this.removeId = row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        if(this.idx==-1){//删除工作内容
          $_get('/Views/admin/deleteTable.aspx?T=work_assigns_taff&id=' + _this.removeId).then(function (response) {
            if (response.code == 1) {
              _this.$message.success('删除成功');
              _this.getDesignated();
              _this.delVisible = false;
            } else {
              _this.$message.error(response.msg);
            }
          })
        }else {
          $_get('/Views/admin/deleteTable.aspx?T=contacts&id=' + _this.removeId).then(function (response) {
            if (response.code == 1) {
              _this.contacts.splice(_this.idx, 1);
              _this.$message.success('删除成功');
              _this.delVisible = false;
            } else {
              _this.$message.error(response.msg);
            }
          })
        }

      },

    },

  }
</script>
