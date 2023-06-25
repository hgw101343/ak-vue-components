import AkDataTable from './src/AkDataTable.vue';

AkDataTable.install = function(Vue) {
  console.info('AkDataTable----install----');
  Vue.component(AkDataTable.name, AkDataTable);
};

export default AkDataTable;
