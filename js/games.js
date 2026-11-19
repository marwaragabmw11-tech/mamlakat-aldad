/* ألعاب العربية: محرك عام (مستويات، نقاط، أرواح، وقت، تغذية راجعة) + ألعاب خاصة (الذاكرة، خمّن الكلمة) */
'use strict';
const ROLES=['مبتدأ','خبر','فاعل','مفعول به','اسم مجرور','حرف جر','فعل ماضٍ','فعل مضارع','فعل أمر','نعت','حال','ظرف','مضاف إليه','اسم كان','خبر كان','اسم إنّ','خبر إنّ'];
const SUNL=new Set('ت ث د ذ ر ز س ش ص ض ط ظ ل ن'.split(' '));
const LVN=['سهل','متوسط','صعب'];
const ROUNDS=[8,10,12],QTIME=[0,25,15];
const GCATS={lang:'🔤 لغة ومعجم',nahw:'🏛️ نحو',imla:'✍️ إملاء',turath:'🏺 تراث',quran:'🌙 قرآن'};
const plain=w=>stripTashkeel(String(w||'')).trim();
const MC=(q,right,wrongs,lv,h)=>{const o=[right,...uniqOpts(wrongs.filter(x=>normLoose(x)!==normLoose(right))).slice(0,lv>1?3:2)];return {t:'mc',q,o:uniqOpts(o),a:0,h};};
function dictBy(groups,ok){return D.dict.filter(w=>groups.includes(w.g)&&(!ok||ok(w)));}
function lvGroups(lv,base){return base[Math.min(lv,base.length)-1];}
function lastL(w){let s=plain(w).replace(/[^ء-ي]/g,'');let c=s.slice(-1);if(c==='ة')c='ت';if(c==='ى')c='ي';if('أإآ'.includes(c))c='ا';return c;}

