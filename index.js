const moviesContainer = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const sortSelect = document.getElementById("sortSelect");
const randomBtn = document.getElementById("randomBtn");

let allMovies = [];
let favoriteMovies = [];

async function fetchMovies(query = "batman") {
  try {
    const response = await fetch(BASE_URL + "?apikey=" + API_KEY + "&s=" + query);
    const data = await response.json();

    if (data.Response === "True") {
      allMovies = data.Search;
      displayMovies(allMovies);
    } else {
      moviesContainer.innerHTML = "<p>No movies found</p>";
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(function(movie) {
    let poster;

    if (movie.Poster !== "N/A") {
      poster = movie.Poster;
    } else {
      poster = "https://upload.wikimedia.org/wikipedia/commons/6/64/Poster_not_available.jpg";
    }

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${poster}" />
      <div class="movie-info">
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-rating">${movie.Year}</div>
        <button class="fav-btn">Add to Favorites</button>
      </div>
    `;

    const favButton = card.querySelector(".fav-btn");

    favButton.addEventListener("click", function() {
      addToFavorites(movie);
    });

    moviesContainer.appendChild(card);
  });
}

// Add to favorites
function addToFavorites(movie) {
  let exists = false;

  favoriteMovies.forEach(function(fav) {
    if (fav.imdbID === movie.imdbID) {
      exists = true;
    }
  });

  if (!exists) {
    favoriteMovies.push(movie);
    alert("Added to favorites");
  } else {
    alert("Already in favorites");
  }
}

// Search movies
searchInput.addEventListener("input", function(event) {
  const query = event.target.value.trim();

  if (query.length > 2) {
    fetchMovies(query);
  } else if (query.length === 0) {
    fetchMovies();
  }
});

// Filter by year
genreSelect.addEventListener("change", function() {
  const selectedYear = genreSelect.value;

  if (selectedYear === "") {
    displayMovies(allMovies);
  } else {
    const filteredMovies = allMovies.filter(function(movie) {
      return movie.Year === selectedYear;
    });

    displayMovies(filteredMovies);
  }
});

// Sort movies
sortSelect.addEventListener("change", function() {
  let sortedMovies = [...allMovies];

  if (sortSelect.value === "date") {
    sortedMovies.sort(function(a, b) {
      return parseInt(b.Year) - parseInt(a.Year);
    });
  }

  displayMovies(sortedMovies);
});

// Random movie
randomBtn.addEventListener("click", function() {
  if (allMovies.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * allMovies.length);
  const randomMovie = allMovies[randomIndex];

  displayMovies([randomMovie]);
});

fetchMovies();