# 商用餐廳點餐系統

這是一套以單店餐廳為起點的 QR Code 網頁點餐系統。初期目標是先完成可驗證流程的 MVP：客人掃碼點餐、店員可協助代點、現場人員可管理品項開關與簡易庫存，暫不串接金流、發票、外送平台或實體 POS。

目前專案採 npm workspaces，將前端與後端拆在 `apps/` 下：

- `apps/web-nuxt`：Nuxt + Vue + TypeScript + Tailwind CSS 前端
- `apps/api`：NestJS API 骨架

資料庫正式版採 PostgreSQL。SQLite 只建議用於本機 demo、測試或未來離線 local cache，不建議作為正式主資料庫。

## 目前定位

- 使用場景：單店餐廳，尖峰約 70 位客人。
- 點餐入口：客人掃 QR Code 進入網頁點餐；不熟悉手機操作的客人由店員使用手機代點。
- 結帳方式：初期以現場人工結帳為主。
- 庫存管理：支援品項開關，並保留數量庫存欄位，方便時令魚或限量餐點使用。
- 離線能力：初期不支援斷網操作，但資料與 API 設計預留未來本地端同步擴充。

## MVP 會包含

- 客人點餐首頁
- 餐點詳情與選項選擇
- 購物車與送單確認流程
- 品項售完/暫停供應狀態
- 基礎桌號與用餐 session 概念
- 訂單狀態設計
- 文件化需求與技術決策

## MVP 暫不包含

- 線上付款與退款
- 發票開立
- 外送平台串接
- 實體 POS 設備整合
- 多分店管理
- 斷網本地端點餐
- 完整報表與會計功能

## 商用上線版本需要補強

- 後端 API 與 PostgreSQL 交易處理
- 權限管理與員工帳號
- 訂單、取消、退菜、結帳稽核紀錄
- 錯誤監控、操作紀錄與備份還原
- 自動化測試與部署流程
- 資料庫 migration 與正式環境設定
- QR Code 桌號管理與防誤送機制

## 開發指令

```sh
npm install
npm run dev
npm run dev:api
npm run dev:web
npm run build
```

預設 `npm run dev` 會啟動 Nuxt app。

## 主要檔案

- `apps/web-nuxt/app.vue`：Nuxt 前端狀態與頁面切換
- `apps/web-nuxt/components/CustomerMenu.vue`：客人點餐頁
- `apps/web-nuxt/components/DishDetail.vue`：餐點詳情頁
- `apps/web-nuxt/components/StaffConsole.vue`：店員控制台
- `apps/web-nuxt/components/CartPanel.vue`：購物車
- `apps/web-nuxt/data/menu.ts`：目前展示用菜單與訂單資料
- `apps/web-nuxt/types.ts`：前端 TypeScript 型別
- `apps/api/src/main.ts`：NestJS API 入口
- `agent.md`：給未來 coding agent 的架構備忘錄
- `docs/requirements.md`：需求規格書草案
- `docs/architecture.html`：用 HTML 撰寫的架構解釋
- `docs/adr/0001-mvp-tech-stack.md`：初期技術選型決策
- `docs/adr/0002-database-choice.md`：資料庫選型決策
