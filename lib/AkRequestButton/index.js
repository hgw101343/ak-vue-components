import AkRequestButton from './src/AkRequestButton.vue';

AkRequestButton.install = function(Vue) {
  console.info('AkRequestButton----install----');
  Vue.component(AkRequestButton.name, AkRequestButton);
};

export default AkRequestButton;
