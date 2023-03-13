const socket = io();
//prettier-ignore
import { flipSound, pairHit, errorTone, pairMissTone, startGameTone } from './client-modules/audio.js';
//prettier-ignore
import {  startTimer, addPlus,  addMinus, shuffle, resetHelperObject, toggleHideShow, addHiddenClass } from './client-modules/model.js';

import { closeModal } from './client-modules/modal.js';

const cardFields = document.querySelectorAll('.gamefields');
export const cardsContainer = document.querySelector('.cards-container');
export const timeDisplay = document.querySelector('.time-display');
const button = document.querySelector('.btn');
export const hits = document.querySelector('.stats-current-hits-info');
export const misses = document.querySelector('.stats-current-misses-info');
export const modalBackground = document.querySelector('.modal-background');
export const modalWindow = document.querySelector('.modal-window');
const buttonModal = document.querySelector('.close-window');
const statsContainer = document.querySelector('.stats-container');
const enterUsernameButton = document.querySelector('fa-right-to-bracket');
//prettier-ignore
export const memoryCardsEasy = ['pattern', 'pattern', 'shutter', 'shutter', 'compass', 'compass', 'social', 'social', 'target', 'target', 'envelope', 'envelope',  'camera', 'camera', 'barcode', 'barcode']
// helperObject stores temporary information for comparing guesses
export const helperObject = {
  counterPos: 0,
  counterNeg: 0,
  guesses: [],
  id: [],
};

window.addEventListener('load', function () {
  // Disable click event on memory cards before start button is pressed
  cardsContainer.style.pointerEvents = 'none';
});

// First listener on cardsContainer. Checks if e.target is correct and pushes two attributes to helperObject
cardsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('gamefields')) return;
  flipSound();
  e.target.classList.toggle('hidden');
  helperObject.guesses.push(e.target.style.backgroundImage);
  helperObject.id.push(e.target.id);
});

// Second listener on cardsContainer prevents double click on opened card and determines whether the guess is true or false
cardsContainer.addEventListener('click', function () {
  // Returns if only first card is open
  if (helperObject.guesses.length !== 2) return;
  //  Below IF Block prevents clicking on already opened card
  if (helperObject.id[0] === helperObject.id[1]) {
    addHiddenClass(helperObject.id[0]);
    resetHelperObject();
    errorTone();
    setTimeout(() => {
      alert('Please Click On Two Different Fields !');
    }, 100);

    return;
  }
  // Below IF block closes cards if they are not the same
  if (helperObject.guesses[0] !== helperObject.guesses[1]) {
    cardsContainer.style.pointerEvents = 'none';
    setTimeout(() => {
      toggleHideShow(helperObject.id[0]);
      toggleHideShow(helperObject.id[1]);
      pairMissTone();
      addMinus();
      resetHelperObject();
    }, 1500);

    // Else block from below handles true guess
  } else {
    cardsContainer.style.pointerEvents = 'none';
    setTimeout(() => {
      // Hide first card and it's parent div wrapper
      addHiddenClass(helperObject.id[0]);
      document
        .getElementById(`${helperObject.id[0]}`)
        .closest('.gf-wrapper').style.visibility = 'hidden';
      // Hide second card and it's parent div wrapper
      addHiddenClass(helperObject.id[1]);
      document
        .getElementById(`${helperObject.id[1]}`)
        .closest('.gf-wrapper').style.visibility = 'hidden';

      pairHit();
      addPlus();
      resetHelperObject();
    }, 1500);
  }
});

button.addEventListener('click', function () {
  shuffle(memoryCardsEasy);
  startGameTone();
  startTimer();

  cardFields.forEach((field, i) => {
    field.style.backgroundImage = `url(./img/cards/${memoryCardsEasy[i]}.jpg)`;
    field.classList.add('hidden');
  });

  cardsContainer.style.pointerEvents = 'initial';
  button.style.display = 'none';
  statsContainer.classList.remove('pushed-below');
  statsContainer.classList.add('slide-in');

  //   socket.emit('new player', )
});

buttonModal.addEventListener('click', closeModal);

modalBackground.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-open')) closeModal();
});

enterUsernameButton.addEventListener('click', () => {
  console.log('clicked');
  const input = document.querySelector('.enter-player-name');
  const username = input.value;
  socket.emit('new player', { username });
});
