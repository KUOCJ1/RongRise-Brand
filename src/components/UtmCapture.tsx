"use client";

import { useEffect } from "react";
import { captureFirstTouchFromWindow } from "@/lib/utm";

/** 進站即捕捉 first-touch UTM，掛在根 layout。 */
export default function UtmCapture() {
  useEffect(() => {
    captureFirstTouchFromWindow();
  }, []);
  return null;
}
