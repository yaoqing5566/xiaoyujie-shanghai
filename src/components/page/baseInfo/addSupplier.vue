<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 新增供应方</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 100%;">
                <el-form :model="saveData" :rules="rules"  ref="saveData" label-width="100px" class="demo-ruleForm" style="width: 100%">
                  <el-form-item label="编号" prop="number">
                    <el-input v-model="saveData.number"></el-input>
                  </el-form-item>
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="saveData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="类型">
                    <el-checkbox-group v-model="saveData.type">
                      <el-checkbox v-for="(branch,index) in config.cpType" :label="branch" :key="index">{{branch}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="性质">
                    <el-radio v-model="saveData.nature" label="1">个人</el-radio>
                    <el-radio v-model="saveData.nature" label="2" style="margin-left: 10px">机构/团体</el-radio>
                  </el-form-item>

                  <h4 style="padding: 10px 0 20px 55px">个人信息</h4>
                  <el-form-item label="身份证号">
                    <el-input   v-model="saveData.id_number"></el-input>
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="saveData.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="手机">
                    <el-input v-model="saveData.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="Email">
                    <el-input   v-model="saveData.email"></el-input>
                  </el-form-item>
                  <el-form-item label="联络地址">
                    <el-input   v-model="saveData.address"></el-input>
                  </el-form-item>
                  <el-form-item label="QQ">
                    <el-input   v-model="saveData.qq"></el-input>
                  </el-form-item>
                  <el-form-item label="开户银行">
                    <el-input v-model="saveData.opening_bank"></el-input>
                  </el-form-item>
                  <el-form-item label="银行账号">
                    <el-input  v-model="saveData.bank_account"></el-input>
                  </el-form-item>
                  <el-form-item label="银行户名">
                    <el-input  v-model="saveData.bank_name"></el-input>
                  </el-form-item>

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
                  id_number:'', //身份证号
                  type:[],
                  nature:'1',//性质
                  phone:'',
                  mobile:'',
                  email:'',
                  address:'',
                  qq:'',
                  opening_bank:'', //开户行
                  bank_account:'', //银行账号
                  bank_name:''
                },
                config:CONFIG,
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
             $_get('/Views/admin/getByIdDetail.aspx?T=cms_supplier&id='+_this.id).then(function (response) {
               if(response.code==1){
                 var da=response.data[0];
                 delete da.updtae_time;
                 delete da.creat_time;
                 delete da.user_id;
                 delete da.id;
                 console.log(da)
                 da.type=JSON.parse(da.type);
                 _this.saveData=da

               }else {
                 _this.$message.error(response.msg);
               }
             })
           },
            submitForm(saveData) {
               let _this=this;
               this.$refs[saveData].validate((valid) => {
                    if (valid) {
                      let url='/Views/admin/info/addSupplier.aspx';
                      if(!_this.id){//新建
                        _this.saveData.user_id=_this.$store.state.userInfo.id;
                      }
                      let saveData={
                        data:JSON.stringify(_this.saveData)
                      }
                      if(this.id){//更新
                        url='/Views/admin/info/updateSupplier.aspx';
                        saveData.id=_this.id;
                      }
                      console.log(this.ruleForm)
                      $_post(url,saveData).then(function (response) {
                        if(response.code==1){
                          _this.$message.success('操作成功');
                          _this.$router.push('/supplier');
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
