# PC Price Monitor

一个电脑配件价格监控和线上装机选型原型。

## 本地运行

```bash
node server/index.js
```

打开：

```text
http://localhost:3000
```

接口健康检查：

```text
http://localhost:3000/api/health
```

## 主要接口

- `GET /api/parts`：读取配件、当前价和 90 天历史价格
- `POST /api/market/tick`：模拟刷新行情并写入 SQLite
- `POST /api/prices`：手动写入某个配件的新价格
- `POST /api/builds`：保存用户配置单
- `GET /api/builds`：读取最近保存的配置单

## 上线说明

GitHub Pages 只能托管前端静态文件，不能运行 Node 后端。后端需要部署到 Render、Railway、Fly.io、Vercel Serverless 或其他云服务器。

后端部署完成后，把 `config.js` 里的 `REMOTE_API_BASE_URL` 改成后端公网地址，再上传到 GitHub。
