(function(){
const D=window.GTA_DATA||{},H=window.HQ||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={get:(k,d)=>{try{const v=localStorage.getItem('gta6hq:'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('gta6hq:'+k,JSON.stringify(v))}catch(e){}}};
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
const srcLink=s=>s?`<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.l)}</a>`:'';
// ---- menu, back to top, scrolled state
const mb=$('.menu-btn'),mn=$('#mnav');
if(mb&&mn){mb.addEventListener('click',()=>{const o=mn.hidden;mn.hidden=!o;mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu';document.body.classList.toggle('menu-open',o)});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!mn.hidden){mb.click();mb.focus()}})}
const onScroll=()=>{document.body.classList.toggle('scrolled',scrollY>innerHeight*.5);document.body.classList.toggle('show-top',scrollY>innerHeight)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
// trailers: official Rockstar YouTube, load on click
const T=[['tJbzMqJGH4k','An Extended Look'],['VQRLujxTm3c','Trailer 2'],['QdBZY2fkU-0','Trailer 1']];
if($('#trailers'))$('#trailers').innerHTML=T.map(([id,t])=>`<div class="yt" data-id="${id}" role="button" tabindex="0" aria-label="Play ${t}"><img loading="lazy" src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" onerror="this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'" alt="Grand Theft Auto VI ${t} thumbnail"><span class="play">▶</span><div class="cap"><small>Rockstar Games · YouTube</small><b>${t}</b></div></div>`).join('');
/*yt bound later*/[].forEach(el=>{const go=()=>{el.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.id}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="GTA VI trailer"></iframe>`};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter')go()}});
// gallery: hotlinked from Rockstar's official media page
const R='https://www.rockstargames.com/VI/_next/static/media/',Q='?akim=1&imdensity=1&imwidth=1280';
const G=[['Jason_Lucia_Rooftop_landscape.0c6p5do~-8~7..jpg','Jason & Lucia'],['Jason_and_Lucia_20.0cd~.c7jr~5g9.jpg','Jason & Lucia'],['Leonida_Keys_07.0z9tb69ssp4rq.jpg','Leonida Keys'],['Jason_and_Lucia_15.0m-_zb~mcy2zr.jpg','Jason & Lucia'],['Lucia_Caminos_11.0j617-ylicowx.jpg','Lucia Caminos'],['Jason_Duval_11.019l5gj6~0~0v.jpg','Jason Duval'],['Jason_and_Lucia_16.05-d133mx68ku.jpg','Jason & Lucia'],['Jason_and_Lucia_17.117_b11r13mg5.jpg','Jason & Lucia'],['Jason_Duval_12.0zcl2old.t6gf.jpg','Jason Duval'],['Jason_and_Lucia_18.0kjv.et7330m_.jpg','Jason & Lucia'],['Jason_and_Lucia_19.0n_.5s-v~v5je.jpg','Jason & Lucia']];
if($('#gallery'))$('#gallery').innerHTML=G.map(([f,c],i)=>`<figure><a href="https://www.rockstargames.com/VI/media/screenshots" target="_blank" rel="noopener"><img loading="lazy" src="${R}${f}${Q}" alt="Official GTA VI screenshot: ${c}"></a><figcaption>IMG_${String(i+1).padStart(3,'0')} · ${c} · © Rockstar</figcaption></figure>`).join('');
// searchable / filterable lists
function setup(o){if(!$(o.q))return;const opts=k=>[...new Set(o.data.map(x=>x[k]))].sort();
 o.selects.forEach(([sel,k])=>opts(k).forEach(v=>{const op=document.createElement('option');op.value=v;op.textContent=v;$(sel).appendChild(op)}));
 const draw=()=>{const q=$(o.q).value.trim().toLowerCase();
  const rows=o.data.filter(x=>(!q||Object.values(x).join(' ').toLowerCase().includes(q))&&o.selects.every(([s,k])=>!$(s).value||x[k]===$(s).value));
  $(o.table+' tbody').innerHTML=rows.map(o.row).join('')||`<tr><td colspan="4" style="color:var(--mut)">No matches. Try a different search.</td></tr>`;
  $(o.count).textContent=`${rows.length} / ${o.data.length}`};
 [o.q,...o.selects.map(s=>s[0]),...(o.extra||[])].forEach(s=>$(s).addEventListener('input',draw));draw()}
const vp=t=>t.includes('Moses')?'moses':t.includes('Randy')?'randy':'';
setup({data:D.vehicles,q:'#car-q',table:'#car-table',count:'#car-count',selects:[['#car-area','area'],['#car-type','type']],
 row:v=>`<tr><td>${esc(v.name)}</td><td>${esc(v.area)}</td><td><span class="pill ${vp(v.type)}">${esc(v.type)}</span></td></tr>`});
const hp=h=>h==='Gang op loot'?'gang':h==='Hidden spot'?'hidden':'mission';
setup({data:D.weapons,q:'#wep-q',table:'#wep-table',count:'#wep-count',selects:[['#wep-cls','cls'],['#wep-how','how']],extra:['#wep-spoil'],
 row:w=>{const s=w.how==='During a mission'&&!$('#wep-spoil').checked;const b=s?' class="blur" title="Tick Show story spoilers"':'';
  return `<tr><td><span${b}>${esc(w.name)}</span></td><td>${esc(w.cls)}</td><td><span${b}>${esc(w.area)}</span></td><td><span class="pill ${hp(w.how)}">${esc(w.how)}</span> <span${b}>${esc(w.where)}</span></td></tr>`}});
// chapters (collapsed = spoiler gate)
const notes={1:'Point of no return: starting Tourist Trap locks you into the last three missions of the chapter. Read the Money guide first. (GTA6.house)',2:'Moses starts buying stolen cars (PC Gamer). Near the end of the chapter the story wants $15,000 put away (GTA6.house). CompletionMap, citing Eurogamer, also lists a $100,000 Family Savings goal.',3:'You get the snap gun for picking locks, and Randy starts buying high-end cars. (PC Gamer)',4:'Pilot Pete\'s timed drop jobs become regular work. (PC Gamer)',5:'Final chapter. Late missions end with choices, so save first. (CutsceneWire)'};
const keys=['Tourist Trap','Buck Me','Moses'];
if($('#chapters')&&D.chapters)$('#chapters').innerHTML=Object.entries(D.chapters).map(([n,c])=>`<details><summary><span><span class="n">CH ${n}</span>${esc(c.title)}</span><small>${c.missions.length} missions · tap to reveal</small></summary><ol>${c.missions.map(m=>`<li class="${keys.includes(m)?'key':''}">${esc(m)}</li>`).join('')}</ol><p class="chnote">💡 ${esc(notes[n])}</p></details>`).join('');
// ---- generic click-to-load YouTube facades
$$('.yt').forEach(el=>{const go=()=>{el.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.id}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${esc(el.getAttribute('aria-label')||'Video')}"></iframe>`};el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
// ---- home: horizontal tips track
const tr=$('#track');
if(tr){const items=$$('#track > .feat'),N=items.length-2;
 const idx=()=>{const x=tr.scrollLeft+tr.clientWidth*.4;let i=0;items.forEach((el,k)=>{if(el.offsetLeft<=x)i=k});return i};
 const ui=()=>{const max=tr.scrollWidth-tr.clientWidth,p=max>0?tr.scrollLeft/max:0;$('#prog').style.width=(p*100).toFixed(1)+'%';const i=Math.min(Math.max(idx(),0),N);$('#counter').textContent=String(i).padStart(2,'0')+' / '+String(N).padStart(2,'0');$('#prev').disabled=tr.scrollLeft<4;$('#next').disabled=tr.scrollLeft>max-4};
 const go=d=>{const i=Math.min(Math.max(idx()+d,0),items.length-1);tr.scrollTo({left:items[i].offsetLeft,behavior:'smooth'})};
 $('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);
 tr.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
 tr.addEventListener('wheel',e=>{if(innerWidth<=760||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const max=tr.scrollWidth-tr.clientWidth,r=tr.getBoundingClientRect();if(Math.abs(r.top)>8)return;if((e.deltaY>0&&tr.scrollLeft<max-1)||(e.deltaY<0&&tr.scrollLeft>1)){e.preventDefault();tr.scrollLeft+=e.deltaY*1.1}},{passive:false});
 let raf=0;tr.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;ui()});document.body.classList.toggle('scrolled',tr.scrollLeft>innerWidth*.5||scrollY>innerHeight*.5)},{passive:true});addEventListener('resize',ui);ui();
 const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{root:tr,threshold:.2});items.forEach(el=>tio.observe(el));items[0].classList.add('in')}
// ---- did you know (rotates daily by date)
if($('#dyk')&&H.clues){const C=H.clues,day=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);let k=day%C.length;
 const show=()=>{$('#dyk-t').textContent=C[k].t;$('#dyk-s').innerHTML='Source: '+srcLink(C[k].src)};show();$('#dyk-next').onclick=()=>{k=(k+1)%C.length;show()}}
// ---- radio
if($('#song-q')&&window.HQ_RADIO){const R=window.HQ_RADIO,rows=[];R.forEach(st=>st.songs.forEach(([a,s])=>rows.push({a,s,st:st.name})));
 R.forEach(st=>{const o=document.createElement('option');o.value=o.textContent=st.name;$('#song-st').appendChild(o)});
 $('#stations').innerHTML=R.map(st=>`<article class="card"><p class="tag">${st.songs.length?st.songs.length+' songs logged':'Talk radio'}</p><h3>${esc(st.name)}</h3><div class="card-b">${esc(st.about)}</div>${st.songs.length?`<button class="bp bp-dark sm" type="button" data-st="${esc(st.name)}">See songs</button>`:''}</article>`).join('');
 const draw=()=>{const q=$('#song-q').value.trim().toLowerCase(),f=$('#song-st').value;const r=rows.filter(x=>(!f||x.st===f)&&(!q||(x.a+' '+x.s).toLowerCase().includes(q)));
  $('#song-table tbody').innerHTML=r.slice(0,300).map(x=>`<tr><td>${esc(x.a)}</td><td>${esc(x.s)}</td><td>${esc(x.st)}</td></tr>`).join('')||'<tr><td colspan="3">No matches.</td></tr>';$('#song-count').textContent=`${r.length} / ${rows.length} songs`};
 $('#song-q').addEventListener('input',draw);$('#song-st').addEventListener('input',draw);draw();
 $$('#stations [data-st]').forEach(b=>b.onclick=()=>{$('#song-st').value=b.dataset.st;draw();$('#search').scrollIntoView({behavior:'smooth'})})}
// ---- trophies
if($('#tr-q')&&window.HQ_TROPHIES){const TR=window.HQ_TROPHIES;const draw=()=>{const q=$('#tr-q').value.trim().toLowerCase(),g=$('#tr-g').value,sp=$('#tr-spoil').checked;let r=TR.filter(t=>(!g||t.g===g)&&(!q||(t.n+' '+t.d).toLowerCase().includes(q)));
 if($('#tr-rare').checked)r=[...r].sort((a,b)=>(a.r==null?999:+a.r)-(b.r==null?999:+b.r));
 $('#tr-table tbody').innerHTML=r.map(t=>{const hide=t.story&&!sp;return `<tr><td><b class="${hide?'blur':''}">${esc(t.n)}</b>${t.missable?' <span class="status st-disputed">possibly missable</span>':''}</td><td class="${hide?'blur':''}">${esc(t.d)}</td><td><span class="grade g-${t.g.toLowerCase()}">${t.g}</span></td><td>${t.r==null?'<span class="hint">—</span>':t.r+'%'}</td></tr>`}).join('');$('#tr-count').textContent=`${r.length} / ${TR.length}`};
 ['#tr-q','#tr-g','#tr-rare','#tr-spoil'].forEach(s=>$(s).addEventListener('input',draw));draw()}
// ---- showroom + car finder
const carCard=c=>`<article class="carc"><p class="tag">${esc(c.c)}</p><h3>${esc(c.b)} ${esc(c.n)}${c.one?' <sup title="Single source">†</sup>':''}</h3><div class="bars"><div><span>Speed</span><i style="--w:${c.s*10}%"></i><b>${c.s.toFixed(1)}</b></div>${c.a!=null?`<div><span>Accel.</span><i style="--w:${c.a*10}%"></i><b>${c.a.toFixed(1)}</b></div>`:''}</div>${c.note?`<p class="hint">${esc(c.note)}</p>`:''}</article>`;
if($('#showroom')&&H.cars)$('#showroom').innerHTML=H.cars.slice(0,8).map(carCard).join('');
if($('#cf-grid')&&H.cars){[...new Set(H.cars.map(c=>c.c))].sort().forEach(c=>{const o=document.createElement('option');o.value=o.textContent=c;$('#cf-class').appendChild(o)});
 const draw=()=>{const cl=$('#cf-class').value,ms=+$('#cf-speed').value,so=$('#cf-sort').value;$('#cf-sv').textContent=ms.toFixed(1);let r=H.cars.filter(c=>(!cl||c.c===cl)&&c.s>=ms);
  r.sort(so==='n'?(a,b)=>(a.b+a.n).localeCompare(b.b+b.n):so==='a'?(a,b)=>(b.a||0)-(a.a||0):(a,b)=>b.s-a.s);$('#cf-grid').innerHTML=r.map(carCard).join('')||'<p>No cars match. Lower the minimum speed.</p>';$('#cf-count').textContent=`${r.length} / ${H.cars.length}`};
 ['#cf-class','#cf-speed','#cf-sort'].forEach(s=>$(s).addEventListener('input',draw));draw()}
// ---- carry-over calculator + quiz
if($('#calc')){const v=id=>Math.max(0,+$(id).value||0);const draw=()=>{const sav=v('#c-sav'),keep=Math.min(sav,5000),lost=v('#c-chk')+v('#c-cash')+v('#c-stash')+Math.max(0,sav-5000);
 $('#calc-out').innerHTML=`<div class="stat-grid s3"><div class="stat good"><b>${money(keep)}</b><span>Carries into Chapter 2</span></div><div class="stat bad"><b>${money(lost)}</b><span>Lost at Tourist Trap</span></div><div class="stat ${$('#c-guns').checked?'good':'bad'}"><b>${$('#c-guns').checked?'Safe':'At risk'}</b><span>Guns</span></div></div>${sav<5000?`<p class="tip">Move ${money(Math.min(5000-sav,v('#c-chk')+v('#c-cash')+v('#c-stash')))} more into Family Savings before Tourist Trap.</p>`:sav>5000?'<p class="tip">Anything above $5,000 in savings won\'t carry over. Spend the extra on gear now.</p>':'<p class="tip">Savings are maxed. You\'re set.</p>'}`};
 $$('#calc input').forEach(i=>i.addEventListener('input',draw));draw()}
if($('#quiz')){const qs=$$('#quiz fieldset');const draw=()=>{const ans=qs.map(f=>{const c=f.querySelector('input:checked');return c?c.value:null});qs.forEach((f,i)=>f.classList.toggle('no',ans[i]==='0'));
 if(ans.includes(null)){$('#quiz-out').textContent=`Answered ${ans.filter(a=>a!==null).length} of ${qs.length}.`;return}const y=ans.filter(a=>a==='1').length;
 $('#quiz-out').innerHTML=y===qs.length?'<b>Ready.</b> Save, then start Tourist Trap.':`<b>Not yet: ${qs.length-y} to fix.</b> The red questions show what to do.`};$$('#quiz input').forEach(i=>i.addEventListener('change',draw))}
// ---- trackers & checklist (localStorage)
const trk=LS.get('trk',{});$$('[data-trk]').forEach(c=>{c.checked=!!trk[c.dataset.trk];c.addEventListener('change',()=>{trk[c.dataset.trk]=c.checked;LS.set('trk',trk);ck()})});
function ck(){if(!$('#ck-ring'))return;const all=$$('.ck-grid [data-trk]'),d=all.filter(c=>c.checked).length,p=all.length?Math.round(d/all.length*100):0;$('#ck-pct').textContent=p+'%';$('#ck-ring').style.setProperty('--p',p);$('#ck-sum').textContent=`${d} of ${all.length} done`}
ck();if($('#ck-reset'))$('#ck-reset').onclick=()=>{if(!confirm('Clear your checklist?'))return;$$('.ck-grid [data-trk]').forEach(c=>{c.checked=false;delete trk[c.dataset.trk]});LS.set('trk',trk);ck()};
// ---- share helpers
const hashGet=()=>{try{return Object.fromEntries(new URLSearchParams(location.hash.slice(1)))}catch(e){return{}}};
const copy=(t,msg)=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{if(msg)msg.textContent='Copied!'},()=>{if(msg)msg.textContent=t})};
// ---- loadout planner
if($('#lo')&&D.vehicles){const fill=(sel,arr,lab)=>{$(sel).innerHTML='<option value="">— none —</option>'+arr.map((x,i)=>`<option value="${i}">${esc(lab(x))}</option>`).join('')};
 const W=D.weapons.filter(w=>w.how!=='During a mission');fill('#lo-car',D.vehicles,v=>v.name);['#lo-w1','#lo-w2','#lo-w3'].forEach(s=>fill(s,W,w=>w.name+' · '+w.cls));
 const h=hashGet();['car','w1','w2','w3','who','fit'].forEach(k=>{if(h[k]!=null&&$('#lo-'+k))$('#lo-'+k).value=h[k]});
 const draw=()=>{const g=k=>$('#lo-'+k).value,car=D.vehicles[g('car')],ws=['w1','w2','w3'].map(k=>W[g(k)]).filter(Boolean);
  $('#lo-card').innerHTML=`<p class="cat c-gold">${esc(g('who'))}'s loadout</p><h3>${car?esc(car.name):'No car picked'}</h3>${car?`<p class="hint">${esc(car.area)} · ${esc(car.type)}</p>`:''}<ul>${ws.map(w=>`<li><b>${esc(w.name)}</b> <span class="hint">${esc(w.area)}: ${esc(w.where)}</span></li>`).join('')||'<li class="hint">No weapons picked</li>'}</ul>${g('fit')?`<p><b>Outfit:</b> ${esc(g('fit'))}</p>`:''}`;
  const p=new URLSearchParams();['car','w1','w2','w3','who','fit'].forEach(k=>{if(g(k))p.set(k,g(k))});history.replaceState(null,'','#'+p.toString())};
 $$('#lo select,#lo input').forEach(i=>i.addEventListener('input',draw));draw();$('#lo-copy').onclick=()=>copy(location.href,$('#lo-msg'))}
// ---- heist planner
if($('#hp')&&H.banks){$('#hp-t').innerHTML='<option value="vault">Large bank vault (8 banks)</option>'+H.banks.map((b,i)=>`<option value="${i}">${esc(b.n)} · small bank</option>`).join('');
 const h=hashGet();if(h.t)$('#hp-t').value=h.t;if(h.c)$('#hp-c').value=h.c;if(h.g)$('#hp-g').value=h.g;if(h.j)$('#hp-jam').checked=h.j==='1';
 const draw=()=>{const t=$('#hp-t').value,c=$('#hp-c').value,g=$('#hp-g').value,j=$('#hp-jam').checked,vault=t==='vault',b=vault?null:H.banks[t];const tips=[];
  if(!j)tips.push(['bad','You need the Dye Pack Jammer from Credit Check (Chapter 3). Without it the marked bills are ruined.']);
  if(vault)tips.push(['warn','Vaults unlock at the end of Chapter 4. Follow an armored van and get in while the vault door is open. Expect four stars immediately.']);
  if(vault&&c==='solo')tips.push(['bad','One person can\'t carry a full vault. Bring your partner.']);
  if(!vault)tips.push(['ok','Empty both the cash drawer and the safe, or the job stays incomplete on the checklist.']);
  if(g==='car')tips.push(['warn','Cars get boxed in by traffic. A fast motorbike is the safer getaway.']);if(g==='swap')tips.push(['ok','Good plan: break line of sight, swap vehicles and change outfits to clear heat icons.']);
  tips.push(['ok','Sell the marked bills to Yasmani in Little Cuba.']);
  $('#hp-out').innerHTML=`<div class="stat-grid s3"><div class="stat"><b>${vault?'$65k–$205k':money(b.lo)+'–'+money(b.hi).replace('$','$')}</b><span>Reported payout</span></div><div class="stat"><b>${vault?'4★':'Varies'}</b><span>Wanted level</span></div><div class="stat"><b>${vault?'End Ch. 4':'Ch. 3'}</b><span>Unlocks</span></div></div><ul class="tips-list">${tips.map(([k,t])=>`<li class="${k}">${esc(t)}</li>`).join('')}</ul>`;
  history.replaceState(null,'','#'+new URLSearchParams({t,c,g,j:j?'1':'0'}).toString())};
 $$('#hp select,#hp input').forEach(i=>i.addEventListener('input',draw));draw();$('#hp-copy').onclick=()=>copy(location.href,$('#hp-msg'))}
// ---- challenge generator
if($('#roll')&&H.challenge){const C=H.challenge,pick=a=>a[Math.floor(Math.random()*a.length)];let cur;
 const roll=()=>{cur={who:pick(C.who),rule:pick(C.rule),goal:pick(C.goal),twist:pick(C.twist)};$('#roll-card').innerHTML=`<p class="cat c-gold">What would Lucia do?</p><dl><div><dt>Who</dt><dd>${esc(cur.who)}</dd></div><div><dt>Rule</dt><dd>${esc(cur.rule)}</dd></div><div><dt>Goal</dt><dd>${esc(cur.goal)}</dd></div><div><dt>Twist</dt><dd>${esc(cur.twist)}</dd></div></dl>`};
 $('#roll').onclick=roll;$('#roll-copy').onclick=()=>copy(`Gatorline challenge: ${cur.who}. ${cur.rule}. Goal: ${cur.goal}. Twist: ${cur.twist}.`);roll()}
// ---- rank card (canvas)
if($('#rk-canvas')){const cv=$('#rk-canvas'),x=cv.getContext('2d');const img=new Image();img.src='assets/hero-lucia-jason.jpg';
 const draw=()=>{const g=id=>$('#rk-'+id).value,F='"Barlow Condensed", "Arial Narrow", sans-serif';x.fillStyle='#0f1713';x.fillRect(0,0,1200,630);
  const pg=x.createLinearGradient(560,0,1200,630);pg.addColorStop(0,'#22302a');pg.addColorStop(1,'#1d1229');x.fillStyle=pg;x.fillRect(560,0,640,630);
  if(img.complete&&img.naturalWidth)x.drawImage(img,560,630-358,640,358);
  x.fillStyle='#ffc5b8';x.font='700 30px '+F;x.fillText('Gatorline · RANK CARD',64,90,470);
  x.fillStyle='#fff9cb';x.font='700 88px '+F;x.fillText(String(g('name')||'Player').toUpperCase().slice(0,20),64,186,470);
  [['CHAPTER',g('ch')],['COMPLETION',(+g('pct')||0)+'%'],['TROPHIES',(+g('tr')||0)+' / 55'],['HOURS',+g('h')||0]].forEach(([k,v],i)=>{const X=64+(i%2)*250,Y=280+Math.floor(i/2)*130;x.fillStyle='#ffdf9e';x.font='700 24px '+F;x.fillText(k,X,Y);x.fillStyle='#ffffff';x.font='700 60px '+F;x.fillText(String(v),X,Y+60,220)});
  x.fillStyle='#efe2c8';x.font='500 24px Jost, sans-serif';x.fillText('Favorite car: '+String(g('car')).slice(0,24),64,560,470);
  x.fillStyle='rgba(255,255,255,.6)';x.font='500 15px Jost, sans-serif';x.fillText('Unofficial fan site · not affiliated with Rockstar',64,600,470);x.fillText('Art: purewallfr (DeviantArt)',600,40,560)};
 img.onload=draw;(document.fonts?document.fonts.ready:Promise.resolve()).then(draw);$$('#rk input,#rk select').forEach(i=>i.addEventListener('input',draw));draw();
 $('#rk-dl').onclick=()=>{const a=document.createElement('a');a.download='gta6hq-rank-card.png';a.href=cv.toDataURL('image/png');a.click()}}
// ---- bracket polls (local only)
$$('.bracket').forEach(b=>{const id=b.dataset.id,items=JSON.parse(b.dataset.items);let s=LS.get('br-'+id,null);if(!s||s.items.join()!==items.join())s={items,rounds:[items.slice()],pick:[]};
 const save=()=>LS.set('br-'+id,s);const render=()=>{const r=s.rounds[s.rounds.length-1];const body=b.querySelector('.br-body');
  if(r.length===1){body.innerHTML=`<p class="winner">Your pick: <b>${esc(r[0])}</b></p><button class="bp bp-dark sm" type="button">Vote again</button>`;body.querySelector('button').onclick=()=>{s={items,rounds:[items.slice()],pick:[]};save();render()};return}
  const done=s.pick.length,pair=[r[done*2],r[done*2+1]];const names=['Final','Semi-finals','Quarter-finals'];
  body.innerHTML=`<p class="hint">${names[Math.log2(r.length)-1]||'Round'} · match ${done+1} of ${r.length/2}</p><div class="vs"><button type="button" class="bp bp-light">${esc(pair[0])}</button><span>vs</span><button type="button" class="bp bp-light">${esc(pair[1])}</button></div>`;
  body.querySelectorAll('.vs button').forEach((btn,i)=>btn.onclick=()=>{s.pick.push(pair[i]);if(s.pick.length===r.length/2){s.rounds.push(s.pick);s.pick=[]}save();render()})};render()});
// ---- myths filter
$$('.myths .seg button').forEach(btn=>btn.onclick=()=>{$$('.myths .seg button').forEach(x=>x.classList.toggle('on',x===btn));const f=btn.dataset.f;$$('.myth').forEach(m=>m.hidden=!(f==='all'||m.dataset.st===f))});
// ---- conspiracy board
const bd=$('#cboard');if(bd){const links=JSON.parse(bd.dataset.links),svg=bd.querySelector('svg');const pos=id=>{const e=bd.querySelector(`[data-id="${id}"]`),r=e.getBoundingClientRect(),R=bd.getBoundingClientRect();return[r.left-R.left+r.width/2,r.top-R.top+r.height/2]};
 const lines=()=>{svg.setAttribute('viewBox',`0 0 ${bd.clientWidth} ${bd.clientHeight}`);svg.innerHTML=links.map(([a,b])=>{const[p,q]=[pos(a),pos(b)];return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`}).join('')};
 lines();addEventListener('resize',lines);$$('.pin-card').forEach(c=>c.onclick=()=>{$$('.pin-card').forEach(x=>x.classList.toggle('on',x===c));bd.querySelector('.board-detail').innerHTML=bd.querySelector('#bd-'+c.dataset.id).innerHTML})}
// ---- interactive map (Leaflet, schematic grid)
if($('#leomap')&&window.L&&H.pins){const W=800,Hh=1200,cx=c=>(c-.5)/8*W,cy=r=>(r-.5)/12*Hh;
 const map=L.map('leomap',{crs:L.CRS.Simple,minZoom:-1,maxZoom:2,zoomSnap:.25,attributionControl:true});map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
 const toLL=(x,y)=>L.latLng(Hh-y,x);const bounds=L.latLngBounds(toLL(0,Hh),toLL(W,0));
 const cols='12345678',rows='ABCDEFGHIJKL';let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}"><rect width="${W}" height="${Hh}" fill="#0c1411"/>`;
 for(let i=0;i<=8;i++)svg+=`<line x1="${i*100}" y1="0" x2="${i*100}" y2="${Hh}" stroke="#1a2620" stroke-width="1"/>`;for(let j=0;j<=12;j++)svg+=`<line x1="0" y1="${j*100}" x2="${W}" y2="${j*100}" stroke="#1a2620" stroke-width="1"/>`;
 for(let i=0;i<8;i++)svg+=`<text x="${i*100+50}" y="22" fill="#5f7363" font-size="16" text-anchor="middle" font-family="Arial">${cols[i]}</text>`;for(let j=0;j<12;j++)svg+=`<text x="14" y="${j*100+56}" fill="#5f7363" font-size="16" font-family="Arial">${rows[j]}</text>`;
 const RC={'Mount Kalaga':'#3f6b4f','Port Gellhorn':'#7a5a3a','Ambrosia':'#6b5a2f','Vice City':'#6b4a2a','Grassrivers':'#2f6a5a','Leonida Keys':'#2f5f7a'};
 H.regions.forEach(([n,c,r,sq])=>{const rx=n==='Leonida Keys'?170:(n==='Port Gellhorn'||n==='Ambrosia'?95:120),ry=n==='Leonida Keys'?62:80;svg+=`<ellipse cx="${cx(c)}" cy="${cy(r)}" rx="${rx}" ry="${ry}" fill="${RC[n]}" fill-opacity=".55" stroke="#fff9cb" stroke-opacity=".35"/><text x="${cx(c)}" y="${cy(r)-ry-26}" fill="#fff9cb" font-size="24" font-weight="700" text-anchor="middle" font-family="Arial Narrow,Arial">${n.toUpperCase()}</text><text x="${cx(c)}" y="${cy(r)-ry-8}" fill="#efe2c8" font-size="14" text-anchor="middle" font-family="Arial">Grid ${sq}</text>`});
 svg+='</svg>';L.imageOverlay('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),bounds,{alt:'Schematic grid map of Leonida regions'}).addTo(map);map.fitBounds(bounds);map.setMaxBounds(bounds.pad(.2));
 const CAT={weapon:['#ffb2c6','Weapons'],car:['#ffdf9e','Cars'],secret:['#f0a24b','Secrets'],store:['#9be3c3','Stores'],money:['#ffd4a8','Money'],wildlife:['#8fd3ff','Wildlife'],collectible:['#ffffff','Collectibles']};
 const reg=Object.fromEntries(H.regions.map(r=>[r[0],r]));const per={};const on=Object.fromEntries(Object.keys(CAT).map(k=>[k,true]));
 const mk=H.pins.map((p,i)=>{const r=reg[p.r],n=per[p.r]=(per[p.r]||0)+1,ang=n*2.399,rad=Math.min(1,Math.sqrt(n)/3.4);const sx=r[0]==='Leonida Keys'?150:(r[0]==='Port Gellhorn'||r[0]==='Ambrosia'?78:100),sy=r[0]==='Leonida Keys'?48:64;const m=L.circleMarker(toLL(cx(r[1])+Math.cos(ang)*rad*sx,cy(r[2])+Math.sin(ang)*rad*sy),{radius:7,color:'#0f1713',weight:2,fillColor:CAT[p.c][0],fillOpacity:1});
  m.bindPopup(`<b>${esc(p.n)}</b><br><small>${esc(CAT[p.c][1])} · ${esc(p.r)} · ${esc(p.st)}</small><p>${esc(p.d)}</p><small>Source: ${srcLink(p.src)}</small>`);m.addTo(map);return{m,p,i}});
 $('#pin-filters').innerHTML=Object.entries(CAT).map(([k,[c,l]])=>`<button type="button" class="on" data-c="${k}" aria-pressed="true"><i style="background:${c}"></i>${l} <small>${H.pins.filter(p=>p.c===k).length}</small></button>`).join('');
 const draw=()=>{const q=$('#pin-q').value.trim().toLowerCase();const vis=mk.filter(({p})=>on[p.c]&&(!q||(p.n+' '+p.d+' '+p.r).toLowerCase().includes(q)));mk.forEach(o=>{const v=vis.includes(o);if(v&&!map.hasLayer(o.m))o.m.addTo(map);if(!v&&map.hasLayer(o.m))map.removeLayer(o.m)});
  $('#pin-list').innerHTML=vis.map(({p,i})=>`<li><button type="button" data-i="${i}"><i style="background:${CAT[p.c][0]}"></i><span><b>${esc(p.n)}</b><small>${esc(p.r)}${p.st!=='verified'?' · '+esc(p.st):''}</small></span></button></li>`).join('')||'<li class="hint">No pins match.</li>';
  $$('#pin-list button').forEach(b=>b.onclick=()=>{const o=mk[+b.dataset.i];map.setView(o.m.getLatLng(),1);o.m.openPopup()})};
 $$('#pin-filters button').forEach(b=>b.onclick=()=>{on[b.dataset.c]=!on[b.dataset.c];b.classList.toggle('on');b.setAttribute('aria-pressed',on[b.dataset.c]);draw()});$('#pin-q').addEventListener('input',draw);draw()}
// ---- reveal
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06});
 $$('.db-head,.db-card,.card,.hcard,.qa,.news-row,.dlc-row,.money-item,.gallery figure,.alert,.tips,.chapters details,.tl,.stat,.fcols>div').forEach(el=>{if(el.closest('.reveal'))return;const sib=[...el.parentElement.children].indexOf(el)%4;el.style.setProperty('--d',sib*70+'ms');el.classList.add('reveal');io.observe(el)})}
// ===== v10: Gatorline features (all local, no network except same-origin files) =====
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dayDiff=(a,b)=>Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toast=(t)=>{let el=$('#gl-toast');if(!el){el=document.createElement('div');el.id='gl-toast';el.className='gl-toast';el.setAttribute('role','status');document.body.appendChild(el)}el.innerHTML=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3600)};
// ---- collectible tracker (shares the checklist's trk store)
const pslug=s=>'pin-'+String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
const PCAT={weapon:'Weapons',collectible:'Collectibles',secret:'Secrets',money:'Money',store:'Stores',wildlife:'Wildlife',car:'Cars'};
$$('[data-pin-trk]').forEach(box=>{if(!H.pins)return;const P=H.pins.filter(p=>p.st==='verified');const by={};P.forEach(p=>(by[p.c]=by[p.c]||[]).push(p));
 box.innerHTML=Object.entries(by).map(([c,ps])=>`<fieldset class="pt-group"><legend>${esc(PCAT[c]||c)} <span class="pt-n" data-ptc="${esc(c)}"></span></legend>${ps.map(p=>`<label class="pt-item"><input type="checkbox" data-pin="${pslug(p.n)}" data-c="${esc(c)}"><span><b>${esc(p.n)}</b><small>${esc(p.r)} · ${srcLink(p.src)}</small></span></label>`).join('')}</fieldset>`).join('')+`<p class="pt-sum hint"></p>`;
 const sync=()=>{$$('[data-pin]').forEach(i=>{i.checked=!!trk[i.dataset.pin]});box.querySelectorAll('[data-ptc]').forEach(n=>{const all=box.querySelectorAll(`[data-c="${n.dataset.ptc}"]`);n.textContent=[...all].filter(i=>i.checked).length+'/'+all.length});const all=box.querySelectorAll('[data-pin]'),d=[...all].filter(i=>i.checked).length;box.querySelector('.pt-sum').textContent=`${d} of ${all.length} verified pins found`};
 box.addEventListener('change',e=>{const i=e.target.closest('[data-pin]');if(!i)return;trk[i.dataset.pin]=i.checked;if(!i.checked)delete trk[i.dataset.pin];LS.set('trk',trk);sync();rank()});sync()});
// ---- tool usage (1 point per tool per day, max 5/day)
if(document.body.classList.contains('hub-tools')&&!/^(tools|dashboard)$/.test(document.body.dataset.page)){const mark=()=>{const u=LS.get('uses',{}),t=today();u[t]=u[t]||{};if(!u[t][document.body.dataset.page]){u[t][document.body.dataset.page]=1;LS.set('uses',u);rank()}};const m=$('main');if(m){m.addEventListener('input',mark,{once:true});m.addEventListener('click',e=>{if(e.target.closest('button,select,input'))mark()})}}
// ---- gator rank
const RANKS=[['Hatchling',0],['Swamp Rat',10],['Mangrove Scout',25],['Bull Gator',50],['Swamp King',100]];
function points(){const t=LS.get('trk',{}),ck=Object.keys(t).filter(k=>t[k]&&!k.startsWith('pin-')).length,pins=Object.keys(t).filter(k=>t[k]&&k.startsWith('pin-')).length;
 const u=LS.get('uses',{}),uses=Object.values(u).reduce((a,d)=>a+Math.min(5,Object.keys(d).length),0),st=LS.get('streak',{n:0,best:0,days:0}),calls=LS.get('calls',[]).length;
 return{ck,pins,uses,streak:st.n||0,sdays:st.days||0,calls,pts:ck+pins+uses+(st.days||0)*2+calls*3}}
function rankOf(p){let r=0;RANKS.forEach((x,i)=>{if(p>=x[1])r=i});return r}
function rank(){const P=points(),r=rankOf(P.pts),prev=LS.get('rank',0);if(r>prev){LS.set('rank',r);toast(`<b>Rank up:</b> ${RANKS[r][0]} · ${P.pts} pts`)}else if(r<prev)LS.set('rank',r);if($('#gr-card'))dash();return P}
function dash(){const P=points(),r=rankOf(P.pts),nx=RANKS[r+1];$('#gr-name').textContent=RANKS[r][0];$('#gr-stamp').textContent=r===4?'Top rank':'Rank '+(r+1)+' of 5';
 const lo=RANKS[r][1],hi=nx?nx[1]:lo,pc=nx?Math.round((P.pts-lo)/(hi-lo)*100):100;$('#gr-bar i').style.width=pc+'%';$('#gr-bar').setAttribute('aria-valuenow',pc);$('#gr-next').textContent=nx?`${hi-P.pts} pts to ${nx[0]}`:'You run this swamp.';
 $('#gr-pts').textContent=P.pts;$('#ds-ck').textContent=P.ck;$('#ds-pins').textContent=P.pins;$('#ds-streak').textContent=P.streak;$('#ds-calls').textContent=P.calls;$$('.ranks li').forEach((li,i)=>{li.classList.toggle('on',i<=r);li.classList.toggle('cur',i===r)})}
if($('#gr-card')){dash();$('#dash-export').onclick=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('gta6hq:'))o[k]=localStorage.getItem(k)}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,1)],{type:'application/json'}));a.download='gatorline-my-data.json';a.click()};
 $('#dash-reset').onclick=()=>{if(!confirm('Reset your rank, checklist, streak and logged tips on this device?'))return;Object.keys(localStorage).filter(k=>k.startsWith('gta6hq:')).forEach(k=>localStorage.removeItem(k));location.reload()}}
