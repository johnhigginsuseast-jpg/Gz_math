# 独立验收记录 v0.3-r1

基线requirements-v0.3与criteria-v0.3。代码固定27文件manifest.json，Git基线4e29e70e4fe0cbbb30b12ab0b4ad815ed5855f24，未提交工作区由校验清单固定。验收期间未修改产品代码。

| 验收项 | 实测 | 结论 |
|---|---|---|
| AC-023 | 六个实际链接与预期一致；旧课回模块6/6；没有越界模块入口 | PASS |
| AC-024 | 0/90/135°、同横/纵坐标、两线四关系与距离、20例题中的相关应用；boundary-cases与数学不变量 | PASS |
| AC-025 | 配方r²=9/0/-1，点圆三关系，两圆七情况、公共点数、真实公共弦；相切交换240组无重复点 | PASS |
| AC-026 | 来源模块二段150–252逐项映射；反射、定点、圆系、阿波罗尼斯轨迹实际调参；勘误与条件进入知识/题目 | PASS |
| AC-027 | 空记录重新走五课，20分步例题、30练习全部正确；记录去重，错误订正，刷新，改答案撤销完成均符合 | PASS |
| AC-028 | 111布局无横向溢出；正文18px、阶段按钮16px；清空确认/取消只影响本课；旧键字节保留；错误输入/存储故障/损坏恢复/键盘通过 | PASS |
| AC-029 | 28自动测试/语法与HTTP隔离通过；原课全流程回归；27冻结文件不变，原两DOCX哈希一致；交付资料审计见completion-audit | PASS |

原始证据：fresh-flows.json、boundary-cases.json、safety-keyboard.json、layouts.json、console-errors.json、unit-tests.txt、syntax.txt、integrity-http.json；开发旧课回归见../../../testing/v0.3/evidence/dev-r1/legacy-regression.json。

结果：7 PASS，0 FAIL，0 BLOCKED，0必需项NOT_TESTED。手机实机、真实教学效果、公开部署未测试且不属必需门槛。测试异常与初始失败完整保留，无人工验收签字代填。
