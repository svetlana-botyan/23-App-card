class Dnd {
  shifts = {
    x: 0,
    y: 0,
  };

  position = {
    top: "auto",
    left: "auto",
  };


  constructor(element) {
    this.element = element;

    this.init()
  }

  init() {
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);

    this.element.addEventListener("mousedown", this.handleMousedown);
  }

  handleMousedown({ clientX, clientY }) {
    this.element.style.zIndex = 100

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
    this.element.style.zIndex = 'auto'

    this.setPosition(clientX, clientY)

    const id = this.element.id
    const newPosition = this.position

    const event = new CustomEvent('card:position', {
      detail: { id, newPosition }
    })
    window.dispatchEvent(event)
  }

  calcShifts(x, y) {
    const { left, top } = this.element.getBoundingClientRect();

    this.shifts.x = x - left;
    this.shifts.y = y - top;
  }

  setPosition(left, top) {
    //console.log(this.element);
    this.position.left = left - this.shifts.x;
    this.position.top = top - this.shifts.y;

    this.element.style.left = this.position.left + "px";
    this.element.style.top = this.position.top + "px";
  }
}

export { Dnd };
