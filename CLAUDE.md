# CLAUDE.md

此文件為 Claude Code 在此專案中操作時提供指引。

## 通用規則

- 套件管理：**pnpm**（一律使用 pnpm，不使用 npm 或 yarn）
- 語言：**TypeScript**（嚴格模式，避免使用 `any`）
- Node 版本：**24**
- 優先選擇主流、現代的函式庫；避免引入不必要的依賴

## 程式碼風格

- 格式化設定：Tab 縮排、單引號、不加分號、行寬 96
- 命名：變數/函式用 camelCase，型別/介面/類別用 PascalCase，常數用 UPPER_SNAKE_CASE
- 匯出：優先具名匯出（named export），避免預設匯出（default export）
- 型別：優先使用 `interface` 定義物件結構，`type` 用於聯合型別或工具型別
- 非同步：一律使用 `async/await`，避免裸 `.then()` 鏈

## 工具設定

根目錄 `package.json` 透過 `lint-staged` + `husky` 管理共用開發工具，pre-commit 時自動執行。

| 工具 | 用途 | 設定檔 |
|---|---|---|
| `oxfmt` | 格式化 `*.{js,jsx,ts,tsx}` | `.oxfmtrc.json` |
| `oxlint` | Lint（啟用 `unicorn`、`typescript`、`oxc` 插件） | `.oxlintrc.json` |

手動執行：
```bash
pnpm exec oxlint <file>
pnpm exec oxfmt <file>
```

## 專案結構慣例

```
src/           # 主要原始碼
  index.ts     # 入口點
  types/       # 共用型別定義
  utils/       # 純函式工具
test/          # 測試檔案，結構鏡像 src/
```

- 每個模組只負責單一職責
- 避免循環依賴
- 工具函式保持純函式（pure function）

## 測試

- 測試框架：**Vitest**
- 測試檔案放於 `test/` 或與原始檔同層（`*.test.ts`）
- 單元測試優先；整合測試針對邊界行為
- 不對內部實作細節測試，針對公開介面與行為測試

## 依賴管理

- 安裝依賴前確認是否真正必要
- 執行時依賴（`dependencies`）與開發工具（`devDependencies`）嚴格分開
- 固定主要版本（`^` 可接受，避免 `*`）
- 定期執行 `pnpm audit` 檢查安全性問題

## Git 規範

- Commit 訊息格式：`type(scope): description`（類型：`feat`、`fix`、`refactor`、`test`、`chore`）
- 每個 commit 只做一件事
- PR 合併前確保 lint 與測試全部通過
