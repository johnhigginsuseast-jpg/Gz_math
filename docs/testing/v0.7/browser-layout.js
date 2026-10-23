function inspectLayout(id,stage,lab){
 const width=innerWidth,overflow=document.documentElement.scrollWidth>width+1,svgIssues=[],controlIssues=[];
 for(const svg of document.querySelectorAll('#lesson svg')){const v=svg.viewBox.baseVal;for(const t of svg.querySelectorAll('text')){const b=t.getBBox();if(b.x<-.5||b.y<-.5||b.x+b.width>v.width+.5||b.y+b.height>v.height+.5)svgIssues.push({text:t.textContent,x:b.x,y:b.y,w:b.width,h:b.height,view:[v.width,v.height]});}}
 for(const e of document.querySelectorAll('#lesson button,#lesson input,#lesson select')){const b=e.getBoundingClientRect();if(b.width&&b.height&&(b.left<-.5||b.right>width+.5))controlIssues.push({text:e.textContent||e.getAttribute('aria-label'),left:b.left,right:b.right});}
 if(overflow||svgIssues.length||controlIssues.length)throw Error(JSON.stringify({id,width,stage,lab,overflow,svgIssues,controlIssues}));
 return {id,width,stage,lab,overflow,svgIssues:0,controlIssues:0};
}
function lessonLayouts(lesson){
 const results=[],click=s=>document.querySelector(s).click();
 for(let stage=0;stage<5;stage++){click(`[data-action="stage"][data-index="${stage}"]`);if(stage===1){for(let i=0;i<lesson.labs.length;i++){click(`[data-action="lab"][data-index="${i}"]`);results.push(inspectLayout(lesson.id,stage,i));}}else results.push(inspectLayout(lesson.id,stage,null));}
 return results;
}
