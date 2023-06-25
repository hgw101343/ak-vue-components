<template>
  <div class="dashboard-container">
    <AkFileUpload v-model="files" />
    <ak-data-table
      ref="table"
      v-model="selections"
      :request-api="requestApi"
      :response-data-filter="responseListFilter"
    >
      <div
        slot="searchFormRender"
        slot-scope="{ queryParams, search, reset }"
        class="filter-container"
      >
        <el-input
          v-model="queryParams.unitInfo"
          :placeholder="'分拥单元ID/名称'"
          class="filter-item search-item"
          clearable
        />
        <el-input
          v-model="queryParams.productInfo"
          :placeholder="'商品ID/商品名称'"
          class="filter-item search-item"
          clearable
        />
        <el-select
          v-model="queryParams.status"
          class="filter-item search-item"
          placeholder="状态"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="queryParams.type"
          class="filter-item search-item"
          placeholder="类型"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-button class="filter-item" type="primary" @click="search">
          搜索
        </el-button>
        <el-button class="filter-item" type="success" @click="reset">
          重置
        </el-button>
        <el-button
          v-hasPermission="['productCommission:add']"
          class="filter-item"
          type="primary"
          @click="add"
        >
          {{ '添加单元' }}
        </el-button>
        <ak-request-button
          :confirm-text="`是否确定删除选中的数据?`"
          :request-api="deleteApi"
          :request-data="[...selections.map((o) => o.orderId) ]"
          class="filter-item"
          :disabled="!selections.length"
          type="primary"

          @loading-success="reloadList"
        >
          批量删除
        </ak-request-button>
      </div>
      <el-table-column align="center" type="selection" width="40px" />
      <el-table-column
        :label="'单元ID'"
        prop="id"
        min-width="100px"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="'单元名称'"
        prop="unitName"
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="'分拥商品'"
        prop="commissionProductTypeText"
        align="center"
        min-width="80px"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.commissionProductTypeText }}
            {{
              row.commissionProductTypeText == '指定'
                ? `(${row.productQuantity})`
                : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'默认分拥比例'"
        prop="defaultPercent"
        min-width="110px"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="'单元权重'"
        prop="unitWeight"
        align="center"
        min-width="110px"
      ></el-table-column>
      <el-table-column :label="'类型'" align="center" width="100px">
        <template slot-scope="{ row }">
          <span>
            {{ row.typeText }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'有效时间'"
        prop="createTime"
        align="center"
        min-width="180px"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.expireBeginTime + (row.expireEndTime ? '~' : '') }}
            <br />
            {{ row.expireEndTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'创建时间'"
        prop="createTime"
        align="center"
        min-width="180px"
      ></el-table-column>
      <el-table-column
        :label="'状态'"
        prop="status"
        align="center"
        min-width="90px"
      >
        <template slot-scope="scope">
          <span
            :class="{
              success: scope.row.status == 1,
              warning: scope.row.status == 0,
            }"
          >
            {{ scope.row.statusText }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'操作'"
        align="center"
        width="190px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row, }">
          <el-button
            v-hasPermission="['productCommission:update']"
            type="text"
            @click="edit(row)"
          >
            修改
          </el-button>

          <ak-request-button
            v-hasPermission="['productCommission:update']"
            type="text"
            :request-api="updateStatusApi"
            :confirm-text="`是否确定要${findArrayVal(
              statusOptions,
              row.status == 1 ? 0 : 1
            )}当前配置?`"
            :request-data="{ status: row.status == 1 ? 0 : 1, id: row.id }"
            @loading-success="reloadList"
          >
            {{ findArrayVal(statusOptions, row.status == 1 ? 0 : 1) }}
          </ak-request-button>
          <ak-request-button
            v-hasPermission="['productCommission:delete']"
            type="text"
            :request-api="deleteApi"
            :confirm-text="`是否确定要删除当前配置?`"
            :request-data="{ id: row.id }"
            @loading-success="reloadList"
          >
            删除
          </ak-request-button>
        </template>
      </el-table-column>
    </ak-data-table>
  </div>
</template>

<script>
import AkFileUpload from "./AkFileUpload.vue";
export default {
  name: "Dashboard",
  components: {
    AkFileUpload
  },
  data() {
    return {
      files: [],
      listFetchUrl: '/liveProduct/admin/productCommission/page', // 列表请求地址
      productCommissionGetSetUpUrl:
          '/liveProduct/admin/productCommission/getSetUp', // 佣金配置回查url
      productCommissionUpdateStatusUrl:
          '/liveProduct/admin/productCommission/updateStatus', // 佣金配置启用/禁用 url
      productCommissionUpdateDeleteUrl:
          '/liveProduct/admin/productCommission/delete', // 佣金配置删除 url

      selections: [], // 选中的数据
      statusOptions: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '启用'
        }
      ]
    };
  },
  computed: {

  },
  created() {},
  destroyed() {},
  methods: {
    reloadList() {
      this.$refs.table.search();
    },
    deleteApi(params) {
      return this.$delete(this.productCommissionUpdateDeleteUrl, {
        ...params
      });
    },
    updateStatusApi(params) {
      return this.$put2(this.productCommissionUpdateStatusUrl, {
        ...params
      });
    },
    requestApi(params) {
      return this.$get(this.listFetchUrl, {
        ...params
      });
    },
    findArrayVal(arr, val, labelKey = 'label', valueKey = 'value') {
      let findVal = '';
      if (!arr || !arr.length || !arr.map) return findVal;
      arr.map((o) => {
        if (o[valueKey] == val) {
          findVal = o[labelKey];
        }
      });
      return findVal;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container{
  background: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
}
</style>
