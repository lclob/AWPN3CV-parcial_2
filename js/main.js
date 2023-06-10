// declaración
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
const APIkey = '7f2dd986';
const APIGoogle = 'AIzaSyAYW3g3NRld4PtVL4Bmz04tueXbASg8o-g';
const APItmbdb = '3fae9e615d9aaca0a304824bd82082e1'
let page = 1;
let favs = [];

// localStorage
if (!localStorage.getItem("search_value")) {
  btn();
} else {
  value = localStorage.getItem("search_value");
  apiCall(value);
}

// API call
function apiCall(value) {
  fetch(`http://www.omdbapi.com/?apikey=${APIkey}&s=${value}&page=${page}&type="movie"`)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      resultElement.innerHTML = '';
      setData(data);
    })
    .catch(err => {
      console.log(`Hubo un error: ${err}`);
      salvaVidas();
    })
    .finally(() => {
      console.log('ejecuto el finally');
    })
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

// crea un spinner hasta que llega la respuesta de la API
function spinner(resultado) {
  if(resultado){
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

// crea una card con los datos de la busqueda
function setData(data) {
  data.Search.forEach(movie => {
    let div = document.createElement("div");
    div.classList.add('col');
    resultElement.appendChild(div);
    div.innerHTML = `
      <div class="card mb-3 h-100">
        <div class="row g-0 h-100">
          <div class="col-md-6 h-100 imagen">
            <img src="${movie.Poster}" alt="Poster de ${movie.Title}" class="rounded-start h-100"/>
          </div>
          <div class="col-md-6">
            <div class="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <h2 class="card-title fw-semibold">${movie.Title}</h2>
                <p class="card-text">${movie.Year}</p>
              </div>
              <button class="btn fw-semibold btn-primary btn-details" data-id="${movie.imdbID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${movie.imdbID}">Ver más!</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="staticBackdrop-${movie.imdbID}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
          </div>
        </div>
      </div>
    `;

    let btn = div.querySelector('.btn-details');
    let id = btn.dataset.id;
    APImovieDetails(id, div);
  });
}

// api call by imdbID
function APImovieDetails(id, div) {
  fetch(`http://www.omdbapi.com/?apikey=${APIkey}&i=${id}&page=${page}&type="movie"`)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      modalMovieDetails(data, div);
    })
    .catch(err => {
      console.log(`Hubo un error: ${err}`);
    })
    .finally(() => {
      console.log('ejecuto el finally');
    })
}

// modal con datos de la pelicula
function modalMovieDetails(data, div) {
  const content = div.querySelector('.modal-content');
  content.innerHTML = `
    <div class="modal-header gap-md-0 gap-2 align-items-start">
      <img src="${data.Poster}" alt="Imagen de ${data.Title}" class="details-image" />
      <div class="px-md-3"> 
        <h3 id="staticBackdropLabel">${data.Title}</h3>
        <small class="d-block mt-1">${data.Country}</small>
        <small class="d-block text-secondary">${data.Genre}</small>
        <span class="badge bg-primary rounded-pill mt-2 rating">${data.imdbRating}</span>
      </div>
      <button type="button" class="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p>${data.Plot}</p>
      <ul class="list-group table-striped mb-2">
        <li class="list-group-item fw-semibold">Reparto: <span class="fw-normal">${data.Actors}</span></li>
        <li class="list-group-item fw-semibold">Director: <span class="fw-normal">${data.Director}</span></li>
        <li class="list-group-item fw-semibold">Escritor: <span class="fw-normal">${data.Writer}</span></li>
        <li class="list-group-item fw-semibold">Duración: <span class="fw-normal">${data.Runtime}</span></li>
        <li class="list-group-item fw-semibold">Lanzamiento: <span class="fw-normal">${data.Released}</span></li>
      </ul>
      <div class="trailer video-container-${data.imdbID} mt-1" class="my-1 rounded"></div>
    </div>
    <div class="modal-footer">
      <button type="button" data-id="${data.imdbID}" class="btn btn-primary w-100 btnFav">Agregar a favoritos</button>
    </div>
  `;

  MovieTrailer(`${data.Title}`, `${data.imdbID}`);
}

// trailer
function MovieTrailer(movie, id) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmFlOWU2MTVkOWFhY2EwYTMwNDgyNGJkODIwODJlMSIsInN1YiI6IjY0ODNhZDY1YmYzMWYyNTA1NzA1YjgwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YM-U9dI8Sffx6sY9_X4J3r_WYGHrrOcQjY-8KJy2vcE'
    }
  };
  
  // API TMDB
  fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&language=en-US&page=1`, options)
    .then(response => response.json())
    .then(response => {
      let videoID = response.results[0]?.id;

      // llamo a la api por id de pelicula para conseguir el id del video
      if(videoID){
        fetch(`https://api.themoviedb.org/3/movie/${response.results[0].id}/videos?language=en-US`, options)
          .then(response => response.json())
          .then(response => {
            let videoKEY = response.results[0]?.key;
            console.log(videoKEY)

            if(videoKEY){
              let videoContainer = document.querySelector(`.video-container-${id}`);
              spinner(videoContainer);

            // Crear elemento de iframe para mostrar el video de YouTube
              let iframeElement = document.createElement('iframe');
              iframeElement.src = `https://www.youtube.com/embed/${videoKEY}`;
              iframeElement.allowFullscreen = true;
              iframeElement.width = '100%';
              iframeElement.height = '100%';
              
              // Limpiar cualquier contenido previo dentro del contenedor
              videoContainer.innerHTML = `
                <span class="h5 mt-4 mb-2 d-block">Trailer</span>
              `;
              videoContainer.appendChild(iframeElement);
            }
          })
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
}


//salvavidas
function salvaVidas() {
  resultElement.innerHTML = "<p>Lo sentimos, no hemos encontrado los resultados de su busqueda.</p>"
}

//funciones
btn();
btnKey();