async function regressionLesson(lesson){
 const check=(yes,m)=>{if(!yes)throw Error(lesson.id+': '+m);},click=s=>{const e=document.querySelector(s);check(e&&!e.disabled,'click '+s);e.click();};
 check(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')==='100','old completion');let cases=0;
 for(let stage=0;stage<5;stage++){
  click(`[data-action="stage"][data-index="${stage}"]`);check(document.querySelector('#lesson').textContent.length>40,'stage body');
  if(stage===1)for(let i=0;i<lesson.labs.length;i++){
   click(`[data-action="lab"][data-index="${i}"]`);
   for(let k=-1;k<lesson.labs[i].presets.length;k++){
    if(k>=0)click(`[data-action="preset"][data-index="${k}"]`);
    while(document.querySelector('#lab-live')?.dataset.building==='true')await new Promise(requestAnimationFrame);
    check(document.querySelector('#lab-live svg'),'old graph');check(!/NaN|Infinity|undefined/.test(document.querySelector('#lesson').textContent),'invalid display');cases++;
   }
  }
 }
 check(document.querySelectorAll('.module-quiz').length===lesson.quizzes.length,'old quizzes visible');
 return {id:lesson.id,stages:5,labs:lesson.labs.length,cases,quizzes:lesson.quizzes.length,progress:100};
}