const GAMES=[
 {id:'order',e:'🧩',n:'ورشة تكوين الجمل',d:'رتّب الكلمات لتكوّن جملة صحيحة.',cat:'nahw',x:2,
  make(lv){return sample(D.gbank.order.filter(b=>b.d<=lv),99).sort((a,b)=>b.d-a.d).map(b=>({t:'or',q:'رتّب الكلمات لتكوّن جملة صحيحة',w:b.w,alt:b.alt}));}},
 {id:'irab',e:'🏁',n:'سباق الإعراب',d:'ما إعراب الكلمة الملوّنة؟ أسرع قبل انتهاء الوقت!',cat:'nahw',
  make(lv){const pool=ROLES.slice(0,lv===1?9:lv===2?13:17);return shuffle(D.gbank.irab.filter(b=>b.d<=lv)).map(b=>MC(`ما إعراب «${b.w}» في: ${b.s}؟`,b.a,shuffle(pool.filter(r=>r!==b.a)),lv,b.h));}},
 {id:'classify',e:'🗂️',n:'اسم أم فعل أم حرف؟',d:'صنّف الكلمة بسرعة.',cat:'nahw',
  make(lv){return shuffle(D.gbank.classify).map(b=>({t:'mc',q:`«${b.w}» نوعها:`,o:[b.a,...['اسم','فعل','حرف'].filter(x=>x!==b.a)],a:0,h:b.a==='فعل'?'يدل على حدث وزمن.':b.a==='حرف'?'لا يظهر معناه إلا مع غيره.':'يقبل «ال» أو التنوين.'}));}},
 {id:'sunmoon',e:'🌞',n:'الشمسية والقمرية',d:'هل تُنطق اللام أم تختفي؟',cat:'imla',
  make(lv){const fromDict=lv>1?D.dict.map(w=>plain(w.w)).filter(w=>/^ال[ء-ي]{2,}$/.test(w)):[];const list=uniqOpts([...D.gbank.sunmoon.map(b=>b.w),...fromDict]);
   return shuffle(list).map(w=>{const c=w[2];const sun=SUNL.has(c);return {t:'mc',q:`اللام في «${w}»:`,o:sun?['شمسية','قمرية']:['قمرية','شمسية'],a:0,h:sun?`بعدها «${c}»: تُكتب ولا تُنطق.`:`بعدها «${c}»: تُكتب وتُنطق.`};});}},
 {id:'match',e:'🔤',n:'الكلمة ومعناها',d:'اختر المعنى الصحيح للكلمة.',cat:'lang',
  make(lv){return shuffle(dictBy(lvGroups(lv,[['daily'],['daily','fusha'],['rare']]))).map(w=>MC(`${w.e||''} ما معنى «${w.w}»؟`,w.m,distract(w,3).map(x=>x.m),lv,w.s));}},
 {id:'fusha',e:'🗣️',n:'قلها بالفصحى',d:'حوّل الكلمة العامية إلى فصيحة.',cat:'lang',
  make(lv){return shuffle(dictBy(['fusha'],w=>w.amm)).map(w=>MC(`كيف نقول «${w.amm}» بالفصحى؟`,w.w,distract(w,3,x=>x.g==='fusha').map(x=>x.w),lv,w.s));}},
 {id:'synant',e:'⚖️',n:'المرادف والضد',d:'اعثر على المرادف أو الضد.',cat:'lang',
  make(lv){const L=shuffle(dictBy(lvGroups(lv,[['daily'],['daily','fusha'],['daily','fusha','rare']]),w=>(w.syn&&w.syn.length)||(w.ant&&w.ant.length)));
   return L.map(w=>{const bad=new Set([...(w.syn||[]),...(w.ant||[])].map(normLoose));const useSyn=w.syn&&w.syn.length&&(!w.ant||!w.ant.length||Math.random()<.5);
    return MC(useSyn?`ما مرادف «${w.w}»؟`:`ما ضد «${w.w}»؟`,useSyn?w.syn[0]:w.ant[0],distract(w,4,x=>!bad.has(normLoose(x.w))).map(x=>x.w),lv,'معنى «'+w.w+'»: '+w.m);});}},
 {id:'plural',e:'👥',n:'جمّعها',d:'اكتب جمع الكلمة.',cat:'lang',x:2,
  make(lv){return shuffle(dictBy(lvGroups(lv,[['daily'],['daily','fusha'],['rare','fusha']]),w=>w.pl&&!/\s/.test(w.w))).map(w=>({t:'in',q:`${w.e||''} اكتب جمع «${w.w}»`,a:w.pl.split(/\s*[،,]\s*/).filter(Boolean),s:1,h:'الجمع: '+w.pl}));}},
 {id:'anagram',e:'🔀',n:'رتّب الحروف',d:'رتّب الحروف لتكوّن الكلمة.',cat:'imla',x:2,
  make(lv){const len=[[3,4],[4,5],[5,7]][lv-1];return shuffle(dictBy(['daily','fusha','rare'],w=>{const p=plain(w.w);return !/\s|\./.test(p)&&p.length>=len[0]&&p.length<=len[1];})).map(w=>({t:'lt',q:`${w.e||''} رتّب الحروف: ${w.m}`,w:plain(w.w)}));}},
 {id:'missing',e:'🕳️',n:'الحرف المفقود',d:'أكمل الكلمة بالحرف الناقص.',cat:'imla',
  make(lv){const L=shuffle(dictBy(lvGroups(lv,[['daily'],['daily','fusha'],['rare','quran']]),w=>{const p=plain(w.w);return !/\s|\./.test(p)&&p.length>=3;}));
   return L.map(w=>{const p=plain(w.w);const start=p.startsWith('ال')?2:0;const i=start+Math.floor(Math.random()*(p.length-start));const c=p[i];
    const near={'ت':'ط','ط':'ت','س':'ص','ص':'س','د':'ض','ض':'د','ذ':'ز','ز':'ذ','ظ':'ض','ث':'س','ق':'ك','ك':'ق','ح':'ه','ه':'ح','ع':'أ','أ':'ا','ا':'أ','ة':'ه','ى':'ا'};
    const opts=uniqOpts([c,near[c],...sample(ALPHA.filter(x=>x!==c),4)].filter(Boolean)).slice(0,lv>1?4:3);
    return {t:'mc',q:`${w.e||''} أكمل: ${p.slice(0,i)}ـ؟ـ${p.slice(i+1)} (${w.m})`,o:opts,a:0,h:'الكلمة: '+p};});}},
 {id:'bee',e:'🐝',n:'نحلة الإملاء',d:'استمع إلى الكلمة واكتبها صحيحة.',cat:'imla',x:2,
  make(lv){return shuffle(dictBy(lvGroups(lv,[['daily'],['daily','fusha'],['rare','fusha']]),w=>!/\s|\./.test(w.w))).map(w=>({t:'au',q:`${w.e||''} اكتب الكلمة التي تسمعها — معناها: ${w.m}`,a:[plain(w.w)],id:'w:'+w.id,h:'الكلمة: '+w.w}));}},
 {id:'dots',e:'🔘',n:'التصحيف: نقطة تغيّر المعنى',d:'اختر الكلمة ذات النقاط الصحيحة.',cat:'imla',
  make(lv){const B=D.gbank.dots;return shuffle(B).map(b=>({t:'mc',q:`أي كلمة معناها: ${b.m}؟`,o:uniqOpts([b.a,b.x,...(lv>1?sample(B.filter(y=>y.a!==b.a&&y.a!==b.x),1).map(y=>y.a):[])]),a:0,h:`«${b.a}» و«${b.x}» تختلفان في النقاط فقط.`}));}},
 {id:'odd',e:'🎯',n:'الكلمة الغريبة',d:'أي الكلمات لا تنتمي إلى المجموعة؟',cat:'lang',
  make(lv){const B=lv===1?D.gbank.odd.slice(0,20):D.gbank.odd;return shuffle(B).map(b=>{const o=b.o.slice();const odd=o[b.a];const rest=o.filter((_,i)=>i!==b.a);return {t:'mc',q:'أي كلمة غريبة عن المجموعة؟',o:[odd,...rest],a:0,h:b.why};});}},
 {id:'chain',e:'⛓️',n:'سلسلة الكلمات',d:'اختر كلمة تبدأ بآخر حرف من الكلمة (على طريقة المشاعرة).',cat:'turath',
  make(lv){const W=uniqOpts(D.dict.map(w=>plain(w.w)).filter(w=>!/\s|\./.test(w)&&w.length>=3));const byF={};W.forEach(w=>{const f=firstLetter(w);(byF[f]=byF[f]||[]).push(w);});
   return shuffle(W).filter(w=>(byF[lastL(w)]||[]).filter(x=>x!==w).length).map(w=>{const L=lastL(w);const right=pick(byF[L].filter(x=>x!==w));const wr=sample(W.filter(x=>firstLetter(x)!==L),3);
    return MC(`كلمة تبدأ بآخر حرف من «${w}» (الحرف: ${L})`,right,wr,lv,`آخر حرف في «${w}» هو «${L}»${plain(w).endsWith('ة')?' (التاء المربوطة تُعد تاءً)':''}.`);});}},
 {id:'proverb',e:'📜',n:'أكمل المثل',d:'أكمل المثل العربي أو اختر معناه.',cat:'turath',
  make(lv){const P=D.proverbs.filter(p=>p.p.split(/\s+/).length>=3);
   return shuffle(P).map((p,i)=>{const w=p.p.split(/\s+/);const k=Math.ceil(w.length/2);
    if(i%2===0||lv===1)return MC(`أكمل المثل: «${w.slice(0,k).join(' ')} …»`,w.slice(k).join(' '),sample(P.filter(x=>x!==p),5).map(x=>{const y=x.p.split(/\s+/);return y.slice(Math.ceil(y.length/2)).join(' ');}),lv,'المعنى: '+p.m);
    return MC(`ما معنى المثل: «${p.p}»؟`,p.m,sample(P.filter(x=>x!==p),5).map(x=>x.m),lv,p.use?'نقوله: '+p.use:'');});}},
 {id:'riddle',e:'❓',n:'لغز وجواب',d:'حلّ اللغز واختر الجواب.',cat:'turath',
  make(lv){const R=D.riddles.filter(r=>lv===1?r.src==='تراثي':lv===2?true:r.src==='أصلي');return shuffle(R).map(r=>MC(r.q,r.a,sample(D.riddles.filter(x=>x!==r&&x.a!==r.a&&x.src===r.src),5).map(x=>x.a),lv,r.h));}},
 {id:'quran',e:'🌙',n:'كنز الكلمات القرآنية',d:'ما معنى الكلمة القرآنية؟',cat:'quran',
  make(lv){return shuffle(dictBy(['quran'])).map(w=>MC(`ما معنى «${w.w}» في قوله تعالى: ﴿${w.q}﴾؟`,w.m,distract(w,4).map(x=>x.m),lv,`[${w.qr}]`));}},
 {id:'memory',e:'🃏',n:'لعبة الذاكرة',d:'اقلب البطاقات وطابق الرمز بالكلمة.',cat:'lang',custom:'memory'},
 {id:'guess',e:'🏮',n:'خمّن الكلمة',d:'خمّن حروف الكلمة قبل أن تنطفئ الفوانيس.',cat:'imla',custom:'guess'}
];

