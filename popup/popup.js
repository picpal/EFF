class History {
  #history;

  constructor() {}

  setState = (data) => {
    this.#history = data;
    this.render(this.#history);
  };

  setData(data) {
    //save IDB

    // save State
    this.setState(data);
  }

  getData() {
    return this.#history;
  }

  like(params) {
    const { uid, tabTitle } = params;
    chrome.runtime.sendMessage({ message: "LIKE", uid, tabTitle }, () => true);
  }

  render = (dataList) => {
    // content initialize
    clearContent();

    if (!dataList || dataList.length === 0) {
      paintErrorMessage("Empty Content");
      setScrollMark();
      return;
    }

    if ("content" in document.createElement("template")) {
      // get content template
      const $history_row = document.querySelector("#history_row");
      const $ul = document.createElement("ul");

      // clone and crate rows
      for (let i = 0; i < dataList.length; i++) {
        const rowData = dataList[i];
        const row = document.importNode($history_row.content, true);

        //set btn data
        const [getBtn, likeBtn] = row.querySelectorAll("button");
        getBtn.dataset.uid = rowData.uid;
        likeBtn.dataset.uid = rowData.uid;

        //set list data
        const tabTitle = row.querySelector(".tabTitle");
        tabTitle.value = rowData.tabTitle;
        tabTitle.dataset.uid = rowData.uid;

        const tooltip = row.querySelector(".tooltip");
        const url = tooltip.querySelector("li");
        url.textContent = rowData.params.url;

        $ul.appendChild(row);
      }

      // add list
      const $content = getContentDom();
      $content.appendChild($ul);
    } else {
      paintErrorMessage("template is not support");
    }

    setScrollMark();
  };

  fillForm = (uid) => {
    chrome.runtime.sendMessage(
      { message: "GET_ROW_DATA", tabId: "HISTORY", uid },
      async (params) => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        await chrome.tabs.sendMessage(tab.id, { message: "FILL", params });
      }
    );
  };
}

class Favorite {
  #favorite;

  constructor() {}

  setState = (data) => {
    this.#favorite = data;
    this.render(this.#favorite);
  };

  setData(data) {
    //save IDB

    // save State
    this.setState(data);
  }

  getData() {
    return this.#favorite;
  }

  remove = (params) => {
    const { uid } = params;
    chrome.runtime.sendMessage({
      message: "DELETE",
      params: { uid, tabId: "FAVORITE" },
    });

    chrome.runtime.sendMessage({ message: "FAVORITE" }, (response) => {
      this.render(response);
    });
  };

  render = (dataList) => {
    // content initialize
    clearContent();

    if (!dataList || dataList.length === 0) {
      paintErrorMessage("Empty Content");
      setScrollMark();
      return;
    }

    if ("content" in document.createElement("template")) {
      // get content template
      const $favorite_row = document.querySelector("#favorite_row");
      const $ul = document.createElement("ul");

      // clone and crate rows
      for (let i = 0; i < dataList.length; i++) {
        const rowData = dataList[i];
        const row = document.importNode($favorite_row.content, true);

        //set btn data
        const [getBtn, likeBtn] = row.querySelectorAll("button");
        getBtn.dataset.uid = rowData.uid;
        likeBtn.dataset.uid = rowData.uid;

        //set list data
        const tabTitle = row.querySelector(".tabTitle");
        tabTitle.value = rowData.tabTitle;
        tabTitle.dataset.uid = rowData.uid;

        const tooltip = row.querySelector(".tooltip");
        const url = tooltip.querySelector("li");
        url.textContent = rowData.params.url;

        $ul.appendChild(row);
      }

      // add list
      const $content = getContentDom();
      $content.appendChild($ul);
    } else {
      paintErrorMessage("template is not support");
    }

    setScrollMark();
  };

  fillForm = (uid) => {
    chrome.runtime.sendMessage(
      { message: "GET_ROW_DATA", tabId: "FAVORITE", uid },
      async (params) => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        await chrome.tabs.sendMessage(tab.id, { message: "FILL", params });
      }
    );
  };
}

class Settings {
  #settings;

  constructor() {
    this.#settings = {};
  }

