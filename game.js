let yen = 0;
let clickPower = 1;
let autoRate = 0;
let clickPrice = 50;
let autoPrice = 120;
let polloPurchased = false;
let autoStarted = false;
let gameLoaded = false;

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
        autoStarted: autoStarted
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
        
        priceClickDisplay.textContent = `${clickPrice.toLocaleString()} ¥`;
        priceAutoDisplay.textContent = `${autoPrice.toLocaleString()} ¥`;
        
        if (polloPurchased) {
            document.getElementById('pollo-side').classList.add('unlocked');
            document.getElementById('upgrade-pollo').classList.add('hidden');
        }
        
        if (autoStarted) {
            startAutoClick();
        }
        
        gameLoaded = true;
    }
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
    saveGame();
}

function updateCardStates() {
    const clickCard = document.getElementById('upgrade-click');
    const autoCard = document.getElementById('upgrade-auto');
    const polloCard = document.getElementById('upgrade-pollo');
    
    clickCard.classList.toggle('disabled', yen < clickPrice);
    autoCard.classList.toggle('disabled', yen < autoPrice);
    if (!polloPurchased) {
        polloCard.classList.toggle('disabled', yen < 300);
    }
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