window.GAME={timer:0,to:0,stop(){clearInterval(this.timer);clearTimeout(this.to);}};
function gState(id){const g=S.games[id]||(S.games[id]={plays:0,best:{},pct:{}});g.best=g.best||{};g.pct=g.pct||{};return g;}
function gUnlocked(id,lv){if(lv===1||S.openAll)return true;const g=gState(id);return (g.pct[lv-1]||0)>=70;}
function gStars(p){return p>=90?3:p>=70?2:p>=40?1:0;}

let GF='';
ROUTES.games=function(){
  const L=GAMES.filter(g=>!GF||g.cat===GF);
  app().innerHTML=crumbs([['الرئيسية','#/home'],['ألعاب العربية']])+guide(`عندي ${GAMES.length} لعبة! لكل لعبة ثلاثة مستويات: سهل ومتوسط وصعب. اجمع 70% أو أكثر لتفتح المستوى التالي 🎮`,'excited')+
  `<div class="row"><button class="chip ${!GF?'on':''}" data-c="">الكل</button>${Object.entries(GCATS).map(([k,v])=>`<button class="chip ${GF===k?'on':''}" data-c="${k}">${v}</button>`).join('')}</div>
  <div class="grid" style="margin-top:10px">${L.map(g=>{const s=gState(g.id);const st=[1,2,3].map(l=>s.pct[l]!=null?'⭐'.repeat(gStars(s.pct[l]))||'▫️':'▫️').join(' ');
    return `<a class="tile" href="#/game/${g.id}"><span class="ic">${g.e}</span><h3>${esc(g.n)}</h3><span class="small">${esc(g.d)}</span><span class="small">${s.plays?'🏆 '+Math.max(0,...Object.values(s.best))+' نقطة':''}</span></a>`;}).join('')}</div>`;
  qsa('[data-c]').forEach(b=>b.onclick=()=>{GF=b.dataset.c;ROUTES.games();});
};
ROUTES.game=function(id,lvArg){const g=GAMES.find(x=>x.id===id);if(!g)return go('#/games');const s=gState(id);
  app().innerHTML=crumbs([['الألعاب','#/games'],[g.n]])+`<div class="card center"><div style="font-size:3rem">${g.e}</div><h2>${esc(g.n)}</h2><p>${esc(g.d)}</p>
   <div class="row center">${[1,2,3].map(l=>{const ok=gUnlocked(id,l);return `<button class="btn ${ok?(l===1?'main':'gold'):''}" data-lv="${l}" ${ok?'':'disabled'}>${ok?'':'🔒 '}${LVN[l-1]}${s.pct[l]!=null?' · '+s.pct[l]+'%':''}</button>`;}).join('')}</div>
   <p class="small">${g.custom?'':`${ROUNDS[0]}–${ROUNDS[2]} جولة · 3 أرواح ❤️ · `}المستوى المتوسط والصعب فيهما وقت ⏱️ ونقاط إضافية للسرعة والتتابع.</p></div><div id="ghost"></div>`;
  qsa('[data-lv]').forEach(b=>b.onclick=()=>gStart(g,+b.dataset.lv));
  if(lvArg&&gUnlocked(id,+lvArg))gStart(g,+lvArg);
};

