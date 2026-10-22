function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDetailsUrl(movie) {
  return `details.html?id=${createSlug(movie.title)}&type=${movie.type}`;
}

function getListUrl(type) {
  return type === "series" ? "series.html" : "films.html";
}

function formatType(type) {
  return type === "film" ? "Movie" : "Series";
}

function renderInfoItem(label, value) {
  if (!value || value === "-") {
    return "";
  }

  return `
    <div class="info-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

const movieId = getQueryParam("id");
const typeParam = getQueryParam("type");
const detailsContainer = document.getElementById("details");

if (detailsContainer) {
  const currentType = typeParam || null;
  const filteredMovies = currentType ? movies.filter(movie => movie.type === currentType) : movies;
  const index = filteredMovies.findIndex(movie => {
    return createSlug(movie.title) === movieId || movie.title === movieId;
  });
  const movie = filteredMovies[index];

  if (movie) {
    document.title = `${movie.title} | Mini Movie Journal`;

    const prev = index > 0 ? filteredMovies[index - 1] : null;
    const next = index < filteredMovies.length - 1 ? filteredMovies[index + 1] : null;
    const genres = movie.genres.map(genre => `<span>${genre}</span>`).join("");

    detailsContainer.innerHTML = `
      <a class="back-link" href="${getListUrl(movie.type)}">Back to ${formatType(movie.type).toLowerCase()}s</a>
      <article class="movie-full">
        <div class="details-poster">
          <img src="assets/img/${movie.image}" alt="${movie.title} poster">
          <div class="details-ratings">
            <span>My rating <strong>${movie.myRating}/10</strong></span>
            <span>External <strong>${movie.kpRating}</strong></span>
          </div>
        </div>
        <div class="details-text">
          <div class="card-meta">
            <span>${formatType(movie.type)}</span>
            <span>${movie.year}</span>
          </div>
          <h1>${movie.title}</h1>
          ${movie.slogan ? `<p class="slogan">"${movie.slogan}"</p>` : ""}
          <div class="genre-tags">${genres}</div>
          <p class="description">${movie.description}</p>

          <div class="info-grid">
            ${renderInfoItem("Director", movie.director)}
            ${renderInfoItem("Writer", movie.writer)}
            ${renderInfoItem("Composer", movie.composer)}
            ${renderInfoItem("Country", movie.country)}
            ${renderInfoItem("Duration", movie.duration)}
            ${renderInfoItem("Release date", movie.releaseDate)}
            ${renderInfoItem("Budget", movie.budget)}
            ${renderInfoItem("Actors", movie.actors.join(", "))}
          </div>

          ${movie.fact ? `
            <aside class="fact">
              <span>Interesting fact</span>
              <p>${movie.fact}</p>
            </aside>
          ` : ""}

          <div class="nav-buttons">
            ${prev ? `<a href="${getDetailsUrl(prev)}">Previous: ${prev.title}</a>` : ""}
            ${next ? `<a href="${getDetailsUrl(next)}">Next: ${next.title}</a>` : ""}
          </div>
        </div>
      </article>
    `;
  } else {
    detailsContainer.innerHTML = `
      <div class="empty-state">
        <h1>Title not found</h1>
        <p>The movie or series may have been renamed, moved, or removed from the collection.</p>
        <a class="btn" href="index.html">Return home</a>
      </div>
    `;
  }
}
