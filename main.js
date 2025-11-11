const typeEl = document.getElementById('type');
const scaleEl = document.getElementById('scale');
const rushEl = document.getElementById('rush');
const envEl = document.getElementById('env');
const descEl = document.getElementById('desc');

const calcBtn = document.getElementById('calcBtn');
const resetBtn = document.getElementById('resetBtn');

const outWrap = document.getElementById('rfqOut');
const hint = document.getElementById('rfqHint');
const result = document.getElementById('rfqResult');
const lead = document.getElementById('lead');
const leadtime = document.getElementById('leadtime');
const budget = document.getElementById('budget');
const kit = document.getElementById('kit');

function formatKRW(n){
  return new Intl.NumberFormat('ko-KR', { style:'currency', currency:'KRW', maximumFractionDigits:0 }).format(n);
}

function estimate(){
  let weeks = 6;
  let min = 80_000_000, max = 220_000_000;

  const t = typeEl.value, s = scaleEl.value, r = rushEl.value, e = envEl.value;

  if(t==='stacker'){ weeks += 3; min+=70_000_000; max+=130_000_000; }
  if(t==='fa'){ weeks += 1; min+=30_000_000; max+=70_000_000; }

  if(s==='m'){ weeks += 3; min*=1.35; max*=1.35; }
  if(s==='l'){ weeks += 6; min*=1.9; max*=2.1; }

  if(e==='hot'){ weeks += 2; min+=20_000_000; max+=40_000_000; }

  if(r==='rush'){ weeks = Math.max(4, Math.round(weeks*0.7)); min*=1.15; max*=1.18; }

  let kitTxt = '표준 모듈';
  if(t==='agv') kitTxt = (s==='l' ? 'AGV 8~12대 + 충전기 Bank' : (s==='m' ? 'AGV 3~6대 + 교차로 키트' : 'AGV 1~2대 + 안전센서 패키지'));
  if(t==='stacker') kitTxt = (s==='l' ? '스태커 2기 + 랙 9~12m' : '스태커 1기 + 랙 6~9m');
  if(t==='fa') kitTxt = '컨베이어/리프트 + 스캐너/QR 추적 패키지';
  if(e==='hot') kitTxt += ' · 특수환경(고온/청정) 사양';

  hint.style.display='none';
  result.style.display='block';
  lead.textContent = '입력값 기준 개략 산출 결과입니다. 실제 견적은 상세 레이아웃 및 사양 협의 후 변동될 수 있습니다.';
  leadtime.textContent = `${weeks}주 내외`;
  budget.textContent = `${formatKRW(min)} ~ ${formatKRW(max)}`;
  kit.textContent = kitTxt;

  outWrap.scrollIntoView({behavior:'smooth', block:'center'});
}

calcBtn.addEventListener('click', estimate);
resetBtn.addEventListener('click', ()=>{
  document.getElementById('rfqForm').reset();
  hint.style.display='block';
  result.style.display='none';
  descEl.value='';
});
