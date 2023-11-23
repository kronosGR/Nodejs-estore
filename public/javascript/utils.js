const API_URL = 'http://localhost:3000';
const API_LOGIN_URL = API_URL + '/auth/login';
const API_BRAND_URL = API_URL + '/brands';
const API_CATEGORY_URL = API_URL + '/categories';

function showToast(title, message) {
  $('#toast-title').text(title);
  $('#toast-body').text(message);
  $('.toast').toast('show');
}

function hideSpinner() {
  $('#spinner').hide();
}

function showSpinner() {
  $('#spinner').show();
}

function emptyContainer(selector) {
  $(selector).empty();
}

function hideModal(selector) {
  $(selector).modal('hide');
}
function showModal(selector) {
  $(selector).modal('show');
}
