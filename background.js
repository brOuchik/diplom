class ContextMenu {
  constructor(title, id, contexts) {
    this.title = title;
    this.id = id;
    this.contexts = contexts;
    chrome.contextMenus.create({ title, id, contexts });
    chrome.contextMenus.onClicked.addListener(this.onContextClick);
  }

  onContextClick = (info, tab) => {
    if (info.menuItemId === this.id) {
        chrome.tabs.sendMessage(tab.id, { task: "addBlockTag"});
      }
    
  }

  remove = () => {
    chrome.contextMenus.onClicked.removeListener(this.onClick);
    chrome.contextMenus.remove(this.id);
  }
}

const contextMenu = new ContextMenu("Delete this", "Ext", ["all"]);