# 几何实验室 高中数学四模块

GitHub 仓库：Gz_math。公开网站：[GitHub Pages](https://johnhigginsuseast-jpg.github.io/Gz_math/)。原 [Sites 网站](https://gz-math-learning-lab.flowyquail64.chatgpt.site)仍仅所有者可访问。

main 分支的 `site/` 或 Pages 工作流更新后自动部署；也可在 Actions 中手动运行 Deploy GitHub Pages。仅发布 `site/`，部署记录见 [GitHub Pages 交付记录](docs/delivery/github-pages.md)。不同网站地址的学习记录不会自动互通。

高中数学探究网站v0.8。四个同级模块：必修一五章24课、必修二五章28课、选择性必修一三章19课、选择性必修二两章24课，共95课、301道分步例题、493道练习。选择性必修一按立体几何6课、直线与圆的方程6课、圆锥曲线7课组织；选择性必修二仍为数列11课、导数13课。课程内容、ID、旧链接及两类学习记录保留。原始资料按用户整理放在高中知识点目录，未改写内容。

## 启动

需要Node.js 24，不需要安装npm依赖。Windows双击“启动几何实验室.cmd”，或在本目录运行：

```powershell
npm.cmd start
```

打开 http://127.0.0.1:4175/ ，保持终端运行，Ctrl+C停止。端口占用时保留原服务，或临时设置 `$env:PORT=4176; npm.cmd start` 并打开对应地址。不同端口记录互相隔离。

## 页面层级

- 总首页 `/`：必修一、必修二、选择性必修一、选择性必修二四个同级入口。
- 模块页 `/?module=book`、`/?module=book2`、`/?module=elective1`、`/?module=elective2`：必修一/二各五章、选择性必修一三章、选择性必修二两章；旧solid/lines/conics模块链接仍打开选择性必修一。Pages地址保留`/Gz_math/`前缀后追加查询参数。
- 课程页如 `/?module=solid&lesson=space-angles`：情景→实验与观察记录→知识→分步例题→练习。
- 原 `/?lesson=line` 等六个旧链接仍可用，原直线与圆课 `/?lesson=line-circle` 保留八环节。
- 课程侧栏可回本模块/总首页，顶部四个同级模块可直接切换；各教材模块侧栏按章展开。

## 使用与数据

先选择猜想，再点击验证构造图形；每个实验一次改变一个参数，选对实际观察后记录，随后出现条件与公式。数值框、滑块和键盘均可使用。空间实验提供水平旋转、抬高视角；视角只改变投影，不改变真实数学量，不能直接从投影量角或量长度。

例题逐步展开，练习判分并支持订正；全部答对后方可完成。修改练习答案会撤销相应完成状态。模块统计各自课程，不把原模块完成率当新课完成率。

旧直线与圆仍用geometry-lab-v1（revision2）；其余课程继续用geometry-module-v1（version1），按课程ID隔离。升级保留已有记录，新课初始未学；清空须确认且只影响当前课。记录只在当前浏览器，清除站点数据会丢失，无账号或云同步；存储失败会提示临时会话。

本地运行不依赖互联网，不发送学习数据；线上访问需要网络。网页服务及部署包只公开site/网页资源，源DOCX、测试与项目资料保留在源码仓库中。

## 检查与维护

```powershell
npm.cmd test
npm.cmd run check
```

四模块目录、选择性必修一三章归类、旧模块别名与状态在site/module-course.mjs；空间/圆锥课程在solid-course.mjs、conic-course.mjs；必修一入口book-course.mjs，必修二入口book2-course.mjs。选择性必修二入口elective2-course.mjs及其课程/实验/数学文件保持；复用原有图形、表格、进度和课堂界面。课程模板见docs/template-guide.md，数学内容来源追踪见docs/requirements/source-map-v0.7.md及source-coverage-v0.7.json，目录调整需求见requirements-v0.8.md。

原始Git基线4e29e70e4fe0cbbb30b12ab0b4ad815ed5855f24及各版历史保留。本轮v0.8验收与发布状态见docs/project-status.md、docs/delivery/v0.8.md；原私有Sites保持v0.5。数学实验为固定函数族，不是任意表达式求导器；手机实机与真实教学效果不以浏览器模拟替代。
