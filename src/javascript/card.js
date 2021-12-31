import { nanoid } from 'nanoid'
import { Dnd } from './dnd'
// import { Modal } from 'bootstrap'

class Card {
  constructor (newCardElement, colorsElement, containerElement) {
    this.newCardElement = newCardElement
    this.colorsElement = colorsElement
    this.containerElement = containerElement

    this.init()
  }

  init () {
    this.renderCards()

    // this.instanceModal = Modal.getOrCreateInstance(this.modalElement)
    this.handleClickColorCard = this.handleClickColorCard.bind(this)
    this.handleClickButtonCreate = this.handleClickButtonCreate.bind(this)
    this.handleNewPosition = this.handleNewPosition.bind(this)
    // this.handleFormSetEdit = this.handleFormSetEdit.bind(this)

    this.colorsElement.addEventListener('click', this.handleClickColorCard)
    this.newCardElement.addEventListener('click', this.handleClickButtonCreate)
    window.addEventListener('card:position', this.handleNewPosition)
    // window.addEventListener('form:setEdit', this.handleFormSetEdit)
  }

  handleClickButtonCreate () {
    this.toggle(this.colorsElement)
  }

  toggle (el) {
    el.style.display = el.style.display === 'block' ? 'none' : 'block'
  }

  async handleClickColorCard ({ target }) {
    this.toggle(this.colorsElement)

    const card = {}

    if (target.dataset.color === 'yellow') {
      card.color = '#f8eb5c'
    } else if (target.dataset.color === 'green') {
      card.color = '#b6ef94'
    } else if (target.dataset.color === 'pink') {
      card.color = '#ffb9f7'
    } else if (target.dataset.color === 'blue') {
      card.color = '#99e5ff'
    } else if (target.dataset.color === 'gray') {
      card.color = '#e3e3e3'
    } else if (target.dataset.color === 'orange') {
      card.color = '#f2a932'
    }

    if (!card.id) card.id = nanoid()
    if (!card.content) card.content = 'Hello'
    if (!card.position) {
      card.position = {
        top: 0,
        left: 0
      }
    }

    await this.sendCard(card, 'POST')
    this.renderCard(card)
  }

  // отправка на сервер
  async sendCard (data, selectedMethod) {
    const dataJson = JSON.stringify(data)
    const method = selectedMethod

    let url = '/api/posts'

    if (method === 'PUT') {
      url += `/${data.id}`
    }

    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: dataJson
    }

    await fetch(url, opts)
  }

  async getCards () {
    const responce = await fetch('/api/posts')
    const data = await responce.json()

    return data.list
  }

  renderCard (card) {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.id = `${card.id}`
    cardElement.style.backgroundColor = `${card.color}`
    cardElement.style.top = `${card.position.top}px`
    cardElement.style.left = `${card.position.left}px`

    cardElement.innerHTML = this.getTemplateCard(card)

    new Dnd(cardElement)

    return this.containerElement.append(cardElement)
  }

  async renderCards () {
    const cards = await this.getCards()
    this.createCards(cards)
  }

  createCards (cards) {
    cards.map((card) => this.renderCard(card))
  }

  getTemplateCard ({ id, content }) {
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
    `
  }

  // новая позиция
  async handleNewPosition ({ detail }) {
    const { id } = detail
    const { newPosition } = detail

    const data = await this.getCard(id)
    data.position = newPosition

    await this.sendCard(data, 'PUT')
  }

  async getCard (id) {
    const url = `/api/posts/${id}` // от backend

    const responce = await fetch(url)
    const card = await responce.json()

    return card
  }
}

export { Card }
