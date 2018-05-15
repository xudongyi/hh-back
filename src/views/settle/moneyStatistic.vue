<template>
    <div>
      <el-row class="row1">
        &nbsp;选择月份：
        <el-date-picker class="searchclass"  v-model="month" value-format="yyyy-MM" type="month" placeholder="选择月份"
                         size="mini"></el-date-picker>
        &nbsp;地区级别：
        <el-select v-model="area" class="searchclass" placeholder="请选择"  size="mini">
          <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        &nbsp;品牌：
        <el-select v-model="brand" class="searchclass" clearable size="mini">
          <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
        </el-select>
        &nbsp;&nbsp;
        <el-button type="primary" icon="el-icon-search" size="mini" @click="query">搜索</el-button>
      </el-row>

        <el-table border show-summary :span-method="arraySpanMethod" :data="responseData" style="width: 100%" highlight-current-row>
          <el-table-column prop="AREA" label="地区" width="100"></el-table-column>
          <el-table-column prop="BRAND_NAME" label="品牌" width="100"></el-table-column>
          <el-table-column label="收入" align="center">
            <el-table-column prop="sale_count" label="销售毛利(￥)"></el-table-column>
            <el-table-column prop="jm_count" label="加盟费(￥)"></el-table-column>
            <el-table-column prop="dl_count" label="代理费(￥)"></el-table-column>
          </el-table-column>
          <el-table-column label="支出" align="center">
            <el-table-column prop="dl_fee" label="代理返利(￥)"></el-table-column>
            <el-table-column prop="tj_fee" label="推荐返利(￥)"></el-table-column>
          </el-table-column>
          <el-table-column prop="total_count" label="小结" width="100" align="center"></el-table-column>

        </el-table>
    </div>

</template>
<script>
  import {getBrandList} from "@/api/brand";
  import {getMonthSettle} from "@/api/settle";

  export default{
        data(){
            return{
              brandList: [],
              statusData: [{id: '1', name: '省级'}, {id: '2', name: '市级'}, {id: '3', name: '县级'}],
              responseData: [],
              month:'',
              area:'1',
              brand:'',

              contactArray:[],
              contactDot:0
            }
        },
        created() {
          getBrandList().then(data => {
            this.brandList = data;
        });

          this.initData();
        },
        mounted() {
		},
		methods: {

      initData: function () {
        let params = {month:this.month,brand:this.brand,area:this.area};
        getMonthSettle(params).then(data => {
          this.responseData = data;
      })
      },

      query(){
        this.initData()

      },

      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        //columnIndex-当前列号；column-当前列


//          var item = this.responseData[rowIndex];
//          if(rowIndex === 0){
//
//            console.log(rowIndex);
//
//          }
//              this.contactArray.push(1);
//              this.contactDot=0;
//
//            console.log(rowIndex);
//
            if (columnIndex === 0) {

              const _row = this.responseData[rowIndex]["colspan"];
              const _col = _row > 0 ? 1 : 0;

//              console.log(_row);
              return {
                rowspan: _row,
                colspan: _col
              }
            }
//
//            }
//          }
//          else{
//            if(item["AREA"] === this.responseData[rowIndex-1]["AREA"]){
//              this.contactArray.push[this.contactDot] +=1;
//              this.contactArray.push(0);
//            }
//            else{
//              this.contactArray.push(1);
//              this.contactDot=rowIndex;
//            }
//
//
//            if (columnIndex === 0) {
//
//              const _row = this.contactArray[rowIndex];
//              const _col = _row>0?1:0;
//
////              console.log(_row);
//
////            return{
////              rowspan:_row,
////              colspan:_col
////            }
//
//            }
//          }


      },

		},
        components:{

        }
    }
</script>
<style scoped>
  .row1 {
    float: left;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .searchclass {
    width: 150px;
    margin-bottom: 10px;
  }

</style>
