// declaración
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
const APIkey = '7f2dd986';
const APIGoogle = 'AIzaSyAYW3g3NRld4PtVL4Bmz04tueXbASg8o-g';
const APItmbdb = '3fae9e615d9aaca0a304824bd82082e1';
const APIyoutube = 'AIzaSyCTRMhSwgevh6jT9i-kdLVk5jOwBCTXSTo';
const noImage = '../img/no_image.jpeg';

// localStorage
function getLocalStorage(){
  if (!localStorage.getItem("search_value")) {
    btn();
  } else {
    value = localStorage.getItem("search_value");
    apiCall(value);
  }
}

// API call
async function apiCall(value) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${APIkey}&s=${value}&page=1&type="movie"`);
    const data = await response.json();
    
    resultElement.innerHTML = '';
    setData(data.Search);
  } catch (error) {
    console.log(`Hubo un error: ${error}`);
    salvaVidas();
  } finally {
    console.log('ejecuto el finally');
  }
}

// search
function btn() {
  buttonSearch.addEventListener('click', event => {
    event.preventDefault();
    spinner(resultElement);
    value = inputElement.value;

    if (!value) {
      salvaVidas();
    } else {
      localStorage.setItem(`search_value`, `${value}`)
      apiCall(value);
    }
  });
}

function btnKey() {
  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      spinner(resultElement);
      value = inputElement.value;

      if (!value) {
        salvaVidas();
      } else {
        localStorage.setItem(`search_value`, `${value}`)
        apiCall(value);
      }
    }
  })
}

// crea una card con los datos de la busqueda
function setData(data) {
  const row = document.createElement("div");
  row.classList.add('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4', 'row-cols-xl-5', 'g-3', 'page');
  resultElement.append(row);

  data.forEach(async movie => {
    const movieID = await getMovie(movie.imdbID);

    const div = document.createElement("div");
    div.classList.add('col');
    row.append(div);

    const card = document.createElement("div");
    card.classList.add('card', 'text-bg-dark');
    div.append(card);

    const cardImg = document.createElement("img");
    cardImg.classList.add('card-img');
    cardImg.src = movie.Poster != 'N/A' ? movie.Poster : noImage;
    cardImg.alt = movie.Title;
    card.append(cardImg);

    const cardOverlay = document.createElement("div");
    cardOverlay.classList.add('card-img-overlay');
    card.append(cardOverlay);

    const cardContainer = document.createElement("div");
    cardContainer.classList.add('d-flex', 'flex-column', 'justify-content-between', 'h-100', 'card-container');
    cardOverlay.append(cardContainer);

    const cardContent = document.createElement("div");
    cardContainer.append(cardContent);

    const cardTitleContainer = document.createElement("div");
    cardTitleContainer.classList.add('d-flex', 'align-items-top', 'justify-content-between');
    cardContent.append(cardTitleContainer);

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add('card-title', 'fw-semibold');
    cardTitle.textContent = movie.Title;
    cardTitleContainer.append(cardTitle);

    const favIcon = document.createElement("i");
    favIcon.id = `btn1-${movie.imdbID}`;
    favIcon.classList.add('bi', movieID ? 'bi-heart-fill' : 'bi-heart', 'fs-5', 'fav-icon', 'ms-2');
    cardTitleContainer.append(favIcon);

    const cardText = document.createElement("p");
    cardText.classList.add('card-text', 'm-0', 'col', 'd-inline-block');
    cardText.textContent = movie.Year;
    cardContent.append(cardText);

    const detailsButton = document.createElement("button");
    detailsButton.classList.add('btn', 'fw-semibold', 'btn-primary', 'btn-details');
    detailsButton.dataset.id = movie.imdbID;
    detailsButton.dataset.bsToggle = 'modal';
    detailsButton.dataset.bsTarget = `#staticBackdrop-${movie.imdbID}`;
    detailsButton.textContent = 'Ver más!';
    cardContainer.append(detailsButton);

    const modal = document.createElement("div");
    modal.classList.add('modal', 'fade');
    modal.id = `staticBackdrop-${movie.imdbID}`;
    modal.dataset.bsBackdrop = 'static';
    modal.dataset.bsKeyboard = 'false';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'staticBackdropLabel');
    modal.setAttribute('aria-hidden', 'true');
    div.append(modal);

    const modalDialog = document.createElement("div");
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-dialog-scrollable');
    modal.append(modalDialog);

    const modalContent = document.createElement("div");
    modalContent.classList.add('modal-content');
    modalDialog.append(modalContent);

    let btnFav = div.querySelector(`#btn1-${movie.imdbID}`);
    setFav(movie, btnFav);

    let btn = div.querySelector('.btn-details');
    let id = btn.dataset.id;
    APImovieDetails(id, div);
  });
}

