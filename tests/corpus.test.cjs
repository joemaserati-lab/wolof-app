const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../site/learning.js'),ctx={window:{}};
for(const name of ['data.js','lexicon-packs.js',...fs.readdirSync(__dirname+'/../site').filter(f=>/^lexicon-\d+\.js$/.test(f)).sort()])vm.runInNewContext(fs.readFileSync(__dirname+'/../site/'+name,'utf8'),ctx);
const D=L.enrich(ctx.window.WOLOF_DATA,ctx.window.WOLOF_PACKS);
const read=name=>JSON.parse(fs.readFileSync(__dirname+'/../'+name,'utf8'));
const candidates=read('corpus-candidates.json').lexicon,ledger=read('validation-ledger.json').records;
test('only approved institutional senses are published; quarantined IDs stay archived',()=>{
 const report=read('corpus-validation-report.json');assert.equal(D.lexicon.length,report.published);assert.ok(report.distinctLexicalForms>=500);assert.equal(candidates.length,654);assert.equal(report.published+report.quarantined,report.candidates);
 for(const w of D.lexicon){assert.ok(L.isValidated(w));assert.equal(ledger[w.id].status,'verified');assert.equal(ledger[w.id].binding,w.validation.binding);assert.ok(w.validation.evidence[0].sourceMeaning);}
 for(const w of candidates){assert.ok(ledger[w.id]);if(ledger[w.id].status!=='verified')assert.ok(!D.lexicon.some(e=>e.id===w.id));else assert.equal(D.lexicon.find(e=>e.id===w.id).wolof,w.wolof);}
 assert.equal(D.patterns.length,0);assert.equal(new Set(D.sources.map(s=>s.id)).size,D.sources.length);
});
test('muus has distinct reviewed cat and astute senses; generic intelligent is quarantined',()=>{
 const senses=D.lexicon.filter(w=>w.wolof==='muus');assert.equal(senses.length,2);
 assert.equal(senses.find(w=>w.id==='muus-noun-cat').italian,'gatto');
 assert.equal(senses.find(w=>w.id==='muus-quality-clever').italian,'essere astuto; essere furbo');
 assert.ok(senses.every(w=>w.senseLabel));assert.equal(ledger['pcsn-0ae9b9843021'].status,'conflict');
});
test('runtime gate rejects changed meanings, examples, variants and fake sources',()=>{
 const w=D.lexicon[0];for(const patch of [{italian:'inventato'},{meanings:['inventato']},{variants:['inventato']},{examples:[{wolof:'inventato'}]},{senseLabel:'inventato'}])assert.ok(!L.isValidated({...w,...patch}));
 assert.ok(!L.isValidated({...w,validation:{status:'verified'}}));
 const fake=JSON.parse(JSON.stringify(w));fake.validation.evidence[0].url='https://lgidf.cnrs.fr.fake.invalid/';assert.ok(!L.isValidated(fake));
 const data=JSON.parse(JSON.stringify(D));data.lexicon.push({...w,id:'unreviewed-id'});assert.equal(L.enrich(data).lexicon.length,D.lexicon.length);
});
test('all modules retain approved entries and all twenty legacy numbers retain IDs',()=>{
 for(const m of D.modules){const words=D.lexicon.filter(w=>w.category===m.id);assert.ok(words.length);assert.equal(m.wordCount+m.phraseCount,words.length);}
 const numbers=D.lexicon.filter(e=>e.kind==='number');assert.equal(numbers.length,20);for(const n of numbers){assert.ok(L.formats(n).includes('typing'));assert.ok(!L.formats(n).includes('reorder'));}
});

test('every UCLA approval binds the exact reviewed sense, including homonyms',()=>{
 const documents=new Map(read('institutional-source-manifest.json').map(d=>[d.url,d]));
 for(const a of read('institutional-approvals.json')){
  const w=D.lexicon.find(w=>w.id===a.candidateId);assert.ok(w,a.candidateId);
  assert.equal(w.italian,a.italian);assert.equal(w.senseLabel,a.senseLabel);
  const e=w.validation.evidence[0];assert.equal(e.sourceId,'UCLA-COURSE');assert.equal(e.documentSha256,documents.get(e.url).sha256);
  assert.ok(e.excerpt.toLowerCase().includes(e.sourceForm.toLowerCase()));
 }
 const pairs={moom:['lui; lei','possedere'],weer:['mese','bicchiere'],lal:['letto','stendere'],lakk:['bruciare','grigliare'],attaaya:['tè','preparare il tè']};
 for(const [form,meanings] of Object.entries(pairs))assert.equal(JSON.stringify(D.lexicon.filter(w=>w.wolof.toLowerCase()===form).map(w=>w.italian).sort()),JSON.stringify(meanings.sort()));
 assert.equal(ledger['pcsn-22455ab7ae9e'].status,'conflict');
 assert.equal(D.lexicon.find(w=>w.wolof==='ginnaaw').italian,'schiena');
 assert.equal(D.lexicon.find(w=>w.wolof==='gannaaw').italian,'dopo');
 assert.ok(D.lexicon.some(w=>w.wolof==='am xel'&&w.italian==='essere intelligente'));
});
