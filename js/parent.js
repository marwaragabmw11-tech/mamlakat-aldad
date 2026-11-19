/* ركن ولي الأمر: رمز سري، تقارير، تحكم، إضافة محتوى، تسجيلات صوتية، نسخ احتياطي */
'use strict';
const PARENT={ok:0,rec:null,stream:null,
  unlocked(){return this.ok&&Date.now()-this.ok<30*60*1000;},
  stopRec(){try{this.rec&&this.rec.state!=='inactive'&&this.rec.stop();}catch(e){}try{this.stream&&this.stream.getTracks().forEach(t=>t.stop());}catch(e){}this.rec=this.stream=null;}};
const PTABS=[['report','📊','التقرير'],['control','⚙️','التحكم'],['add','➕','إضافة محتوى'],['audio','🎙️','التسجيلات'],['backup','💾','النسخ الاحتياطي'],['pin','🔐','الرمز السري']];
const SECN={lessons:'دروس المستويات',vocab:'المعجم',spell:'مختبر الكتابة',dictation:'الإملاء',grammar:'النحو',rhetoric:'البلاغة',reading:'القراءة والفهم',games:'الألعاب',stage:'الإلقاء',notes:'الكتابة الإبداعية',review:'المراجعة'};
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);

ROUTES.parent=function(tab){
  if(!S.pin)return pinSetup();
  if(!PARENT.unlocked())return pinAsk(tab);
  PARENT.ok=Date.now();tab=tab||'report';
  const body={report:pReport,control:pControl,add:pAdd,audio:pAudio,backup:pBackup,pin:pPin}[tab]||pReport;
  app().innerHTML=crumbs([['الرئيسية','#/home'],['ركن ولي الأمر']])+`<div class="row noprint" style="margin-bottom:8px">${PTABS.map(([k,e,n])=>`<a class="chip ${tab===k?'on':''}" href="#/parent/${k}">${e} ${n}</a>`).join('')}<button class="chip" id="plock">🔒 قفل</button></div><div id="pbody"></div>`;
  $('plock').onclick=()=>{PARENT.ok=0;go('#/home');};
  body($('pbody'));
};

function pinSetup(){app().innerHTML=crumbs([['الرئيسية','#/home'],['ركن ولي الأمر']])+`<div class="card" style="max-width:420px;margin:auto"><h2>🔐 إنشاء رمز ولي الأمر</h2><p>اختر رمزًا من 4 إلى 8 أرقام لحماية هذا الركن من التغيير غير المقصود.</p>
  <input type="password" inputmode="numeric" id="p1" placeholder="الرمز" maxlength="8" style="width:100%"><input type="password" inputmode="numeric" id="p2" placeholder="أعد كتابة الرمز" maxlength="8" style="width:100%;margin-top:8px">
  <button class="btn main" id="pok" style="margin-top:10px">حفظ الرمز</button><p class="small">⚠️ احفظ الرمز جيدًا. إن نسيته يمكنك مسح بيانات الموقع من المتصفح، وسيضيع معها التقدم إن لم توجد نسخة احتياطية.</p></div>`;
  $('pok').onclick=async()=>{const a=$('p1').value.trim(),b=$('p2').value.trim();if(!/^\d{4,8}$/.test(a))return toast('الرمز من 4 إلى 8 أرقام');if(a!==b)return toast('الرمزان غير متطابقين');S.pin=await sha(a);save();PARENT.ok=Date.now();toast('تم حفظ الرمز ✅');ROUTES.parent();};}
let PIN_FAIL=0,PIN_WAIT=0;
function pinAsk(tab){app().innerHTML=crumbs([['الرئيسية','#/home'],['ركن ولي الأمر']])+`<div class="card" style="max-width:420px;margin:auto">${guide('هذا الركن لولي الأمر. اطلب منه أن يكتب الرمز 🙂','think')}<input type="password" inputmode="numeric" id="pin" placeholder="رمز ولي الأمر" maxlength="8" style="width:100%"><button class="btn main" id="pgo" style="margin-top:10px">دخول</button></div>`;
  const tryIt=async()=>{if(Date.now()<PIN_WAIT)return toast('انتظر قليلًا ثم حاول مرة أخرى');if(await sha($('pin').value.trim())===S.pin){PIN_FAIL=0;PARENT.ok=Date.now();ROUTES.parent(tab);}else{PIN_FAIL++;if(PIN_FAIL>=5){PIN_WAIT=Date.now()+60000;PIN_FAIL=0;}toast('الرمز غير صحيح');$('pin').value='';}};
  $('pgo').onclick=tryIt;$('pin').onkeydown=e=>{if(e.key==='Enter')tryIt();};setTimeout(()=>$('pin')&&$('pin').focus(),50);}