// api call by imdbID
async function APImovieDetails(id, div) {
  try {
    const resp = await fetch(`http://www.omdbapi.com/?apikey=${APIkey}&i=${id}&page=${page}&type="movie"`);
    const data = await resp.json();
    modalMovieDetails(data, div);
  } catch (err) {
    console.log(`Hubo un error: ${err}`);
  } finally {
    console.log('Ejecutó el finally');
  }
}


// modal con datos de la pelicula
async function modalMovieDetails(data, div) {
  const content = div.querySelector('.modal-content');

  // obtengo respuesta de indexedDB y guardo en variable el imdbID de la pelicula
  let movieID = await getMovie(data.imdbID);

  // elementos HTML
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header gap-md-0 gap-2 align-items-start';

  const image = document.createElement('img');
  image.src = data.Poster != 'N/A' ? data.Poster : noImage;
  image.alt = `Imagen de ${data.Title}`;
  image.className = 'details-image';

  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'px-md-3';

  const titleElement = document.createElement('h3');
  titleElement.id = 'staticBackdropLabel';
  titleElement.className = 'mb-0';
  titleElement.textContent = data.Title;

  const genreElement = document.createElement('small');
  genreElement.className = 'd-block text-secondary';
  genreElement.textContent = data.Genre;

  const countryElement = document.createElement('small');
  countryElement.className = 'd-block text-secondary';
  countryElement.textContent = data.Country;

  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'd-flex align-items-center mt-2';

  const ratingBadge = document.createElement('span');
  ratingBadge.className = 'badge bg-primary rounded-pill rating d-block';
  ratingBadge.textContent = data.imdbRating;

  const heartIcon = document.createElement('i');
  heartIcon.className = `bi ${movieID ? 'bi-heart-fill' : 'bi-heart'} d-block fs-5 ms-2 fav-icon`;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close bg-light';
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  closeButton.setAttribute('aria-label', 'Close');

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  const plotParagraph = document.createElement('p');
  plotParagraph.textContent = data.Plot;

  const listGroup = document.createElement('ul');
  listGroup.className = 'list-group table-striped mb-2';

  const listItemReparto = createListItem('Reparto:', data.Actors);
  const listItemDirector = createListItem('Director:', data.Director);
  const listItemEscritor = createListItem('Escritor:', data.Writer);
  const listItemDuracion = createListItem('Duración:', data.Runtime);
  const listItemLanzamiento = createListItem('Lanzamiento:', data.Released);

  const trailerContainer = document.createElement('div');
  trailerContainer.className = `trailer video-container-${data.imdbID} mt-1`;

  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';

  const favButton = document.createElement('button');
  favButton.type = 'button';
  favButton.setAttribute('data-id', data.imdbID);
  favButton.className = 'btn btn-primary w-100 btnFav';
  favButton.textContent = movieID ? 'Quitar de favoritos' : 'Agregar a favoritos';

  // Construir la estructura del modal
  modalHeader.append(image, detailsContainer);
  detailsContainer.append(titleElement, genreElement, countryElement, ratingContainer);
  ratingContainer.append(ratingBadge, heartIcon);
  modalHeader.append(closeButton);

  listGroup.append(listItemReparto, listItemDirector, listItemEscritor, listItemDuracion, listItemLanzamiento);

  modalBody.append(plotParagraph, listGroup, trailerContainer);

  modalFooter.appendChild(favButton);

  // Agregar los elementos al contenido del modal
  content.append(modalHeader, modalBody, modalFooter);

  MovieTrailer(data.Title, data.imdbID);
}

// elementos de lista
function createListItem(label, value) {
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item fw-semibold';
  listItem.textContent = `${label} `;
  
  const valueSpan = document.createElement('span');
  valueSpan.className = 'fw-normal';
  valueSpan.textContent = value;

  listItem.appendChild(valueSpan);

  return listItem;
}



