/* مسرح الإلقاء: نصوص النطق والإلقاء والخطابة، تسجيل بالميكروفون، مؤشرات لطيفة، وتقييم ذاتي */
'use strict';
const STAGE_KINDS={'نطق':'👄','إلقاء':'🎭','خطابة':'🎙️','تقديم':'📻'};
const MAKHARIJ=[
 ['الجوف (تجويف الفم والحلق)','حروف المد: ا و ي الساكنة بعد حركة تناسبها — قال، يقول، قيل'],
 ['الحلق','أقصاه: ء هـ · وسطه: ع ح · أدناه: غ خ'],
 ['اللسان','ق ك (أقصاه) · ج ش ي (وسطه) · ض (حافته) · ل ن ر (طرفه) · ط د ت · ص س ز · ظ ذ ث (طرفه مع الثنايا)'],
 ['الشفتان','ف (الشفة السفلى مع الثنايا العليا) · ب م و (الشفتان)'],
 ['الخيشوم','الغنّة في النون والميم المشددتين: إنّ، ثمّ']];
/* سرعة مناسبة تقريبية (كلمة/دقيقة) بحسب المستوى، والشعر أبطأ */
function paceRange(lvl,poem){const L=[[40,90],[40,90],[55,110],[60,120],[70,130],[80,140],[85,145],[90,150]][Math.max(0,Math.min(7,(lvl||3)-1))];return poem?[Math.round(L[0]*.8),Math.round(L[1]*.85)]:L;}
function speechWords(t){return words(String(t).replace(/\.\.\.|……|…/g,' ')).filter(w=>/[ء-ي]/.test(w));}

