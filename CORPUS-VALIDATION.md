# Controllo del corpus prima della pubblicazione

Le 654 voci della release precedente sono conservate in `corpus-candidates.json`. Non sono una lista di parole certificate. Due voci aggiuntive distinguono gli usi di `muus` in `sense-candidates.json`.

La revisione del 7 ottobre 2026 pubblica 556 voci: 501 forme lessicali distinte, 9 sensi aggiuntivi e 46 frasi. Esclude 406 candidate. Le voci escluse restano archiviate con ID stabili; i progressi nel browser non vengono eliminati. Otto voci presentano divergenze da chiarire; le altre attendono una conferma puntuale. L'assenza di una conferma non dimostra che una parola sia errata.

## Revisione sulle fonti scelte dal proprietario

È in corso una nuova revisione basata esclusivamente su `Ay Baati Wolof` (Munro e Gaye, UCLA 1997, copia PDF fornita), `Aay Naa ci Wolof!` (Peace Corps Senegal, 2012) e `Wolof Grammar` (Peace Corps/The Gambia, copia PDF fornita). Questo nuovo criterio non è ancora applicato a tutte le 556 voci della release attiva: non vanno presentate come interamente riconvalidate sui tre testi.

Il primo lotto, `review/batch-01.tsv` e `site/review-batch-01.json`, documenta **100 forme lessicali distinte e 101 sensi selezionati**. È un intake prevalentemente alfabetico relativo alle voci A del dizionario, con controlli aggiuntivi su bëccëg, bëgg e muus; non è un sillabo bilanciato per principianti. È consultabile in `site/revisione-corpus.html` ma non viene caricato nelle lezioni e non aumenta il conteggio attivo. Il target rimane 500 forme, preferibilmente 1.000. Il corpus attivo rimane disponibile durante la revisione per evitare di svuotare prematuramente i moduli.

Forme e definizioni selezionate sono state confrontate visivamente con le scansioni del dizionario. Ogni record conserva pagina stampata, pagina PDF, SHA-256 del documento, parte del discorso e significato originale selezionato. L'italiano è un adattamento editoriale, non una certificazione di un revisore bilingue. Le grafie della fonte (incluse vocali doppie accentate e prestiti) non sono normalizzate automaticamente. Altre accezioni non selezionate e varianti non revisionate non vengono importate.

**Muus:** Ay Baati Wolof, p. stampata 119 / PDF 139, attesta `muus` come nome “cat” e come verbo “to be wise, intelligent, smart”. Quindi il senso intellettuale è documentato; la precedente quarantena del generico “intelligente” non dimostra l'invalidità di quel significato. Nome e verbo devono restare separati nei quiz e nella migrazione. Il dizionario attesta anche `am xel`, p. 5 / PDF 25. Riscontri secondari: Wolof Grammar p. PDF 70 (“muus - cat”) e p. PDF 65 (“am xel - to be smart, to be brainy”).

La lista `existingFormIds` è soltanto un collegamento alle forme storiche: non autorizza a riutilizzare il progresso di un'accezione per un'altra. Nessun PDF completo, scansione o percorso personale è pubblicato nel repository. Il catalogo bibliografico UCLA viene collegato come catalogo, senza fingere che il vecchio endpoint del PDF sia accessibile.

`python3 build-review-batch.py --check` verifica che il JSON corrisponda esattamente alle righe revisionate. Il build non modifica i pacchetti attivi, `validation-ledger.json` o localStorage. Il confronto con la fonte rimane un lavoro editoriale; i test verificano la struttura e la coerenza del registro, non la correttezza linguistica universale.

## Criterio della release attiva precedente

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

## Correzioni del madrelingua riferite dall’utente

La release 2.6.1 conserva i riscontri istituzionali e aggiunge cinque accezioni/formule in `native-review.json`. Totale attivo: 561 voci, 502 forme lessicali distinte, 513 voci non frasali e 48 frasi. Queste cinque voci sono revisioni d’uso riferite dall’utente, non cinque nuove verifiche su un manuale e non cinque nuovi lemmi distinti. Il lotto bibliografico separato di 100 forme rimane invariato.

- Suba: mattina e domani hanno schede diverse; la forma resta senza accenti.
- Ëllëg: futuro ha una nuova scheda; domani resta l’accezione documentata. Il testo estratto del dizionario, p. 53, riporta entrambi i sensi. Nessuna nuova verifica visiva di questa pagina è dichiarata: la copia PDF fornita non è più presente nel percorso originale, mentre il testo estratto è conservato localmente.
- Ba suba: a domani, secondo l’indicazione riferita dal madrelingua.
- Ba ëllëg: uso di congedo arrivederci/addio registrato separatamente dalla traduzione a domani del manuale. L’uso di addio non è presentato come universalmente definitivo.
- Ba ci kanam: resa italiana aggiornata ad a dopo; l’originale See you soon resta intatto nell’evidenza.
- Ñun: noi, pronome personale, con nuovo ID. Non viene confuso con sunu, nostro.

Identità del revisore e varietà linguistica non sono state fornite; non viene inventata una certificazione indipendente. Il generatore accetta soltanto le righe esplicite del registro editoriale. Le evidenze di queste righe sono legate a ID, forma e accezione approvati; non hanno URL bibliografici fittizi. Le annotazioni mantengono gli ID storici, mentre le nuove accezioni hanno ID indipendenti. Il codice non cancella né riscrive i progressi nel localStorage.

Le equivalenze temporali e di saluto sono dichiarate in gruppi espliciti: suba/domani e ëllëg/domani, Ba suba/a domani e Ba ëllëg/a domani. Non vengono proposte come distrattori false alternative che sono entrambe documentate; la scrittura libera accetta le forme del gruppo. Le domande Wolof→italiano specificano l’accezione. Non si estende automaticamente questa equivalenza ad altre parole che condividono una traduzione italiana.
