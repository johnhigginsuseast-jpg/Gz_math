# 必修二初始需求追踪 v0.6

状态：LOCAL_ACCEPTED_PUBLISHING；用户已回复“确认 v0.6，继续开发”。下表保留起草时的计划与NOT_TESTED历史状态，当前实测结果见下方补充。

| 需求 | AC / 计划TC | 范围 | 当前状态 |
|---|---|---|---|
| FR-039 | AC/TC-046 | 五模块、五章28课与旧43课导航 | NOT_TESTED |
| FR-040 | AC/TC-047,052 | 平面向量与解三角形8课 | NOT_TESTED |
| FR-041 | AC/TC-048,052 | 复数3课含选学表示 | NOT_TESTED |
| FR-042 | AC/TC-049,052 | 立体几何初步8课含选学方法 | NOT_TESTED |
| FR-043 | AC/TC-050,052 | 统计5课 | NOT_TESTED |
| FR-044 | AC/TC-051,052 | 概率4课 | NOT_TESTED |
| FR-045 | AC/TC-052 | 28课完整学习流程与全部新题 | NOT_TESTED |
| FR-046 | AC/TC-053 | 旧43课记录、隔离/异常/复现 | NOT_TESTED |
| FR-047 | AC/TC-055 | 冻结/回归/上传/Pages真实交互 | NOT_TESTED |
| NFR-009 | AC/TC-047–052 | 源段实质覆盖、订正/独立数学验证 | NOT_TESTED |
| NFR-010 | AC/TC-054 | 三视口、标签键盘与布局 | NOT_TESTED |
| NFR-011 | AC/TC-054–055 | 离线/静态边界、材料保留与发布 | NOT_TESTED |

## 当前实际落点与验证

- FR-039→module-course/module-app、book2-course；FR-040→book2-vectors/vector-labs/math；FR-041→book2-complex/complex-labs/math；FR-042→book2-solid/solid-labs与复用advanced模型；FR-043/044→book2-statistics/probability/data-labs/math。
- FR-045→共用五阶段、constructionGraph、56实验/88例题/140练习；FR-046→既有restoreModule/save与新增唯一ID、固定种子drawSample。FR-047→原pages.yml仅发布site、发布结果待完成。
- NFR-009的140源项256实际内容链接见requirements/source-coverage-v0.6.json；NFR-010→504布局+18入口、键盘与SVG文字检查；NFR-011→integrity包/源哈希与最终发布。
- 对应TC-046–054全部本地PASS；TC-055自动测试/旧课回归/冻结/材料部分通过，外部发布NOT_TESTED。逐项证据在candidate-v0.6-r1/run.md，不将未执行部分计为通过。
