(async function(){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const box=document.querySelector('#entries'),count=document.querySelector('#count'),query=document.querySelector('#query');
 try{
  const response=await fetch('review-batch-01.json');if(!response.ok)throw Error('source intake unavailable');const batch=await response.json();
  function draw(){const term=query.value.normalize('NFC').toLowerCase().trim();const rows=batch.entries.filter(w=>[w.wolof,w.italian,w.sourceMeaning,w.senseLabel].some(s=>s.toLowerCase().includes(term)));count.textContent=rows.length+' significati';box.innerHTML=rows.length?rows.map(w=>`<article><h2>${escape(w.wolof)}</h2><p class="it">${escape(w.italian)}</p><p class="meta">${escape(w.pos)} · ${escape(w.senseLabel)}</p><p class="original">Definizione inglese selezionata: ${escape(w.sourceMeaning)}</p><p class="meta">${escape(w.spellingNote)}</p><footer>Ay Baati Wolof · pagina ${w.printedPage}<br>PDF fornito · pagina ${w.pdfPage}${w.crossCheck?`<br>Riscontro: Wolof Grammar · PDF pagina ${w.crossCheck.pdfPage}`:''}</footer></article>`).join(''):'<p class="empty">Nessuna voce trovata.</p>';}
  query.addEventListener('input',draw);draw();
 }catch{box.innerHTML='<p class="empty">Il lotto non è disponibile. Ricarica la pagina.</p>';count.textContent='';}
})();
