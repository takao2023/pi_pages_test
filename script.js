const clocks = [
  { id: 'clock-New_York', tz: 'America/New_York' },
  { id: 'clock-London', tz: 'Europe/London' },
  { id: 'clock-Paris', tz: 'Europe/Paris' },
  { id: 'clock-Tokyo', tz: 'Asia/Tokyo' },
  { id: 'clock-Cairo', tz: 'Africa/Cairo' },
  { id: 'clock-Sydney', tz: 'Australia/Sydney' },
];

function getTimeParts(timeZone){
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const parts = fmt.formatToParts(new Date());
  let hh=0, mm=0, ss=0;
  for(const p of parts){
    if(p.type === 'hour') hh = +p.value;
    if(p.type === 'minute') mm = +p.value;
    if(p.type === 'second') ss = +p.value;
  }
  return { hh, mm, ss };
}


function drawClock(ctx, w, h, hh, mm, ss){
  const r = Math.min(w,h)/2;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.translate(w/2, h/2);

  // 盤面
  ctx.beginPath();
  ctx.arc(0,0, r-4, 0, Math.PI*2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.stroke();

  // 12目盛り
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  for(let i=0;i<12;i++){
    const ang = (Math.PI*2)*(i/12);
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang)*(r-12), Math.sin(ang)*(r-12));
    ctx.lineTo(Math.cos(ang)*(r-4), Math.sin(ang)*(r-4));
    ctx.stroke();
  }

  // 時針
  const hourAng = (Math.PI*2)*(((hh%12)+mm/60+ss/3600)/12) - Math.PI/2;
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#0f5252';
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(hourAng)*(r*0.45), Math.sin(hourAng)*(r*0.45));
  ctx.stroke();

  // 分針
  const minAng = (Math.PI*2)*((mm+ss/60)/60) - Math.PI/2;
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0f7b79';
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(minAng)*(r*0.66), Math.sin(minAng)*(r*0.66));
  ctx.stroke();

  // 秒針
  const secAng = (Math.PI*2)*(ss/60) - Math.PI/2;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d9534f';
  ctx.moveTo(Math.cos(secAng)*-8, Math.sin(secAng)*-8);
  ctx.lineTo(Math.cos(secAng)*(r*0.76), Math.sin(secAng)*(r*0.76));
  ctx.stroke();

  // 中心
  ctx.beginPath();
  ctx.arc(0,0,4,0,Math.PI*2);
  ctx.fillStyle = '#333';
  ctx.fill();

  ctx.restore();
}

function initClocks(){
  clocks.forEach(cfg=>{
    const canvas = document.getElementById(cfg.id);
    const ctx = canvas.getContext('2d');

    const ratio = window.devicePixelRatio || 1;
    const setCanvasSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(ratio, ratio);
    };

    setCanvasSize();

    const render = () => {
      const { hh, mm, ss } = getTimeParts(cfg.tz);
      drawClock(ctx, canvas.clientWidth, canvas.clientHeight, hh, mm, ss);
    };

    render();
    setInterval(render, 1000);
    window.addEventListener('resize', () => {
      setCanvasSize();
      render();
    });
  });
}

window.addEventListener('DOMContentLoaded', initClocks);