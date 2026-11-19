/* الحالة والتخزين المحلي */
'use strict';
const KEY='dad:v1';
const DEF={v:1,name:'',avatar:'🐉',xp:0,set:{sound:true,fs:1,reading:false,dark:false,tts:true,rate:.85},
  pin:null,lessons:{},forceLevel:0,openAll:false,seen:{},learned:{},stats:{},errs:{},dictLog:[],readLog:[],stageLog:[],
  games:{},rev:{},badges:{},days:{},notebook:[],chal:{},rules:{},gbs:{},rhs:{},texts:{},custom:{words:[],lessons:[],questions:[],texts:[],riddles:[],dictation:[],proverbs:[]}};
let S;
function load(){try{S=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){S={};}
  S=Object.assign(JSON.parse(JSON.stringify(DEF)),S);S.set=Object.assign({},DEF.set,S.set);S.custom=Object.assign({},DEF.custom,S.custom);}
let saveFail=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));saveFail=false;}catch(e){if(!saveFail){saveFail=true;toast('⚠️ لم يُحفظ التقدم: مساحة التخزين ممتلئة أو محظورة');}}}
load();

/* النقاط */
function addXP(n,why){S.xp+=n;save();SFX.xp();toast('+'+n+' نقطة'+(why?' · '+why:''));checkBadges();renderTop&&renderTop();}
function stat(sec,ok){const s=S.stats[sec]||(S.stats[sec]={ok:0,n:0});s.n++;if(ok)s.ok++;save();}
function markDay(){const t=today();if(!S.days[t]){S.days[t]=1;save();return true;}return false;}
function streak(){let n=0;const d=new Date();for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(S.days[k]){n++;d.setDate(d.getDate()-1);}else break;}return n;}

/* المستويات والإتقان */
const PASS=70, LEVEL_UNLOCK=80;
function lessonDone(id){const l=S.lessons[id];return !!(l&&l.best>=PASS);}
function levelLessons(L){return L.units.flatMap(u=>u.lessons);}
function levelProgress(L){const ls=levelLessons(L);return ls.length?pct(ls.filter(l=>lessonDone(l.id)).length,ls.length):0;}
function levelOpen(n){if(S.openAll||n<=1||n<=S.forceLevel)return true;const prev=D.levels.find(l=>l.n===n-1);return prev?levelProgress(prev)>=LEVEL_UNLOCK:false;}
function currentLevel(){let c=1;D.levels.forEach(L=>{if(levelOpen(L.n))c=Math.max(c,L.n);});return D.levels.find(L=>L.n===c)||D.levels[0];}

/* المراجعة الذكية (صناديق لايتنر) */
const BOXDAYS=[1,2,4,8,16];
function addRev(key,item,src){const r=S.rev[key];if(r){r.box=0;r.due=addDays(1);}else S.rev[key]={item,src,box:0,due:addDays(1),add:today()};save();}
function revResult(key,ok){const r=S.rev[key];if(!r)return;if(ok){r.box++;if(r.box>=BOXDAYS.length){delete S.rev[key];}else r.due=addDays(BOXDAYS[r.box]);}else{r.box=0;r.due=addDays(1);}save();}
function dueRev(){const t=today();return Object.entries(S.rev).filter(([k,r])=>r.due<=t);}

