import {
  getContentDom,
  paintErrorMessage,
  paintViewDetailContent,
  clearContent,
  clearViewDetailContent,
  hideClearBtn,
  showClearBtn,
} from "../commonUI.js";

export default class Favorite {
  #favorite;
  #tabId;

  constructor() {
    this.#tabId = "FAVORITE";
  }

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
      params: { uid, tabId: this.#tabId },
    });

    chrome.runtime.sendMessage({ message: this.#tabId }, (response) => {
      this.render(response);
    });
  };

  removeAll = (tabId) => {
    chrome.runtime.sendMessage({
      message: "DELETE_ALL",
      params: { tabId },
    });

    // re render
    chrome.runtime.sendMessage({ message: "FAVORITE" }, (response) => {
      this.render(response);
    });
  };

  render = (dataList) => {
    // content initialize
    clearContent();

    if (!dataList || dataList.length === 0) {
      paintErrorMessage("Empty Content");
      hideClearBtn();
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

        //set uid for button
        const buttons = row.querySelectorAll("button");
        buttons.forEach((button) => (button.dataset.uid = rowData.uid));

        //set value,uid for list
        const tabTitle = row.querySelector(".tabTitle");
        tabTitle.value = rowData.tabTitle;
        tabTitle.dataset.uid = rowData.uid;

        $ul.appendChild(row);
      }

      // add list
      const $content = getContentDom();
      $content.appendChild($ul);
      showClearBtn();
    } else {
      paintErrorMessage("template is not support");
    }
  };

  fillForm = async (uid) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const params = await chrome.runtime.sendMessage({
      message: "GET_ROW_DATA",
      tabId: this.#tabId,
      uid,
    });

    await chrome.tabs.sendMessage(tab.id, { message: "FILL", params });
  };

  viewDetail = async (uid) => {
    // init
    clearViewDetailContent();

    // get data
    const params = await chrome.runtime.sendMessage({
      message: "GET_ROW_DATA",
      tabId: this.#tabId,
      uid,
    });

    // create params content
    paintViewDetailContent(params);
  };
}
