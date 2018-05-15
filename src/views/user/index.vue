<template>
  <div class="user-container">
    <el-input placeholder="请输入内容" v-model="content" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
    </el-input>
    <el-table
      :data="responseData.data"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="NICKNAME"
        label="微信昵称"
          align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="USER_NAME"
        label="姓名"
          align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="MOBILE"
        label="手机号"
          align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        :formatter="sexFormatter"
        prop="SEX"
        label="性别"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :formatter="formatterBirthday"
        prop="BIRTHDAY"
        label="出生年月"
        align="center"
        width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        :formatter="formatterTime"
        prop="SUBSCRIBE_TIME"
        label="关注时间"
        align="center"
        show-overflow-tooltip
        width="160">
      </el-table-column>
      <el-table-column
        prop="QRCODE"
        label="推荐编码"
        align="center"
        width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="加盟"
        align="center"
      >
        <el-table-column v-for="(el,index) in brandList"
                         :prop="'jiameng_'+el.id"
                         align="center"
                         :label="el.brandName">
        </el-table-column>

      </el-table-column>
      <el-table-column
        label="代理"
        align="center"
      >
        <el-table-column v-for="(el,index) in brandList"
                         :prop="'agent_'+el.id"
                         align="center"
                         :label="el.brandName">
        </el-table-column>
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
  import {getUserList} from "@/api/user";
  import {getBrandList} from "@/api/brand";
  export default{
    data(){
      return {
        pageParams:{
            pageIndex:1,
            pageSize:10
        },
        responseData: {},
        content: "",//搜索内容
        brandList: []
      }
    },
    created() {
      getBrandList().then(data => {
        this.brandList = data;
      });
    },
    mounted() {
      this.initData(this.pageParams.pageSize,this.pageParams.pageIndex-1);
    },
    methods: {
      initData: function (pageSize,pageIndex) {
        let params = {content:this.content,pageSize:pageSize,pageIndex:pageIndex};
        getUserList(params).then(data => {
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
      formatterBirthday: function (row, column, cellValue) {
          if(cellValue && cellValue!=''){
            return new Date(cellValue).Format("yyyy-MM-dd")
          }
      },
      formatterTime: function (row, column, cellValue) {
        if(cellValue && cellValue!=''){
          return new Date(cellValue).Format("yyyy-MM-dd hh:mm:ss");
        }
      },
      sexFormatter: function (row, column, cellValue) {
        return cellValue == 1 ? "男" : "女"
      },
    },
    components: {}
  }
</script>
<style scoped>
  .user-container {
    padding: 5px;
  }

  .input-search {
    width: 300px;
    margin-bottom: 10px;
  }
</style>
