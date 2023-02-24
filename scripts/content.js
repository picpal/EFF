/**
 * content script
 * 웹페이지 context에서 javascript를 실행 ( 열려있는 브라우저 개발자 도구창에서 확인 )
 * 주입된 페이지의 DOM을 읽고 수정 가능
 * chrome API의 하위 집합만 사용 ( 확장 서비스 작업자와 Message를 교환하면서 나머지에 간접적으로 엑세스 가능)
 */

const fillForm = (params) => {
  /**
   * value 값을 기준으로 radio 태그 체크
   * 동일한 value 값이 있는 경우 마지막 value를 가진 element를 check
   */
  const radioCheck = (name, value) => {
    let selectedRadio = null;

    const el = document.querySelectorAll('input[name="' + name + '"]');
    el.forEach((radio) => {
      if (radio.value === value) selectedRadio = radio;
    });

    if (selectedRadio !== null) selectedRadio.checked = true;
  };

  for (key in params) {
    const el = document.querySelector("[name='" + key + "']");
    if (!el || el.type === "file") continue;

    switch (el.type) {
      case "checkbox":
        params[key] ? (el.checked = true) : "";
        break;
      case "radio":
        radioCheck(key, params[key]);
        break;
      default:
        el.value = params[key];
    }
  }
};

chrome.runtime.onMessage.addListener(function (
  request,
  callback,
  sendResponse
) {
  switch (request.message) {
    case "FILL":
      fillForm(request.params);
      sendResponse({
        received: true,
      });
      break;
  }
});

// chrome.runtime.onMessage.addListener((request, callback, sendResponse) => {});
