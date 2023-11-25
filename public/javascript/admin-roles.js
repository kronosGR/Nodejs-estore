$(document).ready(async function () {
  await getRoles();
});

async function roleDelete(id) {
  showSpinner();
  $.ajax({
    type: 'DELETE',
    url: API_ROLE_URL + `/${id}`,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      emptyContainer('#role-container');
      showToast('Success', 'Role deleted!');
      getRoles();
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

async function getRoles() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_ROLE_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      const roles = result.data.data.result;
      roles.forEach((role) => {
        const row = `
         <div class="row px-3 py-1 w-100">
            <div class="col py-1 bg-light">
              ${role.id}
            </div>
            <div class="col py-1 bg-light">
              ${role.name}
            </div>
            <div class="col py-1 bg-light ">
              <button id="brand-delete" class="btn btn-warning" onclick="roleDelete(${role.id})"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${role.id},'${role.name}')">
              <i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
        $('#role-container').append(row);
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

async function roleUpdate(id, name) {
  showSpinner();
  const newName = $('#role-name').val();
  const data = JSON.stringify({
    name: newName,
  });

  $.ajax({
    type: 'PUT',
    url: API_ROLE_URL + `/${id}`,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-update');
      emptyContainer('#role-container');
      showToast('Success', 'Role updated');
      getRoles();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-update');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

function showUpdateForm(id, name) {
  const modalUpdate = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-update" data-bs-backdrop="static" 
    data-bs-backdrop="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Role</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="role-name" value='${name}'>
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="roleUpdate(${id},'${name}')" >Update</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-update")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#role-container').append(modalUpdate);
  showModal('#modal-update');
}

function showAddRoleForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add" data-bs-backdrop="static" 
    data-bs-backdrop="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Role</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-add")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="new-role-name" >
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="roleAdd()" >Add</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#role-container').append(modalAdd);
  showModal('#modal-add');
}

async function roleAdd() {
  showSpinner();
  const name = $('#new-role-name').val();
  const data = JSON.stringify({ name: name });

  $.ajax({
    type: 'POST',
    url: API_ROLE_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#role-container');
      showToast('Success', 'Role Added');
      getRoles();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
