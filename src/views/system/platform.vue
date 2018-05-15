<template>
  <div class="app-container">
    <el-form style="width:60%" ref="form" :model="form" label-width="120px">
      <el-form-item label="账户名">
        <el-input v-model="form.cardName"></el-input>
      </el-form-item>
      <el-form-item label="银行小图标">
        <img v-if="form.cardIcon!=''" :src="dataImg" alt="" style="width: 100px;height: 100px">
      </el-form-item>
      <el-form-item>
        <el-upload
          :action="actionUrl"
          ref="upload"
          :data="form"
          class="upload-demo"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="saveSuccess"
          list-type="picture"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-progress="handleProgress"
          :on-change="handleOnchange"
          :limit=1
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.cardNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import {saveInfoNoFile,getInfo,getImg} from "@/api/system";
  export default{
    data(){
      return {
        form: {
          id:'',
          cardName: '',
          cardNo: '',
        },
        dataImg:'',
        actionUrl:process.env.BASE_API+"/system/saveInfo.do",
        fileList: [],
        isUpload:false
      }
    },
    created() {
      this.initInfo();
    },
    mounted() {

    },
    methods: {
      initInfo(){
        //后台查询记录,有数据编辑,否则新增
        getInfo().then(data=>{
          if(data){
            this.form.id = data.id;
            this.form.cardName = data.cardName;
            this.form.cardNo = data.cardNo;
            if(data.cardIcon && data.cardIcon!=''){
              getImg(data.cardIcon).then(data1=>{
                this.dataImg = "data:image/png;base64," +data1;
            })
            }
          }
        })
      },
      onSubmit() {
          if(this.fileList.length>0){
            this.$refs.upload.submit();
          }else{
            saveInfoNoFile(this.form).then(data=>{
              if(data){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.initInfo();
              }else{
                this.$alert('保存失败', {
                  confirmButtonText: '确定'
                });
              }
            })
          }

      },
      handleOnchange(file, fileList){
          console.log("-------------")
          this.fileList = [];
          this.fileList.push(file);
      },
      handleBeforeUpload(file){
        console.log("handleBeforeUpload")
      },
      handleRemove(file, fileList) {
        console.log("handleRemove")
      },
      handleProgress(file,fileList){
        console.log("handleProgress")
      },
      handlePreview(file) {
        console.log("handlePreview")
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      saveSuccess(response, file, fileList){
          if(response){
            this.isUpload = true;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.$refs.upload.clearFiles();
            this.initInfo();
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
  .app-container{
    padding:5px;
  }
  .upload-demo{
    display: inline-block;
  }
</style>
