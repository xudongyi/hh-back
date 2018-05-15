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
      <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" @click="editRow">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deleteRow">删除</el-button>
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
        prop="SALE_PRICE"
        label="售价">
      </el-table-column>
      <el-table-column
        prop="COST_PRICE"
        label="成本价">
      </el-table-column>
      <el-table-column
        prop="IS_SHELF"
        :formatter="shelfFormatter"
        label="是否上架">
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

    <el-dialog title="新增商品"  :visible.sync="dialogFormVisible" @close="resetForm('form')">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" >
        <el-form-item label="ID" v-show="false">
          <el-input v-model="form.ID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="GOODS_NO">
          <el-input v-model="form.GOODS_NO" auto-complete="off" :disabled="dis_flag"></el-input>
        </el-form-item>

        <el-form-item label="商品名称" prop="GOODS_NAME">
          <el-input v-model="form.GOODS_NAME" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品品牌" prop="BRAND_ID">
          <el-select v-model="form.BRAND_ID"  clearable>
            <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品图片">
          <img v-if="form.GOODS_IMG!=''" :src="form.GOODS_IMG" alt="" style="width: 100px;height: 100px">
          <el-upload
            :action="actionUrl"
            ref="upload"
            :data="form"
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-change="handleProgress"
            :on-success="saveSuccess"
            :limit=1
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">*只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品规格" prop="GOODS_SPEC">
          <el-input v-model.number="form.GOODS_SPEC" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="售价" prop="SALE_PRICE">
          <el-input v-model.number="form.SALE_PRICE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="COST_PRICE">
          <el-input v-model.number="form.COST_PRICE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="IS_SHELF">
          <el-radio-group v-model="form.IS_SHELF">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="submitForm('form')">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {getGoodsListByPage,saveGoods,deleteGoods} from "@/api/goods.js";
  import {getImg} from "@/api/system";
  import {getBrandList} from "@/api/brand";

  export default{
    data(){
      return {
        pageParams:{
          pageIndex:0,
          pageSize:10
        },
        responseData: {},
        dialogFormVisible: false,
        form: {
          ID:'',
          GOODS_NO: '',
          GOODS_IMG:'',
          BRAND_ID: '',
          GOODS_SPEC: '',
          SALE_PRICE: '',
          COST_PRICE:'',
          IS_SHELF:''
        },

        rules: {
          GOODS_NO: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          SALE_PRICE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          COST_PRICE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          GOODS_NAME: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          BRAND_ID: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          IS_SHELF: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          GOODS_SPEC: [
            { required: true, message: '必填', trigger: 'blur' }
          ]

        },
        show:false,
        actionUrl:process.env.BASE_API+"/goods/savePicGoods.do",
        fileList: [],
        brandList: [],
        brand:'',//搜索内容
        content: "",//搜索内容
        currentRow:null, //选中的行数
        dis_flag:false,
        op_flag :"new"   //操作类型（新增，编辑）

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
        getGoodsListByPage(params).then(data => {
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

      submitForm(formName) {
        let that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.fileList.length==0 ) {
              let params = "";
              if (that.op_flag == 'new') {
                //提交表单
                params = {
                  goodsNo: that.form.GOODS_NO,
                  goodsName: that.form.GOODS_NAME,
                  brandId: that.form.BRAND_ID,
                  goodsSpec: that.form.GOODS_SPEC,
                  salePrice: that.form.SALE_PRICE,
                  costPrice: that.form.COST_PRICE,
                  isShelf: that.form.IS_SHELF

                };
              }
              else {

                params = {
                  id: that.form.ID,
                  goodsNo: that.form.GOODS_NO,
                  goodsName: that.form.GOODS_NAME,
                  brandId: that.form.BRAND_ID,
                  goodsSpec: that.form.GOODS_SPEC,
                  salePrice: that.form.SALE_PRICE,
                  costPrice: that.form.COST_PRICE,
                  isShelf: that.form.IS_SHELF
                };
              }
              saveGoods(params).then(data => {
                if(data == '1')
              {
                //添加成功
                that.dialogFormVisible = false;

                if (that.op_flag == 'new') {
                  that.$message({
                    message: '商品添加成功！',
                    type: 'success'
                  });
                }
                else {
                  that.$message({
                    message: '商品修改成功！',
                    type: 'success'
                  });
                }

                that.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
              }
            else
              {
                that.$message.error('商品添加失败！');
              }

            })
            }else{
              that.$refs.upload.submit();
            }

          } else {
            console.log('error submit!!');
        return false;
      }
      });
      },

      resetForm(formName) {
        this.form = {};
        this.$refs[formName].clearValidate();
        this.dis_flag =false;
      },

      handleCurrentChange(val) {
        this.currentRow = val;
      },

      editRow(){
        let that = this;

        if(this.currentRow !=1){
          that.form = this.currentRow;
          if(this.currentRow.GOODS_IMG && this.currentRow.GOODS_IMG!=''){
            getImg(this.currentRow.GOODS_IMG).then(data1=>{
              that.form.GOODS_IMG = "data:image/png;base64," +data1;
          })
          }
          this.dialogFormVisible =true;
          this.op_flag ="edit";
          this.dis_flag =true;
        }else{
          this.$message({
            message: '请先选择一条数据',
            type: 'warning'
          });
        }
      },
      deleteRow(){
        let that = this;
        if(this.currentRow !=1){
          this.$confirm('是否删除该商品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            let params = {
              id: that.currentRow.ID,
              goodsNo: that.currentRow.GOODS_NO,
              goodsName: that.currentRow.GOODS_NAME,
              brandId: that.currentRow.BRAND_ID,
              goods_spec: that.currentRow.GOODS_SPEC,
              sale_price: that.currentRow.SALE_PRICE,
              costPrice: that.currentRow.COST_PRICE,
              is_shelf: that.currentRow.IS_SHELF
            };

          deleteGoods(params).then(data => {
            if(data == '1'){

            that.$message({
              message: '商品删除成功！',
              type: 'success'
            });
            that.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
          }
        else{
            that.$message.error('商品删除失败！');
          }
        })
        }).catch(() => {
//            this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
          });
        }else{
          this.$message({
            message: '请先选择一条数据',
            type: 'warning'
          });
        }
      },

      handleRemove(file, fileList) {
        this.fileList = [];
      },
      handleProgress(file,fileList){
        this.fileList.push(file)
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      shelfFormatter: function (row, column, cellValue) {
        return cellValue == 0 ? "上架" : "下架"
      },

      saveSuccess(response, file, fileList){
        if(response){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$refs.upload.clearFiles();
          this.dialogFormVisible = false;
          this.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
        }else{
          this.$alert('保存失败', {
            confirmButtonText: '确定'
          });
        }
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
    width: 180px;
    margin-bottom: 10px;
  }
  .brand-search {
    width: 150px;
    margin-bottom: 10px;
  }

</style>
