<template>
  <div class="user-container">
    <el-row class="row1">
      品牌：
      <el-select v-model="brand" class="brand-search" clearable>
        <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
      </el-select>
      关键字：
      <el-input placeholder="请输入内容" v-model="content" class="input-search" >
        <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
      </el-input>
    </el-row>

    <el-row class="row2">
      <el-button type="danger" icon="el-icon-plus" @click="storeIn">入库</el-button>
      <el-button type="success" icon="el-icon-minus" @click="storeOut">出库</el-button>
    </el-row>

    <el-table
      :data="responseData.data"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column v-if='show'
                       prop="ID"
                       label="ID">
      </el-table-column>
      <el-table-column
        prop="GOODS_NO"
        label="商品编号">
      </el-table-column>
      <el-table-column
        prop="GOODS_NAME"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="BRAND_NAME"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="GOODS_SPEC"
        label="商品规格">
      </el-table-column>
      <el-table-column
        prop="STOCK_COUNT"
        label="商品库存">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showDetail(scope.$index, scope.row)">查看
          </el-button>
        </template>
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
  import {getStoreListByPage} from "@/api/store.js";
  import {getBrandList} from "@/api/brand";
  import {TagsView} from "@/views/layout/components";
//  import jiamengApply from "@/views/user/jiamengApply";

  export default{
    data(){
      return {
        pageParams:{
          pageIndex:0,
          pageSize:10
        },
        responseData: {},
        StoreInData:{},
        show:false,
        brandList: [],
        brand:'',//搜索内容
        content: "",//搜索内容
        currentRow:null //选中的行数

      };
    },
    created() {
      getBrandList().then(data => {
        this.brandList = data;
    });

    },
    mounted() {
      this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
    },
    methods: {
      initData: function (pageSize,pageIndex) {
        let params = {content:this.content,brand:this.brand,pageSize:pageSize,pageIndex:pageIndex};
        getStoreListByPage(params).then(data => {
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

      handleCurrentChange(val) {
        this.currentRow = val;
      },

      handleStoreInCurrentChange(val){
        this.StoreInRow = val;
      },

      storeIn(){
        //入库
        this.$router.push({path: "/goods/storeIn"});

      },
      storeOut(){
        //出库
        this.$router.push({path: "/goods/storeOut"});
      },

      showDetail(index, row){
        this.$router.push({path: "/goods/storeDetail", query: {id: row.ID}});
      },
      resetTable(name){

      }

    },
    components: {}
  }
</script>
<style scoped>
  .user-container {
    padding: 5px;
  }
  .row1{
    float: left;
    margin-bottom: 10px;
  }
  .row2{
    float: right;
    margin-bottom: 10px;
  }
  .input-search {
    width: 280px;
    margin-bottom: 10px;
  }
  .brand-search {
    width: 120px;
    margin-bottom: 10px;
  }

</style>
