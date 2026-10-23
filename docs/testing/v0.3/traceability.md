# 需求追踪矩阵 v0.3

候选固定：docs/acceptance/runs/candidate-v0.3-r1/manifest.json。开发证据不替代第二轮验收。

| 需求 | 代码/来源 | 用例 | 验收 | 证据 |
|---|---|---|---|---|
| FR-019 | boot.mjs、module-app.mjs首页/导航、app.mjs返回链接 | TC-030 | AC-023 PASS | fresh-flows.json、开发legacy-regression.json、最终preview |
| FR-020 | module-course.mjs的line/lines、module-math.mjs直线函数 | TC-031/032 | AC-024 PASS | boundary-cases.json、fresh-flows.json、unit-tests.txt |
| FR-021 | module-course.mjs的circle/circles、module-math.mjs圆函数 | TC-033/034 | AC-025 PASS | fresh-flows.json七情况、boundary-cases.json、unit-tests.txt |
| FR-022 | module-course.mjs的methods、原course/math；source-map-v0.3 | TC-035 | AC-026 PASS | source-module2.json、来源覆盖表、fresh-flows.json、旧课回归 |
| FR-023 | module-app.mjs阶段/实验/例题/答题、module-course状态 | TC-036 | AC-027 PASS | fresh-flows.json五完整课20例30练习、safety-keyboard.json |
| FR-024 | module-app保存恢复/输入/弹窗、module.css、server.mjs | TC-037 | AC-028 PASS | safety-keyboard.json、layouts.json 111项、console-errors.json |
| 全部/保留旧课 | tests/module.test.mjs与原tests、文档、候选清单 | TC-038 | AC-029 PASS | unit-tests.txt 28通过、syntax.txt、integrity-http.json、completion-audit.json |

表中未带目录的候选证据均位于docs/acceptance/runs/candidate-v0.3-r1/；开发旧课完整回归位于docs/testing/v0.3/evidence/dev-r1/。立体几何/圆锥曲线不纳入追踪，不伪造为已开发。
