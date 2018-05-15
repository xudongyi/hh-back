<template>
  <div class="angel-container">
    &nbsp;申请结果：
    <el-select v-model="applyRes" placeholder="请选择">
      <el-option
        v-for="item in applyOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    &nbsp;付款结果：
    <el-select v-model="payRes" placeholder="请选择">
      <el-option
        v-for="item in payOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    &nbsp;关键字：
    <el-input placeholder="请输入内容" v-model="content" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
    </el-input>
    <el-table :data="responseData.data" border style="width: 100%">
      <el-table-column type="index"  label="序号"></el-table-column>
      <el-table-column prop="applyTime" label="申请日期" :formatter="formatterTime"  show-overflow-tooltip  width="160"></el-table-column>
      <el-table-column prop="USER_NAME" label="姓名"></el-table-column>
      <el-table-column prop="MOBILE" label="手机号码"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="formName" label="推荐人" ></el-table-column>
      <el-table-column prop="AREA" label="加盟区域" ></el-table-column>
      <el-table-column prop="brand" label="加盟品牌" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="APPLY_FEE" label="加盟费用" ></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="yc"></el-table-column>
      <el-table-column prop="APPLY_STATUS" label="申请审核">
        <template scope="scope">
          <div v-if="scope.row.APPLY_STATUS== 1" style="color:#4189DC;cursor:pointer;" @click="getInfo(scope.row)">待审核</div>
          <div v-else>{{ applyStatus(scope.row.APPLY_STATUS) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="PAY_TYPE" label="付款方式" :formatter="payType" ></el-table-column>
      <el-table-column prop="PAY_STATUS" label="付款审核" :formatter="payStatus" >
        <template scope="scope">
          <div v-if="scope.row.PAY_STATUS== 2" style="color:#4189DC;cursor:pointer;" @click="getInfo1(scope.row)">待审核</div>
          <div v-else>{{ payStatus(scope.row.PAY_STATUS) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="REAL_FEE" label="实际到账" ></el-table-column>
      <el-table-column prop="REAL_FEE" label="推荐人返利" ></el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.pageIndex"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="responseData.total"
    >
    </el-pagination>

    <el-dialog title="加盟申请审核" :visible.sync="dialogFormVisible" >
      <el-form :model="form">
        <el-col :span="12">
          <el-form-item label="申请人" :label-width="formLabelWidth">
            <el-input disabled v-model="form.USER_NAME" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-input disabled v-model="form.MOBILE" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input disabled v-model="form.SEX==1?'男':'女'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" :label-width="formLabelWidth">
            <el-input disabled v-model="new Date(form.BIRTHDAY).Format('yyyy-MM-dd')" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加盟区域" :label-width="formLabelWidth">
            <el-input disabled v-model="form.AREA" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="加盟品牌" :label-width="formLabelWidth">
            <el-input disabled v-model="form.brand" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加盟费用" :label-width="formLabelWidth">
            <el-input disabled v-model="form.APPLY_FEE" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="推荐人" :label-width="formLabelWidth">
            <el-input disabled v-model="form.formName" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input disabled v-model="form.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmApply(form.applyId,3)">未通过</el-button>
        <el-button type="primary" @click="confirmApply(form.applyId,2)">通 过</el-button>
      </div>
    </el-dialog>

    <el-dialog title="付款审核" :visible.sync="dialogFormVisible1" width="400px">
      <el-form :model="form1">
        <el-form-item label="付款金额" :label-width="formLabelWidth1">
          <el-input disabled v-model="form1.APPLY_FEE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="付款凭证" :label-width="formLabelWidth1">
          <el-button type="primary" @click="getFile(form1.applyId)">查看凭证</el-button>
        </el-form-item>
        <el-form-item label="实际到账" :label-width="formLabelWidth1" :rules="[{ required: true, message: '请输入实际金额'}]">
          <el-input v-model="sjfee" auto-complete="off" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmPay(form1.applyId,4)">未通过</el-button>
        <el-button type="primary" @click="confirmPay(form1.applyId,3)">通 过</el-button>
      </div>
    </el-dialog>

    <el-dialog title="凭证信息" :visible.sync="dialogFormVisible2" width="500px">
      <img :src="imgFile" alt="" style="width: 300px;height: 300px">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible2=false">关 闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import {getAngelApplyList,saveApplyState,savePayState,getApplyFile} from "@/api/apply";
  import {getImg} from "@/api/system";
  export default{
    data(){
      return {
        pageParams:{
          pageIndex:0,
          pageSize:10
        },
        applyOpts: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '已通过'
        }, {
          value: '3',
          label: '未通过'
        }],
        payOpts: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '待支付'
        }, {
          value: '2',
          label: '待审核'
        },
          {
            value: '3',
            label: '已通过'
          },{
            value: '4',
            label: '未通过'
          }],
        applyRes: '',
        payRes: '',
        type:2,
        responseData: {},
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        currentRow: null,//多选
        form: {

        },
        form1: {
          fee: '',
        },
        formLabelWidth: '120px',
        formLabelWidth1: '80px',
        yc:false,
        sjfee:'',
        imgFile:'',

      }
    },
    created() {

    },
    mounted() {
      this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
    },
    methods: {
      initData: function (pageSize,pageIndex) {
        let params = {content:this.content,applyRes:this.applyRes,payRes:this.payRes,type:this.type,pageSize:pageSize,pageIndex:pageIndex};
        getAngelApplyList(params).then(data =>{
          this.responseData = data;
      })
      },

      handleCurrentChange:function(val){
        //处理分页
        this.initData(this.pageParams.pageSize,val-1);
      },
      handleSizeChange:function(val){
        this.initData(val,0);
      },
      formatterTime: function (row, column, cellValue) {
        return new Date(cellValue).Format("yyyy-MM-dd hh:mm:ss")
      },
      applyStatus: function (cellValue) {
        if(cellValue==1){
          return "待审核";
        }else if(cellValue==2){
          return "已通过";
        }else if(cellValue==3){
          return "未通过";
        }else{
          return "";
        }
      },
      payStatus: function (cellValue) {
        if(cellValue==1){
          return "待支付";
        }else if(cellValue==3){
          return "已通过";
        }else if(cellValue==4){
          return "未通过";
        }else{
          return "";
        }
      },
      payType: function (row, column, cellValue) {
        if(cellValue==1){
          return "微信支付";
        }else if(cellValue==2){
          return "上传凭证";
        }
      },
      getInfo(row) {
        this.dialogFormVisible = true;
        this.form = row;
      },
      getInfo1(row) {
        this.dialogFormVisible1 = true;
        this.form1 = row;
      },

      confirmApply(applyId,type){
        let params = {applyId:applyId,type:type}
        var info="";
        var info1="";
        if(type==2){
          info ="申请通过";
          info1="success";
        }else{
          info ="申请未通过";
          info1="info";
        }
        saveApplyState(params).then(data=>{
          if(data>0){
          this.dialogFormVisible = false;
          this.$message({
            message: info,
            type: info1
          });
          this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
        }
      });
      },

      confirmPay(applyId,type){
        let params = {applyId:applyId,type:type,fee:this.sjfee}
        var info="";
        var info1="";
        if(type==3){
          if(this.sjfee!=null&&this.sjfee!="") {
            info = "申请通过";
            info1 = "success";
            savePayState(params).then(data=>{
              if(data>0){
                this.dialogFormVisible1 = false;
                this.$message({
                  message: info,
                  type: info1
                });
                this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
              }
            });
          }else{
            info = "请输入实际到账金额";
            this.$message({
              message: info,
            });
          }
        }else{
          info ="申请未通过";
          info1="info";
          savePayState(params).then(data=>{
            if(data>0){
              this.dialogFormVisible1 = false;
              this.$message({
                message: info,
                type: info1
              });
              this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
            }
          });
        }

      },

      getFile(id){
        var that = this;
        let params = {applyId:id}
        this.dialogFormVisible2 = true;
        getApplyFile(params).then(data=>{
          if(data){
            getImg(data.FILE_PATH).then(data1=>{
              that.imgFile = "data:image/png;base64," +data1;
            })
          }
      });
      }

    },
    components: {

    }
  }
</script>
<style scoped>
  .angel-container {
    padding: 5px;
    font-size: 13px;
  }

  .input-search {
    width: 300px;
    margin-bottom: 10px;
  }
  .bg{
    width: 40%;
    height: 40px;
    border: 1px solid #cccccc;
    line-height: 40px;
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
  }

</style>
