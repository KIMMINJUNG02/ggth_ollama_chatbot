# Progress

## 완료: task_plan.md "0. 준비 작업"
- [x] `frontend`에 `axios` 의존성 추가 (`npm install axios` → `^1.20.0` 설치됨, `package.json` 반영)
- [x] `src/App.jsx`, `src/App.css`의 기존 Vite 템플릿(랜딩 페이지) 콘텐츠 제거
  - `App.jsx`는 이후 `ChatLayout`으로 교체될 임시 placeholder(`"Local LLM Chat 화면 준비 중..."`)로 대체
  - 더 이상 사용하지 않는 템플릿 전용 에셋(`src/assets/hero.png`, `react.svg`, `vite.svg`) 삭제
- [x] `prd.md` 5절 폴더 구조대로 디렉터리 생성: `src/api/`, `src/components/layout/`, `src/components/sidebar/`, `src/components/chat/`, `src/hooks/` (아직 내부 파일 없음, 다음 단계에서 채울 예정)
- [x] 검증: `npm run build` 성공 (모듈 17개, 에러 없음) → 빌드 산출물(`dist/`)은 `.gitignore`에 이미 포함되어 있어 삭제 후 정리 완료

## 완료: task_plan.md "1. API 레이어"
- [x] `src/api/chatApi.js` 작성: `axios.create({ baseURL: 'http://127.0.0.1:8100' })` 인스턴스 + `getModels()`(`GET /models` → `models` 배열 반환), `sendChat(payload)`(`POST /chat` → `ChatResponse` 반환)
  - **결정**: baseURL은 우선 하드코딩(`http://127.0.0.1:8100`, 백엔드 `backend/main.py` 기본 포트와 동일). `.env` 분리는 지금 범위에서는 보류(필요 시 추후 요청).
  - 에러 처리(try/catch)는 이 파일에서 하지 않고, 이 함수를 호출하는 `useModels`/`useChat` 훅에서 담당하도록 역할 분리(다음 단계).
- [x] 검증: `npx eslint src/api/chatApi.js` 통과, `npm run build` 정상(에러 없음)

