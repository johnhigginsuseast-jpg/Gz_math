import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lessons,restoreModule,lessonProgress} from '../../../site/module-course.mjs';
import {elective2Lessons} from '../../../site/elective2-course.mjs';
const root=new URL('../../../',import.meta.url),run=new URL('../../acceptance/runs/candidate-v0.7-r1/',import.meta.url);
const json=async(name,base=run)=>JSON.parse((await readFile(new URL(name,base),'utf8')).replace(/^\uFEFF/,''));
const manifest=await json('manifest.json');
for(const file of [...manifest.files,...manifest.sources])assert.equal(createHash('sha256').update(await readFile(new URL(file.path,root))).digest('hex'),file.sha256,file.path);
const previous=await json('docs/acceptance/runs/candidate-v0.6-r1/manifest.json',root);
for(const source of previous.sources){const next=manifest.sources.find(s=>s.path==='高中知识点/'+source.path.split('/').at(-1));assert.equal(next?.sha256,source.sha256,source.path);}
const flows=await json('full-flows.json'),corners=await json('control-corners.json'),layouts=await json('layouts.json'),portals=await json('portals.json'),safety=await json('safety.json'),old=await json('old-regression.json'),legacy=await json('legacy-regression.json'),upgrade=await json('upgrade.json');
assert.equal(flows.length,24);assert.equal(corners.length,24);assert.equal(new Set(layouts.map(l=>[l.id,l.width,l.stage,l.lab].join(':'))).size,432);assert.equal(portals.length,18);assert.equal(old.length,70);assert.equal(legacy.states.length,8);assert.equal(legacy.topics.length,5);assert.ok(Object.values(safety).every(v=>v===true));assert.ok(upgrade.fieldsUnchanged&&upgrade.legacyPreserved&&upgrade.newAllFresh);
for(const l of elective2Lessons){const r=flows.find(f=>f.id===l.id);assert.ok(r?.complete);assert.equal(r.quizzes,l.quizzes.length);assert.equal(r.steps,l.examples.reduce((s,e)=>s+e.steps.length,0));}
const fixture=await readFile(new URL('docs/testing/v0.7/fixtures/v0.6-actual-module.json',root),'utf8'),restored=restoreModule(fixture),before=JSON.parse(fixture);assert.equal(Object.keys(before.lessons).length,70);
for(const [id,s] of Object.entries(before.lessons))assert.deepEqual(restored.lessons[id],s,id);
for(const l of elective2Lessons)assert.equal(lessonProgress(l,restored.lessons[l.id]),0);
const coverage=await json('docs/requirements/source-coverage-v0.7.json',root);assert.equal(coverage.paragraphs.length,120);assert.ok(coverage.paragraphs.every(p=>p.targets.length&&p.targets.every(t=>elective2Lessons.some(l=>l.id===t.lesson))));
const units=await readFile(new URL('unit-tests.txt',run),'utf8');assert.match(units,/tests 74/);assert.match(units,/pass 74/);assert.match(units,/fail 0/);
const siteFiles=manifest.files.filter(f=>f.path.startsWith('site/')),http=[];
for(const f of siteFiles){const r=await fetch('http://127.0.0.1:4177/'+f.path.slice(5));assert.equal(r.status,200);const actual=await r.text(),expected=await readFile(new URL(f.path,root),'utf8');assert.equal(actual,expected,f.path);http.push({path:f.path,status:r.status,mime:r.headers.get('content-type'),match:true});}
for(const path of ['package.json','docs/requirements/requirements-v0.7.md','高中知识点/高中数学选择性必修二知识点考点整理.docx']){const r=await fetch('http://127.0.0.1:4177/'+encodeURI(path));assert.equal(r.status,404);http.push({path,status:r.status});}
assert.ok(siteFiles.every(f=>!f.path.endsWith('.docx')));const application=await readFile(new URL('site/module-app.mjs',root),'utf8');assert.ok(!/https?:\/\//.test(application));
const files=await readdir(new URL('docs/testing/v0.7/',root));for(const f of ['test-plan.md','cases.md','data.md','defects.md','test-summary.md','traceability.md'])assert.ok(files.includes(f));
await writeFile(new URL('local-http.json',run),JSON.stringify(http,null,2));
const sum=key=>flows.reduce((s,r)=>s+r[key],0),report={candidate:manifest.candidate,checkedAt:new Date().toISOString(),frozenFiles:manifest.files.length,sourceFiles:5,unchangedMovedSources:4,sourceParagraphs:120,unitTests:74,newCourses:24,experiments:sum('labs'),experimentCases:sum('cases'),examples:sum('examples'),steps:sum('steps'),quizzes:sum('quizzes'),corners:corners.reduce((s,r)=>s+r.corners,0),invalidInputs:corners.reduce((s,r)=>s+r.invalidInputs,0),layouts:432,portals:18,safety:Object.keys(safety).length,oldNormal:70,oldLegacy:1,oldLabCases:old.reduce((s,r)=>s+r.cases,0),websiteFiles:siteFiles.length,localCriteria:'AC-056–064 PASS',releaseGate:'LOCAL_PASS; external AC-065 publication pending'};
await writeFile(new URL('preflight.json',run),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
