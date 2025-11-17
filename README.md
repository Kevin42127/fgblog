# 個人部落格

使用 Vite + React + TypeScript 開發的個人部落格系統，包含完整的前台展示與後台管理功能。

## 功能特色

- 📝 使用 Quill.js 的富文本編輯器
- 🎨 完全自訂義的通知系統
- 📜 使用 Lenis 的平滑滾動效果
- 🎯 完整的後台管理系統
- 📱 響應式設計
- 🎨 統一的品牌視覺系統

## 技術棧

- **Vite** - 建構工具
- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **React Router** - 路由管理
- **Quill.js** - 富文本編輯器
- **Lenis** - 平滑滾動
- **Google Material Icons** - 圖標系統

## 安裝與執行

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 建構生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
src/
├── components/          # 共用元件
│   ├── admin/          # 後台管理元件
│   ├── Layout.tsx      # 前台佈局
│   └── ...
├── pages/              # 頁面元件
│   ├── admin/          # 後台管理頁面
│   ├── Home.tsx        # 首頁
│   └── BlogPost.tsx    # 文章頁面
├── contexts/            # Context 提供者
│   └── NotificationContext.tsx
└── App.tsx             # 主應用程式
api/
├── login.ts            # 登入 API
└── verify.ts           # Token 驗證 API
```

## 功能說明

### 前台功能

- 首頁文章列表展示
- 文章詳細頁面
- 響應式設計

### 後台管理

- **儀表板** - 統計資訊與最近文章
- **文章管理** - 新增、編輯、刪除文章
- **分類管理** - 管理文章分類

### 通知系統

完全自訂義的通知系統，支援四種類型：
- 成功 (success)
- 錯誤 (error)
- 警告 (warning)
- 資訊 (info)

## 資料儲存

專案使用 **Vercel Postgres**（Neon Serverless Postgres）資料庫儲存所有資料，實現跨裝置同步和資料持久化。

### Vercel Postgres 設置

1. **在 Vercel 中建立 Postgres 資料庫**
   - 前往 Vercel 專案設置
   - 點擊 "Storage" 標籤
   - 選擇 "Create Database" → "Postgres"
   - 選擇 "Neon" 作為提供者（推薦）
   - 建立資料庫後，Vercel 會自動設置 `POSTGRES_URL` 環境變數

2. **或使用 Neon 直接建立**
   - 前往 [Neon](https://neon.tech)
   - 建立免費帳號和專案
   - 複製連線字串（格式：`postgresql://user:password@host/database`）
   - 在 Vercel 環境變數中設置 `POSTGRES_URL`

### 環境變量設置（Vercel）

在 Vercel 專案設置中添加以下環境變量：

**資料庫設定：**
- `POSTGRES_URL` - PostgreSQL 連線字串（必填，Vercel 建立資料庫後會自動設置）

**後端驗證：**
- `ADMIN_USERNAME` - 後台管理帳號（預設：admin）
- `ADMIN_PASSWORD` - 後台管理密碼（請設置強密碼）
- `JWT_SECRET` - JWT 簽名密鑰（請使用強隨機字符串，最多 32 字元）

### API 端點

**認證相關：**
- `POST /api/login` - 登入驗證
- `GET /api/verify` - Token 驗證

**文章管理：**
- `GET /api/posts` - 取得所有文章
- `POST /api/posts` - 新增文章
- `PUT /api/posts` - 更新文章
- `DELETE /api/posts?id={id}` - 刪除文章
- `DELETE /api/posts/delete-all` - 刪除所有文章
- `POST /api/posts/increment-view` - 增加瀏覽數

**分類管理：**
- `GET /api/categories` - 取得所有分類
- `POST /api/categories` - 新增分類
- `DELETE /api/categories?name={name}` - 刪除分類
- `DELETE /api/categories/delete-all` - 刪除所有分類

**聯絡訊息：**
- `GET /api/contacts` - 取得所有聯絡訊息
- `POST /api/contacts` - 新增聯絡訊息
- `PUT /api/contacts` - 更新聯絡訊息（標記已讀）
- `DELETE /api/contacts?id={id}` - 刪除聯絡訊息
- `DELETE /api/contacts/delete-all` - 刪除所有聯絡訊息

### 本地開發

在本地開發時，API 路由需要通過 Vercel CLI 運行：

```bash
npm install -g vercel
vercel dev
```

或者使用 Vite 開發服務器時，API 請求會自動代理到 Vercel 環境。

## 設計規範

- 統一使用 Google Material Icons
- 使用 Lenis 實現平滑滾動
- 自訂義文字選取樣式
- 統一的品牌色與視覺系統
- 平滑過渡效果

## 瀏覽器支援

支援所有現代瀏覽器，包括：
- Chrome
- Firefox
- Safari
- Edge
