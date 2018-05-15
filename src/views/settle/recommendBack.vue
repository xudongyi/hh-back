<template>
    <div class="container">
      选择时间：
      <el-date-picker class="search-date" value-format="yyyy-MM-dd HH:mm:ss" v-model="searchParams.beginTime" type="date" placeholder="选择日期"></el-date-picker>
      -
      <el-date-picker class="search-date" value-format="yyyy-MM-dd HH:mm:ss" v-model="searchParams.endTime" type="date" placeholder="选择日期"></el-date-picker>&nbsp;
      申请状态：
      <el-select v-model="searchParams.state" class="apply-status" clearable>
        <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      推荐人：
      <el-input placeholder="请输入内容" v-model="searchParams.content" class="input-search">
        <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
      </el-input>

      <el-table :data="responseData.data" border style="width: 100%">
        <el-table-column type="index"  label="序号"></el-table-column>
        <el-table-column prop="formName" label="推荐人姓名"></el-table-column>
        <el-table-column prop="name" label="被推荐人姓名"></el-table-column>
        <el-table-column prop="applyTime" label="申请时间" :formatter="formatterTime"  show-overflow-tooltip  width="160"></el-table-column>
        <el-table-column prop="applyType" label="申请类型" :formatter="applyType"></el-table-column>
        <el-table-column prop="APPLY_FEE" label="付款金额" ></el-table-column>
        <el-table-column prop="STATUS" label="申请状态" >
          <template scope="scope">
            <div v-if="scope.row.PAY_TYPE== 2||scope.row.PAY_TYPE== 1">{{ payStatus(scope.row.PAY_STATUS) }}</div>
            <div v-else>{{ applyStatus(scope.row.APPLY_STATUS) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="付款日期"  width="120">
          <template scope="scope">
            <div v-if="scope.row.PAY_TYPE== 1||scope.row.PAY_TYPE== 2">{{ formatterDate(scope.row.payTime) }}</div>
            <div v-else></div>
          </template>
        </el-table-column>
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
  import {getRecommendRebateList} from "@/api/rebate";
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
              status: [{id: '0', name: '全部'},{id: '1', name: '申请待审核'}, {id: '2', name: '申请已通过'}, {id: '3', name: '申请未通过'},{id: '4', name: '付款待支付'},{id: '5', name: '付款待审核'},{id: '6', name: '付款已通过'},{id: '7', name: '付款未通过'}],
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
        getRecommendRebateList(this.searchParams).then(data => {
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
      formatterDate: function (cellValue) {
        if(cellValue!=null) {
          return new Date(cellValue).Format("yyyy-MM-dd")
        }else{
          return "";
        }
      },
      applyType: function (row, column,cellValue) {
        if(cellValue==1){
          return "代理";
        }else if(cellValue==2){
          return "加盟";
        }
      },
      payStatus: function (cellValue) {
        if(cellValue==1){
          return "付款待支付";
        }else if(cellValue==2){
          return "付款待审核";
        }else if(cellValue==3){
          return "付款已通过";
        }else if(cellValue==4){
          return "付款未通过";
        }else{
          return "";
        }
      },
      applyStatus: function (cellValue) {
        if(cellValue==1){
          return "申请待审核";
        }else if(cellValue==2){
          return "申请已通过";
        }else if(cellValue==3){
          return "申请未通过";
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
  .apply-status{
    width: 150px;
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
