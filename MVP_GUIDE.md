# CourseCoc MVP 구현 가이드

## 🎯 완성된 MVP 기능

### ✅ 구현 완료
1. **지도 표시**: Google Maps 연동으로 기본 지도 표시
2. **장소 등록**: 지도 클릭으로 장소 추가 가능
3. **코스 생성**: 장소들을 모아서 데이트 코스 생성
4. **코스 편집**: 드래그 앤 드롭으로 장소 순서 변경
5. **코스 목록**: 생성한 코스들을 카드 형태로 표시
6. **기본 공유**: 공유 링크 생성 기능

### 🔄 구현 필요 (우선순위 순)
1. **커뮤니티 기능**: 코스 게시 및 댓글 시스템
2. **3D 시각화**: Three.js 기반 3D 코스 표시
3. **SNS 공유**: 카카오톡, 인스타그램 등 연동
4. **장소 검색**: Google Places API 연동
5. **사용자 인증**: 간단한 로그인 시스템

## 🚀 실행 방법

### 1. 개발 서버 시작
```bash
npm run dev
```

### 2. Google Maps API 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Maps JavaScript API, Places API 활성화
3. API 키 생성
4. `.env.local` 파일에 API 키 추가:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

### 3. 빌드 및 배포
```bash
npm run build
npm run start
```

## 📱 사용법

### 지도에서 코스 만들기
1. "코스 만들기" 버튼 클릭
2. 코스 제목과 설명 입력
3. 지도에서 원하는 장소 클릭 → "장소 추가"
4. 장소 목록에서 드래그로 순서 변경
5. "저장" 버튼으로 코스 완성

### 내 코스 관리
1. "내 코스" 탭에서 생성한 코스 확인
2. 편집 버튼으로 코스 수정
3. 공유 버튼으로 링크 생성

## 🏗️ 아키텍처

### 컴포넌트 구조
```
src/
├── components/
│   ├── map/MapComponent.tsx        # Google Maps 컴포넌트
│   ├── course/
│   │   ├── PlaceCard.tsx          # 장소 카드
│   │   └── CourseEditor.tsx       # 코스 편집기
│   └── ui/LoadingSpinner.tsx      # 공통 UI
├── store/useCourseStore.ts        # Zustand 스토어
├── types/index.ts                 # TypeScript 타입
└── utils/constants.ts             # 상수 정의
```

### 상태 관리 (Zustand)
- `courses`: 생성된 코스 목록
- `currentCourse`: 현재 편집 중인 코스
- `mapCenter`, `mapZoom`: 지도 상태
- 코스/장소 CRUD 액션들

## 🎨 디자인 시스템

### 코럴 핑크 테마
- Primary: `#ff6b6b` (코럴 핑크)
- Secondary: `#ffe0e0` (연한 핑크)  
- Accent: `#fff2f2` (매우 연한 핑크)
- Background: `#fefefe` (따뜻한 화이트)

### CSS 클래스
- `.btn-primary`: 메인 버튼
- `.btn-secondary`: 보조 버튼
- `.card`: 카드 컨테이너
- `.text-primary`: 메인 텍스트 색상

## 📝 TODO List

### 높은 우선순위
- [ ] Google Maps API 키 설정 안내
- [ ] 장소 검색 기능 (Places API)
- [ ] 커뮤니티 게시판
- [ ] 모바일 반응형 개선

### 중간 우선순위  
- [ ] 3D 코스 시각화
- [ ] SNS 공유 연동
- [ ] 사용자 인증
- [ ] 코스 카테고리 분류

### 낮은 우선순위
- [ ] 오프라인 지원
- [ ] 다국어 지원
- [ ] 성능 최적화
- [ ] 테스트 코드 작성

## 🛠️ 개발 팁

### 새 컴포넌트 추가 시
1. CSS 변수 사용 필수 (CLAUDE.md 참고)
2. TypeScript 타입 먼저 정의
3. 모바일 우선 반응형 디자인

### API 연동 시
1. 환경 변수 사용
2. 에러 처리 필수
3. 로딩 상태 표시

### 상태 관리
- Zustand 스토어에 새 상태 추가
- 액션과 상태를 분리해서 정의
- LocalStorage 동기화 고려