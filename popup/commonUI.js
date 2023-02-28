export const clearContent = () => {
  const $content = getContentDom();
  while ($content.firstChild) $content.removeChild($content.firstChild);
};

export const clearViewDetailContent = () => {
  const $requestParam = document.querySelector("#requestParam");
  $requestParam.innerHTML = "";
};

export const getContentDom = () => {
  const $request_list = document.querySelector("#request_list");
  const $content = $request_list?.querySelector(".content");

  if (!$content) {
    paintErrorMessage("Not found content DOM element");
  }

  return $content;
};

export const getActiveTabId = () => {
  const $activeTab = document.querySelector(".activeTab");
  const tabId = $activeTab?.dataset.tabId || "";

  if (!tabId) paintErrorMessage("Tab id setting error");

  return tabId;
};

export const paintErrorMessage = (message) => {
  const $content = getContentDom();
  const $content_empty = document.querySelector("#content_empty");
  const cloneNode = document.importNode($content_empty.content, true);
  const $message = cloneNode.querySelector("p");

  if (message) $message.innerText = message;

  $content.appendChild(cloneNode);
};

export const paintViewDetailContent = (params) => {
  const $requestParam = document.querySelector("#requestParam");

  if (params && $requestParam) {
    let $tr, $paramName, $paramValue;
    for (let key in params) {
      $tr = document.createElement("tr");
      $paramName = document.createElement("td");
      $paramValue = document.createElement("td");

      // add class
      $paramName.className = "border border-gray-300 px-4 py-2";
      $paramValue.className = "border border-gray-300 px-4 py-2";

      // set tag
      $paramName.innerHTML = `${key}`;
      $paramValue.innerHTML = `<input type="text" class="h-6 w-full" name="${key}" value="${params[key]}"/>`;

      $tr.appendChild($paramName);
      $tr.appendChild($paramValue);
      $requestParam.appendChild($tr);
    }

    const $viewDetail = document.querySelector("#viewDetail");
    $viewDetail.classList.remove("hidden");

    const $inputUid = document.createElement("input");
    $inputUid.id = "dataUid";
    $inputUid.className = "hidden";
    $inputUid.value = params.uid;

    $viewDetail.appendChild($inputUid);
  } else {
    console.error(`param error`);
    console.error($requestParam);
    console.error(params);
  }
};

export const hideClearBtn = () => {
  const $clearBtn = document.querySelector("#clearBtn");
  $clearBtn.classList.add("hidden");
};

export const showClearBtn = () => {
  const $clearBtn = document.querySelector("#clearBtn");
  $clearBtn.classList.remove("hidden");
};
