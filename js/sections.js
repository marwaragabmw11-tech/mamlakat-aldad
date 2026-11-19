/* الأقسام: المعجم، مختبر الكتابة، مدينة النحو، حديقة البلاغة، المكتبة، كنوز التراث */
'use strict';
const ALPHA='ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي'.split(' ');
function firstLetter(w){let s=stripTashkeel(w).replace(/^ال(?=..)/,'');s=s.replace(/^[أإآٱ]/,'ا');return s[0]||'';}
function sortAr(a,f){return a.slice().sort((x,y)=>stripTashkeel(f(x)).localeCompare(stripTashkeel(f(y)),'ar'));}

/* ===== المعجم المصور ===== */
let DICT={g:'all',l:'',q:''};
ROUTES.dict=function(g){if(g)DICT.g=g;
  const groups=D.dictGroups;const w=wordOfDay();
  app().innerHTML=crumbs([['الرئيسية','#/home'],['المعجم المصوّر']])+guide('في معجمي كلمات مرتبة أبجديًا، لكل كلمة معناها ومثالها وجذرها وأخواتها. افتح أي كلمة ثم اضغط «اختبرني» لتُضاف إلى كلماتك 🔤','happy')+
  (w?`<a class="card" style="display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit" href="#/word/${w.id}"><div class="word-pic">${w.e||'🔤'}</div><div><span class="small">📅 كلمة اليوم</span><h2 class="word-title">${esc(w.w)}</h2><span>${esc(w.m)}</span></div></a>`:'')+
  `<div class="card"><div class="row"><input type="search" id="dq" placeholder="ابحث عن كلمة أو معنى" value="${attr(DICT.q)}" style="flex:1"><button class="btn main" id="dgo">بحث</button></div>
  <div class="row" style="margin-top:8px"><button class="chip ${DICT.g==='all'?'on':''}" data-g="all">الكل (${D.dict.length})</button>${Object.entries(groups).map(([k,v])=>`<button class="chip ${DICT.g===k?'on':''}" data-g="${k}">${v.e} ${v.n} (${D.dict.filter(x=>x.g===k).length})</button>`).join('')}</div>
  <div class="alpha" style="margin-top:8px"><button class="${!DICT.l?'on':''}" data-l="" style="width:auto;padding:0 8px;font-family:inherit;font-size:.85rem">الكل</button>${ALPHA.map(a=>`<button class="${DICT.l===a?'on':''}" data-l="${a}">${a}</button>`).join('')}</div></div><div id="dl"></div>`;
  const draw=()=>{let L=D.dict;if(DICT.g!=='all')L=L.filter(x=>x.g===DICT.g);if(DICT.l)L=L.filter(x=>firstLetter(x.w)===DICT.l);
    if(DICT.q){const n=normLoose(DICT.q);L=L.filter(x=>normLoose(x.w).includes(n)||normLoose(x.m).includes(n)||(x.syn||[]).some(s=>normLoose(s).includes(n)));}
    L=sortAr(L,x=>x.w.replace(/^ال/,''));
    $('dl').innerHTML=L.length?`<p class="small">${L.length} كلمة</p><div class="wlist">${L.map(x=>`<a class="wl" href="#/word/${x.id}"><span>${x.e||'🔤'}</span><div><b>${esc(x.w)}</b>${S.learned[x.id]?' ✅':''}<div class="small">${esc(x.m.slice(0,38))}${x.m.length>38?'…':''}</div></div></a>`).join('')}</div>`:guide('لا توجد كلمات هنا بعد.','think');};
  qsa('[data-g]').forEach(b=>b.onclick=()=>{DICT.g=b.dataset.g;ROUTES.dict();});
  qsa('[data-l]').forEach(b=>b.onclick=()=>{DICT.l=b.dataset.l;ROUTES.dict();});
  const s=()=>{DICT.q=$('dq').value.trim();draw();};$('dgo').onclick=s;$('dq').onkeydown=e=>{if(e.key==='Enter')s();};draw();
};
ROUTES.word=function(id){const w=D.dict.find(x=>x.id===id);if(!w)return go('#/dict');
  if(!S.seen['w:'+id]){S.seen['w:'+id]=today();save();}
  const G=D.dictGroups[w.g]||{};const i=D.dict.indexOf(w);const prev=D.dict[i-1],next=D.dict[i+1];
  const row=(k,v)=>v&&(!Array.isArray(v)||v.length)?`<dt>${k}</dt><dd>${Array.isArray(v)?v.map(esc).join('، '):esc(v)}</dd>`:'';
  app().innerHTML=crumbs([['المعجم','#/dict'],[G.n||'',`#/dict/${w.g}`],[w.w]])+`<div class="card"><div class="word-head"><div class="word-pic">${w.e||'🔤'}</div><div style="flex:1"><h1 class="word-title">${esc(w.w)}</h1><span class="pill">${G.e||''} ${esc(G.n||'')}</span> ${S.learned[id]?'<span class="tag ok">✅ تعلمتها</span>':''}</div>${sayBtn(w.w,'w:'+id)}</div>
  <p style="font-size:1.1rem;margin:12px 0 6px"><b>المعنى:</b> ${esc(w.m)}</p>
  ${w.s?`<div class="example">📝 <b>في جملة:</b> ${esc(w.s)}</div>`:''}
  ${w.amm?`<div class="rule">🗣️ <b>بدل العامية:</b> نقول في العامية «${esc(w.amm)}»، والفصيح: «${esc(w.w)}».</div>`:''}
  ${w.q?`<div class="rule">🌙 <b>في القرآن الكريم:</b> ﴿${esc(w.q)}﴾ <span class="small">[${esc(w.qr||'')}]</span></div>`:''}
  <dl class="kv" style="margin-top:10px">${row('مرادفات',w.syn)}${row('أضداد',w.ant)}${row('المفرد',w.sg)}${row('الجمع',w.pl)}${row('الجذر',w.root)}${row('من أسرتها',w.der)}${row('من الحياة',w.life)}</dl></div>
  <div class="row"><button class="btn gold" id="tst">🎯 اختبرني في هذه الكلمة</button>${prev?`<a class="btn" href="#/word/${prev.id}">→ ${esc(prev.w)}</a>`:''}${next?`<a class="btn" href="#/word/${next.id}">${esc(next.w)} ←</a>`:''}</div><div id="qhost"></div>`;
  $('tst').onclick=()=>{const items=wordQuiz(w);new Quiz($('qhost'),items,{sec:'vocab',key:'W:'+id,onDone:(p,ok,n)=>{if(p>=PASS&&!S.learned[id]){S.learned[id]=today();save();dayInc('words');addXP(8,'كلمة جديدة');}else if(ok)addXP(ok,'');$('qhost').innerHTML=resultHTML(p,ok,n,`<div class="row center">${next?`<a class="btn main" href="#/word/${next.id}">الكلمة التالية ←</a>`:''}<a class="btn" href="#/dict">المعجم</a></div>`);checkBadges();}});$('tst').disabled=true;};
};
/* اختبار الكلمة: المشتتات تُستبعد إن كانت قريبة المعنى (مرادف مشترك، نفس الجذر، أو تشابه في ألفاظ المعنى) حتى لا يكون للسؤال جوابان */
function mTok(m){return new Set(normLoose(m).split(' ').filter(t=>t.length>3).map(t=>t.replace(/^(ال|وال|بال|لل)/,'')));}
function wRelated(a,b){if(a.id===b.id||normLoose(a.w)===normLoose(b.w))return true;
  const sa=(a.syn||[]).map(normLoose),sb=(b.syn||[]).map(normLoose);
  if(sa.includes(normLoose(b.w))||sb.includes(normLoose(a.w))||sa.some(x=>sb.includes(x)))return true;
  if(a.root&&a.root===b.root)return true;
  const A=mTok(a.m),B=mTok(b.m);let c=0;A.forEach(t=>{if(B.has(t))c++;});return c>=2||(c>=1&&Math.min(A.size,B.size)<=2);}