// ---- daily fact + streak
if($('#fact')&&H.clues){const C=H.clues,day=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),c=C[day%C.length];$('#fact-t').textContent=c.t;$('#fact-s').innerHTML='Source: '+srcLink(c.src);$('#fact-day').textContent=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'});
 const st=()=>LS.get('streak',{n:0,best:0,days:0,last:''}),paint=()=>{const s=st(),done=s.last===today();$('#fact-ok').disabled=done;$('#fact-ok').textContent=done?'Done for today':'Got it · keep my streak';$('#fact-msg').textContent=s.n?`${s.n}-day streak · best ${s.best}`:'Start a streak today.'};
 $('#fact-ok').onclick=()=>{const s=st(),t=today();if(s.last===t)return;s.n=s.last&&dayDiff(s.last,t)===1?s.n+1:1;s.best=Math.max(s.best||0,s.n);s.days=(s.days||0)+1;s.last=t;LS.set('streak',s);paint();rank()};paint()}
if($('#dyk')){const s=LS.get('streak',{n:0}),el=document.createElement('a');el.className='streak-chip';el.href='dashboard.html#fact';el.textContent=s.n?`🔥 ${s.n}-day streak · keep it`:'Start a daily streak';$('#dyk .db-head').appendChild(el)}
// ---- Call it in
if($('#call')){const f=$('#call'),log=$('#call-log'),TY={tip:'Tip',clue:'Clue',glitch:'Glitch',news:'News'};
 const draw=()=>{const L=LS.get('calls',[]);log.innerHTML=L.length?L.slice().reverse().map(c=>`<li class="call-item"><div class="ci-top"><span class="ci-type">${esc(TY[c.type]||c.type)} · ${esc(c.where)}</span><span class="stamp st-pending">Pending review</span></div><p>${esc(c.text)}</p><p class="hint">${new Date(c.ts).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}${c.src?` · <a href="${esc(c.src)}" target="_blank" rel="noopener nofollow">source</a>`:''}${c.name?' · '+esc(c.name):''}</p></li>`).join(''):'<li class="empty">No calls yet. Your logged tips show up here with their status.</li>'};
 const body=()=>`Type: ${$('#call-type').value}\nWhere: ${$('#call-where').value}\n\n${$('#call-text').value}\n\nSource: ${$('#call-src').value||'none'}\nCredit: ${$('#call-name').value||'anonymous'}`;
 const upd=()=>{$('#call-mail').href='mailto:?subject='+encodeURIComponent('Gatorline tip: '+$('#call-type').value)+'&body='+encodeURIComponent(body())};f.addEventListener('input',upd);upd();
 f.addEventListener('submit',e=>{e.preventDefault();const t=$('#call-text').value.trim(),s=$('#call-src').value.trim();
  if(t.length<10){$('#call-msg').textContent='Add a bit more detail (10+ characters).';$('#call-text').focus();return}
  if(s&&!/^https?:\/\//i.test(s)){$('#call-msg').textContent='The source should be a link starting with http.';$('#call-src').focus();return}
  if(!$('#call-ok').checked){$('#call-msg').textContent='Please tick the box to confirm.';return}
  const L=LS.get('calls',[]);L.push({type:$('#call-type').value,where:$('#call-where').value,text:t.slice(0,1200),src:s,name:$('#call-name').value.trim().slice(0,40),ts:Date.now(),status:'pending'});LS.set('calls',L);
  f.reset();upd();$('#call-msg').textContent='Logged. Status: pending review.';draw();rank()});
 $('#call-clear').onclick=()=>{if(confirm('Clear your logged calls?')){LS.set('calls',[]);draw();rank()}};draw()}
// ---- car compare
if($('#cc')&&H.cars){const C=H.cars,ss=['#cc-1','#cc-2','#cc-3'];ss.forEach((s,i)=>{$(s).innerHTML=(i?'<option value="">— none —</option>':'')+C.map((c,j)=>`<option value="${j}">${esc(c.b+' '+c.n)} · ${esc(c.c)}</option>`).join('')});
 const h=hashGet();ss.forEach((s,i)=>{const v=h['c'+(i+1)];if(v!=null&&C[v])$(s).value=v;else if(!i)$(s).value=0;else if(i===1&&!h.c2)$(s).value=1});
 const draw=()=>{const pick=ss.map(s=>$(s).value).filter(v=>v!=='').map(v=>C[v]);const bar=(v,best)=>`<div class="cc-bar${v===best?' best':''}"><i style="--w:${v*10}%"></i><b>${v.toFixed(1)}</b></div>`;
  const bs=Math.max(...pick.map(c=>c.s)),ba=Math.max(...pick.map(c=>c.a));
  $('#cc-out').innerHTML=`<div class="cc-grid" style="--n:${pick.length}">${pick.map(c=>`<article class="cc-card"><p class="case"><span>${esc(c.c)}</span><span class="stamp st-verified">Sourced</span></p><h3>${esc(c.b)} ${esc(c.n)}</h3><p class="cc-l">Top speed</p>${bar(c.s,bs)}<p class="cc-l">Acceleration</p>${bar(c.a,ba)}<p class="hint">${esc(c.note)}</p></article>`).join('')}</div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>$$('#cc-out .cc-bar').forEach(b=>b.classList.add('in'))));
  const p=new URLSearchParams();ss.forEach((s,i)=>{if($(s).value!=='')p.set('c'+(i+1),$(s).value)});history.replaceState(null,'','#'+p)};
 ss.forEach(s=>$(s).addEventListener('input',draw));draw();$('#cc-copy').onclick=()=>copy(location.href,$('#cc-msg'))}
// ---- mission walkthroughs
if($('#wt')&&D.chapters){const M=[];Object.entries(D.chapters).forEach(([n,ch])=>ch.missions.forEach((m,i)=>M.push({ch:n,ct:ch.title,i:i+1,n:m,tot:ch.missions.length})));
 const TIPS={'Tourist Trap':['Point of no return. Only Family Savings carries over, up to $5,000, so bank it first.','https://gta6.house/guides/gta-6-buckme-limits-family-savings-goals','GTA6.house'],'Credit Check':['Unlocks the Dye Pack Jammer. Without it, marked bank bills are ruined.','https://checkpointguides.com/gta-6-bank-robbery/','Checkpoint Guides']};
 const sel=$('#wt-m'),sp=$('#wt-spoil');const label=(m,show)=>`Ch. ${m.ch} · Mission ${m.i}${show?': '+m.n:''}`;
 const fill=()=>{const v=sel.value;sel.innerHTML=M.map((m,j)=>`<option value="${j}">${esc(label(m,sp.checked))}</option>`).join('');sel.value=v||hashGet().m||0};
 const draw=()=>{const m=M[sel.value]||M[0],t=TIPS[m.n],show=sp.checked;$('#wt-out').innerHTML=`<p class="case"><span>Chapter ${m.ch} · ${esc(show?m.ct:'title hidden')}</span><span>Mission ${m.i} of ${m.tot}</span></p><h3>${show?esc(m.n):'Mission name hidden'}</h3>
  <dl class="walk-dl"><div><dt>Objective</dt><dd><span class="soon-inline">TBA</span></dd></div><div><dt>Unlocks</dt><dd>${m.i>1?'After mission '+(m.i-1)+' of chapter '+m.ch:'Start of chapter '+m.ch}</dd></div><div><dt>Rewards</dt><dd><span class="soon-inline">TBA</span></dd></div><div><dt>Missable</dt><dd><span class="soon-inline">TBA</span></dd></div></dl>
  <h4>Steps</h4><ol class="walk-steps"><li><span class="soon-inline">TBA</span> We add steps once they're verified.</li></ol>${t?`<div class="tips-list"><p class="ok">${esc(t[0])}</p></div><p class="srcs">Source: <a href="${t[1]}" target="_blank" rel="noopener">${t[2]}</a></p>`:''}<p class="srcs">Mission order: <a href="https://www.pcgamer.com/games/grand-theft-auto/gta-6-missions-list/" target="_blank" rel="noopener">PC Gamer</a></p>`;history.replaceState(null,'','#m='+sel.value)};
 sp.addEventListener('change',()=>{fill();draw()});sel.addEventListener('input',draw);fill();draw()}
// ---- Ask Gatorline
if($('#ask')){const QA=JSON.parse(($('#ask-qa')||{}).textContent||'[]');let IDX=null;const stop=new Set('a an the in of to do does how what when where why is are can you i my for gta 6 vi it on with and or'.split(' '));
 const tok=s=>String(s).toLowerCase().replace(/[^a-z0-9$ ]+/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w));
 const score=(q,t)=>{const tt=tok(t).join(' ');return q.reduce((a,w)=>a+(tt.includes(w)?(w.length>3?2:1):0),0)};
 const run=async q=>{const qt=tok(q);if(!qt.length){$('#ask-out').innerHTML='';return}if(!IDX){try{IDX=await (await fetch('search-index.json')).json()}catch(e){IDX=[]}}
  const qa=QA.map(x=>({x,s:score(qt,x.q+' '+x.a)})).filter(r=>r.s).sort((a,b)=>b.s-a.s);
  const pg=IDX.map(x=>({x,s:score(qt,(x.t||'')+' '+(x.d||'')+' '+(x.x||''))})).filter(r=>r.s&&!r.x.s).sort((a,b)=>b.s-a.s).slice(0,6);
  const top=qa[0];$('#ask-out').innerHTML=(top?`<div class="answer-box ask-top"><p class="case"><span>Best answer</span><span class="stamp st-verified">Verified</span></p><h3>${esc(top.x.q)}</h3><p>${esc(top.x.a)}</p><p class="srcs">Source: <a href="${esc(top.x.u)}" target="_blank" rel="noopener">${esc(top.x.l)}</a> · <a href="answers.html#${top.x.id}">All answers</a></p></div>`:`<div class="answer-box ask-top"><p class="case"><span>No verified answer yet</span><span class="stamp st-pending">TBA</span></p><p>We don't have a sourced answer for that. Know it? <a href="call.html">Call it in</a>.</p></div>`)+
   (pg.length?`<h3 class="ask-h">Related on Gatorline</h3><ul class="ask-res">${pg.map(r=>`<li><a href="${esc(r.x.u)}"><b>${esc(r.x.t)}</b><small>${esc((r.x.d||'').slice(0,110))}</small></a></li>`).join('')}</ul>`:'')};
 $('#ask').addEventListener('submit',e=>{e.preventDefault();run($('#ask-q').value)});$$('#ask-chips .chip').forEach(b=>b.onclick=()=>{$('#ask-q').value=b.textContent;run(b.textContent)});
 const q0=new URLSearchParams(location.search).get('q');if(q0){$('#ask-q').value=q0;run(q0)}}
// ---- shareable tip cards (canvas, downloaded or shared; nothing uploaded)
$$('.feat[id^="tip-"] .feat-text').forEach(ft=>{const b=document.createElement('button');b.type='button';b.className='bp bp-ghost sm share-card';b.innerHTML='Share card';ft.appendChild(b);
 b.onclick=async()=>{const cv=document.createElement('canvas');cv.width=1200;cv.height=630;const x=cv.getContext('2d');await document.fonts.ready;
  x.fillStyle='#09100e';x.fillRect(0,0,1200,630);const g=x.createRadialGradient(1100,0,0,1100,0,700);g.addColorStop(0,'rgba(240,162,75,.22)');g.addColorStop(1,'rgba(240,162,75,0)');x.fillStyle=g;x.fillRect(0,0,1200,630);
  x.fillStyle='#f0a24b';x.fillRect(72,72,96,4);const lab=(ft.querySelector('.case span')||{}).textContent||'Tip line';x.font='500 22px "IBM Plex Mono", monospace';x.fillStyle='#8fa886';x.fillText(lab.toUpperCase(),72,128);
  const title=(ft.querySelector('h2')||{}).innerText||'';x.fillStyle='#f2eee4';x.font='800 84px "Big Shoulders Display", sans-serif';title.toUpperCase().split('\n').slice(0,2).forEach((l,i)=>x.fillText(l,72,230+i*86,1056));
  const body=((ft.querySelector('.body')||{}).innerText||'').split('\n')[0];x.font='400 28px Manrope, sans-serif';x.fillStyle='#b4bdae';const words=body.split(' ');let line='',y=420,n=0;for(const w of words){if(x.measureText(line+w).width>1000){x.fillText(line,72,y);y+=40;line='';if(++n>=3)break}line+=w+' '}if(n<3)x.fillText(line,72,y);
  x.font='800 34px "Big Shoulders Display", sans-serif';x.fillStyle='#f2eee4';x.fillText('GATOR',72,572);const gw=x.measureText('GATOR').width;x.fillStyle='#f0a24b';x.fillText('LINE',72+gw,572);const lw=x.measureText('LINE').width;x.font='500 16px "IBM Plex Mono", monospace';x.fillStyle='#b4bdae';x.fillText('gatorlinehq.com',72+gw+lw+20,568);x.font='500 16px "IBM Plex Mono", monospace';x.fillStyle='#8fa886';x.textAlign='right';x.fillText('Unofficial fan site · not affiliated with Rockstar',1128,572);x.textAlign='left';const so=((ft.querySelector('.srcs')||{}).innerText||'').slice(0,90);if(so){x.fillStyle='#b4bdae';x.fillText(so,72,y+56)}
  cv.toBlob(async bl=>{const file=new File([bl],'gatorline-tip.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Gatorline tip'});return}catch(e){}}const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='gatorline-tip.png';a.click()},'image/png')}});
