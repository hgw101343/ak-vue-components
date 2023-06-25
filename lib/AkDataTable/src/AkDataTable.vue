<script>
import AkPagination from "../../AkPagination/src/AkPagination.vue";

import { Table } from "element-ui";
import cloneDeep from "lodash/cloneDeep";
import lodashGet from "lodash/get";
// 新增阿康基础列表
export default {
  name: "AkDataTable",
  components: { AkPagination },
  model: {
    prop: "selections", // 要存在于props
    event: "selections-change" // 当组件的值发生改变时要emit的事件名
  },
  props: {
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
    // 列表返回的数据地址
    responseRecordsDataPath: {
      type: String,
      default: "data.data.records"
    },
    // 列表返回的统计数地址
    responseTotalDataPath: {
      type: String,
      default: ""
    },
    /**
     * 配置排序数据的数据过滤方法
     */
    sortDataFilter: {
      type: Function,
      default: (res) => res
    },

    /**
     * 当前选中行的数据
     */
    selections: {
      type: Array,
      default: () => []
    },
    pageProps: {
      type: [Object],
      default: () => ({})
    }
  },
  data() {
    return {
      cacheRequestData: null, // 每次发起请求的缓存
      loading: false,
      list: [],
      total: 0,
      mutipleSelections: this.selections || [],
      queryParams: {},
      sort: {},
      pagination: {
        size: 10,
        num: 1
      }
    };
  },
  computed: {},
  watch: {
    selections(newVal) {
      if (newVal != this.mutipleSelections) {
        this.mutipleSelections = newVal;
      }
    },
    mutipleSelections(newVal) {
      this.$emit("selections-change", newVal);
    }
  },

  created() {},
  mounted() {
    this.fetch();
  },
  destroyed() {},

  methods: {
    search() {
      this.fetch({
        ...this.queryParams,
        ...this.sort
      });
    },
    reset() {
      this.queryParams = {};
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      this.search();
    },
    getCacheRequestData() {
      return this.cacheRequestData;
    },
    fetch(params = {}) {
      if (!this.requestApi) return console.log("请配置正确的requestApi");

      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      this.loading = true;
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
          this.list = this.responseDataFilter(
            lodashGet(r, this.responseRecordsDataPath)
          );
          const totalPath =
            this.responseRecordsDataPath && !this.responseTotalDataPath
              ? this.responseRecordsDataPath.replace(/.\w+$/g, ".total")
              : (this.responseTotalDataPath || "data.data.total");
          this.total = lodashGet(r, totalPath);
          this.loading = false;
          this.$emit("loading-success", r, this.list);
        })
        .catch((e) => {
          this.list = [];
          this.total = 0;
          this.loading = false;
          this.$emit("loading-error", e, this.list);
        });
    },
    onSelectChange(selection) {
      this.mutipleSelections = selection;
    },
    sortChange(val) {
      this.sort.field = val.prop;
      this.sort.order = val.order;
      this.sort = this.sortDataFilter(this.sort);
      this.$emit("sort-change", val, this.sort);
      this.search();
    },
    setFirstStrToUpperCase(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    }
  },
  render() {
    const filterTableProps = {};
    const filterPaginationProps = {};
    // 筛选出table支持的属性
    Object.keys(this.$attrs).map((key) => {
      const setPropKey = key
        .split("-")
        .map((splitKey, splitIdx) => {
          return splitIdx > 0 && splitKey[0]
            ? this.setFirstStrToUpperCase(splitKey)
            : splitKey;
        })
        .join("");

      if (Table.props[setPropKey]) {
        filterTableProps[setPropKey] = this.$attrs[key];
      } else if (AkPagination.props[setPropKey]) {
        filterPaginationProps[setPropKey] = this.$attrs[key];
      }
    });
    this.$slots;
    return (
      <div class="ak-data-table">
        {this.$scopedSlots.searchFormRender
          ? this.$scopedSlots.searchFormRender({
            queryParams: this.queryParams,
            search: this.search,
            reset: this.reset,
            getCacheRequestData: this.getCacheRequestData,
            tableObj: this
          })
          : null}
        <el-table
          ref="table"
          {...{
            directives: [
              {
                name: "loading",
                rawName: "v-loading",
                value: this.loading,
                expression: "loading"
              }
            ],
            attrs: {
              data: this.list,
              border: true,
              fit: true,
              ...filterTableProps
            },
            on: {
              "selection-change": this.onSelectChange,
              "sort-change": this.sortChange
            }
          }}
        >
          {this.$slots && this.$slots.default ? this.$slots.default : null}
        </el-table>
        <AkPagination
          {...{
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: this.total > 0,
                expression: "total>0"
              }
            ],
            attrs: {
              total: this.total,
              page: this.pagination.num,
              limit: this.pagination.size,
              ...filterPaginationProps,
              ...this.pageProps
            },
            on: {
              "update:page": ($event) => {
                return this.$set(this.pagination, "num", $event);
              },
              "update:limit": ($event) => {
                return this.$set(this.pagination, "size", $event);
              },
              pagination: this.search
            }
          }}
        />
      </div>
    );
  }
};
</script>
