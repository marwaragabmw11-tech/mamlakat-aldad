/* أكاديمية الإملاء الصوتي */
'use strict';
const ERRCAT={
 ta:{n:'التاء المربوطة والمفتوحة والهاء',r:'ta'},alif:{n:'الألف اللينة (ا / ى)',r:'alif'},wasl:{n:'همزة الوصل والقطع',r:'wasl'},
 hmid:{n:'الهمزة المتوسطة',r:'hmid'},hend:{n:'الهمزة المتطرفة',r:'hend'},tanween:{n:'التنوين',r:'tanween'},
 lam:{n:'اللام الشمسية والقمرية',r:'silent'},madd:{n:'حروف المد',r:'madd'},silent:{n:'حروف تُكتب ولا تُنطق',r:'silent'},
 unwritten:{n:'حروف تُنطق ولا تُكتب',r:'unwritten'},punct:{n:'علامات الترقيم',r:'punct'},miss:{n:'كلمات ناقصة',r:''},other:{n:'أخطاء أخرى في الحروف',r:'common'}};
const ERRTIP={
 ta:'التاء المربوطة (ة) تُنطق هاءً عند الوقف وتاءً عند الوصل، مثل: شجرة. أما الهاء (ه) فتبقى هاءً دائمًا، مثل: وجهه. والتاء المفتوحة (ت) تبقى تاءً دائمًا، مثل: بيت، كتبتْ.',
 alif:'الألف في آخر الكلمة: نكتبها قائمة (ا) إذا كان أصلها واوًا مثل: دعا (يدعو)، ونكتبها مقصورة (ى) إذا كان أصلها ياءً مثل: مشى (يمشي).',
 wasl:'همزة القطع تُكتب وتُنطق دائمًا مثل: أَكَلَ، إِسلام. وهمزة الوصل تُنطق في أول الكلام فقط ولا تُكتب عليها همزة، مثل: اكتبْ، استخرج، ابن، اسم.',
 hmid:'الهمزة المتوسطة تُكتب على حرف يناسب أقوى الحركتين: حركتها وحركة ما قبلها. الكسرة أقوى ← ئ، ثم الضمة ← ؤ، ثم الفتحة ← أ، ثم السكون.',
 hend:'الهمزة المتطرفة تُكتب على حرف يناسب حركة ما قبلها: بعد الفتح ← أ (قرأ)، بعد الضم ← ؤ (تباطؤ)، بعد الكسر ← ئ (شاطئ)، وبعد السكون على السطر ← ء (دفء).',
 tanween:'تنوين الفتح يُكتب غالبًا بزيادة ألف: كتابًا، بيتًا. ولا نزيد الألف بعد التاء المربوطة (شجرةً)، ولا بعد الهمزة المسبوقة بألف (سماءً).',
 lam:'اللام الشمسية تُكتب ولا تُنطق، مثل: الشمس، النور. واللام القمرية تُكتب وتُنطق، مثل: القمر، الكتاب.',
 madd:'حروف المد ثلاثة: الألف (قال)، والواو (يقول)، والياء (قيل). المد صوت طويل يجب أن يُكتب حرفه.',
 silent:'من الحروف التي تُكتب ولا تُنطق: ألف واو الجماعة (كتبوا)، واللام الشمسية (الشمس)، وواو «عمرو».',
 unwritten:'من الحروف التي تُنطق ولا تُكتب: الألف في (هذا، هذه، ذلك، لكن، الله، الرحمن، طه).',
 punct:'انتبه لعلامات الترقيم: النقطة (.) في نهاية الجملة، والفاصلة (،) بين الجمل المتصلة، وعلامة الاستفهام (؟) بعد السؤال، وعلامة التعجب (!) بعد التعجب.',
 miss:'استمع مرة أخرى بالسرعة البطيئة، وعُدّ الكلمات قبل أن تكتب.',other:'قارن كلمتك بالكلمة الصحيحة حرفًا حرفًا، وانطقها ببطء.'};
