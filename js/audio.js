/* مشغل الصوت: تسجيل ولي الأمر ← ملف في المكتبة ← صوت المتصفح */
'use strict';
const AUDIO={el:null,url:null,voices:[],
  init(){if('speechSynthesis' in window){const f=()=>{this.voices=speechSynthesis.getVoices().filter(v=>/^ar/i.test(v.lang));};f();speechSynthesis.onvoiceschanged=f;}},
  hasTTS(){return 'speechSynthesis' in window&&this.voices.length>0;},
  stop(){try{if(this.el){this.el.pause();}if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}},
  /* يعيد مصدر الصوت المستعمل: rec | file | tts | none */
  async play(id,text,rate){rate=rate||1;this.stop();
    const blob=id?await ADB.get(id):null;
    if(blob){return this._el(URL.createObjectURL(blob),rate,'rec');}
    const f=id&&D.audioFiles&&D.audioFiles[id];
    if(f){const r=await this._el(f,rate,'file').catch(()=>null);if(r)return r;}
    if(S.set.tts&&this.hasTTS()&&text){const u=new SpeechSynthesisUtterance(stripTashkeel(text)===text?text:text);u.lang=this.voices[0].lang;u.voice=this.voices[0];u.rate=Math.max(.5,Math.min(1.5,(S.set.rate||.85)*rate));speechSynthesis.speak(u);return 'tts';}
    return 'none';
  },
  _el(src,rate,kind){return new Promise((res,rej)=>{if(this.url&&this.url.startsWith('blob:'))URL.revokeObjectURL(this.url);this.url=src;const a=this.el||(this.el=new Audio());a.src=src;a.playbackRate=rate;a.onerror=()=>rej('err');a.play().then(()=>res(kind)).catch(rej);});},
  say(text){ // نطق سريع للكلمات (المعجم والألعاب)
    if(S.set.tts&&this.hasTTS()){this.stop();const u=new SpeechSynthesisUtterance(text);u.lang=this.voices[0].lang;u.voice=this.voices[0];u.rate=S.set.rate||.85;speechSynthesis.speak(u);return true;}
    return false;
  }
};
AUDIO.init();
/* زر نطق صغير لأي نص */
function sayBtn(text,id){return `<button class="iconbtn" title="استمع" aria-label="استمع" onclick='sayIt(${JSON.stringify(id||'')},${JSON.stringify(text)})'>🔊</button>`;}
async function sayIt(id,text){const r=await AUDIO.play(id||null,text,1);if(r==='none')toast('لا يوجد تسجيل لهذه الكلمة، وصوت المتصفح العربي غير متوفر على هذا الجهاز. يمكن لولي الأمر إضافة تسجيل.',4000);}
