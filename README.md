# 積ん読

## 機能

- 自分が積んでいる本の一覧を出す
- 本を積む
- 積んでる本をタグで分類
- いくら積んで、それにいくらかかってるのかをグラフ表示
- ログイン機能
- 消化率とか

### 今後やりたいこと

- 読みたい本のメモ機能
- ページネーション

## Docs

### ER 図

![ER](./docs//db-schema.drawio.svg)

### API 仕様書

[OpenAPI](./docs/api-definition.yaml)

## 使用した技術

### Frontend

- Vite
- TypeScript
- React Router (ルーティング)
- SWR (データ取得、データの管理)
- axios (データ取得)
- Mantine (UI ライブラリ)

### Backend

- Express
- TypeScript
- jsonwebtoken (jwt の作成)
- bcrypt (ソルト、ハッシュ)
- Passport (ログイン機能)
- passport-jwt (jwt の認証)
- passport-local（パスワード認証)

### 共通

- openapi2aspida (OpenAPI からの型生成)

## ローカル環境での実行

### 事前準備

pnpm をインストールする
https://pnpm.io/ja/installation

### Backend

1. `tsundoku`という名前の DB がローカルに存在しないことを確認
2. `psql -f script/create_database.sql`を実行
3. .env ファイルを`backend`直下に作成、以下のテンプレートを必要に応じて編集する

```.env
DB_USER=user
DB_PASSWORD=
DB_NAME="tsundoku"
DB_HOST=127.0.0.1
JWT_SECRET="test"
```

4. `pnpm backend migrate`の実行
5. `pnpm backend generateApiType`の実行
6. `pnpm backend dev`を実行し、express を起動

### Frontend

1. `pnpm frontend install`の実行
2. `pnpm frontend dev`を実行しViteの起動
