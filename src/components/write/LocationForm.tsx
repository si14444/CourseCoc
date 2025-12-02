import { Location } from "@/types";
import { Camera, GripVertical, X } from "lucide-react";
import Image from "next/image";
import { AddressAutocomplete } from "../ui/AddressAutocomplete";
import { Input } from "../ui/input";

interface LocationFormProps {
  location: Location;
  index: number;
  onUpdate: (index: number, field: keyof Location, value: string) => void;
  onRemove: (index: number) => void;
  onAddressSelect: (index: number, result: any) => void;
  onImageClick: (locationId: string) => void;
  imageInputRef: (el: HTMLInputElement | null, locationId: string) => void;
  onImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  dragHandlers?: {
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (index: number) => void;
  };
}

export const LocationForm = ({
  location,
  index,
  onUpdate,
  onRemove,
  onAddressSelect,
  onImageClick,
  imageInputRef,
  onImageChange,
  dragHandlers,
}: LocationFormProps) => {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      draggable={!!dragHandlers}
      onDragStart={() => dragHandlers?.onDragStart(index)}
      onDragOver={dragHandlers?.onDragOver}
      onDrop={() => dragHandlers?.onDrop(index)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {dragHandlers && (
            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          )}
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            장소 {index + 1}
          </h3>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* 장소 이미지 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            장소 이미지
          </label>
          <div
            onClick={() => onImageClick(location.id)}
            className="relative h-48 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)] rounded-lg cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          >
            {location.image ? (
              <Image
                src={location.image}
                alt={location.name || "장소 이미지"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-[var(--coral-pink)] mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  클릭하여 이미지 추가
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={(el) => imageInputRef(el, location.id)}
            onChange={(e) => onImageChange(e, index)}
          />
        </div>

        {/* 장소명 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            장소명 *
          </label>
          <Input
            value={location.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            placeholder="예: 남산타워"
            className="w-full"
          />
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            주소 *
          </label>
          <AddressAutocomplete
            value={location.address}
            onChange={(value) => onUpdate(index, "address", value)}
            onSelect={(result) => onAddressSelect(index, result)}
            placeholder="주소를 검색하세요"
          />
        </div>

        {/* 시간 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            예상 시간
          </label>
          <Input
            value={location.time}
            onChange={(e) => onUpdate(index, "time", e.target.value)}
            placeholder="예: 14:00 - 16:00"
            className="w-full"
          />
        </div>

        {/* 간단 설명 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            간단 설명
          </label>
          <Input
            value={location.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            placeholder="이 장소에 대한 간단한 설명"
            className="w-full"
          />
        </div>

        {/* 상세 정보 */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            상세 정보
          </label>
          <textarea
            value={location.detail}
            onChange={(e) => onUpdate(index, "detail", e.target.value)}
            placeholder="이 장소에서 무엇을 할 수 있는지, 특별한 팁 등을 작성해주세요"
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--coral-pink)] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
