import AkRequestOptionsCheckboxGroup from './src/AkRequestOptionsCheckboxGroup.vue';

AkRequestOptionsCheckboxGroup.install = function(Vue) {
  console.info('AkRequestOptionsCheckboxGroup----install----');
  Vue.component(AkRequestOptionsCheckboxGroup.name, AkRequestOptionsCheckboxGroup);
};

export default AkRequestOptionsCheckboxGroup;
