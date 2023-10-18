import './style.css';

console.log(FS, Module)

const userLang = navigator.language || navigator.userLanguage;

if (userLang === 'zh-CN' || userLang.startsWith('zh-Hans')) {
    document.getElementById('btnDeleteData').value = '删除游戏数据';
    document.getElementById('btnDownloadSave').value = '下载存档';
    document.getElementById('btnLaunch').value = '开始游戏';
} else if (userLang === 'zh-TW' || userLang.startsWith('zh-Hant')) {
    document.getElementById('btnDeleteData').value = '刪除遊戲資料';
    document.getElementById('btnDownloadSave').value = '下載記錄';
    document.getElementById('btnLaunch').value = '開始遊戲';
}