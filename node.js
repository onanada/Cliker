// Основные переменные игры
let coins = 0;
let totalClicks = 0;
let coinsPerSecond = 0;
let clickPower = 1;
let prestigeMultiplier = 1;
let prestigePoints = 0;

// Улучшения
const upgrades = {
    auto: [
        {
            id: 'auto1',
            name: 'Космический зонд',
            description: 'Собирает монеты из космоса',
            baseCost: 10,
            basePower: 0.1,
            level: 0,
            maxLevel: 100,
            icon: '🛰️'
        },
        {
            id: 'auto2',
            name: 'Робот-шахтер',
            description: 'Добывает астероиды',
            baseCost: 50,
            basePower: 0.5,
            level: 0,
            maxLevel: 50,
            icon: '🤖'
        },
        {
            id: 'auto3',
            name: 'Космическая станция',
            description: 'Производит монеты в больших масштабах',
            baseCost: 100,
            basePower: 2,
            level: 0,
            maxLevel: 25,
            icon: '🛸'
        },
        {
            id: 'auto4',
            name: 'Галактический завод',
            description: 'Массовое производство монет',
            baseCost: 500,
            basePower: 10,
            level: 0,
            maxLevel: 10,
            icon: '🏭'
        }
    ],
    click: [
        {
            id: 'click1',
            name: 'Усиленные перчатки',
            description: 'Увеличивает силу клика',
            baseCost: 15,
            basePower: 1,
            level: 0,
            maxLevel: 20,
            icon: '🧤'
        },
        {
            id: 'click2',
            name: 'Квантовый усилитель',
            description: 'Умножает силу клика',
            baseCost: 100,
            basePower: 2,
            level: 0,
            maxLevel: 10,
            icon: '⚛️'
        },
        {
            id: 'click3',
            name: 'Космический молот',
            description: 'Мощные удары по астероидам',
            baseCost: 500,
            basePower: 5,
            level: 0,
            maxLevel: 5,
            icon: '🔨'
        }
    ]
};

// Достижения
const achievements = [
    {
        id: 'ach1',
        name: 'Первые шаги',
        description: 'Сделать 10 кликов',
        icon: '👣',
        condition: () => totalClicks >= 10,
        unlocked: false,
        reward: 10
    },
    {
        id: 'ach2',
        name: 'Начинающий магнат',
        description: 'Заработать 100 монет',
        icon: '💰',
        condition: () => coins >= 100,
        unlocked: false,
        reward: 20
    },
    {
        id: 'ach3',
        name: 'Автоматизация',
        description: 'Купить первое автоматическое улучшение',
        icon: '⚙️',
        condition: () => upgrades.auto.some(u => u.level > 0),
        unlocked: false,
        reward: 30
    },
    {
        id: 'ach4',
        name: 'Кликер-профи',
        description: 'Сделать 1000 кликов',
        icon: '🏆',
        condition: () => totalClicks >= 1000,
        unlocked: false,
        reward: 50
    },
    {
        id: 'ach5',
        name: 'Космический богач',
        description: 'Заработать 10,000 монет',
        icon: '🪙',
        condition: () => coins >= 10000,
        unlocked: false,
        reward: 100
    },
    {
        id: 'ach6',
        name: 'Мастер улучшений',
        description: 'Максимально улучшить что-либо',
        icon: '🎯',
        condition: () => [...upgrades.auto, ...upgrades.click].some(u => u.level === u.maxLevel),
        unlocked: false,
        reward: 150
    }
];

// DOM элементы
const coinsDisplay = document.getElementById('coins');
const clicksDisplay = document.getElementById('clicks');
const cpsDisplay = document.getElementById('cps');
const clickPowerDisplay = document.getElementById('click-power');
const clickerBtn = document.getElementById('clicker');
const autoUpgradesContainer = document.getElementById('auto-upgrades');
const clickUpgradesContainer = document.getElementById('click-upgrades');
const achievementsList = document.getElementById('achievements-list');
const prestigeMultiplierDisplay = document.getElementById('prestige-multiplier');
const prestigePointsDisplay = document.getElementById('prestige-points');
const prestigeBtn = document.getElementById('prestige-btn');
const notificationsContainer = document.getElementById('notifications');

// Инициализация игры
function initGame() {
    loadGame();
    renderUpgrades();
    renderAchievements();
    updateDisplays();
    setupEventListeners();
    startGameLoop();
}

