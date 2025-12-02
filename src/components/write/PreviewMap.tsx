import { Location } from "@/types";
import { MapPin } from "lucide-react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

interface PreviewMapProps {
  locations: Location[];
}

export const PreviewMap = ({ locations }: PreviewMapProps) => {
  if (locations.length === 0) return null;

  // 좌표가 있는 장소들만 필터링
  const validLocations = locations.filter((loc) => loc.position);

  if (validLocations.length === 0) {
    return (
      <div className="h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-[var(--coral-pink)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            주소를 입력하면 지도가 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  // 지도 중심 좌표 계산
  const center = {
    lat:
      validLocations.reduce((sum, loc) => sum + loc.position!.lat, 0) /
      validLocations.length,
    lng:
      validLocations.reduce((sum, loc) => sum + loc.position!.lng, 0) /
      validLocations.length,
  };

  return (
    <div className="h-48 rounded-lg overflow-hidden">
      <Map center={center} style={{ width: "100%", height: "100%" }} level={8}>
        {/* 마커들 */}
        {validLocations.map((location, index) => (
          <MapMarker
            key={location.id}
            position={location.position!}
            image={{
              src: "/pin.png",
              size: { width: 30, height: 30 },
              options: { offset: { x: 15, y: 30 } },
            }}
            title={`${index + 1}. ${location.name}`}
          />
        ))}

        {/* 경로 표시 */}
        {validLocations.length > 1 && (
          <Polyline
            path={validLocations.map((location) => location.position!)}
            strokeWeight={3}
            strokeColor={"#ff6b6b"}
            strokeOpacity={0.8}
            strokeStyle={"solid"}
          />
        )}
      </Map>
    </div>
  );
};