function distract(w,n,ok){const pool=D.dict.filter(x=>!wRelated(w,x)&&(!ok||ok(x)));const same=pool.filter(x=>x.g===w.g);return sample(same.length>=n?same:pool,n);}
function uniqOpts(o){const seen=new Set();return o.filter(x=>{const k=normLoose(x);if(seen.has(k))return false;seen.add(k);return true;});}
function wordQuiz(w){const out=[];const bad=new Set([...(w.syn||[]),...(w.ant||[])].map(normLoose));
  out.push({t:'mc',q:`ما معنى «${w.w}»؟`,o:uniqOpts([w.m,...distract(w,3).map(x=>x.m)]),a:0,h:w.s||''});
  out.push({t:'mc',q:`أي كلمة معناها: ${w.m}`,o:uniqOpts([w.w,...distract(w,3).map(x=>x.w)]),a:0});
  if(w.syn&&w.syn.length){out.push({t:'mc',q:`ما مرادف «${w.w}»؟`,o:uniqOpts([w.syn[0],...distract(w,3,x=>!bad.has(normLoose(x.w))).map(x=>x.w)]),a:0});}
  else if(w.ant&&w.ant.length){out.push({t:'mc',q:`ما ضد «${w.w}»؟`,o:uniqOpts([w.ant[0],...distract(w,3,x=>!bad.has(normLoose(x.w))).map(x=>x.w)]),a:0});}
  if(w.pl&&w.pl!==w.w)out.push({t:'in',q:`اكتب جمع «${w.w}»`,a:w.pl.split(/\s*[،,]\s*/).filter(Boolean),s:1,h:'الجمع: '+w.pl});
  return out.filter(e=>e.t!=='mc'||e.o.length>=3);}

