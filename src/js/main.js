'use strict';
const btnSearch = document.querySelector('.js-btnSearch');
const boxBrowsers = document.querySelector('.js-pasteBrowsers');
let inputFilter = '';
function getInput(ev) {
  let inputText = document.getElementById('js-inputText').value;
  inputFilter = inputText;
  console.log(inputFilter);
  getInfo(inputFilter);

}
//console.log(inputFilter);
btnSearch.addEventListener('click', getInput);

let filmsAnime = [];
let arrayAnimeSearch = [];

// peticion
function getInfo(inputFilter) {
  fetch(`https://api.jikan.moe/v4/anime?q=${inputFilter}`)
    .then((response) => response.json())
    .then((info) => {
      arrayAnimeSearch = [];
      console.log(info.data);
      filmsAnime = info.data;
      for (const filmAnime of filmsAnime) {
        arrayAnimeSearch.push({
          title: filmAnime.title,
          images: filmAnime.images.jpg.image_url
        });
      }
      // guardar la información en el almacenamiento local
      localStorage.setItem('animeData', JSON.stringify(arrayAnimeSearch));
      printAnimeHtml(arrayAnimeSearch);
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
function printAnimeInfo(title, images) {
  let htmlCode = '';
  htmlCode += `<div class="card">`;
  htmlCode += `<img class="card__img" src="${images}" alt="${title}"></img>`;
  htmlCode += `<h3 class="card__name">${title}</h3>`;
  htmlCode += `</div>`;
  return htmlCode;
}
function printFavourites() {
  let htmlCodeFav = '';
  htmlCodeFav += `<div class="cardFav">`;
  htmlCodeFav += `<img class="cardFav__img" src="${images}" alt="${title}"></img>`;
  htmlCodeFav += `<h3 class="cardFav__name">${title}</h3>`;
  htmlCodeFav += `<i class="fa-solid fa-xmark cardFav__icon"></i>`;
  htmlCodeFav += `</div>`;
  return htmlCodeFav;

}

