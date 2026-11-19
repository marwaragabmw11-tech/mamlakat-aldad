/* محرك التدريبات */
'use strict';
/* أنواع: mc اختيار، tf صح/خطأ، in كتابة، or ترتيب كلمات، lt ترتيب حروف، au إملاء مسموع */
function Quiz(host,items,opt){this.host=host;this.items=items;this.opt=opt||{};this.i=0;this.res=[];this.render();}
Quiz.prototype.render=function(){
  const it=this.items[this.i];if(!it)return this.finish();
  const st=this.items.map((_,k)=>`<i class="${k<this.i?(this.res[k]?'ok':'no'):(k===this.i?'cur':'')}"></i>`).join('');
  this.host.innerHTML=`<div class="stepper" aria-label="التقدم">${st}</div><div class="ex fadein" id="exbox">${exHTML(it,this.i)}</div><div id="exfb"></div><div class="row" id="exnav"></div>`;
  bindEx(it,this.host,ok=>this.answered(ok));
};
Quiz.prototype.answered=function(ok){
  const it=this.items[this.i];this.res[this.i]=ok;ok?SFX.ok():SFX.no();
  if(this.opt.sec)stat(this.opt.sec,ok);
  const key=it._k||((this.opt.key||'q')+':'+this.i);
  if(!ok&&!this.opt.noRev)addRev(key,stripMeta(it),this.opt.sec||'');
  if(this.opt.review)revResult(key,ok);
  if(ok&&this.opt.review){S.revDone=(S.revDone||0)+1;save();}
  const fb=$('exfb');fb.innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?pick(['أحسنت! ✨','إجابة صحيحة 👏','رائع! 🌟','ممتاز، استمر! 💫']):'ليست هذه، لا بأس 🌱 '+(it.t==='mc'?'الصحيح: <b>'+esc(it.o[it.a])+'</b>':it.t==='tf'?'الصحيح: <b>'+(it.a?'صحيح':'خطأ')+'</b>':it.t==='in'||it.t==='au'?'الصحيح: <b>'+esc([].concat(it.a)[0])+'</b>':it.t==='or'?'الترتيب الصحيح: <b>'+esc(it.w.join(' '))+'</b>':it.t==='lt'?'الكلمة: <b>'+esc(it.w)+'</b>':'')}${it.h?'<div class="small" style="margin-top:4px">💡 '+esc(it.h)+'</div>':''}</div>`;
  $('exnav').innerHTML=`<button class="btn main" id="exnext">${this.i<this.items.length-1?'التالي ←':'النتيجة 🏁'}</button>`;
  $('exnext').onclick=()=>{this.i++;this.render();};$('exnext').focus();
};
Quiz.prototype.finish=function(){const ok=this.res.filter(Boolean).length,n=this.items.length,p=pct(ok,n);this.opt.onDone&&this.opt.onDone(p,ok,n,this.res);};
function stripMeta(it){const o=Object.assign({},it);delete o._k;return o;}

function exHTML(it,i){
  const q=`<div class="q">${it.q?esc(it.q):''}</div>`;
  switch(it.t){
  case 'mc':return q+`<div class="opts">${(it._ord||(it._ord=shuffle(it.o.map((_,k)=>k)))).map(k=>`<button class="opt" data-k="${k}">${esc(it.o[k])}</button>`).join('')}</div>`;
  case 'tf':return q+`<div class="opts" style="grid-template-columns:1fr 1fr"><button class="opt" data-k="1">✅ صحيح</button><button class="opt" data-k="0">❌ خطأ</button></div>`;
  case 'in':return q+`<div class="row"><input type="text" id="exin" autocomplete="off" placeholder="اكتب إجابتك هنا" style="flex:1;min-width:180px"><button class="btn main" id="exgo">تحقّق</button></div>`;
  case 'or':{const w=shuffleNot(it.w);return (q||'<div class="q">رتّب الكلمات لتكوّن جملة صحيحة</div>')+`<div class="tokens" id="exans" aria-label="إجابتك"></div><div class="tokens" id="expool">${w.map((x,k)=>`<button class="token" data-w="${attr(x)}" data-k="${k}">${esc(x)}</button>`).join('')}</div><div class="row"><button class="btn sm" id="exclr">↺ ابدأ من جديد</button><button class="btn main" id="exgo">تحقّق</button></div>`;}
  case 'lt':{const L=shuffleNot(Array.from(stripTashkeel(it.w)));return (q||'<div class="q">رتّب الحروف لتكوّن كلمة</div>')+`<div class="tokens" id="exans"></div><div class="tokens" id="expool">${L.map((x,k)=>`<button class="token" data-w="${attr(x)}" data-k="${k}">${esc(x)}</button>`).join('')}</div><div class="row"><button class="btn sm" id="exclr">↺ ابدأ من جديد</button><button class="btn main" id="exgo">تحقّق</button></div>`;}
  case 'au':return `<div class="q">${esc(it.q||'استمع جيدًا ثم اكتب ما سمعت')}</div><div class="player"><button class="bigplay" id="explay" aria-label="استمع">▶</button><button class="btn sm" data-r=".7">🐢 أبطأ</button><button class="btn sm" data-r="1">🎵 عادي</button><span class="small" id="exsrc"></span></div><div class="row" style="margin-top:8px"><input type="text" id="exin" autocomplete="off" placeholder="اكتب ما سمعته" style="flex:1;min-width:180px"><button class="btn main" id="exgo">تحقّق</button></div>`;
  }return q;
}
function shuffleNot(a){if(a.length<2)return a.slice();let s;for(let k=0;k<8;k++){s=shuffle(a);if(s.join('|')!==a.join('|'))break;}return s;}
function checkIn(it,v){const acc=[].concat(it.a);const f=it.s||it.t==='au'?normStrict:normLoose;return acc.some(a=>f(a)===f(v));}
function bindEx(it,host,cb){
  let done=false;const fin=ok=>{if(done)return;done=true;qsa('button.opt,.token,#exgo,#exin,#exclr',host).forEach(b=>b.disabled=true);cb(ok);};
  if(it.t==='mc'||it.t==='tf'){qsa('.opt',host).forEach(b=>b.onclick=()=>{const k=+b.dataset.k;const ok=it.t==='mc'?k===it.a:(k===1)===!!it.a;b.classList.add(ok?'ok':'no');if(!ok&&it.t==='mc')qs(`.opt[data-k="${it.a}"]`,host).classList.add('ok');if(!ok&&it.t==='tf')qs(`.opt[data-k="${it.a?1:0}"]`,host).classList.add('ok');fin(ok);});}
  if(it.t==='in'||it.t==='au'){const inp=$('exin');const go=()=>{if(!inp.value.trim()){toast('اكتب إجابتك أولًا');return;}const ok=checkIn(it,inp.value);inp.style.borderColor=ok?'var(--mint2)':'var(--red)';fin(ok);};$('exgo').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};
    if(it.t==='au'){let rate=1;const play=async()=>{const r=await AUDIO.play(it.id||('d:'+slug(it.a)),[].concat(it.a)[0],rate);$('exsrc').textContent=r==='rec'||r==='file'?'🎙️ تسجيل':r==='tts'?'🔈 صوت المتصفح':'';if(r==='none'){$('exsrc').innerHTML='لا يوجد صوت؛ ستظهر الكلمة 3 ثوانٍ: <b id="peek">'+esc([].concat(it.a)[0])+'</b>';setTimeout(()=>{const p=$('peek');if(p)p.textContent='•••';},3000);}};$('explay').onclick=play;qsa('[data-r]',host).forEach(b=>b.onclick=()=>{rate=+b.dataset.r;play();});}
    else setTimeout(()=>inp.focus(),50);}
  if(it.t==='or'||it.t==='lt'){const ans=$('exans'),pool=$('expool');const pick=[];
    const draw=()=>{ans.innerHTML=pick.map((b,k)=>`<button class="token" data-i="${k}">${esc(b.dataset.w)}</button>`).join('');qsa('.token',ans).forEach(t=>t.onclick=()=>{const b=pick.splice(+t.dataset.i,1)[0];b.classList.remove('used');draw();});};
    qsa('.token',pool).forEach(b=>b.onclick=()=>{SFX.tap();b.classList.add('used');pick.push(b);draw();});
    $('exclr').onclick=()=>{pick.splice(0).forEach(b=>b.classList.remove('used'));draw();};
    $('exgo').onclick=()=>{const got=pick.map(b=>b.dataset.w);if(got.length<(it.t==='or'?it.w.length:stripTashkeel(it.w).length)){toast('استعمل كل القطع أولًا');return;}const ok=it.t==='or'?got.join(' ')===it.w.join(' ')||(it.alt||[]).some(a=>a.join(' ')===got.join(' ')):got.join('')===stripTashkeel(it.w);fin(ok);};}
}
/* شاشة النتيجة */
function resultHTML(p,ok,n,extra){const m=p>=90?'cheer':p>=70?'excited':'think';
  return `<div class="result card fadein">${guide(p>=90?'إتقان رائع! أنت تستحق تاج المملكة 👑':p>=PASS?'أحسنت! اجتزت التدريب بنجاح 🌟':'لا بأس، المحاولة طريق الإتقان. راجع الشرح وجرّب مرة أخرى، وسأكون معك 💚',m)}<div class="score">${ok} من ${n}</div><div class="progress" style="max-width:300px;margin:8px auto"><i style="width:${p}%"></i></div><p>${p}%</p>${extra||''}</div>`;}