  setState(data) {
    this.#settings = data;
    this.render(this.#settings);
  }

  setData(data) {
    //save IDB

    // save State
    this.setState(data);
  }

  getData() {
    return this.#settings;
  }

  remove = (params) => {
    const { uid } = params;

    chrome.runtime.sendMessage(
      { message: "DELETE", params: { uid, tabId: "SETTINGS" } },
      () => true
    );
    chrome.runtime.sendMessage({ message: "SETTINGS" }, (response) => {
      this.render(response);
    });
  };

  render = (dataList) => {
    // content initialize
    clearContent();

    // no data
    if (!dataList || dataList.length === 0) {
      paintErrorMessage("Empty Content");
      setScrollMark();
      return;
    }

    if ("content" in document.createElement("template")) {
      //get content template
      const $settings_row = document.querySelector("#settings_row");
      const $ul = document.createElement("ul");

      // clone and create rows
      for (let i = 0; i < dataList.length; i++) {
        const rowData = dataList[i];
        const row = document.importNode($settings_row.content, true);

        // set btn data
        const [getBtn] = row.querySelectorAll("button");
        getBtn.dataset.uid = rowData.uid;

        // set list data
        const [url] = row.querySelectorAll("div");
        url.textContent = rowData.params.url;

        $ul.appendChild(row);
      }

      // add list
      const $content = getContentDom();
      $content.appendChild($ul);
    } else {
      paintErrorMessage("template is not support");
    }

    setScrollMark();
  };
}

let history, favorite, settings;

const init = () => {
  history = new History();
  favorite = new Favorite();
  settings = new Settings();

  chrome.runtime.sendMessage({ message: "GET_HISTORY_STATE" }, (response) => {
    document.querySelector("#toggle_btn").checked = response;
    return true;
  });

  chrome.runtime.sendMessage({ message: "HISTORY" }, (response) => {
    history.setData(response);
    return true;
  });
};

const getActiveTabId = () => {
  const $activeTab = document.querySelector(".activeTab");
  const tabId = $activeTab?.dataset.tabId || "";

  if (!tabId) paintErrorMessage("Tab id setting error");

  return tabId;
};

const getContentDom = () => {
  const $request_list = document.querySelector("#request_list");
  const $content = $request_list?.querySelector(".content");

  if (!$content) {
    paintErrorMessage("Not found content DOM element");
  }

  return $content;
};

const getSearchDiv = () => {
  const $search_div = document.querySelector("#search_div");
  let result = $search_div?.options[$search_div?.selectedIndex].value;
  return result || "";
};

const getContentInstance = () => {
  let result;

  const tabId = getActiveTabId();
  switch (tabId) {
    case "HISTORY":
      result = history;
      break;
    case "FAVORITE":
      result = favorite;
      break;
  }

  return result;
};

const setActiveTab = (target) => {
  return new Promise((resolve, reject) => {
    try {
      document.querySelector(".activeTab")?.classList.remove("activeTab");
      target?.classList.add("activeTab");
      resolve(true);
    } catch (e) {
      console.error("e.message");
      reject(false);
    }
  });
};

const setContentData = (state) => {
  const tabId = getActiveTabId();

  switch (tabId) {
    case "SETTINGS":
      settings.setState(state);
      break;
    case "HISTORY":
      history.setState(state);
      break;
    case "FAVORITE":
      favorite.setState(state);
      break;
    default:
      paintErrorMessage("Not found Active Tab id");
      break;
  }
};

const setFilterContentList = (filterText) => {
  // set content instance
  let content = getContentInstance();

  // content data filtering
  let tabData, filterData;
  const searchDiv = getSearchDiv();
  switch (searchDiv) {
    case "URL":
      tabData = content.getData();
      filterData = tabData.filter((item) =>
        item.params.url.includes(filterText)
      );
      break;
    case "TITLE":
      tabData = content.getData();
      filterData = tabData.filter((item) => item.tabTitle.includes(filterText));
  }

  //render content
  content.render(filterData);
};

const setScrollMark = () => {
  const contentRowCnt = document.querySelectorAll(".content_row")?.length || 0;
  const $downArrow = document.querySelector("#down_arrow");

  if (contentRowCnt > 8) {
    $downArrow.classList.remove("hidden");
  } else {
    $downArrow.classList.add("hidden");
  }
};

const renderContent = () => {
  const tabId = getActiveTabId();

  if (!tabId) return;

  //set content list
  chrome.runtime.sendMessage({ message: tabId }, (response) => {
    setContentData(response);
    return true;
  });
};

const renderHeaderInput = () => {
  const tabId = getActiveTabId();

  if (!tabId) return;

  const $schBar = document.querySelector("#sch_bar");
  const $addBar = document.querySelector("#add_bar");

  if (tabId === "SETTINGS") {
    $schBar.classList.add("hidden");
    $addBar.classList.remove("hidden");
  } else {
    $schBar.classList.remove("hidden");
    $addBar.classList.add("hidden");
  }
};

const clearHeaderInput = () => {
  document.querySelector('input[name="search_text"]').value = "";
  document.querySelector('input[name="add_url"]').value = "";
};

const clearContent = () => {
  const $content = getContentDom();
  while ($content.firstChild) $content.removeChild($content.firstChild);
};

const paintErrorMessage = (message) => {
  const $content = getContentDom();
  const $content_empty = document.querySelector("#content_empty");
  const cloneNode = document.importNode($content_empty.content, true);
  const $message = cloneNode.querySelector("p");

  if (message) $message.innerText = message;

  $content.appendChild(cloneNode);
};

const sendMessageToBackground = (btnDiv, params) => {
  switch (btnDiv) {
    case "HISTORY_LIKE":
      history.like(params);
      break;
    case "FAVORITE_DEL":
      favorite.remove(params);
      break;
    case "SETTINGS_DEL":
      settings.remove(params);
      break;
  }
};

const sendMessageToClient = async (btnDiv, params) => {
  const { uid } = params;

  switch (btnDiv) {
    case "HISTORY_GET":
      history.fillForm(uid);
      break;
    case "FAVORITE_GET":
      favorite.fillForm(uid);
      break;
  }
};

const listClickHandler = () => {
  const $list = document.querySelector("#request_list");

  $list.addEventListener("click", (e) => {
    const uid = e.target.dataset.uid || "";
    const btnDiv = e.target.dataset.btnDiv || "";

    if (uid === "" || btnDiv === "") return;

    const tabTitle =
      e.target.parentNode.querySelector(".tabTitle")?.value || "";
    console.log(btnDiv);
    sendMessageToBackground(btnDiv, { uid, tabTitle });
    sendMessageToClient(btnDiv, { uid });
  });
};

const listFocusHandler = () => {
  let oldVal, newVal;

  const $list = document.querySelector("#request_list");
  $list.addEventListener("focusin", (e) => {
    oldVal = e.target.value;

    e.target.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.keyCode === 13) event.target.blur();
    });
  });

  $list.addEventListener("focusout", (e) => {
    const uid = e.target.dataset.uid || "";
    newVal = e.target.value;

    if (oldVal != newVal) {
      const tabTitle = newVal;
      const storeName = getActiveTabId();

      chrome.runtime.sendMessage({
        message: "SET_TITLE",
        storeName,
        uid,
        tabTitle,
      });
    }
  });
};

