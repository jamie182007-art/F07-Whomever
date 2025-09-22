// assets/js/script.js
(function(){
  const splash = document.getElementById('splash');
  // 如果你沒有給 body id="home"，會 fallback 到 .main-banner，再不行就 body
  const home   = document.getElementById('home') 
              || document.querySelector('.main-banner') 
              || document.body;

  // 讀 CSS 變數；失敗時用預設
  const LOGO_MS = msFromCSSVar('--logo-duration') || 1200;
  const DOOR_MS = msFromCSSVar('--door-duration') || 600;

  // 超時後自動進站（避免卡住）
  const AUTO_OPEN_AFTER = 3000; // 3秒可調

  let hasEntered = false;

  if (!splash) {
    console.error('[Splash] 沒找到 #splash，跳過動畫。');
    return;
  }

  // 點擊 / 鍵盤立即開門（fast = true）
  splash.addEventListener('click', () => startSequence(true));
  splash.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      startSequence(true);
    }
    if(e.key === 'Escape'){ // 允許 ESC 直接跳過
      startSequence(true);
    }
  });

  // 備援：若使用者沒點，在 AUTO_OPEN_AFTER 後自動開門（fast = false → 可保留LOGO時間感）
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      startSequence(false);
    }, AUTO_OPEN_AFTER);
  });

  function startSequence(fast){
    if(hasEntered){ 
      console.log('[Splash] 已觸發過，忽略。'); 
      return; 
    }
    hasEntered = true;
    console.log('[Splash] startSequence (fast =', fast, ')');

    // 停止再次點擊
    splash.style.pointerEvents = 'none';

    // fast：立刻開門；非 fast：尊重 LOGO_MS
    const openDelay = fast ? 0 : LOGO_MS;

    setTimeout(()=>{
      document.body.classList.add('doors-open'); // 門片動畫開始

      // 等門打開後淡出 splash
      setTimeout(()=>{
        splash.classList.add('is-hidden');
        if (home && typeof home.focus === 'function') {
          home.focus({preventScroll:false});
        }
      }, DOOR_MS);

    }, openDelay);
  }

  function msFromCSSVar(varName){
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if(!raw) return 0;
    if(raw.endsWith('ms')) return parseFloat(raw);
    if(raw.endsWith('s'))  return parseFloat(raw)*1000;
    const n = parseFloat(raw);
    return isNaN(n) ? 0 : n;
  }
})();