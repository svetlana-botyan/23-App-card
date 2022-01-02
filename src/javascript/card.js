import { nanoid } from 'nanoid'
import { Dnd } from './dnd'

class Card {
  constructor (newCardElement, colorsElement, containerElement) {
    this.newCardElement = newCardElement
    this.colorsElement = colorsElement
    this.containerElement = containerElement

    this.init()
  }

  init () {
    this.renderCards()

    this.handleClickColorCard = this.handleClickColorCard.bind(this)
    this.handleClickButtonCreate = this.handleClickButtonCreate.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleNewPosition = this.handleNewPosition.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)

    this.colorsElement.addEventListener('click', this.handleClickColorCard)
    this.newCardElement.addEventListener('click', this.handleClickButtonCreate)
    this.containerElement.addEventListener('click', this.handleClickDelete)
    window.addEventListener('card:position', this.handleNewPosition)
  }

  handleClickButtonCreate () {
    this.toggle(this.colorsElement)
  }

  toggle (el) {
    el.style.display = (el.style.display === 'block') ? 'none' : 'block'
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

    cardElement.addEventListener('dblclick', this.handleDblClick)
    cardElement.addEventListener('click', this.handleCancelClick)
    cardElement.addEventListener('click', this.handleEditClick)
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
     <button type="button" class="btn btn-outline-danger" data-toggle="tooltip" data-placement="top" data-id = "${id}" data-role ="delete" title="Delete">
       <svg class="pe-none align-center" width="20" height="20" >
        <use href="#trash" />
       </svg>
      </button>
     </div>
     <div class="stick_content">
        ${content}
      </div>
      <form class="stick_form">
      <textarea name="content">${content}</textarea>
      <div class="d-flex justify-content-end">
        <button data-role="cancel" class="btn btn-outline-success" type="button"><svg class="pe-none" width="20"
            height="20">
            <use href="#Xcircle" />
          </svg></button>
        <button data-role="saveEdit" class="btn  btn-outline-primary" type="button"><svg class="pe-none " width="20" height="20">
            <use href="#check" />
          </svg></button>
      </div>
    </form>
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
    const url = `/api/posts/${id}`

    const responce = await fetch(url)
    const card = await responce.json()

    return card
  }

  // delete card
  async handleClickDelete ({ target }) {
    if (target.dataset.role === 'delete') {
      const { id } = target.dataset

      const isRemove = confirm('Do you want to delete card?')

      if (!isRemove) return

      await this.removeCard(id)

      const cardRemoveElement = this.containerElement.querySelector(`#${id}`)
      cardRemoveElement.remove()
    }
  }

  async removeCard (id) {
    const url = `/api/posts/${id}`

    await fetch(url, { method: 'DELETE' })
  }

  handleDblClick ({ currentTarget }) {
    currentTarget.classList.add('stick_edit')
  }

  // cancel
  handleCancelClick (event) {
    const { target, currentTarget } = event

    if (target.dataset.role === 'cancel') {
      currentTarget.classList.remove('stick_edit')
    }
  }

  // edit
  async handleEditClick (event) {
    const { target, currentTarget } = event
    const { id } = currentTarget

    if (target.dataset.role === 'saveEdit') {
      const textareaElement = currentTarget.querySelector('textarea')

      const data = await this.getCard(id)
      data.content = textareaElement.value

      await this.sendCard(data, 'PUT')

      currentTarget.remove()
      this.renderCard(data)
    }
  }
}

export { Card }
