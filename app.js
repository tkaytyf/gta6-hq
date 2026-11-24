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
const keys=['Tourist Trap','Buck Me','Moses'],mx=Math.max(...Object.values(D.chapters).map(c=>c.missions.length));
if($('#chapters'))$('#chapters').innerHTML=Object.entries(D.chapters).map(([n,c])=>`<details><summary><span><span class="n">CH ${n}</span>${esc(c.title)}</span><small>${c.missions.length} missions · tap to reveal</small></summary><ol>${c.missions.map(m=>`<li class="${keys.includes(m)?'key':''}">${esc(m)}</li>`).join('')}</ol><p class="chnote">💡 ${esc(notes[n])}</p></details>`).join('');
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
 $('#roll').onclick=roll;$('#roll-copy').onclick=()=>copy(`GTA6 HQ challenge: ${cur.who}. ${cur.rule}. Goal: ${cur.goal}. Twist: ${cur.twist}.`);roll()}
// ---- rank card (canvas)
if($('#rk-canvas')){const cv=$('#rk-canvas'),x=cv.getContext('2d');const img=new Image();img.src='assets/hero-lucia-jason.jpg';
 const draw=()=>{const g=id=>$('#rk-'+id).value,F='"Barlow Condensed", "Arial Narrow", sans-serif';x.fillStyle='#160d20';x.fillRect(0,0,1200,630);
  const pg=x.createLinearGradient(560,0,1200,630);pg.addColorStop(0,'#3a2347');pg.addColorStop(1,'#1d1229');x.fillStyle=pg;x.fillRect(560,0,640,630);
  if(img.complete&&img.naturalWidth)x.drawImage(img,560,630-358,640,358);
  x.fillStyle='#ffc5b8';x.font='700 30px '+F;x.fillText('GTA6 HQ · RANK CARD',64,90,470);
  x.fillStyle='#fff9cb';x.font='700 88px '+F;x.fillText(String(g('name')||'Player').toUpperCase().slice(0,20),64,186,470);
  [['CHAPTER',g('ch')],['COMPLETION',(+g('pct')||0)+'%'],['TROPHIES',(+g('tr')||0)+' / 55'],['HOURS',+g('h')||0]].forEach(([k,v],i)=>{const X=64+(i%2)*250,Y=280+Math.floor(i/2)*130;x.fillStyle='#ffdf9e';x.font='700 24px '+F;x.fillText(k,X,Y);x.fillStyle='#ffffff';x.font='700 60px '+F;x.fillText(String(v),X,Y+60,220)});
  x.fillStyle='#e7d6ff';x.font='500 24px Jost, sans-serif';x.fillText('Favorite car: '+String(g('car')).slice(0,24),64,560,470);
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
 const cols='12345678',rows='ABCDEFGHIJKL';let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}"><rect width="${W}" height="${Hh}" fill="#120e1b"/>`;
 for(let i=0;i<=8;i++)svg+=`<line x1="${i*100}" y1="0" x2="${i*100}" y2="${Hh}" stroke="#231c30" stroke-width="1"/>`;for(let j=0;j<=12;j++)svg+=`<line x1="0" y1="${j*100}" x2="${W}" y2="${j*100}" stroke="#231c30" stroke-width="1"/>`;
 for(let i=0;i<8;i++)svg+=`<text x="${i*100+50}" y="22" fill="#6e6385" font-size="16" text-anchor="middle" font-family="Arial">${cols[i]}</text>`;for(let j=0;j<12;j++)svg+=`<text x="14" y="${j*100+56}" fill="#6e6385" font-size="16" font-family="Arial">${rows[j]}</text>`;
 const RC={'Mount Kalaga':'#3f6b4f','Port Gellhorn':'#7a5a3a','Ambrosia':'#6b5a2f','Vice City':'#7b3b66','Grassrivers':'#2f6a5a','Leonida Keys':'#2f5f7a'};
 H.regions.forEach(([n,c,r,sq])=>{const rx=n==='Leonida Keys'?170:(n==='Port Gellhorn'||n==='Ambrosia'?95:120),ry=n==='Leonida Keys'?62:80;svg+=`<ellipse cx="${cx(c)}" cy="${cy(r)}" rx="${rx}" ry="${ry}" fill="${RC[n]}" fill-opacity=".55" stroke="#fff9cb" stroke-opacity=".35"/><text x="${cx(c)}" y="${cy(r)-ry-26}" fill="#fff9cb" font-size="24" font-weight="700" text-anchor="middle" font-family="Arial Narrow,Arial">${n.toUpperCase()}</text><text x="${cx(c)}" y="${cy(r)-ry-8}" fill="#e7d6ff" font-size="14" text-anchor="middle" font-family="Arial">Grid ${sq}</text>`});
 svg+='</svg>';L.imageOverlay('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),bounds,{alt:'Schematic grid map of Leonida regions'}).addTo(map);map.fitBounds(bounds);map.setMaxBounds(bounds.pad(.2));
 const CAT={weapon:['#ffb2c6','Weapons'],car:['#ffdf9e','Cars'],secret:['#c9a7ff','Secrets'],store:['#9be3c3','Stores'],money:['#ffd4a8','Money'],wildlife:['#8fd3ff','Wildlife'],collectible:['#ffffff','Collectibles']};
 const reg=Object.fromEntries(H.regions.map(r=>[r[0],r]));const per={};const on=Object.fromEntries(Object.keys(CAT).map(k=>[k,true]));
 const mk=H.pins.map((p,i)=>{const r=reg[p.r],n=per[p.r]=(per[p.r]||0)+1,ang=n*2.399,rad=Math.min(1,Math.sqrt(n)/3.4);const sx=r[0]==='Leonida Keys'?150:(r[0]==='Port Gellhorn'||r[0]==='Ambrosia'?78:100),sy=r[0]==='Leonida Keys'?48:64;const m=L.circleMarker(toLL(cx(r[1])+Math.cos(ang)*rad*sx,cy(r[2])+Math.sin(ang)*rad*sy),{radius:7,color:'#160d20',weight:2,fillColor:CAT[p.c][0],fillOpacity:1});
  m.bindPopup(`<b>${esc(p.n)}</b><br><small>${esc(CAT[p.c][1])} · ${esc(p.r)} · ${esc(p.st)}</small><p>${esc(p.d)}</p><small>Source: ${srcLink(p.src)}</small>`);m.addTo(map);return{m,p,i}});
 $('#pin-filters').innerHTML=Object.entries(CAT).map(([k,[c,l]])=>`<button type="button" class="on" data-c="${k}" aria-pressed="true"><i style="background:${c}"></i>${l} <small>${H.pins.filter(p=>p.c===k).length}</small></button>`).join('');
 const draw=()=>{const q=$('#pin-q').value.trim().toLowerCase();const vis=mk.filter(({p})=>on[p.c]&&(!q||(p.n+' '+p.d+' '+p.r).toLowerCase().includes(q)));mk.forEach(o=>{const v=vis.includes(o);if(v&&!map.hasLayer(o.m))o.m.addTo(map);if(!v&&map.hasLayer(o.m))map.removeLayer(o.m)});
  $('#pin-list').innerHTML=vis.map(({p,i})=>`<li><button type="button" data-i="${i}"><i style="background:${CAT[p.c][0]}"></i><span><b>${esc(p.n)}</b><small>${esc(p.r)}${p.st!=='verified'?' · '+esc(p.st):''}</small></span></button></li>`).join('')||'<li class="hint">No pins match.</li>';
  $$('#pin-list button').forEach(b=>b.onclick=()=>{const o=mk[+b.dataset.i];map.setView(o.m.getLatLng(),1);o.m.openPopup()})};
 $$('#pin-filters button').forEach(b=>b.onclick=()=>{on[b.dataset.c]=!on[b.dataset.c];b.classList.toggle('on');b.setAttribute('aria-pressed',on[b.dataset.c]);draw()});$('#pin-q').addEventListener('input',draw);draw()}
// ---- reveal
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06});
 $$('.db-head,.db-card,.card,.hcard,.qa,.news-row,.dlc-row,.money-item,.gallery figure,.alert,.tips,.chapters details,.tl,.stat,.fcols>div').forEach(el=>{if(el.closest('.reveal'))return;const sib=[...el.parentElement.children].indexOf(el)%4;el.style.setProperty('--d',sib*70+'ms');el.classList.add('reveal');io.observe(el)})}
})();
