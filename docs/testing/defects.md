# 缺陷记录 v0.1

## BUG-001 / P2 / CLOSED

- 关联：FR-001、AC-001，开发浏览器视觉审查。
- 现象：公园插图的两个公共点标记位于圆内，未准确落在圆周与道路交汇处。
- 首次证据：evidence/dev-20261022/01-scenario-desktop.jpg。
- 根因：装饰插图使用手工估计的交点坐标。
- 修复：按插图直线与圆的实际交点移动标记，控制误差小于0.1SVG单位。
- 复测：evidence/dev-20261022/layout-1440-stage-0.jpg及layout-390-stage-0.jpg可见两个点均落在圆周与道路的交汇处，原图保留。

## BUG-002 / P2 / CLOSED

- 关联：FR-005、NFR-001，开发边界审查。
- 现象：数值输入允许非规定步长，极接近相切时显示舍入可能使d、r均显示3但关系为相交。
- 修复：数值输入同时校验HTML stepMismatch，非规定步长保留上次有效图形并提示。
- 复测：浏览器B05输入3.0001和越界值，提示正确、图形保留；重置后恢复有效输入。见evidence/dev-20261022/browser-checks.json。

## BUG-003 / P2 / CLOSED

- 关联：FR-009、AC-008，存储异常分支审查。
- 现象：存储失败提示存在，但顶部徽标仍称“自动保存”，容易误解。
- 修复：存储失败时徽标同时切换为“临时会话”。
- 复测：浏览器B11故障注入模拟setItem抛错，提示及徽标同步，仍可进入图形构造；刷新撤除注入后自动保存恢复。截图evidence/dev-20261022/07-storage-unavailable.jpg。该证据是模拟故障，不代表测过真实配额耗尽或浏览器隐私策略。

## BUG-004 / P1 / CLOSED

- 关联：NFR-004、AC-011；候选candidate-v0.1-r1。
- 实测：Windows CMD启动入口出现中文文本及exit语句被错误解析为命令，详见acceptance/runs/candidate-v0.1-r1/launcher-failure.txt。
- 修复：启动器改为ASCII文本、CRLF换行，使用英文启动提示；文件名和网站继续使用中文。
- 复测：同一cmd命令在会话75958启动，无命令解析错误，GET / 返回HTTP200。见acceptance/runs/candidate-v0.1-r2/launcher-smoke.txt及http-smoke.txt。
