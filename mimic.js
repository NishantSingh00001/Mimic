/* ============================================================
   Mimic — shared engine, chrome, motion, icons (multi-page)
   On-device writing studio. No emojis anywhere.
   ============================================================ */
'use strict';
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(hover:none)').matches;

/* ---------- icons ---------- */
const ICON={
  studio:'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
  summarize:'M4 6h16M4 10h10M4 14h16M4 18h8',
  rewrite:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  inspect:'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3M8.5 11h5M11 8.5v5',
  compose:'M5 4h10l4 4v12a0 0 0 010 0H5zM15 4v4h4M8 13h8M8 17h5',
  settings:'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  menu:'M3 6h18M3 12h18M3 18h18',
  sun:'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon:'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
  copy:'M9 9h10a1 1 0 011 1v10a1 1 0 01-1 1H9a1 1 0 01-1-1V10a1 1 0 011-1zM5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1',
  download:'M12 4v12M7 11l5 5 5-5M4 20h16',
  upload:'M12 16V4M7 9l5-5 5 5M4 20h16',
  close:'M6 6l12 12M18 6L6 18',
  chevron:'M9 6l6 6-6 6',
  check:'M5 13l4 4L19 7',
  key:'M15 7a4 4 0 100 8 4 4 0 000-8zM11.5 11H3v3M7 11v3',
  spark:'M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3',
  trash:'M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13',
  quote:'M7 7h4v4c0 3-2 5-4 5V7zM15 7h4v4c0 3-2 5-4 5V7z'
};
function icon(n,sz){sz=sz||16;const p=ICON[n]||'';return '<svg class="ic ic-'+n+'" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+p+'"/></svg>';}
function logoMark(){return '<span class="mk"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18V7l4 7 4-7 4 7V7"/></svg></span>';}

/* ---------- state ---------- */
const LS='mimic_mp';
const ACCS=[['#c9a868','#e7c98c'],['#d98a5a','#f0b07a'],['#b89bd0','#d8c3ec'],['#8ab0a0','#b6d6c6'],['#c98a9a','#e6b4bf']];
const DEF={drafts:[],history:[],last:'',settings:{theme:'dark',accent:'#c9a868',accent2:'#e7c98c'}};
function loadS(){try{const s=JSON.parse(localStorage.getItem(LS)||'null');return s&&s.settings?Object.assign({},DEF,s):JSON.parse(JSON.stringify(DEF));}catch(e){return JSON.parse(JSON.stringify(DEF));}}
let S=loadS();
function save(){localStorage.setItem(LS,JSON.stringify(S));}
function esc(s){return(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

/* ---------- NLP engine ---------- */
const STOP=new Set('the a an and or of to in is are was were be been being for on at by with as it its this that these those from into than then so if but not no do does did has have had he she they we you i your our their his her them us me my will would can could should may might also such about over under more most other some any each very really just'.split(' '));
function sentences(s){return s.replace(/\s+/g,' ').match(/[^.!?]+[.!?]+|\S[^.!?]*$/g)||[];}
function words(s){return(s.match(/[A-Za-z0-9']+/g)||[]);}
function toks(s){return(s.toLowerCase().match(/[a-z0-9']+/g)||[]).filter(w=>w.length>2&&!STOP.has(w));}
function syllables(w){w=w.toLowerCase();return Math.max(1,(w.match(/[aeiouy]+/g)||[]).length);}
function readability(s){const w=words(s),se=sentences(s);if(!w.length||!se.length)return{flesch:0,grade:0};const syl=w.reduce((a,x)=>a+syllables(x),0);
  const flesch=Math.max(0,Math.min(100,206.835-1.015*(w.length/se.length)-84.6*(syl/w.length)));
  const grade=Math.max(0,0.39*(w.length/se.length)+11.8*(syl/w.length)-15.59);return{flesch:Math.round(flesch),grade:Math.max(1,Math.round(grade))};}
function idf(s){const df={};const sents=sentences(s);sents.forEach(se=>{new Set(toks(se)).forEach(w=>df[w]=(df[w]||0)+1);});const N=sents.length||1;const I={};for(const w in df)I[w]=Math.log(1+N/df[w]);return I;}
function summarize(s,ratio){const sents=sentences(s);if(sents.length<=2)return s.trim();const I=idf(s);
  const scored=sents.map((se,i)=>{const t=toks(se);const score=t.reduce((a,w)=>a+(I[w]||0),0)/(Math.sqrt(t.length)||1);return{se:se.trim(),i,score};});
  const keep=Math.max(1,Math.round(sents.length*ratio));
  const top=scored.slice().sort((a,b)=>b.score-a.score).slice(0,keep).sort((a,b)=>a.i-b.i);
  return top.map(x=>x.se).join(' ');}
function keySentences(s,n){const sents=sentences(s);const I=idf(s);const scored=sents.map((se,i)=>({se:se.trim(),i,score:toks(se).reduce((a,w)=>a+(I[w]||0),0)}));return scored.sort((a,b)=>b.score-a.score).slice(0,n||3).map(x=>x.se);}
function keywords(s,n){const I=idf(s);const tf={};toks(s).forEach(w=>tf[w]=(tf[w]||0)+1);const sc={};for(const w in tf)sc[w]=tf[w]*(I[w]||1);return Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,n||10).map(x=>x[0]);}
const POS=new Set('good great excellent amazing wonderful positive happy love best brilliant success delight clear strong helpful beautiful perfect win gain improve benefit effective easy enjoy'.split(' '));
const NEG=new Set('bad poor terrible awful negative sad hate worst fail failure problem difficult hard weak useless ugly wrong loss broken confusing slow angry fear risk'.split(' '));
function sentiment(s){const w=toks(s);let p=0,n=0;w.forEach(x=>{if(POS.has(x))p++;if(NEG.has(x))n++;});const t=p+n;const score=t?Math.round((p-n)/t*100):0;return{score,pos:p,neg:n};}
const FILLER=['very','really','just','actually','basically','literally','simply','quite','rather','somewhat','in order to','a lot of','kind of','sort of'];
const CLICHE=['at the end of the day','think outside the box','low-hanging fruit','move the needle','circle back','touch base','going forward','in today\'s world','needle in a haystack'];
function flags(s){const low=' '+s.toLowerCase()+' ';
  const filler=FILLER.filter(f=>low.includes(' '+f+' ')).length?FILLER.filter(f=>low.includes(' '+f+' ')):[];
  const cliche=CLICHE.filter(c=>low.includes(c));
  const adverbs=(s.match(/\b\w+ly\b/g)||[]).length;
  const passive=(s.match(/\b(was|were|is|are|been|be)\s+\w+(ed|en)\b/gi)||[]).length;
  return {filler,cliche,adverbs,passive};}
/* offline rewrite transforms */
function expandContractions(s){const m={"don't":'do not',"can't":'cannot',"won't":'will not',"i'm":'I am',"it's":'it is',"we're":'we are',"you're":'you are',"they're":'they are',"isn't":'is not',"aren't":'are not',"wasn't":'was not',"weren't":'were not',"i've":'I have',"we've":'we have',"i'll":'I will',"we'll":'we will',"let's":'let us',"that's":'that is',"there's":'there is'};return s.replace(/\b[\w']+\b/g,w=>m[w.toLowerCase()]||w);}
const REWRITE={
  concise:s=>{let o=s;FILLER.forEach(f=>{o=o.replace(new RegExp('\\b'+f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi'),'');});return o.replace(/\s{2,}/g,' ').replace(/\s+([.,!?])/g,'$1').trim();},
  formal:s=>expandContractions(s).replace(/\bkids\b/gi,'children').replace(/\bstuff\b/gi,'material').replace(/\bget\b/gi,'obtain'),
  confident:s=>s.replace(/\bI think\b/gi,'').replace(/\bI believe\b/gi,'').replace(/\bmaybe\b/gi,'').replace(/\bperhaps\b/gi,'').replace(/\bkind of\b/gi,'').replace(/\bsort of\b/gi,'').replace(/\s{2,}/g,' ').trim(),
  friendly:s=>s.trim(),
  playful:s=>s.trim()
};
/* gemini */
const KEY='mimic_key',MODELS=['gemini-2.0-flash-lite','gemini-flash-latest','gemini-2.0-flash'];
function hasKey(){return !!localStorage.getItem(KEY);}
async function aiRun(prompt){const key=localStorage.getItem(KEY);if(!key)throw new Error('no key');
  for(const m of MODELS){const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:.7}})});if(!r.ok)continue;const j=await r.json();return j.candidates[0].content.parts[0].text.trim();}
  throw new Error('unavailable');}
function openKey(){$('keyIn').value=localStorage.getItem(KEY)||'';$('keyScrim').classList.add('on');}
function saveKey(){const k=$('keyIn').value.trim();if(k)localStorage.setItem(KEY,k);closeAll();toast('Key saved');}

/* io */
function dl(name,mime,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:mime}));a.download=name;a.click();}
function copyText(t,msg){if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast(msg||'Copied'),()=>toast('Copy failed'));else toast('Clipboard unavailable');}
function pushHistory(label){S.history.unshift({label,when:Date.now()});S.history=S.history.slice(0,40);save();}

/* theme */
function applyTheme(){document.documentElement.setAttribute('data-theme',S.settings.theme);document.documentElement.style.setProperty('--acc',S.settings.accent);document.documentElement.style.setProperty('--acc2',S.settings.accent2);const b=$('themeBtn');if(b)b.innerHTML=icon(S.settings.theme==='dark'?'sun':'moon');}
function toggleTheme(){S.settings.theme=S.settings.theme==='dark'?'light':'dark';save();applyTheme();}
function setAccent(a,b){S.settings.accent=a;S.settings.accent2=b;save();applyTheme();document.querySelectorAll('.ad').forEach(x=>x.classList.toggle('on',x.dataset.a===a));}

/* chrome */
const NAVLINKS=[['index.html','studio','Studio'],['summarize.html','summarize','Summarize'],['rewrite.html','rewrite','Rewrite'],['inspect.html','inspect','Inspect'],['compose.html','compose','Compose'],['settings.html','settings','Settings']];
function buildChrome(){
  const here=(location.pathname.split('/').pop()||'index.html')||'index.html';
  const bar=$('topbar');
  if(bar){bar.className='bar';bar.innerHTML='<div class="in">'+
    '<a class="logo" href="index.html" data-mag>'+logoMark()+'Mimic</a>'+
    '<nav class="nav" id="nav">'+NAVLINKS.map(([h,ic,label])=>'<a href="'+h+'" class="'+(h===here?'on':'')+'">'+label+'</a>').join('')+'</nav>'+
    '<div class="spacer"></div>'+
    '<div class="accents" id="accents">'+ACCS.map(([a,b])=>'<button class="ad'+(a===S.settings.accent?' on':'')+'" data-a="'+a+'" data-press style="background:linear-gradient(135deg,'+a+','+b+')" aria-label="Accent"></button>').join('')+'</div>'+
    '<button class="iconbtn" id="themeBtn" data-press title="Theme (T)" aria-label="Theme"></button>'+
    '<button class="iconbtn navtoggle" id="navToggle" data-press aria-label="Menu">'+icon('menu')+'</button>'+
    '<a class="pill" href="summarize.html" data-press>Open studio</a>'+
    '</div>';
    $('themeBtn').onclick=toggleTheme;
    document.querySelectorAll('#accents .ad').forEach(b=>b.onclick=()=>setAccent(b.dataset.a,ACCS.find(x=>x[0]===b.dataset.a)[1]));
    $('navToggle').onclick=()=>$('nav').classList.toggle('open');
  }
  if(!$('toast'))document.body.insertAdjacentHTML('beforeend','<div class="toast" id="toast"></div>');
  if(!$('keyScrim'))document.body.insertAdjacentHTML('beforeend','<div class="scrim" id="keyScrim"><div class="modal"><h3>Gemini key<button class="close" data-press onclick="closeAll()">'+icon('close')+'</button></h3><p>Mimic\'s summarize, inspect and offline rewrites work with no key. Add a free Gemini key (from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>) for generative rewrite and compose. Stored only in this browser.</p><div class="fld" style="margin-top:0"><input type="password" id="keyIn" placeholder="AIza…"></div><button class="save" data-press onclick="saveKey()">Save key</button></div></div>');
  if(!document.getElementById('mimic-light')){const c=document.createElement('canvas');c.id='mimic-light';document.body.prepend(c);}
  if(!document.querySelector('.vig'))document.body.insertAdjacentHTML('afterbegin','<div class="vig"></div><div class="grain"></div>');
  if(!document.querySelector('.cur-ring'))document.body.insertAdjacentHTML('beforeend','<div class="cur-ring"></div><div class="cur-dot"></div>');
  applyTheme();initCursor();initLight();
  addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(e.key==='t'||e.key==='T')toggleTheme();});
}
let tt;function toast(m){const t=$('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1900);}
function closeAll(){document.querySelectorAll('.scrim').forEach(s=>s.classList.remove('on'));document.querySelectorAll('.menupop').forEach(m=>m.remove());}
addEventListener('pointerdown',e=>{const t=e.target.closest('[data-press]');if(t)t.classList.add('press');});
['pointerup','pointercancel','pointerleave'].forEach(ev=>addEventListener(ev,()=>document.querySelectorAll('.press').forEach(e=>e.classList.remove('press'))));

function initCursor(){if(reduce||touch)return;document.body.classList.add('cur');const ring=document.querySelector('.cur-ring'),dot=document.querySelector('.cur-dot');if(!ring)return;let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';const tText=e.target.closest('input[type=text],input:not([type]),textarea,input[type=password]');const tHov=e.target.closest('button,a,.tile,.seg,.chip,.ad,.toggle,label,[data-press]');ring.classList.toggle('txt',!!tText);ring.classList.toggle('hov',!!tHov&&!tText);},{passive:true});
  addEventListener('pointerdown',()=>ring.classList.add('down'));addEventListener('pointerup',()=>ring.classList.remove('down'));
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  addEventListener('pointermove',e=>{document.querySelectorAll('[data-mag]').forEach(el=>{const r=el.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy);if(d<60)el.style.transform='translate('+dx*.12+'px,'+dy*.18+'px)';else el.style.transform='';});},{passive:true});
}
/* calm drifting amber light */
function initLight(){const cv=document.getElementById('mimic-light');if(!cv)return;if(reduce){cv.style.display='none';return;}
  const ctx=cv.getContext('2d');let W,H,DPR=Math.min(2,devicePixelRatio||1);let mx=.7,my=.3;
  function hx(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
  function sz(){W=cv.width=innerWidth*DPR;H=cv.height=innerHeight*DPR;}sz();addEventListener('resize',sz);
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth;my=e.clientY/innerHeight;},{passive:true});
  const orbs=[{x:.72,y:.28,r:.5,a:0,sp:.3},{x:.2,y:.7,r:.4,a:2,sp:.22},{x:.5,y:.5,r:.34,a:4,sp:.16}];let t=0;
  function frame(){t+=.004;ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';const light=document.documentElement.getAttribute('data-theme')==='light';
    const a1=hx(getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#c9a868');
    orbs.forEach((o,i)=>{o.a+=o.sp*.01;let px=(o.x+Math.cos(o.a)*.08+(i===0?(mx-.5)*.05:0))*W,py=(o.y+Math.sin(o.a*1.2)*.08+(i===0?(my-.5)*.05:0))*H;const rr=o.r*Math.min(W,H);
      const g=ctx.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba('+a1[0]+','+a1[1]+','+a1[2]+','+(light?.1:.14)+')');g.addColorStop(1,'rgba('+a1[0]+','+a1[1]+','+a1[2]+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,rr,0,6.29);ctx.fill();});
    ctx.globalCompositeOperation='source-over';requestAnimationFrame(frame);}
  frame();
}
function initReveals(){const els=document.querySelectorAll('.reveal');if(!els.length)return;if(!('IntersectionObserver'in window)||reduce){els.forEach(e=>e.classList.add('in'));return;}const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12});els.forEach(e=>io.observe(e));}

const SAMPLE="Great writing is not about showing off. It is about being understood. When you remove the clutter, your ideas breathe. Readers do not reward complexity; they reward clarity. The best editors cut ruthlessly, keeping only what earns its place. Say what you mean, then stop. A short sentence lands harder than a long one. Trust the reader to keep up, and they will.";
function ensureSeed(){if(!S.last&&!localStorage.getItem('mimic_seeded')){localStorage.setItem('mimic_seeded','1');S.last=SAMPLE;save();}}
function boot(){ensureSeed();buildChrome();if(window.initPage)window.initPage();initReveals();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
