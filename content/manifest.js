/* فهرس ملفات المحتوى في مملكة الضاد
   ─ أضف اسم أي ملف محتوى جديد هنا ليُحمَّل تلقائيًا.
   ─ كل مستوى في مجلد: levels/رقم/_level.js ثم unit-1.js ... وتُذكر الوحدات بعددها في LEVEL_UNITS.
   ─ الترتيب مهم: ملف المستوى قبل ملفات وحداته. */
window.LEVEL_UNITS={1:8,2:8,3:8,4:8,5:8,6:8};
window.CONTENT_FILES=[
  ...Object.entries(LEVEL_UNITS).flatMap(([n,u])=>['levels/'+n+'/_level.js',...Array.from({length:u},(_,i)=>'levels/'+n+'/unit-'+(i+1)+'.js')]),
  'dictionary/_groups.js','dictionary/daily.js','dictionary/fusha.js','dictionary/quran.js','dictionary/rare.js',
  'dictation/quran.js','dictation/general.js',
  'writing/rules.js',
  'grammar/buildings.js','rhetoric/garden.js',
  'library/poetry.js','library/prose.js','library/reading-1.js','library/reading-2.js',
  'stage/speech.js',
  'heritage/proverbs.js','heritage/riddles.js','heritage/treasures.js',
  'games/banks.js',
  'audio/manifest.js'
];
