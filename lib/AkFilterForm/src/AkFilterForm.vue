<!--
 * @Author: huanggengwu 'yunyaokj@gmail.com'
 * @Date: 2023-06-26 15:00:50
 * @LastEditors: huanggengwu 'yunyaokj@gmail.com'
 * @LastEditTime: 2023-06-26 15:16:56
 * @FilePath: \zujian\ak-vue-components\lib\AkFilterForm\src\AkFilterForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="filter-containe">
    <slot />
    <el-link type="primary" @click="change">
      {{ isMany ? '收起' : '展开' }}
      <i :class="isMany ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </el-link>
  </div>
</template>

<script>
  export default {
    name: 'AkFilterForm',
    props: {
      // 是否展示更多
      isMany: {
        type: Boolean,
        default: false,
      },
      // 简易搜索下还存在的字段名
      liveValues: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {}
    },
    mounted() {
      console.log('执行几次表单')
    },
    methods: {
      change() {
        this.$emit('change')
      },
    },
  }
</script>
<style lang="scss" scoped></style>
