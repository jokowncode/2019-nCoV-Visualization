var timeline;
var elH;
var arrows;
var arrowPrev;
var darrowPrev;
var arrowNext;
var darrowNext;
var firstItem;
var lastItem;
var lastTwoItem;
var xScrolling = 300;
var disabledClass = "disabled";
function init() {
    // VARIABLES
    timeline = document.querySelector(".timeline ol");
    elH = document.querySelectorAll(".timeline li > div");
    arrows = document.querySelectorAll(".timeline .arrows .arrow");
    arrowPrev = document.querySelector(".timeline .arrows .arrow__prev");
    arrowNext = document.querySelector(".timeline .arrows .arrow__next");
    darrowPrev = document.querySelector(".timeline .arrows .darrow__prev");
    darrowNext = document.querySelector(".timeline .arrows .darrow__next");
    firstItem = document.querySelector(".timeline li:first-child");
    lastItem = document.querySelector(".timeline li:last-child");
    lastTwoItem = document.querySelector(".timeline li:nth-last-child(2)");
    
//    setEqualHeights(elH);
    animateTl(xScrolling, arrows, timeline);
    //setSwipeFn(timeline, arrowPrev, arrowNext);
    setKeyboardFn(arrowPrev, arrowNext);
}

// SET EQUAL HEIGHTS
//function setEqualHeights(el) {
//let counter = 0;
//for (let i = 0; i < el.length; i++) {
//  const singleHeight = el[i].offsetHeight;
//
//  if (counter < singleHeight) {
//    counter = singleHeight;
//  }
//}

//for (let i = 0; i < el.length; i++) {
//  el[i].style.height = `${counter}px`;
//}
//}

// CHECK IF AN ELEMENT IS IN VIEWPORT
// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(el) {
const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// SET STATE OF PREV/NEXT ARROWS
function setBtnState(el, flag = true) {
if (flag) {
  el.classList.add(disabledClass);
} else {
  if (el.classList.contains(disabledClass)) {
    el.classList.remove(disabledClass);
  }
  el.disabled = false;
}
}

function timeout(){
    setTimeout(() => {
      if(isElementInViewport(firstItem)){
          setBtnState(arrowPrev);
          setBtnState(darrowPrev)
      }else{
          setBtnState(arrowPrev, false);
          setBtnState(darrowPrev, false)
      }
      if(isElementInViewport(lastItem)){
          setBtnState(arrowNext);
          setBtnState(darrowNext)
      }else{
          setBtnState(arrowNext, false);
          setBtnState(darrowNext, false)
      } 
    }, 500);
}

// ANIMATE TIMELINE
function animateTl(scrolling, el, tl) {
let counter = 0;
for (let i = 0; i < el.length; i++) {
  el[i].onclick = function() {
    if (!arrowPrev.disabled) {
      arrowPrev.disabled = true;
    }
    if (!arrowNext.disabled) {
      arrowNext.disabled = true;
    }
    const sign = (this.classList.contains("arrow__prev")) ? "" : "-";
//    if (counter === 0) {
//       tl.style.transform = `translateX(-${scrolling}px)`;
//    } else {
      const tlStyle = getComputedStyle(tl);
      // add more browser prefixes if needed here
      const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
      
      let values = counter==0?parseInt(`${sign}${scrolling}`):parseInt(tlTransform.split(",")[4]) + parseInt(`${sign}${scrolling}`);
      if(i === 0){
         values = 0;
         counter = -1;
      }else if(i === 3){
         values = -lastTwoItem.offsetLeft+850;       
         counter = (-values) / scrolling;
      }
      tl.style.transform = `translateX(${values}px)`;
//    }
    timeout();
    counter++;
  };
}
}

//  // ADD SWIPE SUPPORT FOR TOUCH DEVICES
//  function setSwipeFn(tl, prev, next) {
//    const hammer = new Hammer(tl);
//    hammer.on("swipeleft", () => next.click());
//    hammer.on("swiperight", () => prev.click());
//  }

// ADD BASIC KEYBOARD FUNCTIONALITY
function setKeyboardFn(prev, next) {
document.addEventListener("keydown", (e) => {
  if ((e.which === 37) || (e.which === 39)) {
    const timelineOfTop = timeline.offsetTop;
    const y = window.pageYOffset;
    if (timelineOfTop !== y) {
      window.scrollTo(0, timelineOfTop);
    }
    if (e.which === 37) {
      prev.click();
    } else if (e.which === 39) {
      next.click();
    }
  }
});
}