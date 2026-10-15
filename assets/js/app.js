const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const sideMenu=$('#sideMenu'),sideToggle=$('#sideMenuToggle');
if(sideMenu&&sideToggle){sideToggle.addEventListener('click',()=>{const open=sideMenu.classList.toggle('open');sideToggle.setAttribute('aria-expanded',String(open));sideToggle.textContent=open?'×':'☰'});$$('.side-link',sideMenu).forEach(link=>link.addEventListener('click',()=>{sideMenu.classList.remove('open');sideToggle.setAttribute('aria-expanded','false');sideToggle.textContent='☰'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){sideMenu.classList.remove('open');sideToggle.setAttribute('aria-expanded','false');sideToggle.textContent='☰'}})}
const vehicleCatalog={
'ایران‌خودرو':{'سمند':['سمند LX','سمند سورن','سورن پلاس'],'دنا':['دنا','دنا پلاس','دنا پلاس توربو','دنا پلاس اتوماتیک'],'پژو ۲۰۶':['۲۰۶ تیپ ۲','۲۰۶ تیپ ۵','۲۰۶ صندوقدار'],'پژو ۲۰۷':['۲۰۷ دنده‌ای','۲۰۷ اتوماتیک','۲۰۷ پانوراما'],'پژو ۲۰۸':['۲۰۸'],'پژو ۴۰۵':['۴۰۵ GLX','۴۰۵ SLX'],'پژو پارس':['پارس سال','پارس LX','پارس ELX'],'تارا':['تارا دنده‌ای','تارا اتوماتیک'],'رانا':['رانا','رانا پلاس'],'ری‌را':['ری‌را'],'هایما':['S5','S7','S7 پرو','S8'],'آریسان':['آریسان ۲'],'سورن':['سورن پلاس']},
'سایپا':{'پراید':['۱۱۱','۱۳۱','۱۳۲','۱۵۱ وانت'],'تیبا':['تیبا','تیبا ۲'],'ساینا':['ساینا S','ساینا GX','ساینا اتوماتیک'],'کوییک':['کوییک S','کوییک R','کوییک GXR','کوییک اتوماتیک'],'شاهین':['شاهین G','شاهین اتوماتیک','شاهین پلاس'],'اطلس':['اطلس G','اطلس GL'],'سهند':['سهند S','سهند G'],'وانت زامیاد':['زامیاد معمولی','زامیاد دوگانه‌سوز']},
'پارس خودرو':{'کوییک':['کوییک'],'سهند':['سهند'],'پارس تندر':['پارس تندر'],'برلیانس':['H220','H230','H320','H330','کراس'],'رنو':['تندر ۹۰','ساندرو','مگان']},
'کرمان موتور':{'جک':['J3','J4','J5','S3','S5'],'کی‌ام‌سی':['T8','T9','J7','X5','A5'],'بک':['X3','U5']},
'مدیران خودرو':{'ام‌وی‌ام':['110','315','X22','X33','X55 پرو','530','550'],'چری':['آریزو ۵','آریزو ۶','تیگو ۵','تیگو ۷','تیگو ۸'],'فونیکس':['آریزو ۶ پرو','آریزو ۸','تیگو ۷ پرو','تیگو ۸ پرو','FX']},
'بهمن موتور':{'دیگنیتی':['پرایم','پرستیژ'],'فیدلیتی':['پرایم ۵ نفره','پرایم ۷ نفره','پرستیژ'],'رسپکت':['رسپکت ۲'],'اینرودز':['اینرودز'],'کاپرا':['کاپرا ۲']},
'ایران خودرو دیزل':{'ون وانا':['وانا'],'آریسان':['آریسان'],'کامیون':['۶ تن','۸ تن','کشنده']},
'آرین پارس موتور':{'لاماری':['ایما','ایما هیبرید']},
'آمیکو':{'آمیکو':['آسنا','M263','کشنده']},
'تویوتا':{'کرولا':['کرولا','کرولا کراس'],'کمری':['کمری'],'راو۴':['RAV4'],'لندکروزر':['Land Cruiser'],'پرادو':['Prado'],'هایلوکس':['Hilux'],'یاریس':['Yaris'],'C-HR':['C-HR'],'لوین':['Levin']},
'هیوندای':{'سانتافه':['Santa Fe'],'توسان':['Tucson'],'النترا':['Elantra'],'سوناتا':['Sonata'],'اکسنت':['Accent'],'کونا':['Kona'],'آزرا':['Azera'],'i20':['i20'],'i30':['i30']},
'کیا':{'اسپورتیج':['Sportage'],'سورنتو':['Sorento'],'سراتو':['Cerato'],'اپتیما':['Optima'],'K5':['K5'],'K3':['K3'],'پیکانتو':['Picanto'],'موهاوی':['Mohave'],'سلتوس':['Seltos']},
'نیسان':{'قشقایی':['Qashqai'],'ایکس‌تریل':['X-Trail'],'جوک':['Juke'],'سنترا':['Sentra'],'پاترول':['Patrol'],'تینا':['Teana'],'ماکسیما':['Maxima'],'پیکاپ':['Navara']},
'میتسوبیشی':{'اوتلندر':['Outlander'],'ASX':['ASX'],'لنسر':['Lancer'],'پاجرو':['Pajero'],'اکلیپس کراس':['Eclipse Cross']},
'مزدا':{'مزدا ۳':['Mazda 3'],'مزدا ۲':['Mazda 2'],'CX-30':['CX-30'],'CX-5':['CX-5']},
'هوندا':{'آکورد':['Accord'],'سیویک':['Civic'],'CR-V':['CR-V'],'HR-V':['HR-V']},
'سوزوکی':{'ویتارا':['Grand Vitara'],'جیمنی':['Jimny'],'سیاز':['Ciaz'],'بالنو':['Baleno']},
'رنو':{'تندر ۹۰':['L90'],'ساندرو':['Sandero'],'مگان':['Megane'],'کولیوس':['Koleos'],'داستر':['Duster'],'فلوئنس':['Fluence'],'تالیسمان':['Talisman']},
'پژو':{'۲۰۰۸':['2008'],'۲۰۶':['206'],'۲۰۷':['207'],'۳۰۱':['301'],'۴۰۷':['407'],'۵۰۸':['508'],'پارس':['Pars']},
'بنز':{'کلاس C':['C-Class'],'کلاس E':['E-Class'],'کلاس S':['S-Class'],'کلاس G':['G-Class'],'GLC':['GLC'],'GLE':['GLE'],'A-Class':['A-Class']},
'ب‌ام‌و':{'سری ۱':['118i'],'سری ۳':['320i','330i'],'سری ۵':['520i','530i'],'X1':['X1'],'X3':['X3'],'X4':['X4'],'X5':['X5'],'X6':['X6']},
'آئودی':{'A3':['A3'],'A4':['A4'],'A6':['A6'],'Q3':['Q3'],'Q5':['Q5'],'Q7':['Q7']},
'فولکس‌واگن':{'گلف':['Golf'],'تیگوان':['Tiguan'],'پاسات':['Passat'],'ID.4':['ID.4']},
'لکسوس':{'ES':['ES 250','ES 350'],'RX':['RX 350'],'NX':['NX 200t','NX 300h'],'IS':['IS 250'],'LX':['LX 570']},
'پورشه':{'ماکان':['Macan'],'کاین':['Cayenne'],'پانامرا':['Panamera'],'باکستر':['Boxster']},
'ولوو':{'XC40':['XC40'],'XC60':['XC60'],'XC90':['XC90'],'S60':['S60']},
'جگوار':{'F-Pace':['F-Pace'],'XE':['XE'],'XF':['XF']},
'لندروور':{'رنجروور':['Range Rover'],'دیسکاوری':['Discovery'],'ديفندر':['Defender'],'رنجروور ایووک':['Range Rover Evoque']},
'چانگان':{'CS35':['CS35 Plus'],'CS55':['CS55 Plus'],'UNI-T':['UNI-T'],'UNI-K':['UNI-K']},
'جک / جی‌ای‌سی':{'J4':['J4'],'S3':['S3'],'S5':['S5'],'GS3':['GS3'],'GS4':['GS4']},
'فیدلیتی / جتور':{'X70':['X70'],'X90':['X90'],'داشینگ':['Dashing']},
'فونیکس / چری':{'تیگو ۷':['Tiggo 7'],'تیگو ۸':['Tiggo 8'],'آریزو ۶':['Arrizo 6'],'FX':['FX']},
'جیلی':{'امگرند':['Emgrand'],'کول‌ری':['Coolray'],'آزکارا':['Azkarra']},
'هاوال':{'H2':['H2'],'H6':['H6'],'H9':['H9']},
'گریت‌وال':{'وینگل':['Wingle'],'پوئر':['Poer']},
'دانگ‌فنگ':{'H30 کراس':['H30 Cross'],'S30':['S30'],'شاین مکس':['Shine Max']},
'ام‌جی':{'MG 3':['MG 3'],'MG 5':['MG 5'],'MG 6':['MG 6'],'HS':['HS']},
'دی‌اس':{'DS 3':['DS 3'],'DS 4':['DS 4'],'DS 7':['DS 7']},
'سایر / نامشخص':{'مدل دیگر':['مدل دیگر']}
};
const form=$('#requestForm'),type=$('#requestType'),vehicle=$('#vehicleFields'),transfer=$('#transferFields'),sale=$('#saleFields'),buy=$('#buyFields'),brand=$('#brand'),model=$('#model'),budgetLabel=$('#budgetLabel');
const show=(el,on)=>{if(el){el.classList.toggle('hidden',!on);el.querySelectorAll('input,select,textarea').forEach(field=>{field.disabled=!on})}};
if(brand&&model){
Object.keys(vehicleCatalog).forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;brand.append(o)});
brand.addEventListener('change',()=>{model.replaceChildren();const first=document.createElement('option');first.value='';first.textContent='مدل را انتخاب کنید';model.append(first);const list=vehicleCatalog[brand.value]||{};Object.entries(list).forEach(([group,models])=>models.forEach(item=>{const o=document.createElement('option');o.value=group+' — '+item;o.textContent=group+' — '+item;model.append(o)}));model.disabled=!brand.value});
const year=$('#year');const faDigits=n=>String(n).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]);for(let y=1405;y>=1370;y--){const o=document.createElement('option');o.value=String(y);o.textContent=faDigits(y);year.append(o)}
}
function updateForm(){const v=type?.value;const vehicleOn=['خرید خودرو','فروش خودرو'].includes(v);show(vehicle,vehicleOn);show(buy,v==='خرید خودرو');show(sale,v==='فروش خودرو');show(transfer,v==='حواله خودرو');if(budgetLabel)budgetLabel.textContent=v==='فروش خودرو'?'قیمت پیشنهادی (تومان)':'بودجه یا قیمت مدنظر (تومان)';}
if(type){type.addEventListener('change',updateForm);updateForm()}
if(form){form.addEventListener('submit',async e=>{e.preventDefault();const status=$('#formStatus'),button=$('#submitRequest');if(form.querySelector('[name="_honey"]').value)return;status.className='form-status';status.textContent='';button.disabled=true;button.querySelector('span').textContent='در حال ارسال…';try{const response=await fetch('https://formsubmit.co/ajax/kazemi44468@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const result=await response.json();if(!response.ok||result.success===false)throw new Error(result.message||'ارسال انجام نشد');status.className='form-status visible success';status.textContent='درخواست ارسال شد. برای هماهنگی با شما تماس گرفته خواهد شد.';form.reset();if(brand&&model){model.replaceChildren();const o=document.createElement('option');o.value='';o.textContent='ابتدا برند را انتخاب کنید';model.append(o);model.disabled=true}updateForm()}catch(error){status.className='form-status visible error';status.textContent='ارسال خودکار تأیید نشد. ممکن است سرویس ایمیل نیاز به فعال‌سازی اولیه داشته باشد؛ می‌توانید از نشانی ایمیل درج‌شده استفاده کنید.'}finally{button.disabled=false;button.querySelector('span').textContent='ارسال درخواست'}})}
