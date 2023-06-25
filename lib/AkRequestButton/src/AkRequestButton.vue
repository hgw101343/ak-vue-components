<script>
import isArray from 'lodash/isArray';
import { Button } from 'element-ui';
import lodashGet from "lodash/get";
// 新增阿康请求按钮列表
export default {
  name: 'AkRequestButton',
  components: {},
  model: {
    prop: 'propData', // 要存在于props
    event: 'btn-data-change' // 当组件的值发生改变时要emit的事件名
  },
  props: {

    // 默认按钮带的值（预留属性）
    propData: {
      type: Object,
      default: () => ({})
    },
    // 直接设置到el-button中的属性，参考el-button方法
    buttonProps: {
      type: Object,
      default: () => ({})
    },

    // 同el-button的disabled
    disabled: {
      type: Boolean,
      default: false
    },
    // 同el-button的size

    // 按钮的交互类型 confirmToRequest 为先询问确定再发起请求 ，request为直接发起请求
    operatorType: {
      type: String,
      default: 'confirmToRequest' // "request"
    },
    // 询问提示框类型，参考 element comfirm
    confirmType: {
      type: String,
      default: 'warning'
    },
    // 询问提示框文字
    confirmText: {
      type: String,
      default: '确认吗？'
    },
    // 询问提示框标题
    confirmTitle: {
      type: String,
      default: '提示'
    },
    /**
     * 配置请求实例
     */
    requestApi: {
      type: [Boolean, Function],
      default: false
    },

    /**
     * 配置请求带的数据
     */
    requestData: {
      type: [Object, Array, String],
      default: () => ({})
    },
    /**
     * 配置请求的数据过滤方法
     */
    requestDataFilter: {
      type: [Function],
      default: (res) => res
    },
    /**
     * 配置是否根据请求数据判断是否发起请求
     */
    isDisabledFromRequestDataFilter: {
      type: [Function],
      default: (res) => false
    },
    /**
     * 配置全部返回的数据过滤方法
     */
    responseAllDataFilter: {
      type: Function,
      default: (res) => res
    },
    /**
     * 配置返回的数据过滤方法
     */
    responseDataFilter: {
      type: Function,
      default: (res) => res
    },
    /**
     * 返回的数据地址
     */
    responseDataPath: {
      type: String,
      default: "data.data"
    }
  },
  data() {
    return {
      loading: false,
      btnData: this.propData
    };
  },
  computed: {},
  watch: {
    propData(newVal) {
      if (newVal != this.mutipleSelections) {
        this.btnData = newVal;
      }
    },
    btnData(newVal) {
      this.$emit('btn-data-change', newVal);
    }
  },

  created() {},
  mounted() {},
  destroyed() {},

  methods: {
    fetch(params = {}) {
      if (!this.requestApi) return console.log('请配置正确的requestApi');
      if (this.operatorType == 'request') {
        this.fetchDataFunc(params);
      } else if (this.operatorType == 'confirmToRequest') {
        this.$confirm(this.confirmText, this.confirmTitle, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: this.confirmType
        })
          .then(() => {
            this.fetchDataFunc(params);
          })
          .catch(() => {});
      }
    },
    fetchDataFunc(params = {}) {
      this.loading = true;
      const isRequestDataArray = isArray(this.requestData);
      let requestPrevData = {
        ...params,
        ...this.requestData
      };
      if (isRequestDataArray) {
        requestPrevData = [...this.requestData];
      }
      const requestData = this.requestDataFilter(requestPrevData);

      this.$emit('before-loading', requestData);
      const isDisabledRequest =
        this.isDisabledFromRequestDataFilter(requestData);

      if (isDisabledRequest) {
        return console.log('通过请求参数禁用发起请求了');
      }
      this.requestApi(requestData)
        .then((r) => {
          let successMsg = this.$t('tips.updateSuccess');

          try {
            successMsg = r.data.message || this.$t('tips.updateSuccess');
          } catch (e) {
            console.log(e);
          }
          this.$message({
            message: successMsg,
            type: 'success'
          });

          r = this.responseAllDataFilter(r);
          this.btnData = this.responseDataFilter(lodashGet(r, this.responseDataPath));
          this.loading = false;
          this.$emit('loading-success', r, this.btnData);
        })
        .catch((e) => {
          this.btnData = {};
          this.loading = false;
          this.$emit('loading-error', e, this.btnData);
        });
    },
    onButtonClick(e) {
      this.$emit('click', e);
      this.fetch();
    },
    setFirstStrToUpperCase(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    }
  },
  render() {
    if (this.$scopedSlots.btnRender) {
      return this.$scopedSlots.btnRender({
        btnData: this.btnData,
        fetch: this.fetch,
        loading: this.loading,
        disabled: this.disabled
      });
    }

    const filterButtonProps = {};

    // 筛选出table支持的属性
    Object.keys(this.$attrs).map((key) => {
      const setPropKey = key.split('-').map((splitKey, splitIdx) => {
        return splitIdx > 0 && splitKey[0] ? this.setFirstStrToUpperCase(splitKey) : splitKey;
      }).join('');

      if (Button.props[setPropKey]) {
        filterButtonProps[setPropKey] = this.$attrs[key];
      }
    });
    return (
      <el-button
        class='ak-request-button'
        {...{
          attrs: {
            disabled: this.disabled,
            type: this.type,
            size: this.size,
            ...filterButtonProps,
            ...this.buttonProps,
            loading: this.loading
          },
          on: {
            click: this.onButtonClick
          }
        }}
      >
        {this.$slots.default}
      </el-button>
    );
  }
};
</script>
