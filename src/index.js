
import './style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {searchPhoto } from './api';


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

const searchFormPoto = document.querySelector('#search-form');
const galleryPhoto = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');



searchFormPoto.addEventListener('submit', onSubmitPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);


async function onSubmitPhoto(e) {
    e.preventDefault();
    galleryPhoto.innerHTML = '';
    loadMoreBtn.style.display = 'inline';
    const namePhoto = e.target.elements.searchQuery.value.trim();

    
    try {
        if (!namePhoto) {
            return Notify.failure(
                'Sorry, the search field cannot be empty. Please enter information to search.'
        
            );
        }
        const { data } = await searchPhoto(namePhoto);

        cardPhoto(data);
        messageInfo(data);
        stopSearch(data);
        e.target.reset();
    }
catch(err){console.error('Error:', err);}
}
async function onLoadMore() {
    page += 1;
  
    try {
        const { data } = await searchPhoto(namePhoto, page, perPage);
        cardPhoto(data);
        stopSearch(data);
        smoothScroll();
    }
    catch(err){console.error('Error:', err);}
}

function cardPhoto(arr) {
  const markUp = arr.hits
    .map(el => {
      return `
    <div class="photo-card">
    <a class="gallery-link" href="${el.largeImageURL}">
    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item"><b>Likes</b>${el.likes}
    </p>
    <p class="info-item"><b>Views</b>${el.views}
    </p>
    <p class="info-item"><b>Comments</b>${el.comments}
    </p>
    <p class="info-item"><b>Downloads</b>${el.downloads}
    </p>
    </div>
    </div>`;
    })
    .join('');
  galleryPhoto.insertAdjacentHTML('beforeend', markUp);
  lightbox.refresh();
}

function messageInfo(arr) {
    try {
        if (arr.hits.length === 0) {
            Notify.warning(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        }
        if (arr.totalHits !== 0) {
            Notify.success(`Hooray! We found ${arr.totalHits} images.`);
        }
    }
    catch(err){console.error('Error:', err);}
}
function stopSearch(arr) {
    try {
        if (arr.hits.length < 40 && arr.hits.length > 0) {
            loadMoreBtn.style.display = 'none';
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
        if (arr.hits.length === 40) {
            loadMoreBtn.style.display = 'block';
        }
    }
    catch(err){console.error('Error:', err);}
    
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
galleryPhoto.insertAdjacentHTML(
  'afterbegin',
  `<button id="myBtn" class="myBtn" title="Go UP">UP</button>`
);

window.onscroll = function () {
  scrollFunction();
};
const myBtn = document.getElementById('myBtn');
 myBtn.style.display = 'none';
function scrollFunction() {
  if (document.body.scrollTop > 20|| document.documentElement.scrollTop > 20) {
    myBtn.style.display = 'block';
  } else {
    myBtn.style.display = 'none';
  }
}

myBtn.addEventListener('click', topFunction);

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  
}