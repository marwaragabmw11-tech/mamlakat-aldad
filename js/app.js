/* التطبيق: التوجيه والصفحات العامة */
'use strict';
const app=()=>$('main');
const SECTIONS=[
 {id:'levels',e:'🏰',n:'مستويات المملكة',d:'رحلة متدرجة من الحروف إلى الأدب',h:'#/levels'},
 {id:'dict',e:'📖',n:'المعجم المصوّر',d:'كلمات ومعانٍ وجذور وأمثلة',h:'#/dict'},
 {id:'dictation',e:'🎧',n:'أكاديمية الإملاء الصوتي',d:'استمع واكتب وصحّح أخطاءك',h:'#/dictation'},
 {id:'writing',e:'✏️',n:'مختبر الكتابة',d:'قواعد الإملاء خطوة بخطوة',h:'#/writing'},
 {id:'grammar',e:'🏙️',n:'مدينة النحو',d:'مبانٍ وأبواب لقواعد الجملة',h:'#/grammar'},
 {id:'rhetoric',e:'🌷',n:'حديقة البلاغة',d:'تشبيه واستعارة وجمال الكلام',h:'#/rhetoric'},
 {id:'library',e:'📚',n:'مكتبة الأدب',d:'شعر ونثر ونصوص للقراءة',h:'#/library'},
 {id:'stage',e:'🎤',n:'مسرح الإلقاء',d:'سجّل صوتك وتدرّب على الفصحى',h:'#/stage'},
 {id:'games',e:'🎮',n:'ألعاب العربية',d:'تسع عشرة لعبة بثلاثة مستويات',h:'#/games'},
 {id:'heritage',e:'🏺',n:'كنوز التراث',d:'ألغاز وأمثال وحكايات ونوادر',h:'#/heritage'},
 {id:'notebook',e:'🖋️',n:'دفتر الإبداع',d:'اكتب قصتك ووصفك ورسائلك',h:'#/notebook'},
 {id:'review',e:'🔁',n:'المراجعة الذكية',d:'أسئلة أخطأت فيها تعود إليك',h:'#/review'}
];
function renderTop(){
  const n=Object.keys(S.lessons).filter(lessonDone).length;const L=currentLevel();
  $('topbar').innerHTML=`<a class="brand" href="#/home" aria-label="الرئيسية"><span class="mascot" style="width:34px">${dadoon('happy')}</span><span class="bt">مملكة الضاد</span></a><div class="grow"></div>
  <a class="xpbox" href="#/dash" style="text-decoration:none;color:inherit" title="لوحتي"><span>${S.avatar}</span><span>${L?L.icon:''} ${S.xp} ✨</span><span class="xpbar"><i style="width:${L?levelProgress(L):0}%"></i></span></a>
  <a class="iconbtn" href="#/search" title="البحث" aria-label="البحث">🔍</a>
  <button class="iconbtn" onclick="toggleSound()" title="المؤثرات الصوتية" aria-label="المؤثرات الصوتية">${S.set.sound?'🔔':'🔕'}</button>
  <a class="iconbtn" href="#/settings" title="الإعدادات" aria-label="الإعدادات">⚙️</a>`;
}
function renderNav(r){const items=[['home','🏠','الرئيسية'],['levels','🏰','المستويات'],['dict','📖','المعجم'],['games','🎮','الألعاب'],['dash','🌟','لوحتي']];
  $('bottomnav').innerHTML=items.map(([k,e,n])=>`<a href="#/${k}" class="${r===k?'on':''}"><b>${e}</b>${n}</a>`).join('');}
function toggleSound(){S.set.sound=!S.set.sound;save();renderTop();toast(S.set.sound?'المؤثرات تعمل 🔔':'المؤثرات متوقفة 🔕');}
function applySettings(){document.documentElement.style.setProperty('--fs',S.set.fs||1);document.body.classList.toggle('reading',!!S.set.reading);document.body.classList.toggle('dark',!!S.set.dark);}