function gStart(g,lv){GAME.stop();const host=app();try{history.replaceState(null,'','#/game/'+g.id+'/'+lv);}catch(e){}
  const head=()=>`<div class="card row" style="justify-content:space-between;align-items:center"><b>${g.e} ${esc(g.n)} · ${LVN[lv-1]}</b><span id="ghud"></span></div>`;
  if(g.custom==='memory')return gMemory(g,lv,host,head);
  if(g.custom==='guess')return gGuess(g,lv,host,head);
  let items=g.make(lv).filter(it=>it.t!=='mc'||it.o.length>=2).slice(0,ROUNDS[lv-1]);
  if(!items.length){host.innerHTML=guide('لا توجد مادة كافية لهذه اللعبة بعد.','think');return;}
  let i=0,lives=3,score=0,streak=0,ok=0,answered=false;const T=QTIME[lv-1]*(g.x||1);
  const hud=()=>{$('ghud').innerHTML=`${'❤️'.repeat(lives)}${'🤍'.repeat(3-lives)} · ⭐ ${score} · ${i+1}/${items.length}${streak>1?' · 🔥'+streak:''}`;};
  const render=()=>{const it=items[i];answered=false;
    host.innerHTML=head()+(T?`<div class="meter" style="margin:6px 0"><i id="gtime" style="width:100%;transition:width .25s linear"></i></div>`:'')+`<div class="card"><div class="ex fadein" id="exbox">${exHTML(it,i)}</div><div id="exfb"></div><div class="row" id="exnav"></div></div>`;
    hud();bindEx(it,host,res);
    if(T){let left=T;const t0=Date.now();GAME.timer=setInterval(()=>{left=T-(Date.now()-t0)/1000;const el=$('gtime');if(el)el.style.width=Math.max(0,left/T*100)+'%';if(left<=0){clearInterval(GAME.timer);qsa('button.opt,.token,#exgo,#exin,#exclr',host).forEach(b=>b.disabled=true);res(false,true);}},250);GAME.t0=t0;}};
  const res=(good,timeout)=>{if(answered)return;answered=true;clearInterval(GAME.timer);const it=items[i];
    if(good){ok++;streak++;const bonus=T?Math.max(0,Math.round(T-(Date.now()-GAME.t0)/1000)):0;score+=10+bonus+Math.min(10,(streak-1)*2);SFX.ok();}
    else{streak=0;lives--;SFX.no();if(!g.noRev)addRev('G:'+g.id+':'+(it.q||'')+':'+(it.w||''),stripMeta(it),'games');}
    stat('games',good);hud();
    const ans=it.t==='mc'?it.o[it.a]:it.t==='or'?it.w.join(' '):it.t==='lt'?it.w:[].concat(it.a)[0];
    $('exfb').innerHTML=`<div class="fb ${good?'ok':'no'}">${good?pick(['أحسنت! ✨','رائع! 🌟','ممتاز! 💫','صحيح 👏']):(timeout?'⏰ انتهى الوقت! ':'ليست هذه 🌱 ')+'الصحيح: <b>'+esc(ans)+'</b>'}${it.h?'<div class="small" style="margin-top:4px">💡 '+esc(it.h)+'</div>':''}</div>`;
    const last=i>=items.length-1||lives<=0;
    $('exnav').innerHTML=`<button class="btn main" id="gnext">${last?'النتيجة 🏁':'التالي ←'}</button>`;
    $('gnext').onclick=()=>{clearTimeout(GAME.to);if(last)return gEnd(g,lv,ok,i+1,score,lives<=0);i++;render();};
    if(good&&!last&&!it.h)GAME.to=setTimeout(()=>{const b=$('gnext');if(b)b.click();},900);};
  render();
}
function gEnd(g,lv,ok,n,score,dead,pctOverride){GAME.stop();const total=pctOverride!=null?null:(dead?Math.max(n,ROUNDS[lv-1]):n);
  const p=pctOverride!=null?pctOverride:pct(ok,total);const s=gState(g.id);const wasLocked=lv<3&&!gUnlocked(g.id,lv+1);
  s.plays++;s.last=today();s.best[lv]=Math.max(s.best[lv]||0,score);s.pct[lv]=Math.max(s.pct[lv]||0,p);save();
  dayInc('games');addXP(Math.max(2,Math.round(score/10)),'لعبة');checkBadges();
  const unlocked=wasLocked&&gUnlocked(g.id,lv+1);if(p>=70){confetti();SFX.win();}
  app().innerHTML=crumbs([['الألعاب','#/games'],[g.n,'#/game/'+g.id],['النتيجة']])+`<div class="result card fadein">${guide(dead?'نفدت الأرواح هذه المرة! كل جولة تعلّمك شيئًا، جرّب مرة أخرى 💪':p>=90?'بطل الألعاب! 🏆':p>=70?'أحسنت! 🌟':'محاولة جيدة! تدرّب أكثر وستتقدم 🌱',p>=70?'cheer':'think')}
   <div class="score">${'⭐'.repeat(gStars(p))||'🌱'}</div><p><b>${score}</b> نقطة · ${pctOverride!=null?'':ok+' من '+total+' · '}${p}%</p>
   ${unlocked?`<div class="example">🔓 فتحتَ المستوى ${LVN[lv]}!</div>`:''}
   <div class="row center"><button class="btn main" onclick="ROUTES.game('${g.id}',${lv})">↺ العب مجددًا</button>${unlocked||(lv<3&&gUnlocked(g.id,lv+1))?`<button class="btn gold" onclick="ROUTES.game('${g.id}',${lv+1})">المستوى ${LVN[lv]} ←</button>`:''}<a class="btn" href="#/games">كل الألعاب</a></div></div>`;
}

