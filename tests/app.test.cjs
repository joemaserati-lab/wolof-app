const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function boot(saved){
 const nodes=new Map(),store={'njang-wolof-v2':JSON.stringify(saved)};
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},focus(){},setAttribute(){},innerHTML:''});return nodes.get(id);};
 const document={querySelector:node,querySelectorAll:()=>[]};
 const ctx={window:{scrollTo(){},addEventListener(){}},document,navigator:{onLine:true},location:{protocol:'file:'},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},setTimeout(){},clearTimeout(){},confirm:()=>false,console,URL};
 vm.createContext(ctx);for(const file of ['data.js','learning.js','lexicon-packs.js'])vm.runInContext(fs.readFileSync(__dirname+'/../site/'+file,'utf8'),ctx);
 let app=fs.readFileSync(__dirname+'/../site/app.js','utf8');app=app.replace(" $('#hamb').onclick", " window.testAPI={buildQuestions,makeWordQ,startModule,startMixed,launch,next,check,wordById,getState:()=>S,getQuiz:()=>quiz};\n $('#hamb').onclick");vm.runInContext(app,ctx);
 return {api:ctx.window.testAPI,data:ctx.window.WOLOF_DATA,node,store};
}
const legacy={xp:120,streak:4,lastStudy:'2026-10-06',answered:10,correct:7,wordStats:{w071:{seen:2,correct:1}},moduleBest:{saluti:80},sessions:1};
test('legacy progress survives load and partial grading round trip',()=>{
 const {api,node,store}=boot(legacy),w=api.wordById('w071');assert.equal(api.getState().xp,120);assert.equal(api.getState().credit,7);
 api.launch('Test','mixed',[{type:'typing',kind:'word',wordId:w.id,answer:w.wolof,answers:[w.wolof],explanation:'',format:'typing',source:w.source}]);node('#typed').value='becceg';api.check();api.check();
 const s=JSON.parse(store['njang-wolof-v2']);assert.equal(s.xp,126);assert.equal(s.answered,11);assert.equal(s.correct,7);assert.equal(s.credit,7.5);assert.equal(s.wordStats.w071.correct,1);assert.equal(s.wordStats.w071.partial,1);assert.equal(s.moduleBest.saluti,80);
 assert.match(node('#feedback').innerHTML,/½ punto/);api.next();assert.equal(api.getState().sessions,2);
 assert.equal(boot(JSON.parse(store['njang-wolof-v2'])).api.getState().credit,7.5);
});
test('all module sessions contain 10 valid questions and two unscored interludes',()=>{
 const {api,node,data}=boot(legacy);
 for(const m of data.modules){const qs=api.buildQuestions(m.id);assert.equal(qs.length,10);const ids=qs.map(q=>q.wordId).filter(Boolean);assert.equal(new Set(ids).size,Math.min(10,data.lexicon.filter(w=>w.category===m.id).length));assert.ok(new Set(qs.map(q=>q.format)).size>=3);for(const q of qs){assert.ok(q.answer);assert.ok(q.prompt);assert.ok(q.wordId?api.wordById(q.wordId).category===m.id:q.category===m.id);if(q.type==='choice'){assert.equal(q.options.length,4);assert.ok(q.options.includes(q.answer));}else assert.ok(q.answers.includes(q.answer));}
 api.startModule(m.id);for(let i=1;i<=10;i++){api.next();if(i===3||i===7){assert.match(node('#view').innerHTML,new RegExp('Pausa '+(i===3?1:2)+'/2'));node('#resume').onclick();}}}
});
test('known different lexical answer is not a spelling near miss',()=>{
 const {api,node}=boot(legacy);api.launch('Test','mixed',[{type:'typing',kind:'word',answer:'bëccëg',answers:['bëccëg'],explanation:''}]);node('#typed').value='ngoon';api.check();assert.equal(api.getQuiz().score,0);
});
test('every expanded entry generates valid questions in every supported format',()=>{
 const {api,data}=boot(legacy),L=require('../site/learning.js');
 for(const w of data.lexicon)for(const format of L.formats(w)){
  const q=api.makeWordQ(w,4,format);assert.ok(q.prompt&&q.answer,w.id+' '+format);
  if(q.type==='choice'){assert.equal(q.options.length,4,w.id+' '+format);assert.equal(new Set(q.options.map(L.normalize)).size,4);assert.ok(q.options.includes(q.answer));}
  else assert.ok(q.answers.includes(q.answer));
  if(format==='context')assert.match(q.prompt,/____/);
 }
});
test('polysemous vocabulary always has a sense cue in translation questions',()=>{
 const {api,data}=boot(legacy);
 for(const id of ['muus-noun-cat','muus-quality-clever','w138','w186']){const w=api.wordById(id);assert.ok(w);const q=api.makeWordQ(w,0,'w2it');assert.ok(q.prompt.includes(w.senseLabel));assert.equal(q.answer,w.italian);}
 const choices=api.buildQuestions(null);assert.ok(choices.every(q=>data.lexicon.some(w=>w.id===q.wordId)));assert.ok(choices.every(q=>q.kind!=='pattern'&&q.kind!=='dialogue'));
});
