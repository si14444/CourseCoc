import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

// --- Community Post Data ---
interface Persona {
  nickname: string;
}

const PERSONAS: Persona[] = [
  { nickname: "카페투어러" },
  { nickname: "서울토박이" },
  { nickname: "데이트고수" },
  { nickname: "감성사진가" },
  { nickname: "맛집네비" },
  { nickname: "뚜벅이여행" },
  { nickname: "야경사냥꾼" },
  { nickname: "신혼부부" },
];

const TITLES = [
  "이번 주말 데이트 코스 추천해주세요",
  "성수동 숨은 맛집 발견했습니다",
  "한강 피크닉 가기 좋은 스팟 공유",
  "비 오는 날 실내 데이트 어디가 좋을까요",
  "첫 소개팅 성공했습니다. 감사합니다",
  "경복궁 야간개장 티켓팅 팁 좀 알려주세요",
  "노을 맛집 카페 리스트 정리해봤습니다",
  "익선동 골목 여행 다녀왔는데 분위기 좋네요",
  "여친이랑 100일인데 코스 좀 봐주세요",
  "강남역 조용한 룸술집 있나요",
  "연남동 벚꽃 실시간 상황입니다",
  "혼자 알기 아까운 북카페 추천",
];

const CONTENTS = [
  "진짜 분위기 너무 좋고 음식이 맛있었어요. 재방문 의사 100%입니다.",
  "사람이 좀 많긴 한데 그래도 웨이팅 할 만한 가치가 있네요.",
  "여자친구가 너무 좋아해서 다행이었습니다. 코스 추천해주신 분들 감사해요.",
  "가격대는 좀 있는데 기념일에 가기엔 딱인 것 같아요.",
  "주차 공간이 좀 협소하니 대중교통 이용하시는 게 좋을 듯 합니다.",
  "사진 찍기 좋아하시는 분들은 무조건 가보세요. 인생샷 건집니다.",
  "다음 주에 또 가려고요.",
];

const COMMENT_CONTENTS = [
  "좋은 정보 감사합니다",
  "저도 여기 가봤는데 진짜 좋더라고요",
  "혹시 주차는 되나요?",
  "스크랩 해갑니다",
  "다음 주말에 가봐야겠네요",
  "사진 분위기 대박이네요",
  "좋은 코스 공유 감사합니다",
  "메뉴 추천 좀 해주세요",
  "사람 많나요?",
  "웨이팅 꿀팁 감사합니다",
];

