const API_URL = 'http://localhost:3000';
const API_LOGIN_URL = API_URL + '/auth/login';
const API_BRAND_URL = API_URL + '/brands';
const API_MEMBERSHIP_URL = API_URL + '/memberships';
const API_CATEGORY_URL = API_URL + '/categories';
const API_ROLE_URL = API_URL + '/roles';
const API_USERS_URL = API_URL + '/users';
const API_PRODUCTS_URL = API_URL + '/products';

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
  $(selector).remove();
}

function showModal(selector) {
  $(selector).modal('show');
}

function getColorClassForRole(role) {
  switch (role) {
    case 'Bronze':
      return 'bronze';
    case 'Silver':
      return 'silver';
    case 'Gold':
      return 'gold';
    default:
      return 'bronze';
  }
}
