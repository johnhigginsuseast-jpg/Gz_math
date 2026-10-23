# GitHub Pages 部署记录

- 用户于2026-10-23明确要求“将网站部署到github pages上”。本次仅增加托管配置，功能源码沿用已验收v0.5，不新增课程或改动学习记录。
- 仓库：https://github.com/johnhigginsuseast-jpg/Gz_math
- 公开网址：https://johnhigginsuseast-jpg.github.io/Gz_math/
- 发布提交：f4f3950236b50e00909e58da4b1d99c20700e1bb。
- [实际发布工作流](https://github.com/johnhigginsuseast-jpg/Gz_math/actions/runs/39921911153)：completed / success。
- Pages设置：build_type=workflow，public=true；使用.github/workflows/pages.yml，仅上传site目录。main的网页或工作流变更自动发布，支持workflow_dispatch。
- 原私有Sites配置和访问策略保留。本次公开发布不包含源DOCX、测试与项目文档；这些资料仍按原仓库权限提供。

## 实际验证

- npm test：50/50 PASS；npm run check：退出码0。
- 首页、boot.mjs、module-app.mjs、styles.css、assets/logo.svg均HTTP 200；脚本为text/javascript，CSS为text/css，SVG为image/svg+xml。
- site内25/25文件与公开站点内容一致（比较前统一Git正常转换的CRLF/LF换行）。初次直接比对本地字节与线上字节因Git换行转换不一致失败，确认app.mjs本地CRLF、线上LF后按文本逐一复核；未修改网页源码。
- 课程深链接 /Gz_math/?module=book&lesson=b1-set-concept：HTTP 200。
- /Gz_math/docs/requirements/requirements-v0.5.md：HTTP 404。
- 线上浏览器交互：NOT_TESTED。浏览器已识别网站标题，但创建/绑定标签页时两次超时，不能据此声称实验、练习等线上操作通过。

## 使用限制与维护

- 网址公开；学习记录仍存于当前浏览器的站点存储，新域名不会自动读取本地或Sites域名的旧记录。
- 本次未重新进行完整课程验收、手机实机和教学效果检查；沿用v0.5历史验收，并补充上述实际发布检查。
- 以后发布失败可在同一Actions工作流查看日志；回退网页时恢复所需版本的site文件并正常提交main，无须改写Git历史。
- 配置依据：[GitHub官方Pages工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
