<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 新增工作单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 100%;">
        <div style="margin: 10px 10px 30px 90px">
          <el-steps :active="stepActive" finish-status="success">
            <el-step title="第1步" description="主要信息"></el-step>
            <el-step title="第2步" description="次要信息"></el-step>
            <!--<el-step title="第3步" description="确认信息"></el-step>-->
          </el-steps>
        </div>


        <!--第一步-->
        <el-form :model="saveData" :rules="rules" ref="saveData" label-width="100px" class="demo-ruleForm"
                 style="width: 100%" v-if="stepActive==0">
          <h4 style="padding: 10px 0 20px 55px">个人信息</h4>
          <el-form-item label="客户编号" prop="customer_id">
            <el-select clearable class="inline-input" v-model="saveData.customer_id" filterable placeholder="请输入内容" @change="handleSelect" style="width: 100%">
              <el-option v-for="item in restaurants" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker style="width:100%" v-model="saveData.date" align="left" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="片名" prop="name">
            <el-input v-model="saveData.name"></el-input>
          </el-form-item>
          <el-form-item label="业务性质">
            <div class="my-ywxz">广告</div>
            <el-radio-group v-model="saveData.business_nature.ad" @change="changeHandler(saveData.business_nature.ad,'ad')">
              <el-radio v-for="(ad,index) in config.business.ad" :label="index" :key="index">{{ad}}</el-radio>
            </el-radio-group>
            <div class="my-ywxz">游戏</div>
            <el-radio-group v-model="saveData.business_nature.game" @change="changeHandler(saveData.business_nature.game,'game')">
              <el-radio v-for="(game,index) in config.business.game" :label="index" :key="index">{{game}}</el-radio>
            </el-radio-group>
            <div class="my-ywxz">影视剧/舞台剧</div>
            <el-radio-group v-model="saveData.business_nature.mv" @change="changeHandler(saveData.business_nature.mv,'mv')">
              <el-radio v-for="(mv,index) in config.business.mv" :label="index" :key="index">{{mv}}</el-radio>
            </el-radio-group>
            <div class="my-ywxz">唱片</div>
            <el-radio-group v-model="saveData.business_nature.record" @change="changeHandler(saveData.business_nature.record,'record')">
              <el-radio v-for="(record,index) in config.business.record" :label="index" :key="index">{{record}}
              </el-radio>
            </el-radio-group>
            <div class="my-ywxz">现场</div>
            <el-radio-group v-model="saveData.business_nature.scene" @change="changeHandler(saveData.business_nature.scene,'scene')">
              <el-radio v-for="(scene,index) in config.business.scene" :label="index" :key="index">{{scene}}</el-radio>
            </el-radio-group>
            <div class="my-ywxz">播放授权</div>
            <el-radio-group v-model="saveData.business_nature.authorize" @change="changeHandler(saveData.business_nature.authorize,'authorize')">
              <el-radio v-for="(authorize,index) in config.business.authorize" :label="index" :key="index">
                {{authorize}}
              </el-radio>
            </el-radio-group>
            <div class="my-ywxz">版权交易</div>
            <el-radio-group v-model="saveData.business_nature.copyright" @change="changeHandler(saveData.business_nature.copyright,'copyright')">
              <el-radio v-for="(copyright,index) in config.business.copyright" :label="index" :key="index">
                {{copyright}}
              </el-radio>
            </el-radio-group>
            <div class="my-ywxz">其他</div>
            <el-radio-group v-model="saveData.business_nature.other" @change="changeHandler(saveData.business_nature.other,'other')">
              <el-radio v-for="(other,index) in config.business.other" :label="index" :key="index">{{other}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="saveData.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('saveData')">确定</el-button>
            <el-button @click="$store.commit('goBack')">返回</el-button>
          </el-form-item>
        </el-form>
        <!--第一步-end-->


        <!--第二步-->
        <el-form :model="saveData2" :rules="rules2" ref="saveData2" label-width="100px" class="demo-ruleForm"
                 style="width: 100%" v-if="stepActive==1">
          <h4 style="padding: 10px 0 20px 55px">工作单：{{saveData.work_number}}</h4>
          <el-form-item label="客户编号">
            <span v-for="item in restaurants" v-if="item.id==saveData.customer_id">{{item.number+'('+item.name+')'}}</span>

          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker readonly style="width:100%" v-model="saveData.date" align="left" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="业务性质">
            <span v-html="$options.filters.formatBusiness(saveData.business_nature)"></span>
          </el-form-item>
          <el-form-item label="工作性质">
            <el-checkbox-group v-model="saveData2.work_nature">
              <el-checkbox v-for="(item,index) in config.workNature" :label="index" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <h4 style="padding: 10px 0 20px 55px">{{$options.filters.formatBusiness2(saveData.business_nature)}}</h4>

          <!--广告-->
          <div v-if="typeKey=='ad'">
            <el-form-item label="片名">
              <el-input  v-model="saveData2.name"></el-input>
            </el-form-item>
            <el-form-item label="篇名">
              <el-input v-model="saveData2.gz_title"></el-input>
            </el-form-item>
          </div>

          <!--影视剧/舞台剧-->
          <div v-else-if="typeKey=='mv'">
            <el-form-item label="片名">
              <el-input  v-model="saveData2.name"></el-input>
            </el-form-item>
          </div>

          <!--现场-->
          <div v-else-if="typeKey=='scene'">
            <el-form-item label="片名">
              <el-input  v-model="saveData2.name"></el-input>
            </el-form-item>
          </div>

          <!--唱片-->
          <div v-else-if="typeKey=='record'">
            <el-form-item label="片名">
              <el-input  v-model="saveData2.name"></el-input>
            </el-form-item>
            <el-form-item label="曲目数" style="width: 300px">
              <el-input  v-model="saveData2.gz_size[0]"></el-input>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item label="片名">
              <el-input  v-model="saveData2.name"></el-input>
            </el-form-item>
          </div>


          <el-form-item label="长度" class="ganggao" v-if="typeKey!='record'">
            <el-input placeholder="0" v-model="saveData2.gz_size[0]" style="width: 120px">
              <template slot="append" style="padding: 0px">小时</template>
            </el-input>
            <el-input placeholder="0" v-model="saveData2.gz_size[1]" style="width: 120px">
              <template slot="append">分钟</template>
            </el-input>
            <el-input placeholder="0" v-model="saveData2.gz_size[2]" style="width: 120px">
              <template slot="append">秒</template>
            </el-input>
          </el-form-item>


          <h4 style="padding: 10px 0 20px 55px">联系人</h4>
          <el-form-item label="身份">
            <el-radio-group v-model="saveData2.identity">
              <el-radio style="padding-bottom: 0px" v-for="(identity,index) in config.identity" :label="identity"
                        :key="index">{{identity}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联络人">
            <el-autocomplete style="width: 100%" class="inline-input" @select="handleSelect2" :fetch-suggestions="querySearchAsync" v-model="saveData2.liaison"></el-autocomplete>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="saveData2.phone"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="saveData2.mobile"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="saveData2.email"></el-input>
          </el-form-item>
          <el-form-item label="联络地址">
            <el-input v-model="saveData2.address"></el-input>
          </el-form-item>
          <el-form-item label="QQ">
            <el-input v-model="saveData2.qq"></el-input>
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="saveData2.msn"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm2('saveData2')">确定</el-button>
            <el-button @click="stepActive=0">上一步</el-button>
          </el-form-item>
        </el-form>
        <!--第二步-end-->
      </div>
    </div>

  </div>
</template>
<style>
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
        saveData: {
          work_number:'',
          customer_number: '',
          customer_id: '',
          customer_name: '',
          name: '',
          date: '',
          business_nature: {},//业务性质
          remark: '',
        },
        typeKey:'',
        stepActive: 0,
        config: CONFIG,
        id: '',
        rules: {
          customer_id: [
            {required: true, message: '请输入编号', trigger: 'change'}
          ],
          date: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ]
        },
        restaurants: [],
        restaurants2:[],
        saveData2: {
          work_nature:[],//工作性质
          name:'',
          gz_title: '',
          gz_size: ['','',''],
          identity: '制片',//身份
          liaison: '',//联络人
          phone: '',
          mobile: '',
          email: '',
          address: '',
          qq: '',
          msn: '',   //这里已经改成了微信
        },
        workId:'',
        rules2: {},
        tableData: [1, 2, 3],
        count:0,
        repeatRb:false
      };
    },
    mounted() {
      this.loadAll()
    },
    filters:{
      formatBusiness(data){
        let d=data;
        let str='';
        for (let key in d){
          str+="<strong>"+vm.config.businessEnum[key]+"</strong>"+"-"+vm.config.business[key][d[key]]+'，'
        }
        return str.substr(0,str.length-1)
      },
      formatBusiness2(data){
        let d=data;
        let str='';
        for (let key in d){
          str=vm.config.businessEnum[key];
          vm.typeKey=key;
        }
        return str;
      },
    },
    created() {

      this.id = this.$route.query.id;
      if (this.id) {
        this.workId=this.id;
        this.getData();
      }
      if(this.$route.query.stepActive){
        this.stepActive=parseInt(this.$route.query.stepActive);
      }
      let _this=this;
      // $_get('/Views/admin/business/readWork.aspx?pageIndex=1&pageSize=0&workNumber=&name=&cName=&fName=&offer=1').then(function (response) {
      //   if(response.code==1){
      //     _this.count=response.data.count;
      //
      //   }else {
      //     _this.$message.error(response.msg);
      //   }
      // })


    },
    methods: {
      changeHandler(value,key){
        this.saveData.business_nature={};
        this.saveData.business_nature[key]=value;

      },
      getData() {
        let _this = this;
        $_get('/Views/admin/getByIdDetail.aspx?T=work_sheet&id='+_this.id).then(function (response) {
          if (response.code == 1) {
            let da=response.data[0];
            _this.saveData.work_number=da.work_number;
            _this.saveData.customer_number=da.customer_number;
            _this.saveData.customer_id=parseInt(da.customer_id);
            _this.saveData.customer_name=da.customer_name;
            _this.saveData.name=da.name;
            _this.saveData.date=da.date;
            _this.saveData.business_nature=JSON.parse(da.business_nature);
            _this.saveData.remark=da.remark;
           if(da.work_nature){
             _this.saveData2.work_nature=JSON.parse(da.work_nature);
           }

            _this.saveData2.name=da.name;
            _this.saveData2.gz_title=da.gz_title;
            if(da.gz_size){
              _this.saveData2.gz_size=JSON.parse(da.gz_size);
            }else {
              _this.saveData2.gz_size=['','','']
            }

            _this.saveData2.identity=da.identity;
            _this.saveData2.liaison=da.liaison;
            _this.saveData2.phone=da.phone;
            _this.saveData2.mobile=da.mobile;
            _this.saveData2.email=da.email;
            _this.saveData2.address=da.address;
            _this.saveData2.qq=da.qq;
            _this.saveData2.msn=da.msn;
            _this.getCurData(_this.saveData.customer_id);
          } else {
            _this.$message.error(response.msg);
          }
        })
      },
      judgeRestaurants(number){
        for(let i in this.restaurants){
          let d=this.restaurants[i];
          if(number==d.id){
            return d;
          }
        }
        return false;
      },
      submitForm(saveData) {
        let _this=this;
        let ms_user=JSON.parse(localStorage.getItem('ms_user'));
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let save=JSON.parse(JSON.stringify(_this.saveData))
            let url='/Views/admin/business/addWork.aspx';
            save.date=parseInt(new Date(save.date).getTime()) ;
            if(!_this.id) {//新建
              save.user_id=ms_user.id;
              save.user_name=ms_user.name;
            }
            let saveData={
              data:JSON.stringify(save)
            }
            if(_this.id){//更新
              url='/Views/admin/business/updateWork.aspx';
              saveData.id=_this.id;
            }else {
              var startDate = moment().format("YYYY/MM/DD")+" 00:00:00";
              var endDate = moment().format("YYYY/MM/DD")+" 23:59:59";
              saveData.startTime=new Date(startDate).getTime();
              saveData.endTime=new Date(endDate).getTime();
            }
            if(_this.repeatRb){
              _this.$message.error("不能重复点击");
              return;
            }
            _this.repeatRb=true;
            $_post(url,saveData).then(function (response) {
              _this.repeatRb=false;
              if(response.code==1){
                _this.stepActive = 1;
                if(_this.id){//更新
                  _this.workId=_this.id;
                  if(_this.$route.query.type=='edit'){
                    _this.addLog('修改工作单','修改工作单');
                  }
                  _this.$router.push({path:'/myworkAdd',query:{id:_this.workId,stepActive:1}});
                }else {//新建
                  _this.workId=response.id;
                  _this.saveData.work_number=response.work_number;
                  _this.id=_this.workId;
                  _this.addLog('新增工作单','新增工作单');
                }
                _this.saveData2.name=_this.saveData.name;
                _this.getCurData(_this.saveData.customer_id);
                //_this.$message.success('操作成功');
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
      submitForm2(saveData2) {
        let _this=this;
        if(_this.typeKey!='ad'){
          _this.saveData2.gz_title="";
        }
        this.$refs[saveData2].validate((valid) => {
          if (valid) {
            let save2={
              data:JSON.stringify(_this.saveData2),
              id:_this.workId
            }
            $_post('/Views/admin/business/updateWork.aspx',save2).then(function (response) {
              if(response.code==1){
                if(_this.$route.query.type=='edit'){
                  _this.addLog('修改工作单','修改工作单');
                }
                _this.$router.push({path:'/manageMyWork',query:{id:_this.workId}});
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
      loadAll() {
        let _this=this;
        $_get('/Views/admin/business/getCustomerNumber.aspx').then(function (response) {
          if(response.code==1){
            _this.restaurants=response.data.list
          }else {
            _this.$message.error(response.msg);
          }
        })

      },
      handleSelect(item) {
        let d=this.judgeRestaurants(item);
        console.log(d);
        this.saveData.customer_number=d.number;
        this.saveData.customer_name=d.name;
      },
      handleSelect2(item){
        this.saveData2.phone=item.phone;
        this.saveData2.mobile=item.mobil;
        this.saveData2.email=item.email;
        this.saveData2.address=this.restaurants2.address;
        this.saveData2.qq=item.qq;
        this.saveData2.msn=item.we_chat;
      },
      querySearchAsync(queryString, cb) {
        let _this=this;
        let restaurants =_this.restaurants2.arrs;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      getCurData(id){
        let _this=this;
        _this.restaurants2={
          address:'',
          arrs:[]
        };
        if(this.stepActive==1){
          $_get('/Views/admin/getByIdDetail.aspx?T=customer&id='+id).then(function (response) {
            if(response.code==1){
              let data=response.data[0];
              let arrs=JSON.parse(data.other_contacts)
              for(let i in arrs){
                if(arrs[i].name){
                  arrs[i].value=arrs[i].name;
                  _this.restaurants2.arrs.push(arrs[i])
                }
              }
              _this.restaurants2.arrs.unshift({
                value:data.key_contacts,
                email:data.email,
                mobil:data.mobile,
                phone:data.phone,
                qq:data.qq,
                we_chat:data.we_chat,
              })

              _this.restaurants2.address=data.address
            }else {
              _this.$message.error(response.msg);
            }
          })
        }
      },
    },

  }
</script>
