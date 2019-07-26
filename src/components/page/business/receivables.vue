<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 应收款管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-back"  @click="$store.commit('goBack')"></el-button>
        <el-button style="float: right" type="primary" icon="delete" class="handle-del mr10" @click="handleAdd(2)">新增已收款</el-button>
        <el-button style="float: right" type="danger" icon="delete" class="handle-del mr10" @click="handleAdd(1)">新增应收款</el-button>
      </div>


      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-none">
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
          </table>
        </div>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <thead>
            <tr>
              <th width="100">
                <div class="cell">日期</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">作曲费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">版权<br />音乐</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">退稿费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">演唱费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">jingle</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">选曲费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">录音费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">配音费</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">广州</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">广州<br />配音</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">客户<br />费用</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">税</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">版权<br />交易</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">授权</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">其他</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">合计</div>
              </th>
              <th>
                <div class="cell">备注</div>
              </th>
              <th width="150">
                <div class="cell">操作</div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th colspan="19"  style="background-color: #fdfcf9;">
                <div class="cell">
                  应收款
                  <span style="font-size: 14px;color: #f56c6c; margin-left: 20px;cursor: pointer" class="el-icon-circle-plus" @click="handleAdd(1)">新增应收款</span>
                </div>
              </th>
            </tr>
            <tr v-for="item in tableData" v-if="item.receivables_type==1">
              <td> <div class="cell">{{formatDate(item.receivables_date)}}</div></td>
              <td> <div class="cell">{{item.receivables_zqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_bqyyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_tgf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_ycf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_jingle | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_xqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_lyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_pyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_gz | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_gzpy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_khfy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_tax | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_bqjy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_authorize | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_other | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_total_cost | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_remarks}}</div></td>
              <td>
                <div class="cell">
                  <el-button size="small" type="primary" @click="handleEdit(item,2)" plain>编辑</el-button>
                  <el-button style="margin-left: 5px" size="small" type="danger" @click="handleDelete(item.id)">删除
                  </el-button>
                </div>
              </td>
            </tr>
            </tbody>


            <tbody>
            <tr>
              <th colspan="19" style="background-color: #fdfcf9;">
                <div class="cell">
                  已收款
                  <span style="font-size: 14px;color: #f4a2b0; margin-left: 20px;cursor: pointer" class="el-icon-circle-plus" @click="handleAdd(2)">新增已收款</span>
                </div>
              </th>
            </tr>
            <tr v-for="item in tableData" v-if="item.receivables_type==2">
              <td> <div class="cell">{{formatDate(item.receivables_date)}}</div></td>
              <td> <div class="cell">{{item.receivables_zqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_bqyyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_tgf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_ycf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_jingle | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_xqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_lyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_pyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_gz | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_gzpy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_khfy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_tax | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_bqjy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_authorize | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_other | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_total_cost | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_remarks}}</div></td>
              <td>
                <div class="cell">
                  <el-button size="small" type="primary" @click="handleEdit(item,2)" plain>编辑</el-button>
                  <el-button style="margin-left: 5px" size="small" type="danger" @click="handleDelete(item.id)">删除
                  </el-button>
                </div>
              </td>
            </tr>
            </tbody>
            <tr>
              <th colspan="19" style="background-color: #fdfcf9;">
                <div class="cell">
                  当前应收余额
                </div>
              </th>
            </tr>
            <tr>
              <td> <div class="cell">{{formatDate(statisticalDate.receivables_date)}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_zqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_bqyyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_tgf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_ycf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_jingle | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_xqf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_lyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_pyf | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_gz | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_gzpy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_khfy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_tax | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_bqjy | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_authorize | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_other | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{statisticalDate.receivables_total_cost | formatIsEmpty}}</div></td>
              <td :colspan="statisticalDate.receivables_total_cost>0?1:2"> <div class="cell">{{statisticalDate.receivables_remarks}}</div></td>
              <td v-if="statisticalDate.receivables_total_cost>0">
                <div class="cell">
                  <el-button size="small" type="primary" @click="editVisible2 = true" plain>转换为已收款</el-button>
                </div>
              </td>
            </tr>
          </table>


        </div>
      </div>


      <div style="padding: 20px 0">
        <el-button plain type="primary"  @click="payState(1)" size="mini">强制结算</el-button >
        <el-button plain type="success"  @click="payState(2)" size="mini">重计余额</el-button >
        <el-button plain type="danger"  @click="payState(3)" size="mini">完成结算</el-button >
        <el-button plain type="warning"  @click="payState(4)" size="mini">余额转换为坏账</el-button >
      </div>


      <div style="font-size: 12px; color: grey">
        当已收款小于应收款时，但事实付款已经完成，请使用“强制结算”功能，余额将会归零。可以将该工作单从应收款查询中移除。<br/>
        当工作单需要重新收款时，点击“重计余额”，可将“强制结算”的工作单恢复到收款状态。<br/>
        点击“完成结算”，改工作单将会出现在应收款列表中，若要恢复，请到”工作单查询“功能中恢复【查看-取消结算标记】<br/>
        余额转换坏账，该工作单的应收款余额将形成对应的坏账记录。
      </div>


    </div>


    <!-- 编辑弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="editVisible" width="600" class="add-receivables">

      <el-form ref="form" :model="form" label-width="111px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="receivables_date">
              <el-date-picker v-model="form.receivables_date" style="width: 100%" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.receivables_type==1">
            <el-form-item label="催款对象">
              <el-radio v-model="form.receivables_reminders" label="1">制片部</el-radio>
              <el-radio v-model="form.receivables_reminders" label="2" style="margin-left: 10px">财务部</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作曲费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_zqf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版权音乐费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_bqyyf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退稿费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_tgf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演唱费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_ycf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="jingle">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_jingle">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选曲费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_xqf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录音费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_lyf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配音费">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_pyf">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广州">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_gz">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广州配音">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_gzpy">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户费用">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_khfy">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_tax">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版权交易">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_bqjy">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_authorize">
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他">
              <div class="el-input el-input--small">
                <input  @keyup="isNumber" placeholder="0.00" type="text" class="el-input__inner" v-model="form.receivables_other">
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="联系人">
              <el-input  v-model="form.receivables_contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input  v-model="form.receivables_remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.receivables_type==2">
            <el-form-item label="财务账户">
              <el-radio-group v-model="form.receivables_finance">
                <el-radio style="padding-bottom: 0px" v-for="(item,index) in config.financial_account" :label="index" :key="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 转换为已收款 -->
    <el-dialog :close-on-click-modal="false" title="确定全部转换为已收款吗？" :visible.sync="editVisible2" width="600" class="add-receivables">
      <el-form style="padding-left: 50px">
        <el-col :span="24">
          <el-form-item label="财务账户:">
            <el-radio-group v-model="receivables_finance">
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
        supplierItem:'',
        form: {
          receivables_type:1, //1是应收款，2是已收款， 3是应收款减去已收款   4是应收款总和 5是已收款总和
          receivables_date:'',
          receivables_zqf:'',//作曲费
          receivables_bqyyf:'',//版权音乐费
          receivables_tgf:'',//退稿费
          receivables_ycf:'',//演唱费
          receivables_jingle:'',//jingle
          receivables_xqf:'',//选曲费
          receivables_lyf:'',//录音费
          receivables_pyf:'',//配音费
          receivables_gz:'',//广州
          receivables_gzpy:'',//广州配音
          receivables_khfy:'',//客户费用
          receivables_tax:'',//税
          receivables_bqjy:'',//版权交易
          receivables_authorize:'',//授权
          receivables_other:'',//其他
          receivables_total_cost:0,//总费用
          receivables_reminders:'1', //催款对象  应收款才有此项
          receivables_remarks:'',
          receivables_contacts:'',//联系人
          receivables_finance:'',//财务账户
          work_id:'',
        },
        work_id:0,
        back_receivables_project:[],
        config: CONFIG,
        rules: {
          receivables_date: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          // receivables_zqf: [
          //   { required: true,type: 'number', message: '请输入正确数字', trigger: 'change' },
          // ]
        },
        delVisible: false,
        editVisible: false,
        editVisible2:false,
        isLoad:false, //页面加载进来不执行
        thisComputeDate:'',
        thisMsg:'',
        statisticalDate:{},
        receivables_finance:''
      }
    },
    filters:{
      formatIsEmpty(data){
        return data?data:0;
      },
    },
    created() {
      this.$store.commit('adminCanSee'); //
      let _this=this;
      this.form.work_id=this.$route.query.workId;
      this.work_id=this.$route.query.workId;
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
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      payState(type){
        let _this=this;
        let url='/Views/admin/business/updateWork.aspx';
        let saveData={
          data:JSON.stringify({pay_state:type}),
          id:this.form.work_id
        }
        $_post(url,saveData).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            let str='';
            if(type==1){
              str='强制结算';
            }
            if(type==2){
              str='重计余额';
            }
            if(type==3){
              str='完成结算';
            }
            if(type==4){
              str='余额转换为坏账';
            }
            _this.addLog(str,'');
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      formatDate(da) {
        return moment(da).format("YYYY-MM-DD");
      },
      isNumber(e){
        console.log(e.target.value)
        if(/[^\-?\d.]/g.test(e.target.value)){
          e.target.value=''
        }
      },
      calculateTotal_cost(){
        let total=0;
        total+=this.form.receivables_zqf?parseFloat(this.form.receivables_zqf):0;
        total+=this.form.receivables_bqyyf?parseFloat(this.form.receivables_bqyyf):0;
        total+=this.form.receivables_tgf?parseFloat(this.form.receivables_tgf):0;
        total+=this.form.receivables_ycf?parseFloat(this.form.receivables_ycf):0;
        total+=this.form.receivables_jingle?parseFloat(this.form.receivables_jingle):0;
        total+=this.form.receivables_xqf?parseFloat(this.form.receivables_xqf):0;
        total+=this.form.receivables_lyf?parseFloat(this.form.receivables_lyf):0;
        total+=this.form.receivables_pyf?parseFloat(this.form.receivables_pyf):0;
        total+=this.form.receivables_gz?parseFloat(this.form.receivables_gz):0;
        total+=this.form.receivables_gzpy?parseFloat(this.form.receivables_gzpy):0;
        total+=this.form.receivables_khfy?parseFloat(this.form.receivables_khfy):0;
        total+=this.form.receivables_tax?parseFloat(this.form.receivables_tax):0;
        total+=this.form.receivables_bqjy?parseFloat(this.form.receivables_bqjy):0;
        total+=this.form.receivables_authorize?parseFloat(this.form.receivables_authorize):0;
        total+=this.form.receivables_other?parseFloat(this.form.receivables_other):0;
        return total;
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
      submitForm(saveData) {
        let _this=this;
        _this.form.receivables_total_cost=this.calculateTotal_cost();

        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let url='/Views/admin/addTable.aspx?T=work_receivables';
            let ms_user=JSON.parse(localStorage.getItem('ms_user'));
            if(!_this.eidx) {//新建
              _this.form.user_id=ms_user.id;
            }
            let cloneObj=JSON.parse(JSON.stringify(_this.form));
            cloneObj.receivables_date=new Date(_this.form.receivables_date).getTime();
            for(let j in cloneObj){
              if(!cloneObj[j]){
                cloneObj[j]=0;
              }
              if(cloneObj[j]=='null'){
                cloneObj[j]=0;
              }
            }
            console.log(cloneObj)
            let saveData={
              data:JSON.stringify(cloneObj)
            }
            console.log(_this.form)

            if(_this.eidx){//更新
              url='/Views/admin/updateTable.aspx?T=work_receivables';
              saveData.id=_this.eidx.id;
            }
            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                _this.thisComputeDate=new Date().getTime();
                _this.thisMsg=_this.form.receivables_remarks;
                _this.getData();
                if(_this.eidx) {//更新
                  let str='';
                  if(_this.form.receivables_type==1){
                    str='修改应收款';
                  }
                  if(_this.form.receivables_type==2){
                    str='修改已收款';
                  }
                  _this.addLog(str,_this.editStr+'现费用：'+_this.form.receivables_total_cost+'总费用：'+_this.form.receivables_total_cost);
                }else {
                  let str='';
                  if(_this.form.receivables_type==1){
                    str='新增应收款';
                  }
                  if(_this.form.receivables_type==2){
                    str='新增已收款';
                  }
                  _this.addLog(str,'总费用：'+_this.form.receivables_total_cost);
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
      submitForm2(){
        let _this=this;
        let saveData=this.statisticalDate;
        saveData.receivables_finance=this.receivables_finance;
        saveData.receivables_date=new Date().getTime();
        saveData.receivables_type=2;
        for(let j in saveData){
          if(!saveData[j]){
            saveData[j]=0;
          }
          if(saveData[j]=='null'){
            saveData[j]=0;
          }
        }
        delete saveData.id;
        delete saveData.creat_time;
        delete saveData.updtae_time;
        let url='/Views/admin/addTable.aspx?T=work_receivables';
        let saveDataStr={
          data:JSON.stringify(saveData)
        }
        $_post(url,saveDataStr).then(function (response) {
          if(response.code==1){
            _this.$message.success('操作成功');
            _this.thisComputeDate=new Date().getTime();
            _this.getData();
            _this.addLog("转换为已收款",'总费用：'+saveData.receivables_total_cost);
            _this.editVisible2=false;
          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleDelete(id) {
        this.removeId = id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow() {
        let _this = this;
        $_get('/Views/admin/deleteTable.aspx?T=work_receivables&id=' + _this.removeId).then(function (response) {
          if (response.code == 1) {
            _this.thisComputeDate=null;
            _this.getData();
            _this.$message.success('删除成功');
            _this.delVisible = false;
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      handleAdd(type){
        this.eidx='';
        this.dialogName='添加应收款';
        if(type==2){
          this.dialogName='添加已收款';
        }
        this.form={
          receivables_type:type, //1是应收款，2是已收款，
          receivables_date:'',
          receivables_zqf:'',//作曲费
          receivables_bqyyf:'',//版权音乐费
          receivables_tgf:'',//退稿费
          receivables_ycf:'',//演唱费
          receivables_jingle:'',//jingle
          receivables_xqf:'',//选曲费
          receivables_lyf:'',//录音费
          receivables_pyf:'',//配音费
          receivables_gz:'',//广州
          receivables_gzpy:'',//广州配音
          receivables_khfy:'',//客户费用
          receivables_tax:'',//税
          receivables_bqjy:'',//版权交易
          receivables_authorize:'',//授权
          receivables_other:'',//其他
          receivables_total_cost:0,//总费用
          receivables_reminders:'1', //催款对象  应收款才有此项
          receivables_remarks:'',
          receivables_contacts:'',//联系人
          receivables_finance:'',//财务账户
          work_id:this.work_id,
        };
        this.editVisible = true;
      },
      handleEdit(row,type) {
        this.eidx=row;
        this.editStr='原费用：'+row.receivables_total_cost;
        row=JSON.parse(JSON.stringify(row));
        this.dialogName='修改应收款';
        if(type==2){
          this.dialogName='修改已收款';
        }
        this.form=row;
        this.form.receivables_finance=parseInt(row.receivables_finance);
        this.form.receivables_reminders=row.receivables_reminders+'';
        delete this.form.id;
        delete this.form.user_id;
        delete this.form.updtae_time;
        delete this.form.creat_time;
        console.log(row)
        this.editVisible = true;
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/getWorkIdByDetail.aspx?T=work_receivables&workId=' + _this.form.work_id).then(function (response) {
          if (response.code == 1) {
            let da = response.data;
            _this.tableData=da;
            for(let i in da){
              if(da[i].receivables_type==3){
                _this.statisticalDate=da[i];
                break
              }
            }
            if(_this.isLoad){
              _this.computeDate(da);
            }
            _this.isLoad=true;


          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      computeDate(arrs){
        let isEditCurrent={
          type3:false,
          type4:false,
          type5:false
        };  //判断更新或者添加
        let data={
          receivables_type:3, // 3是应收款减去已收款
          receivables_zqf:0,//作曲费
          receivables_bqyyf:0,//版权音乐费
          receivables_tgf:0,//退稿费
          receivables_ycf:0,//演唱费
          receivables_jingle:0,//jingle
          receivables_xqf:0,//选曲费
          receivables_lyf:0,//录音费
          receivables_pyf:0,//配音费
          receivables_gz:0,//广州
          receivables_gzpy:0,//广州配音
          receivables_khfy:0,//客户费用
          receivables_tax:0,//税
          receivables_bqjy:0,//版权交易
          receivables_authorize:0,//授权
          receivables_other:0,//其他
          receivables_total_cost:0,//总费用
          work_id:this.work_id,
        }
        if(this.thisComputeDate){
          data.receivables_date=this.thisComputeDate;
        }
        data.receivables_remarks=this.thisMsg;

        let data3=JSON.parse(JSON.stringify(data)); //3是应收款减去已收款
        data3.receivables_type=3;
        let data4=JSON.parse(JSON.stringify(data)); //4是应收款总和
        data4.receivables_type=4;
        let data5=JSON.parse(JSON.stringify(data)); //5是已收款总和
        data5.receivables_type=5;
        for(let i in arrs){
          if(arrs[i].receivables_type==1){
            data4.receivables_zqf+=arrs[i].receivables_zqf?parseFloat(arrs[i].receivables_zqf):0;
            data4.receivables_bqyyf+=arrs[i].receivables_bqyyf?parseFloat(arrs[i].receivables_bqyyf):0;
            data4.receivables_tgf+=arrs[i].receivables_tgf?parseFloat(arrs[i].receivables_tgf):0;
            data4.receivables_ycf+=arrs[i].receivables_ycf?parseFloat(arrs[i].receivables_ycf):0;
            data4.receivables_jingle+=arrs[i].receivables_jingle?parseFloat(arrs[i].receivables_jingle):0;
            data4.receivables_xqf+=arrs[i].receivables_xqf?parseFloat(arrs[i].receivables_xqf):0;
            data4.receivables_lyf+=arrs[i].receivables_lyf?parseFloat(arrs[i].receivables_lyf):0;
            data4.receivables_pyf+=arrs[i].receivables_pyf?parseFloat(arrs[i].receivables_pyf):0;
            data4.receivables_gz+=arrs[i].receivables_gz?parseFloat(arrs[i].receivables_gz):0;
            data4.receivables_gzpy+=arrs[i].receivables_gzpy?parseFloat(arrs[i].receivables_gzpy):0;
            data4.receivables_khfy+=arrs[i].receivables_khfy?parseFloat(arrs[i].receivables_khfy):0;
            data4.receivables_tax+=arrs[i].receivables_tax?parseFloat(arrs[i].receivables_tax):0;
            data4.receivables_bqjy+=arrs[i].receivables_bqjy?parseFloat(arrs[i].receivables_bqjy):0;
            data4.receivables_authorize+=arrs[i].receivables_authorize?parseFloat(arrs[i].receivables_authorize):0;
            data4.receivables_other+=arrs[i].receivables_other?parseFloat(arrs[i].receivables_other):0;
            data4.receivables_total_cost+=arrs[i].receivables_total_cost?parseFloat(arrs[i].receivables_total_cost):0;
          }
          if(arrs[i].receivables_type==2){
            data5.receivables_zqf+=arrs[i].receivables_zqf?parseFloat(arrs[i].receivables_zqf):0;
            data5.receivables_bqyyf+=arrs[i].receivables_bqyyf?parseFloat(arrs[i].receivables_bqyyf):0;
            data5.receivables_tgf+=arrs[i].receivables_tgf?parseFloat(arrs[i].receivables_tgf):0;
            data5.receivables_ycf+=arrs[i].receivables_ycf?parseFloat(arrs[i].receivables_ycf):0;
            data5.receivables_jingle+=arrs[i].receivables_jingle?parseFloat(arrs[i].receivables_jingle):0;
            data5.receivables_xqf+=arrs[i].receivables_xqf?parseFloat(arrs[i].receivables_xqf):0;
            data5.receivables_lyf+=arrs[i].receivables_lyf?parseFloat(arrs[i].receivables_lyf):0;
            data5.receivables_pyf+=arrs[i].receivables_pyf?parseFloat(arrs[i].receivables_pyf):0;
            data5.receivables_gz+=arrs[i].receivables_gz?parseFloat(arrs[i].receivables_gz):0;
            data5.receivables_gzpy+=arrs[i].receivables_gzpy?parseFloat(arrs[i].receivables_gzpy):0;
            data5.receivables_khfy+=arrs[i].receivables_khfy?parseFloat(arrs[i].receivables_khfy):0;
            data5.receivables_tax+=arrs[i].receivables_tax?parseFloat(arrs[i].receivables_tax):0;
            data5.receivables_bqjy+=arrs[i].receivables_bqjy?parseFloat(arrs[i].receivables_bqjy):0;
            data5.receivables_authorize+=arrs[i].receivables_authorize?parseFloat(arrs[i].receivables_authorize):0;
            data5.receivables_other+=arrs[i].receivables_other?parseFloat(arrs[i].receivables_other):0;
            data5.receivables_total_cost+=arrs[i].receivables_total_cost?parseFloat(arrs[i].receivables_total_cost):0;
          }
          if(arrs[i].receivables_type==3){
            isEditCurrent.type3=arrs[i].id;
          }
          if(arrs[i].receivables_type==4){
            isEditCurrent.type4=arrs[i].id;
          }
          if(arrs[i].receivables_type==5){
            isEditCurrent.type5=arrs[i].id;
          }
        }
        data3.receivables_zqf=data4.receivables_zqf-data5.receivables_zqf;
        data3.receivables_bqyyf=data4.receivables_bqyyf-data5.receivables_bqyyf;
        data3.receivables_tgf=data4.receivables_tgf-data5.receivables_tgf;
        data3.receivables_ycf=data4.receivables_ycf-data5.receivables_ycf;
        data3.receivables_jingle=data4.receivables_jingle-data5.receivables_jingle;
        data3.receivables_xqf=data4.receivables_xqf-data5.receivables_xqf;
        data3.receivables_lyf=data4.receivables_lyf-data5.receivables_lyf;
        data3.receivables_pyf=data4.receivables_pyf-data5.receivables_pyf;
        data3.receivables_gz=data4.receivables_gz-data5.receivables_gz;
        data3.receivables_gzpy=data4.receivables_gzpy-data5.receivables_gzpy;
        data3.receivables_khfy=data4.receivables_khfy-data5.receivables_khfy;
        data3.receivables_tax=data4.receivables_tax-data5.receivables_tax;
        data3.receivables_bqjy=data4.receivables_bqjy-data5.receivables_bqjy;
        data3.receivables_authorize=data4.receivables_authorize-data5.receivables_authorize;
        data3.receivables_other=data4.receivables_other-data5.receivables_other;
        data3.receivables_total_cost=data4.receivables_total_cost-data5.receivables_total_cost;

        console.log(data4,data5,data3)
        this.computeDateSave(isEditCurrent.type3,data3);
        this.computeDateSave(isEditCurrent.type4,data4);
        this.computeDateSave(isEditCurrent.type5,data5);
        this.statisticalDate=data3;
      },
      computeDateSave(type,data){
        let _this=this;
        let saveData={
          data:JSON.stringify(data)
        }
        let url='/Views/admin/addTable.aspx?T=work_receivables';
        if(type){
          url='/Views/admin/updateTable.aspx?T=work_receivables';
          saveData.id=type;
        }
        $_post(url,saveData).then(function (response) {
          if(response.code==1){

          }else {
            _this.$message.error(response.msg);
          }
        })
      }

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

