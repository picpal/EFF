export const clearContent = () => {
  const $content = getContentDom();
  while ($content.firstChild) $content.removeChild($content.firstChild);
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

export const hideClearBtn = () => {
  const $clearBtn = document.querySelector("#clearBtn");
  $clearBtn.classList.add("hidden");
};

export const showClearBtn = () => {
  const $clearBtn = document.querySelector("#clearBtn");
  $clearBtn.classList.remove("hidden");
};
