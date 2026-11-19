/* فهرس ملفات المحتوى في مملكة الضاد
   ─ أضف اسم أي ملف محتوى جديد هنا ليُحمَّل تلقائيًا.
   ─ كل مستوى في مجلد: levels/رقم/_level.js ثم unit-1.js ... وتُذكر الوحدات بعددها في LEVEL_UNITS.
   ─ الترتيب مهم: ملف المستوى قبل ملفات وحداته. */
window.LEVEL_UNITS={1:8};
window.CONTENT_FILES=[
  ...Object.entries(LEVEL_UNITS).flatMap(([n,u])=>['levels/'+n+'/_level.js',...Array.from({length:u},(_,i)=>'levels/'+n+'/unit-'+(i+1)+'.js')]),
  'audio/manifest.js'
];
