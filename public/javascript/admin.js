let brands;
let categories;

$(function () {
  hideSpinner();
  getBrands();
  getCategories();
  getProducts('');
});

function clearSearch() {
  $('#search').val('');
  $('#category-select').val(0);
  $('#brands-select').val(0);
  getProducts('');
}

function search() {
  let searchObject = {};
  let searchProduct = $('#search').val();
  let searchCategory = $('#category-select option:selected').val();
  let searchBrand = $('#brands-select option:selected').val();
  let whereClause = 'where ';

  if (searchProduct.length > 0) {
    searchObject.name = searchProduct;
  }

  if (searchCategory != 0) {
    searchObject.category = searchCategory;
  }

  if (searchBrand != 0) {
    searchObject.brand = searchBrand;
  }

  let searchLen = Object.keys(searchObject).length;
  if (searchLen == 0) {
    whereClause = '';
  } else {
    let i = 0;
    for (const [k, v] of Object.entries(searchObject)) {
      switch (k) {
        case 'name':
          whereClause += "products.name like ''" + v + "''' ";
          break;
        case 'category':
          whereClause += "CategoryId = '" + v + "' ";
          break;
        case 'brand':
          whereClause += "BrandId = '" + v + "' ";
          break;
        default:
          break;
      }

      if (i < searchLen - 1) {
        whereClause += ' and ';
      }
      i++;
    }
  }
  getProducts(whereClause);
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
  $.ajax({
    type: 'GET',
    url: API_PRODUCTS_URL + `/?whereclause=${whereClause}`,
    contentType: 'Application/json',
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
        </div>
       </div>
        `;
          $('#product-container').append(row);
        });
      } else {
        showToast('No Products', 'Products found');
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
      getProducts('');
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
      getProducts('');
    },
    error: function (err) {
      hideSpinner();
      showToast('Error', err.responseJSON.data.data);
    },
  });
}
