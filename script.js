/*
 * script.js
 *
 * This file contains the logic for the Giphy Party application. It listens for
 * form submissions, sends an HTTP request to the Giphy API using Axios,
 * appends returned GIFs to the page, and provides functionality to clear
 * all GIFs from the display. See the README provided with the exercise for
 * additional context and hints on using the Giphy API.
 */

// Replace this with your own Giphy API key. Without a valid key the API will
// return a 401 Unauthorized response. You can register for your own key at
// https://developers.giphy.com/.
const API_KEY = b8eGq1Qe8LEZKGrD2HUvPSi9AC51nHQa ;

// Select the DOM elements we'll interact with.
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-term');
const gifContainer = document.querySelector('#gif-container');
const removeBtn = document.querySelector('#remove-btn');

/**
 * getGifUrl
 * Given a search term, query the Giphy API and return a random GIF URL from
 * the results. If no GIFs are found, the promise resolves to null.
 *
 * @param {string} term The search term.
 * @returns {Promise<string|null>} A promise that resolves to a GIF URL or null.
 */
async function getGifUrl(term) {
  try {
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: API_KEY,
        q: term,
        limit: 25, // Retrieve up to 25 GIFs to choose from
      },
    });

    const gifs = response.data.data;
    if (gifs.length === 0) {
      return null;
    }
    // Pick a random GIF from the returned array
    const randomIndex = Math.floor(Math.random() * gifs.length);
    const gifObj = gifs[randomIndex];
    return gifObj.images.fixed_height.url;
  } catch (error) {
    console.error('Error fetching GIF:', error);
    return null;
  }
}

/**
 * addGifToPage
 * Creates an image element for the provided GIF URL and appends it to
 * the GIF container. If no URL is provided (null), it does nothing.
 *
 * @param {string|null} url The GIF URL returned from the API.
 */
function addGifToPage(url) {
  if (!url) return;
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Giphy GIF';
  gifContainer.appendChild(img);
}

/**
 * handleSearch
 * Handle the form submission. Prevent the default form behaviour,
 * extract the search term, request a GIF URL from the API, and
 * append the resulting GIF to the page.
 *
 * @param {Event} evt The event object.
 */
async function handleSearch(evt) {
  evt.preventDefault();
  const term = searchInput.value.trim();
  if (!term) return;
  const gifUrl = await getGifUrl(term);
  addGifToPage(gifUrl);
  // Clear the input field for the next search
  searchInput.value = '';
}

/**
 * handleRemoveAll
 * Clears all GIFs from the GIF container by setting its innerHTML to
 * an empty string.
 */
function handleRemoveAll() {
  gifContainer.innerHTML = '';
}

// Attach event listeners
searchForm.addEventListener('submit', handleSearch);
removeBtn.addEventListener('click', handleRemoveAll);
