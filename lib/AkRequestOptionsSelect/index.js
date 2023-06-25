import AkRequestOptionsSelect from './src/AkRequestOptionsSelect.vue';

AkRequestOptionsSelect.install = function(Vue) {
  console.info('AkRequestOptionsSelect----install----');
  Vue.component(AkRequestOptionsSelect.name, AkRequestOptionsSelect);
};

export default AkRequestOptionsSelect;
