<template>
  <div class="navbar">

    <breadcrumb class="breadcrumb-container" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Breadcrumb from '@/components/bread-crumb/BreadCrumb.vue';

export default {
  components: {
    Breadcrumb

  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {

  overflow: hidden;
  position: relative;

}
</style>
