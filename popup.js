class Popup {
  constructor() {
    this.allowBtn = document.getElementById('allowBtn');
    this.blockBtn = document.getElementById('blockBtn');
    this.trafficBlockStatusIndicator = document.getElementById('trafficBlockStatusIndicator');
    this.domainName = document.getElementById("domainName")
    this.blockModeOn = document.getElementById('blockModeOn');
    this.blockModeOff = document.getElementById('blockModeOff');
    this.queryOptions = { active: true, currentWindow: true };
  }

  init() {
    this.allowBtn.addEventListener('click', this.allowPage.bind(this));
    this.blockBtn.addEventListener('click', this.blockPage.bind(this));
    this.blockModeOff.addEventListener('click', this.toggleBlockMode.bind(this));
    this.blockModeOn.addEventListener('click', this.toggleBlockMode.bind(this));
    this.checkDomain();
  }

  toggleBlockMode() {
    chrome.tabs.query(this.queryOptions, tabs => {
      const isOn = localStorage.getItem("Mode") != "On"
      this.blockModeOn.style.display = isOn ? 'none' : 'inline';
      this.blockModeOff.style.display = isOn ? 'inline' : 'none';
      if(isOn)
        localStorage.setItem("Mode", "On");
      else
        localStorage.setItem("Mode", "Off");
      chrome.tabs.sendMessage(
        tabs[0].id,
        { task: 'blockMode',
          mode: isOn ? 'on' : 'off' },
        function (response) {
          console.log(response.status);
        }
      );
    });
  }



  allowPage() {

    chrome.tabs.query(this.queryOptions, tabs => {
      let parsedUrl = this.getParsedUrl(tabs[0].url);
      let domain = this.getDomain(parsedUrl);
      localStorage.setItem(domain, "WhiteList");
      this.updateUi(domain, true);
      chrome.tabs.sendMessage(
        tabs[0].id,
        { task: 'allowThisPage' },
        function (response) {
          console.log(response.status);
        }
      );
    });
  }

  blockPage() {
    chrome.tabs.query(this.queryOptions, tabs => {
      let parsedUrl = this.getParsedUrl(tabs[0].url);
      let domain = this.getDomain(parsedUrl);
      localStorage.removeItem(domain);
      this.updateUi(domain, false);
      chrome.tabs.sendMessage(
        tabs[0].id,
        { task: 'blockThisPage' },
        function (response) {
          console.log(response.status);
        }
      );
    });
  }

  checkDomain() {
    chrome.tabs.query(this.queryOptions, tabs => {
      let parsedUrl = this.getParsedUrl(tabs[0].url);
      let domain = this.getDomain(parsedUrl);
      if (localStorage.getItem(domain) === "WhiteList") {
        this.updateUi(domain, true);
      }
      else this.updateUi(domain, false)
      const isOn = localStorage.getItem("Mode") != "On"
      this.blockModeOff.style.display = isOn ? 'none' : 'inline';
      this.blockModeOn.style.display = isOn ? 'inline' : 'none';

    });
  }

  updateUi(domain, blocked) {
    this.trafficBlockStatusIndicator.innerHTML = blocked ? "Трафик разрешен" : "Трафик блокируется";
    this.allowBtn.style.display = blocked ? 'none' : 'inline';
    this.blockBtn.style.display = blocked ? 'inline' : 'none';
    this.domainName.innerHTML = domain
  }

  getParsedUrl(url) {
    return url.replace("https://", "").replace("http://", "").replace("www.", "");
  }

  getDomain(parsedUrl) {
    return parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
      .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));
  }
}

const popup = new Popup();
popup.init();
