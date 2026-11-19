/* =====================================================================
   واجهة إضافة المحتوى في مملكة الضاد
   كل ملف في مجلد content يستدعي دوال K لإضافة محتواه، ثم يُذكر اسمه في manifest.js.
   لا حاجة لتعديل برمجة الموقع عند إضافة المحتوى.
   ===================================================================== */
'use strict';
window.D={levels:[],dict:[],dictGroups:{},dictation:[],quranDict:[],spelling:[],grammar:[],rhetoric:[],
  poems:[],prose:[],reading:[],speech:[],proverbs:[],riddles:[],heritage:{stories:[],anecdotes:[],names:[],games:[]},audioFiles:{},_warn:[]};
window.K={
  _ids:new Set(),
  _id(kind,id){const k=kind+':'+id;if(this._ids.has(k))D._warn.push('معرّف مكرر: '+k);this._ids.add(k);},
  _ex(where,ex){(ex||[]).forEach((e,i)=>{const ok={mc:e.o&&e.a!=null&&e.a<e.o.length,tf:typeof e.a==='boolean',in:e.a!=null,or:Array.isArray(e.w),lt:typeof e.w==='string',au:e.a!=null}[e.t];if(!ok)D._warn.push('تدريب غير صالح في '+where+' رقم '+(i+1));});},
  /* مستوى: {n,name,icon,color,desc} */
  level(L){L.units=L.units||[];this._id('level',L.n);D.levels.push(L);D.levels.sort((a,b)=>a.n-b.n);},
  /* وحدة داخل مستوى: K.unit(رقم المستوى, {name, icon, lessons:[{t, body, ex:[...]}]}) — المعرّفات تُولَّد تلقائيًا */
  unit(n,u){const L=D.levels.find(x=>x.n===n);if(!L){D._warn.push('مستوى غير موجود: '+n);return;}L.units.push(u);const ui=L.units.length;
    u.id=n+'.'+ui;u.lessons.forEach((l,li)=>{l.id=l.id||(n+'.'+ui+'.'+(li+1));this._id('lesson',l.id);this._ex('درس '+l.t,l.ex);});},
  /* مجموعة معجمية: K.dictGroup('daily',{n:'مفردات الحياة',e:'🏡'}) ثم K.words('daily',[...]) */
  dictGroup(id,g){D.dictGroups[id]=g;},
  words(g,list){list.forEach((w,i)=>{w.g=g;w.id=w.id||(g+'-'+(D.dict.filter(x=>x.g===g).length+1));this._id('word',w.id);D.dict.push(w);});},
  /* صيغة مختصرة للمعجم: كل سطر كلمة، والأعمدة مفصولة بـ | بهذا الترتيب:
     الكلمة | رمز الصورة | المعنى | جملة | مرادفات | أضداد | الجمع | الجذر | من أسرتها | من الحياة | إضافي1 | إضافي2
     القوائم داخل العمود مفصولة بـ «،». الإضافي1 في مجموعة الفصيح = اللفظ العامي، وفي الكلمات القرآنية = الآية، والإضافي2 = موضعها. */
  wordsT(g,text){const L=s=>s?s.split('،').map(x=>x.trim()).filter(Boolean):[];
    this.words(g,text.trim().split(/\n+/).map(l=>l.trim()).filter(l=>l&&!l.startsWith('#')).map(l=>{const c=l.split('|').map(x=>x.trim());
      const w={w:c[0],e:c[1]||'',m:c[2]||'',s:c[3]||'',syn:L(c[4]),ant:L(c[5]),pl:c[6]||'',root:c[7]||'',der:L(c[8]),life:c[9]||''};
      if(g==='fusha')w.amm=c[10]||'';if(g==='quran'){w.q=c[10]||'';w.qr=c[11]||'';}return w;}));},
  /* إملاء عام: {id,lvl,k:'word|short|long|para',t:'النص',title} */
  dictation(list){list.forEach(x=>{this._id('dict',x.id);D.dictation.push(x);});},
  /* إملاء قرآني: {id,s:رقم السورة,sn:'اسمها',a:رقم الآية,t:'النص بالإملاء الحديث',rasm:'ملاحظة رسم المصحف',tip} */
  quran(list){list.forEach(x=>{this._id('quran',x.id);D.quranDict.push(x);});},
  rule(r){this._id('rule',r.id);this._ex('قاعدة '+r.t,r.ex);D.spelling.push(r);},
  building(r){this._id('gb',r.id);this._ex('مبنى '+r.t,r.ex);D.grammar.push(r);},
  rhetoric(r){this._id('rh',r.id);this._ex('بلاغة '+r.t,r.ex);D.rhetoric.push(r);},
  poem(p){this._id('text',p.id);this._ex('قصيدة '+p.t,p.q);D.poems.push(p);},
  prose(p){this._id('text',p.id);this._ex('نص '+p.t,p.q);D.prose.push(p);},
  reading(p){this._id('text',p.id);this._ex('قراءة '+p.t,p.q);D.reading.push(p);},
  speech(list){list.forEach(x=>{this._id('speech',x.id);D.speech.push(x);});},
  proverbs(list){D.proverbs.push(...list);},
  riddles(list){D.riddles.push(...list);},
  heritage(kind,list){D.heritage[kind].push(...list);},
  /* ملفات صوتية مرفوعة مع الموقع: K.audio({'d:g1':'content/audio/g1.mp3'}) */
  audio(map){Object.assign(D.audioFiles,map);}
};
