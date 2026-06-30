"use client";

import { useState, useEffect } from "react";

/**
 * 優化的圖片組件 — 自動使用 WebP（如果瀏覽器支持）
 * 在 static export 模式下，直接回傳 <img> 即可（WebP 已存在於 public/images）
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  loading = "lazy",
  width,
  height,
  style,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  // If src already ends with .webp or is SVG, use as-is
  if (src.endsWith(".svg") || src.endsWith(".webp")) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        style={style}
        {...props}
      />
    );
  }

  // For .jpg/.jpeg, try to use .webp version if available
  const webpSrc = src.replace(/\.(jpg|jpeg)$/i, ".webp");

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        style={style}
        {...props}
      />
    </picture>
  );
}
