# 几何实验室 高中数学四模块

GitHub 仓库：Gz_math。公开网站：[GitHub Pages](https://johnhigginsuseast-jpg.github.io/Gz_math/)。原 [Sites 网站](https://gz-math-learning-lab.flowyquail64.chatgpt.site)仍仅所有者可访问。

main 分支的 `site/` 或 Pages 工作流更新后自动部署；也可在 Actions 中手动运行 Deploy GitHub Pages。仅发布 `site/`，部署记录见 [GitHub Pages 交付记录](docs/delivery/github-pages.md)。不同网站地址的学习记录不会自动互通。

高中数学探究网站v0.5。四个同级模块：立体几何6课、直线与圆的方程6课、圆锥曲线7课、必修一五章24课，共43课、141道分步例题、233道练习。必修一新增48实验、72例题、120练习；保留原19课与学习记录。

## 启动

需要Node.js 24，不需要安装npm依赖。Windows双击“启动几何实验室.cmd”，或在本目录运行：

```powershell
npm.cmd start
```

打开 http://127.0.0.1:4175/ ，保持终端运行，Ctrl+C停止。端口占用时保留原服务，或临时设置 `$env:PORT=4176; npm.cmd start` 并打开对应地址。不同端口记录互相隔离。

## 页面层级

- 总首页 `/`：立体几何、直线与圆的方程、圆锥曲线、必修一四个同级入口。
- 模块页 `/?module=solid`、`/?module=lines`、`/?module=conics`、`/?module=book`：只列本模块课程，必修一按五章分组。
- 课程页如 `/?module=solid&lesson=space-angles`：情景→实验与观察记录→知识→分步例题→练习。
- 原 `/?lesson=line` 等六个旧链接仍可用，原直线与圆课 `/?lesson=line-circle` 保留八环节。
- 课程侧栏可回本模块/总首页，顶部四个同级模块可直接切换；必修一侧栏按章展开。

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

四模块目录、旧模块内容与状态在site/module-course.mjs；空间/圆锥课程在solid-course.mjs、conic-course.mjs；必修一入口book-course.mjs及五个book章节文件，数学book-math.mjs，实验book-labs.mjs。共用界面module-app.mjs，原直线与圆仍用app/course/math/state.mjs。课程模板见docs/template-guide.md，必修一来源追踪见docs/requirements/source-map-v0.5.md。

原始Git基线4e29e70e4fe0cbbb30b12ab0b4ad815ed5855f24及各版历史保留。v0.4已上传并私有发布；v0.5须以本轮独立验收/发布记录判断完成状态，见docs/project-status.md。手机实机与真实教学效果不以浏览器模拟替代。
