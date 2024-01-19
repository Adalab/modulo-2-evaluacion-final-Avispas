'use strict';
// constantes

const btnSearch = document.querySelector('.js-btnSearch');
const boxBrowsers = document.querySelector('.js-browsers-list');
const boxFavs = document.querySelector('.js-favs-list');
let filmsAnime = [];
let arrayAnimeSearch = [];
let inputFilter = '';

function getInput() {

  let inputText = document.getElementById('js-inputText').value.toLowerCase();
  inputFilter = inputText;
  console.log(inputFilter);
  hanldeInfo(inputFilter);
}

//console.log(inputFilter);
btnSearch.addEventListener('click', getInput);


// peticion
function hanldeInfo(inputFilter) {
  fetch(`https://api.jikan.moe/v4/anime?q=${inputFilter}`)
    .then((response) => response.json())
    .then((info) => {
      arrayAnimeSearch = [];
      console.log(info.data);
      filmsAnime = info.data;
      for (const filmAnime of filmsAnime) {
        arrayAnimeSearch.push({
          title: filmAnime.title,
          images: filmAnime.images.jpg.image_url,
          id: filmAnime.mal_id,
        });
      }
      // guardar la información en el almacenamiento local
      localStorage.setItem('animeData', JSON.stringify(arrayAnimeSearch));
      printAnimeHtml(arrayAnimeSearch);
      addEventListenerToDynamicElements();
      console.log(arrayAnimeSearch);
    });
}
// print
function printAnimeHtml(arrayAnimeSearch) {
  boxBrowsers.innerHTML = '';
  for (const animeFilm of arrayAnimeSearch) {
    let animeFilms = printAnimeInfo(animeFilm.title, animeFilm.images);
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

// function printFavourites(title, images) {
//   let htmlCodeFav = '';
//   htmlCodeFav += `<li class="cardFav">`;
//   htmlCodeFav += `<img class="cardFav__img" src="${images}" alt="${title}"></img>`;
//   htmlCodeFav += `<h3 class="cardFav__name">${title}</h3>`;
//   htmlCodeFav += `<i class="fa-solid fa-xmark cardFav__icon"></i>`;
//   htmlCodeFav += `</li>`;
//   return htmlCodeFav;
// }

const addEventListenerToDynamicElements = () =>{
  const clickedElements = document.querySelectorAll('.card');
  for ( const element of clickedElements){
    element.addEventListener('click', listenFavorites);
  }
}
function listenFavorites(ev) {
  const currentTarget = ev.currentTarget;
  if (currentTarget.classList.contains('clicked')) {
    const filmFav = {
      title: currentTarget.querySelector('.card__name').textContent,
      images: currentTarget.querySelector('.card__img').src,
      id: currentTarget.id,
    };
    if (currentTarget.classList.contains('backgroundYellow')) {
      currentTarget.classList.remove('backgroundYellow');
      const favToRemove = document.getElementById(currentTarget.id);
      favToRemove.remove();
      // removeFavorite(filmFav.id);
    } else {
      currentTarget.classList.add('backgroundYellow');
      boxFavs.innerHTML += printAnimeInfo(filmFav.title, filmFav.images, filmFav.id); 
    }
       
  }
}
const daleteFavorite = () => {
  const favItems = document.getElementById(`${id}`);
  for (const intem of favItems) {
    intem.addEventListener('click',removeFavorite)
  }
}

function removeFavorite(id) {
  const favoriteElement = document.getElementById(id);
  if (favoriteElement) {
    favoriteElement.delete();
  }
}