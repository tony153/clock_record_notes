
const apiInput = document.getElementById('api');
const Image_compression_rateInput = document.getElementById('Image_compression_rate');
const updateBtn = document.getElementById('updateBtn');

// 🚀 啟動時檢查 localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedApi = localStorage.getItem(STORAGE_KEY);
  if (savedApi) {
    apiInput.value = savedApi;
  }
  const savedImage_compression_rate = localStorage.getItem(STORAGE_KEY_Image_compression_rate);
  if (savedImage_compression_rate) {
    Image_compression_rateInput.value = savedImage_compression_rate;
  }
});

// 🔄 點擊「更新」按鈕後儲存新 API
updateBtn.addEventListener('click', () => {
  const newApi = apiInput.value.trim();
  const newImage_compression_rate = Image_compression_rateInput.value.trim();
  if (!newApi) {
    alert('請輸入有效的 API');
    return;
  }
  if (newImage_compression_rate === '') {
    alert('請輸入圖片壓縮率');
    return;
  }
  localStorage.setItem(STORAGE_KEY, newApi);
  //alert('API 已更新並儲存 ✅');
  console.log('📝 新的 API:', newApi);

  localStorage.setItem(STORAGE_KEY_Image_compression_rate, newImage_compression_rate);
  //alert('圖片壓縮率已更新並儲存 ✅');
  console.log('📝 新的圖片壓縮率:', newImage_compression_rate);

  show_message("設定已更新");



});