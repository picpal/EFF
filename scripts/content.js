/**
 * content script
 * 웹페이지 context에서 javascript를 실행 ( 열려있는 브라우저 개발자 도구창에서 확인 )
 * 주입된 페이지의 DOM을 읽고 수정 가능
 * chrome API의 하위 집합만 사용 ( 확장 서비스 작업자와 Message를 교환하면서 나머지에 간접적으로 엑세스 가능)
 */

const fillForm = (params) => {
  const radioCheck = () => {
    const radioGroup = document.getElementsByName("myRadioGroup");
    let radioValue = "some value";
    let selectedRadio = null;

    radioGroup.forEach(function (radio) {
      if (radio.value === radioValue) {
        selectedRadio = radio;
      }
    });

    if (selectedRadio !== null) {
      selectedRadio.checked = true;
    }
  };

  for (key in params) {
    const el = document.querySelector("[name='" + key + "']");
    if (!el || el.type === "file") continue;

    switch (el.type) {
      case "checkbox":
        params[key] ? (el.checked = true) : "";
        break;
      case "radio":
        radioCheck(el, params[key]);
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
