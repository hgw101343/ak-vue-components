import cloneDeep from "lodash/cloneDeep";
import lodashGet from "lodash/get";
import isArray from "lodash/isArray";
export default function(WrappedComponent) {
  return {
    props: Object.assign({

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
    }, WrappedComponent.props),
    data() {
      return {
        optionsLoading: false,
        options: [

        ]
      };
    },
    mounted() {
      this.fetch();
    },
    methods: {
      fetch(params = {}) {
        if (!this.requestApi) return console.log("请配置正确的requestApi");

        this.optionsLoading = true;
        const setRquestData = cloneDeep({
          ...params,
          ...this.requestData
        });

        const requestData = this.requestDataFilter(setRquestData);
        this.$emit("before-loading", requestData);
        this.cacheRequestData = requestData;
        this.requestApi(requestData)
          .then((r) => {
            r = this.responseAllDataFilter(r);
            const setOptions = this.responseDataFilter(
              lodashGet(r, this.responseDataPath)
            );
            this.options = isArray(setOptions) ? setOptions : [];

            this.optionsLoading = false;
            this.$emit("loading-success", r, this.options);
          })
          .catch((e) => {
            this.options = [];
            this.optionsLoading = false;
            this.$emit("loading-error", e, this.options);
          });
      },

      makeVnodesContextToSelf(vnodes) {
        vnodes = vnodes.map(vnode => {
          vnode.context = this._self;
          return vnode;
        });
        return vnodes;
      }
    },

    render(h) {
      const slots = this.makeVnodesContextToSelf(Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), []));

      const { optionsRender, ...normalScopedSlots } = this.$scopedSlots;
      let optionsRenderVnodes = [];
      if (typeof optionsRender == 'function') {
        optionsRenderVnodes = optionsRender({
          options: this.options,
          optionsLoading: this.optionsLoading
        });
      }
      return h(WrappedComponent, {
        directives: [
          {
            name: 'loading',
            rawName: 'v-loading',
            value: this.optionsLoading,
            expression: 'loading'
          }
        ],
        on: this.$listeners,
        props: { ...this.$props },
        // 透传 scopedSlots
        scopedSlots: normalScopedSlots,
        attrs: this.$attrs
      }, optionsRenderVnodes && optionsRenderVnodes.length ? optionsRenderVnodes : slots);
    }
  };
}

