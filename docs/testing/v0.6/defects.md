# v0.6缺陷记录

尚未执行正式测试，不能记为“无缺陷”。实际缺陷编号续用BUG-016起，保留首失败、复现/期望/实际、修复与复测证据；未关闭的必需偏差禁止交付。

## BUG-016 / P2 / VERIFIED

- 关联FR-040、AC-047；开发中book2-math.mjs的triangleSSA。
- 输入a=2、b=4、A=30°。预期高度临界只一个B=90°；实际浮点sin30°略小于0.5，asin返回两个相差约微度的角，误计两解。
- 首次失败：executions/vector-first-failure.txt，两测试失败；未隐藏或改期望。
- 修复：sineB与1之差<1e-12时先归为1，再去重候选；函数原有超域容差同为1e-12。复测须核对临界及广泛SSA解代回。
- 复测：executions/vector-retest.txt三项通过，后续独立答案表与28课开发浏览器验证中SSA全部预设通过。

## 测试清单适配记录

首次全套59项中57通过、2失败（executions/development-all-tests.txt）；原因是旧测试硬编码模块数4。保留原四模块内容断言，并由新测试单独断言第五模块/71课，不删兼容测试；executions/development-retest.txt为59/59通过。后续新增独立答案表测试另行执行，不能将旧59数量冒充最终数量。
