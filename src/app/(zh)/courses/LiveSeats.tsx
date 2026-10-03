"use client";

import { useEffect, useState } from "react";

type Seat = {
  enrolled: number;
  seats: number | null;
  seatsLeft: number | null;
  full: boolean;
  enrollable: boolean;
};

// 靜態頁顯示建置當下的名額，載入後抓即時值覆蓋（避免顯示過期數字）
export default function LiveSeats({ slug, initial }: { slug: string; initial: Seat }) {
  const [s, setS] = useState<Seat>(initial);

  useEffect(() => {
    let alive = true;
    fetch("/api/courses/seats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.seats?.[slug]) setS(d.seats[slug]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug]);

  if (s.seatsLeft === null || s.seats === null) return <span>名額不限</span>;
  if (s.full) return <span className="text-gray-500">已額滿（可候補）</span>;
  return (
    <span>
      剩餘 {s.seatsLeft}/{s.seats} 名
    </span>
  );
}
