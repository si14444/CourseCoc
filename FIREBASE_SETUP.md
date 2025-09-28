# Firebase 설정 가이드

## 🚨 권한 오류 해결 방법

현재 "permission-denied" 오류가 발생하고 있다면 다음 단계를 따라주세요:

### 1. Firebase 콘솔에서 보안 규칙 설정

1. [Firebase 콘솔](https://console.firebase.google.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 "Firestore Database" 클릭
4. "규칙" 탭 클릭
5. 아래 규칙을 복사하여 붙여넣기

### 2. 베타 테스트용 임시 규칙 (권장)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 베타 테스트용 - 인증된 사용자만 모든 읽기/쓰기 허용
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. 프로덕션용 보안 규칙 (나중에 적용)

`firestore-security-rules.txt` 파일의 내용을 참조하세요.

### 4. 권한 오류 해결 체크리스트

- [ ] 사용자가 로그인되어 있는지 확인
- [ ] Firebase 보안 규칙이 올바르게 설정되어 있는지 확인
- [ ] 브라우저 새로고침 후 다시 시도
- [ ] 로그아웃 후 재로그인
- [ ] 브라우저 개발자 도구에서 네트워크 탭 확인

### 5. 디버깅 정보

코스 작성 실패 시 브라우저 콘솔(F12)에서 다음 정보를 확인하세요:

```
권한 에러 디버깅 정보: {
  user: {...},
  userId: "...",
  userEmail: "...",
  courseDoc: {...},
  authState: true/false,
  timestamp: "..."
}
```

## 🛡️ 보안 고려사항

### 베타 테스트 중
- 임시로 모든 인증된 사용자에게 읽기/쓰기 권한 부여
- 악의적인 사용을 방지하기 위해 사용자 등록 제한

### 프로덕션 출시 시
- 세분화된 권한 규칙 적용
- 사용자는 본인 작성 코스만 수정/삭제 가능
- 발행된 코스는 모든 사용자 읽기 가능
- 댓글은 작성자만 수정/삭제 가능

## 📞 문의

권한 문제가 지속될 경우 관리자에게 문의해주세요.