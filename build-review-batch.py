"""Build the manually reviewed dictionary intake. Never mutates the active corpus."""
from pathlib import Path
import hashlib,json,unicodedata
ROOT=Path(__file__).parent
DICTIONARY_SHA='8d7bbe03bed22c6a52c96a662a196a430c4c3111c2a265217f80a158ad86a68f'
GRAMMAR_SHA='89f1e981bf60a7c51b1eb6a51b52a8983dd9b5f57314fcf15a319d332038d4c2'
def norm(s):return unicodedata.normalize('NFC',s).casefold().strip()
def build():
    rows=[]
    source={'id':'UCLA-DICT','title':'Ay Baati Wolof — A Wolof-English Dictionary','authors':['Pamela Munro','Dieynaba Gaye'],'edition':'Revised Edition, 1997','publisher':'UCLA Department of Linguistics','pages':382,'sha256':DICTIONARY_SHA,'providedBy':'user','catalogUrl':'https://linguistics.ucla.edu/ucla-occasional-papers-linguistics/'}
    grammar={'id':'PC-GM-GRAMMAR','title':'Wolof Grammar','publisher':'Peace Corps / The Gambia','pages':73,'sha256':GRAMMAR_SHA,'providedBy':'user','role':'secondary context check; preserve Gambian variants'}
    candidates=json.loads((ROOT/'corpus-candidates.json').read_text())['lexicon']+json.loads((ROOT/'sense-candidates.json').read_text())+json.loads((ROOT/'institutional-candidates.json').read_text())
    for line in (ROOT/'review/batch-01.tsv').read_text().splitlines():
        page,form,english,italian,pos,label=line.split('|');page=int(page)
        if not 21<=page<=244 or not all((form,english,italian,pos,label)):raise ValueError('Incomplete reviewed entry')
        form=unicodedata.normalize('NFC',form)
        key=form+'|'+english+'|'+pos
        entry={'id':'dict-'+hashlib.sha256(key.encode()).hexdigest()[:12],'wolof':form,'italian':italian,'sourceMeaning':english,'pos':pos,'senseLabel':label,'kind':'lexical-expression' if ' ' in form else 'word','sourceId':source['id'],'printedPage':page-20,'pdfPage':page,'documentSha256':DICTIONARY_SHA,'verification':{'form':'visually compared with the supplied PDF scan','meaning':'selected sense transcribed from the supplied PDF scan','italian':'editorial adaptation of the selected English sense; not bilingual human certification','status':'documentarily-reviewed','checkedOn':'2026-10-07'},'variants':[],'examples':[],'spellingNote':'Grafia della fonte del 1997; nessuna normalizzazione automatica.','existingFormIds':[c['id'] for c in candidates if norm(c['wolof'])==norm(form)]}
        # Form matches are navigation aids, never permission to reuse a learned sense.
        if form=='muus':entry['senseNumber']=1 if pos=='nome' else 2
        if form=='bëccëg':entry['spellingNote']='Mantieni entrambe le ë e la doppia c: bëccëg.'
        if form=='muus' and pos=='nome':entry['crossCheck']={'sourceId':grammar['id'],'pdfPage':70,'documentSha256':GRAMMAR_SHA,'sourceMeaning':'muus - cat'}
        if form=='am xel':entry['crossCheck']={'sourceId':grammar['id'],'pdfPage':65,'documentSha256':GRAMMAR_SHA,'sourceMeaning':'am xel - to be smart, to be brainy'}
        rows.append(entry)
    if len({r['id'] for r in rows})!=len(rows):raise ValueError('Duplicate reviewed sense')
    if len({norm(r['wolof']) for r in rows})!=100:raise ValueError('Expected 100 distinct lexical forms')
    result={'schemaVersion':1,'batch':'01','stage':'reviewed intake; not loaded by the learning app','checkedOn':'2026-10-07','distinctLexicalForms':100,'reviewedSenses':len(rows),'selection':'First dictionary intake, mainly A entries, plus spelling and muus controls. This is not a balanced beginner syllabus.','sources':[source,grammar],'policy':{'allowedSources':['UCLA-DICT','PC-SN-2012','PC-GM-GRAMMAR'],'thirdSource':{'id':'PC-SN-2012','title':'Aay Naa ci Wolof!','url':'https://www.livelingua.com/peace-corps/Wolof/NEW_WOLOF_BOOK.pdf','role':'allowed for subsequent phrase and context checks; not used to attest this batch'},'minimumFinalTarget':500,'preferredFinalTarget':1000,'migration':'Keep active app and localStorage intact until the full selected-source audit is ready; do not count this intake as additional published words.'},'entries':rows}
    return json.dumps(result,ensure_ascii=False,indent=2)+'\n'
if __name__=='__main__':
    import sys
    content=build();path=ROOT/'site/review-batch-01.json'
    if '--check' in sys.argv:
        if not path.exists() or path.read_text()!=content:raise SystemExit('Review intake differs from the manually approved rows')
    else:path.write_text(content)
    print('Dictionary intake: 100 distinct lexical forms, 101 selected senses; active corpus unchanged.')
