<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 新增联系人</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 100%;">
                <el-form :model="saveData" :rules="rules"  ref="saveData" label-width="100px" class="demo-ruleForm" style="width: 100%">
                  <el-form-item label="工作单">{{workData.work_number}} </el-form-item>
                  <el-form-item label="类型">
                    <el-radio-group v-model="saveData.type">
                      <el-radio style="padding-bottom: 0px" v-for="(item,index) in config.addContactsType" :label="index" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                  </el-form-item>


                  <el-form-item label="称呼" prop="identity">
                    <el-input v-model="saveData.identity" style="width: 200px"></el-input>
                    <el-select v-model="zdy" placeholder="自定义" @change="onSelectedDrug">
                      <el-option label="自定义" value=""></el-option>
                      <el-option v-for="(items,index) in config.identity" :key="index" :label="items" :value="items"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="saveData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="手机">
                    <el-input v-model="saveData.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="saveData.phone"></el-input>
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
                  <el-form-item label="MSN">
                    <el-input v-model="saveData.msn"></el-input>
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
                workData:{},
                saveData:{
                  work_id:'',
                  identity:'',
                  name:'',
                  type:0,
                  phone:'',
                  mobile:'',
                  email:'',
                  address:'',
                  qq:'',
                  msn:''
                },
                zdy:'',
                config:CONFIG,
                id:'',
                rules: {
                  identity: [
                      { required: true, message: '请输入称呼', trigger: 'blur' }
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
          this.saveData.work_id=this.$route.query.workId;
          this.getData();
          if(this.id){
          }

        },
        methods: {
          onSelectedDrug(item) {
            this.saveData.identity=item;
            console.log(item)
          },
           getData(){
             let _this=this;
             $_get('/Views/admin/getByIdDetail.aspx?T=work_sheet&id='+_this.saveData.work_id).then(function (response) {
               if(response.code==1){
                 _this.workData=response.data[0];
               }else {
                 _this.$message.error(response.msg);
               }
             })
           },
            submitForm(saveData) {
               let _this=this;
               this.$refs[saveData].validate((valid) => {
                    if (valid) {
                      let ms_user=JSON.parse(localStorage.getItem('ms_user'));
                      let url='/Views/admin/business/addContacts.aspx';
                      if(!_this.id) {//新建
                        _this.saveData.user_id=ms_user.id;
                        _this.saveData.user_name=ms_user.name;
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
                          history.go(-1)
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
