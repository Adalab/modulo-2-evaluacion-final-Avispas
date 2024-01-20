'use strict';
// constantes

const btnSearch = document.querySelector('.js-btnSearch');
const boxBrowsers = document.querySelector('.js-browsers-list');
const boxFavs = document.querySelector('.js-favs-list');


let filmsAnime = [];
let arrayAnimeSearch = [];
let inputFilter = '';

function getInput() {
  const inputText = document.getElementById('js-inputText').value.toLowerCase();
  inputFilter = inputText;
  console.log(inputFilter);
  handleInfo(inputFilter);
}

const dynamicElements = () =>{
  const clickedElements = document.querySelectorAll('.card');
  for ( const element of clickedElements){
    element.addEventListener('click', listenFavorites);
  }
}
const dynamicFavs = () =>{
  const favsSelected = document.querySelectorAll('.js-color');
  console.log(favsSelected);
  for ( const favSelected of favsSelected){
    favSelected.addEventListener('click', deleteFavorite);
  }
}


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
        arrayAnimeSearch.push({
          title: filmAnime.title,
          images: filmAnime.images.jpg.image_url,
          id: filmAnime.mal_id,
        });
      }
      // guardar la información en el almacenamiento local
      localStorage.setItem('animeData', JSON.stringify(arrayAnimeSearch));
      printAnimeHtml(arrayAnimeSearch);
      dynamicElements();
      dynamicFavs();
      console.log(arrayAnimeSearch);
    });

}
// print
function printAnimeHtml(arrayAnimeSearch) {
  boxBrowsers.innerHTML = '';
  for (const animeFilm of arrayAnimeSearch) {
    let animeFilms = printAnimeInfo(animeFilm.title, animeFilm.images, animeFilm.id);
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


function listenFavorites(ev) {
  const currentTarget = ev.currentTarget;
  console.log(currentTarget);
  if (currentTarget.classList.contains('clicked')) {
    const filmFav = {
      title: currentTarget.querySelector('.card__name').textContent,
      images: currentTarget.querySelector('.card__img').src,
      id: currentTarget.id
    }; 
    console.log(filmFav);
    if (currentTarget.classList.contains('backgroundYellow')) {
      currentTarget.classList.remove('backgroundYellow');
      const favToRemove = document.getElementById(filmFav.id);
      favToRemove.remove();
      // removeFavorite(filmFav.id);
    } else {
      currentTarget.classList.add('backgroundYellow');
      boxFavs.innerHTML += printAnimeInfo(filmFav.title, filmFav.images, filmFav.id); 

    }
       
  }
}




// function deleteFavorite(ev) {
//   const currentTarget = ev.currentTarget;
//   console.log(currentTarget);
//   if (currentTarget.classList.contains('backgroundYellow')) {
//     currentTarget.remove('backgroundYellow')
//   }
// }

// const favItems = boxFavs.children;
// console.log(favItems);
// for (const intem of favItems) {
//   intem.addEventListener('click', deleteFavorite)
// }  

// console.log(favItems);

// const favContainer = document.querySelector('.js-favs-list');
// favContainer.addEventListener('click', function(event) {
//   if (event.currentTargettarget.classList.contains('card')) {
//     customElements.remove();
//   }
// })
