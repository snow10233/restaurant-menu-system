# ADR 0001: 初期技術選型

## 狀態

接受

## 背景

本系統初期服務單一餐廳，尖峰約 70 位客人。需求重點是 QR Code 點餐、庫存開關、訂單狀態、現場操作穩定，不需要多分店、金流、發票、外送平台或離線本地端。

目前已建立前後端分離的 workspace。系統規模不大，但點餐、購物車、庫存開關、廚房狀態與錯誤處理會快速累積互動狀態，因此需要前端框架。

## 決策

正式開發採用：

- Monorepo：npm workspaces
- Frontend：Nuxt + Vue + TypeScript
- Styling：Tailwind CSS
- Backend：NestJS + TypeScript
- Database：PostgreSQL
- ORM：Prisma 或 Drizzle
- Cache/Queue：Redis
- Runtime：Docker Compose 起步

## 理由

- Nuxt 是 Vue 生態中對應全功能前端框架的選擇，能提供路由、SSR、資料取得與部署結構。
- Vue 3 的 Single-File Component 結構直覺，適合將菜單、購物車、詳情頁、店員控制台拆成小元件。
- Tailwind CSS 能快速建立一致的作業型 UI，避免早期累積大量手寫 CSS。
- NestJS 適合建立結構化 API、權限、驗證與商業邏輯。
- PostgreSQL 適合處理訂單交易、資料一致性與報表查詢。
- Redis 可在正式版中支援即時狀態、佇列、限流與快取。

## 影響

- 目前前端仍使用展示資料，尚未處理真實資料持久化。
- 後續接後端時，需將菜單、庫存、訂單與桌號 session 改由 API 提供。
- 已移除舊靜態原型與先前的前端殼，避免多套前端來源造成混淆。
- 資料模型、狀態機與錯誤處理規則應先寫進文件，避免正式開發時重做核心邏輯。

## 暫緩項目

- 線上付款
- 發票
- 外送平台
- 多分店
- 離線本地端同步
- 原生 App
