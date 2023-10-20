<script>

import {fileAPI} from "./lib/file.js";

function resizeGame() {
  const wrap = document.querySelector('#wrap_game');
  const wrapWidth = wrap.offsetWidth;
  const wrapHeight = wrap.offsetHeight;

  const canvasWidth = 640;
  const canvasHeight = 400;

  const scaleX = wrapWidth/canvasWidth;
  const scaleY = wrapHeight/canvasHeight;

  const scale = scaleX < scaleY ? scaleX : scaleY;

  window.GAME_CANVAS.style.transformOrigin = '0 0';
  window.GAME_CANVAS.style.transform= `scale(${scale})`;

  if (scaleX > scaleY) {
    const width = canvasWidth * scale;
    const left = (wrapWidth - width) / 2;

    window.GAME_CANVAS.style.position = 'relative';
    window.GAME_CANVAS.style.left = left + 'px';
  }
}

export default {
  name: "App",
  data() {
    return {
      gameMode: 0
    }
  },
  mounted() {
    window.onresize = () => {
      resizeGame();
    }
  },
  methods: {
    launch() {
      this.gameMode = 1;

      const wrap = document.querySelector('#wrap_game');
      wrap.appendChild(window.GAME_CANVAS);
      resizeGame();

      const mainFunc = Module.cwrap('EMSCRIPTEN_main', 'number', ['number', 'number'], {async: true});
      mainFunc(0, 0);
    },
    importSave() {
      document.getElementById('fileid').click();
    },
    async saveFileChange(event) {
      // console.log(event, event.target.files)
      const saveFileZip = event.target.files[0];

      await fileAPI.writeZipFileToData(saveFileZip);
      window.alert('导入成功');
    },
    downloadSave() {
      fileAPI.downloadSaves();
    },
    async pushCloudSave() {
      let key = window.prompt("请输入存档名", "");
      await fileAPI.putSaveToRemote(key);
      window.alert('推送成功');
    },
    async pullCloudSave() {
      let key = window.prompt("请输入存档名", "");
      await fileAPI.loadSaveToRemote(key);
      window.alert('拉取成功');
    }
  },

}
</script>

<template>
  <div class="app" id="wrap_game">
    <div class='controls' v-show="gameMode === 0">
      <div>
        <img src="https://registry.npmmirror.com/evans-sdlpal-source/1.0.0/files/lib/icon.png" alt="">
      </div>
      <div class="btn-box">
        <button class="btn" @click="launch">
          开始
        </button>

        <button class="btn" @click="downloadSave">
          下载存档到本地
        </button>

        <input id='fileid' type='file' hidden v-on:change="saveFileChange"/>
        <button class="btn" @click="importSave">
          导入本地存档
        </button>

        <button class="btn" @click="pushCloudSave">
          云存档推送
        </button>

        <button class="btn" @click="pullCloudSave">
          云存档拉取
        </button>
      </div>

      <div class="info">
        支持xbox手柄<br/>
        up, down, left, right 为手柄对应位置, 暂时没绑定摇杆<br/>
        A - 键盘space/enter;<br/>
        Y - 键盘R；<br/>
        menu - 键盘esc<br/>
      </div>
    </div>

    <!--    <canvas></canvas>-->
  </div>
</template>

<style scoped>
.app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.controls {
  margin: 200px auto;
  width: 400px;
  text-align: center;

  .btn-box{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn {
    font-size: 20px;
    width: 200px;
    margin-top: 20px;
    padding: 10px 20px;
  }
}

.info{
  margin-top: 20px;
  color: white;
}
</style>
