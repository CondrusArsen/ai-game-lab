const listContainer = document.getElementById("movie-list");
const featuredContainer = document.getElementById("featured-list");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const sortSelect = document.getElementById("sort-select");
const resultCount = document.getElementById("result-count");
const toggleButton = document.getElementById("theme-toggle");

const isFilmPage = location.pathname.includes("films.html");
const isSeriesPage = location.pathname.includes("series.html");
const currentType = isFilmPage ? "film" : isSeriesPage ? "series" : null;

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDetailsUrl(movie) {
  return `details.html?id=${createSlug(movie.title)}&type=${movie.type}`;
}

function formatType(type) {
  return type === "film" ? "Movie" : "Series";
}

function getAllGenres(items) {
  return [...new Set(items.flatMap(movie => movie.genres))].sort();
}

function getSortedMovies(items, sortValue) {
  const sorted = [...items];

  if (sortValue === "kp-desc") {
    return sorted.sort((a, b) => b.kpRating - a.kpRating);
  }

  if (sortValue === "year-desc") {
    return sorted.sort((a, b) => b.year - a.year);
  }

  if (sortValue === "title-asc") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted.sort((a, b) => b.myRating - a.myRating);
}

function createMovieCard(movie, index = 0) {
  const card = document.createElement("article");
  card.className = "movie-card";
  card.style.setProperty("--delay", `${Math.min(index * 45, 360)}ms`);

  const genres = movie.genres.map(genre => `<span>${genre}</span>`).join("");

  card.innerHTML = `
    <a class="card-link" href="${getDetailsUrl(movie)}" aria-label="Open details for ${movie.title}">
      <div class="poster-wrap">
        <img src="assets/img/${movie.image}" alt="${movie.title} poster" loading="lazy">
        <span class="rating-badge">${movie.myRating}/10</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span>${formatType(movie.type)}</span>
          <span>${movie.year}</span>
        </div>
        <h2>${movie.title}</h2>
        <div class="genre-tags">${genres}</div>
        <p>${movie.description}</p>
        <div class="card-footer">
          <span>External ${movie.kpRating}</span>
          <span class="details-link">View details</span>
        </div>
      </div>
    </a>
  `;

  return card;
}

function renderStats() {
  const totalCount = document.getElementById("total-count");
  const movieCount = document.getElementById("movie-count");
  const seriesCount = document.getElementById("series-count");
  const topRating = document.getElementById("top-rating");

  if (!totalCount || !movieCount || !seriesCount || !topRating) {
    return;
  }

  totalCount.textContent = movies.length;
  movieCount.textContent = movies.filter(movie => movie.type === "film").length;
  seriesCount.textContent = movies.filter(movie => movie.type === "series").length;
  topRating.textContent = Math.max(...movies.map(movie => movie.myRating));
}

function renderFeatured() {
  if (!featuredContainer) {
    return;
  }

  const featured = getSortedMovies(movies, "rating-desc").slice(0, 3);
  featuredContainer.innerHTML = "";
  featured.forEach((movie, index) => featuredContainer.appendChild(createMovieCard(movie, index)));
}

function setupFilters(items) {
  if (!genreFilter) {
    return;
  }

  getAllGenres(items).forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

function getVisibleMovies(items) {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedGenre = genreFilter ? genreFilter.value : "all";
  const sortValue = sortSelect ? sortSelect.value : "rating-desc";

  const filtered = items.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchValue);
    const matchesGenre = selectedGenre === "all" || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return getSortedMovies(filtered, sortValue);
}

function renderList() {
  if (!listContainer || !currentType) {
    return;
  }

  const source = movies.filter(movie => movie.type === currentType);
  const visibleMovies = getVisibleMovies(source);

  listContainer.innerHTML = "";

  if (resultCount) {
    const label = currentType === "film" ? "movies" : "series";
    resultCount.textContent = `${visibleMovies.length} ${label} shown`;
  }

  if (visibleMovies.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <h2>No titles found</h2>
        <p>Try another search request or choose a different genre.</p>
      </div>
    `;
    return;
  }

  visibleMovies.forEach((movie, index) => {
    listContainer.appendChild(createMovieCard(movie, index));
  });
}

function setupTheme() {
  if (!toggleButton) {
    return;
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  toggleButton.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    toggleButton.textContent = theme === "dark" ? "Light" : "Dark";
  });
}

if (currentType) {
  const source = movies.filter(movie => movie.type === currentType);
  setupFilters(source);
  renderList();

  [searchInput, genreFilter, sortSelect].forEach(control => {
    if (control) {
      control.addEventListener("input", renderList);
      control.addEventListener("change", renderList);
    }
  });
}

renderStats();
renderFeatured();
setupTheme();
