# Findings

## 1. `chat_ui_설계도.jpg` 분석

### 1.1 전체 레이아웃 구조
- 화면은 좌/우 2단 레이아웃.
  - **좌측 사이드바** (전체 폭의 약 1/4, 밝은 배경): 모델 설정 패널.
  - **우측 메인 영역** (나머지 폭, 옅은 회색빛 배경): 채팅 화면.
- 사이드바와 메인 영역 사이에 얇은 구분선(border)이 있음.

### 1.2 좌측 사이드바 — 컴포넌트 목록 (위→아래)
1. "모델 설정" 섹션 타이틀(굵은 텍스트).
2. "모델" 라벨 + 드롭다운(select) — 예시 값 `gemma3:4b`.
3. "시스템 프롬프트" 라벨 + 여러 줄 텍스트 영역(테두리 박스, 기본 문구 프리필됨).
4. "Temperature: 0.4" 라벨(현재 값 텍스트로 표시) + 가로 range 슬라이더.
5. "Top P: 0.55" 라벨(현재 값 텍스트로 표시) + 가로 range 슬라이더.
6. "Num Predict" 라벨 + 숫자 입력 필드(텍스트 박스, 값 `256`).
- 각 항목은 세로로 넉넉한 간격을 두고 배치, 라벨은 필드 위쪽에 좌측 정렬.

### 1.3 우측 메인 영역 — 컴포넌트 목록 (위→아래)
1. **헤더 카드** (흰 배경, 둥근 모서리, 옅은 그림자)
   - 좌측: 타이틀 "Local LLM Chat"(크고 굵게) + 서브타이틀 "React + FastAPI + Ollama 기반 로컬 AI 채팅 앱"(작고 회색).
   - 우측: "대화 초기화" 버튼(테두리만 있는 아웃라인 버튼).
2. **메시지 영역** (배경과 구분 없는 스크롤 영역)
   - 사용자 메시지 말풍선 1개 예시: 라벨 "사용자" 표시 + 옅은 파란 배경의 둥근 말풍선(폭 넓게, 좌측 정렬).
   - (AI 응답 말풍선은 목업에 없으나, 사용자 메시지와 시각적으로 구분되는 스타일 필요 — 예: 흰색/다른 색 배경).
3. **하단 입력 바** (좌우 2개 박스)
   - 좌측: 넓은 둥근 사각형 박스(옅은 회색). 목업 상에는 중앙 정렬된 회색 텍스트로 **"대화 초기화"**가 표시되어 있음 → 이는 입력창의 placeholder로 보이나, 문구가 헤더의 "대화 초기화" 버튼과 동일해 실제 의도가 불명확함(§3 이슈 참고).
   - 우측: 작은 테두리 박스, 텍스트 **"응답 생성 중..."** — 전송 버튼이 응답 대기 상태일 때의 표시로 추정(PRD의 로딩 상태 요구사항과 일치).

### 1.4 인터랙션 요소 정리
| 요소 | 타입 | 비고 |
|---|---|---|
| 모델 선택 | `<select>` | `GET /models` 목록 바인딩 |
| 시스템 프롬프트 | `<textarea>` | 자유 입력 |
| Temperature | range input | 값 실시간 표시 |
| Top P | range input | 값 실시간 표시 |
| Num Predict | number input | 값 실시간 표시 |
| 대화 초기화 | button (헤더) | 메시지 목록 초기화 |
| 메시지 입력 | text input | Enter 전송 지원 필요(PRD) |
| 전송 버튼 | button | 로딩 시 "응답 생성 중..." 텍스트로 전환 + disabled |
| 메시지 목록 | 스크롤 컨테이너 | 사용자/AI 말풍선 스타일 구분 |

---

## 2. 라이브러리 조사 (Context7 MCP 대체: WebSearch/WebFetch 사용)

> **참고**: `.vscode/mcp.json`에 Context7 MCP가 정의되어 있으나 현재 세션 도구 목록에는 연결되어 있지 않아 호출이 불가능했음. 사용자 확인 하에 WebSearch/WebFetch로 공식 문서를 조회해 대체함(2026-09-22 기준 최신 문서).

### 2.1 React (v19, 현재 설치된 버전과 동일 `^19.2.8`)
- 공식 훅 목록(react.dev/reference/react/hooks) 기준 이 프로젝트에서 사용할 훅:
  - `useState` — 상태 변수 선언/업데이트(모델 파라미터, 메시지 목록, 로딩 상태 등에 사용).
  - `useEffect` — 외부 시스템과 동기화(마운트 시 `GET /models` 호출 등에 사용).
  - `useRef` — DOM 참조(메시지 목록 자동 스크롤, 입력창 포커스 등에 사용 가능).
