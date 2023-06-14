let db;

function init(){
  db = new Dexie("movies-channel");

  db.version(1).stores({ movies: '++_id, poster, title, year, imdbID'});
  db.open()
    .then(() => {})
    .catch(error => console.log(error))
};

async function saveData(movie){
  try{
    await db.movies.add(movie);
  } catch(error){
    console.log(error);
  }
};

async function getData(){
  try{
    return await db.movies.toArray();
  } catch(error){
    console.log(error);
  }
};

async function getMovie(id){
  try{
    return await db.movies.where('imdbID').equals(id).first();
  } catch(error){
    console.log(error);
  }
};

async function deleteFav(id){
  try{
    const movieID = await getMovie(id);
    if(movieID){
      await db.movies.delete(movieID._id)
    }
  } catch(error){
    console.log(error);
  }
};

init();