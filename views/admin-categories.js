$(document).ready(async function () {
  await getCategories();
});

async function categoryDelete(id) {
  showSpinner();
  $.ajax({
    type: 'DELETE',
    url: API_CATEGORY_URL + `/${id}`,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      emptyContainer('#category-container');
      showToast('Success', 'Category deleted!');
      getCategories();
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

async function getCategories() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_CATEGORY_URL,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      const categories = result.data.data.result;
      categories.forEach((category) => {
        const row = `
         <div class="row px-3 py-1 w-100">
            <div class="col py-1 bg-light">
              ${category.id}
            </div>
            <div class="col py-1 bg-light">
              ${category.name}
            </div>
            <div class="col py-1 bg-light ">
              <button id="brand-delete" class="btn btn-warning" onclick="categoryDelete(${category.id})"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${category.id},'${category.name}')"><i class="bi bi-pencil"></i></button>
            </div>
          </div>
        `;
        $('#category-container').append(row);
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

async function categoryUpdate(id, name) {
  showSpinner();
  const newName = $('#category-name').val();
  const data = JSON.stringify({
    name: newName,
  });

  $.ajax({
    type: 'PUT',
    url: API_CATEGORY_URL + `/${id}`,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-update');
      emptyContainer('#category-container');
      showToast('Success', 'Category updated');
      getCategories();
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
          <h5 class="modal-title">Edit Category</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="category-name" value='${name}'>
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="categoryUpdate(${id},'${name}')" >Update</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-update")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#category-container').append(modalUpdate);
  showModal('#modal-update');
}

function showAddCategoryForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Category</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-add")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control " id="new-category-name" >
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" onclick ="categoryAdd()" >Add</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  $('#category-container').append(modalAdd);
  showModal('#modal-add');
}

async function categoryAdd() {
  showSpinner();
  const name = $('#new-category-name').val();
  console.log(name.length);
  const data = JSON.stringify({ name: name });

  $.ajax({
    type: 'POST',
    url: API_CATEGORY_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#category-container');
      showToast('Success', 'Category Added');
      getCategories();
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
