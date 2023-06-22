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
function getLocalStorage() {
  spinner(resultElement);
  setTimeout(() => {
    if (!localStorage.getItem("search_value")) {
      start();
    } else {
      value = localStorage.getItem("search_value");
      apiCall(value);
    }
  }, 500)
}

// home
function start(){
  resultElement.innerHTML = '';
  const imageFigure = document.createElement('figure');
  imageFigure.classList.add('home-figure-img');
  const homeImage = document.createElement('img');
  homeImage.classList.add('home-img');
  homeImage.src = '../img/home2.jpg';
  homeImage.alt = 'Imagen de un cine';
  imageFigure.appendChild(homeImage);
  resultElement.appendChild(imageFigure);
}

// search btn
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

// search enter
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


// API movies - card
async function apiCall(value) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${APIkey}&s=${value}&page=1&type="movie"`);
    const data = await response.json();

    resultElement.innerHTML = '';
    setData(data.Search);
  } catch (error) {
    console.log(`Hubo un error: ${error}`);
    salvaVidas();
  }
}

// API imdbID - modal
async function APImovieDetails(id, div) {
  try {
    const resp = await fetch(`https://www.omdbapi.com/?apikey=${APIkey}&i=${id}&page=1&type="movie"`);
    const data = await resp.json();

    modalMovieDetails(data, div);
  } catch (err) {
    console.log(`Hubo un error: ${err}`);
  }
}

// card
function setData(data) {
  const row = document.createElement("div");
  row.classList.add('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4', 'row-cols-xl-5', 'g-3', 'page');
  resultElement.append(row);

  data.forEach(async movie => {
    // indexedDB
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
    cardContent.classList.add('text-transition');
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
    favIcon.classList.add('bi', movieID ? 'bi-heart-fill' : 'bi-heart', 'fs-5', 'fav-btn', 'ms-2', 'card-fav-btn', `heart-modal-${movie.imdbID}`);
    favIcon.dataset.id = movie.imdbID;
    favIcon.dataset.title = movie.Title;
    favIcon.dataset.poster = movie.Poster;
    favIcon.dataset.year = movie.Year;
    favIcon.dataset.type = movie.Type;
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

    let btn = div.querySelector('.btn-details');
    let id = btn.dataset.id;
    APImovieDetails(id, div);
  });
}

// modal
async function modalMovieDetails(data, div) {
  const content = div.querySelector('.modal-content');

  // indexedDB
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
  heartIcon.dataset.id = data.imdbID;
  heartIcon.className = `bi ${movieID ? 'bi-heart-fill' : 'bi-heart'} heart-modal-${data.imdbID} d-block fs-5 ms-2`;

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
  favButton.dataset.id = data.imdbID;
  favButton.dataset.title = data.Title;
  favButton.dataset.poster = data.Poster;
  favButton.dataset.year = data.Year;
  favButton.dataset.type = data.Type;
  favButton.className = 'btn btn-primary w-100 fav-btn modal-fav-btn';
  favButton.textContent = movieID ? 'Quitar de favoritos' : 'Agregar a favoritos';

  // estructura del modal
  modalHeader.append(image, detailsContainer);
  detailsContainer.append(titleElement, genreElement, countryElement, ratingContainer);
  ratingContainer.append(ratingBadge, heartIcon);
  modalHeader.append(closeButton);

  listGroup.append(listItemReparto, listItemDirector, listItemEscritor, listItemDuracion, listItemLanzamiento);

  modalBody.append(plotParagraph, listGroup, trailerContainer);

  modalFooter.appendChild(favButton);

  // agregar elementos al modal
  content.append(modalHeader, modalBody, modalFooter);

  MovieTrailer(data.Title, data.imdbID);
}

// modal - elementos de lista
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