/* ===== التقرير ===== */
function pReport(h){
  const done=Object.keys(S.lessons).filter(lessonDone).length,total=D.levels.reduce((a,L)=>a+levelLessons(L).length,0);
  const secs=Object.entries(S.stats).filter(([k,v])=>v.n>=3).map(([k,v])=>[k,pct(v.ok,v.n),v.n]).sort((a,b)=>b[1]-a[1]);
  const strong=secs.filter(x=>x[1]>=80).slice(0,4),weak=secs.filter(x=>x[1]<65).slice(-4).reverse();
  const errs=Object.entries(S.errs||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const weakLessons=Object.entries(S.lessons).filter(([id,l])=>l.best<PASS).map(([id,l])=>{const f=findLesson(id);return f?[f.l.t,l.best,id]:null;}).filter(Boolean).slice(0,6);
  const days=[...Array(14)].map((_,i)=>addDays(-13+i));const dayAct=d=>{const x=(S.dayLog||{})[d];return x?Object.values(x).reduce((a,b)=>a+b,0):(S.days[d]?1:0);};
  const mx=Math.max(1,...days.map(dayAct));
  const dl=S.dictLog||[];const dAvg=dl.length?Math.round(dl.reduce((a,x)=>a+(x.p||0),0)/dl.length):null;
  const kpi=[['⭐',S.xp,'نقطة'],['🔥',streak(),'يوم متتالٍ'],['📅',Object.keys(S.days).length,'يوم نشاط'],['🏰',done+' / '+total,'درس متقن'],['🔤',Object.keys(S.learned).length,'كلمة تعلّمها'],['✍️',dl.length+(dAvg!=null?' · '+dAvg+'%':''),'إملاء · المتوسط'],['📏',Object.values(S.rules).filter(p=>p>=PASS).length+' / '+D.spelling.length,'قاعدة كتابة'],['🏛️',Object.values(S.gbs).filter(p=>p>=PASS).length+' / '+D.grammar.length,'مبنى نحوي'],['🌷',Object.values(S.rhs).filter(p=>p>=PASS).length+' / '+D.rhetoric.length,'فن بلاغي'],['📚',Object.keys(S.texts).length,'نصًا مقروءًا'],['🎤',S.stageLog.length,'تدريب إلقاء'],['🖋️',S.notebook.length,'نصًا في الدفتر'],['🎮',Object.values(S.games).reduce((a,g)=>a+(g.plays||0),0),'جولة لعب'],['🔁',Object.keys(S.rev).length,'سؤالًا للمراجعة'],['🏅',Object.keys(S.badges).length+' / '+BADGES.length,'شارة']];
  h.innerHTML=`<div class="card"><h2>📊 تقرير ${esc(S.name||'الطفل')} ${S.avatar||''}</h2><p class="small">حتى ${fmtDate(new Date().toISOString())} · المستوى الحالي: ${esc((currentLevel()||{}).name||'')}</p>
   <div class="stats">${kpi.map(([e,v,n])=>`<div class="stat"><b>${e} ${v}</b><span class="small">${n}</span></div>`).join('')}</div></div>
  <div class="card"><h3>📈 النشاط في آخر 14 يومًا</h3><div style="display:flex;align-items:flex-end;gap:4px;height:90px">${days.map(d=>`<div title="${d}: ${dayAct(d)}" style="flex:1;background:var(--teal);opacity:${dayAct(d)?1:.15};height:${Math.max(4,dayAct(d)/mx*100)}%;border-radius:4px 4px 0 0"></div>`).join('')}</div><div class="row small" style="justify-content:space-between"><span>${fmtDate(days[0])}</span><span>اليوم</span></div></div>
  <div class="grid wide"><div class="card"><h3>💪 نقاط القوة</h3>${strong.length?strong.map(([k,p,n])=>`<div>✅ ${esc(SECN[k]||k)}: <b>${p}%</b> <span class="small">(${n} سؤالًا)</span></div>`).join(''):'<p class="small">تظهر بعد مزيد من التدريب.</p>'}</div>
   <div class="card"><h3>🌱 تحتاج دعمًا</h3>${weak.length?weak.map(([k,p,n])=>`<div>🔸 ${esc(SECN[k]||k)}: <b>${p}%</b> <span class="small">(${n})</span></div>`).join(''):'<p class="small">لا توجد نقاط ضعف واضحة بعد.</p>'}
   ${weakLessons.length?`<p class="small" style="margin-top:6px"><b>دروس لم تُتقن:</b> ${weakLessons.map(([t,p,id])=>`<a href="#/lesson/${id}">${esc(t)} (${p}%)</a>`).join('، ')}</p>`:''}</div></div>
  ${errs.length?`<div class="card"><h3>✍️ أكثر أخطاء الإملاء</h3>${errs.map(([c,n])=>`<div>• ${esc((ERRCAT[c]||{}).n||c)}: <b>${n}</b> مرة ${ERRCAT[c]&&ERRCAT[c].r?`— <a href="#/rule/${ERRCAT[c].r}">القاعدة</a>`:''}</div>`).join('')}</div>`:''}
  <div class="card"><h3>🎤 تسجيلات الإلقاء</h3><div id="pst">${S.stageLog.length?'':'<p class="small">لا توجد تسجيلات بعد.</p>'}</div></div>
  <div class="card"><h3>🖋️ آخر ما كتب في دفتره</h3>${S.notebook.length?S.notebook.slice(-5).reverse().map(n=>`<details><summary>${esc(n.title||'بلا عنوان')} <span class="small">· ${fmtDate(n.updated||n.d)} · ${nbWords(n.text).length} كلمة</span></summary><div style="white-space:pre-wrap">${esc(n.text)}</div></details>`).join(''):'<p class="small">لم يكتب بعد.</p>'}</div>
  <div class="row center noprint"><button class="btn main" onclick="window.print()">🖨️ طباعة التقرير</button><button class="btn" id="pjson">⬇️ تنزيل التقرير (JSON)</button></div>`;
  $('pjson').onclick=()=>download('report-'+today()+'.json',JSON.stringify({name:S.name,date:new Date().toISOString(),xp:S.xp,streak:streak(),daysActive:Object.keys(S.days).length,lessons:S.lessons,stats:S.stats,errors:S.errs,learned:Object.keys(S.learned).length,dictLog:S.dictLog,readLog:S.readLog,stageLog:S.stageLog,games:S.games,rules:S.rules,grammar:S.gbs,rhetoric:S.rhs,badges:S.badges},null,2));
  const seen=new Set();const last=S.stageLog.slice().reverse().filter(x=>!seen.has(x.id)&&seen.add(x.id)).slice(0,8);
  Promise.all(last.map(x=>ADB.get('st:'+x.id))).then(bl=>{const el=$('pst');if(!el||!last.length)return;el.innerHTML=`<table class="tbl"><tr><th>النص</th><th>آخر تدريب</th><th>كلمة/دقيقة</th><th></th></tr>${last.map((x,i)=>`<tr><td>${esc(x.t)}</td><td>${fmtDate(x.d)}</td><td>${x.wpm||'—'}</td><td>${bl[i]?`<button class="btn sm" data-pl="${i}">▶</button>`:''}</td></tr>`).join('')}</table>`;
    qsa('[data-pl]',el).forEach(b=>b.onclick=()=>{const u=URL.createObjectURL(bl[+b.dataset.pl]);new Audio(u).play();});});
}

/* ===== التحكم ===== */
function pControl(h){
  h.innerHTML=`<div class="card"><h3>🏰 المستويات</h3><label>المستوى المفتوح يدويًا</label><select id="pfl">${[0,...D.levels.map(L=>L.n)].map(n=>`<option value="${n}" ${S.forceLevel==n?'selected':''}>${n?('حتى المستوى '+n+' — '+esc(D.levels.find(L=>L.n===n).name)):'تلقائي حسب الإتقان (موصى به)'}</option>`).join('')}</select>
   <label style="display:block;margin-top:8px"><input type="checkbox" id="poa" ${S.openAll?'checked':''}> فتح كل المستويات والألعاب (للمراجعة أو للأطفال الأكبر)</label>
   <p class="small">المستوى التالي يُفتح تلقائيًا عند إتقان ${LEVEL_UNLOCK}% من دروس المستوى الحالي، والدرس يُعد متقنًا بـ${PASS}%.</p></div>
  <div class="card"><h3>🌙 قارئ آيات الإملاء القرآني</h3><select id="prc">${RECITERS.map(([k,n])=>`<option value="${k}" ${(S.set.reciter||'Husary_Muallim_128kbps')===k?'selected':''}>${n}</option>`).join('')}</select>
   <button class="btn sm" id="prt">🔊 تجربة (الفاتحة: 2)</button>
   <details style="margin-top:8px"><summary class="small">متقدم: قالب رابط مختلف</summary><input id="pqu" value="${attr(S.set.qurl||'')}" placeholder="https://everyayah.com/data/{r}/{sss}{aaa}.mp3" style="width:100%;direction:ltr"><p class="small">{r} مجلد القارئ، {sss} رقم السورة بثلاث خانات، {aaa} رقم الآية. اتركه فارغًا للافتراضي.</p></details>
   <p class="small">الصوت يُشغّل مباشرة من موقع EveryAyah المجاني ويحتاج إلى الإنترنت. يمكنك أيضًا تسجيل أي آية بصوتك من تبويب «التسجيلات»، فيُستعمل تسجيلك بدلًا من القارئ.</p></div>
  <div class="card"><h3>🧹 إعادة الضبط</h3><p class="small">يمسح كل تقدم الطفل ونتائجه (ويبقي المحتوى الذي أضفته والرمز). لا يمكن التراجع، فنزّل نسخة احتياطية أولًا.</p><button class="btn rec" id="prs">مسح التقدم</button></div>`;
  $('pfl').onchange=e=>{S.forceLevel=+e.target.value;save();toast('تم الحفظ ✅');};
  $('poa').onchange=e=>{S.openAll=e.target.checked;save();toast('تم الحفظ ✅');};
  $('prc').onchange=e=>{S.set.reciter=e.target.value;save();toast('تم اختيار القارئ ✅');};
  $('pqu').onchange=e=>{const v=e.target.value.trim();if(v&&!/^https:\/\/.+\{sss\}.*\{aaa\}/.test(v))return toast('القالب يجب أن يبدأ بـ https ويحتوي {sss} و{aaa}');S.set.qurl=v;save();toast('تم الحفظ ✅');};
  $('prt').onclick=()=>AUDIO._el(reciterURL(1,2),1,'file').catch(()=>toast('تعذّر التشغيل؛ تحقق من الاتصال بالإنترنت.'));
  $('prs').onclick=()=>{const close=modal(`<h3>مسح تقدم ${esc(S.name||'الطفل')}؟</h3><p>اكتب الرمز السري للتأكيد:</p><input type="password" id="prp" inputmode="numeric" style="width:100%"><button class="btn rec" id="prok" style="margin-top:8px">نعم، امسح التقدم</button>`);
    $('prok').onclick=async()=>{if(await sha($('prp').value.trim())!==S.pin)return toast('الرمز غير صحيح');const keep={pin:S.pin,custom:S.custom,set:S.set,name:S.name,avatar:S.avatar};S=Object.assign(JSON.parse(JSON.stringify(DEF)),keep);save();close();toast('تم مسح التقدم');ROUTES.parent('control');};};
}

/* ===== إضافة محتوى ===== */
const ADDK=[['word','🔤','كلمة للمعجم'],['question','❓','سؤال لطفلي'],['dictation','✍️','نص إملاء'],['text','📖','نص قراءة'],['riddle','🧩','لغز'],['proverb','📜','مثل'],['lesson','🏰','درس']];
let PADD='word';
function pAdd(h){
  const f={
   word:`<input id="aw" placeholder="الكلمة *"><input id="ae" placeholder="رمز تعبيري (مثل 🍎)" maxlength="4"><input id="am" placeholder="المعنى *"><input id="as" placeholder="جملة مثال"><input id="asy" placeholder="مرادفات (افصل بـ ،)"><input id="aan" placeholder="أضداد (افصل بـ ،)"><input id="apl" placeholder="الجمع">`,
   question:`<select id="qt"><option value="mc">اختيار من متعدد</option><option value="tf">صح أو خطأ</option><option value="in">إجابة مكتوبة</option></select><input id="qq" placeholder="نص السؤال *"><input id="qa" placeholder="الإجابة الصحيحة * (في صح/خطأ اكتب: صح أو خطأ)"><input id="qo" placeholder="إجابات خاطئة للاختيار (افصل بـ ،)"><input id="qh" placeholder="تلميح أو شرح (اختياري)"><p class="small">يظهر السؤال لطفلك في «المراجعة الذكية» ابتداءً من الغد، ويتكرر حتى يتقنه.</p>`,
   dictation:`<textarea id="dt" rows="3" placeholder="نص الإملاء *"></textarea><select id="dk">${Object.entries(KINDS).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('')}</select><select id="dl">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">المستوى ${n}</option>`).join('')}</select><input id="dti" placeholder="عنوان (للفقرات)"><p class="small">بعد الحفظ يمكنك تسجيله بصوتك من تبويب «التسجيلات».</p>`,
   text:`<input id="tt" placeholder="عنوان النص *"><textarea id="tb" rows="6" placeholder="النص * (كل فقرة في سطر)"></textarea><select id="tl">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">المستوى ${n}</option>`).join('')}</select><textarea id="tq" rows="4" placeholder="أسئلة الفهم (اختياري) — سطر لكل سؤال بهذا الشكل:&#10;السؤال؟ | الإجابة الصحيحة | خطأ1 | خطأ2"></textarea>`,
   riddle:`<input id="rq" placeholder="اللغز *"><input id="ra" placeholder="الجواب *"><input id="rh" placeholder="تلميح">`,
   proverb:`<input id="vp" placeholder="المثل *"><input id="vm" placeholder="معناه *"><input id="vu" placeholder="متى نقوله"><input id="vs" placeholder="مصدره (مثل: مجمع الأمثال، أو مثل شعبي مصري)">`,
   lesson:`<select id="ln">${D.levels.map(L=>`<option value="${L.n}">المستوى ${L.n} — ${esc(L.name)}</option>`).join('')}</select><input id="lt" placeholder="عنوان الدرس *"><textarea id="lb" rows="4" placeholder="شرح الدرس *"></textarea><textarea id="lq" rows="5" placeholder="التدريبات * — سطر لكل سؤال:&#10;السؤال | الإجابة الصحيحة | خطأ1 | خطأ2"></textarea><p class="small">تُضاف الدروس في وحدة خاصة «دروس من ولي الأمر» في المستوى المختار.</p>`};
  const C=S.custom;const lists={word:C.words.map(w=>[w.id,w.w]),question:C.questions.map(q=>[q.id,q.q]),dictation:C.dictation.map(d=>[d.id,d.t]),text:C.texts.map(t=>[t.id,t.t]),riddle:C.riddles.map(r=>[r.id,r.q]),proverb:C.proverbs.map(p=>[p.id,p.p]),lesson:C.lessons.flatMap(u=>u.lessons.map(l=>[l.id,l.t]))};
  h.innerHTML=`<div class="row">${ADDK.map(([k,e,n])=>`<button class="chip ${PADD===k?'on':''}" data-ak="${k}">${e} ${n} (${lists[k].length})</button>`).join('')}</div>
  <div class="card form"><div class="pform" style="display:grid;gap:8px">${f[PADD]}</div><button class="btn main" id="asave" style="margin-top:10px">➕ إضافة</button></div>
  <div class="card"><h3>ما أضفته (${lists[PADD].length})</h3>${lists[PADD].length?lists[PADD].map(([id,t])=>`<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:4px 0"><span>${esc(String(t).slice(0,60))}</span><button class="btn sm" data-del="${id}">🗑️</button></div>`).join(''):'<p class="small">لا شيء بعد.</p>'}</div>
  <div class="card small">💡 المحتوى المضاف يُحفظ على هذا الجهاز فقط. لجعله دائمًا لكل الأجهزة: نزّل «ملف المحتوى» من تبويب النسخ الاحتياطي وضعه في مجلد content مع ذكره في manifest.js.</div>`;
  qsa('[data-ak]',h).forEach(b=>b.onclick=()=>{PADD=b.dataset.ak;pAdd(h);});
  const v=id=>($(id)&&$(id).value||'').trim();const L=s=>s.split(/[،,]/).map(x=>x.trim()).filter(Boolean);
  const parseQ=lines=>lines.split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(p=>p[0]&&p[1]).map(p=>({t:'mc',q:p[0],o:[p[1],...p.slice(2).filter(Boolean)],a:0})).filter(e=>e.o.length>=2);
  $('asave').onclick=()=>{let ok=false;
    switch(PADD){
     case 'word':if(!v('aw')||!v('am'))break;C.words.push({id:uid('cw'),g:'custom',w:v('aw'),e:v('ae'),m:v('am'),s:v('as'),syn:L(v('asy')),ant:L(v('aan')),pl:v('apl'),root:'',der:[],life:''});ok=true;break;
     case 'question':{if(!v('qq')||!v('qa'))break;const t=v('qt');let it;if(t==='mc'){const o=L(v('qo'));if(!o.length){toast('أضف إجابة خاطئة واحدة على الأقل');return;}it={t:'mc',q:v('qq'),o:[v('qa'),...o],a:0};}else if(t==='tf')it={t:'tf',q:v('qq'),a:/^صح|^صحيح|^نعم/.test(v('qa'))};else it={t:'in',q:v('qq'),a:[v('qa')]};if(v('qh'))it.h=v('qh');
       const id=uid('cq');C.questions.push(Object.assign({id},it));addRev('P:'+id,it,'parent');ok=true;break;}
     case 'dictation':if(!v('dt'))break;C.dictation.push({id:uid('cd'),t:v('dt'),k:v('dk'),lvl:+v('dl'),title:v('dti')});ok=true;break;
     case 'text':if(!v('tt')||!v('tb'))break;C.texts.push({id:uid('ct'),t:v('tt'),body:v('tb'),lvl:+v('tl'),cat:'من ولي الأمر',a:'ولي الأمر',q:parseQ(v('tq'))});ok=true;break;
     case 'riddle':if(!v('rq')||!v('ra'))break;{const r={id:uid('cr'),q:v('rq'),a:v('ra'),h:v('rh'),src:'من ولي الأمر'};C.riddles.push(r);D.riddles.push(r);}ok=true;break;
     case 'proverb':if(!v('vp')||!v('vm'))break;{const p={id:uid('cp'),p:v('vp'),m:v('vm'),use:v('vu'),src:v('vs')||'أضافه ولي الأمر'};C.proverbs.push(p);D.proverbs.push(p);}ok=true;break;
     case 'lesson':{const ex=parseQ(v('lq'));if(!v('lt')||!v('lb')||!ex.length)break;const n=+v('ln');let u=C.lessons.find(x=>x.n===n);
       if(!u){u={n,id:n+'.p',name:'دروس من ولي الأمر',icon:'⭐',lessons:[]};C.lessons.push(u);const Lv=D.levels.find(x=>x.n===n);if(Lv)Lv.units.push(u);}
       u.lessons.push({id:n+'.p.'+(u.lessons.length+1),t:v('lt'),body:'<p>'+esc(v('lb')).replace(/\n+/g,'</p><p>')+'</p>',ex});ok=true;break;}
    }
    if(!ok)return toast('أكمل الحقول المطلوبة (*)');
    if(PADD==='word'){mergeCustom();}save();toast('أُضيف ✅');pAdd(h);};
  qsa('[data-del]',h).forEach(b=>b.onclick=()=>{const id=b.dataset.del;const close=modal(`<h3>حذف هذا العنصر؟</h3><button class="btn rec" id="dyes">نعم، احذف</button>`);
    $('dyes').onclick=()=>{['words','questions','dictation','texts','riddles','proverbs'].forEach(k=>C[k]=C[k].filter(x=>x.id!==id));
      C.lessons.forEach(u=>u.lessons=u.lessons.filter(l=>l.id!==id));
      D.dict=D.dict.filter(x=>x.id!==id);D.riddles=D.riddles.filter(x=>x.id!==id);D.proverbs=D.proverbs.filter(x=>x.id!==id);delete S.rev['P:'+id];
      save();close();toast('حُذف');pAdd(h);};});
}

/* ===== التسجيلات ===== */
let PAU={k:'w',q:''};
function audioItems(k){
  if(k==='w')return D.dict.map(w=>({id:'w:'+w.id,t:w.w,sub:w.m}));
  if(k==='d')return allDict().map(x=>({id:'d:'+x.id,t:x.t,sub:(KINDS[x.k]||'')+' · م'+(x.lvl||'')}));
  if(k==='q')return D.quranDict.map(x=>({id:'q:'+x.id,t:x.t,sub:x.sn+': '+x.a}));
  if(k==='s')return D.speech.map(x=>({id:'s:'+x.id,t:x.t,sub:x.k,body:x.body}));
  if(k==='t')return allTexts().map(x=>({id:'t:'+x.id,t:x.t,sub:x.a||''}));
  return [];}
function pAudio(h){
  h.innerHTML=`<div class="card"><h3>🎙️ تسجيلات بصوتك</h3><p class="small">سجّل الكلمات ونصوص الإملاء والآيات ونماذج الإلقاء بصوتك، أو ارفع ملفًا صوتيًا. يُستعمل تسجيلك أولًا في كل مكان، ويُحفظ على هذا الجهاز.</p>
   <div class="row">${[['w','🔤 كلمات المعجم'],['d','✍️ الإملاء العام'],['q','🌙 آيات الإملاء'],['s','🎤 نماذج الإلقاء'],['t','📖 نصوص المكتبة']].map(([k,n])=>`<button class="chip ${PAU.k===k?'on':''}" data-k="${k}">${n}</button>`).join('')}</div>
   <input id="pas" type="search" placeholder="ابحث…" value="${attr(PAU.q)}" style="width:100%;margin-top:8px"><p class="small" id="pinfo"></p></div><div id="plist"></div>`;
  qsa('[data-k]',h).forEach(b=>b.onclick=()=>{PAU.k=b.dataset.k;PAU.q='';pAudio(h);});
  $('pas').oninput=e=>{PAU.q=e.target.value.trim();draw();};
  let keys=new Set();
  const draw=async()=>{keys=new Set(await ADB.keys());const all=audioItems(PAU.k);const n=normLoose(PAU.q);
    const L=(n?all.filter(x=>normLoose(x.t+' '+x.sub).includes(n)):all).slice(0,60);
    $('pinfo').textContent=`${all.filter(x=>keys.has(x.id)).length} مسجّل من ${all.length}${all.length>60&&!n?' · تظهر أول 60، استعمل البحث':''}`;
    $('plist').innerHTML=L.map(x=>`<div class="card row" style="justify-content:space-between;align-items:center;padding:8px 12px"><div style="flex:1;min-width:160px"><b>${esc(String(x.t).slice(0,70))}</b><div class="small">${esc(x.sub||'')}</div></div>
     <div class="row">${keys.has(x.id)?`<span class="tag ok">✓ مسجّل</span><button class="btn sm" data-p="${attr(x.id)}">▶</button><button class="btn sm" data-x="${attr(x.id)}">🗑️</button>`:''}<button class="btn sm" data-r="${attr(x.id)}">🎙️</button><label class="btn sm">⬆️<input type="file" accept="audio/*" data-u="${attr(x.id)}" hidden></label></div></div>`).join('');
    qsa('[data-p]').forEach(b=>b.onclick=async()=>{const bl=await ADB.get(b.dataset.p);if(bl)AUDIO._el(URL.createObjectURL(bl),1,'rec');});
    qsa('[data-x]').forEach(b=>b.onclick=async()=>{await ADB.del(b.dataset.x);toast('حُذف التسجيل');draw();});
    qsa('[data-u]').forEach(inp=>inp.onchange=async()=>{const f=inp.files[0];if(!f)return;if(f.size>8*1024*1024)return toast('الملف كبير (الحد 8 ميجابايت)');await ADB.put(inp.dataset.u,f);toast('رُفع الملف ✅');draw();});
    qsa('[data-r]').forEach(b=>b.onclick=()=>recordFor(b.dataset.r,draw,(audioItems(PAU.k).find(x=>x.id===b.dataset.r)||{})));};
  draw();
}
function recordFor(id,after,item){
  if(!(navigator.mediaDevices&&window.MediaRecorder))return toast('التسجيل غير متاح في هذا المتصفح؛ استعمل رفع ملف.');
  const close=modal(`<h3>🎙️ تسجيل</h3><p style="font-size:1.2rem;white-space:pre-wrap">${esc(item.body||item.t||'')}</p><div class="row center"><button class="btn main" id="rgo">ابدأ</button><span id="rtm" class="small"></span></div><div id="rpv"></div>`,()=>PARENT.stopRec());
  let chunks=[],t0=0,tm=0,blob=null;
  $('rgo').onclick=async()=>{const b=$('rgo');
    if(PARENT.rec&&PARENT.rec.state==='recording'){PARENT.rec.stop();clearInterval(tm);return;}
    try{PARENT.stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){return toast('لم يُسمح باستخدام الميكروفون');}
    chunks=[];PARENT.rec=new MediaRecorder(PARENT.stream);PARENT.rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
    PARENT.rec.onstop=()=>{try{PARENT.stream.getTracks().forEach(t=>t.stop());}catch(e){}blob=new Blob(chunks,{type:PARENT.rec.mimeType||'audio/webm'});b.textContent='↺ أعد التسجيل';b.classList.remove('rec');
      $('rpv').innerHTML=`<audio controls src="${URL.createObjectURL(blob)}" style="width:100%"></audio><button class="btn main" id="rsv">💾 حفظ التسجيل</button>`;
      $('rsv').onclick=async()=>{await ADB.put(id,blob);toast('حُفظ التسجيل ✅');close();after&&after();};};
    PARENT.rec.start();t0=Date.now();b.textContent='⏹ إيقاف';b.classList.add('rec');tm=setInterval(()=>{const el=$('rtm');if(el)el.textContent=Math.round((Date.now()-t0)/1000)+' ث';},300);};
}

/* ===== النسخ الاحتياطي ===== */
function blobToB64(b){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(b);});}
async function b64ToBlob(u){return (await fetch(u)).blob();}
function customAsJS(){const C=S.custom;const J=x=>JSON.stringify(x,null,1);
  return `/* محتوى أضافه ولي الأمر — صُدّر من مملكة الضاد في ${today()}
   ضع هذا الملف في مجلد content، ثم أضف اسمه 'custom-content.js' في آخر قائمة CONTENT_FILES في manifest.js */