// trailer
async function MovieTrailer(movie, id) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmFlOWU2MTVkOWFhY2EwYTMwNDgyNGJkODIwODJlMSIsInN1YiI6IjY0ODNhZDY1YmYzMWYyNTA1NzA1YjgwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YM-U9dI8Sffx6sY9_X4J3r_WYGHrrOcQjY-8KJy2vcE'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&language=en-US&page=1`, options);
    const searchData = await response.json();
    const videoID = searchData.results[0]?.id;

    if (videoID) {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${videoID}/videos?language=en-US`, options);
      const videoData = await response.json();
      const videoKEY = videoData.results[0]?.key;

      if (videoKEY) {
        const videoContainer = document.querySelector(`.video-container-${id}`);
        const trailerTitle = document.createElement('h2');
        trailerTitle.classList.add('h5', 'mt-4', 'd-block');
        trailerTitle.innerText = 'Trailer';

        const iframeContainer = document.createElement('div');
        iframeContainer.classList.add('iframe-container');

        const iframeElement = document.createElement('iframe');
        iframeElement.src = `https://www.youtube.com/embed/${videoKEY}`;
        iframeElement.allowFullscreen = true;
        iframeElement.width = '100%';
        iframeElement.height = '100%';

        videoContainer.innerHTML = '';
        iframeContainer.append(iframeElement);
        videoContainer.append(trailerTitle, iframeContainer);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// favoritos
function setFav(movie, btn) {
  btn.addEventListener('click', () => {

    if (btn.innerText != 'Ver más!') {
      if (btn.classList.contains('bi-heart')) {
        btn.classList.remove('bi-heart');
        btn.classList.add('bi-heart-fill');
        saveData(movie);
      } else {
        btn.classList.add('bi-heart');
        btn.classList.remove('bi-heart-fill');
        deleteFav(movie.imdbID);
      }
    }
  })
}

// get favoritos
async function actualizarDataFavoritos() {
  spinner(resultElement);
  // Obtener los datos de favoritos utilizando getMovie()
  const favoritos = await getData();

  // Llamar a setData() con los datos de favoritos
  resultElement.innerHTML = '';
  spinner(resultElement);

  setTimeout(() => {
    if (favoritos.length) {
      resultElement.innerHTML = '<h2 class="w-100 h2 m-0 mb-2">favoritos</h2>';
      setData(favoritos);
    } else {
      resultElement.innerHTML = '<p>Aún no tienes películas favoritas.</p>'
    }
  }, 500)
}

// manejo links
function setEventListeners() {
  const homeLink = document.getElementById('home');
  const favoritosLink = document.getElementById('fav');
  const btnNews = document.getElementById('news');

  homeLink.addEventListener('click', () => {
    const value = localStorage.getItem("search_value");
    spinner(resultElement)

    setTimeout(() => {
      if (value) {
        apiCall(value);
      } else {
        salvaVidas();
      }
    }, 500)
  });

  favoritosLink.addEventListener('click', () => {
    actualizarDataFavoritos();
  });

  // Agregar el evento de clic al botón "Novedades"
  btnNews.addEventListener('click', handleClickNovedades);
}

//novedades
async function obtenerTrailersUltimasPeliculas() {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=trailer&key=${APIyoutube}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const trailersUltimasPeliculas = data.items.filter(item => {
      const fechaPublicacion = new Date(item.snippet.publishedAt);
      const anioPublicacion = fechaPublicacion.getFullYear();
      return anioPublicacion === anioActual;
    });
    return trailersUltimasPeliculas;
  } catch (error) {
    throw new Error('Error al obtener los trailers: ' + error);
  }
}

// Función para manejar el evento de clic en el botón "Novedades"
function handleClickNovedades() {
  spinner(resultElement);

  obtenerTrailersUltimasPeliculas()
    .then(trailers => {
      setTimeout(() => {
        resultElement.innerHTML = '<h2 class="w-100 h2 m-0 mb-2">descubrí las últimas películas aclamadas por la crítica</h2>';
        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'g-3', 'news');
        resultElement.appendChild(row);

        // Crear la tarjeta para cada trailer
        trailers.forEach(trailer => {
          const titulo = trailer.snippet.title;
          const videoId = trailer.id.videoId;
          const videoUrl = `https://www.youtube.com/embed/${videoId}`;

          // Crear elementos HTML de la tarjeta
          const card = document.createElement('div');
          card.classList.add('card', 'text-white', 'bg-dark');

          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body', 'card-body-news');

          const tituloElement = document.createElement('h5');
          tituloElement.classList.add('card-title');
          tituloElement.textContent = titulo;

          const iframe = document.createElement('iframe');
          iframe.classList.add('embed-responsive-item');
          iframe.src = videoUrl;
          iframe.allowFullscreen = true;

          const cardText = document.createElement('p');
          cardText.classList.add('card-text', 'text-white');
          cardText.textContent = trailer.snippet.description;

          // Construir la estructura de la tarjeta
          cardBody.appendChild(tituloElement);
          cardBody.appendChild(cardText);
          cardBody.appendChild(iframe);
          card.appendChild(cardBody);
          row.appendChild(card);
        });
      }, 500);
    })
    .catch(error => {
      console.error(error);
    });
}

// spinner de carga
function spinner(resultado) {
  if (resultado) {
    resultado.innerHTML = '';
    let spinner = document.createElement('div');
    spinner.classList.add('d-flex', 'justify-content-center', 'spinner', 'w-100');
    spinner.innerHTML = `
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    resultado.append(spinner);
  }
};

//salvavidas
function salvaVidas() {
  resultElement.innerHTML = "<p>Lo sentimos, no hemos encontrado los resultados de su busqueda.</p>"
}

//funciones
window.addEventListener('DOMContentLoaded', getLocalStorage);
btn();
btnKey();
setEventListeners();