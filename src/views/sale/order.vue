<template>
  <div class="container">
    <el-dialog title="发货" :visible.sync="dialogVisible"
               width="40%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="form.ORDER_NO" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="买家姓名">
          <el-input v-model="form.USER_NAME" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.MOBILE" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-input v-model="form.EXPRESS_TYPE"></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="form.EXPRESS_NO"></el-input>
        </el-form-item>
      </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="save">确 定</el-button>
            </span>
    </el-dialog>
    &nbsp;选择时间：
    <el-date-picker v-model="beginTime" @change="statusChange"  type="date"  placeholder="选择日期时间" value-format="yyyy-MM-dd" ></el-date-picker>
    -
    <el-date-picker v-model="endTime" @change="statusChange"    type="date"  placeholder="选择日期时间" value-format="yyyy-MM-dd" ></el-date-picker>&nbsp;
    &nbsp;订单状态：
    <el-select v-model="status" placeholder="请选择" @change="statusChange">
      <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-input placeholder="请输入内容" v-model="content" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
    </el-input>
    &nbsp;
    <el-button type="warning" @click="sendOrder">发货</el-button>

    <el-table border ref="singleTable" :data="orderList.data" style="width: 100%" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="ORDER_NO" label="订单编号" width="160">
        <template slot-scope="scope">
          <a @click="orderDetail( scope.row.ID )"> {{ scope.row.ORDER_NO }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatterTime" prop="ORDER_TIME" label="下单时间" width="170"></el-table-column>
      <el-table-column prop="USER_NAME" label="买家姓名" width="90"></el-table-column>
      <el-table-column prop="MOBILE" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="TOTAL_FEE" label="订单金额" width="100"></el-table-column>
      <el-table-column :formatter="formatterStatus" prop="STATUS" label="订单状态" width="90"></el-table-column>
      <el-table-column :formatter="formatterTime" prop="DELIVERY_TIME" label="发货时间" width="170"></el-table-column>
      <el-table-column prop="EXPRESS_TYPE" label="物流公司" width="100"></el-table-column>
      <el-table-column prop="EXPRESS_NO" label="物流单号" width="110"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange1"
      :current-page="pageParams.pageIndex"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="orderList.total"
    >
    </el-pagination>
  </div>
</template>

<script>
  import {getOrderList} from "@/api/order";
  import {updateOrderGoods} from "@/api/order";
  export default{
    data () {
      return {
        pageParams:{
          pageIndex:0,
          pageSize:10
        },
        beginTime:new Date(new Date().getTime() - 2*86400000).Format("yyyy-MM-dd"),
        endTime:new Date().Format("yyyy-MM-dd"),
        statusData:[{id:'0',name:'全部'},{id:'1',name:'待付款'},{id:'2',name:'待发货'},{id:'3',name:'待收货'},{id:'4',name:'已完成'},{id:'5',name:'已取消'}],
        content:'',
        status:"全部",
        orderList:{},
        currentRow:null,
        form: {
          ID:'',
          ORDER_NO: '',
          USER_NAME: '',
          MOBILE: '',
          EXPRESS_TYPE: '',
          EXPRESS_NO: ''
        },
        dialogVisible: false,
      }
    },
    created() {

    },
    mounted() {
      this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
    },
    methods: {
      initData: function (pageSize,pageIndex) {

        let params = {content:this.content,pageSize:pageSize,pageIndex:pageIndex,status:this.status,beginTime:this.beginTime,endTime:this.endTime};
        if(this.status=="全部"){
          params.status=0;
        }
        getOrderList(params).then(data => {
          this.orderList = data;
        });
      },
      handleCurrentChange1:function(val){
        //处理分页
        this.initData(this.pageParams.pageSize,val-1);
      },
      handleSizeChange:function(val){
        this.initData(val,0);
      },
      formatterTime: function (row, column, cellValue) {
        if(cellValue){
          return new Date(cellValue).Format("yyyy-MM-dd hh:mm:ss")
        }else{
          return "";
        }

      },
      formatterStatus : function (row, column, cellValue) {
        let htmlValue= "";
        if(cellValue==1){
          htmlValue="待付款";
        }else if(cellValue==2){
          htmlValue="待发货";
        }else if(cellValue==3){
          htmlValue="待收货";
        }else if(cellValue==4){
          htmlValue="已完成";
        }else if(cellValue==5){
          htmlValue="已取消";
        }
        return htmlValue;
      },
      statusChange:function(){
        this.pageParams.pageSize=10;
        this.pageParams.pageIndex=0;
        this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
      },
      orderDetail:function (orderId) {
        this.$router.push({path:"/sale/orderDetail",query:{id:orderId}});
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
          done();
      }).catch(_ => {});
      },
      save:function(){
        var that = this;
        if(this.form.EXPRESS_TYPE==""||this.form.EXPRESS_NO==""){
          this.$message('您还有字段没填写！');
          return;
        }else{
          updateOrderGoods(this.form).then(data => {
            console.log(data)
          if(data){
            that.dialogVisible = false;
            that.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
          }else{
            this.$message('保存失败！');
          }
        });
        }
      },
      sendOrder:function(){
        if(this.currentRow!=null){
          if(this.currentRow.STATUS!=2){
            if(this.currentRow.STATUS==1){
              this.$message('此订单还未付款！');
            }
            if(this.currentRow.STATUS==3||this.currentRow.STATUS==4){
              this.$message('此订单已经发货！');
            }
            return;
          }else{
            this.dialogVisible = true;
            this.form.ID = this.currentRow.ID;
            this.form.ORDER_NO = this.currentRow.ORDER_NO;
            this.form.USER_NAME = this.currentRow.USER_NAME;
            this.form.MOBILE = this.currentRow.MOBILE;
          }
        }else{
          this.$message('请选择一个未发货订单！');
        }

      }
    }
  }
</script>

<style scoped>
  .container{
    padding: 5px;
  }
  a{
    color: blue;
  }
  .input-search {
    width: 200px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
</style>