/* ===== مختبر الكتابة ===== */
ROUTES.writing=function(){
  app().innerHTML=crumbs([['الرئيسية','#/home'],['مختبر الكتابة']])+guide('هنا قواعد الكتابة الصحيحة. لكل قاعدة شرح وأمثلة وتدريبات متدرجة واختبار. القاعدة تُعدّ متقنة عندما تحصل على '+PASS+'% أو أكثر ✏️','think')+
  `<div class="grid wide">${D.spelling.map(r=>{const b=S.rules[r.id];return `<a class="tile" href="#/rule/${r.id}">${b>=PASS?'<span class="badge">✓ '+b+'%</span>':b!=null?'<span class="badge" style="background:var(--sun);color:#7a5a10">'+b+'%</span>':''}<span class="ic">${r.e}</span><h3>${esc(r.t)}</h3><span class="small">${r.ex.length} تدريبًا</span></a>`;}).join('')}</div>`;
};
ROUTES.rule=function(id){const r=D.spelling.find(x=>x.id===id);if(!r)return go('#/writing');
  ruleLike(r,[['مختبر الكتابة','#/writing'],[r.t]],'spell','R:'+id,(p)=>{const first=!(S.rules[id]>=PASS);S.rules[id]=Math.max(p,S.rules[id]||0);save();if(p>=PASS&&first)dayInc('rules');});};
function ruleLike(r,cr,sec,key,onDone,extra){
  app().innerHTML=crumbs(cr)+`<div class="card lesson-body"><h2>${r.e||''} ${esc(r.t)}</h2>${r.body}${extra||''}</div><div class="row" id="rbtns"><button class="btn main" id="rq">✍️ ابدأ التدريب (${r.ex.length})</button></div><div id="qhost"></div>`;
  $('rq').onclick=()=>{$('rbtns').classList.add('hide');qsa('.lesson-body').forEach(x=>x.classList.add('hide'));
    const items=r.ex.map((e,k)=>Object.assign({},e,{_k:key+':'+k}));
    new Quiz($('qhost'),items,{sec,key,onDone:(p,ok,n)=>{onDone(p);addXP(ok*2+(p>=PASS?10:0),p>=PASS?'أتقنت القاعدة':'');if(p>=PASS){confetti();SFX.win();}$('qhost').innerHTML=resultHTML(p,ok,n,`<div class="row center"><button class="btn" onclick="route()">↺ من جديد</button><a class="btn main" href="${cr[0][1]}">العودة</a></div>`);checkBadges();}});};
}

