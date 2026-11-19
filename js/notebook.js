/* دفتر الإبداع: عشرة أنواع من الكتابة، مساعد يقترح ولا يكتب بدلًا من الطفل */
'use strict';
const LINKERS=['أولًا','ثم','بعد ذلك','فجأة','لكنّ','لذلك','لأنّ','بينما','وأخيرًا','في النهاية','ذات يوم','في الصباح','عندئذٍ','مع ذلك','كما أنّ','إضافةً إلى ذلك','من ناحية أخرى','خلاصة القول'];
const NB_TYPES=[
 {id:'story',e:'📖',n:'قصة',min:80,
  plan:['البداية: مَن الشخصيات؟ وأين ومتى؟','العقدة: ما المشكلة التي حدثت؟','الأحداث: ماذا فعلت الشخصيات؟','الحل والنهاية: كيف انتهت؟ وما الدرس؟'],
  prompts:['عصفور صغير ضلّ طريقه إلى عشه','يوم استيقظتَ فوجدتَ أنك تفهم لغة الحيوانات','صديقان ومسابقة صعبة','مفتاح قديم وجدته في حقيبة جدك','رحلة في قطرة ماء'],
  check:[['ذات يوم|في يوم|كان يا ما كان|في صباح|في مساء|منذ زمن','بداية تحدد الزمن'],['فجأة|لكن|لكنّ|وإذا|عندئذ|حينئذ','لحظة تغيّر أو مفاجأة (عقدة)'],['في النهاية|وأخيرًا|أخيرًا|ومنذ ذلك|تعلّم|تعلم|أدرك','نهاية واضحة أو درس']]},
 {id:'wasf',e:'🌄',n:'وصف',min:60,
  plan:['اختر ما تصفه: مكان، شخص، حيوان، منظر','صف ما تراه: الألوان والأشكال','صف ما تسمعه وتشمّه وتلمسه','اختم بشعورك نحوه'],
  prompts:['حديقة بيتنا في الربيع','شاطئ البحر وقت الغروب','سوق شعبي مزدحم','جدتي','غرفتي المفضلة'],
  check:[['رأيت|أرى|يبدو|لون|ألوان|أخضر|أزرق|أحمر|أصفر|أبيض','وصف بالبصر'],['سمعت|أسمع|صوت|أصوات|صياح|تغريد|خرير|حفيف','وصف بالسمع'],['رائحة|شممت|أشم|ناعم|خشن|دافئ|بارد|طعم','وصف بالشم أو اللمس أو الذوق'],['كأن|مثل|يشبه|ك[\\u0621-\\u064A]','تشبيه يقرّب الصورة']]},
 {id:'risala',e:'✉️',n:'رسالة',min:50,
  plan:['التحية: عزيزي/عزيزتي ...','المقدمة: سلام وسؤال عن الحال','الموضوع: ما الذي تريد قوله؟','الخاتمة والتوقيع'],
  prompts:['رسالة إلى صديق انتقل إلى مدينة أخرى','رسالة شكر إلى معلمك','رسالة إلى جدتك تخبرها بأخبارك','رسالة إلى نفسك بعد عشر سنوات'],
  check:[['عزيزي|عزيزتي|العزيز|العزيزة|الحبيب|الحبيبة|الفاضل|الفاضلة|إلى','تحية أو نداء في البداية'],['السلام عليكم|تحية|أرجو أن|كيف حالك','سلام وسؤال عن الحال'],['المخلص|المخلصة|المحب|المحبة|مع تحياتي|صديقك|صديقتك|ابنك|ابنتك|حفيدك|حفيدتك|تلميذك|تلميذتك|والسلام','خاتمة وتوقيع']]},
 {id:'yawmiyat',e:'📔',n:'يوميات',min:40,
  plan:['اكتب اليوم والتاريخ','ماذا حدث اليوم؟','ما أجمل لحظة؟ وما أصعب لحظة؟','ماذا تعلمت؟'],
  prompts:['يومي في المدرسة','يوم العطلة','أول يوم في شهر رمضان','يوم تعلمت فيه شيئًا جديدًا'],
  check:[['السبت|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|اليوم','ذكر اليوم'],['شعرت|سعيد|سعيدة|حزين|حزينة|فرحت|خفت|تضايقت|متحمس','التعبير عن شعورك'],['تعلمت|تعلّمت|عرفت|أدركت|سأحاول','ماذا تعلمت']]},
 {id:'khatira',e:'🌙',n:'خاطرة أو شعر',min:25,
  plan:['اختر شعورًا أو شيئًا تحبه','اكتب سطورًا قصيرة','استعمل تشبيهًا أو صورة جميلة','اختم بسطر مؤثر'],
  prompts:['أمي','الوطن','المطر','صديقي','الكتاب'],
  check:[['كأن|مثل|يشبه|ك[\\u0621-\\u064A]','تشبيه أو صورة'],['يا [\\u0621-\\u064A]+','نداء (يا ...) يقرّب القارئ']]},
 {id:'maqal',e:'💡',n:'مقال رأي',min:80,
  plan:['المقدمة: عرّف الموضوع','رأيك بوضوح: أرى أنّ ...','أسبابك وأمثلتك: لأنّ ...','الخاتمة: لخّص رأيك'],
  prompts:['هل الواجب المنزلي مفيد؟','الهاتف المحمول للأطفال: نعم أم لا؟','لماذا نقرأ؟','الرياضة كل يوم','أهمية الوقت'],
  check:[['أرى|رأيي|أعتقد|أظن|في رأيي','رأي واضح'],['لأن|لأنّ|بسبب|لذلك|إذ','أسباب تدعم رأيك'],['مثلًا|مثلا|على سبيل المثال|كما','أمثلة'],['خلاصة|في النهاية|وأخيرًا|ختامًا|لذا','خاتمة']]},
 {id:'hiwar',e:'💬',n:'حوار',min:50,
  plan:['حدّد الشخصيات والمكان','اجعل كل جملة لشخص في سطر','استعمل علامات الترقيم: النقطتان والاستفهام','اختم الحوار بنتيجة'],
  prompts:['حوار بين الشمس والقمر','حوار بين قلم وكراسة','حوار مع بائع في السوق','حوار بينك وبين جدك عن الماضي'],
  check:[['قال|قالت|سأل|سألت|أجاب|أجابت|ردّ|ردت',' أفعال القول'],[':','النقطتان قبل الكلام'],['؟','سؤال في الحوار']]},
 {id:'taqrir',e:'📋',n:'تقرير',min:60,
  plan:['العنوان','المكان والزمان','ماذا حدث بالترتيب','النتائج والتوصيات'],
  prompts:['تقرير عن رحلة مدرسية','تقرير عن يوم رياضي','تقرير عن زيارة مكتبة','تقرير عن تجربة علمية'],
  check:[['المكان|في مدينة|في حديقة|في مدرسة|في متحف','المكان'],['الزمان|يوم|صباح|مساء|الساعة|التاريخ','الزمان'],['أولًا|ثم|بعد ذلك|وأخيرًا','ترتيب الأحداث'],['أقترح|التوصيات|نوصي|أوصي|التوصية','توصيات']]},
 {id:'tahniaa',e:'🎉',n:'دعوة أو بطاقة تهنئة',min:20,
  plan:['لمن البطاقة؟','المناسبة','الموعد والمكان (للدعوة)','عبارة جميلة وتوقيع'],
  prompts:['دعوة أصدقائك إلى حفل نجاحك','بطاقة تهنئة بالعيد','بطاقة تهنئة لصديق مولود جديد في أسرته','دعوة إلى معرض المدرسة'],
  check:[['عزيزي|عزيزتي|إلى|أصدقائي','لمن البطاقة'],['عيد|نجاح|حفل|مناسبة|معرض|تهنئة|مبارك|أهنئ','المناسبة'],['يوم|الساعة|في|بمكان|بقاعة','الموعد أو المكان']]},
 {id:'hurr',e:'🎨',n:'تعبير حر',min:40,
  plan:['اختر أي فكرة تحبها','اكتب بحرية','اقرأ ما كتبت بصوت عالٍ','عدّل ما تريد'],
  prompts:['لو كنت مخترعًا ماذا ستخترع؟','أجمل حلم رأيته','حيوان أتمنى أن أربيه','مدينتي في المستقبل','لو كان لي يوم كامل حر'],
  check:[]}
];
/* أخطاء شائعة: نذكّر بالقاعدة فقط ولا نصحّح نيابة عن الكاتب */
const NB_SPELL=[
 [/(^|[\s،.])(انشاء|إنشاء) الله/g,'«إن شاء الله» تُكتب ثلاث كلمات منفصلة.','unwritten'],
 [/(^|[\s،.])لاكن(?=[\s،.؛!?؟]|$)/g,'«لكن» لا تُكتب فيها الألف بعد اللام.','unwritten'],
 [/(^|[\s،.])(هاذا|هاذه|هاذان|هاؤلاء|ذالك|هاكذا|لاكنّ)(?=[\s،.؛!?؟]|$)/g,'في «هذا، هذه، ذلك، هكذا، هؤلاء» ألف تُنطق ولا تُكتب.','unwritten'],
 [/(^|[\s،.])(اللذي|اللتي|اللذين)(?=[\s،.؛!?؟]|$)/g,'«الذي، التي، الذين» تُكتب بلام واحدة.','unwritten'],
 [/(^|[\s،.])(الى|انا|انت|انتم|اين|امي|ابي|اخي|اختي|احب|اريد)(?=[\s،.؛!?؟]|$)/g,'تذكّر همزة القطع: إلى، أنا، أنت، أين، أمي، أبي، أخي، أحب، أريد.','hmid'],
 [/(^|[\s،.])شيئ(?=[\s،.؛!?؟]|$)/g,'«شيء» همزتها على السطر.','hend'],
 [/[ء-ي]+ ،/g,'لا نترك مسافة قبل الفاصلة: نكتب الفاصلة ملاصقة للكلمة قبلها.','punct'],
 [/[؟!.][ء-ي]/g,'اترك مسافة بعد علامة الترقيم قبل الكلمة التالية.','punct'],
 [/\?/g,'علامة الاستفهام العربية هي «؟».','punct']
];
const NB_STOP=new Set(['في','من','على','إلى','الى','عن','أن','ان','إن','و','ثم','هو','هي','كان','كانت','قال','قالت','ما','لا','لم','لن','مع','هذا','هذه','ذلك','التي','الذي','كل','قد','أنا','انا','نحن','يا','أو','بعد','قبل','عند','حتى','كما']);

