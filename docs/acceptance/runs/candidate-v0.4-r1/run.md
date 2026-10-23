# 独立验收记录 v0.4-r1

基线requirements-v0.4与criteria-v0.4，用户授权为继续制作两模块且三模块同级。候选manifest.json固定36文件，Git基线4e29e70e4fe0cbbb30b12ab0b4ad815ed5855f24；未提交工作区由文件校验固定。验收期间未修改产品代码。

| 验收 | 实测与证据 | 结论 |
|---|---|---|
| AC-030 | 总首页三个module-tile同级链接；模块内6/6/7课，13新课完成返回本模块，旧六链接/全部模块返回和顶部切换；hierarchy-initial/complete、user-preview、480布局 | PASS |
| AC-031 | 六空间课完整新流程；16空间实验所有默认/预设，15可旋转图数值/键盘稳定；含150°二面角、线面包含、异面、球截面/正方体截面、翻折/展开；flows/cases/rotation与数学不变量 | PASS |
| AC-032 | 七圆锥课完整流程，16实验含两轴与四向、焦点弦竖直、切线、有效二次式三态/降次、中点实弦/退化/空/中心、最值/定点定值；flows/cases及独立代回测试 | PASS |
| AC-033 | 空新课记录重新走13课，32实验、134情况、42例题126步、68练习，错观察阻止记录、错误订正、未答完不完成、刷新100%；source-map逐项来源覆盖 | PASS |
| AC-034 | 真实v0.3两个样本保留，oldModule五课原字段相同、旧键字节相同；九安全/键盘项PASS，480布局在1440/768/390均不溢出；用户4175刷新未改变学习键 | PASS |
| AC-035 | 41自动测试/语法PASS；旧六课各阶段与专题回归，HTTP公开22路径、拒绝11私有路径；36文件不变、两DOCX哈希不变，资料完整审计 | PASS |

原始证据均在本目录：flows.json、cases.json、rotation.json、layouts.json、upgrade-preservation.json、safety-keyboard.json、console-errors.json、unit-tests.txt、syntax.txt、integrity-http.json、user-preview.json、completion-audit.json。

结果6 PASS，0 FAIL，0 BLOCKED，0必需项NOT_TESTED。手机实机、真实教学效果、公开部署未执行且不属于本轮门槛；不代签人工试用认可。历史工具审批超时已恢复，测试后恢复所有故障注入。
