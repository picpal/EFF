import {
  getContentDom,
  paintErrorMessage,
  clearContent,
  hideClearBtn,
  showClearBtn,
} from "../commonUI.js";

export default class Settings {
  #settings;
  #tabId;

  constructor() {
    this.#tabId = "SETTINGS";
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
    chrome.runtime.sendMessage({ message: this.#tabId }, (response) => {
      this.render(response);
    });
  };

  render = (dataList) => {
    // content initialize
    clearContent();

    // no data
    if (!dataList || dataList.length === 0) {
      paintErrorMessage("Empty Content");
      hideClearBtn();
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
        showClearBtn();
      }

      // add list
      const $content = getContentDom();
      $content.appendChild($ul);
    } else {
      paintErrorMessage("template is not support");
    }
  };
}
