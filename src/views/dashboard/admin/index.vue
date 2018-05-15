<template>
  <div class="dashboard-editor-container">
    管理员首页
  </div>
</template>

<script>


export default {
  data() {
    return {

    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
}
</style>
