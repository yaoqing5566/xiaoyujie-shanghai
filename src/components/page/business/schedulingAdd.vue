<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 新建排班表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 100%;">
        <el-form :model="saveData"  ref="saveData" label-width="100px" class="demo-ruleForm" style="width: 100%">
          <h4 style="padding: 10px 0 20px 32px">工作单信息</h4>
          <el-form-item label="工作内容">
            <el-radio-group v-model="saveData.content">
              <el-radio style="padding-bottom: 0px" v-for="(item,index) in workDetail.work_nature" :label="item" :key="index">{{config.workNature[item]}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="saveData.times.date" type="date" placeholder="选择日期"></el-date-picker> -
            <el-time-picker style="width: 180px"  placeholder="开始时间"  v-model="saveData.times.time.start" format="HH:mm"></el-time-picker>
            至
            <el-time-picker style="width: 180px" v-model="saveData.times.time.end"  placeholder="结束时间" format="HH:mm"></el-time-picker>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="录音室">
                <el-select  v-model="saveData.sounds_studio_id" filterable placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in soundStudio" :key="item.id" :label="item.name+'('+item.number+')'" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内部录音师">
                <el-select v-model="saveData.sound_engineer" filterable placeholder="请选择" style="width: 100%" @change="choseSupplier">
                  <el-option v-if="item.type.lastIndexOf('录音师')>0" v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="指定配音" style="margin-bottom: 0px; display: inline-block">
                <el-radio v-model="saveData.sp_dub" label="1">指定</el-radio>
                <el-radio v-model="saveData.sp_dub" label="2">推荐</el-radio>
              </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-form-item label="指定录音师" style="margin-bottom: 0px; display: inline-block">
                <el-radio v-model="saveData.sp_studio" label="1">指定</el-radio>
                <el-radio v-model="saveData.sp_studio" label="2">推荐</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排班类别" style="margin-bottom: 0px; display: inline-block">
                <el-radio-group v-model="saveData.pb_category">
                  <el-radio style="padding-bottom: 0px" v-for="(ad,index) in config.schedulingCategory" :label="index" :key="index">{{ad}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="语种" style="margin-bottom: 0px; display: inline-block">
            <el-checkbox-group v-model="saveData.language">
              <el-checkbox v-for="(branch,index) in config.pb_language" :label="index" :key="index">{{branch}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="备注">
            <el-input   v-model="saveData.remarks"></el-input>
          </el-form-item>


          <div style="padding: 0 0 0 36px">
            <h4 style=" padding-bottom: 10px; text-align: right">
              <el-button @click="addProjects"  type="primary"  class="handle-del mr10">添加供应方</el-button>
            </h4>
            <el-table :data="saveData.suppliers" border style="width: 100%">
              <el-table-column label="身份">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.identity" placeholder="请选择"  style="width: 100%">
                    <el-option v-for="(items,index) in config.pb_identity" :key="index" :label="items" :value="items"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="编号">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.supplier_id" filterable placeholder="请选择" style="width: 100%" @change="choseSupplier(scope.row)">
                    <el-option v-for="item in supplierList" :key="item.id" :label="item.number+'('+item.name+')'" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="供应方名称">
                <template slot-scope="scope">
                  {{scope.row.supplier_name}}
                </template>

              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="deleteProjects(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-form-item style="padding-top: 50px; text-align: center">
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
          content:'',
          times:{date:'',time:{start:'',end:''}},
          sounds_studio_id:'',//录音室
          sound_engineer:'',//内部录音师  供应方ID
          sp_dub:'1',//指定配音
          sp_studio:'1',//指定录音师
          pb_category:0,//排班类别
          language:[],
          remarks:'',
          work_id:'',
          suppliers:[] //供应方
        },
        id:'',
        workDetail:'',
        supplierList:'',
        soundStudio:'',
        config:CONFIG,
        newsId:'',
        userInfo:JSON.parse(localStorage.getItem('ms_user')),
      };
    },
    mounted(){
    },
    created(){
      let _this=this;
      this.saveData.work_id=this.$route.query.workId;
      this.id=this.$route.query.id;
      if(this.id){
        this.getData();
      }
      //获取供应方列表
      $_get('/Views/admin/info/readSupplier.aspx?pageIndex=1&pageSize=1000&number=&name=').then(function (response) {
        if(response.code==1){
          _this.supplierList=response.data.list;
        }else {
          _this.$message.error(response.msg);
        }
      })

      //获取录音室
      $_get('/Views/admin/info/readStudio.aspx?pageIndex=1&pageSize=1000&number=&name=').then(function (response) {
        if(response.code==1){
          _this.soundStudio=response.data.list;
        }else {
          _this.$message.error(response.msg);
        }
      })

      //获取工作单基本信息
      $_get('/Views/admin/getByIdDetail.aspx?T=work_sheet&id=' + _this.saveData.work_id).then(function (response) {
        if (response.code == 1) {
          let da = response.data[0];
          _this.workDetail=da;
          if(da.work_nature){
            _this.workDetail.work_nature=JSON.parse(da.work_nature);
            console.log(_this.workDetail.work_nature)
          }
        } else {
          _this.$message.error(response.msg);
        }
      })

    },
    methods: {
      addLog(behavior,log_remarks){
        let _this=this;
        let saveData={
          data:JSON.stringify({
            work_id:_this.saveData.work_id,
            behavior:behavior,
            log_remarks:log_remarks,
            user_id:_this.$store.state.userInfo.id
          })
        }
        $_post('/Views/admin/business/addLog.aspx',saveData).then(function (response) {})
      },
      addProjects(){
        this.saveData.suppliers.push({identity:'',supplier_number:'',supplier_name:'',supplier_id:''});
      },
      deleteProjects(index){
        this.saveData.suppliers.splice(index,1)
      },
      choseSupplier(items){
        let item=this.getSupplierRow(items.supplier_id);
        console.log(item)
        if(item){
          items.supplier_name=item.name;
          items.supplier_number=item.number;
        }
      },
      getSupplierRow(id){
        let d=this.supplierList;
        for(let index in d){
          if(id==d[index].id){
            return d[index];
          }
        }
        return false;
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/getByIdDetail.aspx?T=work_scheduling&id='+_this.id).then(function (response) {
          if(response.code==1){
            let data=response.data[0];
            _this.saveData.sounds_studio_id=parseInt(data.sounds_studio_id);
            _this.saveData.sound_engineer=parseInt(data.sound_engineer);
            _this.saveData.sp_dub=data.sp_dub;
            _this.saveData.sp_studio=data.sp_studio;
            _this.saveData.pb_category=data.pb_category;
            _this.saveData.remarks=data.remarks;
            _this.saveData.language=JSON.parse(data.language);
            _this.saveData.suppliers=JSON.parse(data.suppliers);
            _this.saveData.content=parseInt(data.content);
            _this.saveData.times.date=data.start_time;
            _this.saveData.times.time.start=new Date(data.start_time);
            _this.saveData.times.time.end=new Date(data.end_time);

          }else {
            _this.$message.error(response.msg);
          }
        })
      },
      submitForm(saveData) {
        if(this.userInfo.type!=1&&this.saveData.work_scheduling_state==1){
          this.$message.error("审核过了不能修改！");
          return
        }
        let _this=this;
        this.$refs[saveData].validate((valid) => {
          if (valid) {
            let ms_user=JSON.parse(localStorage.getItem('ms_user'));
            let cloneObj=JSON.parse(JSON.stringify(_this.saveData));
            if(!cloneObj.times.date){
              _this.$message.error("请选择日期！");
              return false;
            }
            if(!cloneObj.times.time.start){
              _this.$message.error("请选择开始时间！");
              return false;
            }
            if(!cloneObj.times.time.end){
              _this.$message.error("请选择结束时间！");
              return false;
            }
            let dateMonth=moment(cloneObj.times.date).format("YYYY-MM-DD");
            let time1=moment(cloneObj.times.time.start).format("HH:mm:ss");
            let time2=moment(cloneObj.times.time.end).format("HH:mm:ss");
            cloneObj.scheduling_date=dateMonth;
            cloneObj.start_time=new Date(dateMonth+" "+time1).getTime();
            cloneObj.end_time=new Date(dateMonth+" "+time2).getTime();
            delete cloneObj.times;
            if(!_this.id) {//新建
              cloneObj.user_id=ms_user.id;
              cloneObj.user_name=ms_user.name;
            }
            let url='/Views/admin/addTable.aspx?T=work_scheduling';
            console.log(cloneObj)

            let saveData={
              data:JSON.stringify(cloneObj)
            }
            if(this.id){//更新
              url='/Views/admin/updateTable.aspx?T=work_scheduling';
              saveData.id=_this.id;
            }

            $_post(url,saveData).then(function (response) {
              if(response.code==1){
                _this.$message.success('操作成功');
                if(_this.id) {//更新
                  _this.addLog('修改排班','修改排班');
                }else {
                  _this.addLog('新增排班','新增排班');
                }


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
      },
    }
  }
</script>
