var API_URL = ""; // Replace with your API URL
var Image_compression_rate = 0.8; // Default compression rate
const STORAGE_KEY = 'user_api_url';
const STORAGE_KEY_Image_compression_rate = 'image_compression_rate';

// 🚀 啟動時檢查 localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedApi = localStorage.getItem(STORAGE_KEY);
    if (savedApi) {
      console.log('✅ 使用者之前記錄的 API:', savedApi);
      API_URL = savedApi; // 更新全域變數 API_URL
    } else {
      console.log('📭 尚未記錄任何 API，請輸入');
    }

    const savedImage_compression_rate = localStorage.getItem(STORAGE_KEY_Image_compression_rate);
    if (savedImage_compression_rate) {
      console.log('✅ 使用者之前記錄的 圖片壓縮率:', savedImage_compression_rate);
      Image_compression_rate = savedImage_compression_rate; // 更新全域變數 API_URL
    } else {
      console.log('📭 尚未記錄任何 圖片壓縮率，請輸入');
    }
  });


function show_loading(message){
    if (message == undefined){
        message = "加載中..."
    }

    if (document.querySelector(".loading_panel"))
        document.querySelector(".loading_panel").remove();

    document.querySelector(".hook").style.height = "100%";
    document.querySelector(".hook").innerHTML+=`
    <div class="loading_panel">
        <div class="loading_box">
            <img src="loader.gif">
            <div class="message">`+message+`</div>
        </div>
    </div>`
    
}

function hide_loading(){
    document.querySelector(".loading_panel").remove();
    document.querySelector(".hook").style.height = "0%";
}


function show_message(message){
    if (message == undefined){
        message = "Message"
    }

    if (document.querySelector(".show-message"))
        document.querySelector(".show-message").remove();

    document.querySelector(".hook").style.height = "20%";

    document.querySelector(".hook").innerHTML+=`
    <div class="show-message">
        <div>`+message+`</div>
    </div>`

    setTimeout(() => {
        document.querySelector(".show-message").style.top = "50px"
        document.querySelector(".show-message").style.opacity = "1"
    }, 10);

    setTimeout(() => {hide_message()},1000)
    
}

function hide_message(){
    document.querySelector(".show-message").style.top = "20px"
    document.querySelector(".show-message").style.opacity = "0"
    setTimeout(() => {
        document.querySelector(".hook").style.height = "0%";
        document.querySelector(".show-message").remove();
    }, 200);
}


function getImageBase64(filename, targetElement) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL+"?action=getImage&name="+filename, true);
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // 假設 API 回傳的是完整的 <img src="data:image/png;base64,..."> 標籤字串
        const imgSrc = xhr.responseText;
  
        // 寫入真正的 img 標籤中
        targetElement.src = imgSrc;
      }
    };
  
    xhr.send();
}



function formatUsingIntl(isoString) {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('zh-HK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Asia/Hong_Kong'
    });
  
    return formatter.format(date).replace(/(\d{4})-(\d{2})-(\d{2}),?/, '$1/$2/$3');
}




document.getElementsByName("my-bnt")[0].addEventListener("click",()=>{
    window.location.href = './user.html';
});
document.getElementsByName("home-bnt")[0].addEventListener("click",()=>{
    window.location.href = './homepage.html';
});
document.getElementsByName("newaccounting-bnt")[0].addEventListener("click",()=>{
    window.location.href = './addRecord.html';
});

document.documentElement.addEventListener( 'touchstart',  function (event) {
if (event.touches.length > 1) {
event.preventDefault();
}
},  false);

var lastTouchEnd = 0;
document.documentElement.addEventListener( 'touchend',  function (event) {
var now = Date.now();
if (now - lastTouchEnd <= 300) {
event.preventDefault();
}
lastTouchEnd = now;
},  false);