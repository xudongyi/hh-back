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
    <el-input placeholder="请输入内容" v-model="searchParams.content" class="input-search">
        <el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>
    </el-input>
    <el-button type="warning" @click="handleSelectionChange(1)">批量结算</el-button>
    <el-button type="primary" @click="handleSelectionChange(2)">结算</el-button>
    <el-table
      ref="multipleTable"
      :data="responseData.data"
      @selection-change="changeFun"
      border
      style="width: 100%">
      <el-table-column
        type="selection"
        width="50"
          align="center"

        :selectable='checkboxInit'
      >
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
          align="center"

        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="STATIC_TIME"
        label="统计月份"
          align="center"

        :formatter="formatterDate"
      >
      </el-table-column>
      <el-table-column
        prop="USER_NAME"
        label="用户姓名"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="RECOMMEND_FEE"
        label="推荐返利"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="AGENT_FEE"
        label="代理返利"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="TOTAL_FEE"
        label="应结总额"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="REAL_FEE"
        label="实际结算"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="STATE"
        label="结算状态"
        align="center"
        :formatter="formatterState"
      >
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

    <el-dialog title="结算" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="结算月份" :label-width="formLabelWidth">
          <el-input disabled v-model="form.STATIC_TIME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.USER_NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="应结总额" :label-width="formLabelWidth">
          <el-input disabled v-model="form.TOTAL_FEE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际结算" :label-width="formLabelWidth">
          <el-input v-model="form.REAL_FEE" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSettle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getSettleList,updateSettleLog,
    batchUpdateSettleLog} from "@/api/settle";
  export default{
    data(){
      return {
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
        status: [{id: '0', name: '全部'}, {id: '1', name: '待结算'}, {id: '2', name: '已结算'}],
        responseData: {},
        multipleSelection: [],//多选
        formLabelWidth:'120px',
        dialogFormVisible: false,
        form: {
          STATIC_TIME:'',
          USER_NAME:'',
          TOTAL_FEE:'',
          REAL_FEE:''
        },

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
        getSettleList(this.searchParams).then(data => {
          this.responseData = data;
        })
      },
      checkboxInit(row,index){
        if (row.STATE==2)
          return 0;//不可勾选
        else
          return 1;//可勾选
      },
      handleCurrentChange:function(val){
        this.initData(this.pageParams.pageSize,val-1);
      },
      handleSizeChange:function(val){
        this.initData(val,0);
      },
      formatterDate: function (row, column, cellValue) {
        return new Date(cellValue).Format("yyyy-MM-dd")
      },
      formatterState(row, column, cellValue){
        return cellValue==1?"待结算":"已结算";
      },
      changeFun(val) {
        this.multipleSelection = val;
      },
      handleSelectionChange(type) {
          if(this.multipleSelection.length==0){
            this.$alert('请选择需要操作的记录', {
              confirmButtonText: '确定'
            });
            return;
          }
          if(type==1){
            this.$confirm('确认进行批量结算吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //批量结算
              let id = '';
              for(var i = 0;i<this.multipleSelection.length;i++){
                id+="\'"+this.multipleSelection[i].ID+"\',"
              }
              id = id.substring(0,id.length-1);
              batchUpdateSettleLog(id).then(data=>{
                if(data){
                  this.dialogFormVisible = false;
                  this.$message({
                    message: '批量结算成功',
                    type: 'success'
                  });
                  this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
                }else{
                  this.$alert('结算失败', {
                    confirmButtonText: '确定'
                  });
                }
              })

            }).catch(() => {

            });
          }else if(type==2){
              //结算
              this.dialogFormVisible = true;
              this.form = this.multipleSelection[0];
          }
      },
      //结算处理
      confirmSettle(){
        if(this.form.REAL_FEE==0){
          this.$alert('请填写实际结算金额', {
            confirmButtonText: '确定'
          });
          return;
        }
        updateSettleLog(this.form).then(data=>{
            if(data){
              this.dialogFormVisible = false;
              this.$message({
                message: '结算成功',
                type: 'success'
              });
              this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
            }else{
              this.$alert('结算失败', {
                confirmButtonText: '确定'
              });
            }
        })

      }
    },
    components: {}
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