/* الشارات */
const BADGES=[
 {id:'first',e:'🌱',n:'الخطوة الأولى',d:'أكمل أول درس',t:()=>Object.keys(S.lessons).some(lessonDone)},
 {id:'l5',e:'📘',n:'قارئ مثابر',d:'أكمل 5 دروس',t:()=>Object.keys(S.lessons).filter(lessonDone).length>=5},
 {id:'l25',e:'📚',n:'طالب العلم',d:'أكمل 25 درسًا',t:()=>Object.keys(S.lessons).filter(lessonDone).length>=25},
 {id:'l100',e:'🏛️',n:'ساكن المكتبة',d:'أكمل 100 درس',t:()=>Object.keys(S.lessons).filter(lessonDone).length>=100},
 {id:'lv2',e:'🗝️',n:'فاتح البوابة',d:'افتح المستوى الثاني',t:()=>levelOpen(2)&&!S.openAll},
 {id:'lv5',e:'🏰',n:'نصف المملكة',d:'افتح المستوى الخامس',t:()=>levelOpen(5)&&!S.openAll},
 {id:'lv8',e:'👑',n:'أديب المملكة',d:'افتح المستوى الثامن',t:()=>levelOpen(8)&&!S.openAll},
 {id:'w20',e:'🔤',n:'جامع الكلمات',d:'تعلّم 20 كلمة من المعجم',t:()=>Object.keys(S.learned).length>=20},
 {id:'w100',e:'📖',n:'معجم صغير',d:'تعلّم 100 كلمة',t:()=>Object.keys(S.learned).length>=100},
 {id:'d10',e:'🎧',n:'أذن ذهبية',d:'أنجز 10 تدريبات إملاء',t:()=>S.dictLog.length>=10},
 {id:'d50',e:'✍️',n:'فارس الإملاء',d:'أنجز 50 تدريب إملاء',t:()=>S.dictLog.length>=50},
 {id:'g10',e:'🎮',n:'لاعب ذكي',d:'العب 10 جولات',t:()=>Object.values(S.games).reduce((a,g)=>a+(g.plays||0),0)>=10},
 {id:'r5',e:'📜',n:'محب الأدب',d:'اقرأ 5 نصوص من المكتبة',t:()=>Object.keys(S.texts).length>=5},
 {id:'s3',e:'🎤',n:'خطيب واعد',d:'سجّل 3 إلقاءات',t:()=>S.stageLog.length>=3},
 {id:'n3',e:'🖋️',n:'قلم مبدع',d:'اكتب 3 نصوص في دفترك',t:()=>S.notebook.length>=3},
 {id:'st3',e:'🔥',n:'ثلاثة أيام',d:'تعلّم 3 أيام متتالية',t:()=>streak()>=3},
 {id:'st7',e:'🌟',n:'أسبوع كامل',d:'تعلّم 7 أيام متتالية',t:()=>streak()>=7},
 {id:'rv10',e:'🔁',n:'المراجع الذكي',d:'أتقن 10 أسئلة في المراجعة',t:()=>(S.revDone||0)>=10},
 {id:'xp1k',e:'💎',n:'ألف نقطة',d:'اجمع 1000 نقطة',t:()=>S.xp>=1000},
 {id:'xp5k',e:'🏆',n:'كنز المملكة',d:'اجمع 5000 نقطة',t:()=>S.xp>=5000}
];
function checkBadges(){BADGES.forEach(b=>{if(!S.badges[b.id]){let ok=false;try{ok=b.t();}catch(e){}if(ok){S.badges[b.id]=today();save();setTimeout(()=>{toast('🏅 شارة جديدة: '+b.n);SFX.win();confetti();},900);}}});}

/* تسجيلات الصوت (IndexedDB) */
const ADB={db:null,
  open(){return new Promise((res,rej)=>{if(this.db)return res(this.db);if(!window.indexedDB)return rej('no idb');const r=indexedDB.open('dad-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');r.onsuccess=()=>{this.db=r.result;res(this.db);};r.onerror=()=>rej(r.error);});},
  async tx(mode,fn){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction('a',mode),s=t.objectStore('a');const q=fn(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error);});},
  put(id,blob){return this.tx('readwrite',s=>s.put(blob,id));},
  get(id){return this.tx('readonly',s=>s.get(id)).catch(()=>null);},
  del(id){return this.tx('readwrite',s=>s.delete(id));},
  keys(){return this.tx('readonly',s=>s.getAllKeys()).catch(()=>[]);}
};