## 완료: task_plan.md "2. 레이아웃"
- [x] `src/components/layout/ChatLayout.jsx` + `ChatLayout.css`: 좌측 사이드바(`sidebar` prop) + 우측 메인(`children`) 2단 flex 레이아웃, 768px 이하에서 세로 스택으로 전환되는 반응형 breakpoint 포함
- [x] `src/index.css`의 `#root` 규칙 정리: 기존 템플릿(랜딩 페이지)용 고정폭(1126px)/중앙정렬/테두리 스타일 제거 → 전체 화면 폭을 쓰는 앱 레이아웃에 맞게 단순화
- [x] `App.jsx`를 `ChatLayout` 사용으로 교체(사이드바/채팅 영역은 다음 단계 전까지 임시 placeholder 텍스트)
- [x] 미사용 `App.css` 삭제
- [x] **브라우저 검증**: `npm run dev`로 dev 서버 실행 후 Playwright(`npx playwright screenshot`)로 스크린샷 캡처해 확인
  - 데스크톱(1440x900): 좌측 흰 배경 사이드바 + 우측 연회색(#f4f5f7) 메인 영역이 전체 폭으로 정상 렌더링
  - 모바일(390x844): 768px 미만에서 사이드바가 위, 채팅 영역이 아래로 세로 스택되며 가로 스크롤 없음 확인
  - 참고: 포트 5173은 이 프로젝트와 무관한 다른 dev 서버(`react_basic`)가 이미 점유 중이라 Vite가 자동으로 5174 포트를 사용함 — 검증 후 5174만 종료, 5173 프로세스는 건드리지 않음
  - 참고: 이 환경에 Playwright 브라우저 바이너리가 없어 `npx playwright install chromium`으로 최초 1회 설치함(시스템 의존성 설치는 sudo 권한 없어 실패했으나 브라우저 바이너리만으로 headless 스크린샷은 정상 동작)

## 완료: task_plan.md "3. 사이드바 (모델 설정)"
- [x] `src/components/sidebar/ModelSelect.jsx`: `<select>`, mock 모델 목록(`['gemma3:4b', 'exaone3.5:7.8b']`)으로 렌더링 (다음 단계에서 `useModels` 훅으로 교체 예정)
- [x] `src/components/sidebar/SystemPromptField.jsx`: `<textarea>`, 기본값을 백엔드 기본값(`너는 초보자를 돕는 친절한 AI 강사다.`)과 동일하게 세팅
- [x] `src/components/sidebar/ParamSlider.jsx`: Temperature(0~2, step 0.1)/Top P(0~1, step 0.05) 공용 슬라이더, `aria-valuetext`로 접근성 보완, 현재 값 라벨에 실시간 표시
- [x] `src/components/sidebar/NumPredictField.jsx`: 숫자 입력(1~2048)
- [x] `src/components/sidebar/ModelSettingsPanel.jsx` + `.css`: 위 4개 컴포넌트를 조합하는 컨테이너, `settings`/`onSettingsChange` props로 제어(controlled) — 상태 소유는 이번 단계에서 `App.jsx`가 `useState`로 임시 담당(정식 훅 분리는 "5. 상태관리 연결" 단계에서 처리)
- [x] `App.jsx`에 `settings` 상태 연결, `MOCK_MODELS` 배열로 `ModelSettingsPanel` 렌더링
- [x] 색상: 설계도의 파란 슬라이더 톤에 맞춰 `--sidebar-accent: #3b82f6` 적용
- [x] **브라우저 검증**: Playwright로 (a) 정적 렌더링 스크린샷이 설계도(`chat_ui_설계도.jpg`)의 사이드바 구성과 일치하는지 확인, (b) 실제 상호작용 스크립트로 모델 변경/시스템 프롬프트 입력/슬라이더 드래그(Temperature 0.4→1.2)/Num Predict 값 변경(256→512)이 모두 화면에 실시간 반영되는지 확인 — 정상 동작
- [x] lint(`npx eslint src/`)/build(`npm run build`) 통과

## 완료: task_plan.md "4. 메인 채팅 영역"
- [x] `src/components/chat/ChatHeader.jsx` + `.css`: 타이틀/서브타이틀 + "대화 초기화" 버튼(흰 카드, 둥근 모서리, 그림자 — 설계도 스타일)
- [x] `src/components/chat/MessageBubble.jsx` + `.css`: 사용자(파란 톤 `#dbeafe`)/AI(흰 배경+테두리) 스타일 구분, role 라벨 표시, 다크모드 배경 대응
- [x] `src/components/chat/MessageList.jsx` + `.css`: 스크롤 컨테이너, 새 메시지 추가 시 `useRef` + `scrollIntoView`로 자동 하단 스크롤
- [x] `src/components/chat/ChatInput.jsx` + `.css`: 텍스트 입력(placeholder "메시지를 입력하세요") + 전송 버튼, Enter 키 전송, 로딩 중 입력/버튼 비활성화 + 버튼 텍스트 "응답 생성 중..." + CSS 스피너(별도 아이콘 라이브러리 없이 순수 CSS 애니메이션)
- [x] `src/components/chat/ChatMain.jsx` + `.css`: 위 3개를 조합하는 컨테이너(헤더 고정 상단, 메시지 목록 flex-grow, 입력창 하단)
- [x] `App.jsx`에 임시 mock 대화 로직 연결(사용자 메시지 추가 → `isLoading` true → `setTimeout` 후 mock AI 응답 추가) — **TODO 주석으로 명시**: "5. 상태관리 연결" 단계에서 실제 `useChat` 훅 + `POST /chat` 호출로 교체 예정
- [x] **브라우저 검증**(Playwright, 콘솔 에러 없음 확인):
  - 빈 상태 → 메시지 입력 후 Enter 전송 → 사용자 말풍선 즉시 표시 + 전송 버튼이 스피너+"응답 생성 중..."으로 전환 + 입력창 비활성화
  - 응답 도착 후 AI 말풍선(흰 배경, "AI" 라벨)이 사용자 말풍선(파란 배경, "사용자" 라벨) 아래 추가 표시 — `chat_ui_설계도.jpg`의 스타일과 일치
  - "대화 초기화" 클릭 시 메시지 목록이 정상적으로 비워짐
- [x] lint/build 통과

## 완료: task_plan.md "5. 상태관리 연결"
- [x] `src/hooks/useModels.js`: 마운트 시 `GET /models` 호출, `ignore` 플래그로 race condition 방지(findings.md 2.1 패턴), `models`/`isLoading`/`error` 반환
- [x] `src/hooks/useChat.js`: `messages`/`isLoading` 상태 + `sendMessage(text, settings)`(싱글턴 — 매번 최신 입력 `message`만 전송, 이전 대화는 화면에만 누적) + `resetConversation()`. `settings`를 `ChatRequest` 스키마(`model`/`system_prompt`/`temperature`/`top_p`/`num_predict`)로 매핑해 `POST /chat` 호출
- [x] 에러 처리: `/chat` 실패 시 `role: 'error'` 메시지를 대화 목록에 추가(크래시 없이 처리) — `MessageBubble`에 `--error` 스타일(연한 빨강, 다크모드 대응) 추가
- [x] `App.jsx`: `App.jsx`의 mock 로직 제거, `useModels`/`useChat` 훅으로 완전히 교체. 모델 목록 로딩/에러 상태에 따라 사이드바에 로딩 문구/에러 문구를 조건부 렌더링. 모델 목록 도착 전 `settings.model`이 비어있을 때는 (state를 effect에서 직접 변경하는 대신) 렌더링 시점에 `models[0]`로 대체하는 파생값(`effectiveSettings`)을 사용해 `react-hooks/set-state-in-effect` 린트 규칙 위반 없이 처리
- [x] **실제 백엔드 E2E 검증** (mock이 아닌 실제 연동을 이번에 처음으로 확인):
  - 로컬에 Ollama와 여러 모델(`x/flux2-klein`, `sageuk-qwen`, `gemma4:e2b`, `qwen3.5:9b`, `exaone3.5:7.8b`)이 실제로 설치되어 있어, `backend/main.py`를 직접 띄우고(`.venv/bin/python main.py`, port 8100) 프론트 dev 서버와 함께 Playwright로 실제 왕복 테스트 수행
  - `GET /models` 실제 응답으로 드롭다운이 채워짐을 확인, `qwen3.5:9b` 선택 후 "1+1은 뭐야? 숫자로만 답해줘." 전송 → 실제 Ollama 응답 **"2"**가 AI 말풍선으로 정상 표시됨(콘솔 에러 없음)
  - **에러 경로도 실제로 검증**: 백엔드 프로세스를 종료한 상태에서 새로고침 → 사이드바에 "모델 목록을 불러오지 못했습니다..." 에러 문구 표시, 이어서 메시지 전송 시도 → "오류: 응답을 받아오지 못했습니다..." 빨간 말풍선 표시, 앱 크래시 없음(콘솔 에러 없음) 확인
  - 테스트에 사용한 backend/frontend 프로세스는 검증 후 모두 종료함(백엔드는 원래 꺼져 있던 상태로 복귀)
- [x] lint/build 통과

## 완료: task_plan.md "6. 스타일링 마무리" (Must-have 체크리스트 전 항목 완료)
- [x] 헤더 타이틀 폰트 크기를 설계도 비율에 맞춰 22px → 26px로 조정
- [x] 접근성: 헤더 리셋 버튼/사이드바 입력 요소/채팅 입력·전송 버튼에 `:focus-visible` 아웃라인 추가, `MessageList`에 `role="log" aria-live="polite"` 추가(새 메시지가 스크린리더에 안내되도록)
- [x] **브라우저 검증**(Playwright, 실제 백엔드 연동 상태로 진행):
  - 데스크톱 라이트/다크 모드 스크린샷 확인 — 다크모드에서 배경/테두리/말풍선 색상 모두 자연스럽게 전환됨(기존 `index.css`의 다크 변수 재사용)
  - 키보드 탭 순서 확인: 모델 선택 → 시스템 프롬프트 → Temperature → Top P → Num Predict → 헤더 리셋 버튼 순으로 DOM 순서와 일치
  - **모바일(390px) 최초 점검에서 실제 문제 2건 발견 및 수정**:
    1. 사이드바에 `max-height: 45vh` + 내부 스크롤이 걸려 있어 Top P/Num Predict 필드가 화면에 안 보이고 잘림 → 모바일에서는 `max-height` 제한을 없애고 페이지 전체가 자연스럽게 스크롤되도록 변경(`ChatLayout.css`)
    2. 좁은 화면에서 헤더의 타이틀+버튼이 한 줄에 억지로 배치되며 타이틀이 어색하게 줄바꿈됨 → 480px 이하에서 헤더를 세로 배치(타이틀 위, 버튼 아래 우측 정렬)로 전환(`ChatHeader.css`)
    - 수정 후 재검증: 모든 사이드바 필드가 잘림 없이 표시되고, 헤더도 자연스럽게 2줄로 나뉘어 표시됨을 스크린샷으로 확인
- [x] lint/build 통과, 테스트에 사용한 backend/frontend 프로세스 모두 종료

## 완료: Nice-to-have 1, 2, 3, 7번 (사용자 선택)
- [x] **① 타임스탬프/모델명/elapsed_time 표시**: `useChat.js`에서 메시지 생성 시 `timestamp`(user/assistant/error 공통), `model`/`elapsedTime`(assistant만, `ChatResponse.model`/`elapsed_time` 그대로 사용)을 저장. `MessageBubble.jsx`에 `message-bubble__header`/`__meta` 추가해 "오후 5:13 · qwen3.5:9b · 11.661초" 형식으로 표시(`toLocaleTimeString('ko-KR')`)
- [x] **② 메시지 복사 버튼**: 모든 말풍선 하단에 "복사" 버튼 추가, `navigator.clipboard.writeText` 사용, 클릭 시 1.5초간 "복사됨"으로 표시
- [x] **③ Markdown/코드블록 렌더링**: `react-markdown@10.1.0` 설치(React `>=18` 호환 확인, npm 레지스트리로 최신 버전 확인). AI(assistant) 응답에만 적용(사용자 입력/에러 메시지는 그대로 plain text 유지). 코드블록은 기존 `index.css`의 `--code-bg`/`--mono` 토큰을 재사용해 스타일 일관성 유지. `remark-gfm`(표/취소선 등)은 PRD/설계도에서 요구하지 않아 설치하지 않음(불필요한 의존성 추가 방지)
- [x] **⑦ 사이드바 접기/펼치기**: `ChatLayout`이 `isSidebarOpen`/`onToggleSidebar` props를 받아, 열림 상태에선 사이드바 상단에 "‹ 설정 숨기기" 버튼을, 닫힘 상태에선 32px(모바일 40px 전체 너비) 얇은 세로/가로 바에 "›" 버튼을 렌더링. 상태는 `App.jsx`의 `useState(true)`로 관리
- [x] **브라우저 검증**(Playwright, 실제 백엔드+Ollama 연동):
  - 실제 AI 응답에 메타 정보(시간·모델·소요시간)가 정확히 표시됨을 확인
  - 복사 버튼 클릭 → 클립보드 내용이 실제 원문과 일치함을 `navigator.clipboard.readText()`로 직접 검증, 버튼 라벨이 "복사됨"으로 바뀌는 것도 확인
  - **Markdown 렌더링 검증 2단계**: (1) 실제 LLM에게 "코드블록+굵은글씨+목록"을 요청했을 때 코드블록(````python`)은 정상적으로 `<pre><code>` 스타일로 렌더링됨을 확인. 다만 같은 응답에서 굵은글씨/목록은 렌더링되지 않아 최초엔 버그로 의심됨 → (2) 원인 규명을 위해 알려진 정확한 마크다운 문자열(`**bold**`, `## Heading`)로 별도 테스트한 결과 `<strong>`/`<h2>`로 정확히 변환되는 것을 확인 — 즉 렌더링 로직은 정상이며, 처음 테스트에서 굵은글씨/목록이 안 보인 것은 해당 LLM 응답 자체가 엄격한 CommonMark 문법(빈 줄 구분 등)을 따르지 않아 발생한 모델 출력 품질 이슈였음(우리 코드 문제 아님)
  - 사이드바 접기/펼치기를 데스크톱(1440px)과 모바일(390px) 양쪽에서 클릭으로 직접 토글해 정상 동작 확인
  - 콘솔 에러 없음
- [x] lint/build 통과, 테스트에 사용한 backend/frontend 프로세스 모두 종료
- `prd.md` 3.2절 Nice-to-have 체크리스트에 완료 표시 반영(①②③⑦ 완료, 나머지 3개는 보류)

## 요약
`prd.md`의 Must-have 요구사항 전체 + 사용자가 선택한 Nice-to-have 4개(①타임스탬프/메타 정보, ②복사 버튼, ③Markdown 렌더링, ⑦사이드바 접기)가 모두 구현되고 실제 백엔드(Ollama)와의 E2E 테스트로 검증됨. 남은 Nice-to-have는 다크모드 수동 토글 UI, localStorage 대화 저장, 파라미터 프리셋 3개뿐이며 우선순위가 낮아 보류 상태.
