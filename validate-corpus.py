"""Only explicitly reviewed institutional evidence may enter the published corpus.

This is a publication gate, not an automatic semantic validator. New approvals
must be reviewed against the cited entry; software only enforces their scope.
"""
from pathlib import Path
from urllib.parse import urlparse
import copy, hashlib, json, unicodedata

ROOT=Path(__file__).parent
def norm(s):
    return ' '.join(unicodedata.normalize('NFC',str(s)).lower().strip().rstrip('.!?').split())

def binding(w):
    payload={k:w.get(k) for k in ['id','wolof','italian','kind','category','pos','senseLabel','variants','examples','note','orthography']}
    return hashlib.sha256(json.dumps(payload,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()

source_urls={
 'CNRS-LGIDF':'https://lgidf.cnrs.fr/wolof-lexique-',
 'PC-MR':'https://files.peacecorps.gov/multimedia/audio/languagelessons/mauritania/MR_Wolof_Language_Lessons.pdf',
 'LLACAN-QUAL':'https://www.llacan.cnrs.fr/publications/a12-Wolof.pdf'
}
institution_hosts={'lgidf.cnrs.fr','files.peacecorps.gov','www.llacan.cnrs.fr','ucla.app.box.com'}

def generate():
    data=json.loads((ROOT/'corpus-candidates.json').read_text())
    candidates=data['lexicon']+json.loads((ROOT/'sense-candidates.json').read_text())+json.loads((ROOT/'institutional-candidates.json').read_text())
    approvals=[]
    for n,line in enumerate((ROOT/'official-approvals.tsv').read_text().splitlines(),1):
        if not line or line.startswith('#'):continue
        row=line.split('|')
        if len(row) not in (6,7):raise ValueError(f'Invalid approval row {n}')
        source,locator,form,meaning,italian,label=row[:6]
        if source not in source_urls:raise ValueError('Unapproved institution: '+source)
        url=source_urls[source]+locator if source=='CNRS-LGIDF' else source_urls[source]
        if urlparse(url).hostname not in institution_hosts:raise ValueError('Unapproved host')
        approvals.append({'sourceId':source,'locator':locator,'sourceForm':form,'sourceMeaning':meaning,
                          'italian':italian,'senseLabel':label,'url':url,'candidateId':row[6] if len(row)==7 else None})
    extra=json.loads((ROOT/'institutional-approvals.json').read_text())
    documents=json.loads((ROOT/'institutional-source-manifest.json').read_text())
    trusted={d['url']:d for d in documents}
    for a in extra:
        if a['sourceId']!='UCLA-COURSE' or a['url'] not in trusted:raise ValueError('Unreviewed source document')
        if a['documentSha256']!=trusted[a['url']]['sha256']:raise ValueError('Source snapshot hash mismatch')
        if not a['excerpt'] or a['sourceMeaning']!=a['excerpt'] or a['sourceForm'].casefold() not in a['excerpt'].casefold():raise ValueError('Evidence must contain the literal source form and excerpt')
        approvals.append(a)
    rejected=[];accepted=[];ledger={}
    conflicts={
      'pcsn-22455ab7ae9e':'gannaaw was incorrectly glossed as schiena. UCLA distinguishes gannaaw (after) from ginnaaw (back); corrected senses have separate IDs.',
      'pcsn-0ae9b9843021':'muus: generic “intelligente” is not the reviewed lexical sense. Replaced by separate cat and astute senses with new IDs.',
    }
    competing={'dereet':('deret','s'),'dòor':('dóor','f'),'jòg':('jóg','s'),'sedd':('sédd','f'),'jën':('jén','p'),'cammoñ':('càmmoñ','g')}
    for raw in candidates:
        matches=[a for a in approvals if norm(a['sourceForm'])==norm(raw['wolof']) and (not a['candidateId'] or a['candidateId']==raw['id'])]
        reason=conflicts.get(raw['id'])
        if raw['wolof'] in competing:
            other,letter=competing[raw['wolof']]
            reason=f'Unresolved source spelling difference: {raw["wolof"]} versus {other} at https://lgidf.cnrs.fr/wolof-lexique-{letter}. Neither spelling is silently normalised.'
        if reason or not matches:
            status='conflict' if reason else 'pending'
            note=reason or 'No exact form-and-meaning approval from a reviewed institutional entry yet; this does not mean the word is invalid.'
            ledger[raw['id']]={'status':status,'wolof':raw['wolof'],'italian':raw['italian'],'reason':note}
            rejected.append({'id':raw['id'],'wolof':raw['wolof'],'italian':raw['italian'],'status':status,'reason':note,'origin':raw.get('candidateOrigin')})
            continue
        a=next((m for m in matches if m['candidateId']==raw['id']),matches[0])
        # No source-backed approval is inferred from spelling similarity or source IDs.
        w=copy.deepcopy(raw)
        w.update({'italian':a['italian'],'meanings':a['italian'].split('; '),'senseLabel':a['senseLabel'],
                  'source':a['sourceId'],'ref':(f'PDF p. {a["locator"]}' if a['sourceId']=='PC-MR' else f'p. 8, exemple 25' if a['sourceId']=='LLACAN-QUAL' else a['locator'] if a['sourceId']=='UCLA-COURSE' else f'Lexique ({a["locator"].upper()}) · {a["sourceMeaning"]}'),
                  'variants':[],'examples':[],'note':'',
                  'orthography':{'canonical':w['wolof'],'note':''},
                  'provenance':[{'sourceId':a['sourceId'],'url':a['url'],'locator':a['locator'],
                                 'sourceForm':a['sourceForm'],'sourceMeaning':a['sourceMeaning'],
                                 'status':'institutional-entry-reviewed','checkedOn':'2026-10-07',
                                 'translationReview':'Italian editorial translation checked against the cited meaning; not certified by the institution.',
                                 'retrieval':'indexed institutional excerpt' if a['sourceId'] in ('CNRS-LGIDF','LLACAN-QUAL') else 'official PDF text',
                                 'documentSha256':a.get('documentSha256',''),'excerpt':a.get('excerpt',''),
                                 'accessNote':'Original endpoint currently unavailable; institutional indexed excerpt consulted.' if a['sourceId']=='LLACAN-QUAL' else ''}]})
        if w['id']=='w071':w['orthography']['note']='Mantieni entrambe le ë e la doppia c: bëccëg.'
        approved={k:copy.deepcopy(w.get(k)) for k in ['id','wolof','italian','kind','category','senseLabel','variants','examples','meanings','pos','note','orthography']}
        w['validation']={'status':'verified','binding':binding(w),'approved':approved,'evidence':w['provenance']}
        if any(x['id']==w['id'] for x in accepted):raise ValueError('Duplicate published ID: '+w['id'])
        if any(norm(x['wolof'])==norm(w['wolof']) and norm(x['italian'])==norm(w['italian']) for x in accepted):raise ValueError('Duplicate form and sense: '+w['wolof'])
        accepted.append(w)
        ledger[w['id']]={'status':'verified','binding':w['validation']['binding'],'wolof':w['wolof'],'italian':w['italian'],'evidence':w['provenance']}

    # Every example has to be a separately approved complete phrase.
    # None are auto-linked to avoid reintroducing pending phrases or wrong senses.
    data['lexicon']=accepted
    data['patterns']=[]
    data['app']['version']='2.6.0'
    data['app']['method']='Solo voci con forma e significato controllati su fonti istituzionali; esercizi con contesto per i significati multipli.'
    data['validationPolicy']={'required':True,'schemaVersion':1,'reviewedOn':'2026-10-07','pendingCount':len(rejected),'candidateCount':len(candidates)}
    data['sources'].append({'id':'LLACAN-QUAL','name':'La qualification en wolof — exemple 25','publisher':'LLACAN / CNRS','type':'Studio linguistico accademico','usage':'Distinzione dei significati di muus e mboq','url':source_urls['LLACAN-QUAL'],'note':'L’estratto accademico indicizzato distingue muus nominale (chat) e verbale (être rusé). L’endpoint originale non è attualmente accessibile; nessuna certificazione madrelingua è implicata.'})
    data['sources']=[s for s in data['sources'] if s['id']!='UCLA-COURSE']
    data['sources'].append({'id':'UCLA-COURSE','name':'Wolof Online Course','publisher':'University of California, Los Angeles','type':'Corso universitario con glossari e lezioni','url':'https://aflang.humanities.ucla.edu/language-courses/wolof/','usage':'Riscontro puntuale di forma e significato; pagina del PDF e impronta del documento conservate.'})
    for m in data['modules']:
        group=[w for w in accepted if w['category']==m['id']]
        m['wordCount']=sum(w['kind']!='phrase' for w in group);m['phraseCount']=sum(w['kind']=='phrase' for w in group)
    report={'candidates':len(candidates),'published':len(accepted),'quarantined':len(rejected),
            'distinctLexicalForms':len({norm(w['wolof']) for w in accepted if w['kind']!='phrase'}),
            'words':sum(w['kind']!='phrase' for w in accepted),'phrases':sum(w['kind']=='phrase' for w in accepted),
            'conflicts':sum(w['status']=='conflict' for w in rejected),
            'verifiedExpansion':sum(w.get('candidateOrigin')=='expansion' for w in accepted),
            'byCategory':{m['id']:sum(w['category']==m['id'] for w in accepted) for m in data['modules']},
            'quarantine':rejected}
    packs={f'lexicon-{i//25+1:02d}.js':accepted[i:i+25] for i in range(0,len(accepted),25)}
    data['lexicon']=[]
    data['lexiconFiles']=list(packs)
    outputs={ROOT/'site/data.js':'window.WOLOF_DATA = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',
             ROOT/'site/lexicon-packs.js':'// Candidate expansions must pass validate-corpus.py before publication.\nwindow.WOLOF_PACKS = [];\n',
             ROOT/'validation-ledger.json':json.dumps({'schemaVersion':1,'records':ledger},ensure_ascii=False,indent=2)+'\n',
             ROOT/'corpus-validation-report.json':json.dumps(report,ensure_ascii=False,indent=2)+'\n'}
    for filename,words in packs.items():
        outputs[ROOT/'site'/filename]='window.WOLOF_PACKS.push('+json.dumps({'schemaVersion':1,'id':filename,'entries':words},ensure_ascii=False,indent=2)+');\n'
    return outputs,report

if __name__=='__main__':
    import sys
    outputs,report=generate()
    if '--check' in sys.argv:
        for path,content in outputs.items():
            if not path.is_file() or path.read_text()!=content:raise SystemExit(f'Unreviewed corpus edit or stale build: {path.name}')
    else:
        for path,content in outputs.items():path.write_text(content)
    print(json.dumps({k:v for k,v in report.items() if k!='quarantine'},ensure_ascii=False,indent=2))
