let yen = 0;
let clickPower = 1;
let autoRate = 0;
let clickPrice = 50;
let autoPrice = 75;
let polloPurchased = false;
let tokitoPurchased = false;
let mcPurchased = false;
let rengokuPurchased = false;
let sabitoPurchased = false;
let waterDrops = 0;
let autoStarted = false;
let gameLoaded = false;

const yenDisplay = document.getElementById('yen-display');
const clickPowerDisplay = document.getElementById('click-power');
const autoRateDisplay = document.getElementById('auto-rate');
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
        tokitoPurchased: tokitoPurchased,
        mcPurchased: mcPurchased,
        rengokuPurchased: rengokuPurchased,
        sabitoPurchased: sabitoPurchased,
        waterDrops: waterDrops,
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
        autoPrice = data.autoPrice || 75;
        polloPurchased = data.polloPurchased || false;
        tokitoPurchased = data.tokitoPurchased || false;
        mcPurchased = data.mcPurchased || false;
        rengokuPurchased = data.rengokuPurchased || false;
        sabitoPurchased = data.sabitoPurchased || false;
        waterDrops = data.waterDrops || 0;
        autoStarted = data.autoStarted || false;
        
        if (document.getElementById('price-click')) {
            document.getElementById('price-click').textContent = `${clickPrice.toLocaleString()} ¥`;
        }
        if (document.getElementById('price-auto')) {
            document.getElementById('price-auto').textContent = `${autoPrice.toLocaleString()} ¥`;
        }
        
        if (polloPurchased) {
            document.getElementById('pollo-side').classList.add('unlocked');
            const shopPolloCard = document.getElementById('shop-pollo');
            if (shopPolloCard) shopPolloCard.style.display = 'none';
        }
        
        if (tokitoPurchased) {
            document.getElementById('tokito-side').classList.add('unlocked');
            const shopTokitoCard = document.getElementById('shop-tokito');
            if (shopTokitoCard) shopTokitoCard.style.display = 'none';
        }
        
        if (mcPurchased) {
            document.getElementById('mc-side').classList.add('unlocked');
            const shopMcCard = document.getElementById('shop-mc');
            if (shopMcCard) shopMcCard.style.display = 'none';
        }
        
        if (rengokuPurchased) {
            document.getElementById('rengoku-side').classList.add('unlocked');
            const shopRengokuCard = document.getElementById('shop-rengoku');
            if (shopRengokuCard) shopRengokuCard.classList.add('purchased');
        }
        
        if (sabitoPurchased) {
            document.getElementById('sabito-side').classList.add('unlocked');
            const shopSabitoCard = document.getElementById('shop-sabito');
            if (shopSabitoCard) shopSabitoCard.classList.add('purchased');
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
    
    const dropsDisplay = document.getElementById('shop-drops-display');
    if (dropsDisplay) dropsDisplay.textContent = waterDrops;
    
    updateCardStates();
    saveGame();
}

function updateCardStates() {
    const clickCard = document.getElementById('upgrade-click');
    const autoCard = document.getElementById('upgrade-auto');
    const shopClickCard = document.getElementById('shop-click');
    const shopAutoCard = document.getElementById('shop-auto');
    const shopPolloCard = document.getElementById('shop-pollo');
    const shopTokitoCard = document.getElementById('shop-tokito');
    const shopMcCard = document.getElementById('shop-mc');
    
    if (clickCard) clickCard.classList.toggle('disabled', yen < clickPrice);
    if (autoCard) autoCard.classList.toggle('disabled', yen < autoPrice);
    if (shopClickCard) shopClickCard.classList.toggle('disabled', yen < clickPrice);
    if (shopAutoCard) shopAutoCard.classList.toggle('disabled', yen < autoPrice);
    if (!polloPurchased && shopPolloCard) {
        shopPolloCard.classList.toggle('disabled', yen < 300);
    }
    if (!tokitoPurchased && shopTokitoCard) {
        shopTokitoCard.classList.toggle('disabled', yen < 2000);
    }
    if (!mcPurchased && shopMcCard) {
        shopMcCard.classList.toggle('disabled', yen < 10000);
    }
    
    const shopRengokuCard = document.getElementById('shop-rengoku');
    const shopSabitoCard = document.getElementById('shop-sabito');
    
    if (shopRengokuCard) {
        if (rengokuPurchased) {
            shopRengokuCard.classList.add('purchased');
        } else {
            shopRengokuCard.classList.toggle('disabled', waterDrops < 5);
        }
    }
    if (shopSabitoCard) {
        if (sabitoPurchased) {
            shopSabitoCard.classList.add('purchased');
        } else {
            shopSabitoCard.classList.toggle('disabled', waterDrops < 10);
        }
    }
}

function clickTomioka(e) {
    yen += clickPower;
    waterDrops += 1;
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
            document.getElementById('price-click').textContent = `${clickPrice.toLocaleString()} ¥`;
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
            document.getElementById('price-auto').textContent = `${autoPrice.toLocaleString()} ¥`;
            updateDisplay();
        }
    } else if (type === 'pollo') {
        if (!polloPurchased && yen >= 300) {
            yen -= 300;
            polloPurchased = true;
            document.getElementById('pollo-side').classList.add('unlocked');
            const shopPolloCard = document.getElementById('shop-pollo');
            if (shopPolloCard) shopPolloCard.style.display = 'none';
            clickPower += 5;
            updateDisplay();
        }
    } else if (type === 'tokito') {
        if (!tokitoPurchased && yen >= 2000) {
            yen -= 2000;
            tokitoPurchased = true;
            document.getElementById('tokito-side').classList.add('unlocked');
            const shopTokitoCard = document.getElementById('shop-tokito');
            if (shopTokitoCard) shopTokitoCard.style.display = 'none';
            autoRate += 10;
            updateDisplay();
        }
    } else if (type === 'mc') {
        if (!mcPurchased && yen >= 10000) {
            yen -= 10000;
            mcPurchased = true;
            document.getElementById('mc-side').classList.add('unlocked');
            const shopMcCard = document.getElementById('shop-mc');
            if (shopMcCard) shopMcCard.style.display = 'none';
            clickPower += 20;
            updateDisplay();
        }
    } else if (type === 'rengoku') {
        if (!rengokuPurchased && waterDrops >= 5) {
            waterDrops -= 5;
            rengokuPurchased = true;
            document.getElementById('rengoku-side').classList.add('unlocked');
            autoRate += 50;
            updateDisplay();
        }
    } else if (type === 'sabito') {
        if (!sabitoPurchased && waterDrops >= 10) {
            waterDrops -= 10;
            sabitoPurchased = true;
            document.getElementById('sabito-side').classList.add('unlocked');
            clickPower *= 3;
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