rank();

})();

/* ===== v6: cursor, hero video, transitions, tab bar, search, reading, loader ===== */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)');
// --- cursor dot (desktop, fine pointer only)
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  const dot=document.createElement('div');dot.className='cdot off';dot.style.transform='translate3d(-100px,-100px,0)';dot.setAttribute('aria-hidden','true');document.body.appendChild(dot);document.documentElement.classList.add('has-cdot');
  let x=-50,y=-50,tx=-50,ty=-50,raf=0;
  const loop=()=>{x+=(tx-x)*(RM.matches?1:.35);y+=(ty-y)*(RM.matches?1:.35);dot.style.transform=`translate3d(${x}px,${y}px,0)`;raf=(Math.abs(tx-x)+Math.abs(ty-y)>.3)?requestAnimationFrame(loop):0};
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(x<0){x=tx;y=ty}const t=e.target;const txt=t.closest&&t.closest('input,textarea,select,[contenteditable],.leaflet-container');dot.classList.toggle('off',!!txt);dot.classList.toggle('big',!txt&&!!(t.closest&&t.closest('a,button,label,summary,[role=button],.yt,.lb-item')));if(!raf)raf=requestAnimationFrame(loop)},{passive:true});
  document.addEventListener('pointerleave',()=>dot.classList.add('off'));document.addEventListener('pointerenter',()=>dot.classList.remove('off'));
  addEventListener('pointerdown',()=>dot.classList.add('down'));addEventListener('pointerup',()=>dot.classList.remove('down'));
}
// --- hero video: pause for reduced motion, toggle button, pause offscreen
const todT=new URLSearchParams(location.search).get('tod')||(h=>h>=5&&h<9?'sunrise':h>=9&&h<17?'day':h>=17&&h<20?'sunset':'night')(new Date().getHours());
const vid=$('.hero-vid'),vt=$('.vid-toggle');
if(vid&&todT==='sunset'){
  const setP=p=>{if(p){vid.pause();}else{const pr=vid.play();pr&&pr.catch(()=>{})}if(vt){vt.setAttribute('aria-pressed',p?'true':'false');vt.setAttribute('aria-label',p?'Play background video':'Pause background video');vt.classList.toggle('paused',p)}};
  let user=null;const apply=()=>setP(user!==null?user:RM.matches);
  if(RM.matches){vid.removeAttribute('autoplay');vid.pause()}
  apply();RM.addEventListener&&RM.addEventListener('change',apply);
  vt&&vt.addEventListener('click',()=>{user=!vid.paused?true:false;setP(user)});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)vid.pause();else apply()})).observe(vid);
}
// --- page transitions: CSS @view-transition where supported, fade fallback otherwise
const crossVT='onpagereveal' in window;
if(!crossVT&&!RM.matches){
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||a.hasAttribute('download'))return;
    const u=new URL(a.href,location.href);if(u.origin!==location.origin||(u.pathname===location.pathname&&u.hash))return;if(!/\.html$|\/$/.test(u.pathname))return;
    e.preventDefault();document.documentElement.classList.add('leaving');setTimeout(()=>location.href=a.href,160)});
  addEventListener('pageshow',()=>document.documentElement.classList.remove('leaving'));
}
// --- tab bar active state
const pg=document.body.dataset.page||(document.body.classList.contains('home')?'index':'');
$$('.tabbar a').forEach(a=>{const t=a.dataset.tab;if(t===pg||document.body.classList.contains('hub-'+t.toLowerCase())||(t==='index'&&document.body.classList.contains('home')))a.setAttribute('aria-current','page')});
// --- prefill database search from ?q=
const qp=new URLSearchParams(location.search).get('q');
if(qp){const inp=$('#car-q')||$('#wep-q');if(inp){inp.value=qp;inp.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(()=>inp.scrollIntoView({block:'center'}),300)}}
// --- global search overlay
const sov=$('#sov'),sq=$('#sov-q'),sres=$('#sov-res');let IDX=null,sel=-1,lastFocus=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
async function load(){if(IDX)return IDX;try{const r=await fetch('search-index.json');IDX=await r.json()}catch(e){IDX=[]}return IDX}
function score(it,terms){const t=norm(it.t),d=norm(it.d||''),x=norm(it.x||'');let s=0;for(const w of terms){if(t===w)s+=12;else if(t.startsWith(w))s+=8;else if(t.includes(w))s+=5;else if(d.includes(w))s+=2;else if(x.includes(w))s+=1;else return 0}
  return s+({Guides:3,Tools:3,Database:3,Community:2,Home:2,Section:1}[it.k]||0)}
