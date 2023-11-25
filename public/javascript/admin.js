let brands;
let categories;
let searchObject = {};

$(function () {
  hideSpinner();
  getBrands();
  getCategories();
});

function search() {
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
          whereClause += "name like '%" + v + "%' ";
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
  console.log(searchObject);
  console.log(whereClause);
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
