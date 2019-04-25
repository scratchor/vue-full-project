<template>
  <div class="callback">
    <h1>Callbacking stuff..</h1>
  </div>
</template>

<script>
export default {
  name: "Callback",
  methods: {
    handleLoginEvent(data) {
      this.$router.push(data.state.target || "/secret");
    }
  },
  created() {
    this.$auth.handleAuthentication();
  }
};
</script>

<style scoped></style>
