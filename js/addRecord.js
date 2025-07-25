var current_time = ""
let resizedBlob = null;
function updateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();      // 格式如 2025/7/24
    const time = now.toLocaleTimeString('zh-TW', {
      hour12: false, // 關閉 12 小時制，即使用 24 小時制
    });

    current_time = date + " " + time
    document.getElementById('show_current_time').textContent = current_time;
}

var setInterval_timecounter=setInterval(updateTime, 1000); // 每 1 秒執行一次
updateTime(); // 初始立即執行一次


document.getElementById('fileInput').addEventListener('change', function (event) {
const file = event.target.files[0];
if (file && file.type.startsWith('image/')) {

    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
        document.querySelector('.attachment .preview').src = e.target.result;

        img.src = e.target.result;


        const base64Data = reader.result.split(',')[1]; // 去掉前綴
        fileData = {
            name: file.name,
            type: file.type,
            contents: base64Data
        };
    };

    img.onload = () => {
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        const width = MAX_WIDTH;
        const height = img.height * scale;

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resizedBlob = blob;
          alert("圖片已成功縮小，可以上傳！");
        }, "image/jpeg", 0.8); // 壓縮品質 0.8
      };

    reader.readAsDataURL(file);
    
} else {
    document.querySelector('.attachment .preview').src = '';
}
});


// 當使用者點擊提交按鈕，才真正送出資料
document.getElementById('submit_bnt').addEventListener('click', function () {
    if (!fileData) {
        alert('請先選擇檔案');
        return;
    }
    clearInterval(setInterval_timecounter); // 停止時間計數器

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    const params = `name=${encodeURIComponent(fileData.name)}&type=${encodeURIComponent(fileData.type)}&contents=${encodeURIComponent(fileData.contents)}&timestamp=${current_time}`;
    xhr.send(params);
    show_loading("上傳中...")

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            //alert('成功上傳！伺服器回應：' + xhr.responseText);
            //console.log('伺服器回應：', xhr.responseText);
            hide_loading()
            show_message("上傳成功")
            document.querySelector('.attachment .preview').src = '';
            setInterval_timecounter=setInterval(updateTime, 1000); // 每 1 秒執行一次
        } else {
            alert('上傳失敗，狀態碼：' + xhr.status);
            console.error('上傳失敗，狀態碼：', xhr.status, '回應：', xhr.responseText);
            hide_loading()
            setInterval_timecounter=setInterval(updateTime, 1000); // 每 1 秒執行一次
        }
        }
    };
});



