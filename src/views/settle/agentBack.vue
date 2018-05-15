<template>
    <div class="container">
      选择时间：
      <el-date-picker class="search-date" value-format="yyyy-MM-dd HH:mm:ss" v-model="searchParams.beginTime" type="date" placeholder="选择日期"></el-date-picker>
      -
      <el-date-picker class="search-date" value-format="yyyy-MM-dd HH:mm:ss" v-model="searchParams.endTime" type="date" placeholder="选择日期"></el-date-picker>&nbsp;
      订单状态：
      <el-select v-model="searchParams.state" class="order-status" clearable>
        <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      代理商：
      <el-input placeholder="请输入内容" v-model="searchParams.content" class="input-search">
        <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
      </el-input>

      <el-table :data="responseData.data" border style="width: 100%">
        <el-table-column type="index"  label="序号"></el-table-column>
        <el-table-column prop="formName" label="代理商姓名"></el-table-column>
        <el-table-column prop="name" label="加盟商姓名"></el-table-column>
        <el-table-column prop="ORDER_TIME" label="下单时间" :formatter="formatterTime"  show-overflow-tooltip  width="160"></el-table-column>
        <el-table-column prop="TOTAL_FEE" label="采购金额" ></el-table-column>
        <el-table-column prop="ORDER_NO" label="订单编号"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="STATUS" label="订单状态" :formatter="orderType" ></el-table-column>
        <el-table-column prop="DELIVERY_TIME" label="付款日期" :formatter="formatterDate"  show-overflow-tooltip  width="120"></el-table-column>
        <el-table-column prop="BACK_FEE" label="返利金额">
        </el-table-column>
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
    </div>
</template>
<script>
  import {getAgentRebateList} from "@/api/rebate";
    export default{
        data(){
            return{
              //分页参数
              pageParams:{
                pageIndex:1,
                pageSize:10,
              },
              //搜索参数
              searchParams:{
                beginTime: '',
                endTime: '',
                content: '',
                state:''
              },
              status: [{id: '0', name: '全部'},{id: '1', name: '待付款'}, {id: '2', name: '待发货'}, {id: '3', name: '待收货'},{id: '4', name: '已完成'},{id: '5', name: '已取消'}],
              responseData: {},
            }
        },
        created() {

        },
        mounted() {
          this.initData(this.pageParams.pageSize, this.pageParams.pageIndex-1);
      },
      methods: {
        initData: function (pageSize,pageIndex) {
            this.searchParams.pageSize = pageSize;
            this.searchParams.pageIndex = pageIndex;
          getAgentRebateList(this.searchParams).then(data => {
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
        formatterDate: function (row, column, cellValue) {
          if(cellValue!=null) {
            return new Date(cellValue).Format("yyyy-MM-dd")
          }else{
            return "";
          }
        },
        orderType: function (row, column, cellValue) {
          if(cellValue==1){
            return "待付款";
          }else if(cellValue==2){
            return "待发货";
          }else if(cellValue==3){
            return "待收货";
          }else if(cellValue==4){
            return "已完成";
          }else if(cellValue==5){
            return "已取消";
          }else{
            return "";
          }
        },

      },
          components:{

          }
      }
</script>
<style scoped>
  .container {
    padding: 5px;
    font-size: 13px;
  }
  .order-status{
    width: 100px;
  }
  .search-date{
    width: 190px;
  }
  .input-search {
    width: 300px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
</style>
