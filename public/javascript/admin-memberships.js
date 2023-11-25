$(async function () {
  await getMemberships();
});

async function getMemberships() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_MEMBERSHIP_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      const memberships = result.data.data.result;
      memberships.forEach((membership) => {
        const row = `
         <div class="row px-3 py-1 w-100">
            <div class="col py-1 bg-light text-start">
              ${membership.id}
            </div>
            <div class="col py-1 bg-light text-start">
              ${membership.name}
            </div>
            <div class="col py-1 bg-light text-start">
              ${membership.from}
            </div>
            <div class="col py-1 bg-light text-start">
              ${membership.to}
            </div>
            <div class="col py-1 bg-light text-start">
              ${membership.discount}
            </div>
            <div class="col py-1 bg-light ">
              <button id="brand-delete" class="btn btn-warning" onclick="membershipDelete(${membership.id})"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${membership.id},'${membership.name}',
              '${membership.from}''${membership.to}''${membership.discount}')"><i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
        $('#membership-container').append(row);
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

async function membershipDelete(id) {
  showSpinner();
  $.ajax({
    type: 'DELETE',
    url: API_MEMBERSHIP_URL + `/${id}`,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      emptyContainer('#membership-container');
      showToast('Success', 'Membership deleted!');
      getMemberships();
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

function showAddMembershipForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Membership</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-add")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="membership-name" class="form-label d-flex flex-column text-start">Name</label>
          <input type="text" class="form-control " id="membership-name" >
        </div>
        <div class="mb-3">
          <label for="membership-from" class="form-label d-flex flex-column text-start">From</label>
          <input type="text" class="form-control " id="membership-from" >
        </div>
        <div class="mb-3">
          <label for="membership-to" class="form-label d-flex flex-column text-start">To</label>
          <input type="text" class="form-control " id="membership-to" >
        </div>
        <div class="mb-3">
          <label for="membership-discount" class="form-label d-flex flex-column text-start">Discount</label>
          <input type="text" class="form-control " id="membership-discount" >
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="membershipAdd()" >Add</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#membership-container').append(modalAdd);
  showModal('#modal-add');
}

async function membershipAdd() {
  showSpinner();
  const name = $('#membership-name').val();
  const to = $('#membership-to').val();
  const from = $('#membership-from').val();
  const discount = $('#membership-discount').val();

  const data = JSON.stringify({ name: name, from: from, to: to, discount: discount });

  $.ajax({
    type: 'POST',
    url: API_MEMBERSHIP_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#membership-container');
      showToast('Success', 'Membership Added');
      getMemberships();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