- **데이터 페칭 시 useEffect 모범 사례** (react.dev/learn/synchronizing-with-effects):
  - 컴포넌트가 언마운트되거나 의존성이 바뀌기 전에 완료된 오래된 요청이 상태를 덮어쓰지 않도록 `ignore` 플래그(또는 `AbortController`) 기반 cleanup을 사용해야 함.
  - 예:
    ```js
    useEffect(() => {
      let ignore = false;
      async function load() {
        const data = await fetchModels();
        if (!ignore) setModels(data);
      }
      load();
      return () => { ignore = true; };
    }, []);
    ```
  - Effect가 사용하는 모든 변수는 의존성 배열에 정확히 명시해야 함(프로젝트에 `eslint-plugin-react-hooks`가 이미 설정되어 있어 규칙 위반 시 린트 경고 발생).
  - 공식 문서는 프로덕션급 앱에는 TanStack Query 등 캐싱 라이브러리를 권장하지만, 이 프로젝트는 PRD상 별도 상태관리/캐싱 라이브러리 도입 계획이 없으므로 `useEffect` + `useState` 조합으로 충분(범위 초과 방지).

### 2.2 axios (신규 설치 필요 — 현재 `package.json`에 미포함)
- 공식 예제(axios GitHub README) 기준 핵심 사용법:
  - 인스턴스 생성(baseURL 지정):
    ```js
    const api = axios.create({ baseURL: 'http://127.0.0.1:8100' });
    ```
  - GET 요청: `const res = await api.get('/models'); res.data`
  - POST 요청: `const res = await api.post('/chat', payload); res.data`
  - 에러 처리 패턴:
    ```js
    try {
      const res = await api.post('/chat', payload);
    } catch (error) {
      if (error.response) {
        // 서버가 에러 상태코드로 응답 (예: 500)
      } else if (error.request) {
        // 요청은 보냈으나 응답 없음 (네트워크 오류 등)
      } else {
        // 요청 설정 자체의 오류
      }
    }
    ```
- **조치 필요**: `frontend/package.json`에 `axios` 의존성 추가(`npm install axios`) — task_plan.md에 반영.

---

## 3. 기존 프론트엔드 코드 구조/컨벤션

- `frontend/`는 Vite 공식 `create-vite` React 템플릿 그대로인 상태.
  - `src/App.jsx`: 기본 Vite+React 랜딩 페이지(hero 섹션, 문서/소셜 링크) — 전체 교체 대상.
  - `src/main.jsx`: 표준 `ReactDOM.createRoot` 진입점, 특이사항 없음.
  - `src/index.css`: **일반 CSS + CSS 커스텀 프로퍼티(`:root` 변수)** 방식 사용 중. `prefers-color-scheme: dark` 미디어쿼리로 라이트/다크 색상 변수가 이미 정의되어 있음 → PRD의 다크모드 nice-to-have 구현 시 재사용 가능.
  - `src/App.css`: `App.jsx`의 랜딩 페이지 전용 스타일(교체 대상).
  - CSS 프레임워크(Tailwind 등)나 CSS Module, styled-components는 설치되어 있지 않음 → 이번 작업도 일반 CSS(또는 컴포넌트별 CSS 파일) 컨벤션을 유지하는 것이 기존 구조와 일치.
- 상태관리 라이브러리(Redux, Zustand 등) 없음 — React 기본 훅으로 충분한 규모.
- 라우팅 라이브러리 없음 — 단일 화면(SPA 한 페이지)이므로 불필요.
- 린트: `eslint.config.js`에 `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` 적용됨 → 컴포넌트 분리 시 하나의 파일에서 컴포넌트만 export 하는 규칙(react-refresh) 준수 필요.
- 패키지 매니저: `package-lock.json` 존재 → npm 사용.
- Node.js 버전: 로컬 환경 `v22.23.2` 확인.
- `public/icons.svg`: 기존 템플릿용 아이콘 스프라이트(문서/소셜 아이콘) — 채팅 UI에는 별도 아이콘(전송 아이콘 등)이 필요할 수 있음.

---

## 4. 이슈 / 확인 필요 사항 (해결 완료)

1. **하단 입력창 목업 문구 불명확** → **해결**: 목업의 "대화 초기화" 문구는 오기로 간주. 입력창 placeholder는 "메시지를 입력하세요" 등으로 대체.
2. **멀티턴 대화 컨텍스트 처리 방식** → **해결**: 싱글턴 방식으로 진행. 매번 가장 최근 사용자 입력 `message`만 백엔드에 전송하고, 이전 대화 내용은 프론트 화면(메시지 목록)에만 누적 표시. AI는 이전 맥락을 기억하지 못하는 단발성 Q&A 방식.
3. **로딩 표시 방식** → **해결**: 텍스트("응답 생성 중...") + **스피너 아이콘도 추가** 구현. 설계도에는 없지만 사용자 요청으로 Must-have에 포함(간단한 CSS 애니메이션 스피너, 별도 아이콘 라이브러리 설치 없이 구현).
