# EFF

Easy Form Fill Chrome Extension

## 개발환경 설정

### chrome extension 파일 업로드

1. chrome 확장프로그램관리 메뉴로 이동.
2. 우측 상단 개발자 모드 ON
3. 좌측 상단 버튼 중 '압축해제된 확장 프로그램을 로드합니다' 클릭
4. 압축해제한 EFF 파일을 선택.
5. 우측 상단 확장 도구에서 F 아이콘 추가되었는지 확인

### 파일 수정 및 확인

1. js, html 등을 수정
2. chrome 확장프로그램관리에서 추가된 EFF에서 새로 고침 버튼 클릭

### tailwind CSS Watch

tailwind css 실시간 적용을 위해 아래의 명령어를 터미널에 입력

```bash
npx tailwindcss -i ./css/tailwind.css -o ./dist/tailwind.css -w
```
