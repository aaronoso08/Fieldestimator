(()=>{
  document.querySelectorAll('.nav-tab').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();el.click();}});});

  const title=document.querySelector('.topbar-title');
  const sub=document.querySelector('.topbar-sub');
  const icon=document.querySelector('.topbar-icon');
  if(title) title.textContent='Field Estimator';
  if(sub) sub.textContent='Latino Built · Pro Source';
  if(icon){icon.textContent='LB';icon.setAttribute('aria-label','Latino Built');}

  const estimatorMain=document.querySelector('#screen-estimator .main')||document.querySelector('.main');
  if(estimatorMain&&!document.getElementById('lb-quickstart')){
    const box=document.createElement('div');
    box.id='lb-quickstart';box.className='lb-quickstart';
    box.innerHTML='<div>⚡</div><div><strong>Quick job estimate</strong><span>1. Add job info &nbsp; 2. Select the work & quantities &nbsp; 3. Review the total &nbsp; 4. Print or open Invoice.</span></div>';
    estimatorMain.prepend(box);
  }

  const actions=document.querySelector('.topbar-actions');
  if(actions&&!document.getElementById('lb-save-state')){
    const s=document.createElement('span');s.id='lb-save-state';s.className='lb-save';s.textContent='Saved on this device';actions.prepend(s);
  }

  const KEY='latino-built-field-estimator-v2';
  let timer;
  function fields(){return [...document.querySelectorAll('input[id],select[id],textarea[id]')].filter(el=>!['button','submit'].includes(el.type));}
  function save(){
    try{
      const data={__invoice:lineItems.map(l=>({...l})),__estimateId:state.id};
      fields().forEach(el=>data[el.id]={value:el.value,checked:!!el.checked,type:el.type});
      localStorage.setItem(KEY,JSON.stringify(data));
      const s=document.getElementById('lb-save-state');if(s){s.textContent='Saved';setTimeout(()=>s.textContent='Saved on this device',1200)}
    }catch(e){const s=document.getElementById('lb-save-state');if(s)s.textContent='Unable to save on this device';}
  }
  function restore(){
    try{
      const data=JSON.parse(localStorage.getItem(KEY)||'null');if(!data)return;
      if(Array.isArray(data.__invoice)){
        document.getElementById('lineBody').replaceChildren();
        lineItems=[];lineCounter=0;
        data.__invoice.forEach(item=>{if(!Number.isInteger(item.id)||item.id<1)return;lineItems.push({...item,desc:''});lineCounter=Math.max(lineCounter,item.id);renderLine(item.id,'',item.cat,item.qty,item.price);});
      }
      if(typeof data.__estimateId==='string'){state.id=data.__estimateId;document.getElementById('estimateId').textContent=state.id;}
      Object.entries(data).forEach(([id,v])=>{if(id.startsWith('__'))return;const el=document.getElementById(id);if(!el)return;if(el.type==='checkbox'||el.type==='radio')el.checked=!!v.checked;else el.value=v.value??'';try{el.dispatchEvent(new Event(el.tagName==='SELECT'||el.type==='checkbox'?'change':'input',{bubbles:true}))}catch(e){}});
    }catch(e){}
  }
  restore();
  function labelRows(){
    if(title)title.textContent=lang==='es'?'Estimador de Trabajo':'Field Estimator';
    if(sub)sub.textContent='Latino Built · Pro Source';
    const quick=document.getElementById('lb-quickstart');
    if(quick){quick.querySelector('strong').textContent=lang==='es'?'Estimación rápida':'Quick job estimate';quick.querySelector('span').textContent=lang==='es'?'1. Datos del trabajo · 2. Trabajo y cantidades · 3. Revisar total · 4. Imprimir o abrir Factura':'1. Add job info · 2. Select work & quantities · 3. Review total · 4. Print or open Invoice';}
    document.querySelectorAll('.mrow').forEach(row=>{
    const name=row.querySelector('.mname')?.textContent||'Work';
    const cells=row.querySelectorAll('td');
    (lang==='es'?['Seleccionar','Trabajo','Tasa de incentivo','Cantidad / pies²','Costo del trabajo','Incentivo estimado']:['Select','Work','Incentive rate','Quantity / sq ft','Job cost','Estimated incentive']).forEach((label,i)=>{if(cells[i])cells[i].dataset.label=label;});
    row.querySelector('input[type=checkbox]')?.setAttribute('aria-label',(lang==='es'?'Seleccionar ':'Select ')+name);
    row.querySelectorAll('input[type=number]').forEach((el,i)=>el.setAttribute('aria-label',name+(lang==='es'?(i?' costo del trabajo':' cantidad'):(i?' job cost':' quantity'))));
  });}
  labelRows();
  document.getElementById('langBtn')?.addEventListener('click',labelRows);
  const note=document.createElement('p');note.className='lb-reference-note';
  note.setAttribute('data-en','Incentives are reference estimates. Verify current program rules and eligibility before quoting a customer.');
  note.setAttribute('data-es','Los incentivos son estimaciones de referencia. Verifique las reglas y la elegibilidad vigentes antes de cotizar.');
  note.textContent=note.dataset.en;
  document.getElementById('alertZone')?.insertAdjacentElement('afterend',note);
  const queue=()=>{clearTimeout(timer);timer=setTimeout(save,250)};
  document.addEventListener('input',queue,true);document.addEventListener('change',queue,true);document.addEventListener('click',queue,true);window.addEventListener('beforeunload',save);

  [...document.querySelectorAll('.card-title')].forEach(el=>{
    const t=(el.textContent||'').toLowerCase();
    if(t.includes('documentation')||t.includes('documents')){
      const card=el.closest('.card'); if(card) card.dataset.optional='true';
    }
  });
})();