const selectBoxChangeHandler = () => {
  const $search_div = document.querySelector("#search_div");
  $search_div.addEventListener("change", () => {
    clearHeaderInput();
    renderContent();
  });
};

// 타자를 빠르게 치면 실행이 많이 되기 때문에 데이터가 많아질 경우 대비하여
// settime out을 이용한 딜레이를 줘야할것 같음
const searchInputHandler = () => {
  const $search_text = document.querySelector('input[name="search_text"');

  $search_text.addEventListener("keyup", (e) => {
    const tabId = getActiveTabId();
    if (tabId === "" || tabId === "SETTINGS") return;

    setFilterContentList(e.target.value);
  });
};

const headerClickHandler = () => {
  const $easyFillHeader = document.querySelector("#easyFill_header");

  $easyFillHeader.addEventListener("click", (e) => {
    const target = e.target;

    //tab event
    if (target.dataset.tabId) {
      // set tab active
      setActiveTab(target).then((result) => {
        if (!result)
          paintErrorMessage("active tab setting error. please check log");

        clearHeaderInput();
        renderHeaderInput();
        renderContent();
      });
    }

    // search and add input event
    if (target.dataset.btnId) {
      const btnId = target.dataset.btnId;
      switch (btnId) {
        case "ALL_HISTORY":
          const toggleState = target.checked;
          chrome.runtime.sendMessage({
            message: "SET_HISTORY_STATE",
            toggleState,
          });
          break;
        case "ADD":
          const $addUrl = document.querySelector('input[name="add_url"]');
          const url = $addUrl.value || "";

          // url validate
          if (url === "") return;

          //add url
          chrome.runtime.sendMessage(
            { message: "ADD_SETTINGS_DATA", url },
            () => {
              //search url
              chrome.runtime.sendMessage(
                { message: "SETTINGS" },
                (response) => {
                  clearHeaderInput();
                  settings.setState(response);
                }
              );
            }
          );

          break;
      }
    }
  });
};

init();
listFocusHandler();
selectBoxChangeHandler();
listClickHandler();
headerClickHandler();
searchInputHandler();
