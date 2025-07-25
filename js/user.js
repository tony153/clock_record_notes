
const apiInput = document.getElementById('api');
const updateBtn = document.getElementById('updateBtn');

// 🚀 啟動時檢查 localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedApi = localStorage.getItem(STORAGE_KEY);
  if (savedApi) {
    apiInput.value = savedApi;
  }
});
// 🔄 點擊「更新」按鈕後儲存新 API
updateBtn.addEventListener('click', () => {
  const newApi = apiInput.value.trim();
  if (!newApi) {
    alert('請輸入有效的 API');
    return;
  }
  localStorage.setItem(STORAGE_KEY, newApi);
  alert('API 已更新並儲存 ✅');
  API_URL = newApi; // 更新全域變數 API_URL
  console.log('📝 新的 API:', newApi);
});