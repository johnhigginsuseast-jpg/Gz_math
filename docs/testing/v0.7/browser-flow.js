async function runLessonFlow(input) {
 const {lesson,labAnswers,quizAnswers}=input,assert=(ok,message)=>{if(!ok)throw new Error(lesson.id+': '+message);};
 const get=selector=>{const e=document.querySelector(selector);assert(e,'missing '+selector);return e;};
 const click=selector=>{const e=get(selector);assert(!e.disabled,'disabled '+selector);e.click();};
 const stage=n=>assert(document.querySelector(`[data-action="stage"][data-index="${n}"]`)?.getAttribute('aria-current')==='step','stage '+n);
 const check=()=>assert(!/NaN|Infinity|undefined/.test(get('#lesson').textContent),'invalid visible number');
 const built=async()=>{while(document.querySelector('#lab-live')?.dataset.building==='true')await new Promise(requestAnimationFrame);};
 stage(0);assert(get('.course-progress [role="progressbar"]').getAttribute('aria-valuenow')==='0','initial progress');
 assert(get('[data-action="next"]').disabled,'scene gate');click('[data-action="scene"][data-index="0"]');click('[data-action="next"]');stage(1);
 let cases=0;
 for(let i=0;i<lesson.labs.length;i++){
  const lab=lesson.labs[i];click(`[data-action="lab"][data-index="${i}"]`);
  assert(document.querySelector('.graph-placeholder'),'prediction before graph');assert(!document.querySelector('#lab-formula'),'formula not revealed');
  click('[data-action="guess"][data-index="0"]');click('[data-action="show"]');assert(document.querySelector('#lab-live svg'),'graph constructed');await built();
  const expected=labAnswers[lab.id];assert(expected?.length===lab.presets.length+1,'fixture case count');
  for(let c=0;c<expected.length;c++){
   if(c){click(`[data-action="preset"][data-index="${c-1}"]`);await built();}
   const select=get('#observation');select.value=String((expected[c]+1)%lab.options.length);select.dispatchEvent(new Event('change',{bubbles:true}));
   assert(get('#record-observation').disabled,'wrong observation blocked');
   select.value=String(expected[c]);select.dispatchEvent(new Event('change',{bubbles:true}));
   click('#record-observation');assert(get('#lab-formula').textContent.length>0,'formula after observation');
   assert(document.querySelectorAll('.observation-card li').length>0,'observation saved');check();cases++;
  }
 }
 click('[data-action="next"]');stage(2);assert(document.querySelectorAll('.module-knowledge article').length>=3,'knowledge cards');click('[data-action="next"]');stage(3);
 let steps=0;for(let i=0;i<lesson.examples.length;i++)for(let n=0;n<lesson.examples[i].steps.length;n++){click(`[data-action="example"][data-index="${i}"]`);steps++;}
 assert(document.querySelectorAll('.module-solution li').length===steps,'all solution steps');click('[data-action="next"]');stage(4);
 for(let i=0;i<lesson.quizzes.length;i++){
  const answer=quizAnswers[lesson.id][i],wrong=(answer+1)%lesson.quizzes[i].options.length;
  click(`[data-action="answer"][data-index="${i}"][data-option="${wrong}"]`);click(`[data-action="submit"][data-index="${i}"]`);
  assert(get('[data-action="finish"]').disabled,'wrong answer blocks finish');
  click(`[data-action="answer"][data-index="${i}"][data-option="${answer}"]`);click(`[data-action="submit"][data-index="${i}"]`);check();
 }
 click('[data-action="finish"]');assert(get('.course-progress [role="progressbar"]').getAttribute('aria-valuenow')==='100','complete progress');
 const saved=JSON.parse(localStorage.getItem('geometry-module-v1')).lessons[lesson.id];assert(saved.complete,'persist complete');assert(saved.answers.every(a=>a.hadError),'correction retained');
 return {id:lesson.id,labs:lesson.labs.length,cases,examples:lesson.examples.length,steps,quizzes:lesson.quizzes.length,complete:saved.complete};
}
