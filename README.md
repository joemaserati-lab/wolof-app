# Njàng Wolof

PWA offline per lo studio del Wolof. GitHub Pages pubblica `site/` dopo i controlli automatici.

## Qualità linguistica

La release 2.5 applica una revisione preventiva su fonti istituzionali: 193 voci attive, 463 candidate sospese. Le sospensioni non dichiarano automaticamente una parola errata. Ogni voce attiva include forma, significato originale, riferimento e uso. Le traduzioni italiane sono adattamenti redazionali, non una certificazione madrelingua.

`muus` è distinto come nome (gatto) e verbo di qualità (essere astuto/furbo). Il significato generico precedente “intelligente” non entra più nei quiz. Gli esercizi specificano l'uso richiesto anche per `mboq`.

Leggere `CORPUS-VALIDATION.md` per criteri, fonti, limitazioni e procedura di ammissione. Consultare `corpus-validation-report.json` per le sospensioni. Il corpus storico di 654 candidate resta archiviato in `corpus-candidates.json`; non è il corpus pubblicato.

## Aggiornare il corpus

1. Aggiungere la proposta alle candidate.
2. Controllare forma, significato e uso su una voce precisa di una fonte istituzionale. Non usare traduttori automatici come conferma.
3. Solo dopo il controllo aggiungere il riferimento in `official-approvals.tsv`; per omografi specificare l'ID del senso.
4. Eseguire `python3 validate-corpus.py`.
5. Eseguire `python3 validate-corpus.py --check` e `node --test tests/*.test.cjs`.

I file pubblicati sono generati. Modificarli senza aggiornare il registro blocca il deploy. Varianti, esempi e vecchie domande contestuali privi di conferma restano esclusi. Il filtro dell'app verifica anche che i significati non siano cambiati dopo l'approvazione.

## Esercizi e progressi

Dieci domande, due pause dopo la terza e la settima, formati variabili e mezzo credito per piccoli errori ortografici. Le risposte parziali non contano come corrette ai fini del consolidamento. Dove ci sono poche voci approvate, le parole possono tornare con un formato diverso.

La chiave `njang-wolof-v2`, gli ID conservati e i progressi locali restano disponibili. Le voci sospese non sono cancellate dalle statistiche salvate. I nuovi sensi di `muus` hanno ID distinti per non ereditare l'apprendimento del vecchio significato.

## Pubblicazione

Il workflow valida il registro, i test, la sintassi e gli asset PWA prima del deploy. Per una nuova release incrementare le versioni degli asset e il nome della cache offline.
