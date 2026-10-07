const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../site/learning.js'),ctx={window:{}};
for(const name of ['data.js','lexicon-packs.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/../site/'+name,'utf8'),ctx);
const original=JSON.parse(JSON.stringify(ctx.window.WOLOF_DATA)),packs=ctx.window.WOLOF_PACKS;
const D=L.enrich(ctx.window.WOLOF_DATA,packs);
const norm=s=>L.normalize(s);
test('expansion adds 296 sourced entries and retains every legacy ID',()=>{
 assert.equal(original.lexicon.length,358);assert.equal(D.lexicon.length,654);
 assert.equal(packs[0].entries.length,296);
 for(const old of original.lexicon){const current=D.lexicon.find(w=>w.id===old.id);assert.ok(current);assert.equal(current.wolof,old.wolof);assert.equal(current.italian,old.italian);}
 const forms=new Set(original.lexicon.map(w=>norm(w.wolof)));
 for(const e of packs[0].entries){assert.ok(!forms.has(norm(e.wolof)),'duplicate: '+e.wolof);forms.add(norm(e.wolof));}
});
test('new entries have exact references, editorial translations, and attested examples',()=>{
 const sourceIDs=new Set(D.sources.map(s=>s.id)),categories=new Set(D.modules.map(m=>m.id));
 for(const e of packs[0].entries){assert.ok(categories.has(e.category));assert.ok(sourceIDs.has(e.source));assert.match(e.ref,/^PDF p\. \d+$/);assert.ok(['word','phrase'].includes(e.kind));assert.ok(e.pos);assert.ok(e.meanings.length);assert.equal(e.wolof,e.wolof.normalize('NFC'));assert.equal(e.frequency,null);assert.equal(e.level,null);assert.equal(e.provenance[0].status,'source-checked');assert.match(e.provenance[0].translationReview,/not native-speaker reviewed/);
 for(const ex of e.examples){assert.ok(sourceIDs.has(ex.sourceId));assert.ok(ex.ref);assert.ok(D.lexicon.some(p=>p.wolof===ex.wolof&&p.italian===ex.italian&&p.source===ex.sourceId&&p.ref===ex.ref));}}
 for(const m of D.modules){assert.equal(m.wordCount+m.phraseCount,D.lexicon.filter(e=>e.category===m.id).length);}
 const numbers=D.lexicon.filter(e=>e.kind==='number');assert.equal(numbers.length,20);for(const n of numbers){assert.ok(L.formats(n).includes('typing'));assert.ok(!L.formats(n).includes('reorder'));}
});
