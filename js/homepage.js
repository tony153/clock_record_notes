
const xhr = new XMLHttpRequest();

function randRecordsList(recordsList) {
    let targetElement = document.querySelector('.contents-box');
    targetElement.innerHTML = ''; // 清空現有列表

    recordsList.forEach(item => {
        targetElement.innerHTML += `
        <div class="row list-item">
            <div class="row-title" onlclick ="javaScript:show_detail('${item["檔名"]}', '${item["前端記錄時間"]}')">`+formatUsingIntl(item["前端記錄時間"])+`</div>
            <a href="`+item["圖片連結"]+`"><div class="act-bnt regular">查看</div></a>
        </div>
        `;
    })

}

function getRecords(){
    xhr.open('GET', API_URL + '?action=getRecords', true); // 👈 記得替換成你的 Google Apps Script 部署網址

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
        try {
            const records = JSON.parse(xhr.responseText); // 轉成物件陣列
            console.log(records); // 👀 你可以改成 render 到畫面上

            // 範例：印出每筆記錄的時間和內容
            randRecordsList(records)
            hide_loading()
            show_message("載入成功")

        } catch (err) {
            console.error('⚠️ JSON 格式錯誤：', err);
            hide_loading()
            show_message("⚠️ JSON 格式錯誤：" + err.message)
        }
        } else {
        console.error('❌ 錯誤狀態碼：' + xhr.status);
        show_message("❌ 錯誤狀態碼：" + xhr.status)
        hide_loading()
        }
    }
    };

    xhr.send();
    show_loading("載入中...")
}

setTimeout(() => {
    // 初始載入記錄
    getRecords();
}, 100); // 延遲 1 秒以確保頁面載入完成


function show_detail(filename,time) {

    xhr.open('GET', API_URL + '?action=getImage&name='+ filename, true); // 👈 記得替換成你的 Google Apps Script 部署網址

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            try {
                document.querySelector('#clock_image').src=xhr.responseText; 
                document.querySelector('#clock_time').innerText = formatUsingIntl(time); // 假設檔名格式為 YYYY-MM-DD_HH-MM-SS.jpg
                hide_loading()
                document.querySelector('.clock_detail_panel').style.display = 'flex';

            } catch (err) {
                hide_loading()
                show_message("⚠️ 錯誤：" + err.message)
            }
        } else {
            console.error('❌ 錯誤狀態碼：' + xhr.status);
            show_message("❌ 錯誤狀態碼：" + xhr.status)
            hide_loading()
        }
    }
    };

    xhr.send();
    show_loading("載入中...")
}

function hideClockDetailPanel() {
    document.querySelector('#clock_image').src = '';
    document.querySelector('.clock_detail_panel').style.display = 'none';
}