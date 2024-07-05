import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let page = 1;
const perPage = 40;
let searchQuery = '';

const API_KEY = '44796610-199f31a4ab0c11e14848311c2';
const API_URL = 'https://pixabay.com/api/';

searchForm.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  event.currentTarget.elements.searchQuery.value = '';
  //   console.log(searchQuery);
  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  btnLoadMore.style.display = 'none';
  await fetchImages();
}

async function fetchImages() {
  try {
    const res = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    // console.log(res);
    if (res.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    markupImages(res.data.hits);
    Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    btnLoadMore.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
}

function markupImages(images) {
  //   console.log(images);
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes</b> ${likes}</p>
        <p class="info-item"><b>Views</b> ${views}</p>
        <p class="info-item"><b>Comments</b> ${comments}</p>
        <p class="info-item"><b>Downloads</b> ${downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

async function onLoadMore() {
  page += 1;
  await fetchImages();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
