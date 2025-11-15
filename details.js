// details.js - fetches full movie data using imdbID from query string
const apiKey = window.OMDB_API_KEY;
const params = new URLSearchParams(location.search);
const id = params.get('imdbID');
const container = document.getElementById('detail');

const darkToggle2 = document.getElementById('darkToggle2');
darkToggle2 && darkToggle2.addEventListener('click', ()=> {
  const cur = document.documentElement.classList.contains('light') ? 'light' : 'dark';
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('light', next === 'light');
  localStorage.setItem('theme', next);
});

(function(){
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('light', saved === 'light');
})();

if(!id){
  container.innerHTML = `<div class="empty"><p>Missing imdbID in URL.</p></div>`;
} else {
  fetchDetails(id);
}

async function fetchDetails(imdbID){
  container.innerHTML = `<div class="empty"><p>Loading details...</p></div>`;
  try{
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(imdbID)}&plot=full`);
    const data = await res.json();
    if(data.Response === 'False'){ container.innerHTML = `<div class="empty"><p>Movie not found.</p></div>`; return; }
    renderDetails(data);
  }catch(err){
    console.error(err);
    container.innerHTML = `<div class="empty"><p>Error fetching details.</p></div>`;
  }
}

function renderDetails(m){
  const poster = (m.Poster && m.Poster !== 'N/A') ? m.Poster : `https://img.omdbapi.com/?apikey=${apiKey}&i=${m.imdbID}`;
  container.innerHTML = `
    <div class="card" style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
      <div style="min-width:220px; max-width:320px;">
        <img class="poster" src="${poster}" alt="${escapeHtml(m.Title)} poster" />
      </div>
      <div style="flex:1; min-width:260px">
        <h2 style="margin:0 0 6px 0">${escapeHtml(m.Title)} <span class="year">(${m.Year})</span></h2>
        <div class="smallmeta"><strong>Genre:</strong> ${escapeHtml(m.Genre)} · <strong>Runtime:</strong> ${escapeHtml(m.Runtime)}</div>
        <p style="margin-top:12px">${escapeHtml(m.Plot)}</p>

        <ul style="margin-top:12px; line-height:1.5;">
          <li><strong>Director:</strong> ${escapeHtml(m.Director)}</li>
          <li><strong>Actors:</strong> ${escapeHtml(m.Actors)}</li>
          <li><strong>Language:</strong> ${escapeHtml(m.Language)}</li>
          <li><strong>IMDB Rating:</strong> ${escapeHtml(m.imdbRating)} / 10</li>
        </ul>

        <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap">
          <a class="btn primary" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m.Title + ' trailer')}">Watch Trailer</a>
          <a class="btn" target="_blank" rel="noopener" href="https://www.imdb.com/title/${encodeURIComponent(m.imdbID)}">Open on IMDb</a>
        </div>
      </div>
    </div>
  `;
}

/* small helper */
function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }
