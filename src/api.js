import axios from 'axios';
const KEY = '39088067-91f94ac6bb1312b7445b3cdf9';
const restAPI = '&image_type=photo&orientation=horizontal&safesearch=true';
let page = 1;
let namePhoto = ' ';
const perPage = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';


async function searchPhoto(namePhoto, page = 1, perPage = 40) {
  const response = await axios(
    `?key=${KEY}&q=${namePhoto}${restAPI}&page=${page}&per_page=${perPage}`
  );
  return response;
}
export { searchPhoto };