# Task Plan

`prd.md`(Must-have/Nice-to-have)와 `findings.md`(설계도 분석, 라이브러리 조사, 해결된 이슈)를 바탕으로 작성. 각 항목은 컴포넌트 단위로 구현하며, 완료할 때마다 `progress.md`에 기록한다.

## 확정된 전제 (findings.md 4절 참고)
- 입력창 placeholder는 "메시지를 입력하세요" 등으로 표기(설계도 문구는 오기로 간주).
- 대화는 **싱글턴**: 매번 최신 사용자 입력만 백엔드로 전송, 이전 맥락은 화면에만 누적(AI는 기억 못함).
- 응답 대기 상태는 텍스트("응답 생성 중...") + **스피너 아이콘**을 함께 표시(설계도엔 없지만 사용자 요청으로 Must-have에 포함, 별도 아이콘 라이브러리 없이 CSS 애니메이션으로 구현).

---

## Must-have 체크리스트

### 0. 준비 작업
- [ ] `frontend`에 `axios` 의존성 추가(`npm install axios`) — *기술: axios (findings.md 2.2)*
- [ ] `src/App.jsx`, `src/App.css`의 기존 Vite 템플릿(랜딩 페이지) 콘텐츠 제거
- [ ] `prd.md` 5절 폴더 구조대로 `src/api/`, `src/components/layout|sidebar|chat/`, `src/hooks/` 디렉터리 생성

### 1. API 레이어
- [ ] `src/api/chatApi.js`: `axios.create({ baseURL })` 인스턴스 + `getModels()`(`GET /models`), `sendChat(payload)`(`POST /chat`) 함수 — *기술: axios instance 패턴 (findings.md 2.2)*
  - **확인 필요**: baseURL을 `http://127.0.0.1:8100`으로 하드코딩할지, `.env`(Vite의 `import.meta.env`)로 뺄지 — 우선 하드코딩으로 구현 후 필요 시 질문.

### 2. 레이아웃
- [ ] `ChatLayout.jsx`: 좌측 사이드바 + 우측 메인 2단 레이아웃(flex/grid), 반응형 breakpoint 포함 — *기술: 일반 CSS(기존 컨벤션 유지)*

### 3. 사이드바 (모델 설정)
- [ ] `ModelSettingsPanel.jsx`: 사이드바 컨테이너 + 섹션 타이틀
- [ ] `ModelSelect.jsx`: `<select>` — 최초에는 mock 배열로 렌더링 확인 후 `useModels` 훅 연결
- [ ] `SystemPromptField.jsx`: `<textarea>`, 기본값은 백엔드 기본값(`너는 초보자를 돕는 친절한 AI 강사다.`)과 동일하게 세팅
- [ ] `ParamSlider.jsx`: Temperature(0.0~2.0)/Top P(0.0~1.0) 공용 슬라이더 컴포넌트, 현재 값 라벨 표시 — *접근성: label/aria-valuetext*
- [ ] Num Predict 숫자 입력(1~2048) — `ParamSlider.jsx`와 별도로 사이드바 내 입력 필드로 구현

### 4. 메인 채팅 영역
- [ ] `ChatHeader.jsx`: 타이틀/서브타이틀 + "대화 초기화" 버튼(클릭 시 메시지 목록 초기화 콜백 호출)
- [ ] `MessageBubble.jsx`: 사용자/AI 메시지 스타일 구분(사용자: 파란톤, AI: 흰색/회색톤)
- [ ] `MessageList.jsx`: 메시지 배열 렌더링 + 스크롤 컨테이너, 새 메시지 추가 시 자동 하단 스크롤(`useRef`)
- [ ] `ChatInput.jsx`: 텍스트 입력 + 전송 버튼
  - Enter 키 전송 지원(Shift+Enter는 줄바꿈, 접근성/PRD 요구)
  - 로딩 중 입력창/버튼 비활성화, 버튼 텍스트를 "응답 생성 중..."으로 변경 + 스피너 아이콘 표시
- [ ] 에러 상태 UI: `/chat` 요청 실패 시 메시지 목록에 에러 안내(말풍선 또는 배너) 표시, 앱 크래시 없이 처리

### 5. 상태관리 연결 (React 훅, 별도 상태관리 라이브러리 불필요 — findings.md 3절)
- [ ] `useModels.js`: 마운트 시 `GET /models` 호출, `ignore` 플래그로 race condition 방지(findings.md 2.1 패턴 적용)
- [ ] `useChat.js`: `messages`, `isLoading`, `error` 상태 관리 + `sendMessage(text)`(사이드바 파라미터와 함께 싱글턴으로 `POST /chat` 호출) + `resetConversation()`
- [ ] `App.jsx`에서 사이드바 파라미터 상태(model/systemPrompt/temperature/topP/numPredict)와 `useChat`을 연결해 `ChatLayout`에 props로 전달

### 6. 스타일링 마무리
- [ ] 설계도 색상/여백/폰트 크기에 맞춰 세부 스타일 조정
- [ ] 반응형 확인(모바일 폭에서 가로 스크롤 없는지, 사이드바 레이아웃 전환)
- [ ] 접근성 점검(label 연결, 키보드 포커스 순서, 색 대비)

---

## Nice-to-have (우선순위 낮음, Must-have 완료 후 여유 있을 때)
- [ ] 메시지별 타임스탬프 + 모델명/`elapsed_time` 표시
- [ ] 메시지 복사 버튼
- [ ] Markdown/코드블록 렌더링 — **확인 필요**: 별도 라이브러리(예: `react-markdown`) 설치 여부는 범위 확장이라 사전 승인 필요
- [ ] 다크 모드 토글(‘`index.css`에 이미 정의된 다크 변수 재사용 — findings.md 3절)
- [ ] 대화 내역 `localStorage` 저장/복원
- [ ] 모델 파라미터 프리셋 저장/불러오기
- [ ] 사이드바 접기/펼치기(모바일 대응 강화)
