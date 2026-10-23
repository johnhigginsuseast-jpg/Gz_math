import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {bookLessons} from '../../../site/book-course.mjs';
// 源段与实际知识卡的人工对应；程序仅核验落点有效，不能代替语义复核。
const maps=[
 {'5,6':[0],'7,8':[1],'9':[2],'10':[2,3],'11':[3]},
 {'13':[0],'14':[1],'15':[2]},
 {'17':[0,1],'18':[2],'19':[3]},
 {'21':[0],'22':[1],'23':[2,3],'24':[1,2]},
 {'26':[0],'27':[1],'28':[3]},
 {'31':[0],'32,33':[1],'34':[2,3],'35':[0]},
 {'37':[0],'38':[0,1],'39':[2],'40':[1],'41':[2,3]},
 {'43':[1,2],'44':[0],'45':[3,4],'46':[2,3,4]},
 {'49':[0],'50,51':[1],'52':[3],'53':[2],'54':[4,5],'55':[3]},
 {'58,59':[0],'60':[1],'61':[4],'63':[2],'64':[3],'65':[2],'66':[3],'67':[1,4]},
 {'69':[0],'70':[1,2],'71':[3]},
 {'73':[0],'74':[1],'75':[2,3]},
 {'78':[0],'79':[1],'80':[2],'81':[3]},
 {'83':[0],'84,85':[1],'86':[2,3]},
 {'88,89':[0],'90':[1],'91':[2],'92':[3]},
 {'94':[0],'95':[0,1],'96':[2],'97':[1,3,4]},
 {'99':[0],'100,101':[1],'102':[2],'103':[3,4],'104':[0,3,4]},
 {'107':[0],'108':[1],'109':[0],'110':[2,3],'111':[1,2,3]},
 {'113,114':[0],'115':[1],'116':[2],'117':[2,3],'118':[1,2,3]},
 {'120':[2],'121':[0,1],'122':[3]},
 {'125':[0],'127':[1],'129':[2],'130':[3]},
 {'133,134':[0],'135,136':[1],'138,139':[2],'140':[3],'141':[4]},
 {'143':[0],'144':[2],'145':[1],'146':[3],'147':[4,2]},
 {'149':[0,1,2],'150':[1,2],'151':[3]},
];
const text=await readFile(new URL('../../requirements/source-extract-v0.5.txt',import.meta.url),'utf8');
const paragraphs=new Map(text.split(/\r?\n/).map(s=>s.match(/^(\d{3}) (.*)$/)).filter(Boolean).map(m=>[Number(m[1]),m[2]]));
const items=[];
function add(p,l,notes,examples=[]){
 const lesson=bookLessons[l];assert.ok(lesson&&paragraphs.has(p));
 items.push({paragraph:p,source:paragraphs.get(p),lesson:lesson.id,knowledge:notes.map(i=>{assert.ok(lesson.notes[i]);return {index:i,title:lesson.notes[i].title};}),examples:examples.map(i=>{assert.ok(lesson.examples[i]);return {index:i,title:lesson.examples[i].title};})});
}
maps.forEach((m,l)=>Object.entries(m).forEach(([ps,ns])=>ps.split(',').forEach(p=>add(Number(p),l,ns,paragraphs.get(Number(p)).includes('考点')?[0,1,2]:[]))));
add(11,1,[1],[1]);
const appendix={154:[[2,[0,1]],[7,[0,4]],[16,[0,3]]],155:[[1,[1]],[7,[3,4]],[13,[1,2]]],156:[[9,[1,4]],[16,[3]],[19,[3]]],157:[[16,[0,1,3]]],158:[[8,[3,4,5]],[21,[4]]],160:[[1,[1]]],161:[[2,[1]]],162:[[6,[0,2,3]]],163:[[5,[1]]],164:[[8,[2]]],165:[[9,[2]]],166:[[14,[3]],[15,[3]]],167:[[13,[1,2]],[15,[1,3]]],168:[[18,[1,2,3]]],169:[[22,[2]]],170:[[17,[2,3]]],171:[[11,[2,3]],[23,[3]]]};
for(const [p,targets] of Object.entries(appendix))for(const [l,ns] of targets)add(Number(p),l,ns);
const required=[...paragraphs].filter(([p,s])=>s.startsWith('【')||p>=154&&p<=158||p>=160&&p<=171).map(([p])=>p);
const covered=new Set(items.map(i=>i.paragraph));assert.deepEqual(required.filter(p=>!covered.has(p)),[]);
const result={status:'IMPLEMENTED_CONTENT_MAP_NOT_TEST_RESULT',review:'已逐条对照实际知识卡及高频题型；程序只验证来源覆盖和落点存在，不冒充独立专家审阅。',sourceItems:required.length,links:items.length,items};
await writeFile(new URL('../../requirements/source-coverage-v0.5.json',import.meta.url),JSON.stringify(result,null,2));
console.log(JSON.stringify({sourceItems:required.length,covered:covered.size,links:items.length,courses:bookLessons.length}));