function nbType(id){return NB_TYPES.find(t=>t.id===id)||NB_TYPES[NB_TYPES.length-1];}
function nbSentences(t){return String(t).split(/(?<=[.!؟?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);}
function nbWords(t){return words(t).filter(w=>/[ء-ي]/.test(w));}
/* المساعد: يعيد اقتراحات فقط */
function nbAnalyse(type,text){const T=nbType(type);const out=[];const W=nbWords(text);const S=nbSentences(text);
  if(W.length<T.min)out.push(['📏',`كتبت ${W.length} كلمة. يكفي هذا النوع عادةً ${T.min} كلمة أو أكثر؛ ماذا يمكن أن تضيف من تفاصيل؟`]);
  else out.push(['👏',`طول مناسب: ${W.length} كلمة.`]);
  for(const [re,label] of T.check){if(!new RegExp(re).test(text))out.push(['🧩',`هل أضفت ${label}؟`]);else out.push(['✅',`فيه ${label}.`]);}
  S.forEach(s=>{const n=nbWords(s).length;if(n>35)out.push(['✂️',`جملة طويلة (${n} كلمة) تبدأ بـ«${s.split(/\s+/).slice(0,4).join(' ')}...»: هل تستطيع تقسيمها بفاصلة أو نقطة؟`]);});
  const last=String(text).trim().slice(-1);if(W.length>8&&!/[.!؟…:»]/.test(last))out.push(['🔚','لا تنسَ علامة ترقيم في نهاية النص.']);
  S.forEach(s=>{if(/^(هل|ما|ماذا|لماذا|كيف|متى|أين|من|كم|أ[^\s]+)\s/.test(s)&&/^(هل|ماذا|لماذا|كيف|متى|أين|كم)\s/.test(s)&&!/[؟?]$/.test(s))out.push(['❓',`الجملة «${s.slice(0,30)}...» تبدو سؤالًا؛ هل تحتاج إلى «؟»`]);});
  const cnt={};W.forEach(w=>{const k=normLoose(w).replace(/^(وال|فال|بال|ال|و|ف)/,'');if(k.length>2&&!NB_STOP.has(w))cnt[k]=(cnt[k]||0)+1;});
  const rep=Object.entries(cnt).filter(([k,n])=>n>=4).sort((a,b)=>b[1]-a[1]).slice(0,3);
  rep.forEach(([k,n])=>{const ex=W.find(w=>normLoose(w).includes(k));out.push(['🔁',`تكررت «${ex}» ${n} مرات. هل تجد مرادفًا أو ضميرًا يغني عن بعضها؟ ${D.dict.some(d=>normLoose(d.w)===k)?'(ابحث عنها في المعجم)':''}`]);});
  const used=LINKERS.filter(l=>text.includes(l));if(W.length>=40&&used.length<2)out.push(['🔗','جرّب أدوات ربط تصل الأفكار، مثل: '+LINKERS.filter(l=>!used.includes(l)).slice(0,5).join('، ')]);
  const seen=new Set();NB_SPELL.forEach(([re,msg,cat])=>{re.lastIndex=0;if(re.test(text)&&!seen.has(msg)){seen.add(msg);out.push(['✍️',msg+(ERRCAT&&ERRCAT[cat]?` <a href="#/rule/${ERRCAT[cat]}">راجع القاعدة</a>`:'')]);}});
  return out;}

let NB={draft:null};
ROUTES.notebook=function(a,b){
  if(a==='new')return nbEditor({id:null,type:b||'hurr',title:'',text:''});
  if(a==='edit'){const n=S.notebook.find(x=>x.id===b);return n?nbEditor(Object.assign({},n)):go('#/notebook');}
  if(a==='view'){const n=S.notebook.find(x=>x.id===b);return n?nbView(n):go('#/notebook');}
  const d=S.nbDraft&&S.nbDraft.text&&S.nbDraft.text.trim()?S.nbDraft:null;
  app().innerHTML=crumbs([['الرئيسية','#/home'],['دفتر الإبداع']])+guide('هذا دفترك أنت! اختر نوع الكتابة، وسأعطيك خطة وأفكارًا، ثم أقترح عليك ملاحظات… لكني لن أكتب عنك، فالقلم قلمك ✍️','happy')+
  (d?`<div class="card"><b>📝 لديك مسودة لم تُحفظ:</b> ${esc(d.title||nbType(d.type).n)} <a class="btn sm main" href="#/notebook/new/${d.type}" id="nbres">أكمل الكتابة</a> <button class="btn sm" id="nbdrop">احذف المسودة</button></div>`:'')+
  `<h3>✨ ماذا تريد أن تكتب اليوم؟</h3><div class="grid">${NB_TYPES.map(t=>`<a class="tile" href="#/notebook/new/${t.id}"><span class="ic">${t.e}</span><h3>${t.n}</h3><span class="small">${S.notebook.filter(x=>x.type===t.id).length} في دفترك</span></a>`).join('')}</div>
  <h3>📚 نصوصي (${S.notebook.length})</h3>${S.notebook.length?`<div class="wlist">${S.notebook.slice().reverse().map(n=>`<a class="wl" href="#/notebook/view/${n.id}"><span>${nbType(n.type).e}</span><div><b>${esc(n.title||'بلا عنوان')}</b><div class="small">${nbType(n.type).n} · ${nbWords(n.text).length} كلمة · ${fmtDate(n.updated||n.d)}</div></div></a>`).join('')}</div>`:guide('لم تكتب شيئًا بعد. ابدأ بنص قصير، وكل كاتب عظيم بدأ بسطر واحد.','think')}`;
  const dr=$('nbdrop');if(dr)dr.onclick=()=>{S.nbDraft=null;save();ROUTES.notebook();};
  const rs=$('nbres');if(rs)rs.onclick=e=>{e.preventDefault();nbEditor(Object.assign({},S.nbDraft));};
};

function nbEditor(n){const T=nbType(n.type);
  app().innerHTML=crumbs([['دفتر الإبداع','#/notebook'],[T.e+' '+T.n]])+`<div class="card"><h2>${T.e} ${T.n}</h2>
   <details open><summary><b>🧭 خطة الكتابة</b></summary><ol>${T.plan.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></details>
   <div class="row"><button class="btn sm" id="nbidea">💡 اقترح عليّ فكرة</button><span id="nbideat" class="small"></span></div></div>
  <div class="card"><input id="nbtitle" placeholder="العنوان" value="${attr(n.title)}" style="width:100%;font-size:1.15rem;margin-bottom:8px">
   <textarea id="nbtext" rows="12" placeholder="ابدأ الكتابة هنا..." style="width:100%;font-size:calc(1.15rem * var(--fs,1));line-height:2">${esc(n.text)}</textarea>
   <div class="row" style="justify-content:space-between"><span class="small" id="nbcount"></span><span class="small">🔗 أدوات ربط: ${LINKERS.slice(0,8).map(l=>`<button class="chip" data-ins="${attr(l)}">${l}</button>`).join(' ')}</span></div>
   <div class="row center" style="margin-top:8px"><button class="btn gold" id="nbhelp">🐉 اقتراحات ضادون</button><button class="btn main" id="nbsave">💾 احفظ في دفتري</button></div></div>
  <div id="nbtips"></div>`;
  const ta=$('nbtext'),ti=$('nbtitle');
  const upd=()=>{const W=nbWords(ta.value).length;$('nbcount').textContent=`${W} كلمة · ${nbSentences(ta.value).length} جملة`;S.nbDraft={id:n.id,type:n.type,title:ti.value,text:ta.value};save();};
  ta.oninput=ti.oninput=upd;upd();
  $('nbidea').onclick=()=>{$('nbideat').textContent='ما رأيك في: «'+pick(T.prompts||['اكتب عن شيء تحبه'])+'»؟';};
  qsa('[data-ins]').forEach(b=>b.onclick=()=>{const p=ta.selectionStart||ta.value.length;const s=b.dataset.ins+' ';ta.value=ta.value.slice(0,p)+s+ta.value.slice(p);ta.focus();ta.selectionStart=ta.selectionEnd=p+s.length;upd();});
  $('nbhelp').onclick=()=>{if(nbWords(ta.value).length<3){$('nbtips').innerHTML=guide('اكتب بضع جمل أولًا، ثم اطلب اقتراحاتي.','think');return;}
    const tips=nbAnalyse(n.type,ta.value);
    $('nbtips').innerHTML=`<div class="card"><h3>🐉 اقتراحات ضادون</h3><p class="small">هذه أسئلة واقتراحات فقط، وأنت صاحب القرار في التعديل.</p>${tips.map(([e,t])=>`<div class="example">${e} ${t}</div>`).join('')}
      <h3>☑️ راجع بنفسك</h3>${['قرأت النص بصوت عالٍ','كل جملة تنتهي بعلامة ترقيم','الأفكار مرتبة','اخترت كلمات جميلة دقيقة'].map((c,i)=>`<label style="display:block"><input type="checkbox"> ${c}</label>`).join('')}</div>`;stat('notes',true);};
  $('nbsave').onclick=()=>{const text=ta.value.trim();if(nbWords(text).length<3){toast('اكتب بضع كلمات أولًا ✍️');return;}
    const now=new Date().toISOString();let isNew=false;
    if(n.id){const x=S.notebook.find(y=>y.id===n.id);if(x){x.title=ti.value.trim();x.text=text;x.updated=now;}}
    else{isNew=true;n.id='n'+Date.now().toString(36);S.notebook.push({id:n.id,type:n.type,title:ti.value.trim(),text,d:now,updated:now});}
    S.nbDraft=null;save();
    if(isNew){dayInc('notes');addXP(Math.min(30,10+Math.floor(nbWords(text).length/10)),'نص جديد');if(nbWords(text).length>=T.min){confetti();SFX.win();}}
    checkBadges();toast('حُفظ في دفترك 📚');go('#/notebook/view/'+n.id);};
}

function nbView(n){const T=nbType(n.type);
  app().innerHTML=crumbs([['دفتر الإبداع','#/notebook'],[n.title||'بلا عنوان']])+`<div class="card"><span class="pill">${T.e} ${T.n}</span><h2>${esc(n.title||'بلا عنوان')}</h2><p class="small">${fmtDate(n.d)}${n.updated&&n.updated!==n.d?' · عُدّل '+fmtDate(n.updated):''} · ${nbWords(n.text).length} كلمة</p>
   <div class="textbody" style="white-space:pre-wrap;font-size:calc(1.15rem * var(--fs,1));line-height:2">${esc(n.text)}</div></div>
  <div class="row center"><a class="btn main" href="#/notebook/edit/${n.id}">✏️ تعديل</a><a class="btn" href="#/stage/note/${n.id}">🎤 ألقِه على المسرح</a><button class="btn" id="nbdl">⬇️ تنزيل</button><button class="btn" id="nbpr">🖨️ طباعة</button><button class="btn" id="nbdel">🗑️ حذف</button></div>`;
  $('nbdl').onclick=()=>download((n.title||'نص')+'.txt',(n.title?n.title+'\n\n':'')+n.text,'text/plain;charset=utf-8');
  $('nbpr').onclick=()=>window.print();
  $('nbdel').onclick=()=>{const close=modal(`<h3>حذف «${esc(n.title||'بلا عنوان')}»؟</h3><p>لا يمكن استرجاع النص بعد حذفه.</p><div class="row center"><button class="btn rec" id="nbyes">نعم، احذف</button></div>`);
    $('nbyes').onclick=()=>{S.notebook=S.notebook.filter(x=>x.id!==n.id);save();close();go('#/notebook');};};
}
