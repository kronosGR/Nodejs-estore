let brands;
let categories;
let searchObject = { searchOptions: {} };

$(function () {
  hideSpinner();
  getBrands();
  getCategories();
  getProducts(searchObject);
});

function clearSearch() {
  $('#search').val('');
  $('#category-select').val(0);
  $('#brands-select').val(0);
  searchObject = { searchOptions: {} };
  getProducts(searchObject);
}

function search() {
  let searchProduct = $('#search').val();
  let searchCategory = $('#category-select option:selected').val();
  let searchBrand = $('#brands-select option:selected').val();

  if (searchProduct.length > 0) {
    searchObject.searchOptions.name = searchProduct;
  }

  if (searchCategory != 0) {
    searchObject.searchOptions.category = searchCategory;
  }

  if (searchBrand != 0) {
    searchObject.searchOptions.brand = searchBrand;
  }

  getProducts(searchObject);
}

async function getBrands() {
  $.ajax({
    type: 'GET',
    url: API_BRAND_URL,
    contentType: 'Application/json',
    success: function (result) {
      brands = result.data.data.result;
      brands.forEach((brand) => {
        const option = $(`
          <option value="${brand.id}">${brand.name}</option>
          `);
        $('#brands-select').append(option);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
}

async function getCategories() {
  $.ajax({
    type: 'GET',
    url: API_CATEGORY_URL,
    contentType: 'Application/json',
    success: function (result) {
      categories = result.data.data.result;
      categories.forEach((category) => {
        const option = $(`
          <option value="${category.id}">${category.name}</option>
          `);
        $('#category-select').append(option);
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
}

async function getProducts(whereClause) {
  emptyContainer('#product-container');
  showSpinner();
  const data = JSON.stringify(whereClause);
  $.ajax({
    type: 'POST',
    url: API_PRODUCTS_URL + '/get',
    contentType: 'Application/json',
    data: data,
    dataType: 'json',
    success: function (result) {
      const products = result.data.data.result;
      if (products.length > 0) {
        products.forEach((product) => {
          const row = `
        <div class="row px-3 py-1 w-100" >
            <div class="col-1 py-2 bg-light w-40p text-start" id="${product.id}-id">
              ${product.id}
            </div>
            <div class="col-1 py-2 bg-light w-150p text-start" id="${product.id}-name">
              ${product.name}
            </div>
            <div class="col-1 py-2 bg-light w-300p text-start" id="${
              product.id
            }-description">
              ${product.description}
            </div>
            <div class="col-1 py-2 bg-light w-80p text-start" id="${product.id}-quantity">
              ${product.quantity}
            </div>
            <div class="col-1 py-2 bg-light w-60p text-start" id="${product.id}-price">
              ${product.price}
            </div>
            <div class="col-1 py-2 bg-light w-70p text-start" id="${
              product.id
            }-brandName">
              ${product.brandName}
            </div>
            <div class="col-1 py-2 bg-light w-100p text-start" id="${
              product.id
            }-categoryName">
              ${product.categoryName}
            </div>
            <div class="col-1 py-2 bg-light w-250p text-start" id="${product.id}-imgUrl">
              ${product.imgUrl}
            </div>
            <img class="col-1 py-2 bg-light w-70p text-start" id="${product.id}-imgUrl"
              src='${product.imgUrl}'>
            <div class="col-1 py-2 bg-light w-90p form-check form-switch d-flex justify-content-center" >
              <input class="form-check-input" type="checkbox" ${
                product.isDeleted == 1 ? 'checked' : ''
              } id="${product.id}-isDeleted" disabled>            
            </div>
            <div class="col-1 py-2 bg-light w-120p text-start" id="${
              product.id
            }-createdAt">
              ${product.createdAt}
            </div>
            <div class="col-1  bg-light w-120p text-start">
              <button id="brand-delete" class="btn btn-warning" onclick="productDelete(${
                product.id
              })"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn btn-danger" onclick="showUpdateForm(${
                product.id
              })">
              <i class="bi bi-pencil"></i></button>
            </div>
            <div hidden  id="${product.id}-categoryId">${product.CategoryId}</div>
            <div hidden  id="${product.id}-brandId">${product.BrandId}</div>
        </div>
       </div>
        `;
          $('#product-container').append(row);
        });
      } else {
        showToast('No Products', 'No Products found');
      }
      hideSpinner();
    },
    error: function (err) {
      hideSpinner();
      console.log(err);
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

function showAddProductForm() {
  const modalAdd = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-add" data-bs-backdrop="static" 
    data-bs-keyboard="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Product</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" 
           onclick='hideModal("#modal-add")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body row">   
        <div class="col">       
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-name" class="form-label">Name</label>
            <input type="text" class="form-control" id="new-name">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-description" class="form-label">Description</label>
            <textarea rows="6" name="new-description" class="form-control " id="new-description"></textarea>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-imgUrl" class="form-label">Image Url</label>
            <input type="text" name="new-imgUrl" class="form-control " id="new-imgUrl">
          </div>
        </div>       
        <div class="col">                
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-category-select" class="form-label">Category</label>
            <select class="form-select" name="new-category-select" aria-label=".form-select-lg example" 
              id="new-category-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-brand-select" class="form-label">Brand</label>
            <select class="form-select" name="new-brand-select"
               aria-label=".form-select-lg example" id="new-brand-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-quantity" class="form-label">Quantity</label>
            <input type="number" name="new-quantity" class="form-control" value="0" id="new-quantity">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="new-price" class="form-label">Price</label>
            <input type="number" name="new-price" class="form-control" value="0" id="new-price">
          </div>
          <div class="form-check form-switch text-start mb-3 ">
            <label class="form-check-label" for="new-isDeleted">Is Deleted</label>
            <input class="form-check-input" type="checkbox" id="new-isDeleted">
          </div>  
          </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick ="productAdd()" >Add</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-add")'>Close</button>
     </div>
      </div>
    </div>
  </div>
`;
  $('#product-container').append(modalAdd);

  $('#new-category-select').empty();
  categories.forEach((category) => {
    const option = $(`
      <option value="${category.id}">${category.name}</option>
    `);
    $('#new-category-select').append(option);
  });

  $('#new-brand-select').empty();
  brands.forEach((brand) => {
    const option = $(`
      <option value="${brand.id}">${brand.name}</option>
    `);
    $('#new-brand-select').append(option);
  });

  showModal('#modal-add');
}

async function productAdd() {
  showSpinner();
  const name = $('#new-name').val();
  const description = $('#new-description').val();
  const quantity = $('#new-quantity').val();
  const price = $('#new-price').val();
  const imgUrl = $('#new-imgUrl').val();
  const isDeletedString = $('#new-isDeleted').prop('checked');
  const isDeleted = isDeletedString === true ? 1 : 0;
  const categoryId = $('#new-category-select option:selected').val();
  const brandId = $('#new-brand-select option:selected').val();

  const data = JSON.stringify({
    name: name,
    description: description,
    quantity: quantity,
    price: price,
    imgUrl: imgUrl,
    isDeleted: isDeleted,
    categoryId: categoryId,
    brandId: brandId,
  });

  $.ajax({
    type: 'POST',
    url: API_PRODUCTS_URL,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-add');
      emptyContainer('#product-container');
      showToast('Success', 'Product Added');
      getProducts(searchObject);
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-add');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

async function productDelete(id) {
  showSpinner();
  $.ajax({
    type: 'DELETE',
    url: API_PRODUCTS_URL + `/${id}`,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      emptyContainer('#product-container');
      showToast('Success', 'Product deleted!');
      getProducts(searchObject);
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}

function showUpdateForm(id) {
  const productName = $(`#${id}-name`).text().trim();
  const productDescription = $(`#${id}-description`).text().trim();
  const productQuantity = $(`#${id}-quantity`).text().trim();
  const productPrice = $(`#${id}-price`).text().trim();
  const productImgUrl = $(`#${id}-imgUrl`).text().trim();
  const productIsDeleted = $(`#${id}-isDeleted`).prop('checked');
  const productCategoryId = $(`#${id}-categoryId`).text().trim();
  const productBrandId = $(`#${id}-brandId`).text().trim();

  const modalUpdate = `
    <div class="modal" tabindex="-1" role="dialog" id="modal-update" data-bs-backdrop="static" 
    data-bs-keyboard="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit User</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onclick='hideModal("#modal-update")'>
            <span aria-hidden="true">&times;</span>
          </button>
        </div> 
        <div class="modal-body row">   
        <div class="col">       
          <div class="mb-3 d-flex flex-column text-start">
            <label for="name" class="form-label">Name</label>
            <input type="text" value="${productName}" class="form-control" id="name">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="description" class="form-label">Description</label>
            <textarea rows="6"  name="description" class="form-control " id="description">${productDescription}
            </textarea>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="imgUrl" class="form-label">Image Url</label>
            <input type="text" value="${productImgUrl}" name="imgUrl" class="form-control " id="imgUrl">
          </div>
        </div>        
        <div class="col">                
          <div class="mb-3 d-flex flex-column text-start">
            <label for="update-category-select" class="form-label">Category</label>
            <select class="form-select" name="update-category-select" aria-label=".form-select-lg example" 
              id="update-category-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="update-brand-select" class="form-label">Brand</label>
            <select class="form-select" name="update-brand-select"
               aria-label=".form-select-lg example" id="update-brand-select">  
            </select>
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="quantity" class="form-label">Quantity</label>
            <input type="number" value="${productQuantity}" name="quantity" class="form-control" value="0" id="quantity">
          </div>
          <div class="mb-3 d-flex flex-column text-start">
            <label for="price" class="form-label">Price</label>
            <input type="number" value="${productPrice}" name="price" class="form-control" value="0" id="price">
          </div>
          <div class="form-check form-switch text-start mb-3 ">
            <label class="form-check-label" for="isDeleted">Is Deleted</label>
            <input class="form-check-input" type="checkbox" id="isDeleted"
            ${productIsDeleted == 1 ? 'checked' : ''}>
          </div>  
          </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick ="productUpdate(${id})" >Update</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='hideModal("#modal-update")'>Close</button>
      </div>
    </div>
  </div>
</div>
`;
  $('#product-container').append(modalUpdate);

  $('#update-category-select').empty();
  categories.forEach((category) => {
    const option = $(`
      <option value="${category.id}" 
       ${productCategoryId == category.id ? 'selected' : ''}>${category.name}</option>
    `);
    $('#update-category-select').append(option);
  });

  $('#update-brand-select').empty();
  brands.forEach((brand) => {
    const option = $(`
      <option value="${brand.id}"
        ${productBrandId == brand.id ? 'selected' : ''}>${brand.name}</option>
    `);
    $('#update-brand-select').append(option);
  });

  showModal('#modal-update');
}

async function productUpdate(id) {
  showSpinner();
  const productName = $(`#name`).val().trim();
  const productDescription = $(`#description`).val().trim();
  const productQuantity = $(`#quantity`).val().trim();
  const productPrice = $(`#price`).val().trim();
  const productImgUrl = $(`#imgUrl`).val().trim();
  const productIsDeleted = $(`#isDeleted`).prop('checked');
  const productCategoryId = $(`#update-category-select option:selected`).val();
  const productBrandId = $(`#update-brand-select option:selected`).val().trim();

  const data = JSON.stringify({
    name: productName,
    description: productDescription,
    quantity: productQuantity,
    price: productPrice,
    imgUrl: productImgUrl,
    isDeleted: productIsDeleted,
    CategoryId: productCategoryId,
    BrandId: productBrandId,
  });

  $.ajax({
    type: 'PUT',
    url: API_PRODUCTS_URL + `/${id}`,
    data: data,
    contentType: 'Application/json',
    dataType: 'json',
    success: function (result) {
      hideSpinner();
      hideModal('#modal-update');
      emptyContainer('#product-container');
      showToast('Success', 'Product updated');
      getProducts(searchObject);
    },
    error: function (err) {
      hideSpinner();
      hideModal('#modal-update');
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
