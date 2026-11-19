/* ضادون: التنين الصغير المحب للعربية (رسم أصلي) */
'use strict';
function dadoon(mood){mood=mood||'happy';
  const eyes={happy:'<path d="M78 70q6-7 12 0M108 70q6-7 12 0" stroke="#24323b" stroke-width="4" fill="none" stroke-linecap="round"/>',
    excited:'<circle cx="84" cy="69" r="7" fill="#24323b"/><circle cx="114" cy="69" r="7" fill="#24323b"/><circle cx="86" cy="66" r="2.5" fill="#fff"/><circle cx="116" cy="66" r="2.5" fill="#fff"/>',
    think:'<circle cx="86" cy="68" r="5" fill="#24323b"/><circle cx="116" cy="66" r="5" fill="#24323b"/><path d="M76 58l14 3M106 56l14 1" stroke="#24323b" stroke-width="3" stroke-linecap="round"/>',
    wow:'<circle cx="84" cy="69" r="8" fill="#fff" stroke="#24323b" stroke-width="3"/><circle cx="114" cy="69" r="8" fill="#fff" stroke="#24323b" stroke-width="3"/><circle cx="84" cy="70" r="4" fill="#24323b"/><circle cx="114" cy="70" r="4" fill="#24323b"/>',
    cheer:'<path d="M77 72q7-9 14 0M107 72q7-9 14 0" stroke="#24323b" stroke-width="4" fill="none" stroke-linecap="round"/>'}[mood]||'';
  const mouth={happy:'<path d="M88 88q11 9 22 0" stroke="#24323b" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    excited:'<path d="M86 86q13 16 26 0z" fill="#b8473a"/>',think:'<path d="M92 90h14" stroke="#24323b" stroke-width="3.5" stroke-linecap="round"/>',
    wow:'<ellipse cx="99" cy="91" rx="6" ry="7" fill="#b8473a"/>',cheer:'<path d="M84 85q15 18 30 0z" fill="#b8473a"/>'}[mood]||'';
  const extra={think:'<text x="140" y="40" font-size="26">💭</text>',wow:'<text x="146" y="44" font-size="24">❗</text>',cheer:'<text x="140" y="38" font-size="24">✨</text><text x="20" y="52" font-size="20">✨</text>',excited:'<text x="146" y="40" font-size="22">⭐</text>'}[mood]||'';
  const arm=mood==='cheer'||mood==='excited'?'<path d="M62 118q-20-18-14-38" stroke="#3f9e8a" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M136 118q20-18 14-38" stroke="#3f9e8a" stroke-width="11" fill="none" stroke-linecap="round"/>':'<path d="M64 122q-14 8-10 22" stroke="#3f9e8a" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M134 122q14 8 10 22" stroke="#3f9e8a" stroke-width="11" fill="none" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 200 200" role="img" aria-label="ضادون"><ellipse cx="100" cy="188" rx="52" ry="7" fill="#000" opacity=".08"/>
<path d="M140 150q38 6 40-24q-14 16-30 10z" fill="#3f9e8a"/><path d="M172 128l10-8-2 14z" fill="#d9a441"/>
<path d="M58 104q-34-30-30-58q16 14 34 22z" fill="#9bd3c4" stroke="#3f9e8a" stroke-width="3"/><path d="M142 104q34-30 30-58q-16 14-34 22z" fill="#9bd3c4" stroke="#3f9e8a" stroke-width="3"/>
<ellipse cx="99" cy="136" rx="44" ry="46" fill="#4fb39c"/><ellipse cx="99" cy="144" rx="28" ry="32" fill="#f3d48b"/>
<path d="M85 132h28M83 146h32M86 160h26" stroke="#d9a441" stroke-width="2.5" opacity=".7"/>${arm}
<ellipse cx="80" cy="182" rx="13" ry="7" fill="#3f9e8a"/><ellipse cx="118" cy="182" rx="13" ry="7" fill="#3f9e8a"/>
<circle cx="99" cy="74" r="44" fill="#4fb39c"/><path d="M70 36l-6-20 18 14zM128 36l6-20-18 14z" fill="#d9a441"/><path d="M92 31l7-14 7 14z" fill="#e98a7a"/>
<ellipse cx="72" cy="84" rx="8" ry="5" fill="#e98a7a" opacity=".55"/><ellipse cx="126" cy="84" rx="8" ry="5" fill="#e98a7a" opacity=".55"/>
${eyes}${mouth}<text x="99" y="155" text-anchor="middle" font-size="22" font-family="Amiri,serif" fill="#8a5d12" font-weight="700">ض</text>${extra}</svg>`;}
function guide(html,mood,cls){return `<div class="guide ${cls||''}"><div class="mascot bob">${dadoon(mood)}</div><div class="bubble"><b class="nm">ضادون</b>${html}</div></div>`;}

/* معلومات لغوية ممتعة (موثّقة ومبسطة) */
const FACTS=[
 'تُسمّى العربية «لغة الضاد» لأن حرف الضاد صوتٌ نادر يُعدّ من أخصّ أصواتها.',
 'الحروف العربية ثمانية وعشرون حرفًا، وتُكتب من اليمين إلى اليسار.',
 'كلمة «كتب» جذرها (ك ت ب)، ومنه: كاتب، ومكتوب، ومكتبة، وكتاب. هكذا تولد كلمات كثيرة من جذر واحد!',
 'الخليل بن أحمد الفراهيدي هو الذي جعل الحركات على صورتها الحالية: الفتحة ألفًا صغيرة، والضمة واوًا صغيرة، والكسرة ياءً صغيرة.',
 'أول معجم عربي هو «كتاب العين» للخليل بن أحمد، ورتّبه بحسب مخارج الحروف وبدأه بحرف العين.',
 'اليوم العالمي للغة العربية في 18 ديسمبر من كل عام.',
 'العربية إحدى اللغات الرسمية الست في الأمم المتحدة.',
 'في العربية حروف تُكتب ولا تُنطق، مثل الألف في «كتبوا»، وحروف تُنطق ولا تُكتب، مثل الألف في «هذا» و«لكن».',
 'اللام الشمسية تُكتب ولا تُنطق مثل «الشمس»، واللام القمرية تُكتب وتُنطق مثل «القمر».',
 'النقاط على الحروف لم تكن موجودة في أقدم الكتابات العربية، ثم أُضيفت لتمييز الحروف المتشابهة مثل الباء والتاء والثاء.',
 'كلمة «سكر» دخلت لغات كثيرة من العربية، ومنها sugar بالإنجليزية.',
 'كلمة «الجبر» في الرياضيات عربية، وجاءت من كتاب الخوارزمي في الجبر والمقابلة.',
 'يسمى صغير الأسد «شبلًا»، وصغير الحصان «مُهرًا»، وصغير الناقة «حُوارًا».',
 'المطر الخفيف يسمى «الطَّلّ» و«الرَّذاذ»، والمطر الغزير يسمى «الوابل».',
 'التاء المربوطة تُنطق هاءً عند الوقف: «شجرة» تُقرأ «شجرَه» إذا وقفنا عليها.',
 'همزة الوصل تُنطق في أول الكلام وتسقط في وسطه، مثل «اكتبْ» في «يا علي اكتبْ».',
 'علامة الاستفهام في العربية تُكتب هكذا «؟» والفاصلة هكذا «،» مقلوبة عن الإنجليزية.',
 'كلمة «قلم» تُجمع على «أقلام»، وكلمة «كتاب» على «كُتُب»، وهذا يسمى جمع التكسير لأن صورة المفرد تتغير.',
 'الجملة التي تبدأ باسم تسمى «جملة اسمية»، والتي تبدأ بفعل تسمى «جملة فعلية».',
 'التشبيه له أربعة أركان: المشبه، والمشبه به، وأداة التشبيه، ووجه الشبه.'
];
