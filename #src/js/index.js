import './model-viewer';
import Swiper from 'swiper/bundle';
import { translate } from './translate';

window.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const header = document.querySelector('header');
  const preloader = document.querySelector('.preloader');
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }
  testWebP(function (support) {
    if (support == true) {
      body.classList.add('webp');
    } else {
      body.classList.add('no-webp');
    }
  });

  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.transform = 'scale(2.5)';
    setTimeout(() => {
      preloader.style.display = 'none';
      preloader.remove();
    }, 1300);
    body.classList.remove('--lock');
    const showItems = document.querySelectorAll('.--show-items');
    if (showItems.length > 0) {
      for (let index = 0; index < showItems.length; index++) {
        const showItem = showItems[index];
        if (!showItem.classList.contains('--show')) {
          showItem.classList.add('--show');
        }
      }
    }
    document.querySelector('.wrapper__model').insertAdjacentHTML(
      'afterbegin',
      `<model-viewer
            class="model"
            src="./model/scene.gltf"
            alt="A 3D model of the Pertin"
            camera-controls
            disable-zoom
            auto-rotate
            ios-src="./model/scene.gltf"
          >
          </model-viewer>`
    );
    localStorage.setItem('visited', JSON.stringify(true));
  }, 1800);
  if (localStorage.getItem('visited')) {
    preloader.remove();
  }

  const dropdown = document.querySelector('.dropdown');
  const dropdownBtn = document.querySelector('.dropdown__btn');
  const dropdownItems = document.querySelectorAll('.dropdown__list-item');
  const allLanguages = ['en', 'ru', 'uz'];
  dropdownBtn.addEventListener('click', function () {
    dropdown.classList.toggle('--active');
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown__btn')) {
        if (dropdown.classList.contains('--active')) {
          dropdown.classList.remove('--active');
        }
      }
    });
  });
  if (dropdownItems.length > 0) {
    for (let i = 0; i < dropdownItems.length; i++) {
      const dropdownItem = dropdownItems[i];
      dropdownItem.addEventListener('click', changeURLLanguage);
      function changeURLLanguage() {
        const language = dropdownItem.textContent;
        location.href = window.location.pathname + '#' + language;
        location.reload();
      }
      function changeLanguage() {
        const hash = window.location.hash.substr(1);
        if (!allLanguages.includes(hash)) {
          location.href = window.location.pathname + '#uz';
          location.reload();
        }
        dropdownBtn.innerHTML = hash + '<span></span>';
        if (dropdownItem.textContent == hash) {
          dropdownItem.classList.add('--active');
        }
        document.querySelector('title').innerHTML = translate['title'][hash];
        for (let key in translate) {
          const element = document.querySelector(`[data-translate="${key}"`);
          if (element) {
            element.innerHTML = translate[key][hash];
          }
        }
      }
      changeLanguage();
    }
  }
  const burgerMenuBtn = document.querySelector('.burger-menu');
  const burgerMenu = document.querySelector('.menu');
  const menuLinks = document.querySelectorAll('.menu__list-link[data-goto]');
  const buttons = document.querySelectorAll('[data-btns="buttons"]');
  if (menuLinks.length > 0) {
    menuLinks.forEach((menuLink) => {
      menuLink.addEventListener('click', onMenuLinkClick);
    });
    function onMenuLinkClick(e) {
      const menuLink = e.target;
      if (
        menuLink.dataset.goto &&
        document.querySelector(menuLink.dataset.goto)
      ) {
        const gotoBlock = document.querySelector(menuLink.dataset.goto);
        const gotoBlockValue =
          gotoBlock.getBoundingClientRect().top +
          pageYOffset -
          header.offsetHeight;
        window.scrollTo({
          top: gotoBlockValue,
          behavior: 'smooth',
        });
        e.preventDefault();
      }
      if (burgerMenu.classList.contains('--active')) {
        body.classList.remove('--lock');
        burgerMenuBtn.classList.remove('--active');
        burgerMenu.classList.remove('--active');
      }
    }
  }

  burgerMenuBtn.addEventListener('click', function () {
    body.classList.toggle('--lock');
    burgerMenuBtn.classList.toggle('--active');
    burgerMenu.classList.toggle('--active');
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.menu') && !e.target.closest('.burger-menu')) {
        if (burgerMenu.classList.contains('--active')) {
          body.classList.remove('--lock');
          burgerMenuBtn.classList.remove('--active');
          burgerMenu.classList.remove('--active');
        }
      }
    });
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 200);
      window.scrollTo({
        top: document.querySelector('.wrapper').offsetHeight,
        behavior: 'smooth',
      });
      e.preventDefault();
    });
  });

  const swiper = new Swiper('.about__slider', {
    loop: true,
    parallax: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 10000,
      stopOnLastSlide: false,
      disableOnInteraction: false,
    },
    speed: 1000,
    simulateTouch: false,
    slideToClickedSlide: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: true,
    },
    watchOverflow: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the first slide',
      notificationClass: 'swiper-notification',
      paginationBulletMessage: 'Go to slide {{index}}',
    },
  });

  const form = document.querySelector('#form');
  const userName = form.firstName;
  const userPhoneNumber = form.phoneNumber;
  const formBtn = document.querySelector('.form__btn');
  const formInputs = document.querySelectorAll('.form__input');
  const formLabels = document.querySelectorAll('.form__label');
  formInputs.forEach((formInput) => {
    formInput.addEventListener('input', function () {
      if (
        userName.value.length >= 3 &&
        userPhoneNumber.value.length ==
          userPhoneNumber.getAttribute('maxlength')
      ) {
        formBtn.classList.add('--active');
        formBtn.removeAttribute('disabled');
        formInput.classList.add('--active');
      } else {
        formBtn.classList.remove('--active');
        formBtn.setAttribute('disabled', '');
        formInput.classList.add('--active');
      }
      if (userName.value.length > 0) {
        formLabels[0].style.cssText = `bottom: 100%;left: 0;font-size: 1rem;transform: translate(0%, -50%);`;
      } else {
        formLabels[0].style.cssText = ``;
      }
      if (userPhoneNumber.value.length > 0) {
        formLabels[1].style.cssText = `bottom: 100%;left: 0;font-size: 1rem;transform: translate(0%, -50%);`;
      } else {
        formLabels[1].style.cssText = ``;
      }
    });
  });

  function isValidName(evt) {
    let ch = String.fromCharCode(evt.which);
    if (/[0-9-+-@-!-_-#-$-%-^-&-*]/.test(ch) && !/[']/.test(ch)) {
      evt.preventDefault();
    }
  }

  const phoneInputs = document.querySelectorAll('input[data-tel-input]');
  const getInputNumbersValue = function (input) {
    return input.value.replace(/\D/g, '');
  };
  function onPhoneInput(e) {
    const input = e.target;
    const inputValue = getInputNumbersValue(input);
    let formattedInputValue = '';
    let selectionStart = input.selectionStart;
    if (!inputValue) {
      return (input.value = '');
    }
    if (input.value.length != selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        input.value = inputValue;
      }
      return;
    }
    if (['3', '5', '8', '9'].indexOf(inputValue[0]) > -1) {
      userPhoneNumber.setAttribute('maxlength', '19');
      let firstSymbol = inputValue[0];
      if (inputValue.length >= 4) {
        firstSymbol = inputValue[3];
      }
      formattedInputValue = '+998 (' + firstSymbol;
      if (inputValue.length > 3) {
        formattedInputValue += inputValue.substring(4, 5);
      }
      if (inputValue.length > 5) {
        formattedInputValue += ') ' + inputValue.substring(5, 8);
      }
      if (inputValue.length > 8) {
        formattedInputValue += '-' + inputValue.substring(8, 10);
      }
      if (inputValue.length > 10) {
        formattedInputValue += '-' + inputValue.substring(10, 12);
      }
    } else {
      formattedInputValue = '+' + inputValue;
      userPhoneNumber.setAttribute('maxlength', '13');
    }
    input.value = formattedInputValue;
  }
  const onPhoneKeydown = function (e) {
    let input = e.target;
    if (e.keyCode == 8 && getInputNumbersValue(input).length == 4) {
      input.value = '';
    }
  };
  const onPhonePaste = function (e) {
    let pasted = e.clipboardData || window.clipboardData;
    const input = e.target;
    const inputValue = getInputNumbersValue(input);
    if (pasted) {
      let pastedText = pasted.getData('text');
      if (/\D/g.test(pastedText)) {
        input.value = inputValue;
      }
    }
  };
  for (let i = 0; i < phoneInputs.length; i++) {
    const input = phoneInputs[i];
    input.addEventListener('input', onPhoneInput);
    input.addEventListener('keydown', onPhoneKeydown);
    input.addEventListener('paste', onPhonePaste);
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userNameValue = userName.value;
    const userPhoneNumberValue = userPhoneNumber.value;
    const token = '1964013967:AAHLzkG_GXBOExXgka4d_vAUr0tGMGN9gIc';
    const chatID = '-526804890';
    const message = `<b>Pertin</b>  %0A<b>👤Ismi: </b> ${userNameValue}\;%0A<b>📞Tel.raqami: </b>${userPhoneNumberValue}\;`;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${message}&parse_mode=html`;
    const api = new XMLHttpRequest();
    api.open('GET', url, true);
    api.send();
    console.log('name: ', userNameValue, 'number: ', userPhoneNumberValue);
    document.querySelector('.form__succes').classList.add('--loading');
    form.reset();
    formLabels[0].style.cssText = ``;
    formLabels[1].style.cssText = ``;
    setTimeout(() => {
      const hash = window.location.hash.substr(1);
      const footerTitle = document.querySelector('.footer__title');
      footerTitle.innerHTML = `Murojaatingiz uchun <br/> tashakkur!`;
      const footerText = document.querySelector('.footer__text');
      footerText.textContent = `Biz siz bilan tez orada bog'lanamiz!`;
      if (hash == 'ru') {
        footerTitle.innerHTML = ` Спасибо за вашу <br/> заявку! `;
        footerText.textContent = `Мы свяжемся с вами в ближайшее время!`;
      }
      if (hash == 'en') {
        footerTitle.innerHTML = ` Thanks for your <br/> application!`;
        footerText.textContent = `We will contact you shortly!`;
      }
    }, 1000);
  });

  const model = document.querySelector('.wrapper__model');
  let fullHeight;

  window.addEventListener('scroll', setModelPosition);
  window.addEventListener('resize', function () {
    setModelPosition();
    setImage();
  });
  function setImage() {
    if (window.innerWidth < 768) {
      document.querySelector(
        '.statistics__image'
      ).innerHTML = ` <img src="./images/pertin.png" alt="Pertin" />`;
    } else {
      document.querySelector('.statistics__image').innerHTML = '';
    }
  }
  setImage();
  function setModelPosition() {
    if (window.pageYOffset > window.innerHeight) {
      model.classList.remove('--show');
      model.classList.add('--normal');
    }
    fullHeight =
      document.querySelector('body').scrollHeight - window.innerHeight;
    header.classList.toggle('--bg-dark', window.pageYOffset > 100);
    if (window.innerWidth >= 768) {
      model.style.top =
        16 +
        (window.pageYOffset *
          (84 - (model.scrollHeight * 100) / window.innerHeight / 2)) /
          fullHeight +
        '%';
      model.style.right = 10 + (window.pageYOffset * 200) / fullHeight + '%';
      if (parseInt(model.style.right) >= 100) {
        model.style.right = 189 - (window.pageYOffset * 200) / fullHeight + '%';
      }
      document.querySelector('.model').style.transform =
        'perspective(800px) rotate(-' +
        (window.pageYOffset * 1080) / fullHeight +
        'deg)';
    }

    model.classList.toggle('--hide', window.pageYOffset >= fullHeight - 10);
  }
  const animItems = document.querySelectorAll('.--anim-items');
  if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll() {
      for (let index = 0; index < animItems.length; index++) {
        const animItem = animItems[index];
        const animItemHeight = animItem.offsetHeight;
        const animItemOffset = offset(animItem).top;
        const animStart = 6;
        let animItemPoint = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if (
          pageYOffset > animItemOffset - animItemPoint &&
          pageYOffset < animItemOffset + animItemHeight
        ) {
          animItem.classList.add('--animate');
        } else {
          animItem.classList.remove('--animate');
        }
      }
      function offset(el) {
        const rect = el.getBoundingClientRect(),
          scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
      }
    }
    setTimeout(() => {
      animOnScroll();
    }, 400);
  }

  const loadMapBlock = document.querySelector('.--load-map');
  const windowHeight = document.documentElement.clientHeight;
  const lazySpinner = document.querySelector('.--lazy__spinner');

  window.addEventListener('scroll', lazyScroll);
  function lazyScroll() {
    if (!loadMapBlock.classList.contains('--loaded')) {
      getMap();
    }
  }

  function getMap() {
    const loadMapBlockPosition =
      loadMapBlock.getBoundingClientRect().top + pageYOffset;
    if (pageYOffset > loadMapBlockPosition - windowHeight) {
      const loadMapURL = loadMapBlock.dataset.map;
      if (loadMapURL) {
        loadMapBlock.insertAdjacentHTML(
          'beforeend',
          `<iframe src="${loadMapURL}" allowfullscreen="" loading="lazy"><iframe/>`
        );
        loadMapBlock.classList.add('--loaded');
        lazySpinner.classList.add('--active');
      }
    }
  }
});
