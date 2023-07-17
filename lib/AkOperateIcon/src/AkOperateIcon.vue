<template>
  <div class="table-operation_box">
    <div v-if="type === 'icon'">
      <el-tooltip v-for="val in data1" :key="val.label" :content="val.label">
        <i
          :class="
            (val.iconClass ? val.iconClass : getIcon(val)) + ' table-operation'
          "
          :style="'color:' + val.color"
          @click.stop="clickIcon(val.type)"
        />
      </el-tooltip>
      <el-dropdown v-if="data2.length" @command="clickItem">
        <i class="el-icon-more table-operation" @click.stop />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="val in data2"
            :key="val.label"
            :command="val.type"
          >
            {{ val.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-else class="text">
      <el-link v-for="(val, index) in data" 
        :key="'text'+ index" @click.stop="clickIcon(val.type)" class="text_item"
        :style="'color:' + val.color"
        :underline="false"
        >{{val.label}}</el-link>
    </div>
  </div>
</template>

<script>
  // 常用的操作图标
  const iconList = [
    {
      label: '编辑',
      value: 'el-icon-edit',
    },
    {
      label: '查看',
      value: 'el-icon-view',
    },
    {
      label: '删除',
      value: 'el-icon-delete',
    },
  ]
  export default {
    name: 'AkOperateIcon',
    props: {
      dataList: {
        type: Array[
          {
            lable: String, // 鼠标上移弹出文字
            permission: String, // 权限
            type: String, // 什么类型的点击事件通过click返回出去做业务判断
            iconClass: String, //自定义图标class名字，没有就去当前页面常用的图标
            color: String, // 图标颜色 默认跟着主题走
          }
        ],
        default: () => [],
      },
      dataLength: {
        type: Number,
        default: 3,
      },
      type: {
        type: String,
        default: 'icon', // icon text
      }
    },
    data() {
      // 过滤掉没有权限的按钮
      const { dataList, dataLength } = this
      const permissions = localStorage.getItem('PERMISSIONS') || []
      const data = dataList.filter(
        (i) => permissions.indexOf(i.permission) !== -1 || !i.permission
      )
      return {
        data,
        data1:
          data.length > dataLength
            ? JSON.parse(JSON.stringify(data)).splice(0, dataLength - 1)
            : data,
        data2: data.length > dataLength ? JSON.parse(JSON.stringify(data)).splice(dataLength - 1) : [],
      }
    },
    computed: {},
    mounted() {},
    methods: {
      getIcon(val) {
        const currentIcon = iconList.find((i) => i.label === val.label)
        if (currentIcon) {
          return currentIcon.value
        }
        return 'el-icon-setting'
      },
      clickIcon(type) {
        this.$emit('click', type)
      },
      clickItem(e) {
        this.$emit('click', e)
      },
    },
  }
</script>
<style lang="scss" scoped>
.table-operation_box{
  .table-operation{
    font-size: 16px;
    margin-right: 10px;
    color: #1890ff;
  }
  .text{
    .text_item{
      margin: 5px 5px 0 0;
      color: #1890ff;
      font-size: 14px;
    }
  }
}
</style>
