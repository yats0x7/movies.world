const moviesContainer = document.getElementById("moviesContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const randomBtn = document.getElementById("randomBtn");

let allMovies = [];

async function fetchMovies(query = "batman") {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Response === "True") {
      allMovies = data.Search;
      displayMovies(allMovies);
    } else {
      moviesContainer.innerHTML = "<p>No movies found</p>";
    }
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${poster}" />
      <div class="movie-info">
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-rating">${movie.Year}</div>
      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}


randomBtn.addEventListener("click", () => {
  if (allMovies.length === 0) return;

  const randomIndex = Math.floor(Math.random() * allMovies.length);
  displayMovies([allMovies[randomIndex]]);
});


fetchMovies();