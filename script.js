// GØKÛ 悟 (@gokurlss) Bio Link Interaction & Particle Engine

document.addEventListener('DOMContentLoaded', () => {
  initEmbers();
  initDiscordCopy();
  initShare();
  initAudioFeedback();
});

/* ----------------------------------------------------
   1. Subtle Web Audio Feedback (Zero External Assets)
   ---------------------------------------------------- */
let audioCtx = null;

function playFuturisticClick(type = 'click') {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'copy') {
      // Golden chime for copying
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Crisp subtle tactile tick
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    // Audio optional, fail silently
  }
}

/* ----------------------------------------------------
   2. Discord Copy & Launch Logic
   ---------------------------------------------------- */
function initDiscordCopy() {
  const discordCard = document.getElementById('discordCard');
  const copyBtn = document.getElementById('copyDiscordBtn');
  const discordUsername = 'prokiller_151';

  async function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();

    playFuturisticClick('copy');
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(discordUsername);
        copied = true;
      }
    } catch (err) {
      copied = false;
    }

    if (!copied) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = discordUsername;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        copied = document.execCommand('copy');
      } catch (err) {
        copied = false;
      }
      document.body.removeChild(textArea);
    }

    if (copied) {
      showToast(`Copied "${discordUsername}" to clipboard!`);
      if (copyBtn) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="btn-label">COPIED</span>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span class="btn-label">COPY</span>';
        }, 2200);
      }
    } else {
      showToast(`Username: ${discordUsername}`);
    }

    // Attempt to open Discord after small delay
    setTimeout(() => {
      // Open Discord web app or desktop protocol
      window.open('https://discord.com/app', '_blank');
    }, 600);
  }

  if (discordCard) discordCard.addEventListener('click', handleCopy);
  if (copyBtn) copyBtn.addEventListener('click', handleCopy);
}

/* ----------------------------------------------------
   3. Share Feature
   ---------------------------------------------------- */
function initShare() {
  const shareBtn = document.getElementById('shareBtn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    playFuturisticClick('click');
    const shareData = {
      title: 'GØKÛ 悟 | @gokurlss',
      text: 'Check out GØKÛ 悟 (@gokurlss) - 王者 👑 • 1764 MMR • SIDESWIPE',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        if (e.name !== 'AbortError') copyPageLink();
      }
    } else {
      copyPageLink();
    }
  });

  async function copyPageLink() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      showToast('Profile link copied to clipboard! 👑');
    } catch (e) {
      showToast('URL: ' + window.location.href);
    }
  }
}

/* ----------------------------------------------------
   4. Toast Notification
   ---------------------------------------------------- */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* ----------------------------------------------------
   5. Interactive Link Click Audio
   ---------------------------------------------------- */
function initAudioFeedback() {
  const linkCards = document.querySelectorAll('.link-card:not(#discordCard)');
  linkCards.forEach(card => {
    card.addEventListener('click', () => {
      playFuturisticClick('click');
      if (navigator.vibrate) navigator.vibrate(10);
    });
  });
}

/* ----------------------------------------------------
   6. Golden Ember Particle Canvas Engine
   ---------------------------------------------------- */
function initEmbers() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const emberCount = Math.min(45, Math.floor(width / 25));
  const embers = [];

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.maxAlpha = this.alpha;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.hue = 40 + Math.random() * 15; // 40-55: pure gold to amber
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.3;
      this.alpha -= this.fadeSpeed;

      if (this.y < -10 || this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${Math.max(0, this.alpha)})`;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.8)`;
      ctx.shadowBlur = this.size * 4;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < emberCount; i++) {
    embers.push(new Ember());
  }

  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(loop);
  });

  function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
