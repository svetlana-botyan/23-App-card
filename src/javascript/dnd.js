class Dnd {
  shifts = {
    x: 0,
    y: 0,
  };

  position = {
    top: "auto",
    left: "auto",
  };

  element = ''

  constructor(containerElement) {   
    this.containerElement = containerElement;

    this.init();
  }

  init() {
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);

    this.containerElement.addEventListener("mousedown", this.handleMousedown);
  }

  handleMousedown(event) {
     this.element = event.target
    console.log(this.element);

    document.addEventListener("mousemove", this.handleMousemove);
    document.addEventListener("mouseup", this.handleMouseup);

    this.calcShifts(clientX, clientY);
    this.setPosition(clientX, clientY);

  }

  handleMousemove(event) {
    const { clientX, clientY } = event;     

    this.setPosition(clientX, clientY);
  }

  handleMouseup({ clientX, clientY }) {
    document.removeEventListener("mousemove", this.handleMousemove);
    document.removeEventListener("mouseup", this.handleMouseup);
    
    //console.log(clientX, clientY);
    this.setPosition(clientX, clientY);

    //TODO: Custom event dnd:end
  }

  calcShifts(x, y) {
    const { left, top } = this.element.getBoundingClientRect();

    this.shifts.x = x - left;
    this.shifts.y = y - top;
  }

  setPosition(left, top) {
    console.log(this.element);
    this.position.left = left - this.shifts.x;
    this.position.top = top - this.shifts.y;

    this.element.style.left = this.position.left + "px";
    this.element.style.top = this.position.top + "px";
  }
}

export { Dnd };
