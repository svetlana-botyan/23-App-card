import { nanoid } from "nanoid";
// import { Modal } from 'bootstrap'

class Card {
  constructor(newCardElement, colorsElement, containerElement) {
    this.newCardElement = newCardElement;
    this.colorsElement = colorsElement;
    this.containerElement = containerElement;

    this.init();
  }

  init() {
    this.render();

    // this.instanceModal = Modal.getOrCreateInstance(this.modalElement)
    this.handleClickColorCard = this.handleClickColorCard.bind(this);
    this.handleClickButtonCreate = this.handleClickButtonCreate.bind(this);
    // this.handleFormSetEdit = this.handleFormSetEdit.bind(this)

    this.colorsElement.addEventListener("click", this.handleClickColorCard);
    this.newCardElement.addEventListener("click", this.handleClickButtonCreate);
    // window.addEventListener('form:setEdit', this.handleFormSetEdit)
  }

  handleClickButtonCreate() {
    this.toggle(this.colorsElement);
  }

  toggle(el) {
    el.style.display = el.style.display === "block" ? "none" : "block";
  }

  async handleClickColorCard({ target }) {
    this.toggle(this.colorsElement);

    const card = {
      content: "Hello",
      position: {
        top: 0,
        left: 0,
      },
    };

    if (target.dataset.color === "yellow") {
      card.color = "#f8eb5c";
    } else if (target.dataset.color === "green") {
      card.color = "#b6ef94";
    } else if (target.dataset.color === "pink") {
      card.color = "#ffb9f7";
    } else if (target.dataset.color === "blue") {
      card.color = "#99e5ff";
    } else if (target.dataset.color === "gray") {
      card.color = "#e3e3e3";
    } else if (target.dataset.color === "orange") {
      card.color = "#f65b00";
    }

    if (!card.id) card.id = nanoid();

    await this.sendCard(card, "POST");
  }

  // отправка на сервер
  async sendCard(data, selectedMethod) {
    const dataJson = JSON.stringify(data);
    const method = selectedMethod;

    let url = "/api/posts";

    if (method === "PUT") {
      url += `/${data.id}`;
    }

    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: dataJson,
    };

    await fetch(url, opts);

    this.render();
  }

  async getCards() {
    const responce = await fetch("/api/posts");
    const data = await responce.json();

    return data.list;
  }

  async render() {
    const cards = await this.getCards();

    const cardsHTML = this.createCards(cards);
  }

  getTemplateCard({ id, content }) {
    return `
    <div class="menu d-flex justify-content-end">
    <button type="button" class="btn btn-success my-0" data-toggle="tooltip" data-id = "${id}" data-role ="edit" data-placement="top" title="Edit">
      <svg class="pe-none align-center" width="20" height="20" >
        <use  href="#edit-pencil" />
      </svg>
    </button>
    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" data-id = "${id}" data-role ="Delete" title="Delete">
      <svg class="pe-none align-center" width="20" height="20" >
        <use href="#trash" />
      </svg>
    </button>
  </div>
  <div class="content">
  ${content}
  </div>
    `;
  }

  createCards(cards) {
    cards.map((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.id = `${card.id}`;
      cardElement.style.backgroundColor = `${card.color}`;
      cardElement.style.top = `${card.position.top}`;
      cardElement.style.left = `${card.position.left}`;

      cardElement.innerHTML = this.getTemplateCard(card);

      return this.containerElement.append(cardElement);
    });
  }
}

export { Card };
