'use strict';
// Constantes
const btnSearch = document.querySelector('.js-btnSearch');
const boxBrowsers = document.querySelector('.js-browsers-list');
const boxFavs = document.querySelector('.js-favs-list');
const animemixPic = `../public/images/animemix.webp`;
const btnReset = document.querySelector('.js-reset');

// Variables
let filmsAnime = [];
let arrayAnimeSearch = [];
let arrayFilmFav = []; //Para trabajar con la lista de todas las búsquedas
let arrayFilmFav2 = []; //Para trabajar con la información del localStorage
let inputFilter = ''; //Declaro esta variable aqui fuera porque posteriormente va a ser usada tanto por la función que recogerá su valor, como la función que hará la busqueda en el API
let favIndex = '';

// Función de reseteo
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
// Activamos el evento sobre el botón
btnReset.addEventListener('click', resetAll)

// Función para recoger información desde el almacenamiento local del navegador (localStorage) y luego imprimir la información relacionada con las peliculas favoritas en el contenedor boxFavs.
function getLocalStorage() {
  //Paso 1. Obtiene le valor almacenado en el localStorage bajo la clave 'clicked' (clase añadida al código HTML) y lo convierte de cadena JSON a un objeto JavaScript.
  arrayFilmFav2 = JSON.parse(localStorage.getItem('clicked')); 
  //Paso 2. Muestra en la consola el contenido de arrayFilmFav2.
  console.log(arrayFilmFav2);
  //Paso 3. Verifica si ek arrayFilm2 no es nulo.
  if(arrayFilmFav2 !==null){
  // Paso 4. Verifica si el array tiene elementos.
  if (arrayFilmFav2.length > 0) {    
    console.log(arrayFilmFav2);
    // Paso 5. Recorremos cada elemento del array.
    for (let itemArrayFav of arrayFilmFav2) {
      console.log(itemArrayFav);
      // Paso 6. Agrega información de la película favorita al contenedor boxFavs en el DOM. Se utiliza la función printFavInfo para obtener la información formateada. Esta función toma tres argumentos: title, images e id
      boxFavs.innerHTML += printFavInfo(
        itemArrayFav.title,
        itemArrayFav.images,
        itemArrayFav.id
        //  itemArrayFav.title, itemArrayFav.images, itemArrayFav.id son los datos específicos de la pelicula actual quese está procesando en el bucle.
      );
    }
  }
}
}
// Llamamos a la función seguidamente
getLocalStorage();

// Con esta función recogemos el valor en minúscula de lo que escribe el usuario en el input, y llamamos a la función handleInfo 
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

// Llamo a la función getInput al clicar en el botón del buscador (a su vez se ejecuta la función habldeInfo ya que va dentro de la función getInput)
btnSearch.addEventListener('click', getInput);

// Petición al servidor
function handleInfo(inputFilter) {
   // Paso 1: Realiza una solicitud a la API Jikan con el término de búsqueda proporcionado por el usuario.
  fetch(`https://api.jikan.moe/v4/anime?q=${inputFilter}`)
    .then((response) => response.json())
    // Paso 2: Maneja la respuesta convertiendo la respuesta en formato JSON.
    .then((info) => {
      // Paso 3: Reinicia el array `arrayAnimeSearch` para almacenar la nueva información.
      arrayAnimeSearch = [];
      console.log(info.data);
      // Paso 4: Asigna la información de la API a la variable `filmsAnime`.
      filmsAnime = info.data;
      // Paso 6: Recorre cada película en el array `filmsAnime`.
      for (const filmAnime of filmsAnime) {
        console.log(filmAnime.images.jpg.image_url);
        // Paso 7: Verifica si la URL de la imagen no es la URL predeterminada de MyAnimeList.
        if (filmAnime.images.jpg.image_url !==
          `https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png`
        ) {
          // Paso 8: Si la URL no es la predeterminada, agrega la información al array `arrayAnimeSearch`.
          arrayAnimeSearch.push({
            title: filmAnime.title,
            images: filmAnime.images.jpg.image_url,
            id: filmAnime.mal_id,
          });
        } else {
          // Paso 9: Si la URL es la predeterminada, agrega la información al array `arrayAnimeSearch` usando la imagen `animemixPic`.
          arrayAnimeSearch.push({
            title: filmAnime.title,
            images: animemixPic,
            id: filmAnime.mal_id,
          });
        }
      }
       // Paso 10: Llama a la función `printAnimeHtml` para imprimir la información en el contenedor `boxBrowsers`.
      printAnimeHtml(arrayAnimeSearch);
      // Paso 11: Llama a la función `dynamicElements` para agregar eventos dinámicos a los elementos recién creados.
      dynamicElements();
      console.log(arrayAnimeSearch);
    });
}

// Print
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
  //Paso 1. Obtiene el elemento sobre el cual se hizo click.
  const currentTarget = ev.currentTarget;
  console.log(currentTarget);
  //Paso 2.Verifica si el elemento tiene la clase 'clicked'
  if (currentTarget.classList.contains('clicked')) {
    let filmFav = {
      //Paso 3.Obtiene informacón de la película favorita actual.
      title: currentTarget.querySelector('.card__name').textContent,
      images: currentTarget.querySelector('.card__img').src,
      id: currentTarget.id,
    };
    //Paso 4.Verifica si el array 'arrayFilmfav' no es nulo
    if (arrayFilmFav === !null) {
      //Paso 5.Busca la posición de la pelicula favorita en el arrar mediante su id.
      favIndex = arrayFilmFav.findIndex((fav) => fav.id === filmFav.id);
      console.log(favIndex);
    }

    console.log(filmFav);
    console.log(arrayFilmFav);
    //Paso 6.Verifica si el elemento tiene la clase 'backgroundYellow'
    if (currentTarget.classList.contains('backgroundYellow')) {
      // Paso 7: Si tiene la clase 'backgroundYellow', la elimina.
      currentTarget.classList.remove('backgroundYellow');
      // Paso 8: Elimina la película favorita del DOM.
      const favToRemove = document.getElementById(filmFav.id);
      favToRemove.remove();
      // Paso 9: Elimina la película favorita del array `arrayFilmFav`. Le decimos la posición a través de favIndex, y que nos elimine un elemento
      arrayFilmFav.splice(favIndex, 1);
      localStorageFav();

      console.log(arrayFilmFav);
    } else {
      // Paso 10: Si no tiene la clase 'backgroundYellow', la agrega.
      currentTarget.classList.add('backgroundYellow');
      // Paso 11: Agrega la película favorita al array `arrayFilmFav`
      arrayFilmFav.push(filmFav);
      console.log(arrayFilmFav);
      // Paso 12: Agrega la información de la película favorita al contenedor `boxFavs` en el DOM.
      boxFavs.innerHTML += printFavInfo(
        filmFav.title,
        filmFav.images,
        filmFav.id
      );
       // Paso 14: Agrega eventos dinámicos a los elementos de favoritos recién creados.
      dynamicFavs();
    }
    
  }
  // Paso 15: Actualiza el almacenamiento local con la información del array `arrayFilmFav`.
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
  const favIndexD = arrayFilmFav.findIndex((fav) => fav.id === takeOfYellow.id);
  currentTarget.remove();
  arrayFilmFav.splice(favIndexD, 1);
  console.log(arrayFilmFav);
  localStorageFav();
}
