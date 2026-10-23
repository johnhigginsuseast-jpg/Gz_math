# 独立验收 v0.5 / candidate-v0.5-r2

已确认基线requirements/criteria-v0.5；2026-10-23 Asia/Shanghai。本轮冻结期间未改55个候选文件，哈希与三份DOCX校验见integrity.json。r1发现BUG-015后退出，r2重新执行必需检查，未将r1结果替代本轮。

| AC | 实测 | 结论 | 证据 |
|---|---|---|---|
| AC-036 | 四模块43课；必修一五章24课；三宽度门户15检查、旧19课URL/阶段可用 | PASS | portals.json、old-regression.json |
| AC-037 | 集合/逻辑五课完整流程，独立集合/区间/量词答案，空集n=0与端点情形 | PASS | full-flows.json、unit-tests.txt、source-coverage-v0.5.json |
| AC-038 | 不等式三课，a正/负/0、Δ与端点、等号可达/不可达；已知值/解集采样代回 | PASS | unit-tests.txt、full-flows.json、control-corners.json |
| AC-039 | 函数四课，域/分段/五幂/奇偶/抽象和代数证明、分离常数与实际域；无导数前提 | PASS | full-flows.json、unit-tests.txt、source-coverage-v0.5.json |
| AC-040 | 指对五课，底数/真数/互逆/渐近线、二分保持异号区间、同号和不连续反例 | PASS | full-flows.json、unit-tests.txt、control-corners.json |
| AC-041 | 三角七课、单位圆/断点/负A与负ω/常值退化/辅助角a=0/五点/应用；平移正切复测 | PASS | full-flows.json、control-corners.json、defect-retests.json、unit-tests.txt |
| AC-042 | 每新课2实验3例题5练习；24课空进度走通，192默认/预设、216例题步骤、120题错/正/订正/刷新 | PASS | full-flows.json、lab/quiz-expectations、source-coverage-v0.5.json |
| AC-043 | 实际v0.4 QA18课字段和原课字节保留；10项重置/输入/键盘/损坏/拒读拒写/恢复为真 | PASS | upgrade.json、safety.json、user-preview.json |
| AC-044 | 三宽度504新课观测去重432+门户15=447唯一状态；无横向溢出；本地HTTP隔离、源哈希 | PASS | layouts.json、portals.json、safety.json、integrity.json、unit-tests.txt |
| AC-045 | 50测试/语法与旧19课回归通过，55文件一致；25网页文件与发布包一致；GitHub main远端02eea8b核对；同Sites项目部署succeeded且仅所有者访问 | PASS | manifest.json、unit-tests.txt、syntax.txt、old-regression.json、integrity.json、archive-audit.json、publication.json |

全部10项必需验收PASS，允许交付同一候选。上传/私有发布依据用户既定授权执行，原站点访问范围未扩大。真实手机与教学效果不属本轮必需且未测。未使用有截图平铺伪影的文件证明产品视觉通过；实际默认预览见docs/delivery/preview-v0.5.png。线上部署以平台成功返回及包一致证明，不冒充线上完整浏览器交互验收。
