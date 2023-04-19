chrome.contextMenus.create({
    title: "Delete this",
    id: "Ext",
    contexts: ["all"]

  });


chrome.contextMenus.onClicked.addListener(menu => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      task: "Delete this"
    });
  });
});

