// declaración
const inputElement = document.getElementById('inputBusqueda');
const buttonSearch = document.getElementById('buscar');
const resultElement = document.getElementById('resultado');
const APIkey = '7f2dd986';
const APIGoogle = 'AIzaSyAYW3g3NRld4PtVL4Bmz04tueXbASg8o-g';

// localStorage
if (!localStorage.getItem("search_value")) {
  btn();
} else {
  value = localStorage.getItem("search_value");
  apiCall(value);
}

// API call
function apiCall(value) {
  let page = 1;
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
  resultado.innerHTML = '';
  let spinner = document.createElement('div');
  spinner.classList.add('d-flex', 'justify-content-center', 'spinner', 'w-100');
  spinner.innerHTML = `
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  resultado.append(spinner);
};

// crea una card con los datos de la busqueda
function setData(data) {
  data.Search.forEach(movie => {
    console.log(movie)
    let div = document.createElement("div");
    div.classList.add('col');
    resultElement.appendChild(div);
    div.innerHTML = `
      <div class="card mb-3 h-100">
        <div class="row g-0 h-100">
          <div class="col-md-6 h-100 imagen"></div>
          <div class="col-md-6">
            <div class="card-body">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">${movie.Year}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    let divImagen = div.querySelector('.imagen');
    spinner(divImagen);
    createImage(movie, divImagen);
  });
}

function createImage(movie, div) {
  let img = document.createElement('img');
  img.classList.add('rounded-start', 'h-100');
  img.alt = `Poster de ${movie.Title}`;
  img.src= `${movie.Poster}`;
  div.innerHTML = '';
  div.append(img);
}

/*
// API weather
function setInfo(data) {
  console.log('data cruda:', data);

  const
    name = data.name,
    temp = data.main.temp.toFixed(1),
    tempMax = data.main.temp_max.toFixed(1),
    temMin = data.main.temp_min.toFixed(1),
    humedad = data.main.humidity,
    st = data.main.feels_like,
    pa = data.main.pressure,
    wind = (data.wind.speed * 3.6).toFixed(1),
    lat = data.coord.lat,
    lon = data.coord.lon,
    day = data.weather[0].icon.at(-1);
  ;

  let dayname = "";
  if (day == "d") {
    dayname = "Día"
  } else if (day == "n") {
    dayname = "Noche"
  }

  document.querySelector(".card")?.remove();
  let div = document.createElement("div");
  div.classList.add("card", "mb-3");
  resultElement.appendChild(div);
  div.innerHTML = `
    <div class="row mobile g-0">
      <div id="carouselExample" class="col-md-4 carousel slide carousel-fade">
        <div class="carousel-inner img">
        </div>
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h2 class="card-title badge bg-primary rounded-pill p-3">${name}</h2>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">${dayname}</li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Temperatura: 
            <div class="temps">
              <span class="badge bg-s rounded-pill p-2">${temMin} °C</span>
              <span class="badge bg-primary rounded-pill p-2">${temp} °C</span>
              <span class="badge bg-s rounded-pill p-2">${tempMax} °C</span>
            </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Humedad: <span class="badge bg-primary rounded-pill p-2">${humedad} %</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Sensación Térmica: <span class="badge bg-primary rounded-pill p-2">${st} °C</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Presión Atmosférica: <span class="badge bg-primary rounded-pill p-2">${pa} hPa</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Viento: <span class="badge bg-primary rounded-pill p-2">${wind} km/h</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Latitud:<span class="badge bg-primary rounded-pill p-2">${lat}</span></li>
            <li class="list-group-item d-flex justify-content-between align-items-center fw-semibold">Longitud: <span class="badge bg-primary rounded-pill p-2">${lon}</span></li>
          </ul>
        </div>
      </div>
      <div class="col-8 m-auto">
        <div class="line"></div>
      </div>
      <div class="col-12">
        <div class="map"></div>
      </div>
  `;

  let img = document.querySelector('.img');
  spinner(img);
};

// API maps
function map(name, coord) {
  let map = document.querySelector('.map');
  let iframe = document.createElement('iframe');
  map.append(iframe);
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=${APIGoogle}&q=${name}&center=${coord.lat}, ${coord.lon}`;
};

// imagen
function slider(image) {
  let photos = image.photos;
  const photo = image.photos[0];
  console.log(photos)

  let slider = document.querySelector('.img');
  slider.innerHTML = '';
  
  photos.forEach(pic => {
    let img = document.createElement('div');

    if (pic != photo) {
      img.classList.add('carousel-item', 'img-secondary',);
      img.innerHTML = `
        <img src="${pic.src.large}" class="d-block w-100 imagen" alt="imagen de ${pic.alt}">
      `;
    } else {
      img.classList.add('carousel-item', 'img-active', 'active');
      img.innerHTML = `
       <img src="${photo.src.large}" class="d-block w-100 imagen" alt="imagen de ${photo.alt}}">
      `;
    }

    slider.append(img);
    slider.innerHTML += `
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    `;
  });
}
*/

// salvavidas
function salvaVidas() {
  resultElement.innerHTML = "<p>Lo siento, no hemos encontrado resultados de su busqueda.</p>"
}

// llamado funciones
btn();
btnKey();