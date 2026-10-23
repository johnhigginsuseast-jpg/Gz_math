# v0.7执行记录索引

正式候选：docs/acceptance/runs/candidate-v0.7-r1/manifest.json，64文件、五份DOCX；来源四份旧文件仅移动，哈希与v0.6相同。

- 自动：unit-tests.txt（74/74）、syntax-check.txt；开发首失败另存testing/v0.7/first-unit-failure.txt。
- 实际浏览器：full-flows.json、control-corners.json、layouts.json、portals.json、safety.json（首次检查safety-first.json保留）、upgrade.json、old-regression.json、legacy-regression.json。
- 实际旧版夹具：v0.6-fixture-flows.json；testing/v0.7/fixtures/v0.6-actual-module.json和v0.6-actual-legacy.json。由7b4f95a快照页面生成，42旧记录来自已存真实v0.5夹具，28课再在v0.6实际页面完成；减少动态效果用于夹具生成，新课构造另实测。
- 本地HTTP/冻结复核：local-http.json、preflight.json。公开发布证据为publication.json、public-http.json、public-browser-flow.json和completion-audit.json，已核验通过。

原始记录由浏览器实际点击、输入、重载或自动断言产生。模拟CSS视口不等于真手机；数学内容语义以源段复核、独立答案和解析推理共同核验，不把结构检查当全部数学证明。
