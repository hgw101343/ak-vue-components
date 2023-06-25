<template>
  <div class="top-nav">
    <div class="log" :style="{backgroundImage:`url(${globalSetting.publicPath}/images/logo.png)`}">ak-vue-components文档中心</div>
    <HamBurger v-if="!sidebar.hide" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div style="display:none;">
      <el-menu

        :active-text-color="variables.menuActiveText"
        :default-active="activeMenu"
        mode="horizontal"
        @select="handleSelect"
      >
        <div v-for="item in routes" :key="item.path" class="nav-item">
          <app-link :to="resolvePath(item)">
            <el-menu-item
              v-if="!item.hidden"
              :index="item.path"
            >{{ item.meta ? item.meta.title : item.children[0].meta.title }}</el-menu-item>
          </app-link>
        </div>
      </el-menu>
    </div>

    <div class="right-menu">
      <el-badge :hidden="!unread" :value="unread" class="item" type="warning">
        <svg-icon class="msg-icon" icon-class="msg" @click="$router.push('/dashboard')" />
      </el-badge>

      <svg-icon class="logout" icon-class="power-off" @click="logout" />
      <i class="el-icon-setting setting-btn" @click="openToSetToken" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLink from './side-bar/Link';
import { constantRoutes } from '@/router';
import variables from '@/styles/variables.scss';
import { isExternal } from '@/utils/validate';
import { setToken } from '@/utils/auth.js';
import HamBurger from "@/components/ham-burger/HamBurger.vue";
export default {
  name: 'Topbar',
  components: {
    HamBurger,
    AppLink

  },
  data() {
    return {
      routes: constantRoutes
    };
  },
  computed: {

    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      // 如果是首页，首页高亮
      if (path === '/dashboard') {
        return '/';
      }
      // 如果不是首页，高亮一级菜单
      const activeMenu = '/' + path.split('/')[1];
      return activeMenu;
    },
    variables() {
      return variables;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    ...mapGetters(['avatar', 'sidebar', "userInfo", "unread"])
  },
  mounted() {
    this.initCurrentRoutes();
  },
  methods: {
    openToSetToken() {
      this.$prompt('请输入token', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '设置成功'
        });
        debugger;
        setToken(value);
      }).catch(() => {

      });
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    // 通过当前路径找到二级菜单对应项，存到store，用来渲染左侧菜单
    initCurrentRoutes() {
      const { path } = this.$route;
      let route = this.routes.find(
        item => item.path === '/' + path.split('/')[1]
      );
      // 如果找不到这个路由，说明是首页
      if (!route) {
        route = this.routes.find(item => item.path === '/');
      }
      this.$store.commit('permission/SET_CURRENT_ROUTES', route);
      this.setSidebarHide(route);
    },
    // 判断该路由是否只有一个子项或者没有子项，如果是，则在一级菜单添加跳转路由
    isOnlyOneChild(item) {
      if (item.children && item.children.length === 1) {
        return true;
      }
      return false;
    },
    resolvePath(item) {
      // 如果是个完成的url直接返回
      if (isExternal(item.path)) {
        return item.path;
      }
      // 如果是首页，就返回重定向路由
      if (item.path === '/') {
        const path = item.redirect;
        return path;
      }

      // 如果有子项，默认跳转第一个子项路由
      let path = '';
      /**
       * item 路由子项
       * parent 路由父项
       */
      const getDefaultPath = (item, parent) => {
        // 如果path是个外部链接（不建议），直接返回链接，存在个问题：如果是外部链接点击跳转后当前页内容还是上一个路由内容
        if (isExternal(item.path)) {
          path = item.path;
          return;
        }
        // 第一次需要父项路由拼接，所以只是第一个传parent
        if (parent) {
          path += (parent.path + '/' + item.path);
        } else {
          path += ('/' + item.path);
        }
        // 如果还有子项，继续递归
        if (item.children) {
          getDefaultPath(item.children[0]);
        }
      };

      if (item.children) {
        getDefaultPath(item.children[0], item);
        return path;
      }

      return item.path;
    },
    handleSelect(key, keyPath) {
      // 把选中路由的子路由保存store
      const route = this.routes.find(item => item.path === key);
      this.$store.commit('permission/SET_CURRENT_ROUTES', route);
      this.setSidebarHide(route);
    },
    // 设置侧边栏的显示和隐藏
    setSidebarHide(route) {
      if (!route.children || route.children.length === 1) {
      //  this.$store.dispatch('app/toggleSideBarHide', true);
      } else {
        this.$store.dispatch('app/toggleSideBarHide', false);
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style scoped>
.setting-btn{
  color:#fff;
  font-size: 20px;
  cursor: pointer;
  margin:5px 20px;
}
</style>
