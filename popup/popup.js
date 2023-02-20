import History from "./popupTabs/History.js";
import Favorite from "./popupTabs/Favorite.js";
import Settings from "./popupTabs/Settings.js";
import { getActiveTabId, paintErrorMessage } from "./commonUI.js";

export default class Popup {
  #history;
  #favorite;
  #settings;

  constructor() {
    this.#history = new History();
    this.#favorite = new Favorite();
    this.#settings = new Settings();

    chrome.runtime.sendMessage({ message: "GET_HISTORY_STATE" }, (response) => {
      document.querySelector("#toggle_btn").checked = response;
      return true;
    });

    chrome.runtime.sendMessage({ message: "HISTORY" }, (response) => {
      this.#history.setData(response);
      return true;
    });

    this.listFocusHandler();
    this.selectBoxChangeHandler();
    this.listBtnClickHandler();
    this.headerClickHandler();
    this.clearClickHandler();
    this.searchInputHandler();
  }

  clearHeaderInput = () => {
    document.querySelector('input[name="search_text"]').value = "";
    document.querySelector('input[name="add_url"]').value = "";
  };

  getSearchDiv = () => {
    const $search_div = document.querySelector("#search_div");
    let result = $search_div?.options[$search_div?.selectedIndex].value;
    return result || "";
  };

  getContentInstance = () => {
    let result;

    const tabId = getActiveTabId();
    switch (tabId) {
      case "HISTORY":
        result = this.#history;
        break;
      case "FAVORITE":
        result = this.#favorite;
        break;
    }

    return result;
  };

  clearClickHandler = () => {
    const $clearBtn = document.querySelector("#clearBtn");
    $clearBtn.addEventListener("click", (e) => {
      const tabId = getActiveTabId();

      if (confirm(`Are you sure you want to delete all ${tabId} data?`)) {
        this.#history.removeAll(tabId);
        this.clearHeaderInput();
        this.renderHeaderInput();
        this.renderContent();
      }
    });
  };

  headerClickHandler = () => {
    const $easyFillHeader = document.querySelector("#easyFill_header");

    $easyFillHeader.addEventListener("click", (e) => {
      const target = e.target;

      //tab event
      if (target.dataset.tabId) {
        // set tab active
        this.setActiveTab(target).then((result) => {
          if (!result)
            paintErrorMessage("active tab setting error. please check log");

          this.clearHeaderInput();
          this.renderHeaderInput();
          this.renderContent();
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
                    this.clearHeaderInput();
                    this.#settings.setState(response);
                  }
                );
              }
            );

            break;
        }
      }
    });
  };

  listBtnClickHandler = () => {
    const $list = document.querySelector("#request_list");

    $list.addEventListener("click", async (e) => {
      let uid = e.target.dataset.uid || "";
      let btnDiv = e.target.dataset.btnDiv || "";
      let tabTitle =
        e.target.parentNode.querySelector(".tabTitle")?.value || "";

      if (e.target.dataset.icon === "Y") {
        uid = e.target.parentNode.dataset.uid;
        btnDiv = e.target.parentNode.dataset.btnDiv;
        tabTitle =
          e.target.parentNode.parentNode.querySelector(".tabTitle")?.value ||
          "";
      }

      if (uid === "" || btnDiv === "") return;

      this.sendMessageToBackground(btnDiv, { uid, tabTitle });
      await this.sendMessageToClient(btnDiv, { uid });
    });
  };

  listFocusHandler = () => {
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

  renderContent = () => {
    const tabId = getActiveTabId();

    if (!tabId) return;

    //set content list
    chrome.runtime.sendMessage({ message: tabId }, (response) => {
      this.setContentData(response);
      return true;
    });
  };

  renderHeaderInput = () => {
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

  setActiveTab = (target) => {
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

  setContentData = (state) => {
    const tabId = getActiveTabId();

    switch (tabId) {
      case "SETTINGS":
        this.#settings.setState(state);
        break;
      case "HISTORY":
        this.#history.setState(state);
        break;
      case "FAVORITE":
        this.#favorite.setState(state);
        break;
      default:
        paintErrorMessage("Not found Active Tab id");
        break;
    }
  };

  setFilterContentList = (filterText) => {
    // set content instance
    let content = this.getContentInstance();
    console.log(content);

    // content data filtering
    let tabData, filterData;
    const searchDiv = this.getSearchDiv();
    switch (searchDiv) {
      case "URL":
        tabData = content.getData();
        filterData = tabData.filter((item) =>
          item.params.url.includes(filterText)
        );
        break;
      case "TITLE":
        tabData = content.getData();
        filterData = tabData.filter((item) =>
          item.tabTitle.includes(filterText)
        );
    }

    //render content
    content.render(filterData);
  };

  sendMessageToBackground = (btnDiv, params) => {
    switch (btnDiv) {
      case "HISTORY_LIKE":
        this.#history.like(params);
        break;
      case "FAVORITE_DEL":
        this.#favorite.remove(params);
        break;
      case "SETTINGS_DEL":
        this.#settings.remove(params);
        break;
    }
  };

  sendMessageToClient = async (btnDiv, params) => {
    const { uid } = params;

    switch (btnDiv) {
      case "HISTORY_GET":
        await this.#history.fillForm(uid);
        break;
      case "FAVORITE_GET":
        this.#favorite.fillForm(uid);
        break;
    }
  };

  selectBoxChangeHandler = () => {
    const $search_div = document.querySelector("#search_div");
    $search_div.addEventListener("change", () => {
      this.clearHeaderInput();
      this.renderContent();
    });
  };

  searchInputHandler = () => {
    const $search_text = document.querySelector('input[name="search_text"');

    $search_text.addEventListener("keyup", (e) => {
      const tabId = getActiveTabId();
      if (tabId === "" || tabId === "SETTINGS") return;

      this.setFilterContentList(e.target.value);
    });
  };
}

const popup = new Popup();
