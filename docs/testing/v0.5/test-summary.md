# v0.5 测试总结

最终本地候选：candidate-v0.5-r2，55文件冻结。50项自动测试PASS、语法PASS；24课完整流程、192实验默认/预设、126控件边界、72例题216步、120题错误/订正/刷新PASS；447个唯一响应式布局PASS。旧19课回归PASS，旧18课记录逐字段保留、原课键字节一致，10项安全/恢复/键盘检查PASS，浏览器控制台错误0。来源130项映射至141个具体落点，24课按5/3/4/5/7分组；每课2实验/3例题/5练习。

BUG-014平移正切断点、BUG-015显示精度两项均已在r2复测关闭。r1因BUG-015退出，不作为交付候选。七类资料分别为test-plan/test-cases/test-data/defects/executions/traceability/本文件。

全部10项必需验收通过。AC-045外部上传/发布已核实：源码02eea8b推送GitHub main，Sites同一项目部署succeeded，仍仅所有者可访问；25网页文件与发布包一致，见独立验收run.md、archive-audit.json、publication.json。手机实机/Safari、真实学生效果和线上完整浏览器交互未测；模拟存储故障不代表真实设备配额验收。
