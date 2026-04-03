let yen = 0;
let clickPower = 1;
let autoRate = 0;
let clickPrice = 50;
let autoPrice = 120;
let polloPurchased = false;
let autoStarted = false;
let gameLoaded = false;

let click2Price = 500;
let auto2Price = 1000;
let boostPrice = 2500;
let achievements = {
    ach100: false,
    ach1000: false,
    ach10000: false,
    ach100000: false,
    achMillon: false
};

const yenDisplay = document.getElementById('yen-display');
const clickPowerDisplay = document.getElementById('click-power');
const autoRateDisplay = document.getElementById('auto-rate');
const priceClickDisplay = document.getElementById('price-click');
const priceAutoDisplay = document.getElementById('price-auto');
const clickArea = document.getElementById('click-area');
const particlesContainer = document.getElementById('particles');

function saveGame() {
    const gameData = {
        yen: yen,
        clickPower: clickPower,
        autoRate: autoRate,
        clickPrice: clickPrice,
        autoPrice: autoPrice,
        polloPurchased: polloPurchased,
        autoStarted: autoStarted,
        click2Price: click2Price,
        auto2Price: auto2Price,
        boostPrice: boostPrice,
        achievements: achievements
    };
    localStorage.setItem('tomiokaClickerSave', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('tomiokaClickerSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        yen = data.yen || 0;
        clickPower = data.clickPower || 1;
        autoRate = data.autoRate || 0;
        clickPrice = data.clickPrice || 50;
        autoPrice = data.autoPrice || 120;
        polloPurchased = data.polloPurchased || false;
        autoStarted = data.autoStarted || false;
        click2Price = data.click2Price || 500;
        auto2Price = data.auto2Price || 1000;
        boostPrice = data.boostPrice || 2500;
        achievements = data.achievements || achievements;
        
        priceClickDisplay.textContent = `${clickPrice.toLocaleString()} ¥`;
        priceAutoDisplay.textContent = `${autoPrice.toLocaleString()} ¥`;
        
        if (document.getElementById('price-click2')) {
            document.getElementById('price-click2').textContent = `${click2Price.toLocaleString()} ¥`;
        }
        if (document.getElementById('price-auto2')) {
            document.getElementById('price-auto2').textContent = `${auto2Price.toLocaleString()} ¥`;
        }
        if (document.getElementById('price-boost')) {
            document.getElementById('price-boost').textContent = `${boostPrice.toLocaleString()} ¥`;
        }
        
        if (polloPurchased) {
            document.getElementById('pollo-side').classList.add('unlocked');
            document.getElementById('upgrade-pollo').classList.add('hidden');
        }
        
        if (autoStarted) {
            startAutoClick();
        }
        
        loadAchievements();
        
        gameLoaded = true;
    }
}

function loadAchievements() {
    if (achievements.ach100) document.getElementById('ach-100').classList.add('unlocked');
    if (achievements.ach1000) document.getElementById('ach-1000').classList.add('unlocked');
    if (achievements.ach10000) document.getElementById('ach-10000').classList.add('unlocked');
    if (achievements.ach100000) document.getElementById('ach-100000').classList.add('unlocked');
    if (achievements.achMillon) document.getElementById('ach-millon').classList.add('unlocked');
}

function checkAchievements() {
    if (yen >= 100 && !achievements.ach100) {
        achievements.ach100 = true;
        document.getElementById('ach-100').classList.add('unlocked');
        showAchievementToast('💯 ¡Primer objetivo alcanzado! 100 Yenes');
    }
    if (yen >= 1000 && !achievements.ach1000) {
        achievements.ach1000 = true;
        document.getElementById('ach-1000').classList.add('unlocked');
        showAchievementToast('🧧 ¡Milenario! 1,000 Yenes');
    }
    if (yen >= 10000 && !achievements.ach10000) {
        achievements.ach10000 = true;
        document.getElementById('ach-10000').classList.add('unlocked');
        showAchievementToast('💰 ¡Imparable! 10,000 Yenes');
    }
    if (yen >= 100000 && !achievements.ach100000) {
        achievements.ach100000 = true;
        document.getElementById('ach-100000').classList.add('unlocked');
        showAchievementToast('👑 ¡Maestro Clicker! 100,000 Yenes');
    }
    if (yen >= 1000000 && !achievements.achMillon) {
        achievements.achMillon = true;
        document.getElementById('ach-millon').classList.add('unlocked');
        showAchievementToast('🏆 ¡LEYENDA! 1 Millón de Yenes');
    }
}

function showAchievementToast(message) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function createParticles() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }
    
    setInterval(() => {
        createParticle();
    }, 300);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 5;
    
    const isBubble = Math.random() > 0.6;
    
    if (isBubble) {
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            background: radial-gradient(circle at 30% 30%, 
                rgba(150, 230, 255, 0.9), 
                rgba(0, 180, 255, 0.4));
            box-shadow: 0 0 ${size * 2}px rgba(0, 200, 255, 0.6);
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
    } else {
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            background: radial-gradient(circle, 
                rgba(0, 255, 255, 0.9), 
                rgba(0, 150, 255, 0.3));
            box-shadow: 0 0 ${size * 3}px rgba(0, 255, 255, 0.5);
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
    }
    
    particlesContainer.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