// modal - trailer youtube
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
async function handleFavoriteClick(e) {
  const btnFav = e.target;
  if (!btnFav.classList.contains('fav-btn')) {
    return;
  }

  const id = btnFav.dataset.id || false;
  const title = btnFav.dataset.title || false;
  const poster = btnFav.dataset.poster || false;
  const year = btnFav.dataset.year || false;
  const type = btnFav.dataset.type || false;

  const movie = {
    imdbID: id,
    Title: title,
    Poster: poster,
    Year: year,
    Type: type
  };


  const btn = btnFav.classList.contains('bi') ? 'A' : 'B';

  try {
    const isFavorite = await getMovie(id) ? true : false;
    
    if (!isFavorite) {
      await saveData(movie);
      if (btn === 'A') {
        let hearts = document.querySelectorAll(`.heart-modal-${id}`);
        hearts.forEach(heart => {
          heart.classList.remove('bi-heart');
          heart.classList.add('bi-heart-fill');
        })
        document.querySelector('.modal-fav-btn').innerText = 'Quitar de favoritos';
      } else {
        btnFav.innerText = 'Quitar de favoritos';
        let hearts = document.querySelectorAll(`.heart-modal-${id}`);
        hearts.forEach(heart => {
          heart.classList.remove('bi-heart');
          heart.classList.add('bi-heart-fill');
        })
      }
    } else {
      await deleteFav(movie.imdbID);
      if (btn === 'A') {
        let hearts = document.querySelectorAll(`.heart-modal-${id}`);
        hearts.forEach(heart => {
          heart.classList.remove('bi-heart-fill');
          heart.classList.add('bi-heart');
        })
        document.querySelector('.modal-fav-btn').innerText = 'Agregar a favoritos';
      } else {
        btnFav.innerText = 'Agregar a favoritos';
        let hearts = document.querySelectorAll(`.heart-modal-${id}`);
        hearts.forEach(heart => {
          heart.classList.remove('bi-heart-fill');
          heart.classList.add('bi-heart');
        })
      }
    }
  } catch (error) {
    console.error("Error handling favorite:", error);
  }
}


// favoritos - actualizar seccion
async function actualizarDataFavoritos() {
  spinner(resultElement);

  try {
    // idexedDB
    const favoritos = await getData();

    resultElement.innerHTML = '';
    spinner(resultElement);

    setTimeout(() => {
      if (favoritos.length) {
        resultElement.innerHTML = '<h2 class="w-100 h2 m-0 mb-2">favoritos</h2>';
        setData(favoritos);
      } else {
        resultElement.innerHTML = '<p>Aún no tienes películas favoritas.</p>';
      }
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

// novedades - ultimas peliculas del año
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
    console.error('Error al obtener los trailers:', error);
    throw error;
  }
}

// novedades - video youtube
async function handleClickNovedades() {
  spinner(resultElement);

  try {
    const trailers = await obtenerTrailersUltimasPeliculas();
    setTimeout(() => {
      resultElement.innerHTML = '<h2 class="w-100 h2 m-0 mb-2">descubrí las últimas películas aclamadas por la crítica</h2>';
      const row = document.createElement('div');
      row.classList.add('row', 'row-cols-1', 'row-cols-lg-2', 'g-4', 'news');
      resultElement.appendChild(row);

      trailers.forEach(trailer => {
        const { snippet: { title }, id: { videoId }, snippet: { description } } = trailer;
        const videoUrl = `https://www.youtube.com/embed/${videoId}`;

        const div = document.createElement('div');

        const card = document.createElement('div');
        card.classList.add('card', 'text-white', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'card-body-news');

        const tituloElement = document.createElement('h3');
        tituloElement.classList.add('card-title', 'h3');
        tituloElement.textContent = title;

        const iframe = document.createElement('iframe');
        iframe.classList.add('embed-responsive-item');
        iframe.src = videoUrl;
        iframe.allowFullscreen = true;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text', 'text-white');
        cardText.textContent = description;

        cardBody.append(tituloElement, cardText, iframe);
        card.appendChild(cardBody);
        row.appendChild(div);
        div.appendChild(card);
      });
    }, 500)
  } catch (error) {
    console.error(error);
  }
}

// links
function setEventListeners() {
  const homeLink = document.getElementById('home');
  const favoritosLink = document.getElementById('fav');
  const btnNews = document.getElementById('news');

  homeLink.addEventListener('click', getLocalStorage);
  favoritosLink.addEventListener('click', actualizarDataFavoritos);
  btnNews.addEventListener('click', handleClickNovedades);
  document.addEventListener('click', handleFavoriteClick);
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

// salvavidas
function salvaVidas() {
  resultElement.innerHTML = "<p>Lo sentimos, no hemos encontrado los resultados de su busqueda.</p>"
}

// funciones
window.addEventListener('DOMContentLoaded', getLocalStorage);
btn();
btnKey();
setEventListeners();