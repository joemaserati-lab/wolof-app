# Controllo del corpus prima della pubblicazione

Le 654 voci della release precedente sono conservate in `corpus-candidates.json`. Non sono una lista di parole certificate. Due voci aggiuntive distinguono gli usi di `muus` in `sense-candidates.json`.

La revisione del 7 ottobre 2026 pubblica 193 voci ed esclude 463 candidate. Le voci escluse restano archiviate con ID stabili; i progressi nel browser non vengono eliminati. Sette voci presentano divergenze da chiarire; le altre attendono una conferma puntuale. L'assenza di una conferma non dimostra che una parola sia errata.

## Criterio di ammissione

1. Consultare una voce o un passo preciso di una fonte istituzionale: lessico CNRS/LGIDF, studio LLACAN/CNRS, oppure documento governativo Peace Corps nel suo dominio ufficiale.
2. Verificare separatamente forma scritta, significato e uso. Una citazione generica, una traduzione automatica, la somiglianza tra parole o il solo nome della fonte non costituiscono approvazione.
3. Registrare in `official-approvals.tsv` la forma esatta, il significato originale, il riferimento, l'adattamento italiano e l'uso. Per parole con più significati indicare l'ID specifico del senso.
4. Se le fonti divergono, mantenere la voce sospesa. Non uniformare automaticamente accenti, vocali lunghe o consonanti doppie.
5. Approvare varianti ed esempi separatamente. Questa revisione non ammette varianti aggiuntive né collegamenti automatici a frasi non controllate.
6. Rigenerare i dati con `python3 validate-corpus.py` e verificare con `python3 validate-corpus.py --check` e `node --test tests/*.test.cjs`.

Il codice applica il registro di revisione; non è un dizionario, un correttore semantico o una certificazione madrelingua. Il confronto linguistico deve precedere l'aggiunta al registro. Le traduzioni italiane sono adattamenti redazionali del significato attestato, non traduzioni certificate dalle istituzioni.

## Muus

Lo studio ospitato da LLACAN/CNRS, `a12-Wolof.pdf`, p. 8, esempio 25, distingue l'uso nominale “chat” dall'uso verbale “être rusé”. Sono pubblicati due ID separati: `muus-noun-cat` (gatto) e `muus-quality-clever` (essere astuto/furbo). La precedente voce generica “essere intelligente”, `pcsn-0ae9b9843021`, rimane sospesa. I quiz specificano l'uso richiesto; lo stesso criterio distingue `mboq` come mais e come colore giallo.

L'estratto dello studio è disponibile nell'indice della fonte istituzionale; il suo endpoint originale risponde attualmente con errore. Questa limitazione è registrata nell'evidenza, senza attribuire una verifica del documento live. Il CNRS/LGIDF è stato consultato tramite pagine ed estratti istituzionali indicizzati; il PDF Peace Corps è stato consultato nel dominio `files.peacecorps.gov`.

## Controlli di pubblicazione

- `validation-ledger.json`: approvazioni e sospensioni per ID.
- `corpus-validation-report.json`: conteggi, cause e lista delle voci sospese.
- `site/data.js`: solo contenuti ammessi; generato, non da modificare direttamente.
- `site/lexicon-packs.js`: vuoto finché le nuove candidate non passano la revisione.
- `build-corpus.py`: richiama il validatore; non può ripubblicare il vecchio pacchetto automaticamente.

GitHub Actions rigenera in memoria gli output attesi e li confronta con i file da pubblicare. Una modifica non recepita dal registro blocca il deploy. Il filtro dell'app esclude inoltre contenuti privi di evidenza istituzionale o modificati rispetto all'approvazione. Le vecchie domande contestuali non verificate sono disattivate. Le sessioni restano da dieci domande con due pause; nelle aree con poche voci confermate i formati variano anche quando una parola ritorna.
