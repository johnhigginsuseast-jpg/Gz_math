# 初始需求追踪 v0.5

状态：已确认v0.5，最终候选r2本地执行通过；TC-036–045见test-cases.md。共享界面site/module-app.mjs，课程/实验/数学在site/book-*.mjs。完整原始证据见docs/acceptance/runs/candidate-v0.5-r2/；外部发布结果另记。

| 需求 | 独立验收 | 初始验证场景 | 代码/真实结果 |
|---|---|---|---|
| FR-031 | AC-036 | 四模块、五章24课与旧路由 | 已实现 / 本地PASS |
| FR-032 | AC-037,042 | 集合逻辑五课、边界与覆盖 | 已实现 / 本地PASS |
| FR-033 | AC-038,042 | 不等式三课、降次/等号/解集 | 已实现 / 本地PASS |
| FR-034 | AC-039,042 | 函数四课、定义域/性质/模型 | 已实现 / 本地PASS |
| FR-035 | AC-040,042 | 指对五课、条件/互逆/零点 | 已实现 / 本地PASS |
| FR-036 | AC-041,042 | 三角七课、构造/变换/恒等/模型 | 已实现 / 本地PASS |
| FR-037 | AC-042 | 24课完整学习闭环与72/120最低内容 | 已实现 / 本地PASS |
| FR-038 | AC-043 | 原始结构兼容、隔离、错误/重置 | 已实现 / 本地PASS |
| NFR-006 | AC-037–042 | 来源每个知识考点/订正落点与独立数学核对 | 已实现 / 本地PASS |
| NFR-007 | AC-044 | 三宽度全阶段全实验、键盘标签 | 已实现 / 本地PASS |
| NFR-008 | AC-044–045 | 无远程依赖、私有资料、冻结/回归/发布 | 已实现 / 本地PASS |

具体关联：FR-032→book-sets/TC-037；FR-033→book-inequalities/TC-038；FR-034→book-functions/TC-039；FR-035→book-explog/TC-040；FR-036→book-trig/TC-041；FR-031/037/038→module-course/module-app/book-labs与TC-036/042/043。NFR-006的源段→实际知识卡/例题索引见source-coverage-v0.5.json；NFR-007/008→TC-044/045，AC-045部署部分当前IN_PROGRESS。
