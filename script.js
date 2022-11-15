//  http://www.omdbapi.com/?i=tt3896198&apikey=a20dd46e
// : http://www.omdbapi.com/apikey.aspx?VERIFYKEY=ecbf0504-dfe7-4cd4-9bd8-f659824b1ae4
// https://www.omdbapi.com/?t=avenger&apikey=a20dd46e
// https://www.omdbapi.com/?s=thor&apikey=a20dd46e

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.querySelector(".result-grid");
const btnFavorites = document.querySelector(".favorites");

let favBtn,
  favoriteMovieAry = [];

// Add favorite movie data into local storage

const setData = function (fav) {
  localStorage.setItem("fav", JSON.stringify(fav));
};

const getData = function () {
  const data = JSON.parse(localStorage.getItem("fav"));
  favoriteMovieAry.push(data);
};
getData();

// load movie from API

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=a20dd46e`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data);
  if (data.Response === "True") displayMovieList(data.Search); //console.log(data.Search);
}

// loadMovies("thor");

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  //   console.log(searchTerm);
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}
// findMovies();

// display movie list
function displayMovieList(movies) {
  searchList.innerHTML = "";

  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster !== "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.";

    movieListItem.innerHTML = `
              <div class="search-item-thumbnail">
                <img
                  src="${moviePoster}"
                  alt=""
                  srcset=""
                />
              </div>
              <div class="search-item-info">
              <h3>${movies[idx].Title}</h3>
              <p>${movies[idx].Year}</p>
              </div>
              `;
    searchList.appendChild(movieListItem);
  }
  loadMoviesDetails();
}

// load movies
function loadMoviesDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        ` http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a20dd46e`
      );
      const movieDetails = await result.json();
      //   console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

// display main UI

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
            <div class="movie-poster" id="result-grid">
              <img
                src="${
                  details.Poster !== "N/A"
                    ? details.Poster
                    : "image_not_found.png"
                }"
                alt="movie-poster"
                srcset=""
              />
            </div>
            <div class="movie-info">
              <h3 class="movie-title">${details.Title}</h3>
              <ul class="movie-misc-info">
                <li class="year">Year : ${details.Year}</li>
                <li class="rated">Rating : ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
              </ul>
              <p class="genre"><b>Genre:</b>${details.Genre}</p>
              <p class="writer"><b>Writer:</b>${details.Writer}</p>
              <p class="actors">
                <b>Actors :</b> ${details.Actors}
              </p>
              <p class="plot">
                <b>Plot :${details.Plot}</b> 
              </p>
              <p class="language"><b>language : </b> ${details.Language}</p>
              <p class="awards">
                <b><i class="fas fa-award"></i></b>
               ${details.Awards}
              </p>
            <button class="favorite" ><i class="fa-solid fa-heart"></i> Favorite</button>
            </div>

    `;

  favBtn = document.querySelector(".favorite");
  favBtn.addEventListener("click", function () {
    if (!favBtn.classList.contains("active")) {
      addToFavorite(details);
    } else {
      removeFromFavorite(details);
    }
  });
}

// add and remove from favorites
const addToFavorite = function (detail) {
  favBtn.classList.add("active");
  favoriteMovieAry.push(detail);
  console.log("active");
};

const removeFromFavorite = function (detail) {
  favBtn.classList.remove("active");
  const index = favoriteMovieAry.findIndex((mov) => detail.Title === mov.Title);
  favoriteMovieAry.splice(index, 1);
};
