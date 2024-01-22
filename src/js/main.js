'use strict';
// constantes

const btnSearch = document.querySelector('.js-btnSearch');
const boxBrowsers = document.querySelector('.js-browsers-list');
const boxFavs = document.querySelector('.js-favs-list');
const animemixPic = `../public/images/animemix.webp`;
const btnReset = document.querySelector('.js-reset');

let filmsAnime = [];
let arrayAnimeSearch = [];
let arrayFilmFav = [];
let arrayFilmFav2 = [];
let inputFilter = '';

function resetAll() {
   // Limpiar el contenido de las listas
   boxBrowsers.innerHTML = '';
   boxFavs.innerHTML = '';

  //  Eliminar las clases de fondo amarillo
   const clickedElements = document.querySelectorAll('.clicked');
   clickedElements.forEach((element) => {
      element.classList.remove('backgroundYellow');
   });

   // Limpiar el array de favoritos
   arrayFilmFav = [];

   // Limpiar el local storage
   localStorage.removeItem('clicked');
}
btnReset.addEventListener('click', resetAll)
// value del input array fav y arrav buscFilter, y de la busqueda a vacio; y renderizar, limparlocal storage

function getLocalStorage() {
  arrayFilmFav2 = JSON.parse(localStorage.getItem('clicked'));
  console.log(arrayFilmFav2);
  if(arrayFilmFav2 !==null){
  if (arrayFilmFav2.length > 0) {
    console.log(arrayFilmFav2);
    for (let itemArrayFav of arrayFilmFav2) {
      console.log(itemArrayFav);
      boxFavs.innerHTML += printFavInfo(
        itemArrayFav.title,
        itemArrayFav.images,
        itemArrayFav.id
      );
    }
  }
}
}

getLocalStorage();

// con un condicional si hay cosas las pintas, y si no hay cosas pide info a la api

function getInput() {
  const inputText = document.getElementById('js-inputText').value.toLowerCase();
  inputFilter = inputText;
  console.log(inputFilter);
  handleInfo(inputFilter);
}

const dynamicElements = () => {
  const clickedElements = document.querySelectorAll('.card');
  for (const element of clickedElements) {
    element.addEventListener('click', listenFavorites);
  }
};
const dynamicFavs = () => {
  const favsSelected = document.querySelectorAll('.js-fav');
  console.log(favsSelected);
  for (const favSelected of favsSelected) {
    favSelected.addEventListener('click', deleteFavorite);
  }
};
dynamicFavs();
//console.log(inputFilter);
btnSearch.addEventListener('click', getInput);

// peticion
function handleInfo(inputFilter) {
  fetch(`https://api.jikan.moe/v4/anime?q=${inputFilter}`)
    .then((response) => response.json())
    .then((info) => {
      arrayAnimeSearch = [];
      console.log(info.data);
      filmsAnime = info.data;
      for (const filmAnime of filmsAnime) {
        console.log(filmAnime.images.jpg.image_url);
        if (
          filmAnime.images.jpg.image_url !==
          `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`
        ) {
          arrayAnimeSearch.push({
            title: filmAnime.title,
            images: filmAnime.images.jpg.image_url,
            id: filmAnime.mal_id,
          });
        } else {
          arrayAnimeSearch.push({
            title: filmAnime.title,
            images: animemixPic,
            id: filmAnime.mal_id,
          });
        }
      }
      printAnimeHtml(arrayAnimeSearch);
      dynamicElements();
      console.log(arrayAnimeSearch);
    });
}

// print
function printAnimeHtml(arrayAnimeSearch) {
  boxBrowsers.innerHTML = '';
  for (const animeFilm of arrayAnimeSearch) {
    let animeFilms = printAnimeInfo(
      animeFilm.title,
      animeFilm.images,
      animeFilm.id
    );
    boxBrowsers.innerHTML += animeFilms;
  }
}
function printAnimeInfo(title, images, id) {
  let htmlCode = '';
  htmlCode += `<li class="card  clicked js-color" id="${id}">`;
  htmlCode += `<img class="card__img" src="${images}" alt="${title}"></img>`;
  htmlCode += `<h3 class="card__name">${title}</h3>`;
  htmlCode += `</li>`;
  return htmlCode;
}
function printFavInfo(title, images, id) {
  let htmlCode = '';
  htmlCode += `<li class="clicked js-fav" id="${id}">`;
  htmlCode += `<img class="card__img" src="${images}" alt="${title}"></img>`;
  htmlCode += `<h3 class="card__name">${title}</h3>`;
  htmlCode += `</li>`;
  return htmlCode;
}

function listenFavorites(ev) {
  const currentTarget = ev.currentTarget;
  console.log(currentTarget);
  if (currentTarget.classList.contains('clicked')) {
    let filmFav = {
      title: currentTarget.querySelector('.card__name').textContent,
      images: currentTarget.querySelector('.card__img').src,
      id: currentTarget.id,
    };
    if (arrayFilmFav === !null) {
      const favIndex = arrayFilmFav.findIndex((fav) => fav.id === filmFav.id);
      console.log(favIndex);
    }

    console.log(filmFav);
    console.log(arrayFilmFav);

    if (currentTarget.classList.contains('backgroundYellow')) {
      currentTarget.classList.remove('backgroundYellow');
      const favToRemove = document.getElementById(filmFav.id);
      favToRemove.remove();
      arrayFilmFav.splice(favIndex, 1);
      console.log(arrayFilmFav);
    } else {
      currentTarget.classList.add('backgroundYellow');
      arrayFilmFav.push(filmFav);
      console.log(arrayFilmFav);
      boxFavs.innerHTML += printFavInfo(
        filmFav.title,
        filmFav.images,
        filmFav.id
      );
      dynamicFavs();
    }
  }
  localStorageFav();
}

function localStorageFav() {
  localStorage.setItem('clicked', JSON.stringify(arrayFilmFav));
}

function deleteFavorite(ev) {
  const currentTarget = ev.currentTarget;
  const takeOfYellow = document.querySelectorAll('.backgroundYellow');
  for (let oneYellow of takeOfYellow) {
    if (currentTarget.id === oneYellow.id) {
      oneYellow.classList.remove('backgroundYellow');
    }
  }
  const favIndex = arrayFilmFav.findIndex((fav) => fav.id === takeOfYellow.id);
  currentTarget.remove();
  arrayFilmFav.splice(favIndex, 1);
  console.log(arrayFilmFav);
  localStorageFav();
}
