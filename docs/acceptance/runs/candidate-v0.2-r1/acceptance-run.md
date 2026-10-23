# v0.2独立验收 / candidate-v0.2-r1

- 时间：2026-10-23，Asia/Shanghai；本轮工作开始于2026-10-22。
- 基线：需求v0.2、验收标准v0.2；用户明确授权先保存旧版再改版。新标准替代旧版对应数量/内容要求，旧证据仅作历史记录。
- 版本：Git HEAD为改动前保存点4e29e70；新候选是未提交工作区，由candidate.json固定完整输入，未把旧HEAD当作新代码版本。
- 执行者：AI；从清空后的测试浏览器重新执行，验收中未改功能代码。测试端口4176，与用户4175记录隔离。

| AC | 结果 | 独立证据 |
|---|---|---|
| AC-013 | PASS | 三宽度各20状态、60唯一记录；正文≥18px、控件≥16px、缩放后图形标签≥15px；layouts.json与10-mobile-tangents.jpg |
| AC-014 | PASS | 85次连续采样、暂停进度2.49995稳定、单步/继续/重播/减少动态模式，公式最后显示；animation-samples.json、02-continuous-circle-paused.jpg |
| AC-015 | PASS | r3时d0/2/3/4对应6/4.47/0/无弦，图数联动；r5d3例题结果8由数学测试与例题验证；04-chord-mobile.jpg、tests.txt |
| AC-016 | PASS | 到y4最小1最大7，到y2最小0最大5，到E(2,0)最小1最大5，动点实际到达；720点采样独立验证；browser-results.json、tests.txt |
| AC-017 | PASS | 绕F旋转、竖直x4、键盘步进，181方向不变量，k=±3/√7与参数分组题；browser-results.json、tests.txt |
| AC-018 | PASS | 切点(3,0)竖直切线；E5两线3x±4y=15、圆上1条/圆内0条，平移圆公式；05-two-tangents-desktop.jpg、tests.txt |
| AC-019 | PASS | 五题型、7例题28步、15题逐一错误/修正，多选漏选和重复提交，14/15不能完成、15/15为100%，小结公式完整；06/07截图 |
| AC-020 | PASS | 独立旧版记录在真实浏览器迁移，3轮、2例和6题保留，新题未答，50%且不能完成；新模式和值刷新恢复；08-v1-upgrade-incomplete.jpg |
| AC-021 | PASS | 390宽度重走基础学习链路与错误门槛，键盘/清空/故障恢复，npm启动、HTTP隔离、loopback；03/09截图、startup-smoke.txt、tests.txt |
| AC-022 | PASS | 15份必需资料齐全，22个冻结文件与源DOCX校验一致，原Git提交不变，普通Git可用，所有反馈/缺陷关闭；delivery-audit.txt |

整体结论：PASS，10/10必需验收项通过，交付candidate-v0.2-r1。模拟媒体查询/存储失败不代表真实系统偏好配置、存储配额或手机实机结果；不代替用户对改版体验的评价。测试端口已恢复首次学习状态，4175端口用户记录未触碰。
