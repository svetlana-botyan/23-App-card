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
        const shifts = {
          x: 0,
          y: 0,
        };

        const position = {
          top: "auto",
          left: "auto",
        };

        document.addEventListener("mousemove", this.handleMousemove(event, element, position, shifts));
        document.addEventListener("mouseup", this.handleMouseup(event, element, position, shifts));

        this.calcShifts(clientX, clientY, element, shifts);
        this.setPosition(clientX, clientY, element, position, shifts);
      }
    });
  }

  handleMousemove({ clientX, clientY },element, position, shifts) {
    console.log({ clientX, clientY });

    this.setPosition(clientX, clientY,element, position, shifts);
  }

  handleMouseup({ clientX, clientY },element, position, shifts) {
    document.removeEventListener("mousemove", this.handleMousemove);
    document.removeEventListener("mouseup", this.handleMouseup);
    //console.log(clientX, clientY);
    this.setPosition(clientX, clientY,element, position, shifts);

    //TODO: Custom event dnd:end
  }

  calcShifts(x, y, element, shifts) {
    const { left, top } = element.getBoundingClientRect();

    shifts.x = x - left;
    shifts.y = y - top;
  }

  setPosition(left, top, element, position, shifts) {
    position.left = left - shifts.x;
    position.top = top - shifts.y;

    element.style.left = position.left + "px";
    element.style.top = position.top + "px";
  }
}

export { Dnd };