// --- Course Data (Power Blogger Style - Clean & Reliable Images) ---
const COURSE_THEMES = [
  {
    title: "성수동 힙스터 감성 데이트 코스",
    description:
      "요즘 가장 핫한 성수동 카페와 맛집, 그리고 서울숲 산책까지. 완벽한 하루를 위한 코스입니다.",
    tags: ["데이트", "카페", "맛집", "성수동"],
    heroImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", // 성수동 느낌 (음식/카페)
    duration: "4-5시간",
    budget: "5-10만원",
    season: "사계절",
    locations: [
      {
        name: "성수 대림창고",
        address: "서울 성동구 성수이로 78",
        lat: 37.5415,
        lng: 127.056,
        image:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", // 카페 내부
        description:
          "창고를 개조한 갤러리형 카페. 층고가 높고 분위기가 압도적이에요.",
      },
      {
        name: "서울숲 공원",
        address: "서울 성동구 뚝섬로 273",
        lat: 37.5444,
        lng: 127.0374,
        image:
          "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80", // 공원/숲
        description: "도심 속 힐링 공간. 사슴도 보고 피크닉하기도 좋아요.",
      },
      {
        name: "소문난성수감자탕",
        address: "서울 성동구 연무장길 45",
        lat: 37.5428,
        lng: 127.0543,
        image:
          "https://images.unsplash.com/photo-1583069150388-7557dc079146?w=800&q=80", // 한식/감자탕 느낌
        description: "백종원의 3대천왕에도 나온 찐맛집. 웨이팅 필수입니다.",
      },
    ],
    contentIntro:
      "<h2>안녕하세요. 오늘은 성수동 완전 정복 코스를 준비했습니다.</h2><p>실패 없는 데이트를 위해 엄선한 장소들입니다.</p>",
    contentOutro:
      "<h3>총평</h3><p>성수동 특유의 힙한 감성과 맛있는 음식, 그리고 자연까지 즐길 수 있는 알찬 코스였습니다. 주말에는 사람이 많으니 참고하세요.</p>",
  },
  {
    title: "한강 노을과 함께하는 여의도 피크닉",
    description:
      "선선한 바람이 부는 날, 여의도 한강공원에서 치맥하고 더현대 서울 구경하기 딱 좋은 코스.",
    tags: ["자연", "힐링", "산책", "여의도"],
    heroImage:
      "https://images.unsplash.com/photo-1571216896265-d6d7ac616a1b?w=800&q=80", // 한강 느낌 (서울 도시)
    duration: "4-5시간",
    budget: "5만원 이하",
    season: "봄",
    locations: [
      {
        name: "더현대 서울",
        address: "서울 영등포구 여의대로 108",
        lat: 37.5259,
        lng: 126.9284,
        image:
          "https://images.unsplash.com/photo-1627916607166-07e112d7d8f4?w=800&q=80", // 백화점/실내
        description:
          "서울에서 제일 핫한 백화점. 지하 식품관 투어는 필수입니다.",
      },
      {
        name: "여의도 한강공원",
        address: "서울 영등포구 여의동로 330",
        lat: 37.5284,
        lng: 126.9328,
        image:
          "https://images.unsplash.com/photo-1549643276-fbc2bd5f02bc?w=800&q=80", // 한강/노을
        description: "라면 기계로 끓여먹는 라면이 진리입니다.",
      },
    ],
    contentIntro:
      "<h2>한강라면이 생각나는 날</h2><p>답답한 실내 데이트가 지겨울 때, 뻥 뚫린 한강 뷰 보면서 힐링하는 건 어떠신가요?</p>",
    contentOutro:
      "<h3>꿀팁</h3><p>돗자리는 대여도 가능하지만 챙겨가면 좋습니다. 저녁엔 쌀쌀하니까 담요/겉옷 챙겨가세요.</p>",
  },
  {
    title: "연남동 골목 감성 카페 투어",
    description:
      "연트럴파크 산책하고 숨은 골목 맛집과 카페 찾아다니는 재미가 있는 연남동 코스입니다.",
    tags: ["카페", "데이트", "산책", "연남동"],
    heroImage:
      "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80", // 카페/커피
    duration: "3-4시간",
    budget: "5-10만원",
    season: "가을",
    locations: [
      {
        name: "경의선숲길",
        address: "서울 마포구 연남동",
        lat: 37.5621,
        lng: 126.9253,
        image:
          "https://images.unsplash.com/photo-1587310619207-657c917af7e9?w=800&q=80", // 공원/길
        description: "일명 연트럴파크. 가볍게 산책하기 좋습니다.",
      },
      {
        name: "랜디스도넛 연남",
        address: "서울 마포구 동교로 247",
        lat: 37.5619,
        lng: 126.9255,
        image:
          "https://images.unsplash.com/photo-1631502424888-067980cd6995?w=800&q=80", // 도넛/디저트
        description: "줄 서서 먹는 도넛 맛집. 비주얼과 맛 모두 훌륭합니다.",
      },
    ],
    contentIntro:
      "<h2>당 충전이 필요할 땐 연남동으로</h2><p>골목골목 예쁜 가게들이 너무 많아서 걷기만 해도 기분 좋아지는 연남동 데이트 코스입니다.</p>",
    contentOutro:
      "<h3>주차 정보</h3><p>연남동은 주차가 매우 어렵습니다. 가급적 홍대입구역 3번 출구를 이용하세요.</p>",
  },
  {
    title: "고즈넉한 북촌 한옥마을 산책",
    description:
      "전통과 현대가 공존하는 북촌에서 즐기는 여유로운 산책 코스. 사진 찍기 좋습니다.",
    tags: ["문화", "산책", "자연", "종로"],
    heroImage:
      "https://images.unsplash.com/photo-1596791883503-490b47164993?w=800&q=80", // 한옥 느낌
    duration: "3-4시간",
    budget: "5만원 이하",
    season: "가을",
    locations: [
      {
        name: "북촌 한옥마을",
        address: "서울 종로구 계동길 37",
        lat: 37.5829,
        lng: 126.9835,
        image:
          "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?w=800&q=80", // 한옥 마을
        description: "한옥 기와지붕 너머로 보이는 서울 풍경이 아름답습니다.",
      },
      {
        name: "런던베이글뮤지엄 안국",
        address: "서울 종로구 북촌로4길 20",
        lat: 37.5791,
        lng: 126.9863,
        image:
          "https://images.unsplash.com/photo-1616428782364-750f24a0d920?w=800&q=80", // 베이글/빵
        description:
          "오픈런 필수인 베이글 맛집. 대기가 길지만 맛은 보장합니다.",
      },
    ],
    contentIntro:
      "<h2>한국의 미를 느낄 수 있는 북촌</h2><p>조용하고 고즈넉한 분위기를 좋아하신다면 강력 추천하는 코스입니다.</p>",
    contentOutro:
      "<h3>관람 에티켓</h3><p>주민들이 거주하는 공간이니 조용히 관람하는 배려가 필요합니다.</p>",
  },
  {
    title: "강남 코엑스 실내 데이트 코스",
    description:
      "비 오거나 추운 날엔 역시 몰링이 최고입니다. 쇼핑부터 맛집, 카페까지 한 번에 해결하세요.",
    tags: ["쇼핑", "맛집", "카페", "강남"],
    heroImage:
      "https://images.unsplash.com/photo-1563249058-2947f6368d1f?w=800&q=80", // 몰/쇼핑 센터
    duration: "4-5시간",
    budget: "10-15만원",
    season: "겨울",
    locations: [
      {
        name: "별마당 도서관",
        address: "서울 강남구 영동대로 513",
        lat: 37.5101,
        lng: 127.0602,
        image:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80", // 도서관
        description:
          "코엑스의 랜드마크. 책을 읽지 않아도 한 번쯤 가볼 만한 곳입니다.",
      },
      {
        name: "아쿠아리움",
        address: "서울 강남구 영동대로 513",
        lat: 37.512,
        lng: 127.059,
        image:
          "https://images.unsplash.com/photo-1517441221147-380d613e54b6?w=800&q=80", // 수족관
        description:
          "동심으로 돌아간 기분을 느낄 수 있습니다. 상어 수조가 인상적이에요.",
      },
    ],
    contentIntro:
      "<h2>비 오는 날 고민 끝, 코엑스</h2><p>하루 종일 놀아도 시간 가는 줄 모르는 코엑스 데이트 코스를 짰습니다.</p>",
    contentOutro:
      "<h3>쇼핑 꿀팁</h3><p>영수증 꼭 챙기셔서 주차 할인 받으세요. 주차비가 비싼 편입니다.</p>",
  },
];

