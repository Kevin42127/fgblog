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

目前使用瀏覽器的 localStorage 儲存資料，包含：
- 文章資料 (`blogPosts`)
- 分類資料 (`blogCategories`)

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

