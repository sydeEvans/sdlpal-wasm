<script>
import Loading from "./components/Loading.vue";
import {fileAPI} from "./lib/file.js";
import App from "./App.vue";

function ready(cb) {
  window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== location.origin) return;
        const msg = event.data;
        if (msg.status !== 'onRuntimeInitialized') return;

        cb(msg);
      },
      false,
  );
}

export default {
  name: "Index",
  components: {App, Loading},
  data: () => {
    return {
      statusText: 'Initial game~',
      loaded: false,
    }
  },
  mounted() {
    ready(async () => {
      await fileAPI.mountFileSystem();

      await fileAPI.downloadRemotePALZip({
        onStatus: (text) => {
          console.log(text);
          this.statusText = text;
        },
        onDone: () => {
          this.loaded = true;
        },
        onError(err) {
          console.log(err)
        }
      })
    })


  }
}
</script>

<template>
  <div class="main">
    <App v-if="loaded" />
    <Loading :title="statusText" v-else/>
  </div>
</template>

<style scoped lang="scss">

.main{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.9);
}
</style>