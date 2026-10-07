/* Shared learning engine; no storage writes and no network dependency. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.WolofLearning=api;})(typeof window!=='undefined'?window:globalThis,function(){
 const normalize=s=>String(s??'').normalize('NFC').toLowerCase().trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
 const vowels=s=>s.replace(/[àéëó]/g,c=>({'à':'a','é':'e','ë':'e','ó':'o'}[c]));
 function distance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=0;i<a.length;i++){let next=[i+1];for(let j=0;j<b.length;j++)next[j+1]=Math.min(next[j]+1,row[j+1]+1,row[j]+(a[i]===b[j]?0:1));row=next;}return row[b.length];}
 function grade(given,answers,lexicon=[]){
  const g=normalize(given), candidates=answers.map(normalize).filter(Boolean);
  if(candidates.includes(g))return {credit:1,feedback:'Forma corretta.'};
  if(lexicon.some(w=>normalize(w.wolof)===g))return {credit:0,feedback:'Hai scritto un’altra voce del vocabolario. Controlla il significato richiesto.'};
  const target=candidates.reduce((a,b)=>distance(g,b)<distance(g,a)?b:a,candidates[0]||'');
  if(!g||!target)return {credit:0,feedback:'Scrivi la forma proposta nella correzione.'};
  if(vowels(g)===vowels(target)){
   const notes=[];for(const [letter,plain,hint] of [['ë','e','ë indica una vocale diversa da e'],['é','e','é ed e rappresentano vocali diverse'],['ó','o','ó ed o rappresentano vocali diverse'],['à','a','à va mantenuta nella forma scritta']])if(target.includes(letter)&&g!==target&&g.includes(plain))notes.push(hint);
   return {credit:.5,feedback:`Significato riconosciuto, ortografia da migliorare: ${notes.join('; ')}. Copia e ripeti: ${target}.`};
  }
  // A single insertion/deletion can affect vowel length or a doubled consonant.
  if(target.length>=5&&!/[\/…]/.test(target)&&distance(g,target)===1){
   return {credit:.5,feedback:`Una lettera da correggere. Confronta “${g}” con “${target}”: controlla lettere mancanti, vocali lunghe e consonanti doppie. Sono importanti in Wolof.`};
  }
  return {credit:0,feedback:`La forma attesa è “${target}”. Controlla l'intera parola, non solo gli accenti.`};
 }
 function enrich(data,packs=[]){
  const ids=new Set(data.lexicon.map(w=>w.id));
  for(const pack of packs){if(pack.schemaVersion!==1||!Array.isArray(pack.entries))throw Error('Pacchetto lessicale non valido');for(const w of pack.entries){if(ids.has(w.id)||!w.id||!w.wolof||!w.italian||!data.modules.some(m=>m.id===w.category)||!data.sources.some(s=>s.id===w.source))throw Error('Voce duplicata o riferimenti non validi: '+w.id);ids.add(w.id);data.lexicon.push({...w});}}
  data.schemaVersion=1;
  if(data.validationPolicy?.required){const candidates=data.lexicon;data.lexicon=candidates.filter(isValidated);data.validationPolicy.runtimeExcluded=candidates.length-data.lexicon.length;}
  data.lexicon=data.lexicon.map(w=>({...w,lemma:w.lemma||w.wolof,pos:w.pos||null,level:w.level||null,frequency:w.frequency??null,tags:w.tags||[w.category],meanings:w.meanings||[w.italian],variants:w.variants||[],examples:w.examples||[],orthography:w.orthography||{canonical:w.wolof,note:w.note||''},provenance:w.provenance||[{sourceId:w.source,ref:w.ref||'',status:'legacy'}]}));
  if(!data.validationPolicy?.required)for(const w of data.lexicon.filter(w=>w.kind!=='phrase'))if(!w.examples.length)w.examples=data.lexicon.filter(p=>p.kind==='phrase'&&normalize(p.wolof).split(/\s+/).includes(normalize(w.wolof))).slice(0,3).map(p=>({wolof:p.wolof,italian:p.italian,sourceId:p.source,ref:p.ref}));
  for(const m of data.modules){const entries=data.lexicon.filter(w=>w.category===m.id);m.wordCount=entries.filter(w=>w.kind!=='phrase').length;m.phraseCount=entries.filter(w=>w.kind==='phrase').length;}
  return data;
 }
 function isValidated(w){
  const v=w.validation;if(v?.status!=='verified'||!v.approved||!/^[a-f0-9]{64}$/.test(v.binding||'')||!v.evidence?.length)return false;
  for(const k of ['id','wolof','italian','kind','category','senseLabel','variants','examples','meanings','pos','note','orthography'])if(JSON.stringify(w[k]??null)!==JSON.stringify(v.approved[k]??null))return false;
  return v.evidence.some(e=>{try{return ['lgidf.cnrs.fr','files.peacecorps.gov','www.llacan.cnrs.fr'].includes(new URL(e.url).hostname)&&e.sourceMeaning&&e.locator&&normalize(e.sourceForm)===normalize(w.wolof);}catch{return false;}});
 }
 function formats(w){return w.kind!=='phrase'?['w2it','it2w','typing',...(w.examples.length?['context']:[])]:['w2it','it2w','cloze','reorder',...(!/[\/…]/.test(w.wolof)?['phraseTyping']:[])];}
 function chooseFormat(w,history,recent=[]){const available=formats(w);return available.find(x=>x!==history?.lastFormat&&!recent.slice(-2).includes(x))||available.find(x=>x!==history?.lastFormat)||available[0];}
 function insight(w,number){return number===1?{title:'Una parola, un significato',text:`${w.wolof} — ${w.italian}. ${w.note||w.orthography.note||'Prova a richiamare il significato prima di continuare.'}`}:{title:'Un dettaglio di scrittura',text:w.orthography.note||`Osserva la forma “${w.wolof}”. In Wolof ë, é e ó distinguono vocali; le vocali lunghe e le consonanti doppie vanno mantenute.`,};}
 return {normalize,grade,enrich,isValidated,formats,chooseFormat,insight};
});
