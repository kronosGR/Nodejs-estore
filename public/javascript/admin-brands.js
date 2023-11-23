$(document).ready(async function () {
  await getBrands();
});

async function brandDelete(id) {
  showSpinner();
  $.ajax({
    type: 'DELETE',
    url: API_BRAND_URL + `/${id}`,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      emptyContainer('#brand-container');
      showToast('Success', 'Brand deleted!');
      getBrands();
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

async function getBrands() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_BRAND_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      const brands = result.data.data.result;
      brands.forEach((brand) => {
        const row = `
         <div class="row px-3 py-1 w-100">
            <div class="col py-1 bg-light">
              ${brand.id}
            </div>
            <div class="col py-1 bg-light">
              ${brand.name}
            </div>
            <div class="col py-1 bg-light ">
              <button id="brand-delete" class="btn btn-warning" onclick="brandDelete(${brand.id})"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${brand.id},'${brand.name}')"><i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
        $('#brand-container').append(row);
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

async function brandUpdate(id, name) {
  showSpinner();
  const newName = $('#brand-name').val();
  const data = JSON.stringify({
    name: newName,
  });

  $.ajax({
    type: 'PUT',
    url: API_BRAND_URL + `/${id}`,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-update');
      emptyContainer('#brand-container');
      showToast('Success', 'Brand updated');
      getBrands();
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
    <div class="modal" tabindex="-1" role="dialog" id="modal-update">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Brand</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="brand-name" value='${name}'>
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="brandUpdate(${id},'${name}')" >Update</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-update")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#brand-container').append(modalUpdate);
  showModal('#modal-update');
}

function showAddBrandForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Brand</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="new-brand-name" >
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="brandAdd()" >Add</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#brand-container').append(modalAdd);
  showModal('#modal-add');
}

async function brandAdd() {
  showSpinner();
  const name = $('#new-brand-name').val();
  console.log(name.length);
  const data = JSON.stringify({ name: name });

  $.ajax({
    type: 'POST',
    url: API_BRAND_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#brand-container');
      showToast('Success', 'Brand Added');
      getBrands();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
