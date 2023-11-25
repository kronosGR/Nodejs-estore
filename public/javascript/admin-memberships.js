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
