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
    name: 'FilterForm',
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