window.STAGE={rec:null,stream:null,ctx:null,raf:0,timer:0,urls:[],
  cleanup(){try{if(this.rec&&this.rec.state!=='inactive')this.rec.stop();}catch(e){}
    try{this.stream&&this.stream.getTracks().forEach(t=>t.stop());}catch(e){}
    try{this.ctx&&this.ctx.close();}catch(e){}
    cancelAnimationFrame(this.raf);clearInterval(this.timer);this.urls.forEach(u=>URL.revokeObjectURL(u));
    this.rec=this.stream=this.ctx=null;this.urls=[];},
  canRecord(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
};

let STG={k:''};
ROUTES.stage=function(a,b){
  if(a==='s'){const it=D.speech.find(x=>x.id===b);return it?stagePractice(it,'s:'+it.id,[['مسرح الإلقاء','#/stage'],[it.t]]):go('#/stage');}
  if(a==='text'){const t=allTexts().find(x=>x.id===b);if(!t)return go('#/stage');
    const body=t.type==='poem'?t.body.map(x=>Array.isArray(x)?x.join(' ... '):x).join('\n'):t.body;
    return stagePractice({id:'T-'+t.id,t:t.t,k:'إلقاء',lvl:t.lvl,body,poem:t.type==='poem',tip:t.type==='poem'?'قف وقفة قصيرة بين الشطرين، ووقفة أطول في آخر البيت.':'قف عند الفواصل والنقاط، واجعل صوتك يعبّر عن المعنى.'},null,[['المكتبة','#/library/'+t.type],[t.t,'#/text/'+t.id],['تدرّب على الإلقاء']]);}
  if(a==='note'){const n=S.notebook.find(x=>x.id===b);if(!n)return go('#/stage');
    return stagePractice({id:'N-'+n.id,t:n.title||'نصي',k:'إلقاء',lvl:(currentLevel()||{}).n||3,body:n.text,tip:'هذا نصك أنت! ألقِه بإحساس الكاتب الذي يعرف كل كلمة فيه.'},null,[['دفتر الإبداع','#/notebook'],[n.title||'نصي','#/notebook/view/'+n.id],['ألقِه']]);}
  const L=D.speech.filter(x=>!STG.k||x.k===STG.k);
  const best=id=>{const r=S.stageLog.filter(x=>x.id===id);return r.length?r.length:0;};
  app().innerHTML=crumbs([['الرئيسية','#/home'],['مسرح الإلقاء']])+guide('على مسرحي تتدرب على نطق الحروف من مخارجها، وعلى الإلقاء المعبّر والخطابة والتقديم. اقرأ النص، استمع إليه إن شئت، ثم سجّل صوتك واستمع لنفسك 🎤','cheer')+
  `<div class="row"><button class="chip ${!STG.k?'on':''}" data-k="">الكل (${D.speech.length})</button>${Object.entries(STAGE_KINDS).map(([k,e])=>`<button class="chip ${STG.k===k?'on':''}" data-k="${k}">${e} ${k} (${D.speech.filter(x=>x.k===k).length})</button>`).join('')}</div>
  <details class="card" style="margin-top:10px"><summary><b>🗺️ خريطة مخارج الحروف</b></summary><table class="irab" style="margin-top:8px">${MAKHARIJ.map(([a,b])=>`<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join('')}</table><p class="small">💡 لتعرف مخرج الحرف: سكّنه وأدخل عليه همزة متحركة، مثل: أَبْ، أَتْ، أَعْ، ثم لاحظ أين ينقطع الصوت.</p></details>
  <div class="grid wide" style="margin-top:10px">${L.map(x=>`<a class="tile" href="#/stage/s/${x.id}">${best(x.id)?`<span class="badge">🎤 ${best(x.id)}</span>`:''}<span class="ic">${STAGE_KINDS[x.k]||'🎤'}</span><h3>${esc(x.t)}</h3><span class="small">${x.k} · المستوى ${x.lvl}${x.focus?' · '+x.focus.join(' '):''}</span></a>`).join('')}</div>
  <div class="card"><b>📚 تريد نصًا آخر؟</b> افتح أي قصيدة أو نص في <a href="#/library">المكتبة</a> واضغط «تدرّب على قراءته جهرًا».</div>
  ${S.stageLog.length?`<div class="card"><h3>📈 آخر تدريباتك</h3><table class="tbl"><tr><th>التاريخ</th><th>النص</th><th>المدة</th><th>كلمة/دقيقة</th></tr>${S.stageLog.slice(-6).reverse().map(x=>`<tr><td>${fmtDate(x.d)}</td><td>${esc(x.t)}</td><td>${Math.round(x.dur)} ث</td><td>${x.wpm||'—'}</td></tr>`).join('')}</table></div>`:''}`;
  qsa('[data-k]').forEach(b=>b.onclick=()=>{STG.k=b.dataset.k;ROUTES.stage();});
};

function stageTextHTML(it){const lines=String(it.body).split(/\n+/);
  return `<div class="stage-text">${lines.map(l=>l.includes(' ... ')?`<div class="bayt"><span>${esc(l.split(' ... ')[0])}</span><span>${esc(l.split(' ... ')[1])}</span></div>`:`<p>${esc(l)}</p>`).join('')}</div>`;}

function stagePractice(it,audioId,cr){
  const nW=speechWords(it.body).length;const poem=it.poem||/ \.\.\. /.test(it.body);const [lo,hi]=paceRange(it.lvl,poem);
  const prevKey='st:'+it.id;
  app().innerHTML=crumbs(cr)+`<div class="card"><h2>${STAGE_KINDS[it.k]||'🎤'} ${esc(it.t)}</h2><p class="small">${esc(it.k||'')} · المستوى ${it.lvl||'—'} · ${nW} كلمة${it.focus?' · حروف التركيز: '+it.focus.map(f=>`<b class="pill">${esc(f)}</b>`).join(' '):''}</p>
   ${it.tip?`<div class="rule">💡 ${esc(it.tip)}</div>`:''}${stageTextHTML(it)}</div>
  <div class="card center"><div class="row center">
    <button class="btn" id="slisten">🔊 استمع للنموذج</button>
    <button class="btn main" id="srec">🎙️ ابدأ التسجيل</button>
    <button class="btn hide" id="sprev">⏮️ تسجيلك السابق</button></div>
    <div style="margin:12px 0"><span id="stime" style="font-size:1.6rem;font-weight:700">0:00</span></div>
    <div class="meter" title="مستوى الصوت"><i id="slevel"></i></div>
    <p class="small" id="snote">${STAGE.canRecord()?'سيطلب المتصفح إذنك باستخدام الميكروفون. التسجيل يبقى على جهازك فقط.':'⚠️ التسجيل غير متاح في هذا المتصفح. يمكنك التدرب بالمؤقت: اضغط «ابدأ» ثم اقرأ، ثم «إيقاف».'}</p></div>
  <div id="sres"></div>`;
  ADB.get(prevKey).then(b=>{if(b&&$('sprev')){const p=$('sprev');p.classList.remove('hide');p.onclick=()=>{const u=URL.createObjectURL(b);STAGE.urls.push(u);const a=new Audio(u);a.play();};}});
  $('slisten').onclick=async()=>{const r=await AUDIO.play(audioId,it.body.replace(/\.\.\./g,'،'),1);if(r==='none')toast('لا يوجد تسجيل نموذجي لهذا النص، وصوت المتصفح العربي غير متوفر. يمكن لولي الأمر تسجيل نموذج من لوحته.',4500);};
  const recBtn=$('srec');let t0=0,samples=[],running=false,chunks=[];
  const tick=()=>{const s=Math.floor((Date.now()-t0)/1000);$('stime').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(s>=180)stop();};
  const start=async()=>{AUDIO.stop();samples=[];chunks=[];
    if(STAGE.canRecord()){
      try{STAGE.stream=await navigator.mediaDevices.getUserMedia({audio:true});}
      catch(e){$('snote').textContent='⚠️ لم يُسمح باستخدام الميكروفون. يمكنك التدرب بالمؤقت فقط، أو السماح بالميكروفون من إعدادات المتصفح.';STAGE.stream=null;}
    }
    if(STAGE.stream){try{
      STAGE.rec=new MediaRecorder(STAGE.stream);STAGE.rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
      STAGE.rec.onstop=()=>finish(new Blob(chunks,{type:STAGE.rec&&STAGE.rec.mimeType||'audio/webm'}));STAGE.rec.start();
      const AC=window.AudioContext||window.webkitAudioContext;if(AC){STAGE.ctx=new AC();const src=STAGE.ctx.createMediaStreamSource(STAGE.stream);const an=STAGE.ctx.createAnalyser();an.fftSize=1024;src.connect(an);const buf=new Float32Array(an.fftSize);
        const loop=()=>{an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;const rms=Math.sqrt(s/buf.length);samples.push([Date.now()-t0,rms]);const el=$('slevel');if(el)el.style.width=Math.min(100,rms*400)+'%';STAGE.raf=requestAnimationFrame(loop);};loop();}
    }catch(e){STAGE.rec=null;}}
    t0=Date.now();running=true;STAGE.timer=setInterval(tick,250);
    recBtn.innerHTML='<span class="recdot"></span> إيقاف';recBtn.classList.add('rec');SFX.tap();
  };
  const stop=()=>{if(!running)return;running=false;clearInterval(STAGE.timer);cancelAnimationFrame(STAGE.raf);
    recBtn.innerHTML='🎙️ سجّل مرة أخرى';recBtn.classList.remove('rec');const el=$('slevel');if(el)el.style.width='0';
    if(STAGE.rec&&STAGE.rec.state!=='inactive')STAGE.rec.stop();else finish(null);
    try{STAGE.stream&&STAGE.stream.getTracks().forEach(t=>t.stop());}catch(e){}STAGE.stream=null;};
  recBtn.onclick=()=>running?stop():start();
  const finish=(blob)=>{const dur=(Date.now()-t0)/1000;try{STAGE.ctx&&STAGE.ctx.close();}catch(e){}STAGE.ctx=null;
    if(dur<2){$('sres').innerHTML=guide('التسجيل قصير جدًّا. اضغط «ابدأ» ثم اقرأ النص كاملًا، ثم «إيقاف».','think');return;}
    const an=analyseVoice(samples);const wpm=Math.round(nW/(Math.max(1,dur-an.lead)/60));
    const tips=[];
    if(wpm<lo)tips.push(['🐢','تمهّلك جميل للوضوح، ويمكنك أن تزيد سرعتك قليلًا لتكون القراءة متصلة.']);
    else if(wpm>hi)tips.push(['🐇','قراءتك سريعة قليلًا؛ جرّب أن تقف عند الفواصل والنقاط لتلتقط أنفاسك.']);
    else tips.push(['👏','سرعتك مناسبة لهذا النص.']);
    if(an.ok){if(an.avg<0.02)tips.push(['🔈','صوتك منخفض قليلًا؛ تخيّل أنك تكلم آخر طالب في الصف.']);else if(an.clip>0.08)tips.push(['📢','صوتك قوي جدًّا أحيانًا؛ ابتعد عن الميكروفون قليلًا.']);else tips.push(['🔊','ارتفاع صوتك واضح.']);
      const lines=String(it.body).split(/\n+/).length;if(an.pauses<Math.min(2,lines-1))tips.push(['⏸️','خذ وقفات قصيرة عند نهاية الجمل أو الأبيات؛ الوقفة تعطي المعنى قوة.']);else tips.push(['✅','وقفاتك بين الجمل جيدة.']);}
    let url='';if(blob){url=URL.createObjectURL(blob);STAGE.urls.push(url);}
    const C=[['وضوح الحروف','🗣️'],['التعبير بالصوت','🎭'],['الوقفات','⏸️'],['الثقة','💪']];
    $('sres').innerHTML=`<div class="card"><h3>🎧 نتيجة تدريبك</h3>${url?`<audio controls src="${url}" style="width:100%"></audio>`:'<p class="small">(تدريب بالمؤقت دون تسجيل)</p>'}
      <div class="stats"><div class="stat"><b>${Math.round(dur)}</b><span>ثانية</span></div><div class="stat"><b>${nW}</b><span>كلمة</span></div><div class="stat"><b>${wpm}</b><span>كلمة/دقيقة</span></div>${an.ok?`<div class="stat"><b>${an.pauses}</b><span>وقفة</span></div>`:''}</div>
      <p class="small">السرعة المناسبة تقريبًا لهذا النص: ${lo}–${hi} كلمة في الدقيقة. هذه مؤشرات تقريبية تساعدك، والحكم الأهم أذنك أنت.</p>
      ${tips.map(([e,t])=>`<div class="example">${e} ${t}</div>`).join('')}
      <h3>⭐ قيّم نفسك بعد الاستماع</h3>${C.map(([n,e],i)=>`<div class="row" style="justify-content:space-between"><span>${e} ${n}</span><span class="stars" data-i="${i}">${[1,2,3].map(s=>`<button class="iconbtn" data-s="${s}" aria-label="${s}">☆</button>`).join('')}</span></div>`).join('')}
      <div class="row center" style="margin-top:10px"><button class="btn main" id="ssave">💾 احفظ في سجلي</button></div></div>`;
    const self=[0,0,0,0];qsa('.stars').forEach(g=>{const i=+g.dataset.i;g.querySelectorAll('button').forEach(b=>b.onclick=()=>{self[i]=+b.dataset.s;g.querySelectorAll('button').forEach(x=>x.textContent=+x.dataset.s<=self[i]?'⭐':'☆');});});
    $('ssave').onclick=async()=>{$('ssave').disabled=true;
      S.stageLog.push({d:new Date().toISOString(),id:it.id,t:it.t,dur:Math.round(dur),wpm,self});if(S.stageLog.length>200)S.stageLog.shift();save();
      if(blob){try{await ADB.put(prevKey,blob);}catch(e){}}
      dayInc('stage');addXP(10,'تدريب إلقاء');stat('stage',true);checkBadges();toast('حُفظ تدريبك 🎤 استمع لتسجيلك السابق في المرة القادمة لتلاحظ تقدمك.',3500);};
  };
}
/* تحليل بسيط: متوسط الصوت، وعدد الوقفات (صمت ≥ 0.5ث بين كلام)، وزمن البداية قبل أول صوت */
function analyseVoice(samples){if(!samples||samples.length<10)return{ok:false,pauses:0,avg:0,clip:0,lead:0};
  const v=samples.map(x=>x[1]);const peak=Math.max(...v);const thr=Math.max(0.008,peak*0.12);
  const voiced=v.filter(x=>x>thr);const avg=voiced.length?voiced.reduce((a,b)=>a+b,0)/voiced.length:0;
  const clip=v.filter(x=>x>0.5).length/v.length;
  let pauses=0,silStart=null,started=false,lead=0;
  for(const [t,r] of samples){if(r>thr){if(!started){started=true;lead=t/1000;}if(silStart!=null&&t-silStart>=500)pauses++;silStart=null;}else if(started&&silStart==null)silStart=t;}
  return{ok:true,pauses,avg,clip,lead:Math.min(lead,5)};}
