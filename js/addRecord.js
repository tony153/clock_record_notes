var current_time = ""
let resizedBlob = null;
var fileData = null;
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


function compressImageToBase64(file, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error("圖片載入失敗"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.readAsDataURL(file);
  });
}


document.getElementById('fileInput').addEventListener('change',async function (event) {
const file = event.target.files[0];
if (file && file.type.startsWith('image/')) {
    try {
        // 使用壓縮函數將圖片轉換為 Base64 字串
        let base64Data = await compressImageToBase64(file, parseFloat(Image_compression_rate));
        show_message("" + file.name + " 已壓縮，大小：" + (file.size / 1024).toFixed(2) + " KB");

        // 將 Base64 字串設置為預覽圖片的 src
        const img = new Image();
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector('.attachment .preview').src = e.target.result;

            img.src = e.target.result;


            base64Data = base64Data.split(',')[1]; // 去掉前綴
            // 將 Base64 字串和檔案資訊存儲到 fileData 物件中
            fileData = {
                name: file.name,
                type: file.type,
                contents: base64Data
            };
        };

        reader.readAsDataURL(file);
    } catch (err) {
        console.error("壓縮失敗：", err);
    }
    
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



