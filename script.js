// 多語言支援
const translations = {
    'zh-TW': {
        'title': '拓元售票系統 - 系統維護中',
        'main.title': '系統繁忙中，請稍候重試',
        'main.status': '目前有大量用戶同時訪問，系統正在全力處理請求',
        'info.data_saved': '購票資訊已暫存在系統',
        'info.customer_service': '線上客服：',
        'info.contact_service': '聯絡客服',
        'queue.title': '您目前的排隊狀態',
        'queue.people_ahead': '目前排隊人數',
        'queue.estimated_time': '預估等待時間',
        'tips.title': '購票小提示',
        'tips.tip1': '請勿重複開啟多個視窗，這會使您的排隊順序後置',
        'tips.tip2': '頁面會自動刷新，請勿手動重新整理',
        'tips.tip3': '成功進入選位頁後，您將有10分鐘的選位時間',
        'notification.request': '開啟桌面通知，當輪到您時會自動提醒',
        'notification.enable': '開啟通知',
        'notification.your_turn': '輪到您了！',
        'notification.your_turn_body': '請立即返回購票頁面完成購票',
        'network.online': '連線正常',
        'network.offline': '連線中斷',
        'network.reconnecting': '重新連線中',
        'network.offline_warning': '⚠️ 網路連線中斷，正在嘗試重新連線...',
        'minutes': '分鐘',
        'leave_warning': '⚠️ 警告：手動刷新將會失去您的排隊位置！\n建議您耐心等待，系統會自動為您處理排隊狀態。',
        'footer.copyright': '拓元售票系統 TIXCRAFT'
    },
    'en': {
        'title': 'TIXCRAFT Ticketing System - Under Maintenance',
        'main.title': 'System Busy, Please Wait',
        'main.status': 'High traffic detected, system is processing requests',
        'info.data_saved': 'Ticket info saved in system',
        'info.customer_service': 'Customer Service: ',
        'info.contact_service': 'Contact Support',
        'queue.title': 'Your Current Queue Status',
        'queue.people_ahead': 'People in Queue',
        'queue.estimated_time': 'Estimated Wait Time',
        'tips.title': 'Ticket Purchase Tips',
        'tips.tip1': 'Do not open multiple windows, this will move your position back',
        'tips.tip2': 'Page will auto-refresh, do not manually refresh',
        'tips.tip3': 'You will have 10 minutes to select seats after entering',
        'notification.request': 'Enable desktop notifications to be alerted when it\'s your turn',
        'notification.enable': 'Enable Notifications',
        'notification.your_turn': 'It\'s Your Turn!',
        'notification.your_turn_body': 'Please return to the ticketing page immediately',
        'network.online': 'Online',
        'network.offline': 'Offline',
        'network.reconnecting': 'Reconnecting',
        'network.offline_warning': '⚠️ Network connection lost, attempting to reconnect...',
        'minutes': 'min',
        'leave_warning': '⚠️ Warning: Manual refresh will cause you to lose your queue position!\nWe recommend waiting patiently as the system will automatically handle your queue status.',
        'footer.copyright': 'TIXCRAFT Ticketing System'
    }
};

let currentLang = 'zh-TW';
let isOnline = navigator.onLine;
let progressValue = 0;

