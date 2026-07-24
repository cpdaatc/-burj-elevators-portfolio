(()=>{
const routes=['home','about','services','projects','contact'];
const labels={ar:{home:'الرئيسية',about:'من نحن',services:'خدماتنا',projects:'أعمالنا',contact:'تواصل معنا'},en:{home:'Home',about:'About',services:'Services',projects:'Projects',contact:'Contact'}};
let lang=localStorage.getItem('burjLang')||'ar',current='home';
const nav=document.getElementById('nav'),menu=document.getElementById('menu'),langBtn=document.getElementById('lang');
const services=[
['⚒','توريد وتركيب المصاعد','Elevator supply & installation','توريد وتركيب حلول تناسب المباني السكنية والتجارية.','Supply and installation for residential and commercial buildings.'],
['↻','الصيانة الدورية','Periodic maintenance','متابعة دورية للمكونات للمحافظة على كفاءة التشغيل.','Periodic component follow-up to maintain operating efficiency.'],
['↥','تحديث وتطوير المصاعد','Elevator modernization','تحديث الأنظمة والمكونات لتحسين الأداء والاستخدام.','Upgrading systems and components to improve performance.'],
['▣','تصميم الكبائن','Cabin design','خيارات تشطيبات وديكورات تناسب المساحة والذوق.','Finishing and décor options suited to space and preference.'],
['⚙','لوحات التحكم والأنظمة','Control panels & systems','تنفيذ ومتابعة الأنظمة الكهربائية ولوحات التحكم.','Implementation and support for electrical and control systems.'],
['☏','الدعم الفني والإصلاح','Technical support & repair','معالجة الأعطال وتقديم الدعم الفني حسب حالة المصعد.','Fault handling and technical support based on elevator condition.']
];
const works=[
['wood','cabin','كابينة داخلية بتشطيب فاخر','Premium-finished elevator cabin'],
['door_gold','entrance','باب مصعد ذهبي مزخرف','Decorative gold elevator door'],
['door_white','entrance','مدخل مصعد بتشطيب أبيض ومعدني','White and metallic elevator entrance'],
['control_new','technical','لوحة تحكم كهربائية للمصعد','Elevator electrical control cabinet'],
['panel_new','technical','لوحة أزرار وتشغيل داخلية','Internal control and button panel'],
['machine','technical','ماكينة ومكونات التشغيل','Elevator machinery and operating components'],
['control','technical','أنظمة ولوحات تحكم','Control systems and panels']
];
function asset(k){const aliases={hero:'wood',cabin:'wood'};k=aliases[k]||k;const v=window.BURJ_ASSETS?.[k]||'';return v?'data:image/webp;base64,'+v:''}
function loadImages(){document.querySelectorAll('[data-img]').forEach(i=>{const s=asset(i.dataset.img);if(s)i.src=s})}
function serviceCards(id){const el=document.getElementById(id);if(el)el.innerHTML=services.map(s=>`<article class="card"><div class="icon">${s[0]}</div><h3>${lang==='ar'?s[1]:s[2]}</h3><p>${lang==='ar'?s[3]:s[4]}</p></article>`).join('')}
function gallery(){
 const g=document.getElementById('gallery'); if(!g)return;
 g.innerHTML=works.filter(w=>asset(w[0])).map((w,i)=>`<figure class="work ${i===0?'wide':''}" data-cat="${w[1]}" data-key="${w[0]}"><img src="${asset(w[0])}" alt="${lang==='ar'?w[2]:w[3]}" loading="lazy" decoding="async"><figcaption><b>${lang==='ar'?w[2]:w[3]}</b><span>${lang==='ar'?'من أعمال مؤسسة برج للمصاعد':'Burj Elevators Establishment project'}</span></figcaption></figure>`).join('');
 document.querySelectorAll('.work').forEach(el=>el.onclick=()=>{const s=asset(el.dataset.key);if(!s)return;document.getElementById('lightImg').src=s;document.getElementById('lightbox').classList.add('open');document.body.classList.add('lock')});
}
function injectExtras(){
 if(!document.getElementById('burjExtraStyle')){
  const st=document.createElement('style');st.id='burjExtraStyle';st.textContent=`
  .team-wrap,.map-wrap{margin-top:54px}.team-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.team-card{margin:0;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 12px 35px rgba(8,38,91,.12)}.team-card img{width:100%;height:360px;object-fit:cover;display:block}.team-card figcaption{padding:16px 18px;font-weight:700;color:#113b8f}.map-card{background:#fff;border-radius:24px;padding:22px;box-shadow:0 12px 35px rgba(8,38,91,.12)}.map-frame{height:360px;border-radius:18px;overflow:hidden;background:#eef2f7}.map-frame iframe{width:100%;height:100%;border:0}.map-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}.map-actions a{display:inline-flex;align-items:center;justify-content:center;padding:13px 20px;border-radius:12px;text-decoration:none;font-weight:800}.map-primary{background:#d99a1b;color:white}.map-secondary{background:#113b8f;color:white}.scope-chip{display:inline-block;margin:8px 0 18px;padding:8px 14px;border-radius:999px;background:#eef3fb;color:#113b8f;font-weight:700}@media(max-width:700px){.team-grid{grid-template-columns:1fr}.team-card img{height:270px}.map-frame{height:300px}}`;
  document.head.appendChild(st);
 }
 const about=document.querySelector('[data-page="about"] .section');
 if(about&&!document.getElementById('teamSection')){
  const s=document.createElement('div');s.id='teamSection';s.className='container team-wrap';
  s.innerHTML=`<div class="title"><small data-ar="فريقنا" data-en="Our team">${lang==='ar'?'فريقنا':'Our team'}</small><h2 data-ar="فريق فني بخبرة عملية" data-en="A technical team with practical experience">${lang==='ar'?'فريق فني بخبرة عملية':'A technical team with practical experience'}</h2><div class="line"></div></div><div class="team-grid"><figure class="team-card"><img src="${asset('wood')}" alt="فريق مؤسسة برج للمصاعد"><figcaption data-ar="فريق المؤسسة داخل المكتب" data-en="The establishment team at the office">${lang==='ar'?'فريق المؤسسة داخل المكتب':'The establishment team at the office'}</figcaption></figure><figure class="team-card"><img src="${asset('door_gold')}" alt="فريق مؤسسة برج للمصاعد أمام المقر"><figcaption data-ar="فريق المؤسسة أمام المقر" data-en="The establishment team at the premises">${lang==='ar'?'فريق المؤسسة أمام المقر':'The establishment team at the premises'}</figcaption></figure></div>`;
  about.appendChild(s);
 }
 const contact=document.querySelector('[data-page="contact"] .section');
 if(contact&&!document.getElementById('mapSection')){
  const s=document.createElement('div');s.id='mapSection';s.className='container map-wrap';
  s.innerHTML=`<div class="map-card"><div class="title"><small data-ar="تجدنا" data-en="Find us">${lang==='ar'?'تجدنا':'Find us'}</small><h2 data-ar="موقع مؤسسة برج للمصاعد" data-en="Burj Elevators Establishment location">${lang==='ar'?'موقع مؤسسة برج للمصاعد':'Burj Elevators Establishment location'}</h2><div class="line"></div></div><span class="scope-chip" data-ar="نطاق الخدمة: رابغ وجدة" data-en="Service area: Rabigh and Jeddah">${lang==='ar'?'نطاق الخدمة: رابغ وجدة':'Service area: Rabigh and Jeddah'}</span><div class="map-frame"><iframe loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Rabigh%20Saudi%20Arabia&z=12&output=embed" title="موقع مؤسسة برج للمصاعد"></iframe></div><div class="map-actions"><a class="map-primary" target="_blank" rel="noopener" href="https://maps.app.goo.gl/FBwzYQoLsQJbjM82A?g_st=ic" data-ar="فتح الموقع في خرائط Google" data-en="Open in Google Maps">${lang==='ar'?'فتح الموقع في خرائط Google':'Open in Google Maps'}</a><a class="map-secondary" href="tel:0564749486" dir="ltr">0564749486</a></div></div>`;
  contact.appendChild(s);
 }
}
function apply(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-ar]').forEach(e=>e.innerHTML=e.dataset[lang]);
 langBtn.textContent=lang==='ar'?'EN':'ع';serviceCards('homeServices');serviceCards('allServices');gallery();injectExtras();switchers();loadImages();
 document.title=lang==='ar'?'مؤسسة برج للمصاعد | معرض الأعمال':'Burj Elevators Establishment | Portfolio';
}
function route(){const r=location.hash.slice(1);return routes.includes(r)?r:'home'}
function show(r){current=r;document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===r));document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===r));nav.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});switchers()}
function switchers(){const i=routes.indexOf(current),p=routes[(i-1+routes.length)%routes.length],n=routes[(i+1)%routes.length];document.querySelectorAll('[data-switch]').forEach(x=>x.innerHTML=`<a href="#${p}" data-route="${p}"><span>←</span><span>${labels[lang][p]}</span></a><a href="#${n}" data-route="${n}"><span>${labels[lang][n]}</span><span>→</span></a>`)}
document.addEventListener('click',e=>{const a=e.target.closest('[data-route]');if(a){e.preventDefault();location.hash=a.dataset.route}});
window.addEventListener('hashchange',()=>show(route()));
menu.onclick=()=>nav.classList.toggle('open');
langBtn.onclick=()=>{lang=lang==='ar'?'en':'ar';localStorage.setItem('burjLang',lang);apply()};
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.work').forEach(w=>w.classList.toggle('hide',b.dataset.filter!=='all'&&w.dataset.cat!==b.dataset.filter))});
document.getElementById('close').onclick=()=>{document.getElementById('lightbox').classList.remove('open');document.body.classList.remove('lock')};
document.getElementById('lightbox').onclick=e=>{if(e.target.id==='lightbox')document.getElementById('close').click()};
document.getElementById('form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),t=lang==='ar'?`السلام عليكم، أرغب في طلب خدمة من مؤسسة برج للمصاعد.\nالاسم: ${f.get('name')}\nرقم الجوال: ${f.get('phone')}\nالخدمة: ${f.get('service')}\nالتفاصيل: ${f.get('message')||'-'}`:`Hello, I would like to request a service from Burj Elevators Establishment.\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nService: ${f.get('service')}\nDetails: ${f.get('message')||'-'}`;window.open('https://wa.me/966564749486?text='+encodeURIComponent(t),'_blank')};
document.getElementById('year').textContent=new Date().getFullYear();apply();show(route());
})();