# v0.8测试数据

静态期望：四教材模块顺序book/book2/elective1/elective2、课数24/28/19/24；elective1章节依次solid6/lines6/conics7。十九课程ID取原v0.7记录，与课程对象字段逐项对照。旧查询参数保持原solid/lines/conics。localStorage键geometry-module-v1/version1、geometry-lab-v1/revision2均保持。

旧普通课记录组合来源：testing/v0.7/fixtures/v0.6-actual-module.json的70条实际记录，acceptance/runs/candidate-v0.7-r1/completed-new-module.json的新24条实际记录；独立旧键取v0.7实际夹具。组合仅择取现有字段，不制造新完成状态。经v0.7页面实际读取/保存后捕获本轮快照。浏览器宽1440/768/390；所有临时记录在隔离端口操作，线上两键先备份后恢复。
