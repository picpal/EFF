import {
  getContentDom,
  paintErrorMessage,
  paintViewDetailContent,
  clearContent,
  clearViewDetailContent,
  hideClearBtn,
  showClearBtn,
} from "../commonUI.js";

export default class History {
  #history;
  #tabId;

  constructor() {
    this.#tabId = "HISTORY";
  }

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

  like({ uid, tabTitle }) {
    chrome.runtime.sendMessage({ message: "LIKE", uid, tabTitle }, () => true);
  }

  removeAll = (tabId) => {
    chrome.runtime.sendMessage({
      message: "DELETE_ALL",
      params: { tabId },
    });

    // re render
    chrome.runtime.sendMessage({ message: "HISTORY" }, (response) => {
      this.render(response);
    });
  };

  render = (dataList) => {
    // content initialize
    clearContent();

    if (!dataList || dataList.length === 0) {
      hideClearBtn();
      paintErrorMessage("Empty Content");
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
        const buttons = row.querySelectorAll("button");
        buttons.forEach((button) => (button.dataset.uid = rowData.uid));

        //set list data
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
      tabId: "HISTORY",
      uid,
    });

    await chrome.tabs.sendMessage(tab.id, { message: "FILL", params });
  };

  viewDetail = async ({ uid, tabId }) => {
    // init
    clearViewDetailContent();

    // get data
    const params = await chrome.runtime.sendMessage({
      message: "GET_ROW_DATA",
      tabId,
      uid,
    });

    // create params content
    params.uid = uid;
    paintViewDetailContent(params);
  };

  saveDetailPopup = async (uid, tabId) => {
    const $viewDetailSaveBtn = document.querySelector("#viewDetailSaveBtn");

    // newValue를 form > input에 입력된 항목으로 설정해줘야 함.
    // uid도 같이 넘겨줘야 함. 아니면 어떤 항목을 찾아서 바꿔줘야 할 지 알 수 없음.

    // chrome.runtime.sendMessage({
    //   message: "SET_TITLE",
    //   storeName,
    //   uid,
    //   newValues: { tabTitle },
    // });
  };
}
