import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import AkComponents from 'ak-vue-components';
import "@/styles/element-variables.scss";
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon

import settings from '@/settings';

import service, { request } from '@/utils/request';
Vue.prototype.$axios = service;
Object.keys(request).forEach((key) => {
  Vue.prototype['$' + key] = request[key];
});

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);
Vue.use(AkComponents);
Vue.config.productionTip = false;

Vue.prototype.globalSetting = settings;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
