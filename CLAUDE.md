# CLAUDE.md — Claude Code 專屬補充

> 先讀 `AGENTS.md`（通用協作協議，所有 agent 共享）。此檔僅放 Claude Code 專屬補充，不與 AGENTS.md 重複。

## Claude Code 注意事項

1. **核心規則見 AGENTS.md**：領域分工、git 防衝突、VPS 環境隔離，全部以 AGENTS.md 為準
2. **部署統一交給小賀**（Hermes Agent）：你只 commit + push，不要執行 `pm2 restart`、不要 `rm -rf .next`、不要改 pm2 設定
3. **若要上 VPS 開發**：用 `git worktree add`（見 AGENTS.md 第三層），不要直接改 `/root/RongRise-Brand`
4. **長 session 陷阱**：Claude Code 常駐容易基於舊 git 狀態開發 — 動工前務必 `git pull --rebase`
5. **不要 force push** 到 main
6. `.env`、`package-lock.json`、pm2 設定：不屬於你的管轄範圍

## 品牌與品質標準

- 繁中（台灣用語）、專業但平易近人、避免 oversell
- 品牌色：`#0D2B4E / #1A6DB5 / #E8912A / #2EC4B6`（深藍底 / 亮藍 / 橘 CTA / 青綠點綴）
- 頁面風格：高對比、專業層次、勿狹長版面
- 圖片用 `.jpg`（不用 `.webp`），OG 圖 1200x630
