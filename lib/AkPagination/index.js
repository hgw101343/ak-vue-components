import AkPagination from './src/AkPagination.vue';

AkPagination.install = function(Vue) {
  console.info('AkPagination----install----');
  Vue.component(AkPagination.name, AkPagination);
};

export default AkPagination;
