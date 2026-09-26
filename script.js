// GØKÛ 悟 (@gokurlss) Bio Link Interaction Engine
// Ultra-Fast App Launcher, Instant Zero-Lag Copy, and Ember Particles

document.addEventListener('DOMContentLoaded', () => {
  initEmbers();
  initAppLinks();
  initDiscordCopy();
  initShare();
});

/* ----------------------------------------------------
   1. Fast Native App & Web Link Dispatcher
   ---------------------------------------------------- */
function initAppLinks() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const linkCards = document.querySelectorAll('.link-card:not(#discordCard)');

  linkCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();

      const webUrl = card.getAttribute('href');
      const appScheme = card.dataset.appScheme;
      const appAlt = card.dataset.appAlt;

      // Haptic and audio in background (non-blocking)
      playFuturisticClick('click');
      if (navigator.vibrate) navigator.vibrate(12);

      if (isMobile && appScheme) {
        let appLaunched = false;

        // If app opens, the browser tab/app becomes hidden
        const onVisibilityChange = () => {
          if (document.hidden) {
            appLaunched = true;
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

        // 1. Try launching primary app scheme
        window.location.href = appScheme;

        // 2. If alt scheme exists (e.g. TikTok snssdk1233), try secondary after brief tick
        if (appAlt) {
          setTimeout(() => {
            if (!appLaunched && !document.hidden) {
              window.location.href = appAlt;
            }
          }, 300);
        }

        // 3. Fallback to web URL if app is not installed
        setTimeout(() => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          if (!appLaunched && !document.hidden && webUrl) {
            window.location.href = webUrl;
          }
        }, 1100);

      } else {
        // Desktop or direct web link
        if (webUrl) {
          window.open(webUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });
}

/* ----------------------------------------------------
   2. Instant Discord Copy & App Launcher (0ms Delay)
   ---------------------------------------------------- */
function initDiscordCopy() {
  const discordCard = document.getElementById('discordCard');
  const copyBtn = document.getElementById('copyDiscordBtn');
  const discordUsername = 'prokiller_151';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  function executeInstantCopy(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // STEP 1: INSTANT UI FEEDBACK (Synchronous 0ms)
    showToast(`Copied "${discordUsername}" to clipboard! 🎮`);

    if (copyBtn) {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="btn-label">COPIED</span>';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span class="btn-label">COPY</span>';
      }, 2200);
    }

    // STEP 2: INSTANT CLIPBOARD WRITE
    copyTextFast(discordUsername);

    // STEP 3: ASYNC AUDIO & HAPTIC
    playFuturisticClick('copy');
    if (navigator.vibrate) navigator.vibrate([15, 30]);

    // STEP 4: OPEN DISCORD APP / WEB
    if (isMobile) {
      setTimeout(() => {
        window.location.href = 'discord://';
      }, 350);
    } else {
      setTimeout(() => {
        window.open('https://discord.com/app', '_blank', 'noopener,noreferrer');
      }, 250);
    }
  }

  if (discordCard) discordCard.addEventListener('click', executeInstantCopy);
  if (copyBtn) copyBtn.addEventListener('click', executeInstantCopy);
}

// Blazing fast synchronous-first clipboard copy
function copyTextFast(text) {
  // Synchronous DOM copy ensures instant execution within user gesture
  try {
    const input = document.createElement('input');
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.top = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(input);
  } catch (err) {}

  // Async API fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
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

  function copyPageLink() {
    copyTextFast(window.location.href);
    showToast('Profile link copied to clipboard! 👑');
  }
}

/* ----------------------------------------------------
   4. High-Performance Toast Notification
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
  }, 2200);
}

/* ----------------------------------------------------
   5. Non-Blocking Web Audio Feedback
   ---------------------------------------------------- */
let audioCtx = null;

function playFuturisticClick(type = 'click') {
  // Use setTimeout(..., 0) so audio never stalls UI thread or click events
  setTimeout(() => {
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      }
    } catch (e) {}
  }, 0);
}

/* ----------------------------------------------------
   6. Golden Ember Particle Canvas Engine (Lightweight)
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

  const emberCount = Math.min(40, Math.floor(width / 25));
  const embers = [];

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.0 + 0.6;
      this.speedY = Math.random() * 0.65 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.004 + 0.002;
      this.hue = 40 + Math.random() * 15;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.25;
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
      ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.7)`;
      ctx.shadowBlur = this.size * 3.5;
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
