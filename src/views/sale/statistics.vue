<template>
  <div class="container">
    &nbsp;选择时间：
    <el-date-picker v-model="beginTime" @change="brandChange"  type="month"  placeholder="选择月" value-format="yyyy-MM" ></el-date-picker>
    -
    <el-date-picker v-model="endTime" @change="brandChange"    type="month"  placeholder="选择月" value-format="yyyy-MM" ></el-date-picker>&nbsp;
    &nbsp;订单状态：
    <el-select v-model="brand" placeholder="请选择" @change="brandChange">
      <el-option v-for="item in brands" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
    </el-select>
    <el-input placeholder="请输入内容" v-model="content" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="initTableData(pageParams.pageSize,0)"></el-button>
    </el-input>

    <el-table border ref="singleTable" :data="getOrderStatisticList.data" style="width: 100%" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="TIME" label="统计月份" width="100"></el-table-column>
      <el-table-column prop="GOODS_NO" label="商品编号" width="180"></el-table-column>
      <el-table-column prop="GOODS_NAME" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="BRAND_NAME" label="商品品牌" width="180"></el-table-column>
      <el-table-column prop="COUNTS" label="商品销量" width="155"></el-table-column>
      <el-table-column prop="COST" label="销售额(元)" width="160"></el-table-column>
      <el-table-column prop="PROFIT" label="毛利(元)" width="160"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pageParams.pageIndex"  :page-sizes="[10, 15, 20, 25]"
                   :page-size="pageParams.pageSize"  layout="total, sizes, prev, pager, next, jumper"
                   background :total="getOrderStatisticList.total">
    </el-pagination>
  </div>
</template>

<script>
  import {getBrandList} from "@/api/brand";
  import {getOrderStatisticList} from "@/api/order";
  export default{
    data () {
      return {
        pageParams:{
          pageIndex:0,
          pageSize:10
        },
        beginTime:new Date(new Date().setMonth(new Date().getMonth() - 1)).Format("yyyy-MM"),
        endTime:new Date().Format("yyyy-MM"),
        brands:[],
        brand:'-1',
        content:'',
        getOrderStatisticList:{},
      }
    },
    created() {
      this.initData();
      this.initTableData(this.pageParams.pageSize,this.pageParams.pageIndex);
    },
    mounted() {

    },
    methods: {
      initData: function () {
        let params = {};
        getBrandList(params).then(data => {
          this.brands = data;
        this.brands.unshift({id:"-1",brandName:"全部"});
      })
      },
      initTableData:function(pageSize,pageIndex){
        let params = {
          content:this.content,
          pageSize:pageSize,
          pageIndex:pageIndex,
          brand:this.brand,
          beginTime:this.beginTime,
          endTime:this.endTime
        };
        getOrderStatisticList(params).then(data => {
          this.getOrderStatisticList = data;
      })
      },
      handleCurrentChange:function(val){
        //处理分页
        this.initTableData(this.pageParams.pageSize,val-1);
      },
      handleSizeChange:function(val){
        this.initTableData(val,0);
      },
      brandChange:function(){
        this.pageParams.pageSize=10;
        this.pageParams.pageIndex=0;
        this.initTableData(this.pageParams.pageSize,this.pageParams.pageIndex);
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
    width: 300px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
</style>
