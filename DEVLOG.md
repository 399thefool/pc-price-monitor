# 开发日志：PC Price Monitor

## 当前进度

项目已经完成第一阶段和第二阶段原型：

- 前端静态页面已上线到 GitHub Pages。
- 本地已搭建 Node 后端。
- 本地已接入 SQLite 数据库。
- 前端已经支持“后端优先，离线兜底”：
  - 如果能连上后端，就读取数据库行情。
  - 如果连不上后端，就继续显示本地模拟行情。
- 公网后端已部署到 Render。
- GitHub Pages 前端已指向公网后端地址。
- 价格录入面板已加入前端。
- 后端价格记录已增加来源和时间字段。
- `/api/prices` 已支持可选管理员口令。

线上前端地址：

```text
https://399thefool.github.io/pc-price-monitor/
```

公网后端地址：

```text
https://pc-price-monitor.onrender.com
```

最新说明：

- 当前本地代码已经更新完。
- 线上 Render 还需要重新部署一次，才能看到最新接口和前端面板。
- 你需要把刚改过的文件重新上传到 GitHub，触发 Render 自动部署。

本地项目目录：

```text
E:\桌面\自制网页\pc-price-monitor
```

## 已完成内容

前端功能：

- 电脑配件分类选型
- 自动计算整机总价
- 显示预算占用
- 显示 7 日 / 30 日 / 90 日价格走势
- 显示 30 日涨跌幅
- 显示简单上涨 / 下跌预测
- 显示配置兼容性提示
- 导出配置清单

后端功能：

- `GET /api/health`：后端健康检查
- `GET /api/parts`：读取配件、当前价格和 90 天历史价格
- `POST /api/market/tick`：模拟刷新行情并写入数据库
- `POST /api/prices`：手动写入某个配件的新价格
- `POST /api/builds`：保存用户配置单
- `GET /api/builds`：读取最近保存的配置单

数据库：

- 使用 SQLite
- 数据库文件本地生成在：

```text
server\data\market.sqlite
```

这个数据库文件不用上传 GitHub，已经被 `.gitignore` 忽略。

## 重要文件

```text
index.html          前端页面结构
styles.css          前端样式
app.js              前端交互和数据展示
config.js           前端后端地址配置
package.json        Node 项目启动脚本
server/index.js     后端 HTTP 服务
server/database.js  SQLite 数据库逻辑
server/parts-data.js 配件种子数据
README.md           项目运行说明
DEVLOG.md           本开发日志
```

## 下次继续时怎么启动

打开 PowerShell，进入项目目录：

```powershell
cd E:\桌面\自制网页\pc-price-monitor
```

启动本地后端：

```powershell
node server/index.js
```

然后浏览器打开：

```text
http://localhost:3000
```

如果页面顶部显示“后端已连接”，说明前端已经在读本地数据库。

健康检查地址：

```text
http://localhost:3000/api/health
```

## 下次建议做什么

下一步如果继续做，建议优先做“真实数据接入”和“持久化升级”：

1. 把真实商品价格源接进来。
2. 增加价格抓取定时任务。
3. 把 SQLite 换成更适合公网长期保存的数据库，比如 Supabase / PostgreSQL。
4. 给配件加入商品链接和来源备注。
5. 做价格提醒功能。

如果要改功能，建议先改后端，再改前端展示。

注意：Render 免费服务的文件系统不是长期持久化的，SQLite 数据可能在服务重启后重新生成。现在已经能跑通公网链路，但长期稳定保存数据还是建议换成 Supabase / PostgreSQL。

## 这一步你要做什么

1. 把这次更新过的文件重新上传到 GitHub。
2. 等 Render 自动重新部署。
3. 打开 `https://pc-price-monitor.onrender.com/api/health` 看是否正常。
4. 刷新 GitHub Pages 页面，确认前端出现“价格录入”面板。

## 之后可以继续扩展

- 接真实商品价格源
- 加商品链接管理
- 加价格采集定时任务
- 加用户账号
- 加配置单保存和分享
- 加价格提醒
- 把 SQLite 换成 PostgreSQL / Supabase
- 把简单预测升级为更稳定的趋势模型

## 今天停在这里

本地测试后端已经停掉。如果下次要继续开发，按上面的“下次继续时怎么启动”操作即可。
