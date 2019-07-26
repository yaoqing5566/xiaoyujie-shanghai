<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>新增客户资料</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="container">
            <div class="form-box" style="width: 100%;">
                <el-form :model="saveData" :rules="rules"  ref="saveData" label-width="100px" class="demo-ruleForm" style="width: 100%">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="编号" prop="number">
                        <el-input v-model="saveData.number"></el-input>
                      </el-form-item>
                      <el-form-item label="名称" prop="name">
                        <el-input v-model="saveData.name"></el-input>
                      </el-form-item>
                      <el-form-item label="性质">
                        <el-select v-model="saveData.nature" placeholder="性质"  style="width: 100%">
                          <el-option v-for="(items,index) in config.cpNature" :key="index" :label="items" :value="index"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="背景">
                        <el-select v-model="saveData.backdrop"  placeholder="背景" style="width: 100%">
                          <el-option v-for="(items,index) in config.cpBackground" :key="index" :label="items" :value="index"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="全名">
                        <el-input v-model="saveData.fullName"></el-input>
                      </el-form-item>
                      <el-form-item label="主要联络人">
                        <el-input v-model="saveData.key_contacts"></el-input>
                      </el-form-item>
                      <el-form-item label="电话">
                        <el-input v-model="saveData.phone"></el-input>
                      </el-form-item>
                      <el-form-item label="传真">
                        <el-input v-model="saveData.fax"></el-input>
                      </el-form-item>
                      <el-form-item label="手机">
                        <el-input v-model="saveData.mobile"></el-input>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <h4 style="padding: 0 0 0 30px; line-height: 50px">开票信息</h4>
                      <el-form-item label="公司名称">
                        <el-input v-model="saveData.company_name"></el-input>
                      </el-form-item>
                      <el-form-item label="税号">
                        <el-input v-model="saveData.duty_paragraph"></el-input>
                      </el-form-item>
                      <el-form-item label="地址">
                        <el-input v-model="saveData.company_address"></el-input>
                      </el-form-item>
                      <el-form-item label="电话">
                        <el-input v-model="saveData.company_phone"></el-input>
                      </el-form-item>
                      <el-form-item label="开户行">
                        <el-input v-model="saveData.opening_bank"></el-input>
                      </el-form-item>
                      <el-form-item label="银行账号">
                        <el-input  v-model="saveData.bank_account"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="Email">
                    <el-input   v-model="saveData.email"></el-input>
                  </el-form-item>
                  <el-form-item label="联络地址">
                    <el-input   v-model="saveData.address"></el-input>
                  </el-form-item>
                  <el-form-item label="QQ">
                    <el-input   v-model="saveData.qq"></el-input>
                  </el-form-item>
                  <el-form-item label="MSN">
                    <el-input   v-model="saveData.msn"></el-input>
                  </el-form-item>
                  <el-form-item label="微信">
                    <el-input   v-model="saveData.we_chat"></el-input>
                  </el-form-item>
                  <el-form-item label="网址">
                    <el-input placeholder="" v-model="saveData.website">
                      <template slot="prepend">Http://</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="'别名'+(index+1)" v-for="(alia,index) in saveData.alias" :key="index">
                    <el-input v-model="saveData.alias[index]"></el-input>
                  </el-form-item>

                  <div style="padding: 0 0 30px 55px">
                    <h4 style=" line-height: 50px">其他联系人
                      <el-button style="float: right;margin-top:9px" @click="addContacts"  type="primary"  class="handle-del mr10">添加</el-button>
                    </h4>
                    <el-table :data="saveData.other_contacts" border style="width: 100%">
                      <el-table-column label="姓名">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.name"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="职位">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.job"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="电话">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.phone"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column  label="手机">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.mobil"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column  label="电邮">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.email"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column  label="QQ">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.qq"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column  label="微信">
                        <template slot-scope="scope">
                          <el-input   v-model="scope.row.we_chat"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                          <el-button size="small" type="danger" @click="deleteContacts(scope.$index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                  </div>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('saveData')">保存</el-button>
                        <el-button @click="$store.commit('goBack')">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>
<script>

    export default {
        components:{

         },
        data() {
            return {
                saveData:{
                  number:'',
                  name:'',
                  nature:0, //性质
                  backdrop:0,//背景
                  fullName:'',
                  key_contacts:'',//主要联络人
                  phone:'',
                  fax:'',//传真
                  mobile:'',
                  email:'',
                  address:'',
                  qq:'',
                  msn:'',
                  we_chat:'',
                  website:'',//网址
                  alias:['','','','','',''],//别名
                  other_contacts:[{name:'',job:'',phone:'',mobil:'',email:'',qq:'',we_chat:''}],//其他联系人
                  company_name:'', //公司名称
                  duty_paragraph:'',//税号
                  company_address:'', //公司地址
                  company_phone:'', //公司电话
                  opening_bank:'', //开户行
                  bank_account:'' //银行账号
                },
                id:'',
                rules: {
                  number: [
                      { required: true, message: '请输入编号', trigger: 'blur' }
                    ],
                  name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                  ]
                },
              config:CONFIG
            };
        },
      mounted(){

      },
        created(){
          this.id=this.$route.query.id;
          if(this.id){
            this.getData();
          }

        },
        methods: {
           getData(){
             let _this=this;
             $_get('/Views/admin/getByIdDetail.aspx?T=customer&id='+_this.id).then(function (response) {
               if(response.code==1){
                 var da=response.data[0];
                 delete da.updtae_time;
                 delete da.user_id;
                 delete da.creat_time;
                 delete da.id;
                 console.log(da)

                 da.alias=da.alias?JSON.parse(da.alias):['','','','','',''];
                 da.other_contacts=da.other_contacts?JSON.parse(da.other_contacts):[];
                 _this.saveData=da

               }else {
                 _this.$message.error(response.msg);
               }
             })
           },
            addContacts(){
                this.saveData.other_contacts.push({name:'',job:'',phone:'',mobil:'',email:'',qq:'',we_chat:''});
            },
          deleteContacts(index){
            this.saveData.other_contacts.splice(index,1)
          },
            submitForm(saveData) {
               let _this=this;
               this.$refs[saveData].validate((valid) => {
                    if (valid) {
                      let url='/Views/admin/info/customer.aspx';
                      if(!_this.id){//新建
                        _this.saveData.user_id=_this.$store.state.userInfo.id;
                      }
                      let saveData={
                        data:JSON.stringify(_this.saveData)
                      }
                      if(this.id){//更新
                        url='/Views/admin/info/updateCustomer.aspx';
                        saveData.id=_this.id;
                      }
                      console.log(this.ruleForm)
                      $_post(url,saveData).then(function (response) {
                        if(response.code==1){
                          _this.$message.success('操作成功');
                          _this.$router.push('/customerInfo');
                        }else {
                          _this.$message.error(response.msg);
                        }
                      })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>