/* ===== مدينة النحو ===== */
ROUTES.grammar=function(){
  app().innerHTML=crumbs([['الرئيسية','#/home'],['مدينة النحو']])+guide('أهلًا بك في مدينة النحو! كل مبنى فيها باب من أبواب القواعد. ادخل المبنى، واقرأ اللوحة، وشاهد الإعراب، ثم أنجز التدريب لتضيء نوافذه 🏙️','excited')+
  `<div class="city">${D.grammar.map((g,i)=>{const b=S.gbs[g.id];return `<a class="bldg ${b>=PASS?'done':''}" href="#/gb/${g.id}"><div class="roof">${g.e}</div><b>${esc(g.t)}</b><div class="small">المبنى ${i+1}${b!=null?' · '+b+'%':''}</div></a>`;}).join('')}</div>
  <div class="card"><h3>🧩 ورشة تكوين الجمل</h3><p class="small">رتّب الكلمات لتكوّن جملة صحيحة، من جمل مدينة النحو.</p><button class="btn gold" onclick="go('#/game/order')">ابدأ الورشة</button> <button class="btn" onclick="go('#/game/irab')">🏁 سباق الإعراب</button></div>`;
};
function irabHTML(list){return (list||[]).map(x=>`<div class="example"><b style="font-family:var(--poem);font-size:1.2rem">${esc(x.s)}</b><table class="irab">${x.p.map(([w,a])=>`<tr><td>${esc(w)}</td><td>${esc(a)}</td></tr>`).join('')}</table></div>`).join('');}
ROUTES.gb=function(id){const g=D.grammar.find(x=>x.id===id);if(!g)return go('#/grammar');
  ruleLike(g,[['مدينة النحو','#/grammar'],[g.t]],'grammar','G:'+id,(p)=>{const first=!(S.gbs[id]>=PASS);S.gbs[id]=Math.max(p,S.gbs[id]||0);save();if(p>=PASS&&first)dayInc('gb');},g.irab&&g.irab.length?'<h3>🔍 إعراب مبسّط</h3>'+irabHTML(g.irab):'');};

/* ===== حديقة البلاغة ===== */
ROUTES.rhetoric=function(){
  app().innerHTML=crumbs([['الرئيسية','#/home'],['حديقة البلاغة']])+guide('البلاغة فن قول الكلام الجميل في مكانه. في كل زهرة من حديقتي فنّ بلاغي، معه أمثلة، ثم أطلب منك أن تكتشفه بنفسك 🌷','wow')+
  `<div class="grid">${D.rhetoric.map(r=>{const b=S.rhs[r.id];return `<a class="tile" href="#/rh/${r.id}">${b>=PASS?'<span class="badge">✓</span>':''}<span class="ic">${r.e}</span><h3>${esc(r.t)}</h3><span class="small">${r.ex.length} تدريبًا</span></a>`;}).join('')}</div>`;
};
ROUTES.rh=function(id){const r=D.rhetoric.find(x=>x.id===id);if(!r)return go('#/rhetoric');
  ruleLike(r,[['حديقة البلاغة','#/rhetoric'],[r.t]],'rhetoric','H:'+id,(p)=>{S.rhs[id]=Math.max(p,S.rhs[id]||0);save();});};

