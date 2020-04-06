// Draw dots on the right side of the page
export default class {
  constructor(options) {
    this.parent = document.querySelector("#g-scroll-vid");
    this.steps = this.parent.querySelectorAll(".scroll-indicator");
    this.el = this.parent.querySelector("#scroll-indicator-container");
    this.animDuration = 750;
    this.scrollOffset = -30;
    this.setOptions(options);
  }

  setOptions(opts) {
    Object.keys(opts).forEach(opt => {
      this[opt] = opts[opt];
    }, this);
  }

  init() {
    if (!this.el) {
      const el = document.createElement("div");
      el.setAttribute("id", "scroll-indicator-container");
      this.parent.append(el);
      this.el = el;
    }
    // active first element
    // this.parent.querySelector(".scroll-indicator-dot").classList.add("active");
    this.dots = this.createDotsElements();
    this.bindEvents();
  }

  createDotsElements() {
    this.steps.forEach(step => {
      const dot = document.createElement("div");
      dot.setAttribute("data-step", step.dataset.step);
      dot.classList.add("scroll-indicator-dot");
      this.el.append(dot);
    });
    return this.el.querySelectorAll(".scroll-indicator-dot");
  }

  update(activeEl) {
    if (activeEl) {
      this.removeClasses(this.dots, "active");
      this.el.querySelectorAll(".scroll-indicator-dot").forEach(dot => {
        if (dot.dataset.step === activeEl.dataset.step) {
          dot.classList.add("active");
        }
      }, this);
    }
  }

  removeClasses(elements, className) {
    elements.forEach((el, i) => {
      el.classList.remove(className);
    }, this);
  }

  getStep(nStep) {
    return Array.from(this.steps).filter(step => {
      return step.dataset.step == nStep;
    })[0];
  }

  bindEvents() {
    this.scrollEvents();
  }

  easeInCubic(t) {
    return t * t * t;
  }

  scrollToElem(
    startTime,
    currentTime,
    duration,
    scrollEndElemTop,
    startScrollOffset
  ) {
    const runtime = currentTime - startTime;
    let progress = runtime / duration;

    progress = Math.min(progress, 1);

    const ease = this.easeInCubic(progress);

    window.scroll(0, startScrollOffset + scrollEndElemTop * ease);
    if (runtime < duration) {
      requestAnimationFrame(timestamp => {
        const currentTime = timestamp || new Date().getTime();
        this.scrollToElem(
          startTime,
          currentTime,
          duration,
          scrollEndElemTop,
          startScrollOffset
        );
      });
    }
  }

  scrollEvents(e) {
    const scrollElems = document.querySelectorAll(".scroll-indicator-dot");
    // Now add an event listeners to those element
    for (let i = 0; i < scrollElems.length; i++) {
      const elem = scrollElems[i];

      elem.addEventListener("click", e => {
        e.preventDefault();

        // 0 get the nº step
        const index = e.target.dataset.step;

        // 2. Get the element id to which you want to scroll

        const scrollEndElem = Array.from(this.steps).filter(step => {
          return step.dataset.step === index;
        })[0];

        // 3. and well animate to that node..
        const anim = requestAnimationFrame(timestamp => {
          const stamp = timestamp || new Date().getTime();
          const duration = this.animDuration;
          const start = stamp;
          const startScrollOffset = window.pageYOffset + this.scrollOffset;
          const scrollEndElemTop = scrollEndElem.getBoundingClientRect().top;

          this.scrollToElem(
            start,
            stamp,
            duration,
            scrollEndElemTop,
            startScrollOffset
          );
        });
      });
    }
  }
}
