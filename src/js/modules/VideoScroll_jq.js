import ScrollIndicator from "./scroll-indicator";
export default class {
  constructor(options) {
    this.name = "VideoScroll";
    this.el = document.querySelector("#g-scroll-vid");
    this.vid = this.el.querySelector("#g-vid");
    this.top_offset = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scroll_trigger = this.height;
    this.endTime = 0;
    this.options = options;
    this.stepSelector = ".scroll-step";
    this.steps;
    if (this.setOptions) this.setOptions(options);
    else this.options = options || {};
    console.log(this);
  }

  init() {
    this.steps = {
      first_step_div: $(".scroll-steps .g-first"),
      last_step_div: $(".scroll-steps .g-last"),
      all: $(".scroll-step")
    };

    if (this.width > this.height) {
      if (this.height / this.width >= 0.65) {
        // portrait / mobile
        this.loadVideo("med");
      } else {
        // landscape / desktop
        this.loadVideo("desktop");
      }
    } else {
      // portrait / mobile
      this.loadVideo("mobile");
    }

    this.vid.ontimeupdate = () => {
      this.timeUpdate();
    };

    this.scrollIndicator = new ScrollIndicator({});
    this.scrollIndicator.init();

    this.setStepsHeight();
    this.setActiveElement();
    this.bindEvents();

    // find if the page is scrolled when it is loaded
    if (this.isStarted()) {
      this.playStep($(".g-active"), false);
    }
  }

  bindEvents() {
    window.addEventListener(
      "scroll",
      function(e) {
        const wScrollTop =
          (document.documentElement && document.documentElement.scrollTop) ||
          document.body.scrollTop;
        this.onScroll(wScrollTop);
      }.bind(this),
      false
    );

    window.addEventListener(
      "resize",
      function() {
        this.updateSizes();
      }.bind(this),
      false
    );
  }

  updateSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scroll_trigger = this.height;
    if (this.width > this.height) {
      if (this.height / this.width >= 0.65) {
        // portrait / mobile
        console.log("med");
      } else {
        // landscape / desktop
        console.log("desktop");
      }
    } else {
      // portrait / mobile
      console.log("mobile");
    }
  }

  setStepsHeight() {
    this.el.querySelectorAll(this.stepSelector).forEach(el => {
      el.style.marginBottom = `${window.innerHeight - this.top_offset}px`;
    }, this);
  }

  timeUpdate() {
    // console.log(`${vid.currentTime} / ${endTime}`)
    if (this.vid.currentTime >= this.endTime) {
      // console.log("pausing");
      this.vid.pause();
    }
  }

  ontimeupdate() {
    this.timeUpdate();
  }

  loadVideo(size) {
    let vid_class;
    let vid_att = "";
    if (size == "mobile") {
      vid_class = "g-vid-mobile";
      vid_att = "_mobile";
    } else if (size == "med") {
      // vid_class = "g-vid-med";
      vid_class = "g-vid-med";
      // vid_att = "_mobile";
      // vid_att = "_med";
      // d3.select("#g-fade").style("display","block").style("bottom",`${$("#g-vid").height()}px`)
    } else if (size == "desktop") {
      vid_class = "g-vid-desktop";
    }

    this.el.querySelector("#g-vid").classList.add(vid_class);
    const src_mp4 = document.createElement("source");
    const src_webm = document.createElement("source");
    const gVid = this.el.querySelector("#g-vid");
    src_mp4.setAttribute("src", gVid.getAttribute(`data-mp4${vid_att}`));
    src_webm.setAttribute("src", gVid.getAttribute(`data-webm${vid_att}`));
    this.vid.appendChild(src_mp4);
    this.vid.appendChild(src_webm);
    this.vid.load();
  }

  update(step_num, start_time, end_time, is_reverse) {
    if (step_num !== 0 && !step_num) {
      $(".scroll-steps")
        .removeClass("g-next")
        .removeClass("g-prev")
        .removeClass("g-active");
      if (is_reverse) {
        this.vid.currentTime = 0;
        this.vid.pause();
        d3.select("#g-heading")
          .transition()
          .duration(250)
          .style("opacity", 1);
      } else {
        d3.select("#g-fixed")
          .transition()
          .duration(500)
          .style("opacity", 0);
      }
    } else {
      if (step_num == 0) {
        d3.select("#g-heading")
          .transition()
          .duration(250)
          .style("opacity", 0);
      }
      d3.select("#g-fixed")
        .transition()
        .duration(250)
        .style("opacity", 1);
      this.endTime = end_time;
      this.vid.currentTime = start_time;
      this.vid.play();
    }
  }
  resetVideo() {
    $(".scroll-steps")
      .removeClass("g-next")
      .removeClass("g-prev")
      .removeClass("g-active");

    $(".g-first").addClass("g-next");

    d3.select("#g-heading")
      .transition()
      .duration(250)
      .style("opacity", 1);

    this.vid.currentTime = 0;
    this.vid.pause();
  }
  playStep(el, is_reverse) {
    const step_num = el.data("step");
    const start_time = el.data("start");
    const end_time = el.data("end");
    this.update(step_num, start_time, end_time, is_reverse);
    console.log({ step_num, start_time, end_time, is_reverse });
    this.updatePrevNext(el);
  }

  addClass(el, className) {
    // console.log("addClass");
    el.classList.add(className);
  }

  removeClass(el, className) {
    // console.log("removeClass");
    el.classList.remove(className);
  }

  removeClassMany(elements, className) {
    if (Array.isArray(className)) {
      elements.forEach((el, i) => {
        className.forEach(cName => {
          this.removeClass(el, cName);
        }, this);
      }, this);
    } else {
      elements.forEach((el, i) => {
        this.removeClass(el, className);
      }, this);
    }
    // console.log("removeClassMany");
  }

  updatePrevNext(el) {
    el.addClass("g-active")
      .removeClass("g-next")
      .removeClass("g-prev")
      .siblings()
      .removeClass("g-active");
    el.next()
      .addClass("g-next")
      .removeClass("g-active")
      .removeClass("g-prev")
      .siblings()
      .removeClass("g-next");
    el.prev()
      .addClass("g-prev")
      .removeClass("g-active")
      .removeClass("g-next")
      .siblings()
      .removeClass("g-prev");
  }

  onScroll(ypos) {
    console.log("onScroll", ypos);
    const top_of_first_step_div =
      +this.steps.first_step_div.offset().top - ypos;
    const nextEl = $(".g-next").length;
    const prevEl = $(".g-prev").length;

    const bottom_of_last_step_div =
      +this.steps.last_step_div.offset().top -
      ypos +
      this.steps.last_step_div.height();

    if (
      top_of_first_step_div <= this.scroll_trigger &&
      top_of_first_step_div >= this.top_offset &&
      !nextEl
    ) {
      this.steps.first_step_div.addClass("g-next");
    } else if (
      bottom_of_last_step_div >= this.top_offset &&
      bottom_of_last_step_div <= this.scroll_trigger &&
      !prevEl
    ) {
      this.steps.last_step_div.addClass("g-prev");
    }

    let top_of_next = null;
    if ($(".g-next").length) {
      top_of_next = +$(".g-next").offset().top - ypos;
    }

    let bottom_of_prev = null;
    if (prevEl) {
      bottom_of_prev =
        +$(".g-prev").offset().top - ypos + $(".g-prev").height();
    }

    if (top_of_next && top_of_next <= this.scroll_trigger) {
      console.log("firstIf");
      // console.log("next has hit bottom");
      this.playStep($(".g-next"), false);
    }

    if (bottom_of_prev && bottom_of_prev >= this.top_offset) {
      console.log("secondIf");
      // console.log("prev has hit top");
      this.playStep($(".g-prev"), true);
    }
    if (ypos === 0) {
      this.resetVideo();
    }
    this.scrollIndicator.update(this.getActiveElement());
  }

  isStarted() {
    const px =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    return px !== 0;
  }

  getActiveElement() {
    let activeEl;
    this.steps.all.each((i, el) => {
      if (this.inViewport(el)) {
        activeEl = el;
      }
    }, this);
    return activeEl;
  }

  setActiveElement() {
    this.steps.all.each((i, el) => {
      if (this.inViewport(el)) {
        this.addClass(el, "g-active");
      } else {
        this.removeClass(el, "g-active");
      }
    }, this);
  }

  inViewport(el) {
    const bb = el.getBoundingClientRect();
    const wW = window.innerWidth || document.documentElement.clientWidth;
    const wH = window.innerHeight || document.documentElement.clientHeight;
    return bb.top >= 0 && bb.left >= 0 && bb.right <= wW && bb.bottom <= wH;
  }

  // extract from http://youmightnotneedjquery.com/
  getOffset(el) {
    const box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }

  getHeight(el) {
    const styles = window.getComputedStyle(el);
    const height = el.offsetHeight;
    const borderTopWidth = parseFloat(styles.borderTopWidth);
    const borderBottomWidth = parseFloat(styles.borderBottomWidth);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingBottom = parseFloat(styles.paddingBottom);
    return (
      height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom
    );
  }
}