// Загрузка сохраненной игры
function loadGame() {
    const savedGame = localStorage.getItem('cosmicClickerSave');
    if (savedGame) {
        const data = JSON.parse(savedGame);
        coins = data.coins || 0;
        totalClicks = data.totalClicks || 0;
        coinsPerSecond = data.coinsPerSecond || 0;
        clickPower = data.clickPower || 1;
        prestigeMultiplier = data.prestigeMultiplier || 1;
        prestigePoints = data.prestigePoints || 0;
        
        // Загрузка улучшений
        if (data.upgrades) {
            for (const category in upgrades) {
                upgrades[category].forEach(upgrade => {
                    const savedUpgrade = data.upgrades[category]?.find(u => u.id === upgrade.id);
                    if (savedUpgrade) {
                        upgrade.level = savedUpgrade.level;
                    }
                });
            }
        }
        
        // Загрузка достижений
        if (data.achievements) {
            achievements.forEach(achievement => {
                const savedAchievement = data.achievements.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
        
        showNotification('Игра загружена!', 'success');
    }
}

// Сохранение игры
function saveGame() {
    const gameData = {
        coins,
        totalClicks,
        coinsPerSecond,
        clickPower,
        prestigeMultiplier,
        prestigePoints,
        upgrades: {
            auto: upgrades.auto.map(u => ({ id: u.id, level: u.level })),
            click: upgrades.click.map(u => ({ id: u.id, level: u.level }))
        },
        achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
    };
    
    localStorage.setItem('cosmicClickerSave', JSON.stringify(gameData));
}

// Обновление отображения
function updateDisplays() {
    coinsDisplay.textContent = Math.floor(coins).toLocaleString();
    clicksDisplay.textContent = totalClicks.toLocaleString();
    cpsDisplay.textContent = (coinsPerSecond * prestigeMultiplier).toFixed(1);
    clickPowerDisplay.textContent = `+${(clickPower * prestigeMultiplier).toFixed(1)}`;
    prestigeMultiplierDisplay.textContent = `${prestigeMultiplier.toFixed(1)}x`;
    prestigePointsDisplay.textContent = prestigePoints.toLocaleString();
    
    // Проверка престижа
    if (coins >= 100000 && !prestigeBtn.disabled) {
        prestigeBtn.disabled = false;
        prestigeBtn.textContent = `Престиж (${Math.floor(Math.sqrt(coins / 10000))} звезд)`;
    }
}

// Рендер улучшений
function renderUpgrades() {
    autoUpgradesContainer.innerHTML = '';
    clickUpgradesContainer.innerHTML = '';
    
    // Автоматические улучшения
    upgrades.auto.forEach(upgrade => {
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
        const power = upgrade.basePower * (upgrade.level + 1);
        
        const upgradeEl = document.createElement('div');
        upgradeEl.className = `upgrade-item ${upgrade.level > 0 ? 'unlocked' : ''} ${upgrade.level === upgrade.maxLevel ? 'maxed' : ''}`;
        upgradeEl.innerHTML = `
            <div class="upgrade-header">
                <span class="upgrade-name">${upgrade.icon} ${upgrade.name}</span>
                <span class="upgrade-level">Ур. ${upgrade.level}/${upgrade.maxLevel}</span>
            </div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-footer">
                <span class="upgrade-cost">${cost.toLocaleString()} монет</span>
                <button class="upgrade-btn" data-id="${upgrade.id}" ${coins < cost || upgrade.level >= upgrade.maxLevel ? 'disabled' : ''}>
                    ${upgrade.level === 0 ? 'Купить' : 'Улучшить'}
                </button>
            </div>
        `;
        
        autoUpgradesContainer.appendChild(upgradeEl);
    });
    
    // Улучшения клика
    upgrades.click.forEach(upgrade => {
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.2, upgrade.level));
        const power = upgrade.basePower;
        
        const upgradeEl = document.createElement('div');
        upgradeEl.className = `upgrade-item ${upgrade.level > 0 ? 'unlocked' : ''} ${upgrade.level === upgrade.maxLevel ? 'maxed' : ''}`;
        upgradeEl.innerHTML = `
            <div class="upgrade-header">
                <span class="upgrade-name">${upgrade.icon} ${upgrade.name}</span>
                <span class="upgrade-level">Ур. ${upgrade.level}/${upgrade.maxLevel}</span>
            </div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-footer">
                <span class="upgrade-cost">${cost.toLocaleString()} монет</span>
                <button class="upgrade-btn" data-id="${upgrade.id}" ${coins < cost || upgrade.level >= upgrade.maxLevel ? 'disabled' : ''}>
                    ${upgrade.level === 0 ? 'Купить' : 'Улучшить'}
                </button>
            </div>
        `;
        
        clickUpgradesContainer.appendChild(upgradeEl);
    });
}

// Рендер достижений
function renderAchievements() {
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
        achievementEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.unlocked ? '<div class="achievement-reward">+' + achievement.reward + ' монет</div>' : ''}
        `;
        
        achievementsList.appendChild(achievementEl);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Клик по основной кнопке
    clickerBtn.addEventListener('click', handleClick);
    
    // Клик по улучшениям
    document.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const upgradeId = this.getAttribute('data-id');
            buyUpgrade(upgradeId);
        });
    });
    
    // Переключение вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Престиж
    prestigeBtn.addEventListener('click', performPrestige);
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGame, 10000);
}

// Обработка клика
function handleClick(e) {
    // Позиция клика для эффекта
    const rect = clickerBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Создаем эффект клика
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${x - 25}px`;
    effect.style.top = `${y - 25}px`;
    clickerBtn.appendChild(effect);
    
    // Удаляем эффект после анимации
    setTimeout(() => {
        effect.remove();
    }, 500);
    
    // Добавляем монеты
    coins += clickPower * prestigeMultiplier;
    totalClicks++;
    
    // Обновляем отображение
    updateDisplays();
    checkAchievements();
    
    // Небольшая анимация кнопки
    clickerBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickerBtn.style.transform = 'scale(1)';
    }, 100);
}

