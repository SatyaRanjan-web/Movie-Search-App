// app.js - handles searching and rendering results
const apiKey = window.OMDB_API_KEY;

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const empty = document.getElementById('empty');
const darkToggle = document.getElementById('darkToggle');

function setTheme(theme){
  if(theme === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
  localStorage.setItem('theme', theme);
}
(function(){
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
})();
darkToggle.addEventListener('click', ()=> {
  const cur = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  setTheme(cur === 'light' ? 'dark' : 'light');
});

searchBtn.addEventListener('click', searchMovie);
searchInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter') searchMovie(); });

async function searchMovie(){
  const q = searchInput.value.trim();
  results.innerHTML = '';
  if(!q){ empty.classList.remove('hidden'); return; } else empty.classList.add('hidden');
  showLoading();
  try{
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(q)}&type=movie`);
    const data = await res.json();
    hideLoading();
    if(data.Response === 'False'){ results.innerHTML = `<div class="empty"><p>No results for "${q}"</p></div>`; return; }
    renderMovies(data.Search);
  }catch(err){
    hideLoading();
    results.innerHTML = `<div class="empty"><p>Error fetching data — check network.</p></div>`;
    console.error(err);
  }
}

function showLoading(){
  results.innerHTML = `<div class="empty"><p>Searching...</p></div>`;
}

function hideLoading(){ /* no-op for now */ }

function renderMovies(list){
  results.innerHTML = '';
  list.forEach(movie => {
    const poster = (movie.Poster && movie.Poster !== 'N/A')
      ? movie.Poster
      : `https://img.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <a href="details.html?imdbID=${movie.imdbID}" title="${escapeHtml(movie.Title)}">
        <img class="poster" loading="lazy" src="${poster}" alt="${escapeHtml(movie.Title)} poster" />
      </a>
      <div class="title">${escapeHtml(movie.Title)}</div>
      <div class="smallmeta"><span class="year">${movie.Year}</span></div>
      <div style="margin-top:8px;">
        <a class="btn" href="details.html?imdbID=${movie.imdbID}">Details</a>
        <a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer')}">Watch Trailer</a>
      </div>
    `;
    results.appendChild(card);
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }
