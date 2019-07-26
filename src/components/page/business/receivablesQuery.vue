<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-date"></i> 应收款查询  &nbsp;&nbsp;&nbsp; 合计：{{allTotal}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">

      <div class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width:100%; margin-bottom: 10px">
        <div class="el-table__body-wrapper is-scrolling-left">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" width="100%" style="table-layout: inherit">
            <thead>
            <tr>
              <th width="100">
                <div class="cell">日期</div>
              </th>
              <th class="receivables-cost">
                <div class="cell">业务</div>
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
            </tr>
            </thead>
            <tbody v-for="itemp in tableData" v-if="itemp.receivables.length>0">
            <tr>
              <th colspan="19"  style="background-color: #fdfcf9;">
                <div class="cell">
                  {{itemp.name}}
                  <!--<el-button plain size="mini" type="primary" style="float: right; padding: 5px">导出</el-button>-->
                </div>
              </th>
            </tr>
            <tr v-for="item in itemp.receivables">
              <td> <div class="cell">{{formatDate(item.receivables_date)}}</div></td>
              <td> <div class="cell">{{item.work_name}}（{{item.work_number}}）</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_zqf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_bqyyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_tgf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_ycf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_jingle | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_xqf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_lyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_pyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_gz | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_gzpy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_khfy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_tax | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_bqjy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_authorize | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_other | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{item.receivables_total_cost | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{item.receivables_remarks}}</div></td>
            </tr>
            <tr>
              <td> <div class="cell">客户小计</div></td>
              <td> <div class="cell">
                <!--{{itemp.total.work_name}}（{{itemp.total.work_number}}）-->
              </div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_zqf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_bqyyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_tgf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_ycf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_jingle | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_xqf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_lyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_pyf | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_gz | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_gzpy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_khfy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_tax | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_bqjy | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_authorize | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_other | formatIsEmpty}}</div></td>
              <td> <div class="cell" style="text-align: right">{{itemp.total.receivables_total_cost | formatIsEmpty}}</div></td>
              <td> <div class="cell">{{itemp.total.receivables_remarks}}</div></td>

            </tr>
            </tbody>

          </table>


        </div>
      </div>

      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="count">
        </el-pagination>
      </div>


    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData:[],
        pageIndex:1,
        pageSize:40,
        count:0,
        allTotal:0
      }
    },
    filters:{
      formatIsEmpty(data){
        return data?data:0;
      },
    },
    created() {
      this.getData();
    },
    watch: {
      '$route' (to, from) {
      }
    },
    computed: {},
    methods: {
      formatDate(da) {
        return moment(da).format("YYYY-MM-DD");
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getData();
      },
      getData(){
        let _this=this;
        $_get('/Views/admin/business/receivablesQuery.aspx?pageIndex='+_this.pageIndex+'&pageSize='+_this.pageSize+"&nature=-1&backdrop=-1&number=&name=").then(function (response) {
          if (response.code == 1) {
            let da = response.data.list;
            _this.tableData=da;
            _this.allTotal=0;
            _this.count=response.data.count;
            for(let i in da){
             _this.tableData[i].receivables=JSON.parse(da[i].receivables);
             let total={
               work_number:0,
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
             }
             for(let j in _this.tableData[i].receivables){
               let reb=_this.tableData[i].receivables[j];
               total.work_name=reb.work_name;
               total.work_number=reb.work_number;
               total.receivables_zqf+=reb.receivables_zqf?parseInt(reb.receivables_zqf):0;
               total.receivables_bqyyf+=reb.receivables_bqyyf?parseInt(reb.receivables_bqyyf):0;
               total.receivables_tgf+=reb.receivables_tgf?parseInt(reb.receivables_tgf):0;
               total.receivables_ycf+=reb.receivables_ycf?parseInt(reb.receivables_ycf):0;
               total.receivables_jingle+=reb.receivables_jingle?parseInt(reb.receivables_jingle):0;
               total.receivables_xqf+=reb.receivables_xqf?parseInt(reb.receivables_xqf):0;
               total.receivables_lyf+=reb.receivables_lyf?parseInt(reb.receivables_lyf):0;
               total.receivables_pyf+=reb.receivables_pyf?parseInt(reb.receivables_pyf):0;
               total.receivables_gz+=reb.receivables_gz?parseInt(reb.receivables_gz):0;
               total.receivables_gzpy+=reb.receivables_gzpy?parseInt(reb.receivables_gzpy):0;
               total.receivables_khfy+=reb.receivables_khfy?parseInt(reb.receivables_khfy):0;
               total.receivables_tax+=reb.receivables_tax?parseInt(reb.receivables_tax):0;
               total.receivables_bqjy+=reb.receivables_bqjy?parseInt(reb.receivables_bqjy):0;
               total.receivables_authorize+=reb.receivables_authorize?parseInt(reb.receivables_authorize):0;
               total.receivables_other+=reb.receivables_other?parseInt(reb.receivables_other):0;
               total.receivables_total_cost+=reb.receivables_total_cost?parseInt(reb.receivables_total_cost):0;
             }
              _this.tableData[i].total=total;
              _this.allTotal+=_this.tableData[i].total.receivables_total_cost;
            }
            console.log(_this.tableData)
          } else {
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

