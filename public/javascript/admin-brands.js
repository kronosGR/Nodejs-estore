$(document).ready(async function () {
  await getBrands();
});

async function brandDelete(id) {
  console.log(url, id);
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
              <button id="brand-delete" class="btn-sm btn-warning" onclick="brandDelete('')"><i
                  class="bi bi-trash"></i></button>
              <button id="brand-edit " class=" btn-sm btn-danger"><i class="bi bi-pencil"></i></button>
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
