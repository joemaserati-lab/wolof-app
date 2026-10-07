
(()=>{
 const L=window.WolofLearning;
 const D=L.enrich(window.WOLOF_DATA,window.WOLOF_PACKS||[]), KEY='njang-wolof-v2';
 const oldKey='njang-wolof-progress-v1';
 const empty={xp:0,streak:0,lastStudy:null,answered:0,correct:0,wordStats:{},moduleBest:{},sessions:0,partial:0,credit:0};
 let S=load(), quiz=null, vocabPage=0;
 const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>[...e.querySelectorAll(s)];
 function load(){try{let n=JSON.parse(localStorage.getItem(KEY));if(n)return {...empty,...n,wordStats:n.wordStats||{},moduleBest:n.moduleBest||{},credit:n.credit??n.correct??0};let o=JSON.parse(localStorage.getItem(oldKey));if(o)return {...empty,xp:o.xp||0,streak:o.streak||0,lastStudy:o.lastStudy||null};}catch(e){}return {...empty}}
 function save(){localStorage.setItem(KEY,JSON.stringify(S));header()}
 function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
 function norm(s){return String(s).normalize('NFC').toLowerCase().trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ')}
 function ipa(text){
  let s=String(text??'').normalize('NFC').toLowerCase();
  const multi=[
   ['ée','eː'],['ëe','əː'],['aa','aː'],['ee','ɛː'],['ii','iː'],['oo','ɔː'],['óo','oː'],['uu','uː'],
   ['ññ','ɲː'],['ŋŋ','ŋː'],['bb','bː'],['cc','cː'],['dd','dː'],['ff','fː'],['gg','ɡː'],['jj','ɟː'],['kk','kː'],['ll','lː'],['mm','mː'],['nn','nː'],['pp','pː'],['rr','rː'],['ss','sː'],['tt','tː'],['ww','wː'],['yy','jː'],
   ['mb','mb'],['nc','ɲc'],['nd','nd'],['ng','ŋɡ'],['nj','ɲɟ'],['nk','ŋk'],['nq','ɴq'],['nt','nt'],['ch','ʃ'],['jh','ʒ']
  ];
  const singles={a:'a','à':'aː',b:'b',c:'c',d:'d',e:'ɛ','é':'e','ë':'ə',f:'f',g:'ɡ',h:'h',i:'i',j:'ɟ',k:'k',l:'l',m:'m',n:'n','ñ':'ɲ','ŋ':'ŋ',o:'ɔ','ó':'o',p:'p',q:'q',r:'r',s:'s',t:'t',u:'u',v:'v',w:'w',x:'x',y:'j',z:'z'};
  let out='',i=0;
  while(i<s.length){
   let hit=false;
   for(const [a,b] of multi){if(s.startsWith(a,i)){out+=b;i+=a.length;hit=true;break}}
   if(hit)continue;
   out+=singles[s[i]]??s[i];i++;
  }
  return out.replace(/\s+/g,' ').trim();
 }
 function shuffle(a){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out}
 function src(id){return D.sources.find(x=>x.id===id)}
 function learnedCount(){return D.lexicon.filter(w=>isLearned(w.id)).length}
 function isLearned(id){let x=S.wordStats[id];return !!x&&x.correct>=3&&x.correct/Math.max(1,x.seen)>=.7}
 function mastery(id){let arr=D.lexicon.filter(x=>x.category===id);if(!arr.length)return 0;let pts=arr.reduce((a,w)=>a+(isLearned(w.id)?1:Math.min(1,(S.wordStats[w.id]?.correct||0)/3)),0);return Math.round(pts/arr.length*100)}
 function dateKey(){return new Date().toISOString().slice(0,10)}
 function touch(){let t=dateKey();if(S.lastStudy!==t){if(S.lastStudy){let d=Math.round((new Date(t)-new Date(S.lastStudy))/86400000);S.streak=d===1?(S.streak||0)+1:1}else S.streak=1;S.lastStudy=t}}
 function header(){$('#learnedTop').textContent=learnedCount();$('#xpTop').textContent=S.xp||0;$('#sideCount').textContent=`${D.lexicon.length} voci`}
 function title(k,t){$('#pageKicker').textContent=k;$('#pageTitle').textContent=t}
 function active(r){$$('[data-route]').forEach(b=>{if(b.closest('.side')||b.closest('.mobile-nav'))b.classList.toggle('active',b.dataset.route===r)})}
 function routes(){$$('[data-route]').forEach(b=>b.onclick=e=>{e.preventDefault();go(b.dataset.route)})}
 function go(r){active(r);$('#side').classList.remove('open');$('#mobileBackdrop')?.classList.remove('show');if(r==='home')home();if(r==='vocab')vocab();if(r==='practice')practice();if(r==='progress')progress();if(r==='sources')sources();window.scrollTo({top:0,behavior:'smooth'});$('#view').focus({preventScroll:true})}
 function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove('show'),2000)}
 function home(){title('IMPARA','Da dove ripartiamo?');let l=learnedCount(),pct=Math.round(l/D.lexicon.length*100);$('#view').innerHTML=`
 <section class="hero"><div class="hero-copy"><div class="kicker">OGGI IN WOLOF</div><h1>Parliamo un po' in Wolof?</h1><p>Questa versione sposta il corso sulla comprensione e sull’uso: lessico per situazioni reali, frasi complete, riconoscimento rapido e produzione. La grammatica compare quando serve a costruire una frase utile.</p><div class="hero-actions"><button class="btn btn-yellow" id="continue">Continua →</button><button class="btn btn-ghost" data-route="vocab">Apri il vocabolario</button></div></div><div class="hero-stat"><small>LESSICO CONSOLIDATO</small><strong>${l} / ${D.lexicon.length}</strong><div class="bar"><i style="width:${pct}%"></i></div><p>Una voce è consolidata dopo almeno 3 risposte corrette con ≥70% di precisione.</p></div></section>
 <section class="strategy"><article class="mini-card"><b>≈80%</b><p>Quiz centrati su vocaboli e frasi ad alta utilità.</p></article><article class="mini-card"><b>10 aree</b><p>Dal saluto al mercato, dalle direzioni alla salute.</p></article><article class="mini-card"><b>${D.sources.length} fonti</b><p>Peace Corps, CNRS/LLACAN, UCLA e norma senegalese dichiarate nell’app.</p></article></section>
 <div class="section-head"><div><div class="kicker">PERCORSO</div><h2>Cosa vuoi saper dire?</h2></div><p>${D.lexicon.filter(x=>x.kind==='phrase').length} frasi complete nel corpus</p></div>
 <section class="modules">${D.modules.map(m=>{let p=mastery(m.id);return `<article class="module"><div class="mod-icon">${esc(m.icon)}</div><div><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p><div class="tags"><span class="tag">${esc(m.level)}</span><span class="tag">${m.wordCount} voci</span><span class="tag">${m.phraseCount} frasi</span></div></div><div class="module-side"><strong>${p}%</strong><small>progresso</small><button class="btn btn-white" data-start="${m.id}">${p?'Continua':'Inizia'}</button></div></article>`}).join('')}</section>
 <div class="section-head"><div><div class="kicker">CRITERIO DIDATTICO</div><h2>La grammatica resta, ma cambia ruolo</h2></div></div><div class="notice"><span class="notice-icon">★</span><div><b>Regole dentro frasi che useresti davvero.</b><p>Invece di chiederti di memorizzare etichette grammaticali, il corso ti fa usare modelli come “Dama bëgg …”, “Ñaata la?”, “Mënuma …” o “Sama … dafay metti”. La spiegazione arriva dopo la risposta.</p></div></div>`;
 routes();$$('[data-start]').forEach(b=>b.onclick=()=>startModule(b.dataset.start));$('#continue').onclick=()=>{let m=D.modules.find(x=>mastery(x.id)<70)||D.modules[0];startModule(m.id)}
 }
 function vocab(){title('VOCABOLARIO','Cerca, filtra e ripassa il corpus');vocabPage=0;renderVocab()}
 function renderVocab(){let existingQ=$('#vsearch')?.value||'', existingC=$('#vcat')?.value||'all', existingS=$('#vsource')?.value||'all';$('#view').innerHTML=`
 <div class="section-head" style="margin-top:0"><div><div class="kicker">DIZIONARIO LOCALE</div><h2>${D.lexicon.length} voci e frasi disponibili offline</h2></div><p>La fonte compare su ogni scheda</p></div>
 <div class="filters"><input class="search" id="vsearch" placeholder="Cerca in wolof o italiano…" value="${esc(existingQ)}"><select class="select" id="vcat"><option value="all">Tutte le aree</option>${D.modules.map(m=>`<option value="${m.id}" ${existingC===m.id?'selected':''}>${esc(m.title)}</option>`).join('')}</select><select class="select" id="vsource"><option value="all">Tutte le fonti</option>${D.sources.map(s=>`<option value="${s.id}" ${existingS===s.id?'selected':''}>${esc(s.id)}</option>`).join('')}</select></div><div id="vcontent"></div>`;
 $('#vsearch').oninput=()=>{vocabPage=0;drawWords()};$('#vcat').onchange=()=>{vocabPage=0;drawWords()};$('#vsource').onchange=()=>{vocabPage=0;drawWords()};drawWords()
 }
 function drawWords(){let q=norm($('#vsearch').value),c=$('#vcat').value,s=$('#vsource').value;let arr=D.lexicon.filter(w=>(c==='all'||w.category===c)&&(s==='all'||w.source===s)&&(!q||norm(w.wolof).includes(q)||norm(w.italian).includes(q)||w.variants.some(v=>norm(v).includes(q))||w.tags.some(t=>norm(t).includes(q))));let per=36,pages=Math.max(1,Math.ceil(arr.length/per));vocabPage=Math.min(vocabPage,pages-1);let slice=arr.slice(vocabPage*per,(vocabPage+1)*per);$('#vcontent').innerHTML=`<div class="vocab-meta"><span>${arr.length} risultati</span><span>pagina ${vocabPage+1}/${pages}</span></div>${slice.length?`<section class="vocab-grid">${slice.map(w=>`<article class="word-card ${isLearned(w.id)?'learned':''}"><span class="source">${esc(w.source)}</span><div class="wolof">${esc(w.wolof)}</div><div class="ipa">/${esc(ipa(w.wolof))}/</div><div class="it">${esc(w.meanings.join("; "))}</div>${w.pos?`<small>${esc(w.pos)}</small>`:""}${w.examples[0]?`<details><summary>Esempio</summary><p>${esc(w.examples[0].wolof)}<br>${esc(w.examples[0].italian)}</p></details>`:""}${w.orthography.note?`<p>${esc(w.orthography.note)}</p>`:""}<footer><span>${esc(D.modules.find(m=>m.id===w.category)?.title||w.category)}</span><span>${isLearned(w.id)?'<span class="learn-dot">✓ consolidata</span>':esc(w.ref||'')}</span></footer></article>`).join('')}</section>`:'<div class="empty">Nessuna voce trovata.</div>'}<div class="pager"><button class="btn btn-white" id="prev" ${vocabPage===0?'disabled':''}>←</button><button class="btn btn-white" id="next" ${vocabPage>=pages-1?'disabled':''}>→</button></div>`;$('#prev').onclick=()=>{if(vocabPage>0){vocabPage--;drawWords()}};$('#next').onclick=()=>{if(vocabPage<pages-1){vocabPage++;drawWords()}}
 }
 function practice(){title('FAI PRATICA','Cosa vuoi allenare?');let weak=D.lexicon.filter(w=>!isLearned(w.id)).length;$('#view').innerHTML=`<section class="practice-grid"><article class="panel practice-hero"><div class="kicker">SESSIONE RAPIDA</div><h2>10 domande e 2 pause per imparare.</h2><p>Traduzione, completamento, ordine della frase, conversazioni e situazioni reali ruotano nella stessa sessione. Le parole tornano, ma non con la stessa domanda. Tutto resta locale e offline.</p><button class="btn btn-yellow" id="mixed">Comincia</button></article><article class="panel"><div class="kicker">DA CONSOLIDARE</div><div style="font-size:44px;font-weight:950;letter-spacing:-.06em;margin:8px 0">${weak}</div><p style="color:var(--muted);font-size:13px">voci non ancora alla soglia di consolidamento.</p></article></section><div class="section-head"><div><div class="kicker">AREE</div><h2>Allenamento per situazione</h2></div></div><div class="practice-options">${D.modules.map(m=>`<button class="practice-option" data-start="${m.id}"><span><b>${esc(m.title)}</b><br><small>${esc(m.goal)}</small></span><span>${mastery(m.id)}% →</span></button>`).join('')}</div>`;$('#mixed').onclick=startMixed;$$('[data-start]').forEach(b=>b.onclick=()=>startModule(b.dataset.start))}
 function progress(){title('PROGRESSI','Come stai andando?');let acc=S.answered?Math.round(S.correct/S.answered*100):0;$('#view').innerHTML=`<section class="stat-grid"><article class="stat"><span>VOCABOLI CONSOLIDATI</span><strong>${learnedCount()}</strong></article><article class="stat"><span>PRECISIONE</span><strong>${acc}%</strong></article><article class="stat"><span>XP</span><strong>${S.xp}</strong></article><article class="stat"><span>SESSIONI</span><strong>${S.sessions}</strong></article></section><div class="section-head"><div><div class="kicker">PROGRESSO</div><h2>Per area lessicale</h2></div></div><section class="panel"><div class="progress-list">${D.modules.map(m=>`<div class="prow"><b>${esc(m.title)}</b><div class="meter"><i style="width:${mastery(m.id)}%"></i></div><span>${mastery(m.id)}%</span></div>`).join('')}</div></section><div class="section-head"><div><div class="kicker">PRIVACY</div><h2>Il profilo resta sul dispositivo</h2></div></div><div class="notice"><span class="notice-icon">⌂</span><div><b>Nessun account e nessun tracking.</b><p>Risposte, XP e statistiche sono salvati nel localStorage del browser. Il corso continua a funzionare senza rete dopo l’installazione PWA.</p></div></div><div style="margin-top:14px"><button class="btn btn-red" id="reset">Azzera i progressi</button></div>`;$('#reset').onclick=()=>{if(confirm('Azzerare i progressi locali?')){S={...empty};save();progress();toast('Progressi azzerati')}}}
 function sources(){title('FONTI','Corpus tracciabile e limiti dichiarati');$('#view').innerHTML=`<div class="notice"><span class="notice-icon">i</span><div><b>Gerarchia delle fonti.</b><p>Il corpus operativo privilegia Peace Corps Senegal e Peace Corps Mauritania per la lingua situazionale; CNRS/LGIDF amplia e controlla il lessico. UCLA, LLACAN e la norma senegalese sono riferimenti accademici/normativi. I link esterni richiedono connessione, ma il corso no. L’IPA mostrato nell’app è una trascrizione fonemica ampia derivata dall’ortografia standard Wolof: è pensato come guida coerente e scalabile, non come registrazione fonetica fine di ogni variante regionale.</p></div></div><div class="section-head"><div><div class="kicker">BIBLIOGRAFIA</div><h2>${D.sources.length} riferimenti dichiarati</h2></div></div><section class="sources">${D.sources.map(s=>`<article class="source-card"><span class="type">${esc(s.type)}</span><h3>${esc(s.name)}</h3><span class="usage">${esc(s.usage)}</span><p><b>${esc(s.publisher)}</b><br>${esc(s.note)}</p><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a></article>`).join('')}</section>`}
 function weightedWords(cat){let arr=D.lexicon.filter(w=>!cat||w.category===cat);return arr.sort((a,b)=>{let A=S.wordStats[a.id]||{seen:0,correct:0},B=S.wordStats[b.id]||{seen:0,correct:0};let sa=(A.correct/Math.max(1,A.seen))+A.seen*.03,sb=(B.correct/Math.max(1,B.seen))+B.seen*.03;return sa-sb+Math.random()*.25})}
 function wordById(id){return D.lexicon.find(w=>w.id===id)}
 function choiceSet(correct,values){let seen=new Set([norm(correct)]),out=[];for(const v of values){if(!v)continue;let n=norm(v);if(!seen.has(n)){seen.add(n);out.push(v)}if(out.length===3)break}return shuffle([correct,...out])}
 function makeWordQ(w,i,mode){
  mode=mode||(['w2it','it2w','typing'][i%3]);
  if(mode==='typing'||mode==='phraseTyping')return {id:'q-'+w.id+'-'+i,type:'typing',kind:'word',wordId:w.id,prompt:`Scrivi in wolof: “${w.italian}”`,answer:w.wolof,answers:[w.wolof,...(w.variants||[])],source:w.source,ref:w.ref,explanation:`Forma del corpus: ${w.wolof}. IPA /${ipa(w.wolof)}/.`};
  if(mode==='cloze')return makeClozeQ(w,i);
  if(mode==='reorder')return makeReorderQ(w,i);
  if(mode==='context'){let ex=w.examples[i%w.examples.length];return {id:'context-'+w.id+'-'+i,type:'typing',kind:'cloze',wordId:w.id,prompt:`Completa: ${ex.wolof.replace(new RegExp('(^|\\s)'+w.wolof+'(?=\\s|[.!?]|$)','i'),'$1____')} — ${ex.italian}`,answer:w.wolof,answers:[w.wolof,...w.variants],source:ex.sourceId,ref:ex.ref,explanation:`${ex.wolof} — ${ex.italian}`};}
  let direction=mode==='it2w'?'it2w':'w2it',correct=direction==='it2w'?w.wolof:w.italian;
  let same=shuffle(D.lexicon.filter(x=>x.id!==w.id&&x.kind===w.kind&&x.category===w.category));
  let more=shuffle(D.lexicon.filter(x=>x.id!==w.id&&x.kind===w.kind&&x.category!==w.category));
  let values=choiceSet(correct,[...same,...more].map(x=>direction==='it2w'?x.wolof:x.italian));
  if(direction==='it2w')return {id:'q-'+w.id+'-'+i,type:'choice',kind:'word',wordId:w.id,prompt:`Come si dice “${w.italian}” in wolof?`,answer:w.wolof,options:values,source:w.source,ref:w.ref,explanation:`${w.wolof} = ${w.italian}. IPA /${ipa(w.wolof)}/.`};
  return {id:'q-'+w.id+'-'+i,type:'choice',kind:'word',wordId:w.id,prompt:`Che cosa significa “${w.wolof}”?`,ipa:ipa(w.wolof),answer:w.italian,options:values,source:w.source,ref:w.ref,explanation:`${w.wolof} = ${w.italian}. IPA /${ipa(w.wolof)}/.`}
 }
 function phraseTokens(t){return String(t).trim().split(/\s+/)}
 function makeClozeQ(w,i){
  let toks=phraseTokens(w.wolof),eligible=toks.map((t,n)=>({t,n,core:t.replace(/^[^A-Za-zÀ-ÿÑñŊŋËëÉé]+|[^A-Za-zÀ-ÿÑñŊŋËëÉé]+$/g,'')})).filter(x=>x.core.length>=2&&!x.core.includes('…'));
  if(eligible.length<2)return makeWordQ(w,i,'w2it');
  let pick=eligible[(i+eligible.length)%eligible.length],answer=pick.core;
  let shown=toks.map((t,n)=>n===pick.n?t.replace(answer,'____'):t).join(' ');
  let pool=D.lexicon.filter(x=>x.category===w.category&&x.kind==='phrase'&&x.id!==w.id).flatMap(x=>phraseTokens(x.wolof)).map(t=>t.replace(/^[^A-Za-zÀ-ÿÑñŊŋËëÉé]+|[^A-Za-zÀ-ÿÑñŊŋËëÉé]+$/g,'')).filter(x=>x.length>=2);
  let options=choiceSet(answer,shuffle(pool));
  if(options.length<4)return makeWordQ(w,i,'w2it');
  return {id:'cloze-'+w.id+'-'+i,type:'choice',kind:'cloze',wordId:w.id,prompt:`Completa la frase: ${shown}`,answer,options,source:w.source,ref:w.ref,explanation:`Frase completa: ${w.wolof} — ${w.italian}. IPA /${ipa(w.wolof)}/.`}
 }
 function makeReorderQ(w,i){
  let toks=phraseTokens(w.wolof);
  if(toks.length<3||toks.length>7||/[\/…]/.test(w.wolof))return makeClozeQ(w,i);
  let correct=w.wolof,variants=[],base=[...toks];
  for(let n=0;n<6&&variants.length<3;n++){
   let a=[...base],x=(n+1)%(a.length-1),tmp=a[x];a[x]=a[x+1];a[x+1]=tmp;
   if(n%2===1)a=[...a.slice(1),a[0]];
   let v=a.join(' ');if(norm(v)!==norm(correct)&&!variants.some(z=>norm(z)===norm(v)))variants.push(v)
  }
  if(variants.length<3)return makeClozeQ(w,i);
  return {id:'reorder-'+w.id+'-'+i,type:'choice',kind:'reorder',wordId:w.id,prompt:'Qual è l’ordine corretto della frase?',answer:correct,options:shuffle([correct,...variants]),source:w.source,ref:w.ref,explanation:`Ordine del corpus: ${w.wolof} — ${w.italian}. IPA /${ipa(w.wolof)}/.`}
 }
 function dialogueBank(){
  const defs=[
   ['saluti','A: Salaamaalekum\nB: ____',['w002','w005','w009','w015']],
   ['mercato','A: Am nga …?\nB: ____',['w197','w201','w202','w200']],
   ['luoghi_direzioni','A: Sore na?\nB: ____',['w254','w255','w250','w252']],
   ['azioni','A: Fan nga jëm?\nB: ____',['w283','w278','w281','w280']]
  ];
  return defs.map(([category,prompt,ids])=>{let ans=wordById(ids[0]);return ans?{id:'dialog-'+category,type:'choice',kind:'dialogue',category,prompt,answer:ans.wolof,options:ids.map(id=>wordById(id)?.wolof).filter(Boolean),source:ans.source,ref:ans.ref,wordId:ans.id,explanation:`Risposta naturale nel contesto: ${ans.wolof} — ${ans.italian}. IPA /${ipa(ans.wolof)}/.`}:null}).filter(Boolean)
 }
 function buildQuestions(cat,count=10){
  const ws=weightedWords(cat),qs=[],recent=[];
  const words=ws.filter(w=>w.kind!=='phrase'),phrases=ws.filter(w=>w.kind==='phrase');
  const selected=[],used=new Set();
  for(let i=0;i<count;i++){let pool=i%3===2?phrases:words;let w=pool.find(w=>!used.has(w.id))||ws.find(w=>!used.has(w.id))||ws[i%ws.length];if(!w)break;selected.push(w);used.add(w.id);}
  selected.forEach((w,i)=>{const mode=L.chooseFormat(w,S.wordStats[w.id],recent),q=makeWordQ(w,i,mode);q.format=(q.kind==='cloze'&&mode!=='context')?'cloze':(q.kind==='reorder'?'reorder':mode);recent.push(q.format);qs.push(q);});
  const dialog=shuffle(dialogueBank().filter(q=>!cat||q.category===cat))[0];
  if(dialog){const index=qs.findIndex(q=>q.wordId===dialog.wordId);qs[index>=0?index:8]={...dialog,format:'dialogue',options:shuffle(dialog.options)};}
  const pattern=shuffle(D.patterns.filter(p=>!cat||p.category===cat))[0];
  if(pattern)qs[9]={...pattern,type:'choice',kind:'pattern',format:'pattern',options:shuffle(pattern.options)};
  return qs;
 }
 function startModule(id){let m=D.modules.find(x=>x.id===id);launch(m.title,id,buildQuestions(id,10))}
 function startMixed(){launch('Un po\' di tutto','mixed',buildQuestions(null,10))}
 function launch(label,id,questions){quiz={label,id,questions,index:0,score:0,full:0,partial:0,locked:false,answer:null};title('ESERCIZIO',label);renderQ()}
 function renderQ(){let q=quiz.questions[quiz.index],pct=Math.round(quiz.index/quiz.questions.length*100);let field=q.type==='typing'?`<input class="type-answer" id="typed" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Scrivi la risposta…">`:`<div class="options">${q.options.map((o,i)=>`<button class="option" data-answer="${esc(o)}"><i>${String.fromCharCode(65+i)}</i><span>${esc(o)}</span></button>`).join('')}</div>`;let meta={pattern:['situazione reale','Scegli la forma più utile nel contesto.'],cloze:['completa la frase','Recupera la parola dal contesto, non dalla traduzione.'],dialogue:['conversazione','Completa lo scambio con la risposta più naturale.'],reorder:['ordine della frase','Riconosci la sequenza corretta delle parole.'],word:['vocabolario','Richiamo attivo: forma, significato e pronuncia.']}[q.kind]||['esercizio','Richiamo attivo.'];$('#view').innerHTML=`<section class="quiz"><div class="qtop"><span>${quiz.index+1}/${quiz.questions.length}</span><div class="qbar"><i style="width:${pct}%"></i></div><span>${quiz.score} punti</span></div><article class="qcard"><span class="qtag">${meta[0]}</span><h2>${esc(q.prompt).replace(/\n/g,'<br>')}</h2>${q.ipa?`<div class="ipa-line">/${esc(q.ipa)}/</div>`:''}<div class="prompt-sub">${meta[1]}</div>${field}<div class="feedback" id="feedback"></div><div class="qactions"><button class="btn btn-white" id="quit">Esci</button><button class="btn btn-dark" id="check">Verifica</button></div></article></section>`;if(q.type==='choice')$$('.option').forEach(b=>b.onclick=()=>{if(quiz.locked)return;$$('.option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quiz.answer=b.dataset.answer});else{$('#typed').focus();$('#typed').onkeydown=e=>{if(e.key==='Enter')check()}};$('#quit').onclick=()=>go('home');$('#check').onclick=check}
 function check(){if(quiz.locked)return;let q=quiz.questions[quiz.index],given='',ok=false,result={credit:0,feedback:''};if(q.type==='choice'){if(!quiz.answer){toast('Seleziona una risposta');return}given=quiz.answer;ok=norm(given)===norm(q.answer);$$('.option').forEach(b=>{if(norm(b.dataset.answer)===norm(q.answer))b.classList.add('correct');else if(norm(b.dataset.answer)===norm(given))b.classList.add('wrong');b.disabled=true})}else{given=$('#typed').value;if(!given.trim()){toast('Scrivi una risposta');return}result=L.grade(given,q.answers||[q.answer],D.lexicon);ok=result.credit===1;$('#typed').disabled=true;$('#typed').style.borderColor=ok?'var(--green)':'var(--red)'}if(q.type==='choice')result={credit:ok?1:0,feedback:''};quiz.locked=true;quiz.score+=result.credit;if(ok)quiz.full++;if(result.credit===.5){quiz.partial++;S.partial=(S.partial||0)+1;}S.answered++;if(ok)S.correct++;S.credit=(S.credit||0)+result.credit;S.xp+=ok?12:result.credit===.5?6:3;touch();if(q.wordId){let w=S.wordStats[q.wordId]||{seen:0,correct:0};w.seen++;if(ok)w.correct++;w.credit=(w.credit??(w.correct-(ok?1:0)))+result.credit;if(result.credit===.5)w.partial=(w.partial||0)+1;w.lastFormat=q.format;S.wordStats[q.wordId]=w}save();let so=src(q.source);let f=$('#feedback');f.className='feedback show '+(ok?'ok':result.credit===.5?'partial':'no');f.setAttribute('role','status');f.innerHTML=`<b>${ok?'Giusto.':result.credit===.5?'Quasi: ½ punto':'Da rivedere'}</b>${esc(q.explanation)}${result.feedback?`<p>${esc(result.feedback)}</p>`:''}${!ok?`<div style="margin-top:5px"><b>Risposta:</b> ${esc(q.answer)}</div>`:''}<div class="fsource">Fonte: ${esc(so?.name||q.source)}${q.ref?' · '+esc(q.ref):''}</div>`;$('#check').textContent=quiz.index===quiz.questions.length-1?'Vedi risultato':'Continua';$('#check').onclick=next}
 function next(){quiz.index++;quiz.locked=false;quiz.answer=null;if(quiz.index>=quiz.questions.length)finish();else if(quiz.index===3||quiz.index===7)interlude();else renderQ()}
 function interlude(){const w=wordById(quiz.questions[quiz.index-1].wordId),n=quiz.index===3?1:2,info=L.insight(w,n);$('#view').innerHTML=`<section class="quiz"><article class="qcard"><span class="qtag">Pausa ${n}/2 · ${quiz.index}/10 domande</span><h2>${esc(info.title)}</h2><p class="insight">${esc(info.text)}</p>${w.examples[0]?`<p>${esc(w.examples[0].wolof)}<br>${esc(w.examples[0].italian)}</p>`:''}<p class="fsource">Fonte della voce: ${esc(src(w.source)?.name||w.source)} · ${esc(w.ref)}</p><button class="btn btn-yellow" id="resume">Continua con la domanda ${quiz.index+1}</button></article></section>`;$('#resume').onclick=renderQ;$('#resume').focus();}
 function finish(){let pct=Math.round(quiz.score/quiz.questions.length*100);S.sessions++;if(quiz.id!=='mixed')S.moduleBest[quiz.id]=Math.max(S.moduleBest[quiz.id]||0,pct);save();$('#view').innerHTML=`<section class="quiz"><article class="qcard results"><div class="kicker">SESSIONE COMPLETATA</div><h2>${esc(quiz.label)}</h2><p style="color:var(--muted)">${quiz.full} corrette · ${quiz.partial} parziali · ${quiz.score}/${quiz.questions.length} punti</p><div class="ring" style="--pct:${pct*3.6}deg"><b>${pct}%</b></div><p>${pct>=85?'Ottima ritenzione: il prossimo ripasso privilegerà altre voci.':pct>=65?'Base utile: ripassa ancora le voci sbagliate.':'Conviene ripetere questa area prima di aumentare il lessico.'}</p><div class="hero-actions" style="justify-content:center"><button class="btn btn-yellow" id="again">Continua</button><button class="btn btn-white" id="home">Rifai</button></div></article></section>`;$('#again').onclick=()=>go('home');$('#home').onclick=()=>quiz.id==='mixed'?startMixed():startModule(quiz.id)}
 $('#hamb').onclick=()=>{let o=$('#side').classList.toggle('open');$('#mobileBackdrop')?.classList.toggle('show',o)};$('#mobileBackdrop').onclick=()=>{$('#side').classList.remove('open');$('#mobileBackdrop').classList.remove('show')};routes();header();go('home');
 function online(){ $('#onlineLabel').textContent=navigator.onLine?'Pronto offline':'Modalità offline'} window.addEventListener('online',online);window.addEventListener('offline',online);online();
 if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
})();
