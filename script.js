// Mobile nav
const btn=document.getElementById('menuBtn');const nav=document.getElementById('nav');
function setNav(){ if(window.innerWidth<640){btn.style.display='inline-block';nav.style.display='none';} else {btn.style.display='none';nav.style.display='flex';} }
setNav(); window.addEventListener('resize', setNav);
btn.addEventListener('click',()=>{ const open=getComputedStyle(nav).display==='flex'; nav.style.display=open?'none':'flex'; btn.setAttribute('aria-expanded',(!open).toString()); });
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href'); if(id.length>1){e.preventDefault();document.querySelector(id).scrollIntoView({behavior:'smooth'}); if(window.innerWidth<640) nav.style.display='none';}}));

// Contact demo
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();alert('문의가 접수된 것으로 처리되었습니다. (데모)');});

// Chatbot
const fab=document.getElementById('chatFab'); const panel=document.getElementById('chatPanel'); const closeBtn=document.getElementById('chatClose');
const bodyEl=document.getElementById('chatBody'); const inputEl=document.getElementById('chatInput'); const sendBtn=document.getElementById('chatSend');
const state={intent:null,data:{},step:0};

function openChat(){ panel.style.display='flex'; inputEl.focus(); }
function closeChat(){ panel.style.display='none'; }
fab.addEventListener('click',openChat); closeBtn.addEventListener('click',closeChat);

function bot(html){const d=document.createElement('div');d.className='msg bot';d.innerHTML=html;bodyEl.appendChild(d);bodyEl.scrollTop=bodyEl.scrollHeight;}
function user(text){const d=document.createElement('div');d.className='msg user';d.textContent=text;bodyEl.appendChild(d);bodyEl.scrollTop=bodyEl.scrollHeight;}

function setIntent(i){
  state.intent=i; state.step=0; state.data={};
  if(i==='as'){ bot('A/S 접수를 도와드릴게요. 1) <b>제품명/모델</b>을 알려주세요.'); }
  else if(i==='quote'){ bot('견적 문의를 시작합니다. 1) <b>품목/사양</b>을 알려주세요.'); }
  else if(i==='guide'){ bot('상담 안내: 대표번호 <b>031-000-0000</b>, 이메일 <b>sales@example.com</b>, 평일 09:00~18:00'); bot('<div class="cta-row"><a class="btn ghost" href="#contact">문의 폼</a><a class="btn primary" href="mailto:sales@example.com?subject=%5B상담문의%5D%20WOOONG">이메일 보내기</a></div>'); }
  else if(i==='faq'){ bot('<b>FAQ 바로가기</b><br>• 납기 산정 기준<br>• 유지보수 방식<br>• 견적 포함 항목'); bot('자주 묻는 질문은 <a href="#faq">여기</a>에서 확인하실 수 있어요.'); }
}

bodyEl.addEventListener('click',e=>{const chip=e.target.closest('.chip');if(chip){setIntent(chip.dataset.intent);}});

function nextAS(val){
  const steps=[
    {k:'model', ask:'2) <b>시리얼/설치위치</b>를 알려주세요.'},
    {k:'place', ask:'3) <b>증상/에러코드</b>를 적어주세요.'},
    {k:'symptom', ask:'4) <b>긴급도</b>·<b>희망 방문일</b>을 알려주세요.'},
    {k:'urgency', ask:'5) <b>담당자명/연락처</b>를 남겨주세요.'},
    {k:'contact', done:true}
  ];
  const s=steps[state.step]; if(s){state.data[s.k]=val; state.step++; if(!s.done){bot(s.ask);} else {finish('A/S 접수 요약');}}
}
function nextQuote(val){
  const steps=[
    {k:'item', ask:'2) <b>수량</b>과 <b>납기(희망일)</b>은?' },
    {k:'qty', ask:'3) <b>도면 유무</b>와 <b>설치지역</b>은?' },
    {k:'docs', ask:'4) <b>예산 범위(선택)</b>와 <b>요구사항</b>은?' },
    {k:'budget', ask:'5) <b>담당자명/연락처</b>를 남겨주세요.'},
    {k:'contact', done:true}
  ];
  const s=steps[state.step]; if(s){state.data[s.k]=val; state.step++; if(!s.done){bot(s.ask);} else {finish('견적 문의 요약');}}
}
function finish(title){
  const lines=[]; for(const k in state.data){lines.push(`${k}: ${state.data[k]}`);}
  const mailSubject=encodeURIComponent(`[${title}] WOOONG`);
  const mailBody=encodeURIComponent(lines.join('\n'));
  bot(`<b>${title}</b><br>${lines.map(l=>l.replace(/</g,'&lt;')).join('<br>')}<div class="cta-row"><a class="btn ghost" onclick="navigator.clipboard.writeText(\`${lines.join('\\n')}\`).then(()=>alert('요약이 복사되었습니다.'))">복사하기</a><a class="btn primary" href="mailto:sales@example.com?subject=${mailSubject}&body=${mailBody}">메일로 보내기</a></div>`);
  state.intent=null; state.step=0; state.data={};
}
function route(text){
  if(!text.trim()) return;
  user(text);
  if(!state.intent){
    const t=text.replace(/\s/g,'').toLowerCase();
    if(t.includes('as')||t.includes('a/s')||t.includes('수리')||t.includes('고장')) setIntent('as');
    else if(t.includes('견적')||t.includes('quote')||t.includes('가격')) setIntent('quote');
    else if(t.includes('상담')||t.includes('안내')||t.includes('전화')||t.includes('email')||t.includes('이메일')) setIntent('guide');
    else if(t.includes('faq')||t.includes('질문')||t.includes('자주')) setIntent('faq');
    else bot('도움말: "A/S 접수", "견적 문의", "상담 안내", "FAQ" 중 선택해 주세요.');
    return;
  }
  if(state.intent==='as') nextAS(text);
  else if(state.intent==='quote') nextQuote(text);
}
function send(){const v=inputEl.value; inputEl.value=''; route(v); inputEl.focus();}
sendBtn.addEventListener('click',send);
inputEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send();}});

// deep link
if(location.hash==='#chat') openChat();
