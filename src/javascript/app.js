/* eslint-disable no-unused-vars */
import '../scss/app.scss'
import bootstrap from 'bootstrap'

// import { Modal } from 'bootstrap' //для модального окна

import { Card } from './card'

const newCardElement = document.querySelector('#newCard')
const colorsElement = document.querySelector('.colors')
const containerCardsElement = document.querySelector('.container-cards')

const newCard = new Card(newCardElement, colorsElement, containerCardsElement)
