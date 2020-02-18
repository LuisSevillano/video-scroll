export default class {
  constructor(options) {
    this.name = "VideoScroll";
    this.top_offset = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scroll_trigger = this.height;
    this.vid = document.getElementById("g-vid");
    this.endTime = 0;
    this.options = options;
    this.stepSelector = ".scroll-step";
    this.steps;
    if (this.setOptions) this.setOptions(options);
    else this.options = options || {};
    console.log(this);
  }

  setStepsHeight() {
    document.querySelectorAll(this.stepSelector).forEach(el => {
      el.style.marginBottom = `${window.innerHeight - this.top_offset}px`;
    }, this);
  }

  init() {
    this.steps = {
      first_step_div: document.querySelector(".scroll-steps .g-first"),
      last_step_div: document.querySelector(".scroll-steps .g-last"),
      all: document.querySelectorAll(".scroll-steps")
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

    this.setStepsHeight();
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

  loadVideo(sz) {
    let vid_class;
    let vid_att = "";

    if (sz == "mobile") {
      vid_class = "g-vid-mobile";
      vid_att = "_mobile";
    } else if (sz == "med") {
      // vid_class = "g-vid-med";
      vid_class = "g-vid-mobile";
      vid_att = "_mobile";
      // d3.select("#g-fade").style("display","block").style("bottom",`${$("#g-vid").height()}px`)
    } else if (sz == "desktop") {
      vid_class = "g-vid-desktop";
    }

    document.querySelector("#g-vid").classList.add(vid_class);
    const src_mp4 = document.createElement("source");
    const src_webm = document.createElement("source");
    const gVid = document.querySelector("#g-vid");
    src_mp4.setAttribute("src", gVid.getAttribute(`data-mp4${vid_att}`));
    src_webm.setAttribute("src", gVid.getAttribute(`data-webm${vid_att}`));
    this.vid.appendChild(src_mp4);
    this.vid.appendChild(src_webm);
    this.vid.load();
  }

  update(step_num, start_time, end_time, is_reverse) {
    if (step_num !== 0 && !step_num) {
      // $(".g-step")
      //   .removeClass("g-next")
      //   .removeClass("g-prev")
      //   .removeClass("g-active");
      if (is_reverse) {
        vid.currentTime = 0;
        vid.pause();
        // d3.select("#g-spacer")
        //   .transition()
        //   .duration(250)
        //   .style("opacity", 1);
      } else {
        // d3.select("#g-fixed")
        //   .transition()
        //   .duration(500)
        //   .style("opacity", 0);
      }
    } else {
      if (step_num == 0) {
        // d3.select("#g-spacer")
        //   .transition()
        //   .duration(250)
        //   .style("opacity", 0);
      }
      // d3.select("#g-fixed")
      //   .transition()
      //   .duration(250)
      //   .style("opacity", 1);
      this.endTime = end_time;
      this.vid.currentTime = start_time;
      this.vid.play();
    }
  }

  playStep(el, is_reverse) {
    const step_num = el.dataset["step"];
    const start_time = el.dataset["start"];
    const end_time = el.dataset["end"];
    this.update(step_num, start_time, end_time, is_reverse);
    this.updatePrevNext(el);
  }

  addClass(el, className) {
    el.classList.add(className);
  }

  removeClass(el, className) {
    el.classList.remove(className);
  }

  removeClassMany(elements, className) {
    elements.forEach((el, i) => {
      this.removeClass(el, className);
    });
  }

  updatePrevNext(el) {
    console.log("updatePrevNext", el);
    this.addClass(el, "g-active");
    this.removeClass(el, "g-next");
    this.removeClass(el, "g-prev");
    this.removeClassMany(this.steps.all, "g-active");

    this.addClass(el.nextSibling, "g-next");
    this.removeClass(el.nextSibling, "g-active");
    this.removeClass(el.nextSibling, "g-prev");
    this.removeClassMany(this.steps.all, "g-next");

    this.addClass(el.previousElementSibling, "g-next");
    this.removeClass(el.previousElementSibling, "g-active");
    this.removeClass(el.previousElementSibling, "g-prev");
    this.removeClassMany(this.steps.all, "g-next");
  }

  onScroll(ypos) {
    const top_of_first_step_div =
      +this.getOffset(this.steps.first_step_div).top - ypos;
    const nextEl = document.querySelector(".g-next");
    const prevEl = document.querySelector(".g-prev");

    const bottom_of_last_step_div =
      +this.getOffset(this.steps.last_step_div).top -
      ypos +
      this.getHeight(this.steps.last_step_div);

    if (
      top_of_first_step_div <= this.scroll_trigger &&
      top_of_first_step_div >= this.top_offset &&
      !nextEl
    ) {
      this.addClass(this.steps.first_step_div, "g-next");
    } else if (
      bottom_of_last_step_div >= this.top_offset &&
      bottom_of_last_step_div <= this.scroll_trigger &&
      !prevEl
    ) {
      this.addClass(this.steps.last_step_div, "g-prev");
    }

    let top_of_next = null;
    if (nextEl) {
      top_of_next = +this.getOffset(nextEl).top - ypos;
    }

    let bottom_of_prev = null;
    if (prevEl) {
      bottom_of_prev =
        +this.getOffset(prevEl).top - ypos + this.getHeight(prevEl);
    }

    if (top_of_next && top_of_next <= this.scroll_trigger) {
      // console.log("next has hit bottom");
      this.playStep(nextEl, false);
    }

    if (bottom_of_prev && bottom_of_prev >= top_offset) {
      // console.log("prev has hit top");
      this.playStep(prevEl, true);
    }
  }

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
