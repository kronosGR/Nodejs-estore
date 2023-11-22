const API_URL = 'http://localhost:3000';
const API_LOGIN_URL = API_URL + '/auth/login';

$(document).ready(function () {
  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    logout();
  });
});

function showToast(title, message) {
  $('#toast-title').text(title);
  $('#toast-body').text(message);
  $('.toast').toast('show');
}

function isAdmin() {
  const token = sessionStorage.getItem('token');
  if (!token) window.location.href = API_URL;
}

function logout() {
  sessionStorage.removeItem('token');
  window.location.href = API_URL;
}