// Покупка улучшения
function buyUpgrade(upgradeId) {
    // Находим улучшение
    let upgrade;
    let category;
    
    for (const cat in upgrades) {
        const found = upgrades[cat].find(u => u.id === upgradeId);
        if (found) {
            upgrade = found;
            category = cat;
            break;
        }
    }
    
    if (!upgrade) return;
    
    // Рассчитываем стоимость
    const cost = Math.floor(upgrade.baseCost * Math.pow(category === 'auto' ? 1.15 : 1.2, upgrade.level));
    
    // Проверяем, хватает ли денег
    if (coins >= cost && upgrade.level < upgrade.maxLevel) {
        coins -= cost;
        upgrade.level++;
        
        // Обновляем игровые параметры
        if (category === 'auto') {
            coinsPerSecond += upgrade.basePower * prestigeMultiplier;
        } else {
            clickPower += upgrade.basePower;
        }
        
        // Обновляем отображение
        updateDisplays();
        renderUpgrades();
        checkAchievements();
        
        showNotification(`${upgrade.name} улучшено до уровня ${upgrade.level}!`, 'success');
        
        // Сохраняем игру
        saveGame();
    }
}

// Проверка достижений
function checkAchievements() {
    let newAchievements = 0;
    
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            coins += achievement.reward;
            newAchievements++;
            
            showNotification(`Достижение: ${achievement.name}! +${achievement.reward} монет`, 'success');
        }
    });
    
    if (newAchievements > 0) {
        renderAchievements();
        updateDisplays();
    }
}

// Переключение вкладок
function switchTab(tabId) {
    // Обновляем активные кнопки
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    // Обновляем активные вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.toggle('active', tab.id === tabId);
    });
}

// Престиж
function performPrestige() {
    if (coins < 100000) return;
    
    const pointsGained = Math.floor(Math.sqrt(coins / 10000));
    prestigePoints += pointsGained;
    prestigeMultiplier = 1 + (prestigePoints * 0.1);
    
    // Сброс игры
    coins = 0;
    totalClicks = 0;
    coinsPerSecond = 0;
    clickPower = 1;
    
    // Сброс улучшений (но не достижений)
    for (const category in upgrades) {
        upgrades[category].forEach(upgrade => {
            upgrade.level = 0;
        });
    }
    
    // Обновление интерфейса
    updateDisplays();
    renderUpgrades();
    prestigeBtn.disabled = true;
    
    showNotification(`Престиж! Получено ${pointsGained} звезд. Множитель: ${prestigeMultiplier.toFixed(1)}x`, 'warning');
    
    // Сохранение
    saveGame();
}

// Игровой цикл
function startGameLoop() {
    setInterval(() => {
        coins += coinsPerSecond * prestigeMultiplier / 10;
        updateDisplays();
        checkAchievements();
    }, 100);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationsContainer.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Запуск игры при загрузке страницы
window.addEventListener('load', initGame);