export async function seedCommunityPosts(currentUserId: string): Promise<void> {
  if (!db) {
    console.error("Firestore not initialized");
    return;
  }

  const postsCollection = collection(db, "posts");
  const commentsCollection = collection(db, "comments");
  const batchSize = 20;

  console.log("Starting seeding community posts...");

  const promises = Array.from({ length: batchSize }).map(async (_, index) => {
    // Randomly select persona, title, content
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
    const content = CONTENTS[Math.floor(Math.random() * CONTENTS.length)];

    // Create posts over the last 7 days
    const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const createdAt = new Date(Date.now() - timeOffset);

    const likes = Math.floor(Math.random() * 50);
    const views = Math.floor(Math.random() * 200) + likes;

    // Determine comment count (0-5)
    const numComments = Math.floor(Math.random() * 6);

    const postData = {
      authorId: currentUserId,
      title: title,
      content: content,
      author: {
        nickname: persona.nickname,
      },
      createdAt: Timestamp.fromDate(createdAt),
      likes,
      views,
      commentCount: numComments, // Set initial count
      updatedAt: Timestamp.now(),
    };

    // 1. Add Post
    const postRef = await addDoc(postsCollection, postData);

    // 2. Add Comments for this post
    const commentPromises = Array.from({ length: numComments }).map(() => {
      const commentPersona =
        PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
      const commentContent =
        COMMENT_CONTENTS[Math.floor(Math.random() * COMMENT_CONTENTS.length)];

      // Comments created slightly after post
      const commentTimeOffset = Math.floor(Math.random() * 1000 * 60 * 60);
      const commentCreatedAt = new Date(
        createdAt.getTime() + commentTimeOffset
      );

      const commentData = {
        postId: postRef.id, // Link to post
        authorId: currentUserId, // Same user but different nickname
        author: { nickname: commentPersona.nickname },
        content: commentContent,
        createdAt: Timestamp.fromDate(commentCreatedAt),
        likes: Math.floor(Math.random() * 10),
        isEdited: false,
        replyCount: 0,
      };
      return addDoc(commentsCollection, commentData);
    });

    await Promise.all(commentPromises);
  });

  await Promise.all(promises);
  console.log(
    `Successfully seeded ${batchSize} community posts with comments!`
  );
}

