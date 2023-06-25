<script>
import { Dialog, Drawer, Button, Message } from 'element-ui';
import cloneDeep from 'lodash/cloneDeep';
import lodashGet from "lodash/get";
import isArray from "lodash/isArray";
// 新增阿康基础请求弹框
export default {
  name: 'AkRequestDataDialog',
  components: {},
  model: {
    prop: 'requestDataDialogValue', // 要存在于props
    event: 'request-data-dialog-value-change' // 当组件的值发生改变时要emit的事件名
  },
  props: {
    dialogType: {
      type: String,
      default: 'drawer' // drawer  弹框或侧边栏类型
    },
    /**
     * 弹框的时候是否深拷贝数据
     */
    openToCloneDeepData: {
      type: Boolean,
      default: true
    },
    /**
     * 弹框的props设置
     */
    dialogProps: {
      type: [Object],
      default: () => ({
        width: '1000px',

        title: '设置'
      })
    },
    /**
     * 弹框的props设置
     */
    drawerProps: {
      type: [Object],
      default: () => ({
        size: '1000px',

        title: '设置'
      })
    },
    /**
     * 当提交成功后关闭弹框
     */
    closeDialogOnSubmitSuccess: {
      type: [Boolean],
      default: true
    },
    /**
     * 提交按钮的props设置
     */
    submitFormProps: {
      type: [Object],
      default: () => ({
        type: 'primary'
      })
    },
    /**
     * 取消按钮的props设置
     */
    cancelSubmitFormProps: {
      type: [Object],
      default: () => ({})
    },
    // 保留字段
    requestDataDialogValue: {
      type: [Object],
      default: () => ({})
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
      dialogVisible: false,
      disabledSubmit: false,
      openTitle: "",
      openTag: "",
      openRequestApi: null,
      reponseData: {}
    };
  },
  computed: {},
  watch: {},

  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    warningTips(type) {
      let tipText = '';
      switch (type) {
        case 'childrenFormUnFind':
          tipText = '请设置好弹窗子组件';
          break;
        case 'initFormDataUnSet':
          tipText = `弹窗子组件的initFormData方法用于重置表单,参数(formData,tag)formData为表单值,tag为标记，用于区分新增或标记等等，如果不需要则重置表单则可以不声明`;

          break;
        case 'submitFormUnSet':
          tipText = `请声明好弹窗子组件的submitForm方法用于提交表单,调用this.$emit('submit-form',formData)用于通知弹窗组件提交表单数据\n
          this.$emit('set-disabled-submit',true) 可以设置禁用或启用提交按钮
          `;
          break;
        case 'getFormDataUnSet':
          tipText = `请声明好弹窗子组件的getFormData方法用于收集表单值,没有找到表单值会直接找到$refs.form的model`;
          break;
      }
      if (tipText) {
        console.warn(tipText);
      }
    },
    initHandle() {
      this.handle = this.findFormFromChildren();
      if (this.handle) {
        this.handle.$off('submit-form', this.onHandleSubmitForm);
        this.handle.$on('submit-form', this.onHandleSubmitForm);
        this.handle.$off(
          'set-disabled-submit',
          this.onHandleSetDisabledSubmitForm
        );
        this.handle.$on(
          'set-disabled-submit',
          this.onHandleSetDisabledSubmitForm
        );
      } else {
        this.warningTips('childrenFormUnFind');
      }
    },
    findFormFromChildren() {
      let findFormItem = null;
      const boxItem = this.$children.length > 0 ? this.$children[0] : null;
      boxItem &&
        boxItem.$children.map((childrenItem) => {
          if (!childrenItem.$attrs['data-button-type'] && !findFormItem) {
            // 查找正确子组件
            findFormItem = childrenItem;
          }
        });
      return findFormItem;
    },
    onHandleSetDisabledSubmitForm(disabled) {
      this.disabledSubmit = disabled;
    },
    onHandleSubmitForm(params) {
      const submitData = cloneDeep(params);
      this.submitFetch(submitData);
    },
    cloneData(data) {
      return this.openToCloneDeepData ? cloneDeep(data) : data;
    },
    submitFetch(params = {}) {
      const setRquestApi = this.openRequestApi || this.requestApi;
      const isRequestDataArray = isArray(params);
      let requestPrevData = {
        ...params,
        ...this.requestData
      };
      if (isRequestDataArray) {
        requestPrevData = [...params];
      }
      const requestData = this.requestDataFilter(requestPrevData);

      this.$emit('submit-data', requestData);
      if (!setRquestApi) return;

      this.loading = true;

      this.$emit('before-submit', requestData);

      setRquestApi(requestData)
        .then((r) => {
          r = this.responseAllDataFilter(r);
          this.reponseData = this.responseDataFilter(lodashGet(r, this.responseDataPath));
          this.loading = false;
          if (this.closeDialogOnSubmitSuccess) {
            this.close();
          }
          Message({
            type: 'success',
            message: r.data.message
          });
          this.$emit('submit-success', r, this.reponseData);
        })
        .catch((e) => {
          this.reponseData = {};

          this.loading = false;
          Message({
            type: 'error',
            message: e.message || e || '提交错误'
          });
          this.$emit('submit-error', e, this.reponseData);
        });
    },
    open(data = {}, tag = '', openTitle = "", openRequestApi = null) {
      this.openTitle = openTitle;
      this.openTag = tag;
      this.openRequestApi = openRequestApi;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.initHandle();

        if (!this.handle) {
          this.warningTips('childrenFormUnFind');
          return;
        }

        if (typeof this.handle.initFormData != 'function') {
          this.warningTips('initFormDataUnSet');
          return;
        }
        this.handle.initFormData(this.cloneData(data), tag);
      });
    },
    close() {
      this.openTitle = "";
      this.openTag = "";
      this.openRequestApi = null;
      this.dialogVisible = false;
      if (this.handle && this.handle.$refs.form) {
        this.handle.$refs.form.clearValidate();
      }
    },
    submitForm() {
      if (!this.handle) {
        this.warningTips('childrenFormUnFind');
        return;
      }
      if (typeof this.handle.submitForm != 'function') {
        this.warningTips('submitFormUnSet');

        return;
      }
      this.handle.submitForm();
    },
    getSubmitFormData() {
      if (!this.handle) {
        this.warningTips('childrenFormUnFind');
      }
      if (typeof this.handle.getFormData != 'function') {
        this.warningTips('getFormDataUnSet');
        if (this.handle.$refs.form && this.handle.$refs.form.model) {
          return cloneDeep(
            this.handle.getFormData(this.handle.$refs.form.model)
          );
        }
        return;
      }
      return cloneDeep(this.handle.getFormData());
    },
    cancelSubmitForm() {
      this.close();
    },
    setFirstStrToUpperCase(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    }
  },
  render() {
    const filterDialogProps = {};
    const ShowComponent = this.dialogType == 'dialog' ? Dialog : Drawer;
    // 筛选出table支持的属性
    Object.keys(this.$attrs).map((key) => {
      const setPropKey = key
        .split('-')
        .map((splitKey, splitIdx) => {
          return splitIdx > 0 && splitKey[0]
            ? this.setFirstStrToUpperCase(splitKey)
            : splitKey;
        })
        .join('');

      if (ShowComponent.props[setPropKey]) {
        filterDialogProps[setPropKey] = this.$attrs[key];
      }
    });
    const btnScopedSlots = []; // 收集按钮作用与插槽
    Object.keys(this.$scopedSlots).map((scopedSlotKey) => {
      if (scopedSlotKey.indexOf('slotBtn') == 0) {
        btnScopedSlots.push(this.$scopedSlots[scopedSlotKey]);
      }
    });
    const setOpenTitleObject = this.openTitle ? {
      title: this.openTitle
    } : {}; // 是否设置openTitle
    return (
      <ShowComponent
        {...{
          attrs: {
            customClass:
              this.dialogType == 'dialog' ? 'data-dialog' : 'data-drawer',
            title: this.dialogProps.title,
            appendToBody: true,
            ...(this.dialogType == 'dialog'
              ? this.dialogProps
              : this.drawerProps),
            ...filterDialogProps,
            ...setOpenTitleObject,
            visible: this.dialogVisible
          },
          on: {
            close: this.close
          }
        }}
      >
        <div class='content-body'>
          {this.$slots && this.$slots.default ? this.$slots.default : null}
        </div>
        <div
          class={{
            'dialog-footer': this.dialogType == 'dialog',

            'drawer-footer': this.dialogType == 'drawer'
          }}
          slot={this.dialogType == 'dialog' ? 'footer' : undefined}
        >
          {this.$scopedSlots.submitBtn ? (
            this.$scopedSlots.submitBtn({
              submitForm: this.submitForm,
              loading: this.loading,
              cancelSubmitForm: this.cancelSubmitForm,
              getSubmitFormData: this.getSubmitFormData,
              disabledSubmit: this.disabledSubmit
            })
          ) : (
            <Button
              loading={this.loading}
              onClick={this.submitForm}
              disabled={this.disabledSubmit}
              {...{
                attrs: {
                  'data-button-type': 'data-dialog-type',
                  ...(this.submitFormProps || {})
                }
              }}
            >
              确 定
            </Button>
          )}
          {this.$scopedSlots.cancelSubmitFormBtn ? (
            this.$scopedSlots.cancelSubmitFormBtn({
              submitForm: this.submitForm,
              loading: this.loading,
              cancelSubmitForm: this.cancelSubmitForm,
              getSubmitFormData: this.getSubmitFormData,
              disabledSubmit: this.disabledSubmit
            })
          ) : (
            <Button
              {...{
                attrs: {
                  'data-button-type': 'data-dialog-type',
                  ...(this.cancelSubmitFormProps || {})
                }
              }}
              loading={this.loading}
              onClick={this.cancelSubmitForm}
            >
              取 消
            </Button>
          )}
          {btnScopedSlots.map((btnScopedSlot) => {
            return btnScopedSlot({
              loading: this.loading,
              submitForm: this.submitForm,
              cancelSubmitForm: this.cancelSubmitForm,
              getSubmitFormData: this.getSubmitFormData,
              disabledSubmit: this.disabledSubmit
            });
          })}
        </div>
      </ShowComponent>
    );
  }
};
</script>

<style lang="scss" scoped>
.drawer-footer {
  position: absolute;
  bottom: 0;

  height: 60px;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  padding: 10px;
  text-align: center;
  left: 0;
  right: 0;
}
.content-body {
  padding: 20px 20px;
}
</style>
<style lang="scss">
.data-drawer {
  .el-drawer__header {
    text-align: center;
    padding: 10px;
    margin: 0;
    border-bottom:1px solid #dcdfe6;
    [title]{
      color: #72767b;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
