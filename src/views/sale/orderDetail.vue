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
    <table id="myTable" style="margin: 10px">
      <tr>
        <td style="width: 100px;" class="mytd title"> 下单时间 </td>
        <td> {{orderObj.ORDER_TIME}} </td>
      </tr>
      <tr>
        <td style="width: 100px;" class="mytd title"> 订单状态 </td>
        <td> {{orderObj.STATUS}} </td>
      </tr>
      <tr>
        <td style="width: 100px;" class="mytd title" > 订单金额 </td>
        <td> <span style="color: red">¥{{orderObj.TOTAL_FEE}}</span> </td>
      </tr>
      <tr>
        <td style="width: 100px;" class="mytd title" > 商品清单 </td>
        <td>
          <el-table border :data="orderGoods" style="width: 100%">
            <el-table-column  prop="GOODS_NO" label="商品编号" width="200" ></el-table-column>
            <el-table-column prop="GOODS_NAME" label="商品名称" width="200"></el-table-column>
            <el-table-column prop="GOODS_SPEC" label="商品规格" width="200"></el-table-column>
            <el-table-column prop="SALE_PRICE" label="商品单价" width="200"></el-table-column>
            <el-table-column  prop="COUNTS" label="采购数量" width="200"></el-table-column>
          </el-table>

        </td>
      </tr>
      <tr>
        <td style="width: 100px;" class="mytd title" > 收货地址 </td>
        <td>
          <div class="mydiv">{{orderObj.USER_NAME}}&nbsp;&nbsp;{{orderObj.MOBILE}}</div>
          <div class="mydiv" STYLE="margin-top: -1px">{{orderObj.ADDRESS}}</div>
        </td>
      </tr>
      <tr>
        <td style="width: 100px;" class="mytd title" > 物流信息 </td>
        <td>
          <div v-if="status>=3">
            <div class="mydiv"><span class="title">物流公司：</span>&nbsp;{{orderObj.EXPRESS_TYPE}}</div>
            <div class="mydiv" STYLE="margin-top: -1px"><span class="title">物流单号：</span>&nbsp;{{orderObj.EXPRESS_NO}}</div>
          </div>
          <div v-if="status==2">
            <el-button type="warning" @click="dialogVisible = true">发货</el-button>
          </div>
          <div v-if="status<2">
            <el-button type="warning">暂无</el-button>
          </div>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
  import {getOrderList} from "@/api/order";
  import {getOrderGoodsList} from "@/api/order";
  import {updateOrderGoods} from "@/api/order";
  export default{
    data () {
      return {
        orderId:'',
        orderObj:{},
        orderGoods:[],
        status:1,
        dialogVisible: false,
        form: {
          ID:'',
          ORDER_NO: '',
          USER_NAME: '',
          MOBILE: '',
          EXPRESS_TYPE: '',
          EXPRESS_NO: ''
        }
      }
    },
    created() {
      this.orderId = this.$route.query.id;

      this.initData(10,0);
    },
    mounted() {

    },
    methods: {
      initData: function (pageSize,pageIndex) {
        var that = this;
        let params = {id:this.orderId,pageSize:pageSize,pageIndex:pageIndex};
        getOrderList(params).then(data => {
          that.orderObj = data.data[0];
        that.status = data.data[0].STATUS;
        that.form.ID = data.data[0].ID;
        that.form.ORDER_NO = data.data[0].ORDER_NO;
        that.form.USER_NAME = that.orderObj.USER_NAME;
        that.form.MOBILE = that.orderObj.MOBILE;
        that.orderObj.ORDER_TIME = that.formatterTime(that.orderObj.ORDER_TIME);
        that.orderObj.STATUS = that.formatterStatus(that.orderObj.STATUS);
      });
        let params1 = {ordersId:this.orderId};
        getOrderGoodsList(params1).then(data => {
          that.orderGoods = data;
      });
      },
      formatterTime: function(data){
        return new Date(data).Format("yyyy-MM-dd hh:mm:ss")
      },
      formatterStatus : function (cellValue) {
        let htmlValue= "";
        if(cellValue==1){
          htmlValue="待付款";
        }else if(cellValue==2){
          htmlValue="待发货";
        }else if(cellValue==3){
          htmlValue="待收货";
        }else if(cellValue==4){
          htmlValue="已完成";
        }
        return htmlValue;
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
            this.dialogVisible = false;
            that.initData(10,0);
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
          }else{
            this.$message('保存失败！');
          }
        });
        }

      }
    }
  }
</script>

<style scoped>
  .container{
    padding: 5px;
  }
  .mytd{
    height: 35px;
  }
  .mydiv{
    border: 1px solid #ebeef5;
    height: 44px;
    line-height: 44px;
    padding-left: 10px;
  }
  .title{
    color: #909399;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  }
</style>