export async function deleteCommunityPosts(
  currentUserId: string
): Promise<void> {
  if (!db) return;

  console.log("Starting deletion of community posts...");

  // 1. Find all posts by this user
  const postsQuery = query(
    collection(db, "posts"),
    where("authorId", "==", currentUserId)
  );
  const postsSnapshot = await getDocs(postsQuery);

  // 2. Find all comments by this user
  const commentsQuery = query(
    collection(db, "comments"),
    where("authorId", "==", currentUserId)
  );
  const commentsSnapshot = await getDocs(commentsQuery);

  const docsToDelete = [...postsSnapshot.docs, ...commentsSnapshot.docs];

  // Batch delete
  const batch = writeBatch(db);
  docsToDelete.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(
    `Deleted ${postsSnapshot.size} posts and ${commentsSnapshot.size} comments.`
  );
}

export async function seedCourses(currentUserId: string): Promise<void> {
  if (!db) return;
  const coursesCollection = collection(db, "courses");

  // We will generate 10 courses, cycling through our 5 themes
  const batchSize = 10;

  const promises = Array.from({ length: batchSize }).map(async (_, index) => {
    const theme = COURSE_THEMES[index % COURSE_THEMES.length];

    const timeOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const createdDate = new Date(Date.now() - timeOffset);

    // Generate Rich Content
    let richContent = theme.contentIntro;
    theme.locations.forEach((loc, idx) => {
      richContent += `<h3>${idx + 1}. ${loc.name}</h3>`;
      // Ensure image exists before adding img tag, though we controlled it in THEMES
      if (loc.image) {
        richContent += `<img src="${loc.image}" alt="${loc.name}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;" />`;
      }
      richContent += `<p>${loc.description}</p>`;
      richContent += `<p>📍 <strong>위치</strong>: ${loc.address}</p><br />`;
    });
    richContent += theme.contentOutro;

    // Use a slightly different title for duplicates to avoid exact name collision
    const title =
      index >= COURSE_THEMES.length
        ? `${theme.title} (${index + 1})`
        : theme.title;

    // Transform locations to match Firestore schema
    const courseLocations = theme.locations.map((loc) => ({
      id: crypto.randomUUID(),
      name: loc.name,
      address: loc.address,
      position: { lat: loc.lat, lng: loc.lng },
      image: loc.image,
      memo: loc.description,
    }));

    const docData = {
      title: title,
      description: theme.description,
      tags: theme.tags,
      duration: theme.duration,
      budget: theme.budget,
      season: theme.season,
      heroImage: theme.heroImage, // Guaranteed to be present
      locations: courseLocations,
      content: richContent,
      isDraft: Math.random() < 0.2,
      status: Math.random() < 0.2 ? "draft" : "published",
      createdAt: Timestamp.fromDate(createdDate),
      updatedAt: Timestamp.fromDate(createdDate),
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 500) + 100,
      bookmarks: Math.floor(Math.random() * 50),
      authorId: currentUserId,
      placeCount: courseLocations.length,
    };

    return addDoc(coursesCollection, docData);
  });

  await Promise.all(promises);
  console.log(`Seeded ${batchSize} high-quality courses.`);
}

export async function deleteCourses(currentUserId: string): Promise<void> {
  if (!db) return;
  const q = query(
    collection(db, "courses"),
    where("authorId", "==", currentUserId)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Deleted ${snapshot.size} courses.`);
}
