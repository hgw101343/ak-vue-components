<script>
export default {
  name: "AkFileUpload",
  components: {

  },
  model: {
    prop: 'value', // 要存在于props
    event: 'file-change' // 当组件的值发生改变时要emit的事件名
  },
  data() {
    return {
      fileUrls: []
    };
  },
  computed: {

  },
  created() {},
  destroyed() {},
  methods: {

  }
};
</script>

<style lang="scss" scoped>
</style>