${C.words.length?`K.dictGroup('custom',{n:'كلمات أضافها ولي الأمر',e:'⭐'});\nK.words('custom',${J(C.words.map(w=>Object.assign({},w,{id:'x'+w.id})))});\n`:''}${C.dictation.length?`K.dictation(${J(C.dictation.map(d=>Object.assign({},d,{id:'x'+d.id})))});\n`:''}${C.texts.length?C.texts.map(t=>`K.reading(${J(Object.assign({},t,{id:'x'+t.id}))});`).join('\n')+'\n':''}${C.riddles.length?`K.riddles(${J(C.riddles)});\n`:''}${C.proverbs.length?`K.proverbs(${J(C.proverbs)});\n`:''}${C.lessons.map(u=>`K.unit(${u.n},${J({name:u.name,icon:u.icon,lessons:u.lessons.map(l=>({t:l.t,body:l.body,ex:l.ex}))})});`).join('\n')}
`;}
function pBackup(h){
  h.innerHTML=`<div class="card"><h3>⬇️ تنزيل نسخة احتياطية</h3><p class="small">ملف واحد فيه تقدم الطفل والمحتوى الذي أضفته. يمكنك نقله إلى جهاز آخر.</p>
   <label><input type="checkbox" id="bau"> تضمين التسجيلات الصوتية (يكبر حجم الملف)</label><div class="row" style="margin-top:8px"><button class="btn main" id="bdl">⬇️ تنزيل النسخة</button></div></div>
  <div class="card"><h3>⬆️ استعادة نسخة</h3><p class="small">تستبدل الاستعادةُ التقدمَ الحالي على هذا الجهاز.</p><input type="file" id="bup" accept=".json,application/json"></div>
  <div class="card"><h3>📦 ملف المحتوى المضاف</h3><p class="small">صدّر ما أضفته من كلمات ونصوص ودروس بصيغة ملف محتوى، لتضعه في مجلد الموقع فيظهر على كل الأجهزة.</p><button class="btn" id="bjs">⬇️ custom-content.js</button></div>
  <div class="card small" id="bsz">💾 جارٍ حساب المساحة…</div>`;
  $('bdl').onclick=async()=>{const data={app:'dad',v:1,date:new Date().toISOString(),state:S};
    if($('bau').checked){data.audio={};for(const k of await ADB.keys()){const b=await ADB.get(k);if(b)data.audio[k]=await blobToB64(b);}}
    download('mamlakat-aldad-backup-'+today()+'.json',JSON.stringify(data));toast('نُزّلت النسخة ✅');};
  $('bup').onchange=async e=>{const f=e.target.files[0];if(!f)return;let d;try{d=JSON.parse(await f.text());}catch(x){return toast('الملف غير صالح');}
    if(!d||d.app!=='dad'||!d.state)return toast('هذا ليس ملف نسخة من مملكة الضاد');
    const close=modal(`<h3>استعادة نسخة ${fmtDate(d.date)}؟</h3><p>سيُستبدل التقدم الحالي.${d.audio?' وستُضاف '+Object.keys(d.audio).length+' تسجيلات.':''}</p><button class="btn main" id="byes">نعم، استعد</button>`);
    $('byes').onclick=async()=>{const pin=S.pin;S=Object.assign(JSON.parse(JSON.stringify(DEF)),d.state);S.set=Object.assign({},DEF.set,S.set);S.custom=Object.assign({},DEF.custom,S.custom);if(!S.pin)S.pin=pin;save();
      if(d.audio)for(const [k,u] of Object.entries(d.audio)){try{await ADB.put(k,await b64ToBlob(u));}catch(x){}}
      close();toast('تمت الاستعادة ✅ سيُعاد تحميل الموقع');setTimeout(()=>location.reload(),900);};};
  $('bjs').onclick=()=>download('custom-content.js',customAsJS(),'text/javascript;charset=utf-8');
  (async()=>{let t=`💾 التقدم يشغل نحو ${Math.round(JSON.stringify(S).length/1024)} ك.ب من التخزين المحلي (الحد عادةً 5 م.ب).`;
    try{if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();t+=` · الاستخدام الكلي للموقع (مع التسجيلات): ${(e.usage/1048576).toFixed(1)} م.ب من ${(e.quota/1048576).toFixed(0)} م.ب متاحة.`;}}catch(x){}
    t+=' البيانات محفوظة في هذا المتصفح فقط؛ مسح بيانات المتصفح يمسحها، فنزّل نسخة احتياطية بانتظام.';const el=$('bsz');if(el)el.textContent=t;})();
}

/* ===== تغيير الرمز ===== */
function pPin(h){h.innerHTML=`<div class="card" style="max-width:420px"><h3>🔐 تغيير الرمز</h3><input type="password" inputmode="numeric" id="po" placeholder="الرمز الحالي" style="width:100%"><input type="password" inputmode="numeric" id="pn" placeholder="الرمز الجديد (4–8 أرقام)" maxlength="8" style="width:100%;margin-top:8px"><button class="btn main" id="pch" style="margin-top:8px">تغيير</button></div>`;
  $('pch').onclick=async()=>{if(await sha($('po').value.trim())!==S.pin)return toast('الرمز الحالي غير صحيح');const n=$('pn').value.trim();if(!/^\d{4,8}$/.test(n))return toast('الرمز من 4 إلى 8 أرقام');S.pin=await sha(n);save();toast('تم تغيير الرمز ✅');$('po').value=$('pn').value='';};}
