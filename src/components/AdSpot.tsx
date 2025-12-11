"use client";

interface AdSpotProps {
  position?: "left" | "right";
  className?: string;
}

export function AdSpot({ position = "right", className = "" }: AdSpotProps) {
  return (
    <div
      className={`hidden lg:block sticky top-24 ${className}`}
      style={{ width: "160px", height: "600px" }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl">📢</span>
        </div>
        <p className="text-xs font-semibold text-gray-600 mb-1">광고 영역</p>
        <p className="text-[10px] text-gray-400">160 x 600</p>
      </div>
    </div>
  );
}
