document.addEventListener('click', function(e) {
  let classOfTarget = e.target.className.split(" ").join(",.")
  let target = document.querySelector("." + classOfTarget)
  target.remove();
 }, false);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender, sendResponse);

  if (request.task === 'allowThisPage') {
    localStorage.setItem("White", "1") 
  }
  if (request.task === 'blockThisPage') {
    localStorage.setItem("White", "0") 
  }
  if (request.task === 'Delete this')
  {
   
  }

  const response = { status: 'done' };
  sendResponse(response);
})

async function getBlockTags() {
  const url = chrome.runtime.getURL("Input.txt")
  const response = await fetch(url)
  const data = await (await response.text()).split("\n").join(",")

  return data
}

  async function blockByDefault()
  {
    const filter = await getBlockTags();
    let spans = document.querySelectorAll(filter);
    if (spans != null && localStorage.getItem("White") === "0") 
    {
      spans.forEach(function (x){
        x.remove()
      })
    }
    
  } 

const clear = (() => {
  const defined = v => v !== null && v !== undefined;
  const timeout = setInterval(() => {
      const ad = [...document.querySelectorAll('.ad-showing')][0];
      if (defined(ad)) {
          const video = document.querySelector('video');
          if (defined(video)) {
              video.currentTime = video.duration;
              alert("chleny")
          }
      }
  }, 500);
  return function() {
      clearTimeout(timeout);
    }
})();

  setInterval(function () {
    blockByDefault();
}, 1000)

