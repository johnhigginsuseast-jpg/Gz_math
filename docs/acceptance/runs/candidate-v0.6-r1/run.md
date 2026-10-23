# 必修二 v0.6 独立验收 / candidate-v0.6-r1

- 基线：已确认requirements-v0.6.md、criteria-v0.6.md与28课source-map-v0.6.md；用户回复“确认 v0.6，继续开发”。
- 冻结：manifest.json记录57个源码/测试/基线文件；冻结时HEAD 52950f946b7168139694e3f5e73d70e452ef1d2b加工作树校验值，不冒称提交已包含新代码。
- 环境：Windows、本机Node v24.21.0、IAB实际CSS宽390/768/1440；本轮QA端口4177。真实v0.5源码快照在4178，用户4175数据未用于注入。
- 最终结论：AC-046–055共10项全部PASS，v0.6正式交付；源码11b5baff29501120ed1531527c280fe9d92fd6fc已上传并成功发布GitHub Pages。

| AC | 实测与证据 | 结论 |
|---|---|---|
| AC-046 | portals.json三宽度首页及五模块18页；课程71、book2五章28课；full-flows/layouts验证新路由，old-regression/legacy-regression验证旧43课 | PASS |
| AC-047 | unit-tests.txt向量、SSA临界及广泛角边代回；source-coverage-v0.6.json实际落点；向量8课全流程与默认/全部预设，control-corners全部边界 | PASS |
| AC-048 | 独立复数四则/除零/共轭/模旋转测试；复数3课所有例题、练习及参数端点；0不误分类纯虚，选学明确 | PASS |
| AC-049 | 空间8课完整流程与边界；斜二测/展开/体积/切接/垂距独立值、定理条件与例题审阅；二面150°保留而非改30° | PASS |
| AC-050 | 统计5课、百分位整数/非整数及0/100、分层层间方差、仿射变换与直方图面积独立检查；全部默认/预设与角点 | PASS |
| AC-051 | 概率4课、两骰36点/编号球有无放回/独立与互斥/0和1事件；固定种子轨迹及累计计数，模拟与理论明确分离 | PASS |
| AC-052 | full-flows.json：28课、56实验217默认/预设情形、88例题264步骤、140练习先错后对；布局遍历新文档重新恢复100%；construction.json显示构造期间结论隐藏、观察禁用 | PASS |
| AC-053 | v0.5-browser-fixture.json记录旧版实际UI生成24课，合并原实际QA18课与legacy键；upgrade.json逐字段42课/legacy字节保留；safety.json十三项异常/重置/键盘通过，control-corners.json另含224次非法输入 | PASS |
| AC-054 | layouts.json 504个唯一新课阶段/实验状态与portals.json18页；三种真实CSS宽下无页面/主要控件/图形文字越界；integrity.json原四DOCX哈希不变、37网页文件无内部材料 | PASS |
| AC-055 | 61/61测试、语法退出0、旧43课回归及七类资料通过；远端源码11b5baf核对，Actions 39935981596为success；37线上文件与候选一致，公开b2-frequency实际完成实验/例题/练习并刷新保持100%，原浏览器记录恢复。见publication/public-http/public-browser-flow.json | PASS |

## 异常与证据边界

- BUG-016的SSA临界浮点错误已修复并复测；首失败保留在testing/v0.6/executions/vector-first-failure.txt，未改期望规避问题。
- 首次整体测试因旧测试写死4模块有2项失败，保留记录并在保持原模块断言的同时新增第五模块断言；最终冻结61项全通过。
- 首个含动画的Runtime.evaluate观察超时，读取同一页面发现已完成100%，确认执行终态后重置该QA课并以更长命令观察时限重跑；最终full-flows保留有返回结果的一轮。数次暂停文档响应通过读取同一标签页状态后继续，没有重启课程任务。
- reset-first-check.json的初始比较失败源于CDP结构化值键序与跨上下文对象原型；reset-check-explanation.json将结构化返回归一为普通JSON后按字段比较，实际仅b2-frequency改变，其余69个普通课程状态相同，无产品修复。
- 读异常采用替换QA的app容器、注入Storage.getItem抛错后重新导入同一module-app源码执行初始化，观察真实提示；随后恢复原方法并刷新。写失败与损坏记录也在QA站点注入并恢复，不宣称测试了实际浏览器权限设置。
- 源必修一DOCX被Word打开，普通Get-FileHash共享方式读失败；用FileShare.ReadWrite只读哈希后四文件与历史值一致，未关闭或改写用户文件。
- console-errors.json为空。真实手机/Safari与学生教学效果不在本轮基线内；模拟视口不代表实机结果。
- 公开浏览器首次标签页出现ERR_CONNECTION_RESET；新标签直接打开同一课程成功。早先复用的函数仍绑定失败标签，最终改用明确绑定有效标签的能力对象核验。公开课2实验8情形、3例题9步、5题先错后对及实际reload后100%通过，控制台无错误；测试前两键均为null，结束恢复，模块页为0/28。此网络/测试工具过程未改产品源码，失败未冒充成功。
