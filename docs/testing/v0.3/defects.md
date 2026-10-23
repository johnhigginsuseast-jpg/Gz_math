# 缺陷报告 v0.3

开发与验收发现的实际失败在此登记；不删除首次失败证据。源文数学勘误见需求文件，属于来源校对，非网站已发生缺陷。

| 编号 | 问题/首次证据 | 修复/状态 |
|---|---|---|
| BUG-010 | 两圆理论相切时浮点开方产生微小半弦，交换两圆后公共点数量1与2不一致。dev-r1/unit-tests.txt | CLOSED：切线类型令半弦为0；unit-tests-r2.txt中240组交换/平移全部通过，浏览器内外切均1点 |
| BUG-011 | 390视口下新课未显示清空入口，旧课的sidebar-bottom隐藏规则被继承。dev-r1/circles-390.jpg和浏览器AX | CLOSED：新课窄屏显示sidebar-bottom，候选三视口全部五新课入口可见；safety-keyboard.json确认取消/确认、Tab焦点、Esc和课程隔离通过 |

测试期望校正：反射实验M(-3,0)曾误写期望8.325，页面实际7.831；独立计算2+√34=7.8309519，页面正确。仅修正测试期望，记录见dev-r1/test-expectation-correction.txt。

验收脚本适配：导航后立即isVisible可能早于模块脚本渲染，改为等待入口可见再测；原失败与随后AX/样式证据见候选layout-observation-timing.json。跨浏览器隔离域数组用JSON内容比较，避免原型不同被deepStrictEqual误判。均未修改产品或验收门槛。

文件校验首次读取旧DOCX受Word占用失败，保留integrity-http-r1-fail.json；改用FileShare.ReadWrite的只读流成功校验原哈希，未关闭或写入原文件。最终integrity-http.json通过。