/* ===== مكتبة الأدب ===== */
function allTexts(){return [...D.poems.map(x=>Object.assign({type:'poem'},x)),...D.prose.map(x=>Object.assign({type:'prose'},x)),...D.reading.map(x=>Object.assign({type:'read'},x)),...(S.custom.texts||[]).map(x=>Object.assign({type:'read',custom:1},x))];}
let LIB={tab:'poem',f:''};
ROUTES.library=function(tab){if(tab)LIB.tab=tab;
  const T=allTexts().filter(t=>t.type===LIB.tab);const cats=[...new Set(T.map(t=>t.cat).filter(Boolean))];if(LIB.f&&!cats.includes(LIB.f))LIB.f='';
  const L=LIB.f?T.filter(t=>t.cat===LIB.f):T;
  app().innerHTML=crumbs([['الرئيسية','#/home'],['مكتبة الأدب']])+guide('مرحبًا بك في مكتبتي! اختر قصيدة أو نصًا، اقرأه، واعرف معاني كلماته وأفكاره وجماله، ثم أجب عن الأسئلة 📚','happy')+
  `<div class="row"><button class="chip ${LIB.tab==='poem'?'on':''}" onclick="LIB.f='';ROUTES.library('poem')">📜 الشعر (${D.poems.length})</button><button class="chip ${LIB.tab==='prose'?'on':''}" onclick="LIB.f='';ROUTES.library('prose')">🖋️ النثر (${D.prose.length})</button><button class="chip ${LIB.tab==='read'?'on':''}" onclick="LIB.f='';ROUTES.library('read')">📖 القراءة والفهم (${D.reading.length+(S.custom.texts||[]).length})</button></div>
  ${cats.length?`<div class="row" style="margin-top:8px"><button class="chip ${!LIB.f?'on':''}" data-f="">الكل</button>${cats.map(c=>`<button class="chip ${LIB.f===c?'on':''}" data-f="${attr(c)}">${esc(c)}</button>`).join('')}</div>`:''}
  <div class="grid wide" style="margin-top:12px">${L.map(t=>`<a class="tile" href="#/text/${t.id}">${S.texts[t.id]!=null?'<span class="badge">✓ '+S.texts[t.id]+'%</span>':''}<span class="small">${esc(t.cat||'')}${t.lvl?' · المستوى '+t.lvl:''}</span><h3>${esc(t.t)}</h3><span class="small">${esc(t.a||'')}${t.era?' · '+esc(t.era):''}</span></a>`).join('')}</div>`;
  qsa('[data-f]').forEach(b=>b.onclick=()=>{LIB.f=b.dataset.f;ROUTES.library();});
};
function textBodyHTML(t){if(t.type==='poem')return `<div class="poem">${t.body.map(b=>Array.isArray(b)?`<div class="bayt"><span>${esc(b[0])}</span><span>${esc(b[1])}</span></div>`:`<div>${esc(b)}</div>`).join('')}</div>`;
  return `<div class="textbody">${String(t.body).split(/\n+/).map(p=>`<p>${esc(p)}</p>`).join('')}</div>`;}