function catOf(c,g){const C=stripTashkeel(c),G=stripTashkeel(g);const H=/[أإآءؤئ]/;
  if(C.endsWith('وا')&&G===C.slice(0,-1)||G.endsWith('وا')&&C===G.slice(0,-1)&&!C.endsWith('و'+'ا'))return 'silent';
  if(G.endsWith('وا')&&C===G.slice(0,-1))return 'silent';
  if(C.endsWith('ا')&&G===C.slice(0,-1)||G===C+'ا')return 'tanween';
  if(C.startsWith('ال')&&C.length>3&&(G==='ا'+C.slice(2)||G===C.slice(2)))return 'lam';
  if(H.test(C)||H.test(G)){const L=Math.max(C.length,G.length);let i=0;while(i<L&&C[i]===G[i])i++;
    const cc=C[i]||'',gg=G[i]||'';if(H.test(cc)||H.test(gg)||(H.test(C)!==H.test(G))){
      const hp=C.search(H)>=0?C.search(H):i;const pos=Math.min(i,hp<0?i:hp);
      if(pos===0||(C.startsWith('ال')&&pos===2))return 'wasl';
      const lastH=C.replace(/[اً]$/,'').length-1;return pos>=lastH?'hend':'hmid';}}
  const ce=C.slice(-1),ge=G.slice(-1);
  if(C.slice(0,-1)===G.slice(0,-1)){if(ce==='ة'||ge==='ة')return 'ta';if('اىي'.includes(ce)&&'اىي'.includes(ge))return 'alif';}
  const UN=['هذا','هذه','هذان','ذلك','لكن','الله','الرحمن','هؤلاء','أولئك','طه'];if(UN.some(u=>C.includes(u))&&G.length===C.length+1)return 'unwritten';
  if(G.length===C.length-1){for(let k=0;k<C.length;k++){if(C.slice(0,k)+C.slice(k+1)===G&&'اوي'.includes(C[k]))return 'madd';}}
  if(normLoose(C)===normLoose(G))return 'other';
  return 'other';}
function gradeDict(correct,typed){
  const A=words(correct),B=words(typed);const d=lcsDiff(A,B);const cats={};let ok=0;
  d.forEach(x=>{if(x.k==='ok')ok++;else if(x.k==='bad'){x.c=catOf(x.w,x.got);cats[x.c]=(cats[x.c]||0)+1;}else if(x.k==='miss'){x.c='miss';cats.miss=(cats.miss||0)+1;}});
  const pc=(correct.match(/[.،؟!:؛]/g)||[]).length,pt=(typed.match(/[.،؟!:؛,?]/g)||[]).length;if(pc&&pt<pc)cats.punct=1;
  const extra=d.filter(x=>x.k==='extra').length;const p=Math.round(ok/Math.max(1,A.length+extra)*100);return {d,cats,p,ok,n:A.length};}

function reciterURL(s,a){const r=S.set.reciter||'Husary_Muallim_128kbps';const t=S.set.qurl||'https://everyayah.com/data/{r}/{sss}{aaa}.mp3';return t.replace('{r}',r).replace('{sss}',String(s).padStart(3,'0')).replace('{aaa}',String(a).padStart(3,'0'));}
const RECITERS=[['Husary_Muallim_128kbps','الحصري (المعلِّم) — بطيء للتعليم'],['Husary_128kbps','محمود خليل الحصري'],['Minshawy_Murattal_128kbps','محمد صديق المنشاوي'],['Abdul_Basit_Murattal_192kbps','عبد الباسط عبد الصمد'],['Alafasy_128kbps','مشاري العفاسي']];

