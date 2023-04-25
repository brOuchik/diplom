class ContentScript {
  constructor() {
    this.blockTags = [];
  }

  init() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    this.blockBySelector()
    this.getBlockTags()
    setInterval(this.blockByDefault.bind(this), 1000);
  }

  removeTarget(e) {
    e.preventDefault()
    let classOfTarget = e.target.className.split(" ").join(",.");
    let target = document.querySelector("." + classOfTarget);
    target?.remove();
  }

  handleMessage(request, sender, sendResponse) {
    if (request.task === 'allowThisPage') {
      localStorage.setItem("WhiteList", "1") 
    }
    if (request.task === 'blockThisPage') {
      localStorage.setItem("WhiteList", "0") 
    }
    if (request.task === 'getBlockTags') {
      sendResponse({ tags: this.blockTags });
    }
    if (request.task === 'addBlockTag') {
      document.addEventListener('mouseover', function onMouseOver(event) {
        const el = event.target;
        const classOfTarget = el.className.split(" ").join(",.");
        const target = document.querySelector("." + classOfTarget);
        if (target) {
          target.remove();
        }
        document.removeEventListener('mouseover', onMouseOver);
      });
    }
    if (request.task === 'removeBlockTag') {
      let tagToRemove = request.tag;
      this.blockTags = this.blockTags.filter(tag => tag !== tagToRemove);
    }

    if (request.task === 'blockMode') {
      function onMouseOver(event) {
        const el = event.target;
        el.style.outline = '2px solid blue';
        document.addEventListener('mouseout', onMouseOut);
      }
    
      function onMouseOut(event) {
        const el = event.target;
        el.style.outline = '';
        document.removeEventListener('mouseout', onMouseOut);
      }
    
      if (request.mode === 'on') {
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('click', this.removeTarget.bind(this), false);
      } else if (request.mode === 'off' && onMouseOver) {
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('click', this.removeTarget.bind(this), false);
      }
    }
    const response = { status: 'done' };
    sendResponse(response);
  }

  async getBlockTags() {
    const url = chrome.runtime.getURL('Input.txt');
    const response = await fetch(url);
    const data = await response.text();
    this.blockTags = data.split('\n').join(',');
  }

  blockByDefault() {
    if (localStorage.getItem("WhiteList") === "1") {
      return;
    }
    let spans = document.querySelectorAll(this.blockTags);
    if (spans != null) {
      spans.forEach(function(x) {
        x.remove();
      })
    }
  }

  isAdElement(el) {
    const keywords = ["ad", "promo", "banner", "sponsored", "offer"];
    const classes = ["ad", "ads", "banner", "sponsored", "offer"];
    
    if (el.tagName === "IFRAME" || el.tagName === "SCRIPT") {
      return true;
    }
    
    const classList = Array.from(el.classList);
    for (let i = 0; i < classes.length; i++) {
      if (classList.includes(classes[i])) {
        return true;
      }
    }
    
    // const textContent = el.textContent.toLowerCase();
    // for (let i = 0; i < keywords.length; i++) {
    //   if (textContent.includes(keywords[i])) {
    //     return true;
    //   }
    // }
    
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute("role");
    const ariaLabel = el.getAttribute("aria-label");
    const ariaHidden = el.getAttribute("aria-hidden");

    if (tag === "iframe" || tag === "script" || tag === "embed" || tag === "object") {
      return true;
    }

    if (tag === "img" && ariaLabel && ariaLabel.toLowerCase().includes("реклам")) {
      return true;
    }

    if (role === "banner" || role === "complementary" || role === "contentinfo") {
      return true;
    }

    if (ariaHidden === "true" && (role === "presentation" || role === "none")) {
      return true;
    }

    if (tag === "img" && el.alt && el.alt.toLowerCase().includes("реклам")) {
      return true;
    }
    return false;
  }

  blockBySelector()
  {
    const elements = document.querySelectorAll("*");
    if (elements != null) {
      elements.forEach((e) => {
        if(this.isAdElement(e)) e.remove();
      })
    }
  }
}


const contentScript = new ContentScript();
contentScript.init();
