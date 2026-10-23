# 网站部署记录（2026-10-23）

- 用户授权：继续上传 GitHub，并部署网站。
- Sites 项目：`appgprj_6adacf43102c81918c61cdddec609f75`。
- 已发布源码提交：`f5f699e68847ae1d31ca27f8470404292755f716`，保留此前两个本地提交。
- 已保存版本：`appgprj_6adacf43102c81918c61cdddec609f75~appgver_f99dd2a26de48191a32d0b4c97df6451`。
- 部署：`appgdep_6adad0aac9508191aae210c718abca26`，平台返回 `succeeded`。
- 地址：https://gz-math-learning-lab.flowyquail64.chatgpt.site
- 访问范围：Sites 默认 owner-private，仅所有者可访问，未改为公开。
- 打包范围：仅 `site/` 的 17 个网页文件，复制至忽略的 `dist/`；逐文件 SHA256 核对零差异。Word 原始材料、测试记录与本机配置不在网站静态目录。
- 部署包：忽略的 `outputs/geometry-site.tar.gz`。
- 应用代码未修改；此前 41 项自动测试与语法检查通过。本次未重新执行线上浏览器交互验收或真实手机验收。
- GitHub 目标：`https://github.com/johnhigginsuseast-jpg/Gz_math.git`；记录时本机 Git 正等待用户完成设备登录，不能将 Sites 源仓库同步视为 GitHub 上传完成。
