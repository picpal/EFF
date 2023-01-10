/**
 * content script
 * 웹페이지 context에서 javascript를 실행
 * 주입된 페이지의 DOM을 읽고 수정 가능
 * chrome API의 하위 집합만 사용 ( 확장 서비스 작업자와 Message를 교환하면서 나머지에 간접적으로 엑세스 가능)
 */

const fillForm = (params) => {
  for (key in params) {
    const inputDom = document.querySelector("input[name='" + key + "']");
    if (inputDom) {
      document.querySelector('input[name="' + key + '"]').value = params[key];
    }
  }
};

chrome.runtime.onMessage.addListener((request, callback, sendResponse) => {
  switch (request.message) {
    case "FILL":
      fillForm(request.params);
      break;
  }
});
