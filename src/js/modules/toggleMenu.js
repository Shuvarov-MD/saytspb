const toggleMenu = () => {
  const headerNavbar = document.querySelector('.header__navbar'),
    burgerMenuSpan = document.querySelectorAll('.burger-menu__span');

  headerNavbar.classList.toggle('active');
  burgerMenuSpan.forEach(item => item.classList.toggle('active'));
};

document.querySelector('.burger-menu').addEventListener('click', toggleMenu);