// 語言切換功能
function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // 更新頁面標題
    document.title = translations[lang]['title'];

    // 更新語言按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 更新所有翻譯文本
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            // 特殊處理包含動態內容的元素
            if (key === 'info.customer_service') {
                // 處理客服連結
                const linkText = translations[lang]['info.contact_service'];
                element.innerHTML = translations[lang][key] + `<a href="https://help.tixcraft.com/hc/zh-tw/requests/new" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            } else {
                // 一般文本直接替換
                element.textContent = translations[lang][key];
            }
        }
    });

    // 更新網路狀態文字
    updateNetworkStatusText();

    // 更新排隊時間顯示
    updateQueueDataWithCurrentLanguage();
}

// 數字滾動動畫
function animateNumber(element, newValue) {
    element.classList.add('updating');
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('updating');
    }, 150);
}

// 平滑進度條更新
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressValue += Math.random() * 2 - 1; // 隨機波動
    progressValue = Math.max(60, Math.min(90, progressValue)); // 限制在60-90%之間

    if (progressBar) {
        progressBar.style.width = progressValue + '%';
    }
}

// 瀏覽器通知功能
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                document.getElementById('notification-permission').style.display = 'none';
                showNotification(
                    translations[currentLang]['notification.enable'],
                    '通知已開啟！'
                );
            }
        });
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: 'https://d1.awsstatic.com/Startups/partner%20logos/logos/(final)%E6%8B%93%E5%85%83logo(C-%E7%84%A1%E7%B6%B2%E5%9D%80).29aac2c991fb6c61d89ee66eb0da4c006b1f2495.gif',
            badge: 'https://d1.awsstatic.com/Startups/partner%20logos/logos/(final)%E6%8B%93%E5%85%83logo(C-%E7%84%A1%E7%B6%B2%E5%9D%80).29aac2c991fb6c61d89ee66eb0da4c006b1f2495.gif'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}

// 網路狀態檢測
function updateNetworkStatus() {
    const indicator = document.getElementById('network-indicator');
    const text = document.getElementById('network-text');
    const offlineWarning = document.getElementById('offline-warning');

    if (navigator.onLine) {
        if (!isOnline) {
            // 從離線恢復到線上
            indicator.className = 'network-indicator';
            text.textContent = translations[currentLang]['network.online'];
            offlineWarning.style.display = 'none';
            isOnline = true;
        }
    } else {
        // 離線狀態
        indicator.className = 'network-indicator offline';
        text.textContent = translations[currentLang]['network.offline'];
        offlineWarning.style.display = 'block';
        isOnline = false;
    }
}

// 單獨更新網路狀態文字（用於語言切換時）
function updateNetworkStatusText() {
    const text = document.getElementById('network-text');
    const offlineWarning = document.getElementById('offline-warning');

    if (text) {
        if (navigator.onLine) {
            text.textContent = translations[currentLang]['network.online'];
        } else {
            text.textContent = translations[currentLang]['network.offline'];
        }
    }

    if (offlineWarning) {
        const warningSpan = offlineWarning.querySelector('span[data-i18n="network.offline_warning"]');
        if (warningSpan) {
            warningSpan.textContent = translations[currentLang]['network.offline_warning'];
        }
    }
}

// 模擬動態更新排隊人數
function updateQueueData() {
    const queueCountElement = document.getElementById('queue-count');
    const waitTimeElement = document.getElementById('wait-time');

    if (queueCountElement && waitTimeElement) {
        let currentCount = parseInt(queueCountElement.textContent.replace(/,/g, ''));
        let newCount = Math.max(100, currentCount - Math.floor(Math.random() * 100) + 20);

        // 動畫更新數字
        animateNumber(queueCountElement, newCount.toLocaleString());

        let waitMinutes = Math.ceil(newCount / 300);
        // 確保翻譯數據存在
        if (translations[currentLang] && translations[currentLang]['minutes']) {
            const minutesText = translations[currentLang]['minutes'];
            animateNumber(waitTimeElement, waitMinutes + '-' + (waitMinutes + 5) + minutesText);
        }

        // 當排隊人數很少時發送通知
        if (newCount < 500 && Notification.permission === 'granted') {
            if (translations[currentLang] && translations[currentLang]['notification.your_turn']) {
                showNotification(
                    translations[currentLang]['notification.your_turn'],
                    translations[currentLang]['notification.your_turn_body']
                );
            }
        }
    }
}

// 更新排隊數據時使用當前語言（用於語言切換時立即更新）
function updateQueueDataWithCurrentLanguage() {
    const waitTimeElement = document.getElementById('wait-time');
    if (waitTimeElement) {
        const currentText = waitTimeElement.textContent;
        const numbers = currentText.match(/\d+-\d+/);
        if (numbers && translations[currentLang] && translations[currentLang]['minutes']) {
            const minutesText = translations[currentLang]['minutes'];
            waitTimeElement.textContent = numbers[0] + minutesText;
        }
    }
}

// 防止意外離開頁面
function setupPageExitWarning() {
    // 攔截所有離開/刷新事件（包括瀏覽器刷新按鈕）
    window.addEventListener('beforeunload', function(e) {
        // 現代瀏覽器會忽略自訂訊息，但這會觸發通用警告
        e.preventDefault();
        e.returnValue = '';
        return '';
    });

    // 攔截F5和Ctrl+R刷新 - 顯示自訂警告
    document.addEventListener('keydown', function(e) {
        console.log('按鍵事件:', e.key, e.ctrlKey, e.metaKey); // 調試用

        // F5鍵
        if (e.key === 'F5') {
            console.log('攔截到F5按鍵'); // 調試用
            e.preventDefault();
            e.stopPropagation();
            showCustomRefreshWarning();
            return false;
        }

        // Ctrl+R 或 Cmd+R
        if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
            console.log('攔截到Ctrl+R或Cmd+R'); // 調試用
            e.preventDefault();
            e.stopPropagation();
            showCustomRefreshWarning();
            return false;
        }
    }, true); // 使用捕獲階段確保優先處理

    console.log('刷新警告功能已設置');
}

// 顯示自訂刷新警告
function showCustomRefreshWarning() {
    // 創建自訂警告彈窗
    const modal = document.createElement('div');
    modal.className = 'refresh-warning-modal';

    const alertBox = document.createElement('div');
    alertBox.className = 'refresh-warning-box';

    const warningMessage = translations[currentLang]['leave_warning'];
    const confirmText = currentLang === 'zh-TW' ? '確定刷新' : 'Confirm Refresh';
    const cancelText = currentLang === 'zh-TW' ? '取消' : 'Cancel';
    const titleText = currentLang === 'zh-TW' ? '刷新警告' : 'Refresh Warning';

    alertBox.innerHTML = `
        <div class="refresh-warning-icon">⚠️</div>
        <h2 class="refresh-warning-title">${titleText}</h2>
        <p class="refresh-warning-message">${warningMessage}</p>
        <div class="refresh-warning-buttons">
            <button class="refresh-warning-btn confirm" id="confirmRefresh">${confirmText}</button>
            <button class="refresh-warning-btn cancel" id="cancelRefresh">${cancelText}</button>
        </div>
    `;

    modal.appendChild(alertBox);
    document.body.appendChild(modal);

    // 綁定按鈕事件
    document.getElementById('confirmRefresh').onclick = function() {
        document.body.removeChild(modal);
        window.location.reload();
    };

    document.getElementById('cancelRefresh').onclick = function() {
        document.body.removeChild(modal);
    };

    // 點擊背景關閉
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };

    // ESC鍵關閉
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面載入完成，開始初始化...');

    // 設置語言切換事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        console.log('綁定事件到按鈕:', btn.textContent, btn.dataset.lang);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('點擊語言按鈕:', btn.dataset.lang, '按鈕文字:', btn.textContent);
            switchLanguage(btn.dataset.lang);
        });
    });

    // 檢查通知權限
    if ('Notification' in window && Notification.permission === 'default') {
        document.getElementById('notification-permission').style.display = 'flex';
    }

    // 設置網路狀態監聽
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // 初始化進度條值
    progressValue = 75;

    // 初始化網路狀態
    updateNetworkStatus();

    // 初始化語言（確保正確設置初始狀態）
    console.log('初始化語言:', currentLang);
    switchLanguage(currentLang);

    // 設置防止意外離開 - 確保在最後設置
    setupPageExitWarning();
    console.log('防止離開功能已設置');

    console.log('初始化完成');
});

// 設置定時器（移除了刷新相關的定時器）
setInterval(updateQueueData, 8000);
setInterval(updateProgressBar, 3000);
setInterval(updateNetworkStatus, 5000);