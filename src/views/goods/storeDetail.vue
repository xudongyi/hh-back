<template>
  <div class="container">
    <el-row class="row1">
      &nbsp;选择时间：
      <el-date-picker class="time_pick" v-model="beginTime" @change="statusChange" type="date" placeholder="选择日期时间"
                      value-format="yyyy-MM-dd" size="mini"></el-date-picker>
      -
      <el-date-picker class="time_pick" v-model="endTime" @change="statusChange" type="date" placeholder="选择日期时间"
                      value-format="yyyy-MM-dd" size="mini"></el-date-picker>
      &nbsp;
      &nbsp;库存类型：
      <el-select v-model="status" class="type_pick" placeholder="请选择" @change="statusChange" size="mini">
        <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      &nbsp;关键字：
      <el-input placeholder="请输入内容" v-model="content" class="input-search" size="mini">
        <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
      </el-input>
    </el-row>

    <el-table border ref="singleTable" :data="storeList.data" style="width: 100%" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="GOODS_NO" label="商品编号" width="180"></el-table-column>
      <el-table-column prop="GOODS_NAME" label="商品名称" width="100"></el-table-column>
      <el-table-column :formatter="formatterTime" prop="CREATE_TIME" label="创建时间" width="180"></el-table-column>
      <el-table-column :formatter="formatterStatus" prop="FINAL_TYPE" label="变动类型"></el-table-column>
      <el-table-column prop="CHANGE_COUNT" label="变动量"></el-table-column>
      <el-table-column prop="STOCK_COUNT" label="变动后的库存"></el-table-column>

    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pageParams.pageIndex" :page-sizes="[10, 15, 20, 25]"
                   :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   background :total="storeList.total">
    </el-pagination>
  </div>
</template>

<script>
  import {storeDetail} from "@/api/store.js";
  export default{
    data () {
      return {
        pageParams: {
          pageIndex: 0,
          pageSize: 10
        },
        beginTime: new Date(new Date().getTime() - 2 * 86400000).Format("yyyy-MM-dd"),
        endTime: new Date().Format("yyyy-MM-dd"),
        statusData: [{id: '1', name: '入库-日常业务'}, {id: '2', name: '入库-盘盈'}, {id: '3', name: '出库-日常业务'}, {
          id: '4',
          name: '出库-盘盈'
        }, {id: '5', name: '销售'}],
        content: '',
        status: "全部",
        storeList: {},
        currentRow: null,
        goodsId: ""
      }
    },
    created() {
      this.goodsId = this.$route.query.id;
      this.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
    },
    mounted() {

    },
    methods: {
      initData: function (pageSize, pageIndex) {
        let params = {
          goodsId: this.goodsId,
          content: this.content,
          pageSize: pageSize,
          pageIndex: pageIndex,
          type: this.status,
          beginTime: this.beginTime,
          endTime: this.endTime
        };
        storeDetail(params).then(data => {
          this.storeList = data;
      });
      },
      handleCurrentChange: function (val) {
        //处理分页
        this.initData(this.pageParams.pageSize, val - 1);
      },
      handleSizeChange: function (val) {
        this.initData(val, 0);
      },
      formatterTime: function (row, column, cellValue) {
        if (cellValue) {
          return new Date(cellValue).Format("yyyy-MM-dd hh:mm:ss")
        } else {
          return "";
        }

      },
      formatterStatus: function (row, column, cellValue) {
        let htmlValue = "";
        if (cellValue == 1) {
          htmlValue = "入库-日常业务";
        } else if (cellValue == 2) {
          htmlValue = "入库-盘盈";
        } else if (cellValue == 3) {
          htmlValue = "出库-日常业务";
        } else if (cellValue == 4) {
          htmlValue = "出库-盘盈";
        }
        else if (cellValue == 5) {
          htmlValue = "出库-销售";
        }
        return htmlValue;
      },
      statusChange: function () {
        this.pageParams.pageSize = 10;
        this.pageParams.pageIndex = 0;
        this.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 5px;
  }

  a {
    color: blue;
  }

  .row1 {
    float: left;
    margin-bottom: 10px;
  }

  .time_pick {
    width: 140px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .type_pick {
    width: 100px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .input-search {
    width: 180px;
    margin-bottom: 10px;
    margin-left: 10px;
  }
</style>
