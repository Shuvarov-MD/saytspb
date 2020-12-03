const showPopup = selector => {
  const popupWrapper = document.querySelector('.popup__wrapper'),
    popupContent = document.querySelector(`.popup__content--${selector}`);

  popupWrapper.classList.add('active');
  popupContent.classList.add('active');
};

document.querySelectorAll('.callback').forEach(item => {
  item.addEventListener('click', () => showPopup('callback'));
});
