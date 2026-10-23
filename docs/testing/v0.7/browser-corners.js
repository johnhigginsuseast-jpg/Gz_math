async function checkControlCorners(lesson) {
 const check=(ok,m)=>{if(!ok)throw Error(lesson.id+': '+m);},click=s=>{const e=document.querySelector(s);check(e&&!e.disabled,'click '+s);e.click();};
 click('[data-action="stage"][data-index="1"]');let cases=0,invalid=0;
 for(let i=0;i<lesson.labs.length;i++){
  const lab=lesson.labs[i];click(`[data-action="lab"][data-index="${i}"]`);
  const sets=lab.controls.reduce((all,c)=>all.flatMap(values=>[c.min,c.max].map(x=>({...values,[c.key]:x}))),[{}]);
  for(const values of sets){
   for(const c of lab.controls){const e=document.querySelector(`input[type="number"][data-field="${c.key}"]`);e.value=String(values[c.key]);e.dispatchEvent(new Event('input',{bubbles:true}));}
   while(document.querySelector('#lab-live').dataset.building==='true')await new Promise(requestAnimationFrame);
   check(document.querySelector('#input-error').hidden,'legal corner rejected');check(!/NaN|Infinity|undefined/.test(document.querySelector('#lesson').textContent),'nonfinite display');
   const saved=JSON.parse(localStorage.getItem('geometry-module-v1')).lessons[lesson.id].labs[lab.id];
   for(const c of lab.controls)check(saved.values[c.key]===values[c.key],'saved input mismatch');
   check(document.querySelector('#observation').value==='','changed parameter observation cleared');check(document.querySelector('#record-observation').disabled,'record requires observation');cases++;
  }
  const c=lab.controls[0],before=JSON.parse(localStorage.getItem('geometry-module-v1')).lessons[lesson.id].labs[lab.id].values;
  for(const bad of ['',String(c.min-c.step),String(c.max+c.step),String(c.min+c.step/2)]){
   const e=document.querySelector(`input[type="number"][data-field="${c.key}"]`);e.value=bad;e.dispatchEvent(new Event('input',{bubbles:true}));
   check(!document.querySelector('#input-error').hidden,'invalid input not explained');
   const after=JSON.parse(localStorage.getItem('geometry-module-v1')).lessons[lesson.id].labs[lab.id].values;
   check(JSON.stringify(after)===JSON.stringify(before),'invalid input changed saved model');invalid++;
  }
 }
 return {id:lesson.id,corners:cases,invalidInputs:invalid};
}