function updateDisplay() {
    yenDisplay.textContent = Math.floor(yen).toLocaleString();
    clickPowerDisplay.textContent = clickPower;
    autoRateDisplay.textContent = autoRate;
    
    updateCardStates();
    checkAchievements();
    saveGame();
}

function updateCardStates() {
    const clickCard = document.getElementById('upgrade-click');
    const autoCard = document.getElementById('upgrade-auto');
    const polloCard = document.getElementById('upgrade-pollo');
    const click2Card = document.getElementById('upgrade-click2');
    const auto2Card = document.getElementById('upgrade-auto2');
    const boostCard = document.getElementById('upgrade-boost');
    
    clickCard.classList.toggle('disabled', yen < clickPrice);
    autoCard.classList.toggle('disabled', yen < autoPrice);
    if (!polloPurchased) {
        polloCard.classList.toggle('disabled', yen < 300);
    }
    if (click2Card) click2Card.classList.toggle('disabled', yen < click2Price);
    if (auto2Card) auto2Card.classList.toggle('disabled', yen < auto2Price);
    if (boostCard) boostCard.classList.toggle('disabled', yen < boostPrice);
}

function clickTomioka(e) {
    yen += clickPower;
    updateDisplay();
    
    const rect = clickArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    showClickEffect(x, y);
}

function showClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${clickPower}`;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    clickArea.appendChild(effect);
    
    setTimeout(() => effect.remove(), 800);
}

function buyUpgrade(type) {
    if (type === 'click') {
        if (yen >= clickPrice) {
            yen -= clickPrice;
            clickPower *= 2;
            clickPrice *= 2;
            priceClickDisplay.textContent = `${clickPrice.toLocaleString()} ¥`;
            updateDisplay();
        }
    } else if (type === 'auto') {
        if (yen >= autoPrice) {
            yen -= autoPrice;
            if (!autoStarted) {
                autoRate = 1;
                autoStarted = true;
                startAutoClick();
            } else {
                autoRate *= 2;
            }
            autoPrice *= 2;
            priceAutoDisplay.textContent = `${autoPrice.toLocaleString()} ¥`;
            updateDisplay();
        }
    } else if (type === 'pollo') {
        if (!polloPurchased && yen >= 300) {
            yen -= 300;
            polloPurchased = true;
            document.getElementById('pollo-side').classList.add('unlocked');
            document.getElementById('upgrade-pollo').classList.add('hidden');
            clickPower += 5;
            updateDisplay();
        }
    } else if (type === 'click2') {
        if (yen >= click2Price) {
            yen -= click2Price;
            clickPower *= 3;
            click2Price *= 3;
            document.getElementById('price-click2').textContent = `${click2Price.toLocaleString()} ¥`;
            updateDisplay();
        }
    } else if (type === 'auto2') {
        if (yen >= auto2Price) {
            yen -= auto2Price;
            autoRate *= 3;
            auto2Price *= 3;
            document.getElementById('price-auto2').textContent = `${auto2Price.toLocaleString()} ¥`;
            updateDisplay();
        }
    } else if (type === 'boost') {
        if (yen >= boostPrice) {
            yen -= boostPrice;
            clickPower += 50;
            boostPrice *= 2;
            document.getElementById('price-boost').textContent = `${boostPrice.toLocaleString()} ¥`;
            updateDisplay();
        }
    }
}

function startAutoClick() {
    setInterval(() => {
        if (autoRate > 0) {
            yen += autoRate;
            updateDisplay();
        }
    }, 1000);
}

clickArea.addEventListener('click', clickTomioka);

loadGame();
createParticles();
updateDisplay();
