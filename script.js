let tankLevel = 72;
let pumpOn = false;

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

function togglePump() {
  pumpOn = !pumpOn;
  const btn = document.getElementById('pumpBtn');
  btn.textContent = pumpOn ? 'Pump: ON' : 'Pump: OFF';
  btn.classList.toggle('on', pumpOn);
}

function updateUI() {
  document.getElementById('tankPercent').textContent = tankLevel + '%';

  const status = document.getElementById('statusText');
  const studentText = document.getElementById('studentText');
  const studentFace = document.getElementById('studentStatus');

  if (tankLevel > 30) {
    status.textContent = 'Stable';
    studentText.textContent = 'WATER GOOD';
    studentFace.textContent = '😊';
  } else if (tankLevel > 10) {
    status.textContent = 'Low';
    studentText.textContent = 'WATER FAIR';
    studentFace.textContent = '😐';
  } else {
    status.textContent = 'Critical';
    studentText.textContent = 'WATER LOW';
    studentFace.textContent = '☹️';
  }
}

setInterval(() => {
  const hour = new Date().getHours();
  const nightLock = document.getElementById('nightLock').checked;
  const autoCut = document.getElementById('autoCut').checked;

  if (nightLock && (hour >= 23 || hour < 5)) {
    pumpOn = false;
    document.getElementById('pumpBtn').classList.remove('on');
    document.getElementById('pumpBtn').textContent = 'Pump: OFF';
  }

  let change = -0.1;
  if (pumpOn) change += 0.6;

  tankLevel += change;

  if (autoCut && tankLevel >= 98) {
    tankLevel = 98;
    pumpOn = false;
  }

  tankLevel = Math.max(0, Math.min(100, Math.round(tankLevel)));
  updateUI();
}, 1000);

updateUI();
