# AGENTS.md — RongRise 協作協議（所有 AI Agent 必讀）

> 適用：小賀（Hermes Agent）、Codex（OpenAI）、Claude Code（Anthropic）以及任何在此 repo 作業的 AI agent。
> 目的：避免多方同時開發同一 repo / 同一 VPS 時的衝突。

## 專案概況

- **Repo**: github.com/KUOCJ1/RongRise-Brand（Next.js static export）
- **生產環境**: VPS `187.77.142.66` → `/root/RongRise-Brand`，pm2 服務 `rongrise-site`
- **三個作業位置**:
  - 小賀：容器內 `/opt/data/RongRise-Brand`
  - Codex/Claude Code：CJ哥 本機或 VPS worktree
  - VPS 部署目錄：`/root/RongRise-Brand`
- **品牌色**: `#0D2B4E / #1A6DB5 / #E8912A / #2EC4B6`
- **語言**: 繁中（台灣用語）

## 第一層：領域分工

| 領域 | 主導 | 注意 |
|---|---|---|
| 文章/知識庫內容、電子報、影片 | 小賀 | 動 `src/data/articles.json`、`knowledge/`、`news/` |
| 官網版面、新頁面、服務/課程頁 | CJ哥（Codex/Claude Code） | 動 `src/app/*` 頁面、`src/components/` |
| 部署到 VPS | **小賀** | 統一由小賀 build + pm2 restart |

**鐵律：改完 code 只 commit + push，不要自己部署。部署交給小賀。** VPS 上永遠只有一個 deployer。

## 第二層：Git 防衝突

1. **動工前先 `git pull`** — 長 session 容易基於舊狀態開發
2. **push 前先 `git pull --rebase origin/main`**，rebase 後再 push
3. **禁止 `git push --force`** 到 main
4. 改不同檔案天然不衝突（內容 vs 頁面分開）；真撞同檔時，以最新 push 者為準，另一方 rebase
5. 未追蹤檔案（如 `public/images/*.jpg`）若同名，以內容較新者保留，另一方可改名

## 第三層：環境隔離（VPS 共享）

1. **不要在 `/root/RongRise-Brand` 直接開發**（那是部署目錄，小賀 deploy 會 `rm -rf .next` 重建）。要上 VPS 開發請用 worktree：
   ```bash
   cd /root && git worktree add /root/rr-dev main
   ```
2. **部署前檢查**：`ps aux | grep -E 'next|npm run build' | grep -v grep` — 若有其他人的 build 在跑，等它完成
3. **`.env` 不要動**（小賀管理）
4. **node_modules 不要手動安裝** — 依 `package-lock.json` 安裝；不要改 lockfile 除非有充分理由
5. **不要動 pm2 設定**（`pm2 save` / ecosystem 檔由小賀管）

## 部署流程（小賀執行）

```bash
cd /root/RongRise-Brand
git pull --rebase
rm -rf .next
npm run build
pm2 restart rongrise-site
curl -s https://rong-rise.com | grep -c '<title>'   # 驗證內容
```

## 誰動了什麼（快速檢查）

- 內容改動（文章/新聞/電子報）：看 `git log --oneline -5` 的 commit message
- 頁面改動：看 `src/app/` 與 `src/components/` 的 mtime
- 部署狀態：`pm2 status rongrise-site`
