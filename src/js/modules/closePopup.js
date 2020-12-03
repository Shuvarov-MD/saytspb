const closePopup = () => {
  const popupWrapperActive = document.querySelector('.popup__wrapper.active'),
    popupContentActive = document.querySelector('.popup__content.active');

  popupWrapperActive.classList.remove('active');
  popupContentActive.classList.remove('active');
};

document.querySelector('.popup').addEventListener('click', event => {
  if (event.target.closest('.popup__close') || !event.target.closest('.popup__content.active')) {
    closePopup();
  }
});

document.body.addEventListener('keydown', event => {
  const popupWrapperActive = document.querySelector('.popup__wrapper.active');

  if (event.code === 'Escape' && popupWrapperActive) {
    closePopup();
  }
});
