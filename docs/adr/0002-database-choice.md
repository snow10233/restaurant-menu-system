# ADR 0002: 資料庫選型

## 狀態

接受

## 背景

本系統初期服務單店餐廳，尖峰約 70 位客人。流量不大，但訂單、付款、取消、庫存與稽核紀錄都屬於高完整性資料。即使沒有大型商業化計畫，也需要避免重複下單、漏單、價格快照錯誤與庫存狀態競爭。

## 決策

正式開發與可上線版本採用 PostgreSQL。

SQLite 可作為：

- 本機 demo
- 單元測試
- 早期本機 demo
- 未來離線本地端的 embedded store 候選

SQLite 不作為正式雲端/店內伺服器的主資料庫。

## 理由

- PostgreSQL 有成熟 transaction、row-level locking、isolation level、constraint 與 migration 生態。
- 訂單建立、取消、退菜、庫存切換、結帳都需要可靠交易邊界。
- 未來若加入多平板、廚房螢幕、櫃台、店員手機，PostgreSQL 的併發處理比 SQLite 更適合。
- PostgreSQL 更適合日結、報表、稽核紀錄與備份還原。
- SQLite 部署簡單，但多使用者寫入、備份、遠端服務與權限管理會更快遇到上限。

## 影響

- 後端 API 需以 PostgreSQL 為主要資料庫設計。
- 本機開發可使用 Docker Compose 啟動 PostgreSQL。
- ORM 採 Drizzle，詳見 `docs/adr/0004-orm-choice.md`。
- 若未來要做斷網本地端，SQLite 可重新評估為 local cache/sync store，而不是取代主資料庫。
