# HUM 사이트 수정 가이드

## 어떤 페이지인가요?

HUM은 code&의 제품을 소개하는 단일 페이지 브랜드 사이트입니다.
공식 주소는 https://hum-archive.com/ 이며, `#team` 등의 주소는 별도 페이지가 아니라 같은 페이지 안의 구역으로 이동합니다.

## 파일 구성

| 파일 / 폴더             | 역할                                                 |
| ----------------------- | ---------------------------------------------------- |
| `index.html`            | 모든 구역의 문구, 이미지, 팀원 정보와 순서           |
| `styles/main.css`       | 사이트 전체 디자인, 반응형 배치, 인트로, 팀 소개     |
| `styles/experience.css` | 그래픽 체험, 시간대 색상, 발견한 조합 디자인         |
| `styles/campaign.css`   | 모델 포스터와 제품 사진 갤러리                       |
| `scripts/main.js`       | 인트로, 영상 재생, 그래픽 선택, 제품 개폐, 커서 효과 |
| `scripts/experience.js` | 시간대 색상 선택과 조합 컬렉션                       |
| `assets/brand/`         | HUM 및 code& 로고; original 파일은 원본 보관용       |
| `assets/campaign/`      | 모델과 제품이 함께 있는 포스터 사진                  |
| `assets/products/`      | 제품 정면, 뒷면, 개폐, 손에 든 사진                  |
| `assets/team/`          | 팀 소개 임시 사진                                    |
| `assets/video/`         | 시작 인트로 영상과 포스터                            |
| `assets/motion/`        | 그래픽 조각 PNG와 15가지 조합 영상·썸네일            |
| `assets/artwork/`       | 브랜드 아트워크                                      |
| `CNAME`                 | 자체 도메인 설정. hum-archive.com을 유지합니다.      |
| `.nojekyll`             | GitHub Pages에서 정적 파일을 그대로 배포하는 설정    |

## 어디를 수정하나요?

### 문구와 팀원 이메일

`index.html`에서 원하는 문장을 검색하거나 구역 주석을 찾으세요.
팀 정보는 `id="team"` 안의 각 `article class="person"`에 있습니다.
이메일을 수정할 때 화면에 표시되는 글자와 `aria-label` 설명을 함께 수정하세요.

### 제품·모델 사진 교체

`assets/products/` 또는 `assets/campaign/`에 사진을 넣고, `index.html`의 해당 `img`에서 `src`, `alt`, `width`, `height`를 수정하세요.
`alt`는 화면을 읽어주는 기능을 위한 사진 설명입니다.
새 파일은 `hum-front-on-palm.webp`처럼 내용이 드러나는 소문자 영문과 하이픈으로 이름을 붙이세요.
웹 사진은 가능하면 WebP 형식을 사용하고 불필요하게 큰 원본 업로드를 피하세요.

### 그래픽 조합 파일

`fragment-a1.png`는 A1 조각 이미지입니다. `a1b1.mp4`와 `a1b1.jpg`는 A1+B1 조합의 영상과 썸네일입니다.
이 조합 파일명은 JavaScript가 자동으로 조립해서 사용하므로, 조합 코드까지 바꾸려면 두 스크립트의 경로 생성 부분도 함께 수정해야 합니다.

### 색상과 크기

전체 브랜드 색상은 `styles/main.css` 맨 위의 `:root`에서 찾을 수 있습니다.
화면 크기별 스타일은 각 CSS의 `@media` 블록에 있습니다.
같은 선택자가 여러 번 나오는 기존 스타일은 뒤쪽 규칙이 우선합니다. 디자인이 바뀌지 않도록 기존 순서를 유지했습니다.

## 구역 바로가기

- `#campaign`: 모델 포스터
- `#story`: 제품 이야기
- `#device`: 제품과 동작 소개
- `#journey`: 사용 흐름
- `#archive`: 인터랙티브 그래픽 체험
- `#city`: 도시 음환경 구상
- `#company`: code& 소개
- `#team`: 팀 소개

## 코드 정리와 미리보기

처음 한 번 `npm install`을 실행합니다. 수정 후 `npm run format`으로 들여쓰기와 줄바꿈을 맞추고 `npm run format:check`로 확인합니다.
이 사이트는 빌드가 필요 없는 HTML/CSS/JavaScript입니다. 로컬 웹서버로 저장소 루트를 열어 확인하세요. Python이 있다면 `python -m http.server 4173` 실행 후 http://localhost:4173 에서 볼 수 있습니다.

## 배포

이 GitHub 저장소의 `main`에 커밋을 푸시하면 GitHub Pages가 자동 배포합니다. Actions의 배포 성공을 확인한 뒤 공식 사이트를 새로고침하세요.
로컬 작업 기준 폴더는 `work/github-pages`입니다. 상위 작업공간의 `dist`는 미리보기용 복사본이므로 두 곳을 각각 수정하지 말고 이 저장소를 기준으로 작업하세요.

## 유지해야 하는 동작

JavaScript가 찾는 HTML `id`와 `data-*` 속성은 문구만 바꿀 때 삭제하지 마세요.
두 JavaScript 파일은 `main.js` → `experience.js` 순서로 로드합니다.
모션 최소화 설정과 키보드 포커스 스타일도 함께 유지하세요.

## 로컬에서 파일이 여러 곳에 보일 때

실제 Git 저장소는 `work/github-pages`입니다. 이 폴더를 편집기에서 열어 작업하세요. `dist`는 미리보기 사본입니다. 예전 루트 CSS·JS 사본은 상위 작업공간의 `work/legacy-source-backup`에 보관했습니다.

## 스토리와 캠페인 인터랙션

- `scripts/story.js`: 첫 화면의 두 문구, 스크롤 원 그래프, 터치 사진 전환.
- `styles/story.css`: 통계·네 가지 감각 그래픽·제품 렌더·캠페인 반응형 배치.
- `assets/campaign/*-silhouette.webp`: 기본 실루엣. 같은 폴더의 실제 사진은 호버/탭으로 표시됩니다.
- `assets/products/hum-open-render.webp`, `hum-closed-render.webp`: 제품 열기/닫기 이미지.
- 90%는 현재 디자인 시안 예시입니다. 검증된 출처가 생기면 `#story`의 설명과 접근성 라벨을 함께 수정하세요.