const ROUTES={};
function route(){AUDIO.stop();if(window.STAGE)STAGE.cleanup();if(window.GAME)GAME.stop();
  const h=decodeURIComponent(location.hash.replace(/^#\/?/,''))||'home';const [r,...a]=h.split('/');
  renderNav(r);renderTop();const f=ROUTES[r]||ROUTES.home;
  try{f(...a);}catch(e){console.error(e);app().innerHTML=`<div class="card">${guide('عذرًا، حدث خطأ في هذه الصفحة. جرّب العودة للرئيسية.','think')}<a class="btn" href="#/home">الرئيسية</a></div>`;}
  window.scrollTo(0,0);app().focus({preventScroll:true});}
function go(h){location.hash=h;}
function crumbs(list){return `<div class="crumbs">${list.map(([t,h])=>h?`<a href="${h}">${esc(t)}</a>`:esc(t)).join(' › ')}</div>`;}

/* ===== الرئيسية ===== */
function wordOfDay(){const all=D.dict;return all.length?all[dayNum()%all.length]:null;}
const CHALS=[
 {k:'lessons',n:2,t:'أكمل درسين من المستويات',h:'#/levels'},{k:'words',n:5,t:'تعلّم 5 كلمات جديدة من المعجم',h:'#/dict'},
 {k:'dict',n:5,t:'أنجز 5 تدريبات إملاء صوتي',h:'#/dictation'},{k:'games',n:3,t:'العب 3 جولات من ألعاب العربية',h:'#/games'},
 {k:'texts',n:1,t:'اقرأ نصًا من المكتبة وأجب عن أسئلته',h:'#/library'},{k:'notes',n:1,t:'اكتب نصًا قصيرًا في دفتر الإبداع',h:'#/notebook'},
 {k:'stage',n:1,t:'سجّل إلقاءً في مسرح الإلقاء',h:'#/stage'},{k:'rules',n:1,t:'أتقن قاعدة من مختبر الكتابة',h:'#/writing'},
 {k:'gb',n:1,t:'افتح مبنى في مدينة النحو وأنجز تدريبه',h:'#/grammar'},{k:'rev',n:5,t:'راجع 5 أسئلة في المراجعة الذكية',h:'#/review'}];
function chalToday(){return CHALS[dayNum()%CHALS.length];}
function dayInc(k){const t=today();S.dayLog=S.dayLog||{};const d=S.dayLog[t]||(S.dayLog[t]={});d[k]=(d[k]||0)+1;
  for(const x of Object.keys(S.dayLog))if(x<addDays(-30))delete S.dayLog[x];
  const c=chalToday();if(c.k===k&&d[k]>=c.n&&!S.chal[t]){S.chal[t]=1;save();setTimeout(()=>{addXP(20,'تحدي اليوم');confetti();},600);}else save();}
function chalBox(){const c=chalToday(),t=today(),d=(S.dayLog&&S.dayLog[t])||{},v=Math.min(d[c.k]||0,c.n),dn=!!S.chal[t];
  return `<div class="card" style="border-color:var(--gold)"><h3>🎯 تحدي اليوم</h3><p style="margin:4px 0">${esc(c.t)}</p><div class="progress"><i style="width:${pct(v,c.n)}%"></i></div><div class="row" style="margin-top:8px"><span class="small">${v} / ${c.n} ${dn?'· ✅ أنجزته! +20':''}</span><div class="grow" style="flex:1"></div><a class="btn sm main" href="${c.h}">ابدأ</a></div></div>`;}
function nextLesson(){for(const L of D.levels){if(!levelOpen(L.n))break;for(const u of L.units)for(const l of u.lessons)if(!lessonDone(l.id))return {L,u,l};}return null;}
ROUTES.home=function(){
  if(!S.name){app().innerHTML=`<div class="hero"><div class="pattern"></div><div style="width:110px;flex:none" class="mascot bob">${dadoon('excited')}</div><div><h1>مرحبًا بك في مملكة الضاد!</h1><p>أنا ضادون، تنين صغير أحب العربية كثيرًا، وسأرافقك في رحلتك.</p></div></div>
  <div class="card"><label for="nm">ما اسمك يا صديقي؟</label><input type="text" id="nm" maxlength="24" placeholder="اكتب اسمك"><label>اختر صورتك</label><div class="avatars" id="av">${['🐉','🦁','🦉','🐱','🦊','🐼','🐢','🦋','🌙','⭐','👧','👦','🧕','🧒'].map(a=>`<button data-a="${a}" class="${S.avatar===a?'on':''}">${a}</button>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn main" id="start">لنبدأ الرحلة 🚀</button></div></div>`;
    qsa('#av button').forEach(b=>b.onclick=()=>{qsa('#av button').forEach(x=>x.classList.remove('on'));b.classList.add('on');S.avatar=b.dataset.a;});
    $('start').onclick=()=>{const v=$('nm').value.trim();if(!v){toast('اكتب اسمك أولًا 🙂');return;}S.name=v.slice(0,24);save();markDay();route();};return;}
  const w=wordOfDay(),nx=nextLesson(),rv=dueRev().length,fact=FACTS[dayNum()%FACTS.length];
  const hr=new Date().getHours();const hi=hr<12?'صباح الخير':hr<18?'نهارك سعيد':'مساء الخير';
  app().innerHTML=`<div class="hero"><div class="pattern"></div><div style="width:100px;flex:none" class="mascot bob">${dadoon('happy')}</div><div><h1>${hi} يا ${esc(S.name)}!</h1><p>هل نتعلم اليوم شيئًا جميلًا من لغة الضاد؟ 🔥 سلسلة أيامك: ${streak()}</p></div></div>
  ${nx?`<div class="card"><h3>▶️ تابع رحلتك</h3><p style="margin:4px 0">${nx.L.icon} ${esc(nx.L.name)} › ${esc(nx.u.name)} › <b>${esc(nx.l.t)}</b></p><a class="btn main" href="#/lesson/${nx.l.id}">أكمل الدرس</a></div>`:''}
  ${chalBox()}
  ${rv?`<div class="card"><h3>🔁 مراجعة ذكية</h3><p style="margin:4px 0">عندك ${rv} سؤالًا حان وقت مراجعتها.</p><a class="btn gold" href="#/review">راجع الآن</a></div>`:''}
  <div class="grid wide">${w?`<a class="tile" href="#/word/${w.id}"><span class="small">📅 كلمة اليوم</span><div class="word-head"><div class="word-pic" style="width:60px;height:60px;font-size:2.2rem">${w.e||'🔤'}</div><div><h3 class="word-title" style="font-size:1.6rem">${esc(w.w)}</h3><span class="small">${esc(w.m)}</span></div></div></a>`:''}
  <div class="tile" style="cursor:default"><span class="small">💡 هل تعلم؟</span><p style="margin:4px 0">${esc(fact)}</p></div></div>
  <h2>أقسام المملكة</h2><div class="grid">${SECTIONS.map(s=>`<a class="tile" href="${s.h}"><span class="ic">${s.e}</span><h3>${s.n}</h3><span class="small">${s.d}</span></a>`).join('')}<a class="tile" href="#/dash"><span class="ic">🌟</span><h3>لوحتي</h3><span class="small">تقدمي وشاراتي وأخطائي</span></a><a class="tile" href="#/parent"><span class="ic">🔐</span><h3>ركن ولي الأمر</h3><span class="small">متابعة وإدارة المحتوى</span></a></div>`;
  if(markDay())setTimeout(()=>addXP(5,'زيارة اليوم'),500);
};

/* ===== المستويات ===== */
ROUTES.levels=function(){
  app().innerHTML=crumbs([['الرئيسية','#/home'],['المستويات']])+guide('لكل مستوى ثماني وحدات، وفي كل وحدة خمسة دروس. يُفتح المستوى التالي عندما تُتقن '+LEVEL_UNLOCK+'% من دروس المستوى الحالي. ويمكنك دائمًا مراجعة ما سبق.','excited')+
  `<div class="grid wide">${D.levels.map(L=>{const o=levelOpen(L.n),p=levelProgress(L);return `<a class="tile ${o?'':'locked'}" href="${o?'#/level/'+L.n:'javascript:void(0)'}" ${o?'':`onclick="toast('🔒 أتقن ${LEVEL_UNLOCK}% من المستوى السابق لفتح هذا المستوى')"`}>${p>=100?'<span class="badge">مكتمل ✓</span>':''}<span class="ic">${o?L.icon:'🔒'}</span><h3>${L.n}. ${esc(L.name)}</h3><span class="small">${esc(L.desc)}</span><div class="progress"><i style="width:${p}%"></i></div><span class="small">${p}% · ${L.units.length} وحدات</span></a>`;}).join('')}</div>`;
};
ROUTES.level=function(n){n=+n;const L=D.levels.find(x=>x.n===n);if(!L)return go('#/levels');
  if(!levelOpen(n)){app().innerHTML=crumbs([['المستويات','#/levels'],[L.name]])+guide('هذا المستوى مغلق بعد 🔒 أكمل المستوى السابق أولًا.','think');return;}
  app().innerHTML=crumbs([['الرئيسية','#/home'],['المستويات','#/levels'],[L.name]])+`<div class="hero" style="background:linear-gradient(135deg,${L.color||'#1f4e5f'},#2f7a8c)"><div class="pattern"></div><span style="font-size:3rem">${L.icon}</span><div><h1>المستوى ${n}: ${esc(L.name)}</h1><p>${esc(L.desc)}</p></div></div>`+
  L.units.map((u,ui)=>{const done=u.lessons.filter(l=>lessonDone(l.id)).length;return `<div class="card"><h3>${u.icon||'📘'} الوحدة ${ui+1}: ${esc(u.name)} <span class="pill">${done}/${u.lessons.length}</span></h3><div class="grid">${u.lessons.map((l,li)=>{const s=S.lessons[l.id];return `<a class="tile" href="#/lesson/${l.id}">${lessonDone(l.id)?'<span class="badge">✓ '+s.best+'%</span>':s?'<span class="badge" style="background:var(--sun);color:#7a5a10">'+s.best+'%</span>':''}<span class="small">الدرس ${li+1}</span><h3 style="font-size:1rem">${esc(l.t)}</h3></a>`;}).join('')}</div></div>`;}).join('');
};
function findLesson(id){for(const L of D.levels)for(const u of L.units){const i=u.lessons.findIndex(l=>l.id===id);if(i>=0)return {L,u,l:u.lessons[i],i};}return null;}
ROUTES.lesson=function(id){const f=findLesson(id);if(!f)return go('#/levels');const {L,u,l,i}=f;
  if(!levelOpen(L.n))return go('#/level/'+L.n);
  const nextL=u.lessons[i+1]||(()=>{const ui=L.units.indexOf(u);return L.units[ui+1]?L.units[ui+1].lessons[0]:null;})();
  app().innerHTML=crumbs([['المستويات','#/levels'],[L.name,'#/level/'+L.n],[u.name]])+`<div class="card lesson-body"><h2>${esc(l.t)}</h2>${l.body||''}</div><div class="row"><button class="btn main" id="startq">✍️ ابدأ التدريبات (${l.ex.length})</button>${nextL?`<a class="btn" href="#/lesson/${nextL.id}">الدرس التالي ←</a>`:''}</div><div id="qhost"></div>`;
  $('startq').onclick=()=>{$('startq').parentNode.classList.add('hide');qsa('.lesson-body').forEach(x=>x.classList.add('hide'));
    const items=l.ex.map((e,k)=>Object.assign({},e,{_k:'L:'+l.id+':'+k}));
    new Quiz($('qhost'),items,{sec:'lesson:'+L.n,key:'L:'+l.id,onDone:(p,ok,n)=>{const prev=S.lessons[l.id];const first=!lessonDone(l.id);S.lessons[l.id]={best:Math.max(p,prev?prev.best:0),n:(prev?prev.n:0)+1,last:today()};save();
      if(p>=PASS&&first){dayInc('lessons');}
      addXP(ok*2+(p>=PASS&&first?15:0),p>=PASS?'أتقنت الدرس':'');if(p>=PASS){confetti();SFX.win();}
      const wasOpen=levelOpen(L.n+1);
      $('qhost').innerHTML=resultHTML(p,ok,n,`<div class="row center"><button class="btn" onclick="route()">↺ أعد الدرس</button>${nextL?`<a class="btn main" href="#/lesson/${nextL.id}">الدرس التالي ←</a>`:`<a class="btn main" href="#/level/${L.n}">العودة للمستوى</a>`}</div>`);
      if(D.levels.find(x=>x.n===L.n+1)&&levelOpen(L.n+1)&&!S['opened'+(L.n+1)]){S['opened'+(L.n+1)]=1;save();setTimeout(()=>modal(guide('مبارك! 🎉 فتحتَ المستوى '+(L.n+1)+': <b>'+esc(D.levels.find(x=>x.n===L.n+1).name)+'</b>','cheer')+`<a class="btn main" href="#/level/${L.n+1}" onclick="$('modal').hidden=true">ادخل المستوى الجديد</a>`),1200);confetti();}
      checkBadges();}});};
};

/* ===== المراجعة ===== */
ROUTES.review=function(){const due=dueRev();const all=Object.keys(S.rev).length;
  app().innerHTML=crumbs([['الرئيسية','#/home'],['المراجعة الذكية']])+guide(due.length?`حان وقت مراجعة ${due.length} سؤالًا. كل سؤال تجيبه صحيحًا يعود بعد مدة أطول، حتى تتقنه تمامًا 🧠`:all?`لا توجد أسئلة مستحقة اليوم. لديك ${all} سؤالًا ستعود في أيامها 🌙`:'لا توجد أخطاء للمراجعة. رائع! 🌟 عندما تخطئ في سؤال سأعيده إليك لاحقًا.','think')+`<div id="qhost"></div>`;
  if(!due.length){if(all)$('qhost').innerHTML=`<button class="btn" id="early">راجع مبكرًا الآن (${Math.min(all,10)})</button>`;const e=$('early');if(e)e.onclick=()=>runRev(Object.entries(S.rev).slice(0,10));return;}
  runRev(due.slice(0,15));
};
function runRev(list){const items=list.map(([k,r])=>Object.assign({},r.item,{_k:k,_ord:null}));
  new Quiz($('qhost'),items,{review:true,noRev:true,sec:'review',onDone:(p,ok,n)=>{for(let i=0;i<ok;i++)dayInc('rev');addXP(ok*2,'مراجعة');$('qhost').innerHTML=resultHTML(p,ok,n,`<a class="btn main" href="#/review">متابعة</a>`);checkBadges();}});}

/* ===== البحث ===== */
ROUTES.search=function(q){q=q||'';
  app().innerHTML=crumbs([['الرئيسية','#/home'],['البحث']])+`<div class="card"><label for="sq">ابحث في المملكة: كلمة، درس، قاعدة، مثل، نص…</label><div class="row"><input type="search" id="sq" value="${attr(q)}" placeholder="مثلًا: الهمزة، شجرة، التشبيه" style="flex:1"><button class="btn main" id="sgo">بحث</button></div></div><div id="sres"></div>`;
  const run=()=>{const v=$('sq').value.trim();history.replaceState(null,'','#/search/'+encodeURIComponent(v));$('sres').innerHTML=v?searchHTML(v):'';};
  $('sgo').onclick=run;$('sq').onkeydown=e=>{if(e.key==='Enter')run();};if(q)run();setTimeout(()=>$('sq').focus(),50);
};
function searchHTML(v){const n=normLoose(v);const has=s=>normLoose(s).includes(n);const R=[];
  D.dict.forEach(w=>{if(has(w.w)||has(w.m)||(w.syn||[]).some(has))R.push(['📖 المعجم',w.w+' — '+w.m,'#/word/'+w.id]);});
  D.levels.forEach(L=>L.units.forEach(u=>u.lessons.forEach(l=>{if(has(l.t)||has(u.name))R.push(['🏰 '+L.name,l.t,levelOpen(L.n)?'#/lesson/'+l.id:'#/level/'+L.n]);})));
  D.spelling.forEach(r=>{if(has(r.t))R.push(['✏️ مختبر الكتابة',r.t,'#/rule/'+r.id]);});
  D.grammar.forEach(r=>{if(has(r.t))R.push(['🏙️ مدينة النحو',r.t,'#/gb/'+r.id]);});
  D.rhetoric.forEach(r=>{if(has(r.t))R.push(['🌷 البلاغة',r.t,'#/rh/'+r.id]);});
  allTexts().forEach(t=>{if(has(t.t)||has(t.a||'')||(t.body&&has(t.body.slice(0,400))))R.push(['📚 المكتبة',t.t,'#/text/'+t.id]);});
  D.proverbs.forEach((p,i)=>{if(has(p.p))R.push(['🏺 مثل',p.p,'#/heritage/proverbs']);});
  return R.length?`<div class="card"><p class="small">${R.length} نتيجة</p>${R.slice(0,80).map(r=>`<a class="wl" style="margin:6px 0" href="${r[2]}"><span class="pill">${r[0]}</span>${esc(r[1])}</a>`).join('')}</div>`:guide('لم أجد نتائج. جرّب كلمة أخرى أو تأكد من الإملاء 🔍','think');}

/* ===== الإعدادات ===== */
ROUTES.settings=function(){
  app().innerHTML=crumbs([['الرئيسية','#/home'],['الإعدادات']])+`<div class="card"><h3>⚙️ الإعدادات</h3>
  <label>حجم الخط</label><div class="row">${[[.9,'صغير'],[1,'عادي'],[1.15,'كبير'],[1.3,'كبير جدًا']].map(([v,n])=>`<button class="chip ${S.set.fs==v?'on':''}" data-fs="${v}">${n}</button>`).join('')}</div>
  <label>وضع العرض</label><div class="row"><button class="chip ${S.set.reading?'on':''}" id="rd">📖 وضع القراءة المريح</button><button class="chip ${S.set.dark?'on':''}" id="dk">🌙 الوضع الليلي</button></div>
  <label>الأصوات</label><div class="row"><button class="chip ${S.set.sound?'on':''}" id="snd">🔔 المؤثرات</button><button class="chip ${S.set.tts?'on':''}" id="tts">🔈 صوت المتصفح للنطق</button></div>
  <label>سرعة صوت المتصفح</label><div class="row">${[[.7,'بطيئة'],[.85,'متوسطة'],[1,'عادية']].map(([v,n])=>`<button class="chip ${S.set.rate==v?'on':''}" data-rt="${v}">${n}</button>`).join('')}<button class="btn sm" onclick="sayIt('','مرحبًا بك في مملكة الضاد')">🔊 تجربة</button></div>
  <p class="small">${AUDIO.hasTTS()?'✅ يوجد صوت عربي في متصفحك.':'⚠️ لا يوجد صوت عربي في هذا المتصفح. ستعمل التسجيلات التي يضيفها ولي الأمر، وإلا ستظهر الكلمات مكتوبة لثوانٍ.'}</p>
  <label>اسمي وصورتي</label><div class="row"><input type="text" id="nm" value="${attr(S.name)}" maxlength="24" style="max-width:240px"><button class="btn sm" id="nmok">حفظ</button></div>
  <div class="avatars" id="av" style="margin-top:8px">${['🐉','🦁','🦉','🐱','🦊','🐼','🐢','🦋','🌙','⭐','👧','👦','🧕','🧒'].map(a=>`<button data-a="${a}" class="${S.avatar===a?'on':''}">${a}</button>`).join('')}</div></div>
  <div class="card small">💾 تقدّمك محفوظ على هذا الجهاز وهذا المتصفح فقط. إذا حُذفت بيانات المتصفح ضاع التقدم، لذلك يستطيع ولي الأمر تنزيل نسخة احتياطية من ركن ولي الأمر.</div>`;
  qsa('[data-fs]').forEach(b=>b.onclick=()=>{S.set.fs=+b.dataset.fs;save();applySettings();route();});
  qsa('[data-rt]').forEach(b=>b.onclick=()=>{S.set.rate=+b.dataset.rt;save();route();});
  $('rd').onclick=()=>{S.set.reading=!S.set.reading;save();applySettings();route();};$('dk').onclick=()=>{S.set.dark=!S.set.dark;save();applySettings();route();};
  $('snd').onclick=()=>{S.set.sound=!S.set.sound;save();route();};$('tts').onclick=()=>{S.set.tts=!S.set.tts;save();route();};
  $('nmok').onclick=()=>{const v=$('nm').value.trim();if(v){S.name=v;save();toast('تم الحفظ');renderTop();}};
  qsa('#av button').forEach(b=>b.onclick=()=>{S.avatar=b.dataset.a;save();route();});
};

/* ===== لوحة الطفل ===== */
ROUTES.dash=function(){
  const done=Object.keys(S.lessons).filter(lessonDone).length,total=D.levels.reduce((a,L)=>a+levelLessons(L).length,0),L=currentLevel();
  const units=D.levels.reduce((a,L)=>a+L.units.filter(u=>u.lessons.every(l=>lessonDone(l.id))).length,0);
  const learned=Object.keys(S.learned).map(id=>D.dict.find(w=>w.id===id)).filter(Boolean).slice(-30).reverse();
  const errs=Object.entries(S.errs).sort((a,b)=>b[1]-a[1]);
  app().innerHTML=crumbs([['الرئيسية','#/home'],['لوحتي']])+`<div class="hero"><div class="pattern"></div><span style="font-size:3rem">${S.avatar}</span><div><h1>${esc(S.name||'صديقي')}</h1><p>${L.icon} المستوى ${L.n}: ${esc(L.name)} · ${levelProgress(L)}%</p></div></div>
  <div class="stats" style="margin-top:12px"><div class="stat"><b>${S.xp}</b>نقطة خبرة</div><div class="stat"><b>${done}/${total}</b>درس مكتمل</div><div class="stat"><b>${units}</b>وحدة مكتملة</div><div class="stat"><b>${Object.keys(S.learned).length}</b>كلمة تعلمتها</div><div class="stat"><b>🔥 ${streak()}</b>أيام متتالية</div><div class="stat"><b>${Object.keys(S.rev).length}</b>سؤال للمراجعة</div></div>
  ${chalBox()}
  <div class="card"><h3>🏰 تقدمي في المستويات</h3>${D.levels.map(x=>`<div class="row" style="margin:4px 0"><span style="width:170px">${levelOpen(x.n)?x.icon:'🔒'} ${esc(x.name)}</span><div class="progress" style="flex:1"><i style="width:${levelProgress(x)}%"></i></div><span class="small">${levelProgress(x)}%</span></div>`).join('')}</div>
  <div class="card"><h3>🏅 شاراتي (${Object.keys(S.badges).length}/${BADGES.length})</h3><div class="badges">${BADGES.map(b=>`<div class="bdg ${S.badges[b.id]?'':'off'}" title="${attr(b.d)}"><span class="e">${b.e}</span><b>${b.n}</b><br>${esc(b.d)}</div>`).join('')}</div></div>
  <div class="card"><h3>🔤 كلمات جديدة تعلمتها</h3>${learned.length?`<div class="wlist">${learned.map(w=>`<a class="wl" href="#/word/${w.id}"><span>${w.e||'🔤'}</span>${esc(w.w)}</a>`).join('')}</div>`:'<p class="small">افتح المعجم وتعلّم كلماتك الأولى.</p>'}</div>
  <div class="card"><h3>🩺 أخطاء أحتاج إلى مراجعتها</h3>${errs.length?`<table class="tbl"><tr><th>نوع الخطأ في الإملاء</th><th>مرات</th><th></th></tr>${errs.slice(0,8).map(([k,v])=>`<tr><td>${esc(ERRCAT[k]?ERRCAT[k].n:k)}</td><td>${v}</td><td>${ERRCAT[k]&&ERRCAT[k].r?`<a class="btn sm" href="#/rule/${ERRCAT[k].r}">راجع القاعدة</a>`:''}</td></tr>`).join('')}</table>`:'<p class="small">لا توجد أخطاء إملائية مسجلة بعد.</p>'}<div class="row" style="margin-top:8px"><a class="btn gold" href="#/review">🔁 المراجعة الذكية (${dueRev().length} اليوم)</a></div></div>
  <div class="card"><h3>🎧 سجل الإملاء</h3>${S.dictLog.length?`<table class="tbl"><tr><th>التاريخ</th><th>النص</th><th>النتيجة</th></tr>${S.dictLog.slice(-10).reverse().map(x=>`<tr><td>${fmtDate(x.d)}</td><td>${esc(x.t.slice(0,40))}</td><td>${x.p}%</td></tr>`).join('')}</table>`:'<p class="small">لم تبدأ تدريبات الإملاء بعد.</p>'}</div>
  <div class="card"><h3>📚 سجل القراءة والإلقاء</h3>${S.readLog.length||S.stageLog.length?`<table class="tbl"><tr><th>التاريخ</th><th>النشاط</th><th>النتيجة</th></tr>${[...S.readLog.map(x=>[x.d,'📖 قراءة: '+x.t,x.p+'%']),...S.stageLog.map(x=>[x.d,'🎤 إلقاء: '+x.t,Math.round(x.dur)+' ث'])].sort((a,b)=>a[0]<b[0]?1:-1).slice(0,12).map(r=>`<tr><td>${fmtDate(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td></tr>`).join('')}</table>`:'<p class="small">اقرأ نصًا من المكتبة أو سجّل إلقاءً في المسرح.</p>'}</div>`;
};