function render(q){const terms=norm(q).trim().split(/\s+/).filter(Boolean);sel=-1;
  if(!terms.length){sres.innerHTML='<li class="sov-empty">Try “bigfoot”, “infernus”, “family savings” or “trophy”.</li>';return}
  const r=IDX.map(it=>[score(it,terms),it]).filter(a=>a[0]&&(!a[1].s||q.length>2)).sort((a,b)=>b[0]-a[0]).slice(0,24);
  sres.innerHTML=r.length?r.map(([_,it],i)=>`<li role="option" id="sr${i}"><a href="${esc(it.u)}"><span class="sk">${esc(it.k==='Section'?'Section · '+(it.p||''):it.k)}${it.s?' · spoiler':''}</span><b>${esc(it.t)}</b><small>${esc((it.d||'').slice(0,120))}</small></a></li>`).join(''):`<li class="sov-empty">No results for “${esc(q)}”.</li>`}
async function openS(){lastFocus=document.activeElement;sov.hidden=false;document.documentElement.classList.add('sov-open');requestAnimationFrame(()=>sov.classList.add('on'));sq.focus();await load();render(sq.value)}
function closeS(){sov.classList.remove('on');document.documentElement.classList.remove('sov-open');setTimeout(()=>{sov.hidden=true},180);lastFocus&&lastFocus.focus&&lastFocus.focus()}
if(sov){
  document.addEventListener('click',e=>{if(e.target.closest('[data-search]')){e.preventDefault();openS()}});
  $('#sov-x').addEventListener('click',closeS);sov.addEventListener('click',e=>{if(e.target===sov)closeS()});
  sq.addEventListener('input',()=>IDX&&render(sq.value));
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&sov.hidden&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();openS();return}
    if(sov.hidden)return;const items=$$('#sov-res a');
    if(e.key==='Escape'){e.preventDefault();closeS()}
    else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!items.length)return;sel=(sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((a,i)=>a.classList.toggle('sel',i===sel));items[sel].scrollIntoView({block:'nearest'})}
    else if(e.key==='Enter'&&document.activeElement===sq){const a=items[sel<0?0:sel];if(a){e.preventDefault();location.href=a.href}}
    else if(e.key==='Tab'){const f=[sq,...items,$('#sov-x')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
  });
}
// --- reading progress (guides)
const rb=$('.readbar i');
if(rb&&document.body.classList.contains('guide')){document.documentElement.classList.add('has-readbar');const up=()=>{const h=document.documentElement.scrollHeight-innerHeight;rb.style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`};addEventListener('scroll',up,{passive:true});up()}
// --- table of contents: scrollspy + mobile collapse
const toc=$('.toc');
if(toc){const links=$$('.toc-links a'),cur=$('.toc-cur'),tg=$('.toc-t');
  const secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const spy=()=>{let i=-1;secs.forEach((s,j)=>{if(s.getBoundingClientRect().top<innerHeight*.35)i=j});links.forEach((a,j)=>a.classList.toggle('on',j===i));if(cur)cur.textContent=i>=0?'· '+links[i].textContent:''};
  addEventListener('scroll',spy,{passive:true});spy();
  tg&&tg.addEventListener('click',()=>{const o=toc.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
  links.forEach(a=>a.addEventListener('click',()=>{toc.classList.remove('open');tg&&tg.setAttribute('aria-expanded','false')}));
}
})();

/* ===== v8: time-of-day hero + Leonida traced ===== */
(function(){
  var fig=document.querySelector('.intro-media');
  if(fig){
    var h=new Date().getHours(),q=new URLSearchParams(location.search).get('tod');
    var t=q||(h>=5&&h<9?'sunrise':h>=9&&h<17?'day':h>=17&&h<20?'sunset':'night');
    var map={sunrise:'activities',day:'properties',night:'secrets'};
    var name=document.getElementById('tod-name');if(name)name.textContent=t;
    fig.setAttribute('data-tod',t);
    if(map[t]){
      var img=fig.querySelector('.tod-img'),v=fig.querySelector('.hero-vid');
      if(img){
        img.srcset='assets/img/'+map[t]+'-800.webp 800w, assets/img/'+map[t]+'.webp 1600w';
        img.sizes='100vw';img.src='assets/img/'+map[t]+'.jpg';img.hidden=false;
        fig.classList.add('tod-still');
        if(v){try{v.pause();}catch(e){}v.removeAttribute('autoplay');v.preload='none';}
      }
    }
  }
  var tr=document.getElementById('trace'),svg=tr&&tr.querySelector('.trace-map');
  if(!svg)return;
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(rm.matches){svg.style.setProperty('--p','1');return;}
  var tick=false;
  function upd(){
    tick=false;
    var r=tr.getBoundingClientRect(),span=tr.offsetHeight-window.innerHeight;
    var p=span>0?Math.min(1,Math.max(0,-r.top/span)):1;
    svg.style.setProperty('--p',p.toFixed(3));
  }
  svg.style.setProperty('--p','0');
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
  window.addEventListener('resize',upd);upd();
})();

/* ===== v10b: sounds, breaking banner, lightbox, count-up, PWA ===== */
(function(){
  var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
  var get=function(k,d){try{var v=localStorage.getItem('gta6hq:'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set=function(k,v){try{localStorage.setItem('gta6hq:'+k,JSON.stringify(v))}catch(e){}};
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // swamp sounds: off by default, self-generated CC0 loop, remembered
  var au=null,btns=$$('[data-sound]');
  function paint(on){btns.forEach(function(b){b.setAttribute('aria-pressed',on?'true':'false');b.setAttribute('aria-label','Swamp sounds: '+(on?'on':'off'));b.classList.toggle('on',on)})}
  function play(){if(!au){au=new Audio();au.loop=true;au.volume=0;au.preload='auto';au.src=au.canPlayType('audio/ogg; codecs=opus')?'assets/audio/swamp.ogg':'assets/audio/swamp.m4a'}
    var p=au.play();if(p&&p.catch)p.catch(function(){});var v=0,t=setInterval(function(){v=Math.min(.35,v+.035);au.volume=v;if(v>=.35)clearInterval(t)},80)}
  function stop(){if(!au)return;var t=setInterval(function(){au.volume=Math.max(0,au.volume-.05);if(au.volume<=0){clearInterval(t);au.pause()}},60)}
  btns.forEach(function(b){b.addEventListener('click',function(){var on=!get('sound',false);set('sound',on);paint(on);on?play():stop()})});
  if(get('sound',false)){paint(true);var kick=function(){play();removeEventListener('pointerdown',kick);removeEventListener('keydown',kick)};addEventListener('pointerdown',kick);addEventListener('keydown',kick)}
  document.addEventListener('visibilitychange',function(){if(!au)return;if(document.hidden)au.pause();else if(get('sound',false))au.play().catch(function(){})});
  // breaking banner from news.json
  fetch('news.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(n){var b=n&&n.breaking;if(!b||!b.on||get('brk',null)===b.id)return;
    var el=document.createElement('aside');el.className='breaking';el.setAttribute('aria-label','Breaking news');
    el.innerHTML='<span class="br-tag">Breaking</span><a href="'+b.href+'">'+b.text.replace(/</g,'&lt;')+'</a><button type="button" class="br-x" aria-label="Dismiss">\u00d7</button>';
    document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('on')});el.querySelector('.br-x').onclick=function(){set('brk',b.id);el.remove()}}).catch(function(){});
  // count-up stats
  var nums=$$('[data-count], .stat b');if('IntersectionObserver' in window&&!RM){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target,txt=el.textContent,m=txt.match(/^([^0-9]*)([0-9][0-9,]*)(.*)$/);if(!m)return;var end=parseInt(m[2].replace(/,/g,''),10);if(!end||end>100000)return;var t0=performance.now(),d=900;
    (function f(t){var k=Math.min(1,(t-t0)/d),v=Math.round(end*(1-Math.pow(1-k,3)));el.textContent=m[1]+(m[2].indexOf(',')>-1?v.toLocaleString('en-US'):v)+m[3];if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.6});
    nums.forEach(function(n){if(!n.closest('#gr-card,#dash-stats'))io.observe(n)})}
  // lightbox: swipe, zoom, captions
  var imgs=$$('.gallery img, .fa-img img, .photo img, .lb');if(imgs.length){var lb=document.createElement('div');lb.className='lbox';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image viewer');lb.hidden=true;
    lb.innerHTML='<figure><img alt=""><figcaption></figcaption></figure><button class="lb-x icon-btn" aria-label="Close">\u00d7</button><button class="lb-p icon-btn" aria-label="Previous">\u2190</button><button class="lb-n icon-btn" aria-label="Next">\u2192</button>';document.body.appendChild(lb);
    var li=lb.querySelector('img'),cap=lb.querySelector('figcaption'),cur=0,last=null,zoom=false;
    function show(i){cur=(i+imgs.length)%imgs.length;var im=imgs[cur];li.src=im.currentSrc||im.src;li.alt=im.alt||'';var c=im.closest('figure')&&im.closest('figure').querySelector('figcaption');cap.textContent=(c&&c.textContent)||im.alt||'';zoom=false;lb.classList.remove('zoom')}
    function open(i){last=document.activeElement;show(i);lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.lb-x').focus()}
    function close(){lb.hidden=true;document.body.style.overflow='';if(last)last.focus()}
    imgs.forEach(function(im,i){im.style.cursor='zoom-in';im.setAttribute('tabindex','0');im.setAttribute('role','button');im.addEventListener('click',function(e){e.preventDefault();open(i)});im.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}})});
    lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=function(){show(cur-1)};lb.querySelector('.lb-n').onclick=function(){show(cur+1)};
    li.addEventListener('dblclick',function(){zoom=!zoom;lb.classList.toggle('zoom',zoom)});lb.addEventListener('click',function(e){if(e.target===lb)close()});
    addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
    var sx=null;lb.addEventListener('touchstart',function(e){if(e.touches.length===1&&!zoom)sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));sx=null})}
  // signup: no backend yet, so be honest
  $$('[data-signup]').forEach(function(f){var inp=f.querySelector('input[type=email]'),msg=f.querySelector('.su-msg'),saved=get('signup',null);
    var done=function(e){f.classList.add('saved');msg.innerHTML='<b>Coming soon.</b> Nothing was sent: email updates aren\'t live yet. '+(e?'We saved <b>'+e.replace(/</g,'&lt;')+'</b> in this browser only, so you don\'t have to retype it later.':'')};
    if(saved&&saved.email){inp.value=saved.email;done(saved.email)}
    f.addEventListener('submit',function(ev){ev.preventDefault();var v=inp.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){msg.textContent='Please enter a valid email address.';inp.setAttribute('aria-invalid','true');inp.focus();return}
      inp.removeAttribute('aria-invalid');set('signup',{email:v,ts:Date.now()});done(v)})});
  // branded loading shimmer: stop once each image has loaded
  $$('.phero-media img, .feat-media img, .fa-img img').forEach(function(im){var f=im.closest('figure');if(!f)return;var ok=function(){f.classList.add('ld')};if(im.complete&&im.naturalWidth)ok();else{im.addEventListener('load',ok);im.addEventListener('error',ok)}});
  // PWA: offline for checklist, map and guides
  if('serviceWorker' in navigator&&location.protocol!=='file:'){addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
})();
