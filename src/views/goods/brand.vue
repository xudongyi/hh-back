<template>
  <div class="user-container">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" @click="editRow">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deleteRow">删除</el-button>
    </el-row>

    <!--<el-input placeholder="请输入内容" v-model="content" class="input-search">-->
    <!--<el-button slot="append" icon="el-icon-search" @click="initData(pageParams.pageSize,0)"></el-button>-->
    <!--</el-input>-->
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
        prop="BRAND_NAME"
        label="品牌名称">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="BRAND_LOGO"-->
        <!--label="品牌LOGO">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="FRANCHISE_FEE"
        label="加盟费">
      </el-table-column>
      <el-table-column
        prop="AGENT_FEE"
        label="代理费">
      </el-table-column>
      <el-table-column
        prop="AGENT_RATE"
        label="代理返利佣金率(%)">
      </el-table-column>
      <el-table-column
        prop="FRANCHISE_RATE"
        label="加盟返利佣金率(%)">
      </el-table-column>
      <el-table-column
        prop="BRAND_DESC"
        label="品牌描述">
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

    <el-dialog title="新增品牌"  :visible.sync="dialogFormVisible" @close="resetForm('form')">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" >
        <el-form-item label="ID" v-show="false">
          <el-input v-model="form.ID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" prop="BRAND_NAME">
          <el-input v-model="form.BRAND_NAME" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO">
          <img v-if="form.BRAND_LOGO!=''" :src="form.BRAND_LOGO" alt="" style="width: 100px;height: 100px">
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
        <el-form-item label="加盟费" prop="FRANCHISE_FEE">
          <el-input v-model.number="form.FRANCHISE_FEE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="代理费" prop="AGENT_FEE">
          <el-input v-model.number="form.AGENT_FEE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="代理返利佣金率" prop="AGENT_RATE">
          <el-input v-model.number="form.AGENT_RATE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加盟返利佣金率" prop="FRANCHISE_RATE">
          <el-input v-model.number="form.FRANCHISE_RATE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌描述" >
          <el-input type="textarea" v-model="form.BRAND_DESC"></el-input>
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
  import {getBrandListByPage,saveBrand,deleteBrand} from "@/api/brand";
  import {getImg} from "@/api/system";

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
          BRAND_NAME: '',
          BRAND_LOGO:'',
          FRANCHISE_FEE: '',
          AGENT_FEE: '',
          AGENT_RATE: '',
          FRANCHISE_RATE:'',
          BRAND_DESC:''
        },

        rules: {
          FRANCHISE_FEE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          AGENT_FEE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          AGENT_RATE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          FRANCHISE_RATE: [
            { required: true, message: '必填', trigger: 'blur' },
            { type: 'number', message: '必须为数字',trigger: 'blur' }
          ],
          BRAND_NAME: [
            { required: true, message: '必填', trigger: 'blur' }
          ]

        },
        show:false,
        actionUrl:process.env.BASE_API+"/brand/savePicBrand.do",
        fileList: [],
        currentRow:null, //选中的行数
        op_flag :"new"   //操作类型（新增，编辑）

      };
    },
    created() {
    },
    mounted() {
      this.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
    },
    methods: {
      initData: function (pageSize,pageIndex) {
        let params = {pageSize:pageSize,pageIndex:pageIndex};
        getBrandListByPage(params).then(data => {
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
                  brandName: that.form.BRAND_NAME,
                  franchiseFee: that.form.FRANCHISE_FEE,
                  agentRate: that.form.AGENT_RATE,
                  franchiseRate: that.form.FRANCHISE_RATE,
                  agentFee: that.form.AGENT_FEE,
                  brandDesc: that.form.BRAND_DESC
                };
              }
              else {
                params = {
                  id: that.form.ID,
                  brandName: that.form.BRAND_NAME,
                  franchiseFee: that.form.FRANCHISE_FEE,
                  agentRate: that.form.AGENT_RATE,
                  franchiseRate: that.form.FRANCHISE_RATE,
                  agentFee: that.form.AGENT_FEE,
                  brandDesc: that.form.BRAND_DESC
                };
              }
              saveBrand(params).then(data => {
                if(data == '1')
              {
                //添加成功
                that.dialogFormVisible = false;

                if (that.op_flag == 'new') {
                  that.$message({
                    message: '品牌添加成功！',
                    type: 'success'
                  });
                }
                else {
                  that.$message({
                    message: '品牌修改成功！',
                    type: 'success'
                  });
                }
                that.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
              }
            else
              {
                that.$message.error('品牌添加失败！');
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
        this.$refs[formName].resetFields();
      },

      handleCurrentChange(val) {
        this.currentRow = val;
      },

      editRow(){
        let that = this;
        if(this.currentRow !=1){
          that.form = this.currentRow;
          if(this.currentRow.BRAND_LOGO && this.currentRow.BRAND_LOGO!=''){
            getImg(this.currentRow.BRAND_LOGO).then(data1=>{
              that.form.BRAND_LOGO = "data:image/png;base64," +data1;
          })
          }
          this.dialogFormVisible =true;
          this.op_flag ="edit";
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
          this.$confirm('是否删除该品牌?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            let params = {
              id :that.currentRow.ID,
              brandName:that.currentRow.BRAND_NAME,
              franchiseFee:that.currentRow.FRANCHISE_FEE,
              agentRate:that.currentRow.AGENT_RATE,
              agentFee:that.currentRow.AGENT_FEE,
              brandDesc:that.currentRow.BRAND_DESC
            };

          deleteBrand(params).then(data => {
            if(data == '1'){
              that.$message({
                message: '品牌删除成功！',
                type: 'success'
              });
            that.initData(this.pageParams.pageSize,this.pageParams.pageIndex);
          }
        else{
            that.$message.error('品牌删除失败！');
          }
        })
        }).catch(() => {
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

      saveSuccess(response, file, fileList){
        if(response){
          this.$message({
            message: '保存成功',
            type: 'success'
          });

        }else{
          this.$alert('保存失败', {
            confirmButtonText: '确定'
          });
        }

        this.$refs.upload.clearFiles();
        this.dialogFormVisible = false;
        this.initData(this.pageParams.pageSize, this.pageParams.pageIndex);
      }

    },
    components: {}
  }
</script>
<style scoped>
  .user-container {
    padding: 5px;
  }
  .el-row{
    float: right;
    margin-bottom: 10px;
  }
</style>
