let roles;
let memberships;

$(document).ready(async function () {
  await getUsers();
  await getRoles();
  await getMemberships();
});

async function getRoles() {
  $.ajax({
    type: 'GET',
    url: API_ROLE_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      roles = result.data.data.result;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

async function getMemberships() {
  $.ajax({
    type: 'GET',
    url: API_MEMBERSHIP_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      memberships = result.data.data.result;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

async function getUsers() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_USERS_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      const users = result.data.data.result;
      users.forEach((user) => {
        const row = `
         <div class="row px-3 py-1 w-100" >
            <div class="col py-2 bg-light" id="${user.id}-id">
              ${user.id}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-username">
              ${user.username}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-firstName">
              ${user.firstName}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-lastName">
              ${user.lastName}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-email">
              ${user.email}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-address">
              ${user.address}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-telephone">
              ${user.telephone}
            </div>
            <div class="col py-2 bg-light text-start" id="${user.id}-role">
              ${user.Role.name}
            </div>
            <div class="col py-1 bg-light ">
              <div class="p-1 w-50 ${getColorClassForRole(user.Membership.name)}" id="${
          user.id
        }-membership">
              ${user.Membership.name}
              </div>
            </div>
            <div hidden  id="${user.id}-membershipId">${user.Membership.id}</div>
            <div hidden  id="${user.id}-roleId">${user.Role.id}</div>
            <div hidden  id="${user.id}-itemsPurchased">${user.itemsPurchased}</div>
            <div class="col  bg-light ">
              <button id="brand-delete" class="btn btn-warning ${
                user.Role.name == 'Admin' ? 'disabled' : ''
              }" onclick="roleDelete(${user.id})"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${
                user.id
              })">
              <i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
        $('#user-container').append(row);
      });
      hideSpinner();
    },
    error: function (err) {
      hideSpinner();
      console.log(err);
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

async function userUpdate(id) {
  showSpinner();
  const email = $('#email').val();
  const username = $('#username').val();
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const address = $('#address').val();
  const telephone = $('#telephone').val();
  const RoleId = $('#user-role-select option:selected').val();
  const MembershipId = $('#user-membership-select option:selected').val();
  const itemsPurchased = $('#itemsPurchased').val();

  const data = JSON.stringify({
    email: email,
    firstName: firstName,
    lastName: lastName,
    RoleId: RoleId,
    MembershipId: MembershipId,
    itemsPurchased: itemsPurchased,
    username: username,
    address: address,
    telephone: telephone,
  });

  $.ajax({
    type: 'PUT',
    url: API_USERS_URL + `/${id}`,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-update');
      emptyContainer('#user-container');
      showToast('Success', 'User updated');
      getUsers();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-update');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

function showUpdateForm(id) {
  console.log(id);
  const email = $(`#${id}-email`).text().trim();
  const username = $(`#${id}-username`).text().trim();
  const firstName = $(`#${id}-firstName`).text().trim();
  const lastName = $(`#${id}-lastName`).text().trim();
  const telephone = $(`#${id}-telephone`).text().trim();
  const address = $(`#${id}-address`).text().trim();
  const userRole = $(`#${id}-role`).text().trim();
  const userRoleId = $(`#${id}-roleId`).text().trim();
  const userMembership = $(`#${id}-membership`).text().trim();
  const userMembershipId = $(`#${id}-membershipId`).text().trim();
  const itemsPurchased = $(`#${id}-itemsPurchased`).text().trim();

  const modalUpdate = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-update" data-bs-backdrop="static" 
    data-bs-backdrop="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit User</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3 d-flex flex-column text-start">
            <label for="id" class="form-label">id</label>
            <input type="text" name="id" class="form-control" disabled  id="id" value='${id}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control " id="email" value='${email}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="username" class="form-label">Username</label>
            <input type="text" name="username" class="form-control " id="username" value='${username}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="firstName" class="form-label">First Name </label>
            <input type="text" name="firstName" class="form-control " id="firstName" value='${firstName}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" name="lastName" class="form-control " id="lastName" value='${lastName}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="telephone" class="form-label">Telephone</label>
            <input type="text" name="telephone" class="form-control " id="telephone" value='${telephone}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="address" class="form-label">Address</label>
            <input type="text" name="address" class="form-control " id="address" value='${address}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="itemsPurchased" class="form-label">Items Purchased</label>
            <input type="text" name="lastName" class="form-control " id="itemsPurchased" value='${itemsPurchased}'>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="user-role-select" class="form-label">Role</label>
            <select class="form-select" name="user-role-select" aria-label=".form-select-lg example" id="user-role-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="user-membership-select" class="form-label">Membership</label>
            <select class="form-select" name="user-membership-select" aria-label=".form-select-lg example" id="user-membership-select">  
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="userUpdate(${id})" >Update</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-update")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#user-container').append(modalUpdate);

  roles.forEach((role) => {
    const option = $(`
      <option value="${role.id}" ${userRole === role.name ? 'selected' : ''}>
      ${role.name}</option>
    `);
    $('#user-role-select').append(option);
  });

  memberships.forEach((membership) => {
    const option = $(`
      <option value="${membership.id}" ${
      userMembership === membership.name ? 'selected' : ''
    }>
      ${membership.name}</option>
    `);
    $('#user-membership-select').append(option);
  });

  showModal('#modal-update');
}

function showAddUserForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add" data-bs-backdrop="static" 
    data-bs-backdrop="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Category</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" 
           onclick='hideModal("#modal-add")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">          
          <div class="mb-3 d-flex flex-column text-start">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control" id="email">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="username" class="form-label">Username</label>
            <input type="text" name="username" class="form-control " id="username">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="firstName" class="form-label">First Name </label>
            <input type="text" name="firstName" class="form-control " id="firstName">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" name="lastName" class="form-control " id="lastName">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="telephone" class="form-label">Telephone</label>
            <input type="text" name="telephone" class="form-control " id="telephone">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="address" class="form-label">Address</label>
            <input type="text" name="address" class="form-control " id="address">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="itemsPurchased" class="form-label">Items Purchased</label>
            <input type="text" name="lastName" class="form-control " id="itemsPurchased" value="0">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-user-role-select" class="form-label">Role</label>
            <select class="form-select" name="new-user-role-select" aria-label=".form-select-lg example" id="new-user-role-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-user-membership-select" class="form-label">Membership</label>
            <select class="form-select" name="new-user-membership-select" aria-label=".form-select-lg example" id="new-user-membership-select">  
            </select>
          </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick ="userAdd()" >Add</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
     </div>
      </div>
    </div>
  </div>
`;

  $('#user-container').append(modalAdd);

  $('#user-role-select').empty();
  roles.forEach((role) => {
    const option = $(`
      <option value="${role.id}">${role.name}</option>
    `);
    $('#new-user-role-select').append(option);
  });

  $('#user-membership-select').empty();
  memberships.forEach((membership) => {
    const option = $(`
      <option value="${membership.id}">${membership.name}</option>
    `);
    $('#new-user-membership-select').append(option);
  });
  showModal('#modal-add');
}

async function userAdd() {
  showSpinner();
  const email = $('#email').val();
  const username = $('#username').val();
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const address = $('#address').val();
  const telephone = $('#telephone').val();
  const RoleId = $('#user-role-select option:selected').val();
  const MembershipId = $('#user-membership-select option:selected').val();
  const itemsPurchased = $('#itemsPurchased').val();

  const data = JSON.stringify({
    email: email,
    firstName: firstName,
    lastName: lastName,
    RoleId: RoleId,
    MembershipId: MembershipId,
    itemsPurchased: itemsPurchased,
    username: username,
    address: address,
    telephone: telephone,
  });

  $.ajax({
    type: 'POST',
    url: API_USERS_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#user-container');
      showToast('Success', 'User Added');
      getUsers();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
