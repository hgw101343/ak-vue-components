
import AkDataTable from "./AkDataTable/src/AkDataTable.vue";
import AkRequestButton from "./AkRequestButton/src/AkRequestButton.vue";
import AkRequestDataDialog from "./AkRequestDataDialog/src/AkRequestDataDialog.vue";
import AkPagination from "./AkPagination/src/AkPagination.vue";
import AkRequestOptionsSelect from "./AkRequestOptionsSelect/src/AkRequestOptionsSelect.vue";
import AkRequestOptionsCheckboxGroup from "./AkRequestOptionsCheckboxGroup/src/AkRequestOptionsCheckboxGroup.vue";
import AkFilterForm from "./AkFilterForm/src/AkFilterForm.vue";
import AkOperateIcon from "./AkOperateIcon/src/AkOperateIcon.vue";
import MakeRequestOptionsHoc from "./common/MakeRequestOptionsHoc.js";
import "./styles/index.css";
const componentsMap = {
  AkDataTable,
  AkRequestButton,
  AkRequestDataDialog,
  AkPagination,
  AkRequestOptionsSelect,
  AkRequestOptionsCheckboxGroup,
  AkFilterForm,
  AkOperateIcon,
};
export function install(Vue) {
  Object.keys(componentsMap).map((componentName) => {
    console.info("install----all----");
    if (componentsMap[componentName].name) {
      Vue.component(componentsMap[componentName].name, componentsMap[componentName]);
    }
  });
}

export {
  AkDataTable,
  AkPagination,
  AkRequestDataDialog,
  AkRequestButton,
  AkRequestOptionsSelect,
  AkRequestOptionsCheckboxGroup,
  MakeRequestOptionsHoc
};
export default {
  AkDataTable,
  AkRequestButton,
  AkRequestDataDialog,
  AkPagination,
  AkRequestOptionsSelect,
  AkRequestOptionsCheckboxGroup,
  MakeRequestOptionsHoc,
  install
};
