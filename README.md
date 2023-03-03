# 📝 EFF

Easy Form Fill for Chrome Extension

You can save the request history and reload the parameters of the saved request

<br />

## 📢 How to use

### 🔨 초기 설정

- Write the request URL and click the "Add" button in the Settings tab.
- If you want to catch all requests, click the "All history" toggle button at the top right of the page (check if it turns green).
- When a request is made in the browser, either only requests to the specified URL or all requests will be recorded.

<br />

- 설정 탭에서 요청 URL을 작성하고 "ADD" 버튼을 클릭합니다.
- 모든 요청을 파악하려면 페이지 오른쪽 상단의 "All History" 토글 버튼을 클릭하십시오(녹색으로 바뀌는지 확인).
- 브라우저에서 요청이 이루어지면 모든 요청 또는 지정된 URL에 대한 요청이 기록됩니다.
- 단축키를 눌러 확장프로그램을 열 수 있습니다.
  - Window : alt + r
  - Max : command + r

<br /><br />

### 🔍 Search bar

- Located at the top, it allows search according to the options specified in each tab.

<br />

- 상단에 위치해 있으며, 각 탭에서 지정한 옵션에 따라 검색이 가능합니다.

<br />

### 📑 hitory tab 기능

- The title of each list item is set to the title of the current browser tab by default.
  - Clicking on the title allows you to edit it in the input area.
- The green button on the right side of each list item (which looks like two arrows pointing in opposite directions) executes a function that sends the recorded parameters to the browser.
- The blue button on the right side of each list item (which looks like a bookmark icon) executes a function that saves the information recorded in the history as a favorite.
- The orange button (magnifying glass shape) on the right side of each list item opens a popup that displays the request parameter item and value.
  - You can modify and save the values in the request parameter popup for future use.
- Press the red 'Clear' button at the bottom to delete all items in the list.

<br />

- 각 목록 항목의 제목은 기본적으로 현재 브라우저 탭의 제목으로 설정됩니다.
  - 제목을 클릭하면 입력 영역에서 편집할 수 있습니다.
- 각 목록 항목 우측의 녹색 버튼(반대 방향을 가리키는 두 개의 화살표 모양)은 기록된 매개 변수를 브라우저로 보내는 기능을 실행합니다.
- 각 목록 항목 우측의 파란색 버튼(북마크 모양)은 히스토리에 기록된 정보를 즐겨찾기로 저장하는 기능을 수행합니다.
- 각 목록 항목 우측의 주황색 버튼(돋보기 모양)은 request 파라미터 항목과 값을 볼 수 있는 팝업이 열립니다.
  - request 파라미터 팝업에서 value를 수정하여 저장하여 사용 할 수 있습니다.
- 하단 부분 빨간색 버튼(Clear)를 누르면 리스트 항목 전체가 삭제됩니다.

<br />

### ⭐ favorite tab 기능

- The title of each list item is set to the title that is defined in the history, and clicking on it allows you to edit it in the input area.
- The green button on the right side of each list item (which looks like two arrows pointing in opposite directions) executes a function that sends the recorded parameters to the browser.
- The red button on the right side of each list item (which looks like a trash can icon) executes a function that removes the recorded history from the favorites.
- The orange button (magnifying glass shape) on the right side of each list item opens a popup that displays the request parameter item and value.
  - You can modify and save the values in the request parameter popup for future use.
- Press the red 'Clear' button at the bottom to delete all items in the list.

<br />

- 각 목록 항목의 제목은 히스토리에 정의된 제목으로 설정되며, 제목을 클릭하면 입력 영역에서 편집할 수 있습니다.
- 각 목록 항목 우측의 녹색 버튼(반대 방향을 가리키는 두 개의 화살표 모양)은 기록된 매개 변수를 브라우저로 보내는 기능을 실행합니다.
- 각 목록 항목 우측의 빨간색 버튼(휴지통 아이콘 모양)은 기록을 즐겨찾기에서 제거하는 기능을 실행합니다.
- 각 목록 항목 우측의 주황색 버튼(돋보기 모양)은 request 파라미터 항목과 값을 볼 수 있는 팝업이 열립니다.
  - request 파라미터 팝업에서 value를 수정하여 저장하여 사용 할 수 있습니다.
- 하단 부분 빨간색 버튼(Clear)를 누르면 리스트 항목 전체가 삭제됩니다.

<br /><br /><br />

## version 1.1.1

- Add a window close feature after saving.
- Change the default tab to "Favorite".
- Add a keyboard shortcut for EFF popup.

  - Windows: Alt + R
  - Mac: Command + R

<br />

- save 후 창닫기 기능 추가
- default tab favorite로 변경
- EFF 팝업 단축키 추가
  - Window : alt + r
  - Max : command + r

<br /><br />

## version 1.1.0

- Added functionality to view the request parameter information for recorded items.
- Added functionality to view the request parameter information, and save it with desired values after making changes.

<br /><br />

- 기록된 항목의 request parameter 정보를 볼 수 있는 기능 추가
- request parameter 정보를 확인 후 원하는 value 값으로 변경하여 저장하는 기능 추가

<br /><br />

## version 1.0.0

- Save the request parameters.
- Bookmark request history.
- Catch all requests or only specific requests.
- Ability to search the list in each tab by URL or title.
- Set input parameters using request parameters.

  - Supported tag list:
    - input: text, number, email, date, time, password, radio, checkbox.
    - select box.
    - textarea.
  - Unsupported tag list:
    - file.

<br />

- 브라우저의 request parameter 저장
- hitory 리스트를 북마크하는 기능
- 모든 요청 또는 특정 지정한 요청만 저장
- 각 탭에 리스트를 검색할 수 있는 기능. ( 검색 조건은 url, title )
- 저장된 파라미터를 브라우저로 전송

  - 전송 가능한 태그
    - input : text, number, eamil, date, time, password, radio, checkbox
    - selectbox
    - textarea
  - 전송 불가능한 태그
    - file

<br /><br />

## 개발환경 참고

### tailwind CSS Watch

```bash
npx tailwindcss -i ./css/tailwind.css -o ./dist/tailwind.css -w
```
