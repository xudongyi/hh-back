<template>
  <div class="user-container">
    <el-row class="row1">
      <el-button type="success" @click="storeInAdd" size="mini">新增</el-button>
      <el-button type="warning" @click="storeInEdit" size="mini">编辑</el-button>
      <el-button type="danger" @click="storeInRemove" size="mini">删除</el-button>
    </el-row>

    <el-row class="row2">
      <el-button type="danger" icon="el-icon-plus" @click="storeInAct" size="mini">批量出库</el-button>
    </el-row>

    <el-table
      :data="StoreInData"
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
        prop="DETAIL_TYPE"
        :formatter="typeFormatter"
        label="出库类型">
      </el-table-column>
      <el-table-column
        prop="CHANGE_COUNT"
        label="出库数量">
      </el-table-column>
    </el-table>


    <el-dialog title="新增出库" :visible.sync="dialogFormVisible" @close="resetForm('form')" width="620px">
      <el-form :model="form" :inline="true" ref="form" label-width="110px" size="mini">
        <el-form-item label="ID" v-show="false">
          <el-input v-model="form.ID" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="本来库存" v-show="false">
          <el-input v-model="form.STOCK_COUNT" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品编号" required>
          <el-select v-model="form.GOODS_NO" filterable placeholder="请选择" @change="handleSelect">
            <el-option
              v-for="item in goodsList"
              :key="item.GOODS_NO"
              :label="item.GOODS_NO"
              :value="item.GOODS_NO">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="商品名称" required>
          <el-input v-model="form.GOODS_NAME" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" required>
          <el-input v-model="form.BRAND_NAME" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="商品规格" required>
          <el-input v-model="form.GOODS_SPEC" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>


        <el-form-item label="出库类型" prop="DETAIL_TYPE" :rules="[
      { required: true, message: '必须选择一项'}
    ]">
          <el-select v-model="form.DETAIL_TYPE" clearable>
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库数量" prop="CHANGE_COUNT" required>
          <el-input v-model.number="form.CHANGE_COUNT" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import {getBrandList} from "@/api/brand";
  import {getGoodsList} from "@/api/goods";
  import {startStoreOut} from "@/api/store.js";

  export default{
    data(){
      return {
        StoreInData: [],
        brandList: [],
        goodsList: [],
        dialogFormVisible: false,
        show: false,
        value: '',

        op_flag: '',

        typeList: [{
          value: '1',
          label: '日常业务'
        },
          {
            value: '2',
            label: '盘盈'
          }],

        form: {
          ID: '',
          GOODS_NO: '',
          BRAND_NAME: '',
          GOODS_NAME: '',
          GOODS_SPEC: '',
          DETAIL_TYPE: '',
          STOCK_COUNT: '',
          CHANGE_COUNT: ''
        },
        timeout: null,
        currentRow: null
      };
    },
    created() {
      getBrandList().then(data => {
        this.brandList = data;
    });

      getGoodsList().then(data => {
        this.goodsList = data;
    });

    },
    mounted() {

    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      storeInAdd(){
        this.op_flag = 'add';
        this.dialogFormVisible = true;
      },
      storeInEdit(){
        let that = this;

        if (this.currentRow != 1) {
          this.op_flag = 'edit';
          that.form = this.currentRow;
          this.dialogFormVisible = true;

        } else {
          this.$message({
            message: '请先选择一条数据',
            type: 'warning'
          });
        }

      },
      storeInRemove(){
        let that = this;
        if (this.currentRow != 1) {
          this.$confirm('是否删除改条记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var remove_temp = this.currentRow;
          this.StoreInData.pop(remove_temp);
        }).
          catch(() => {}
        )
          ;
        } else {
          this.$message({
            message: '请先选择一条数据',
            type: 'warning'
          });
        }
      },
      storeInAct(){
        let data = [];
        var that = this;
        //批量出库
        this.StoreInData.forEach(function (item) {
          if (item) {
            var temp = {
              goodsId: item["ID"],
              type: 2,
              detailType: item["DETAIL_TYPE"],
              changeCount: item["CHANGE_COUNT"],
              stockCount: item["STOCK_COUNT"]
            };
            data.push(temp)
          }
        });

        let param = {
          data: JSON.stringify(data)
        };

        startStoreOut(param).then(data => {
          if(data == '1'
      )
        {
          that.$message({
            message: '出库成功！',
            type: 'success'
          });

          that.StoreInData = [];
        }
      else
        {
          this.$message.error('批量出库失败！');
        }

      })


      },

      createStateFilter(queryString) {
        return (state) =>
        {
          return (state.GOODS_NO.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      handleSelect(item) {
//        this.form = item;
        this.form["STOCK_COUNT"] = this.goodsList.filter(this.createStateFilter(item))[0]["STOCK_COUNT"];
        this.form["ID"] = this.goodsList.filter(this.createStateFilter(item))[0]["ID"];
        this.form["BRAND_NAME"] = this.goodsList.filter(this.createStateFilter(item))[0]["BRAND_NAME"];
        this.form["GOODS_NAME"] = this.goodsList.filter(this.createStateFilter(item))[0]["GOODS_NAME"];
        this.form["GOODS_SPEC"] = this.goodsList.filter(this.createStateFilter(item))[0]["GOODS_SPEC"];

      },
      submitForm(formName){
        let that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = JSON.parse(JSON.stringify(this.form));
            this.form = {};

            if (this.op_flag == "add") {
              this.StoreInData.push(temp);
            }
            else {
              if (this.StoreInData.filter(this.createStateFilter(temp["GOODS_NO"])).length === 0) {
                this.StoreInData.push(temp);
              }
              else {
                this.StoreInData.pop(this.goodsList.filter(this.createStateFilter(temp["GOODS_NO"]))[0]);
                this.StoreInData.push(temp);
              }

            }
//            }
            this.dialogFormVisible = false;
          }
        }
      )
        ;

      },
      resetForm(formName) {
//        this.$refs[formName].resetFields();
      },
      typeFormatter: function (row, column, cellValue) {
        return cellValue == 1 ? "日常业务" : "盘盈"
      }

    },
    components: {}
  }
</script>
<style scoped>
  .user-container {
    padding: 5px;
  }

  .row1 {
    float: left;
    margin-bottom: 10px;
  }

  .row2 {
    float: right;
    margin-bottom: 10px;
  }

  .no {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .name {
    font-size: 12px;
    color: #b4b4b4;
  }

</style>
