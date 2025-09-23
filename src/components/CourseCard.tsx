'use client'

interface CourseCardProps {
  title: string
  description: string
  rating: number
  maxRating: number
  stats: {
    courses: number
    reviews: number
    participants: number
  }
  imageUrl?: string
}

export default function CourseCard({ title, description, rating, maxRating, stats, imageUrl }: CourseCardProps) {
  return (
    <div
      className="bg-white box-border flex flex-col isolate items-start justify-start overflow-clip relative rounded-[16px] w-full max-w-[368px]"
      style={{
        boxShadow: '0px 4px 20px 0px rgba(255,107,107,0.1)'
      }}
    >
      {/* 이미지 컨테이너 - 192px 높이 */}
      <div className="flex flex-col h-[192px] items-start justify-center overflow-clip relative shrink-0 w-full">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 text-sm">
            이미지 영역
          </div>
        )}

        {/* 평점 도트들 - 이미지 위에 절대 위치 */}
        <div className="absolute bottom-[12px] left-[12px] flex items-start justify-start">
          {Array.from({ length: maxRating }, (_, index) => (
            <div key={index} className="flex items-center">
              <div
                className="bg-[#ff6b6b] flex items-center justify-center rounded-full size-[24px]"
              >
                <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[0] not-italic text-[12px] text-center text-nowrap text-white">
                  <p className="leading-[16px] whitespace-pre">{index < rating ? (index + 1) : ''}</p>
                </div>
              </div>
              {index < maxRating - 1 && <div className="w-[8px]" />}
            </div>
          ))}
        </div>
      </div>

      {/* 카드 내용 */}
      <div className="box-border flex flex-col gap-[8px] items-start justify-start pb-[12px] pt-[20px] px-[20px] relative shrink-0 w-full">
        {/* 제목 */}
        <div className="flex flex-col items-start justify-start overflow-clip relative shrink-0 w-full">
          <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-gray-800 w-full">
            <p className="leading-[28px]">{title}</p>
          </div>
        </div>

        {/* 설명 */}
        <div className="flex flex-col items-start justify-start overflow-clip relative shrink-0 w-full">
          <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-600 w-full">
            <p className="mb-0">{description.length > 80 ? description.substring(0, 80) + '…' : description}</p>
          </div>
        </div>

        {/* 통계 */}
        <div className="box-border flex items-center justify-start pb-0 pt-[8px] px-0 relative shrink-0 w-full">
          <div className="flex items-center justify-start relative shrink-0">
            {/* 첫 번째 통계 */}
            <div className="flex items-center justify-start relative shrink-0">
              <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ff6b6b] text-[14px] text-nowrap">
                <p className="leading-[20px] whitespace-pre"></p>
              </div>
              <div className="box-border flex flex-col items-start justify-start pl-[4px] pr-0 py-0 relative shrink-0">
                <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap">
                  <p className="leading-[20px] whitespace-pre">{stats.courses}</p>
                </div>
              </div>
            </div>

            {/* 두 번째 통계 */}
            <div className="box-border flex flex-col items-start justify-start pl-[16px] pr-0 py-0 relative shrink-0">
              <div className="flex items-center justify-start relative shrink-0">
                <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ff6b6b] text-[14px] text-nowrap">
                  <p className="leading-[20px] whitespace-pre"></p>
                </div>
                <div className="box-border flex flex-col items-start justify-start pl-[4px] pr-0 py-0 relative shrink-0">
                  <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap">
                    <p className="leading-[20px] whitespace-pre">{stats.reviews}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 세 번째 통계 */}
            <div className="box-border flex flex-col items-start justify-start pl-[16px] pr-0 py-0 relative shrink-0">
              <div className="box-border flex items-center justify-start pl-0 pr-[0.01px] py-0 relative shrink-0">
                <div className="box-border flex flex-col items-start justify-start mr-[-0.01px] relative shrink-0">
                  <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ff6b6b] text-[14px] text-nowrap">
                    <p className="leading-[20px] whitespace-pre"></p>
                  </div>
                </div>
                <div className="box-border flex flex-col items-start justify-start mr-[-0.01px] pl-[4px] pr-0 py-0 relative shrink-0">
                  <div className="flex flex-col font-['Segoe_UI_Symbol:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap">
                    <p className="leading-[20px] whitespace-pre">{stats.participants}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}