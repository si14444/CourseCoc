"use client";

import { useEffect, useRef } from "react";

interface AdSpotProps {
  position?: "left" | "right";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSpot({ position = "right", className = "" }: AdSpotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      // 해당 요소가 화면에 보이고 너비가 있는 경우에만 초기화
      if (
        adRef.current.offsetWidth > 0 &&
        adRef.current.getAttribute("data-adsbygoogle-status") !== "done"
      ) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div
      className={`hidden lg:block sticky top-24 ${className}`}
      style={{ width: "160px", height: "600px" }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "160px", height: "600px" }}
        data-ad-client="ca-pub-4535163023491412"
        data-ad-slot="6546754053"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
