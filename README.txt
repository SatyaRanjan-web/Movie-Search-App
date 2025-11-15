Movie Search App - CineFind
==========================

Files:
- index.html     : Search UI, results grid, dark-mode toggle.
- details.html   : Movie detail page (uses ?imdbID=tt1234567).
- styles.css     : Styling and responsive rules.
- app.js         : JS for searching and rendering results.
- details.js     : JS for fetching and rendering full movie details.
- README.txt     : This file.
- movie_search_app.zip : Zip package (created for download).

How to run:
1. Unzip movie_search_app.zip or open the folder.
2. Open index.html in your browser (double-click). Because this app uses fetch to a public API, opening the file directly (file://) works in most modern browsers. If you see CORS/network issues, run a simple local server:
   - Python 3: `python -m http.server 8000` then open http://localhost:8000
3. Enter a movie name and hit Search. Click a poster or the Details button to open the details page.

Notes & features:
- The OMDb API key (72403727) is embedded in the client JS for demo convenience. For production, keep keys on a server.
- Posters fall back to the OMDb poster image endpoint when the search result doesn't contain a usable Poster URL.
- Trailer link currently opens YouTube search results for "<movie> trailer".
- Persistent theme stored in localStorage.
- Responsive grid with card hover effect.

If you want:
- A zip with server-side key proxy (to hide the key)
- Embedded trailers when available (requires YouTube API)
- A downloadable build or GitHub-ready project
Tell me which extra you want and I'll update the package.
