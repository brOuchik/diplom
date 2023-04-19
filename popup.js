const allowBtn = document.getElementById('allowBtn');
const blockBtn = document.getElementById('blockBtn');
const domainDiv = document.getElementById('domain')


window.onload = function()
{
  let queryOptions = { active: true, currentWindow: true };
    tabs = chrome.tabs.query(queryOptions, tabs => {
      let parsedUrl = tabs[0].url.replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
      let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
        .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));
      if (localStorage.getItem(domain) === "WhiteList") {
        domainDiv.innerHTML = "Трафик блокируется"
        allowBtn.style.display = 'none'
        blockBtn.style.display = 'inline'
      }
    })
}


allowBtn.addEventListener('click', () => {
  let queryOptions = { active: true, currentWindow: true };
  tabs = chrome.tabs.query(queryOptions, tabs => {
    let parsedUrl = tabs[0].url.replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
      .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

      localStorage.setItem(domain, "WhiteList")
      domainDiv.innerHTML = "Трафик блокируется"
      chrome.tabs.sendMessage(
        tabs[0].id,
        { task: 'allowThisPage' },
        function (response) {
          console.log(response.status);
        }
  );
      
  });
});

blockBtn.addEventListener('click', () => {
  let queryOptions = { active: true, currentWindow: true };
  tabs = chrome.tabs.query(queryOptions, tabs => {
    let parsedUrl = tabs[0].url.replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
      .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

      localStorage.removeItem(domain)
      chrome.tabs.sendMessage(
        tabs[0].id,
        { task: 'blockThisPage' },
        function (response) {
          console.log(response.status);
        }
  );
          
  });
});






allowBtn.addEventListener('click', () => {
  let queryOptions = { active: true, currentWindow: true };
  tabs = chrome.tabs.query(queryOptions, tabs => {

    chrome.tabs.sendMessage(
      tabs[0].id,
      { task: 'allowPage',
        url: tabs[0].url},
      function (response) {
        console.log(response.status);
      }
    );
  });
});

