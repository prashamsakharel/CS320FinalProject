// Constants and Variables
const totalImages = 20;
let currentImageIndex = Math.floor(Math.random() * totalImages) + 1;
let slideshowInterval;

const mainQuoteContainer = document.querySelector(".main-quote");
const nextButton = document.querySelector(".next-button");
const favoriteStar = document.getElementById("favorite-star");
const instagramIcon = document.getElementById("instagram-icon");
const savedQuoteContainer = document.querySelector(".saved-quote-container");
const sharedInstagramContainer = document.getElementById("shared-instagram");
const savedQuotesContainer = document.getElementById("saved-quotes");
const previewContainer = document.getElementById("quote-preview");
const previewImg = document.getElementById("quote-preview-img");
const previewClose = document.getElementById("quote-preview-close");

let instagramShareCount =
  JSON.parse(localStorage.getItem("instagramShareCount")) || 0;
let savedImages = new Map(
  JSON.parse(localStorage.getItem("savedQuotes")) || []
);
let sharedToInstagram =
  JSON.parse(localStorage.getItem("sharedToInstagram")) || [];

// Load Saved Data and Initialize on Page Load
window.addEventListener("load", () => {
  renderSavedQuotes();
  renderSharedToInstagram();
  updateMainImage();
  startSlideshow();
});

// Save Data to localStorage
function updateLocalStorage() {
  localStorage.setItem(
    "savedQuotes",
    JSON.stringify(Array.from(savedImages.entries()))
  );
  localStorage.setItem(
    "instagramShareCount",
    JSON.stringify(instagramShareCount)
  );
  localStorage.setItem("sharedToInstagram", JSON.stringify(sharedToInstagram));
}

// Rendering Saved Quotes
function renderSavedQuotes() {
  savedQuoteContainer.innerHTML = ""; // Clear main saved quotes
  savedQuotesContainer.innerHTML = ""; // Clear secondary saved quotes
  savedImages.forEach((value, key) => {
    const savedItem = createSavedQuoteItem(key, value);
    savedQuoteContainer.appendChild(savedItem); // Add to main container
    savedQuotesContainer.appendChild(savedItem.cloneNode(true)); // Add to secondary container
  });
}

// Rendering Shared to Instagram
function renderSharedToInstagram() {
  sharedInstagramContainer.innerHTML = ""; // Clear existing shared quotes
  sharedToInstagram.forEach(([imageIndex, imageUrl]) => {
    const sharedItem = createQuoteItem(imageUrl, showQuotePreview);
    sharedInstagramContainer.appendChild(sharedItem);
  });
}

// Create Saved Quote Item
function createSavedQuoteItem(imageIndex, imageUrl) {
  const savedItem = document.createElement("div");
  savedItem.className = "saved-quote-items";
  savedItem.style.backgroundImage = `url('${imageUrl}')`;
  savedItem.style.backgroundSize = "cover";
  savedItem.style.backgroundPosition = "center";
  savedItem.addEventListener("click", () => {
    replaceMainQuote(imageIndex);
  });
  return savedItem;
}

// Create Generic Quote Item
function createQuoteItem(imageUrl, clickHandler) {
  const quoteItem = document.createElement("div");
  quoteItem.className = "saved-quote-items";
  quoteItem.style.backgroundImage = `url('${imageUrl}')`;
  quoteItem.style.backgroundSize = "cover";
  quoteItem.style.backgroundPosition = "center";
  quoteItem.addEventListener("click", () => clickHandler(imageUrl));
  return quoteItem;
}

// Replace the main quote with a saved quote when clicked
function replaceMainQuote(imageIndex) {
  currentImageIndex = imageIndex; // Update the current image index
  updateMainImage(); // Update the main image display
  stopSlideshow(); // Stop the slideshow
}

// Update Main Image
function updateMainImage() {
  mainQuoteContainer.style.backgroundImage = `url('./sources/img${currentImageIndex}.jpg')`;
  mainQuoteContainer.style.backgroundSize = "cover";
  mainQuoteContainer.style.backgroundPosition = "center";

  // Update Favorite Icon
  if (savedImages.has(currentImageIndex)) {
    favoriteStar.src = "./sources/star-8-128.png"; // Filled Star
  } else {
    favoriteStar.src = "./sources/outline-star-128.png"; // Outlined Star
  }
}

// Save to Favorites or Remove when clicked on the Favorite Icon
function toggleFavorite() {
  if (savedImages.has(currentImageIndex)) {
    // Remove from favorites
    savedImages.delete(currentImageIndex);
  } else {
    // Add to favorites
    savedImages.set(currentImageIndex, `./sources/img${currentImageIndex}.jpg`);
  }

  updateLocalStorage();
  renderSavedQuotes();
  updateMainImage(); // Refresh favorite icon
}

// Simulate Instagram Sharing
instagramIcon.addEventListener("click", () => {
  instagramShareCount++;
  sharedToInstagram.push([
    currentImageIndex,
    `./sources/img${currentImageIndex}.jpg`,
  ]); // Add current image to shared list
  alert("Shared on Instagram!");
  updateLocalStorage();
  renderSharedToInstagram(); // Update shared items
});

// Show Quote Preview
function showQuotePreview(imageUrl) {
  previewImg.src = imageUrl;
  previewContainer.style.display = "flex";
}

// Close Preview
previewClose.addEventListener("click", () => {
  previewContainer.style.display = "none";
});

// Load a Random Image
function loadRandomImage() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * totalImages) + 1;
  } while (newIndex === currentImageIndex);

  currentImageIndex = newIndex;
  updateMainImage();
}

// Start Slideshow
function startSlideshow() {
  if (!slideshowInterval) {
    slideshowInterval = setInterval(loadRandomImage, 60000); // Change image every 1 minute
  }
}

// Stop Slideshow
function stopSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
}

// Event Listeners
nextButton.addEventListener("click", () => {
  loadRandomImage();
  startSlideshow(); // Resume slideshow when Next Quote is clicked
});
favoriteStar.addEventListener("click", toggleFavorite);

// Initialize Slideshow
updateMainImage();
startSlideshow();
