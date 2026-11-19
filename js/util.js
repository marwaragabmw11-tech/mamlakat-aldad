/* أدوات عامة */
'use strict';
const $=id=>document.getElementById(id);
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function attr(s){return esc(s).replace(/`/g,'&#96;');}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function sample(a,n){return shuffle(a).slice(0,n);}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayNum(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5);}
function addDays(n){const d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function slug(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return 'k'+(h>>>0).toString(36);}
function fmtDate(iso){try{return new Date(iso).toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'});}catch(e){return iso;}}

/* تطبيع النص العربي */
const TASHKEEL=/[ً-ْٰـ]/g;
function stripTashkeel(s){return String(s||'').replace(TASHKEEL,'');}
const PUNCT=/[.,،؛;:!?؟«»"'()\[\]{}\-–—…]/g;
function normSpaces(s){return String(s||'').replace(/\s+/g,' ').trim();}
/* تطبيع مرن (للبحث والإجابات غير الإملائية): يوحّد الهمزات والتاء المربوطة والألف اللينة */
function normLoose(s){return normSpaces(stripTashkeel(s).replace(PUNCT,' ').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي'));}
/* تطبيع صارم (للإملاء): يحذف التشكيل والترقيم فقط */
function normStrict(s){return normSpaces(stripTashkeel(s).replace(PUNCT,' ').replace(/ٱ/g,'ا'));}
function words(s){return normStrict(s).split(' ').filter(Boolean);}

/* فرق الكلمات (LCS) */
function lcsDiff(a,b){ // a: الصحيح، b: كتابة الطفل
  const n=a.length,m=b.length,dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const out=[];let i=0,j=0;
  while(i<n&&j<m){
    if(a[i]===b[j]){out.push({k:'ok',w:a[i]});i++;j++;}
    else if(dp[i+1][j]>=dp[i][j+1]&&dp[i+1][j]>=dp[i+1][j+1]&&!(dp[i+1][j+1]===dp[i+1][j]&&sim(a[i],b[j]))){out.push({k:'miss',w:a[i]});i++;}
    else if(dp[i][j+1]>dp[i+1][j+1]&&!sim(a[i],b[j])){out.push({k:'extra',w:b[j]});j++;}
    else{out.push({k:'bad',w:a[i],got:b[j]});i++;j++;}
  }
  while(i<n)out.push({k:'miss',w:a[i++]});while(j<m)out.push({k:'extra',w:b[j++]});
  return out;
}
function sim(x,y){return normLoose(x)===normLoose(y)||lev(x,y)<=Math.max(1,Math.floor(Math.max(x.length,y.length)/3));}
function lev(a,b){const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,i)=>i);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}

/* الأصوات التشجيعية (WebAudio) */
const SFX={ctx:null,
  t(f,d,type,v,delay){if(!S||!S.set.sound)return;try{this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();const c=this.ctx,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(delay||0);o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+d);}catch(e){}},
  ok(){this.t(660,.12,'sine');this.t(880,.18,'sine',.12,.1);},
  no(){this.t(220,.25,'triangle',.1);},
  win(){[523,659,784,1046].forEach((f,i)=>this.t(f,.25,'sine',.12,i*.11));},
  tap(){this.t(500,.05,'square',.04);},
  xp(){this.t(990,.1,'sine',.08);}
};

function toast(msg,ms){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),ms||2200);}
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const em=['✨','⭐','🌙','📜','🎉','💛'];for(let i=0;i<18;i++){const s=document.createElement('span');s.className='confetti';s.textContent=pick(em);s.style.right=Math.random()*100+'vw';s.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),3000);}}
function download(name,content,type){const b=new Blob([content],{type:type||'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('dad:'+s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}catch(e){let h=0;for(const c of 'dad:'+s)h=(h*31+c.charCodeAt(0))|0;return 'f'+h;}}
function modal(html,onClose){const m=$('modal');m.innerHTML='<div class="box" role="dialog" aria-modal="true">'+html+'<div class="row" style="margin-top:12px"><button class="btn" id="mclose">إغلاق</button></div></div>';m.hidden=false;const close=()=>{m.hidden=true;m.innerHTML='';onClose&&onClose();};$('mclose').onclick=close;m.onclick=e=>{if(e.target===m)close();};return close;}
function pct(a,b){return b?Math.round(a/b*100):0;}
