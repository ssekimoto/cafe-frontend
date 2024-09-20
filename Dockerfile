# ベースイメージとして Node.js を使用
FROM node:20-alpine AS builder

# 作業ディレクトリの作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存パッケージのインストール
RUN npm install

# ソースコードをコピー
COPY . .

# Next.js プロジェクトをビルド
RUN npm run build

# ビルド結果を使用するために NODE_ENV を production に設定
ENV NODE_ENV production

# ポート 3000 を公開
EXPOSE 3000

# Next.js サーバーを起動
CMD ["npm", "run", "start"]

