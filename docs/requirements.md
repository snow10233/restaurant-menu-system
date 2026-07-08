# 需求規格書草案

## 1. 專案目標

建立一套適合單店餐廳使用的 QR Code 網頁點餐系統，讓客人能用手機完成瀏覽菜單、選擇餐點、加入購物車與送單。系統必須重視資料完整性、訂單狀態一致性、庫存狀態可控與現場操作簡潔性。

## 2. 使用情境

### 2.1 客人掃碼點餐

客人入座後掃描桌上 QR Code，系統帶入桌號與用餐 session。客人可瀏覽菜單、查看餐點詳情、調整數量與備註，最後送出訂單。

### 2.2 店員協助代點

若客人不熟悉手機操作，店員可使用自己的手機掃同一桌 QR Code，協助客人完成點餐。初期不另外做平板專用 POS 流程，先以同一套點餐頁支援代點。

### 2.3 現場庫存調整

店員可將時令魚、限量餐點或暫停供應品項切換為售完/可供應。系統保留庫存數量欄位，但初期以人工開關為主，不強制由系統自動扣到零才停售。

### 2.4 廚房出餐

訂單送出後，廚房或櫃台可看到待處理訂單，並更新狀態。MVP 原型先呈現畫面與狀態概念，正式版再接後端即時同步。

## 3. MVP 範圍

### 3.1 客戶端

- 顯示桌號與用餐狀態
- 顯示菜單分類
- 顯示餐點圖片、名稱、價格與供應狀態
- 支援餐點詳情頁
- 支援餐點選項與備註
- 支援加入購物車、調整數量、送出訂單
- 售完品項不得加入購物車

### 3.2 店員端

- 顯示今日供應狀態
- 支援快速切換品項開放/停售
- 支援查看待處理訂單概況
- 支援標記製作中與完成的狀態概念

### 3.3 後端正式版

- 建立訂單
- 查詢菜單
- 查詢品項庫存狀態
- 更新品項開放/停售
- 更新訂單狀態
- 建立操作紀錄
- 提供桌號 QR Code 對應 session

## 4. 非目標

以下功能不列入第一階段：

- 線上刷卡、第三方支付與退款
- 電子發票
- 外送平台串接
- 實體 POS 機整合
- 多分店管理
- 完整離線模式
- 會員系統
- 複雜促銷活動

## 5. 核心資料模型

### 5.1 MenuCategory

- `id`
- `name`
- `sortOrder`
- `isActive`

### 5.2 MenuItem

- `id`
- `categoryId`
- `name`
- `description`
- `price`
- `imageUrl`
- `isAvailable`
- `stockMode`: `manual` 或 `tracked`
- `stockQuantity`
- `sortOrder`
- `version`

### 5.3 Table

- `id`
- `label`
- `qrToken`
- `isActive`

### 5.4 DiningSession

- `id`
- `tableId`
- `status`: `open`, `checking_out`, `closed`
- `openedAt`
- `closedAt`

### 5.5 Order

- `id`
- `diningSessionId`
- `status`: `draft`, `submitted`, `accepted`, `preparing`, `ready`, `served`, `cancelled`
- `clientRequestId`
- `subtotal`
- `note`
- `createdAt`
- `updatedAt`

### 5.6 OrderItem

- `id`
- `orderId`
- `menuItemId`
- `nameSnapshot`
- `unitPriceSnapshot`
- `quantity`
- `optionSnapshot`
- `note`
- `status`: `submitted`, `preparing`, `ready`, `served`, `cancelled`

### 5.7 AuditLog

- `id`
- `actorId`
- `action`
- `targetType`
- `targetId`
- `before`
- `after`
- `createdAt`

## 6. 訂單狀態機

訂單狀態必須透過明確規則轉換：

- `draft` 可以轉為 `submitted`
- `submitted` 可以轉為 `accepted` 或 `cancelled`
- `accepted` 可以轉為 `preparing` 或 `cancelled`
- `preparing` 可以轉為 `ready`
- `ready` 可以轉為 `served`
- `served` 不可再取消，只能走退菜或退款流程
- `cancelled` 為終態

正式後端不得讓前端任意指定下一個狀態，必須由後端檢查目前狀態、操作者權限與業務規則。

## 7. 併發與資料完整性要求

- 建立訂單必須使用資料庫 transaction。
- 建立訂單必須接受 `clientRequestId`，避免網路重送造成重複下單。
- `clientRequestId` 在同一個 dining session 中必須唯一。
- 品項價格必須在下單時寫入 `OrderItem` 快照。
- 更新庫存或品項狀態必須使用 `version` 欄位做 optimistic locking。
- 付款、取消、退菜等高風險操作必須寫入 `AuditLog`。
- 金額欄位必須使用 decimal，不可用 floating point。

## 8. 權限需求

第一階段可先用簡化角色，正式版需支援：

- `owner`：完整管理權限
- `manager`：菜單、庫存、訂單與報表
- `staff`：代點、出餐、庫存開關
- `kitchen`：查看與更新廚房訂單
- `guest`：掃碼點餐

## 9. 錯誤處理需求

- 菜單載入失敗時，前端顯示可重試狀態。
- 送單失敗時，不清空購物車。
- 重複送單時，後端回傳同一筆訂單結果。
- 品項售完時，送單前與送單時都要檢查。
- 訂單狀態更新衝突時，提示使用者重新整理。

## 10. MVP 與可上線版本落差

MVP 重點是驗證點餐流程與現場接受度。專案已拆成 `apps/web-nuxt` 與 `apps/api`。前端採 Nuxt + Vue + TypeScript + Tailwind CSS；後端 API 以 NestJS 起步，等點餐流程確認後再接 PostgreSQL。可上線版本則必須補上正式資料庫、交易、權限、監控、備份、自動化測試與部署流程。

以實務成本來看，MVP 可以先完成 20% 到 30% 的核心流程，快速讓餐廳試用；商用上線版本需要額外投入大量時間在穩定性、例外處理、資料一致性與營運維護。
