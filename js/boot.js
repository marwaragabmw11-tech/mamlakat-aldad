/* الإقلاع: تحميل ملفات المحتوى من الفهرس ثم تشغيل التطبيق */
'use strict';
(function(){
  const files=(window.CONTENT_FILES||[]).slice();let failed=[];
  function next(){
    if(!files.length)return start();
    const f=files.shift(),s=document.createElement('script');s.src='content/'+f;
    s.onload=next;s.onerror=()=>{failed.push(f);next();};document.body.appendChild(s);
  }
  function start(){
    if(failed.length)D._warn.push('تعذّر تحميل: '+failed.join('، '));
    try{mergeCustom();}catch(e){console.error(e);}
    if(D._warn.length)console.warn('تنبيهات المحتوى:',D._warn);
    applySettings();window.addEventListener('hashchange',route);route();
  }
  next();
})();
/* دمج محتوى ولي الأمر المحفوظ محليًا */
function mergeCustom(){const C=S.custom||{};
  (C.words||[]).forEach(w=>{if(!D.dict.find(x=>x.id===w.id))D.dict.push(w);});
  if((C.words||[]).length&&!D.dictGroups.custom)D.dictGroups.custom={n:'كلمات أضافها ولي الأمر',e:'⭐'};
  (C.lessons||[]).forEach(u=>{const L=D.levels.find(x=>x.n===u.n);if(L&&!L.units.find(x=>x.id===u.id))L.units.push(u);});
  (C.proverbs||[]).forEach(p=>D.proverbs.push(p));(C.riddles||[]).forEach(r=>D.riddles.push(r));
}
