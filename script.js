// 多語言支援
const translations = {
    'zh-TW': {
        'title': '拓元售票系統 - 系統維護中',
        'main.title': '系統繁忙中，請稍候重試',
        'main.status': '目前有大量用戶同時訪問，系統正在全力處理請求',
        'info.refresh_time': '自動刷新時間：',
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
        'refresh_time_suffix': '秒後',
        'minutes': '分鐘'
    },
    'zh-CN': {
        'title': '拓元售票系统 - 系统维护中',
        'main.title': '系统繁忙中，请稍候重试',
        'main.status': '目前有大量用户同时访问，系统正在全力处理请求',
        'info.refresh_time': '自动刷新时间：',
        'info.data_saved': '购票信息已暂存在系统',
        'info.customer_service': '在线客服：',
        'info.contact_service': '联系客服',
        'queue.title': '您目前的排队状态',
        'queue.people_ahead': '目前排队人数',
        'queue.estimated_time': '预估等待时间',
        'tips.title': '购票小提示',
        'tips.tip1': '请勿重复开启多个窗口，这会使您的排队顺序后置',
        'tips.tip2': '页面会自动刷新，请勿手动重新整理',
        'tips.tip3': '成功进入选位页后，您将有10分钟的选位时间',
        'notification.request': '开启桌面通知，当轮到您时会自动提醒',
        'notification.enable': '开启通知',
        'notification.your_turn': '轮到您了！',
        'notification.your_turn_body': '请立即返回购票页面完成购票',
        'network.online': '连线正常',
        'network.offline': '连线中断',
        'network.reconnecting': '重新连线中',
        'network.offline_warning': '⚠️ 网络连线中断，正在尝试重新连线...',
        'refresh_time_suffix': '秒后',
        'minutes': '分钟'
    },
    'en': {
        'title': 'TIXCRAFT Ticketing System - Under Maintenance',
        'main.title': 'System Busy, Please Wait',
        'main.status': 'High traffic detected, system is processing requests',
        'info.refresh_time': 'Auto refresh in: ',
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
        'refresh_time_suffix': 's',
        'minutes': 'min'
    }
};

let currentLang = 'zh-TW';
let countdownTime = 30;
let isOnline = navigator.onLine;
let progressValue = 0;

// 語言切換功能
function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // 更新頁面標題
    document.title = translations[lang]['title'];
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

// 倒數計時功能
function updateCountdown() {
    const refreshTimeElement = document.getElementById('refresh-time');
    if (refreshTimeElement) {
        const suffix = translations[currentLang]['refresh_time_suffix'];
        refreshTimeElement.textContent = countdownTime + suffix;
        countdownTime--;

        if (countdownTime < 0) {
            countdownTime = 30;
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
        const minutesText = translations[currentLang]['minutes'];
        animateNumber(waitTimeElement, waitMinutes + '-' + (waitMinutes + 5) + minutesText);

        // 當排隊人數很少時發送通知
        if (newCount < 500 && Notification.permission === 'granted') {
            showNotification(
                translations[currentLang]['notification.your_turn'],
                translations[currentLang]['notification.your_turn_body']
            );
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 設置語言切換事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
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

    // 初始化語言
    switchLanguage(currentLang);
});

// 設置定時器
setInterval(updateCountdown, 1000);
setInterval(updateQueueData, 8000);
setInterval(updateProgressBar, 3000);
setInterval(updateNetworkStatus, 5000);新按鈕狀態
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
});

// 更新所有翻譯文本
document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
        if (element.innerHTML.includes('<')) {
            // 處理包含HTML的元素
            const htmlParts = element.innerHTML.split(/(<[^>]*>)/);
            let translatedText = translations[lang][key];

            if (key === 'info.customer_service') {
                const linkText = translations[lang]['info.contact_service'];
                translatedText = translatedText + `<a href="https://help.tixcraft.com/hc/zh-tw/requests/new" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }

            element.innerHTML = translatedText;
        } else {
            element.textContent = translations[lang][key];
        }
    }
});

// 更