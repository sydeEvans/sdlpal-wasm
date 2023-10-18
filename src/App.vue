<script>
const FS = window.FS;
const JSZip = window.JSZip;
console.log(FS, Module);

export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const wrap = document.querySelector('#wrap_game');
    wrap.appendChild(window.GAME_CANVAS);
  },
  methods: {
    launch() {
      let checkFile = false;
      try {
        if (FS.stat('/data/fbp.mkf').size > 0) {
          checkFile = true;
        }
      } catch (e) {
      }
      if (!checkFile) {
        Module.setStatus(strNoData);
        return;
      }

      const mainFunc = Module.cwrap('EMSCRIPTEN_main', 'number', ['number', 'number'], {async: true});
      mainFunc(0, 0);
    },
    downloadSaves() {
      const zip = new JSZip();
      let hasData = false;
      Object.keys(FS.lookupPath('/data').node.contents).forEach(element => {
        if (element.endsWith('.rpg')) {
          const array = FS.readFile('/data/' + element);
          zip.file(element, array);
          hasData = true;
        }
      });
      if (!hasData) {
        window.alert(strNoSave);
        return;
      }
      zip.generateAsync({type: "base64"}).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
      }, function (err) {
        Module.printErr(err);
      });
    },
    loadZip() {
      const fileBtn = document.getElementById('btnLoadZip');
      Module.setStatus(strLoading + ' ' + fileBtn.files[0].name + '...');
      // spinnerElement.style.display = 'inline-block';

      const fileInput = document.getElementById("btnLoadZip");
      const zip = new JSZip();
      const file = fileInput.files[0];

      zip.loadAsync(file).then(function (z) {
        z.forEach(function (relativePath, zipEntry) {
          if (zipEntry.dir) {
            var pathArr = relativePath.split('/');
            var currPath = '/data';
            for (var i = 0; i < pathArr.length; i++) {
              currPath += '/';
              currPath += pathArr[i];
              try {
                FS.mkdir(currPath.toLowerCase(), 0o777);
              } catch (e) {
              }
            }
          } else {
            zip.sync(function () {
              zipEntry.async('uint8array').then(function (arr) {
                FS.writeFile('/data/' + relativePath.toLowerCase(), arr, {encoding: 'binary'});
              })
            });
          }
        });
        Module.setStatus(strSyncingFs);
        FS.syncfs(function (err) {
          Module.setStatus(strDone);
          // spinnerElement.style.display = 'none';
        });
      });
    },
    clearData() {
      if (window.prompt(strDelConfirm) === "YES") {
        const doDelete = function (path) {
          Object.keys(FS.lookupPath(path).node.contents).forEach(element => {
            const stat = FS.stat(path + '/' + element);
            if (stat.mode & 0o040000) {
              doDelete(path + '/' + element);
              FS.rmdir(path + '/' + element);
            } else {
              FS.unlink(path + '/' + element);
            }
          });
        };
        Module.setStatus(strDeleting);
        // spinnerElement.style.display = 'inline-block';
        doDelete('/data');
        Module.setStatus(strSyncingFs);
        FS.syncfs(false, function (err) {
          // spinnerElement.style.display = 'none';
          Module.setStatus(strDone);
        });
      }
    }
  }
}
</script>

<template>
  <div>
    <div id='controls'>

      <button @click="launch">
        开始
      </button>
      <!--      <span>-->
      <!--        <input type="file" id="btnLoadZip" accept="application/zip" value="Load Zip" onchange="loadZip();">-->
      <!--        <input type="button" id="btnDeleteData" value="Delete Data" onclick="clearData();">-->
      <!--        <input type="button" id="btnDownloadSave" value="Download Saved Games" onclick="downloadSaves();">-->
      <!--        <input type="button" id="btnLaunch" value="Launch" onclick="launch();">-->
      <!--      </span>-->
    </div>

    <div id="wrap_game"></div>
  </div>
</template>

<style scoped>

</style>
