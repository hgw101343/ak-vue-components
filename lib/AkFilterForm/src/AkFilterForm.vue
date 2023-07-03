<!--
 * @Author: huanggengwu 'yunyaokj@gmail.com'
 * @Date: 2023-06-26 15:00:50
 * @LastEditors: huanggengwu 'yunyaokj@gmail.com'
 * @LastEditTime: 2023-07-03 10:20:58
 * @FilePath: \zujian\ak-vue-components\lib\AkFilterForm\src\AkFilterForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- <template>
  <div class="filter-containe">
    <slot />
    <el-link type="primary" @click="$emit('input', !value)" >
      {{ value ? '收起' : '展开' }}
      <i :class="value ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </el-link>
  </div>
</template> -->

<script>
  export default {
    name: 'AkFilterForm',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      form: {
        type: Object,
        default: () => {}
      },
      num: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      handleClick(){
        this.$emit('input', !this.value)
      }
    },
    render() {
      return (
        <div class="filter-containe">
          {this.$scopedSlots.default().map((i,index) => {
            if (i.data) {
              i.data.attrs.style= !this.value && index > this.num - 1 ?'display: none':''
              return i
            }
            return i
          })}
          {
            h('el-link', {
              on:{
                click: this.handleClick
              },
              attrs: {
                type: 'primary'
              }
            },[
              this.value? '收起': '展开',
              h('i', {
                class: this.value ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
              }),
            ])
          }
        </div>
      )
    }
  }
</script>
<style lang="scss" scoped></style>
