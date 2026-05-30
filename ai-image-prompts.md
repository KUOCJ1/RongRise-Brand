# AI 生圖提示語 — 榕耀管顧 RongRise Consulting 官網圖庫

## 品牌設計規範（給 AI 參考）
- 主色：深藏青 #0D2B4E（專業、權威）
- 輔色：藍色 #1A6DB5（信任、穩定）
- 強調色：暖金色 #E8912A（AI、CTA 按鈕）
- 點綴色：青色 #2EC4B6（ESG、創新）
- 背景：暖白 #FDFCFA（非純白）
- 風格：專業、創新、簡潔、科技感、企業級質感
- 字體風格：無襯線現代感（類似 Noto Sans TC）

---

## 圖 1：首頁 Hero 大背景
**用途：** 放在 <section className="bg-gradient-hero"> 區域背後，取代純 CSS 漸變
**放置位置：** page.tsx Hero section，作為背景圖（object-cover）

```
A wide cinematic hero banner for a Taiwanese AI consulting company website.
Abstract digital network visualization on deep navy blue (#0D2B4E) background.
Glowing golden (#E8912A) and teal (#2EC4B6) nodes connected by thin luminous lines,
forming a subtle neural network / constellation pattern.
The composition should be wide and clean, with the right side slightly brighter
to leave space for text overlay on the left.
Style: premium corporate technology, minimalist, futuristic, trustworthy.
NO text, NO logos, NO people, NO readable words.
Aspect ratio: 16:9 or 21:9, high resolution.
```

---

## 圖 2：服務區塊背景（三大支柱區域）
**用途：** 放在服務卡片區域的背景，增加層次感
**放置位置：** page.tsx Services section

```
An elegant abstract background for a business services section.
Deep navy (#0D2B4E) to medium blue gradient with subtle geometric hexagon patterns.
Very faint golden (#E8912A) and teal (#2EC4B6) light accents scattered like bokeh.
The overall feel should be clean, spacious, and slightly luminous.
Style: professional corporate, subtle luxury, minimalist.
NO text, NO people, NO recognizable objects.
Aspect ratio: 16:9, suitable for a horizontal banner/section background.
```

---

## 圖 3：關於我區塊（引用區域背景）
**用途：** 放在右側引言區塊的背景，取代純 CSS 漸變色塊
**放置位置：** page.tsx About preview section 右側

```
A sophisticated abstract background for a quotation/testimonial section.
Rich deep navy (#0D2B4D) base with very subtle golden (#E8912A) radial glow
in the upper right corner. Faint geometric lines and nodes suggesting
strategy and connection. The mood should be warm, trustworthy, and premium.
Style: elegant corporate, warm professionalism, subtle depth.
NO text, NO people, NO logos.
Aspect ratio: 4:5 (portrait orientation), suitable for sidebar placement.
```

---

## 圖 4：知識庫文章卡片封面（通用模板）
**用途：** 每篇文章的頭圖，可重複使用同風格生成多張
**放置位置：** knowledge/[slug]/page.tsx 文章頂部

```
A clean abstract header image for a business knowledge article.
Deep navy (#0D2B4E) background with a subtle geometric pattern of
connected dots and lines in golden (#E8912A) and teal (#2EC4B6).
The composition should be simple and leave space for a title overlay.
Think of it as a premium tech blog header.
Style: modern, clean, professional, minimalist.
NO text, NO people, NO logos.
Aspect ratio: 16:9, suitable for blog post header.
```

---

## 圖 5：CTA 區域背景（最下方行動呼籲）
**用途：** 放在 CTA 區域的背景，增加視覺深度
**放置位置：** page.tsx CTA section

```
A subtle abstract background texture for a call-to-action section.
Deep navy (#0D2B4E) base with a very faint dot matrix pattern.
Soft golden (#E8912A) and teal (#2EC4B6) glow effects in the corners.
The overall feel should be inviting and premium without being distracting.
Style: premium corporate, subtle texture, clean.
NO text, NO people, NO logos.
Aspect ratio: 16:9, seamless tileable texture preferred.
```

---

## 圖 6：社群分享預覽圖（OG Image）
**用途：** 當網站被分享到 Facebook、LINE、LinkedIn 時的預覽圖
**放置位置：** layout.tsx openGraph images

```
A professional social media preview image for RongRise Consulting (榕耀管顧).
Deep navy (#0D2B4E) background with an elegant geometric network pattern
in golden (#E8912A) and teal (#2EC4B6).
The center should be relatively clean/empty to allow for potential text overlay.
Include subtle glowing nodes and connection lines suggesting AI and strategy.
Style: premium corporate, modern, trustworthy, clean.
NO text in the image itself (text will be added by social platform).
Aspect ratio: 1.91:1 (1200x630 pixels), optimized for Open Graph.
```

---

## 圖 7：404 錯誤頁面插圖
**用途：** 找不到頁面時的插圖
**放置位置：** app/not-found.tsx

```
A friendly, minimalist illustration for a 404 error page.
Abstract geometric shapes (hexagons, circles) floating in a deep navy (#0D2B4E)
environment with golden (#E8912A) and teal (#2EC4B6) accents.
The mood should be calm and professional, not alarming.
Think of it as "lost in digital space" but in an elegant way.
Style: modern, friendly, minimalist, corporate.
NO text, NO people, NO logos.
Aspect ratio: 1:1 (square), centered composition.
```

---

## 使用建議

1. **推薦工具：** ChatGPT Plus (DALL-E 3) — 免費生成，品質穩定
2. **生成後處理：**
   - 用 [tinypng.com](https://tinypng.com) 壓縮（免費）
   - 存為 JPG（照片類）或 PNG（需要透明背景時）
3. **檔案命名規範：**
   - Hero 背景 → `hero-bg.jpg`
   - 服務背景 → `services-bg.jpg`
   - 關於區塊 → `about-quote-bg.jpg`
   - 文章封面 → `article-cover.jpg`
   - CTA 背景 → `cta-bg.jpg`
   - OG 預覽 → `og-image.jpg`（覆蓋原本的）
   - 404 插圖 → `404-illustration.jpg`
4. **上傳方式：** 把圖片放到 `/public/images/` 目錄，告訴我檔案名稱，我幫你整合進網站