let DK={part:'quran',lvl:0,kind:''};
ROUTES.dictation=function(part){if(part)DK.part=part;
  const isQ=DK.part==='quran';
  const L=isQ?D.quranDict:allDict().filter(x=>(!DK.lvl||x.lvl===DK.lvl)&&(!DK.kind||x.k===DK.kind));
  const done=id=>S.dictLog.some(x=>x.id===id);
  const errs=Object.entries(S.errs).sort((a,b)=>b[1]-a[1]).slice(0,5);
  app().innerHTML=crumbs([['الرئيسية','#/home'],['أكاديمية الإملاء الصوتي']])+guide(isQ?'نستمع إلى الآية بصوت القارئ، ثم نكتبها بالإملاء الحديث. بعد التصحيح أريك الكلمات التي يختلف رسمها في المصحف 🌙':'نستمع إلى الكلمة أو الجملة، ثم نكتبها. أصحح لك كلمة كلمة، وأشرح القاعدة عند كل خطأ 🎧','think')+
  `<div class="row"><button class="chip ${isQ?'on':''}" onclick="ROUTES.dictation('quran')">🌙 آيات من القرآن الكريم (${D.quranDict.length})</button><button class="chip ${!isQ?'on':''}" onclick="ROUTES.dictation('gen')">🎧 كلمات وجمل وفقرات (${allDict().length})</button></div>
  ${isQ?`<div class="card small">🎙️ القارئ: <b>${esc((RECITERS.find(r=>r[0]===(S.set.reciter||'Husary_Muallim_128kbps'))||['',S.set.reciter])[1])}</b> · يُشغَّل الصوت من موقع EveryAyah ويحتاج اتصالًا بالإنترنت. إن أضاف ولي الأمر تسجيلًا لآية فسيُستعمل بدلًا منه. يغيّر ولي الأمر القارئ من ركنه.</div>`:
  `<div class="card"><div class="row"><b class="small">المستوى:</b>${[0,1,2,3,4,5,6,7,8].map(n=>`<button class="chip ${DK.lvl===n?'on':''}" data-lv="${n}">${n||'الكل'}</button>`).join('')}</div><div class="row" style="margin-top:6px"><b class="small">النوع:</b>${[['','الكل'],['word','كلمات مفردة'],['short','جمل قصيرة'],['long','جمل طويلة'],['para','فقرات']].map(([k,n])=>`<button class="chip ${DK.kind===k?'on':''}" data-kd="${k}">${n}</button>`).join('')}</div></div>`}
  ${errs.length?`<div class="card"><h3>📊 أخطائي المتكررة</h3>${errs.map(([k,v])=>`<div class="row" style="margin:3px 0"><span style="flex:1">${esc(ERRCAT[k]?ERRCAT[k].n:k)}</span><span class="pill">${v}</span>${ERRCAT[k]&&ERRCAT[k].r?`<a class="btn sm" href="#/rule/${ERRCAT[k].r}">القاعدة</a>`:''}</div>`).join('')}</div>`:''}
  <div class="row"><button class="btn gold" id="rnd">🎲 تدريب عشوائي</button></div>
  <div class="grid wide" style="margin-top:10px">${L.map(x=>`<a class="tile" href="#/dk/${isQ?'q':'g'}/${x.id}">${done(x.id)?'<span class="badge">✓</span>':''}<span class="small">${isQ?'🌙 '+esc(x.sn)+' : '+x.a:(KINDS[x.k]||'')+' · المستوى '+x.lvl}</span><h3 style="font-size:1rem">${isQ?'آية '+(D.quranDict.indexOf(x)+1):esc(x.title||('تدريب '+x.id))}</h3></a>`).join('')}</div>`;
  qsa('[data-lv]').forEach(b=>b.onclick=()=>{DK.lvl=+b.dataset.lv;ROUTES.dictation();});qsa('[data-kd]').forEach(b=>b.onclick=()=>{DK.kind=b.dataset.kd;ROUTES.dictation();});
  $('rnd').onclick=()=>{if(!L.length)return toast('لا توجد تدريبات هنا');const notDone=L.filter(x=>!done(x.id));go('#/dk/'+(isQ?'q':'g')+'/'+pick(notDone.length?notDone:L).id);};
};
const KINDS={word:'🔤 كلمة',short:'✏️ جملة قصيرة',long:'📝 جملة طويلة',para:'📄 فقرة'};
function allDict(){return [...D.dictation,...(S.custom.dictation||[])];}
ROUTES.dk=function(part,id){const isQ=part==='q';const it=(isQ?D.quranDict:allDict()).find(x=>x.id===id);if(!it)return go('#/dictation');
  const list=isQ?D.quranDict:allDict();const nx=list[list.indexOf(it)+1];
  let rate=1,plays=0;
  app().innerHTML=crumbs([['أكاديمية الإملاء','#/dictation/'+(isQ?'quran':'gen')],[isQ?'سورة '+it.sn+' ('+it.a+')':(it.title||'تدريب')]])+
  `<div class="card"><h3>${isQ?'🌙 استمع إلى الآية ثم اكتبها':'🎧 '+(KINDS[it.k]||'')}</h3>${isQ?`<p class="small">سورة ${esc(it.sn)}، الآية ${it.a}${it.tip?' · 💡 '+esc(it.tip):''}</p>`:''}
  <div class="player"><button class="bigplay" id="pl" aria-label="تشغيل">▶</button><button class="btn sm" id="again">🔁 مرة أخرى</button>${[[.75,'🐢 بطيء'],[1,'عادي'],[1.25,'🐇 أسرع']].map(([v,n])=>`<button class="chip ${v===1?'on':''}" data-rate="${v}">${n}</button>`).join('')}<span class="small" id="src"></span></div>
  <label for="ans">اكتب ما سمعته (لا تحتاج إلى التشكيل):</label><textarea id="ans" rows="${it.k==='para'?6:3}" placeholder="اكتب هنا…" autocomplete="off" spellcheck="false"></textarea>
  <div class="row" style="margin-top:8px"><button class="btn main" id="chk">✅ صحّح كتابتي</button><button class="btn" id="peek">👁️ أحتاج مساعدة</button></div></div><div id="res"></div>`;
  const play=async()=>{plays++;AUDIO.stop();let r;
    if(isQ){const blob=await ADB.get('q:'+it.id);if(blob){r=await AUDIO._el(URL.createObjectURL(blob),rate,'rec').catch(()=>'none');}else{r=await AUDIO._el(reciterURL(it.s,it.a),rate,'file').catch(()=>'none');}
      if(r==='none'){$('src').innerHTML='⚠️ تعذّر تشغيل التلاوة. تأكد من الاتصال بالإنترنت، أو اطلب من ولي الأمر إدخال تسجيل.';return;}}
    else{r=await AUDIO.play(it.aid||('d:'+it.id),it.t,rate);if(r==='none'){$('src').innerHTML='لا يوجد تسجيل لهذا التدريب، ولا صوت عربي في المتصفح. ستظهر الجملة 4 ثوانٍ: <b id="pk">'+esc(it.t)+'</b>';setTimeout(()=>{const p=$('pk');if(p)p.textContent='•••';},4000);return;}}
    $('src').textContent=r==='rec'?'🎙️ تسجيل ولي الأمر':r==='file'?(isQ?'🎙️ تلاوة القارئ':'🎙️ تسجيل'):r==='tts'?'🔈 صوت المتصفح':'';};
  $('pl').onclick=play;$('again').onclick=play;
  qsa('[data-rate]').forEach(b=>b.onclick=()=>{rate=+b.dataset.rate;qsa('[data-rate]').forEach(x=>x.classList.toggle('on',x===b));play();});
  $('peek').onclick=()=>{const w=words(it.t);toast('عدد الكلمات: '+w.length+' · أول كلمة: '+w[0],3500);};
  $('chk').onclick=()=>{const v=$('ans').value.trim();if(!v)return toast('اكتب ما سمعته أولًا');
    const g=[it.t,...(it.alt||[])].map(c=>gradeDict(c,v)).sort((x,y)=>y.p-x.p)[0];Object.entries(g.cats).forEach(([k,n])=>{S.errs[k]=(S.errs[k]||0)+n;});
    S.dictLog.push({d:new Date().toISOString(),id:it.id,t:it.t,p:g.p});if(S.dictLog.length>300)S.dictLog.shift();
    stat('dictation',g.p>=PASS);if(g.p<PASS)addRev('D:'+it.id,{t:'au',a:it.t,id:isQ?null:(it.aid||'d:'+it.id),q:isQ?'اكتب: سورة '+it.sn+' ('+it.a+')':''},'dictation');save();dayInc('dict');
    g.p>=PASS?(SFX.ok(),g.p===100&&confetti()):SFX.no();addXP(Math.round(g.p/10)+(g.p===100?5:0),'إملاء');
    const tips=Object.keys(g.cats);
    $('res').innerHTML=`<div class="card fadein"><h3>${g.p===100?'🌟 كتابة صحيحة تمامًا!':g.p>=PASS?'👏 أحسنت! بقيت أخطاء صغيرة':'🌱 لنتعلم من الأخطاء'}</h3><div class="score">${g.p}%</div>
    <p class="small">الأخضر صحيح · الأحمر خطأ (اضغط عليه لترى ما كتبت) · الأصفر كلمة ناقصة · المشطوب كلمة زائدة</p>
    <div class="diff">${g.d.map(x=>x.k==='ok'?`<span class="w ok">${esc(x.w)}</span>`:x.k==='bad'?`<span class="w bad" title="كتبتَ: ${attr(x.got)}" onclick="toast('كتبتَ: ${attr(x.got)} · الصحيح: ${attr(x.w)}',3500)">${esc(x.w)}</span>`:x.k==='miss'?`<span class="w miss">${esc(x.w)}</span>`:`<span class="w extra">${esc(x.w)}</span>`).join(' ')}</div>
    ${g.d.filter(x=>x.k==='bad').length?`<h3>🔍 أين الخطأ؟</h3><table class="tbl"><tr><th>كتبتَ</th><th>الصحيح</th><th>نوع الخطأ</th></tr>${g.d.filter(x=>x.k==='bad').map(x=>`<tr><td>${esc(x.got)}</td><td><b>${esc(x.w)}</b></td><td>${esc(ERRCAT[x.c].n)}</td></tr>`).join('')}</table>`:''}
    ${tips.length?`<h3>📏 القاعدة</h3>${tips.map(k=>`<div class="rule"><b>${esc(ERRCAT[k].n)}:</b> ${esc(ERRTIP[k])} ${ERRCAT[k].r?`<a href="#/rule/${ERRCAT[k].r}">تدرّب عليها ←</a>`:''}</div>`).join('')}`:''}
    ${isQ&&it.rasm?`<div class="example">🌙 <b>رسم المصحف:</b> ${esc(it.rasm)}</div>`:''}
    <p><b>النص الصحيح:</b> ${esc(it.t)}</p><div class="row"><button class="btn" onclick="route()">↺ حاول مرة أخرى</button>${nx?`<a class="btn main" href="#/dk/${part}/${nx.id}">التالي ←</a>`:''}</div></div>`;checkBadges();};
};
