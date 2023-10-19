import axios from "axios";

const FS = window.FS;
const JSZip = window.JSZip;
const palZipUrl = "https://registry.npmmirror.com/evans-sdlpal-source/1.0.0/files/assets/pal-game.zip"

function deleteFileByPath(path) {
    Object.keys(FS.lookupPath(path).node.contents).forEach(element => {
        const stat = FS.stat(path + '/' + element);
        if (stat.mode & 0o040000) {
            deleteFileByPath(path + '/' + element);
            FS.rmdir(path + '/' + element);
        } else {
            FS.unlink(path + '/' + element);
        }
    });
}

function checkGameData() {
    try {
        return FS.stat('/data/fbp.mkf').size > 0;
    } catch (e) {
        return false;
    }
}

function clearGameData(done) {
    deleteFileByPath('/data');

    FS.syncfs(false, function (err) {
        if (err) console.error(err);
        done && done();
    });
}

function delay(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t);
    })
}


function syncFilesystem(b) {
    return new Promise((resolve, reject) => {
        FS.syncfs(!!b, function (err) {
            if (err) {
                reject(err)
            }
            resolve();
        });
    })
}

async function writeZipFileToData(zipData, loadOptions = {}) {
    const zip = new JSZip();
    const z = await zip.loadAsync(zipData, loadOptions);

    z.forEach(function (relativePath, zipEntry) {
        if (zipEntry.dir) {
            const pathArr = relativePath.split('/');
            let currPath = '/data';
            for (let i = 0; i < pathArr.length; i++) {
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
                    const file = '/data/' + relativePath.toLowerCase();
                    console.log('writeFile', file);
                    FS.writeFile(file, arr, {encoding: 'binary'});
                })
            });
        }
    });

    await syncFilesystem();
}

async function downloadRemotePALZip(options = {}) {
    const {onStatus, onDone, onError} = options;

    if (checkGameData()) {
        onStatus('加载成功');
        onDone();
        return;
    }
    onStatus('开始下载文件');
    const response = await axios.get(palZipUrl, {
        responseType: "arraybuffer",
        onDownloadProgress(event) {
            const {loaded, total, progress} = event;
            let text;
            if (progress) {
                text = `下载文件中: ${loaded}/${total}, 进度: ${(progress * 100).toFixed(2)}%`;
            } else {
                text = `下载文件中: ${loaded}`;
            }
            onStatus(text);
        },
    });

    onStatus('下载完成，开始解压...');

    await delay(1);

    try {
        await writeZipFileToData(response.data);
        onStatus('解压完成');
        onDone();
    } catch (e) {
        onError(e);
    }
}

async function mountFileSystem() {
    try {
        FS.mkdir('/data');
    } catch (e) {
        console.log(e)
    }

    FS.mount(IDBFS, {}, '/data');
    await syncFilesystem(true);
}

async function clearSave() {
    Object.keys(FS.lookupPath('/data').node.contents).forEach(element => {
        if (element.endsWith('.rpg')) {
            FS.unlink('/data/' + element);
        }
    });

   await syncFilesystem();
}

const defaultSaveName = 'save.zip';
async function putSaveToRemote() {
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
        console.log('没有存档');
        return;
    }

    const content = await zip.generateAsync({type: "base64"});

    await axios.post('/api/upload', {
        name: defaultSaveName,
        content
    })
}

async function loadSaveToRemote() {
    const resp = await axios.get('/api/load?name=' + defaultSaveName);
    const zipData = resp.data.kvResp;

    await writeZipFileToData(zipData, {
        base64: true,
    })
}

function downloadSaves() {
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
}

const fileAPI = {
    clearSave,
    checkGameData,
    clearGameData,
    mountFileSystem,
    downloadRemotePALZip,
    deleteFileByPath,
    writeZipFileToData,
    putSaveToRemote,
    loadSaveToRemote
}

window.fileAPI = fileAPI;

export {
    fileAPI
}

