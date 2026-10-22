# 候选 candidate-v0.1-r1 验收记录

- 日期：2026-10-22，Asia/Shanghai。
- 数学/状态/HTTP测试：12 PASS；语法检查PASS，见同目录原始日志。
- 启动入口验收AC-011：FAIL。Windows CMD执行UTF-8/LF中文批处理时出现若干“is not recognized as an internal or external command”报错；服务虽启动，入口不满足无错误运行要求。
- 原始执行：`cmd.exe /d /c .\启动几何实验室.cmd`，会话48640；失败片段见launcher-failure.txt。
- 处置：退出验收，回开发修复BUG-004；不得把r1标为通过。其余浏览器正式验收尚未执行，NOT_TESTED。
