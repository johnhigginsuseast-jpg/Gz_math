# 需求追踪矩阵 v0.4

| 需求 | 代码与来源 | 用例 | 验收 | 当前证据 |
|---|---|---|---|---|
| FR-025 | module-course.modules、module-app.layout/home、旧app返回；source-map-v0.4 | TC-039 | AC-030 PASS | hierarchy-initial.json、hierarchy-complete.txt、user-preview.json；480布局含四种地图页和19课旧/新链接 |
| FR-026 | solid-course、advanced-math/labs、spaceSvg | TC-040 | AC-031 PASS | flows.json六空间课、cases.json含全部截面与角边界；rotation.json 15空间图；unit-tests.txt |
| FR-027 | conic-course、advanced-math.conicLine/focalChord、advanced-labs | TC-041 | AC-032 PASS | flows.json七圆锥课、cases.json全部曲线预设；交点代回/面积/焦点弦不变量测试 |
| FR-028 | 通用实验/例题/练习界面、source-map-v0.4 | TC-042 | AC-033 PASS | 13课独立完整流程，32实验42例题68练习、134默认/预设、错误订正与刷新 |
| FR-029 | restoreModule/freshLesson/view、保存/清空、module.css | TC-043 | AC-034 PASS | upgrade-preservation.json、safety-keyboard.json九检查、layouts.json 480检查 |
| FR-030 | 保留旧course/state/math，server，全部测试与独立资料 | TC-044 | AC-035 PASS | 原28+新增13共41 PASS、syntax.txt、旧六课阶段/专题回归、integrity-http.json与完成审计 |

以上未写目录的证据均位于docs/acceptance/runs/candidate-v0.4-r1/。候选manifest.json固定36文件，验收期间未修改产品代码。测试数据与两个实际v0.3样本亦在固定清单中。
