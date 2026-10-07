const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const B=JSON.parse(fs.readFileSync(__dirname+'/../site/review-batch-01.json','utf8'));
test('selected-source intake contains 100 distinct forms and exact document references',()=>{
 assert.equal(B.distinctLexicalForms,100);assert.equal(B.entries.length,101);assert.equal(new Set(B.entries.map(w=>w.wolof.normalize('NFC').toLowerCase())).size,100);assert.equal(new Set(B.entries.map(w=>w.id)).size,101);
 const source=B.sources.find(s=>s.id==='UCLA-DICT');assert.equal(source.sha256,'8d7bbe03bed22c6a52c96a662a196a430c4c3111c2a265217f80a158ad86a68f');
 for(const w of B.entries){assert.equal(w.sourceId,'UCLA-DICT');assert.equal(w.documentSha256,source.sha256);assert.equal(w.pdfPage,w.printedPage+20);assert.ok(w.sourceMeaning&&w.italian&&w.pos&&w.senseLabel);assert.equal(w.verification.status,'documentarily-reviewed');assert.deepEqual(w.variants,[]);assert.deepEqual(w.examples,[]);}
});
test('muus cat and intellectual quality stay separate; no same-spelling sense migration',()=>{
 const muus=B.entries.filter(w=>w.wolof==='muus');assert.equal(muus.length,2);assert.equal(muus.find(w=>w.pos==='nome').italian,'gatto');assert.equal(muus.find(w=>w.pos==='verbo di qualità').italian,'essere saggio; essere intelligente');assert.notEqual(muus[0].id,muus[1].id);assert.ok(muus.every(w=>w.printedPage===119));
 assert.equal(B.entries.find(w=>w.wolof==='am xel').italian,'essere intelligente');assert.match(B.entries.find(w=>w.wolof==='bëccëg').spellingNote,/entrambe le ë/);
 const data=fs.readFileSync(__dirname+'/../site/data.js','utf8');assert.ok(!data.includes('review-batch-01'));assert.deepEqual(B.policy.allowedSources,['UCLA-DICT','PC-SN-2012','PC-GM-GRAMMAR']);
});