/* لعبة الذاكرة: طابق الرمز بالكلمة */
function gMemory(g,lv,host,head){const P=[4,6,8][lv-1];
  const W=sample(D.dict.filter(w=>w.g==='daily'&&w.e&&!/\s/.test(w.w)),P);
  const cards=shuffle([...W.map(w=>({k:w.id,v:w.e,em:1})),...W.map(w=>({k:w.id,v:w.w}))]);
  let open=[],found=0,moves=0,lock=false,score=0;const t0=Date.now();
  host.innerHTML=head()+`<div class="memgrid" style="display:grid;grid-template-columns:repeat(${P>6?4:P>4?4:4},1fr);gap:8px">${cards.map((c,i)=>`<button class="memc" data-i="${i}" aria-label="بطاقة"><span>❔</span></button>`).join('')}</div><p class="small center">اقلب بطاقتين: الرمز والكلمة التي تعبّر عنه.</p>`;
  const hud=()=>{$('ghud').textContent=`🔄 ${moves} محاولة · ✅ ${found}/${P}`;};hud();
  qsa('.memc',host).forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('done')||open.includes(b))return;const c=cards[+b.dataset.i];b.classList.add('open');b.innerHTML=`<span style="${c.em?'font-size:2rem':'font-size:1.05rem;font-weight:700'}">${esc(c.v)}</span>`;open.push(b);SFX.tap();
    if(open.length===2){moves++;const [a,d]=open.map(x=>cards[+x.dataset.i]);
      if(a.k===d.k&&a.em!==d.em){open.forEach(x=>x.classList.add('done'));open=[];found++;score+=15;SFX.ok();hud();
        if(found===P){const p=Math.min(100,Math.round(P/moves*100));score+=Math.max(0,60-Math.round((Date.now()-t0)/1000));setTimeout(()=>gEnd(g,lv,found,P,score,false,Math.max(p,40)),700);}}
      else{lock=true;SFX.no();setTimeout(()=>{open.forEach(x=>{x.classList.remove('open');x.innerHTML='<span>❔</span>';});open=[];lock=false;hud();},850);}}});
}
/* خمّن الكلمة: لوحة حروف وستة فوانيس */
const KB='ا أ إ آ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ى ة ء ؤ ئ'.split(' ');
function gGuess(g,lv,host,head){const N=[4,5,6][lv-1];const len=[[3,4],[4,5],[5,8]][lv-1];
  const W=sample(D.dict.filter(w=>['daily','fusha','rare'].includes(w.g)&&!/\s|\./.test(w.w)&&plain(w.w).length>=len[0]&&plain(w.w).length<=len[1]),N);
  let r=0,okc=0,score=0;
  const round=()=>{const w=W[r];const word=plain(w.w);const got=new Set();let miss=0;const MAX=6;
    const draw=()=>{const done=[...word].every(c=>got.has(c));
      host.innerHTML=head()+`<div class="card center"><p>${w.e||''} <b>تلميح:</b> ${esc(w.m)}</p>
       <div class="row center" style="direction:rtl;gap:6px;font-size:1.8rem;font-weight:700">${[...word].map(c=>`<span style="min-width:34px;border-bottom:3px solid var(--teal)">${got.has(c)?c:'&nbsp;'}</span>`).join('')}</div>
       <p style="font-size:1.5rem;margin:8px 0">${'🏮'.repeat(MAX-miss)}${'⚫'.repeat(miss)}</p>
       <div class="kb" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${KB.map(c=>`<button class="token" data-c="${c}" ${got.has(c)||(done||miss>=MAX)?'disabled':''}>${c}</button>`).join('')}</div><div id="gfb"></div></div>`;
      $('ghud').textContent=`كلمة ${r+1}/${N} · ⭐ ${score}`;
      qsa('[data-c]',host).forEach(b=>b.onclick=()=>{const c=b.dataset.c;got.add(c);if(word.includes(c))SFX.tap();else{miss++;SFX.no();}draw();});
      if(done||miss>=MAX){const win=done;if(win){okc++;score+=10+(MAX-miss)*3;SFX.ok();}stat('games',win);
        $('gfb').innerHTML=`<div class="fb ${win?'ok':'no'}">${win?'أحسنت! 🌟':'انطفأت الفوانيس! الكلمة:'} <b>${esc(w.w)}</b></div><button class="btn main" id="gnx">${r<N-1?'الكلمة التالية ←':'النتيجة 🏁'}</button>`;
        qsa('[data-c]',host).forEach(b=>b.disabled=true);
        $('gnx').onclick=()=>{r++;if(r<N)round();else gEnd(g,lv,okc,N,score,false);};}};
    draw();};
  round();
}
