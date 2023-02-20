import History from "./popupTabs/History.js";
import Favorite from "./popupTabs/Favorite.js";
import Settings from "./popupTabs/Settings.js";
import {
  getActiveTabId,
  getContentInstance,
  paintErrorMessage,
} from "./common.js";

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

const getSearchDiv = () => {
  const $search_div = document.querySelector("#search_div");
  let result = $search_div?.options[$search_div?.selectedIndex].value;
  return result || "";
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
      await history.fillForm(uid);
      break;
    case "FAVORITE_GET":
      favorite.fillForm(uid);
      break;
  }
};

const listBtnClickHandler = () => {
  const $list = document.querySelector("#request_list");

  $list.addEventListener("click", async (e) => {
    let uid = e.target.dataset.uid || "";
    let btnDiv = e.target.dataset.btnDiv || "";

    if (e.target.dataset.icon === "Y") {
      uid = e.target.parentNode.dataset.uid;
      btnDiv = e.target.parentNode.dataset.btnDiv;
    }

    if (uid === "" || btnDiv === "") return;

    const tabTitle =
      e.target.parentNode.querySelector(".tabTitle")?.value || "";
    sendMessageToBackground(btnDiv, { uid, tabTitle });
    await sendMessageToClient(btnDiv, { uid });
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
listBtnClickHandler();
headerClickHandler();
searchInputHandler();
