/*
 * @Author: huanggengwu 'yunyaokj@gmail.com'
 * @Date: 2023-06-26 15:14:01
 * @LastEditors: huanggengwu 'yunyaokj@gmail.com'
 * @LastEditTime: 2023-06-26 15:16:47
 * @FilePath: \zujian\ak-vue-components\lib\AkOperateIcon\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import AkFilterForm from './src/AkFilterForm.vue';

AkFilterForm.install = function(Vue) {
  console.info('AkFilterForm----install----');
  Vue.component(AkFilterForm.name, AkFilterForm);
};

export default AkFilterForm;