ROUTES.text=function(id){const t=allTexts().find(x=>x.id===id);if(!t)return go('#/library');
  const list=(k,v)=>v&&v.length?`<h3>${k}</h3><ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  app().innerHTML=crumbs([['المكتبة','#/library/'+t.type],[t.t]])+`<div class="card"><h2>${esc(t.t)}</h2><p class="small">${esc(t.a||'')}${t.era?' · '+esc(t.era):''}${t.cat?' · '+esc(t.cat):''}</p>${textBodyHTML(t)}${t.src?`<p class="small">📌 ${esc(t.src)}</p>`:''}</div>
  ${t.gloss&&t.gloss.length?`<div class="card"><h3>📘 معاني المفردات</h3><div class="gloss">${t.gloss.map(([w,m])=>`<div><b>${esc(w)}</b>: ${esc(m)}</div>`).join('')}</div></div>`:''}
  <div class="card">${t.mean?`<h3>💭 المعنى العام</h3><p>${esc(t.mean)}</p>`:''}${t.idea?`<h3>🎯 الفكرة الرئيسية</h3><p>${esc(t.idea)}</p>`:''}${list('🧩 الأفكار الفرعية',t.sub)}${list('✨ الجماليات اللغوية',t.beauty)}</div>
  <div class="row"><a class="btn" href="#/stage/text/${t.id}">🎤 تدرّب على قراءته جهرًا</a>${t.q&&t.q.length?`<button class="btn main" id="tq">❓ أسئلة الفهم (${t.q.length})</button>`:''}</div><div id="qhost"></div>`;
  if(!S.texts[id]&&!(t.q&&t.q.length)){S.texts[id]=100;save();}
  const b=$('tq');if(b)b.onclick=()=>{b.disabled=true;new Quiz($('qhost'),t.q.map((e,k)=>Object.assign({},e,{_k:'T:'+id+':'+k})),{sec:'reading',key:'T:'+id,onDone:(p,ok,n)=>{const first=S.texts[id]==null;S.texts[id]=Math.max(p,S.texts[id]||0);S.readLog.push({d:new Date().toISOString(),t:t.t,p});if(S.readLog.length>200)S.readLog.shift();save();if(first)dayInc('texts');addXP(ok*2+5,'قراءة');$('qhost').innerHTML=resultHTML(p,ok,n,`<a class="btn main" href="#/library/${t.type}">العودة للمكتبة</a>`);checkBadges();}});};
};

/* ===== كنوز التراث ===== */
const HTABS=[['proverbs','📜','الأمثال والحكم'],['riddles','🧩','الألغاز والفوازير'],['stories','🏺','حكايات وقصص الأمثال'],['anecdotes','😄','نوادر وطرائف لغوية'],['words','💎','كلمات قديمة وأسماء الأشياء'],['tgames','🎲','ألعاب لغوية من التراث']];
ROUTES.heritage=function(tab){tab=tab||'proverbs';
  let body='';const H=D.heritage;
  if(tab==='proverbs')body=`<p class="small">أمثال عربية قديمة موثقة، ومعظمها في «مجمع الأمثال» للميداني، مع معناها ومتى نقولها.</p>`+D.proverbs.map((p,i)=>`<div class="card"><h3 style="font-family:var(--poem);font-size:1.3rem">«${esc(p.p)}»</h3><p style="margin:4px 0"><b>المعنى:</b> ${esc(p.m)}</p>${p.use?`<p class="small" style="margin:2px 0">🗓️ <b>متى نقوله؟</b> ${esc(p.use)}</p>`:''}${p.story?`<details><summary>📖 قصة المثل</summary><p>${esc(p.story)}</p></details>`:''}<p class="small">📌 ${esc(p.src||'')}</p></div>`).join('')+`<button class="btn gold" onclick="go('#/game/proverb')">🎮 لعبة: أكمل المثل</button>`;
  if(tab==='riddles')body=`<p class="small">ألغاز تراثية وألغاز لغوية من إعداد المملكة. حاول قبل أن تكشف الجواب!</p>`+D.riddles.map((r,i)=>`<div class="card"><p style="margin:0">${i+1}. ${esc(r.q)} <span class="tag ${r.src==='تراثي'?'warn':''}">${esc(r.src||'')}</span></p><details><summary>${r.h?'💡 تلميح ثم الجواب':'👀 اكشف الجواب'}</summary>${r.h?`<p class="small">تلميح: ${esc(r.h)}</p>`:''}<p><b>الجواب:</b> ${esc(r.a)}</p></details></div>`).join('');
  if(tab==='stories')body=H.stories.map(s=>`<div class="card"><h3>${esc(s.t)} <span class="tag ${s.kind==='موثّق'?'ok':'warn'}">${esc(s.kind)}</span></h3><div class="textbody">${s.body.split(/\n+/).map(p=>`<p>${esc(p)}</p>`).join('')}</div><p class="small">📌 ${esc(s.src)}</p></div>`).join('');
  if(tab==='anecdotes')body=H.anecdotes.map(s=>`<div class="card"><h3>${esc(s.t)} <span class="tag ${s.kind==='موثّق'?'ok':'warn'}">${esc(s.kind)}</span></h3><p>${esc(s.body)}</p><p class="small">📌 ${esc(s.src)}</p></div>`).join('');
  if(tab==='words')body=H.names.map(n=>`<div class="card"><h3>${esc(n.t)}</h3><table class="tbl">${n.items.map(([a,b])=>`<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join('')}</table>${n.src?`<p class="small">📌 ${esc(n.src)}</p>`:''}</div>`).join('');
  if(tab==='tgames')body=H.games.map(g=>`<div class="card"><h3>${esc(g.t)}</h3><p>${esc(g.body)}</p>${g.link?`<a class="btn sm gold" href="${g.link}">جرّبها في المملكة</a>`:''}</div>`).join('');
  app().innerHTML=crumbs([['الرئيسية','#/home'],['كنوز التراث']])+guide('في خزانة التراث كنوز من الأمثال والألغاز والحكايات. أخبرك دائمًا: هل القصة موثّقة، أم حكاية شعبية يتناقلها الناس 🏺','wow')+
  `<div class="row">${HTABS.map(([k,e,n])=>`<a class="chip ${tab===k?'on':''}" href="#/heritage/${k}">${e} ${n}</a>`).join('')}</div><div style="margin-top:10px">${body}</div>`;
};
