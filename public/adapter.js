var strSyncingFs = 'Syncing FS...';
var strDone = 'Done.';
var strDeleting = 'Deleting...';
var strNoSave = 'Cannot find saved games to download';
var strNoData = 'Error: Game data not loaded!';
var strInit = 'Initializing...';
var strLoading = 'Loading';
var strDelConfirm = "This will DELETE your game data and saved games stored in browser cache. Type 'YES' to continue.";

var userLang = navigator.language || navigator.userLanguage;
if (userLang === 'zh-CN' || userLang.startsWith('zh-Hans')) {
    strSyncingFs = '正在同步文件系统...';
    strDone = '完成。';
    strDeleting = '正在删除...';
    strNoSave = '无法找到可下载的游戏存档！';
    strNoData = '错误：游戏数据未上传。请先上传ZIP格式的游戏数据文件。';
    strInit = '正在初始化...';
    strLoading = '正在加载';
    strDelConfirm = '此操作将删除您浏览器缓存中保存的数据文件及存档。请输入 "YES" 继续：';
} else if (userLang === 'zh-TW' || userLang.startsWith('zh-Hant')) {
    strSyncingFs = '正在同步檔案系統...';
    strDone = '完成。';
    strDeleting = '正在刪除...';
    strNoSave = '無法找到可下載的遊戲記錄！';
    strNoData = '錯誤：遊戲資料檔未上傳。請先上傳ZIP格式的遊戲資料檔。';
    strInit = '正在初始化...';
    strLoading = '正在加載';
    strDelConfirm = '此操作將刪除您瀏覽器緩存中保存的遊戲資料檔及記錄。請輸入 "YES" 繼續：';
}

var Module = {
    preRun: [],
    postRun: [],
    print: function (text) {
        console.log(text);
    },
    printErr: function (text) {
        console.error(text);
    },
    canvas: (function () {
        // var canvas = document.getElementById('canvas');
        var canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.oncontextmenu = (ev) => {
            ev.preventDefault()
        };
        canvas.tabIndex = -1;

        // As a default initial behavior, pop up an alert when webgl context is lost. To make your
        // application robust, you may want to override this behavior before shipping!
        // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
        canvas.addEventListener("webglcontextlost", function (e) {
            alert('WebGL context lost. You will need to reload the page.');
            e.preventDefault();
        }, false);

        window.GAME_CANVAS = canvas;

        return canvas;
    })(),
    setStatus: function (text) {
        if (!Module.setStatus.last) Module.setStatus.last = {time: Date.now(), text: ''};
        if (text === Module.setStatus.last.text) return;
        if (text === '' && Module.setStatus.last.text == strSyncingFs) return;
        var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
        var now = Date.now();
        if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
        Module.setStatus.last.time = now;
        Module.setStatus.last.text = text;
        // if (m) {
        //     text = m[1];
        //     progressElement.value = parseInt(m[2]) * 100;
        //     progressElement.max = parseInt(m[4]) * 100;
        //     progressElement.hidden = false;
        //     spinnerElement.hidden = false;
        // } else {
        //     progressElement.value = null;
        //     progressElement.max = null;
        //     progressElement.hidden = true;
        //     if (!text) spinnerElement.style.display = 'none';
        // }
        // statusElement.innerHTML = text;
        window.ModuleStatus = {
            text,
            m,
            now,
        }
        console.log(text);
    },
    totalDependencies: 0,
    monitorRunDependencies: function (left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    },
    onRuntimeInitialized: function () {
        window.__ready__ = true;
        window.postMessage({
            status: 'onRuntimeInitialized',
            payload: {},
        });
    }
};

Module.setStatus(strInit);

window.onerror = function (event) {
    Module.setStatus('Exception thrown, see JavaScript console');
    // spinnerElement.style.display = 'none';
    Module.setStatus = function (text) {
        if (text) Module.printErr('[post-exception status] ' + text);
    };
};
