const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const L=require('../site/learning.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../site/data.js','utf8'),context);
for(const f of ['lexicon-packs.js',...context.window.WOLOF_DATA.lexiconFiles])vm.runInNewContext(fs.readFileSync(__dirname+'/../site/'+f,'utf8'),context);
const D=L.enrich(context.window.WOLOF_DATA,context.window.WOLOF_PACKS);
test('orthography preserves meaning credit without marking answers fully correct',()=>{
 assert.equal(L.grade('becceg',['bëccëg']).credit,.5);
 assert.match(L.grade('becceg',['bëccëg']).feedback,/ë/);
 assert.equal(L.grade('be\u0308cce\u0308g',['bëccëg']).credit,1);
 assert.equal(L.grade(' BËCCËG! ',['bëccëg']).credit,1);
 assert.equal(L.grade('dem',['dem']).credit,1);
 assert.equal(L.grade('den',['dem']).credit,0);
 assert.equal(L.grade('foo',['ñoo']).credit,0);
 assert.equal(L.grade('',['bëccëg']).credit,0);
 assert.equal(L.grade('xar',['bëccëg']).credit,0);
 assert.equal(L.grade('alternate',['canonical','alternate']).credit,1);
 assert.equal(L.grade('salam',['salaam']).credit,.5);
});
test('schema enriches all legacy entries without changing IDs or sources',()=>{
 assert.equal(new Set(D.lexicon.map(w=>w.id)).size,D.lexicon.length);
 for(const w of D.lexicon){assert.ok(w.lemma);assert.ok(w.meanings.length);assert.ok(w.provenance[0].sourceId);assert.ok(Array.isArray(w.examples));assert.ok(L.formats(w).length>=3);}
});
test('unreviewed packs stay excluded; duplicate IDs and unknown sources fail',()=>{
 const data=()=>JSON.parse(JSON.stringify(D));const w={...D.lexicon[0],id:'pack-001'};
 assert.equal(L.enrich(data(),[{schemaVersion:1,entries:[w]}]).lexicon.length,D.lexicon.length);
 assert.throws(()=>L.enrich(data(),[{schemaVersion:1,entries:[D.lexicon[0]]}]),/duplicata/);
 assert.throws(()=>L.enrich(data(),[{schemaVersion:1,entries:[{...w,source:'missing'}]}]),/riferimenti/);
});
test('same word rotates format between sessions and avoids recent formats',()=>{
 for(const w of D.lexicon){let first=L.chooseFormat(w,null,[]);let second=L.chooseFormat(w,{lastFormat:first},[]);assert.notEqual(first,second);}
 const w=D.lexicon.find(w=>w.kind==='word');assert.equal(L.chooseFormat(w,{lastFormat:'w2it'},['it2w']),'typing');
});
