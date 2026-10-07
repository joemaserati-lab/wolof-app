# Controllo del corpus prima della pubblicazione

Le 654 voci della release precedente sono conservate in `corpus-candidates.json`. Non sono una lista di parole certificate. Due voci aggiuntive distinguono gli usi di `muus` in `sense-candidates.json`.

La revisione del 7 ottobre 2026 pubblica 556 voci: 501 forme lessicali distinte, 9 sensi aggiuntivi e 46 frasi. Esclude 406 candidate. Le voci escluse restano archiviate con ID stabili; i progressi nel browser non vengono eliminati. Otto voci presentano divergenze da chiarire; le altre attendono una conferma puntuale. L'assenza di una conferma non dimostra che una parola sia errata.

## Criterio di ammissione

1. Consultare una voce o un passo preciso di una fonte istituzionale: lessico CNRS/LGIDF, studio LLACAN/CNRS, documento governativo Peace Corps nel suo dominio ufficiale, oppure il corso universitario UCLA nel deposito collegato dal portale ufficiale.
2. Verificare separatamente forma scritta, significato e uso. Una citazione generica, una traduzione automatica, la somiglianza tra parole o il solo nome della fonte non costituiscono approvazione.
3. Registrare in `official-approvals.tsv` o, per UCLA, in `institutional-approvals.json` la forma esatta, il significato originale, il riferimento, l'adattamento italiano e l'uso. Per parole con più significati indicare l'ID specifico del senso.
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
- `site/data.js`: metadati e lista ordinata dei pacchetti; generato, non da modificare direttamente.
- `site/lexicon-packs.js`: inizializza i pacchetti approvati. I file `site/lexicon-01.js`–`site/lexicon-23.js` contengono al massimo 25 voci ciascuno, tutte soggette allo stesso controllo preventivo.
- `build-corpus.py`: richiama il validatore; non può ripubblicare il vecchio pacchetto automaticamente.

Il corpus è suddiviso in pacchetti piccoli per rendere ogni caricamento controllabile e l’espansione progressiva. L’elenco dei file è verificato anche negli asset offline.

GitHub Actions rigenera in memoria gli output attesi e li confronta con i file da pubblicare. Una modifica non recepita dal registro blocca il deploy. Il filtro dell'app esclude inoltre contenuti privi di evidenza istituzionale o modificati rispetto all'approvazione. Le vecchie domande contestuali non verificate sono disattivate. Le sessioni restano da dieci domande con due pause; nelle aree con poche voci confermate i formati variano anche quando una parola ritorna.

## Espansione UCLA — release 2.6

Il [Wolof Online Course della University of California, Los Angeles](https://aflang.humanities.ucla.edu/language-courses/wolof/) è realizzato da Mariame Sy, Harold Torrence e Dieynaba Gaye. Il portale universitario collega direttamente i PDF nel deposito pubblico UCLA Box. Non si attribuisce a UCLA una certificazione delle traduzioni italiane.

363 voci o sensi sono ammessi con un riscontro puntuale nei glossari e nelle spiegazioni del corso. Ogni approvazione conserva forma, estratto letterale, pagina PDF, URL del documento e SHA-256. `institutional-source-manifest.json` identifica le edizioni consultate; `institutional-candidates.json` conserva gli ID delle nuove proposte. Il generatore verifica documento, impronta, estratto e ID del senso, dando precedenza alle approvazioni specifiche degli omonimi rispetto alle approvazioni generiche. Un doppione di forma e significato blocca la generazione.

I sensi diversi di moom, weer, lal, lakk, attaaya e dëkk hanno ID distinti. La precedente associazione gannaaw → schiena resta sospesa: il corso distingue gannaaw (dopo) da ginnaaw (schiena). Am xel è attestato come essere intelligente. Le differenze di grafia sono sospese anziché convertite automaticamente; i possibili doppioni ortografici non aumentano il conteggio.

Il conteggio separa 501 forme lessicali distinte, 9 sensi aggiuntivi e 46 frasi. Include locuzioni lessicali e i venti numeri già presenti; non è un conteggio dei token né una dichiarazione di completezza del dizionario. Nessun elenco di paesi o generazione automatica di numeri è stato aggiunto per raggiungere la soglia.

Il manuale storico Peace Corps ospitato dal deposito governativo ERIC è stato recuperato per ulteriori confronti, ma nessuna voce è stata ammessa automaticamente da quell'edizione. I documenti integrali, le pagine Box e i token temporanei di download non vengono distribuiti nel sito o nel repository.
