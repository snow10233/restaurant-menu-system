# ADR 0004: ORM 選型

## 狀態

接受

## 背景

系統開始接入 PostgreSQL，需要 migration、型別化查詢、seed 與未來商家端資料操作。初期團隊規模小，資料模型仍會快速變動，因此 ORM 需要維持低抽象成本，讓 SQL 結構容易被檢查與調整。

## 決策

採用 Drizzle ORM。

## 理由

- Drizzle 的 schema 與查詢都以 TypeScript 描述，適合目前 Nuxt/NestJS/TypeScript monorepo。
- migration SQL 可直接檢查，方便維持商用系統需要的資料結構透明度。
- 抽象層相對薄，未來遇到交易、鎖定、庫存扣減等情境時，比較容易理解實際 SQL 邊界。
- 對小型單店系統而言，Drizzle 的心智負擔與執行成本較低。

## 影響

- API workspace 會維護 `apps/api/src/db/schema.ts` 作為資料表 schema 來源。
- migration 檔案存放於 `apps/api/drizzle/`。
- 初期 seed 會從 `data/menu-catalog.json` 灌入 PostgreSQL。
- 若未來出現更複雜的報表或大量關聯查詢，可以保留直接撰寫 SQL 的彈性。
