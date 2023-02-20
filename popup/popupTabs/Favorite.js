import {
  getContentDom,
  paintErrorMessage,
  clearContent,
  hideClearBtn,
  showClearBtn,
} from "../commonUI.js";

export default class Favorite {
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
      tabId: "FAVORITE",
      uid,
    });

    await chrome.tabs.sendMessage(tab.id, { message: "FILL", params });
  };
}
