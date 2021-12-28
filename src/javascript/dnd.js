class Dnd {
  constructor(elements, containerElement) {
    this.elements = [...elements];
    this.containerElement = containerElement;
    //console.log(this.elements)

    this.init();
  }

  init() {
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);

    this.containerElement.addEventListener("mousedown", this.handleMousedown);
}

  handleMousedown(event) {
    const { id } = event.target;
    const { clientX, clientY } = event;

    this.elements.forEach((element) => {
      if (element.id === id) {
        document.addEventListener("mousemove", this.handleMousemove);
        document.addEventListener("mouseup", this.handleMouseup);
        
        this.calcShifts(clientX, clientY, element);
        this.setPosition(clientX, clientY);
      }
    });
  }

  handleMousemove({ clientX, clientY }) {
    console.log({ clientX, clientY });

    this.setPosition(clientX, clientY);
  }

  handleMouseup({ clientX, clientY }) {
    document.removeEventListener("mousemove", this.handleMousemove);
    document.removeEventListener("mouseup", this.handleMouseup);
    //console.log(clientX, clientY);
    this.setPosition(clientX, clientY);

    //TODO: Custom event dnd:end
  }

  calcShifts(x, y, element) {
    const { left, top } = element.getBoundingClientRect();
    //console.log( left, top )
    position = {
      top: left,
      left: top
    }
  
    shifts = {
      x: 0,
      y: 0
    }
    
    shifts.x = x - left;
    shifts.y = y - top;
  }

  setPosition(left, top) {
    this.position.left = left - this.shifts.x;
    this.position.top = top - this.shifts.y;

    this.element.style.left = this.position.left + "px";
    this.element.style.top = this.position.top + "px";
  }
}

export { Dnd };
