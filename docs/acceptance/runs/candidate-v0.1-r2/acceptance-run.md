# 独立验收 candidate-v0.1-r2

- 日期：2026-10-22，Asia/Shanghai。
- 基线：requirements-v0.1、criteria-v0.1，用户已明确要求实施。
- 执行主体：AI，在冻结候选上从清空状态重新实际走通；本轮未修改功能代码。
- 环境：Windows 10.0.22631.0，Node v24.21.0 / npm11.19.0，内置Chromium浏览器；loopback本地服务。
- 候选：candidate.json内21个文件SHA256；integrity-check.txt核对一致。

| AC | 结果 | 实测及证据 |
|---|---|---|
| AC-001 | PASS | 初始猜想前无反馈，选择后进入下一步；插图公共点修正，01-start-desktop.jpg |
| AC-002 | PASS | 分步、播放、暂停、重播，4/4完成后显示公式；browser-results.json |
| AC-003 | PASS | 三轮重新记录2/1/0公共点，未到目标/错误观察不能通过；02-guided.jpg |
| AC-004 | PASS | 三判据、通用距离公式及适用条件，答错不能解锁；browser-results.json |
| AC-005 | PASS | 水平/斜线/竖直、负偏移、d=0、r边界、交点数、重置与非法输入；03-explore-desktop.jpg、tests.txt |
| AC-006 | PASS | 两题8步，结论与绝对值两分支正确；browser-results.json |
| AC-007 | PASS | 六题逐一错答、修正，多选漏选和重复提交，错误历史与6/6完成；04-summary.jpg |
| AC-008 | PASS | 刷新恢复记录和答案、清空确认/取消、损坏JSON、模拟写入故障可继续；05-storage-fault.jpg，故障已撤除 |
| AC-009 | PASS | 三宽度×八环节无溢出/等比例，键盘与焦点通过；layouts.json及layout-*-explore.jpg |
| AC-010 | PASS | HTTP资源/隔离/响应头测试通过；仅127.0.0.1监听；tests.txt、network-and-source-audit.txt |
| AC-011 | PASS | 实际CMD启动无解析错误并HTTP200，README和模板说明齐全；launcher-smoke.txt、http-smoke.txt |
| AC-012 | PASS | 七类测试资料和全部14份必需资料齐全，21个候选文件及源DOCX校验一致，4缺陷关闭；delivery-audit.txt |

整体结论：PASS，12/12必需验收项通过；无未关闭需求偏差。允许交付candidate-v0.1-r2的当前本地源码与资料。browser-results.json记录本轮12项实测结果。r1失败记录保留。

本轮有一次自动等待超时，随后实际DOM已完成构造且无错误；详见测试执行记录。不承诺特定动画时延。存储写入异常属于故障注入，不代表真实磁盘/配额或隐私环境结果。没有人工签字门槛，也没有代替用户评审审美或学生学习效果。
