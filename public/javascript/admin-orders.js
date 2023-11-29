$(async function () {
  hideSpinner();
  await getOrders();
});

async function getOrders() {
  showSpinner();
  $.ajax({
    type: 'GET',
    url: API_ORDERS_URL + '/all',
    success: function (result) {
      const orders = result.data.data.result;
      if (orders.length > 0) {
        orders.forEach((order) => {
          const row = `
      <div class="d-flex flex-column">
        <div class="row px-3 py-1 w-100">
          <div class="col py-1 bg-light text-start">
            ${order.id}
          </div>
          <div class="col py-1 bg-light text-start">
            ${order.createdAt}
          </div>
          <div class="col py-1 bg-light text-start">
            ${order.updatedAt}
          </div>
          <div class="col py-1 bg-light text-start">
            ${order.UserId}
          </div>
          <div class="col py-1 bg-light text-start">
            ${order.OrderStatus.name}
          </div>
          <div class="col py-1 bg-light text-start ">          
            <button id="brand-edit" title="Update Order status" class="btn btn-danger" onclick="showUpdateForm(${order.id},'${order.OrderStatusId}')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProducts-${order.id}" 
              aria-expanded="false" aria-controls="collapseProducts-${order.id}">
                Show Items
            </button>
          </div>
        </div>
        <div class="collapse p-5" id="collapseProducts-${order.id}">
          <h4 class="text-start">Products for Order ${order.id}</h4>
          <div class="list-group scrollable">
          <div class="row px-3 py-1 w-100">
            <div class="col-1 py-1 text-start w-350p">Name</div>
            <div class="col-1 py-1 text-start w-150p">Quantity</div>
            <div class="col-1 py-1 text-start w-150p">Price</div>
            <div class="col-1 py-1 text-start w-150p">Brand</div>
            <div class="col-1 py-1 text-start w-150p">Category</div>
            <div class="col-1 py-1 text-start w-70p">Image</div>
          </div>
        </div>
          <div class="card card-body" id="products-${order.id}">
            <div id="product-container-${order.id}">
            </div>
          </div>
        </div>
       </div>
     `;
          $('#order-container').append(row);

          for (const orderItem of order.OrderItems) {
            $.ajax({
              type: 'GET',
              url: API_PRODUCTS_URL + `/${orderItem.productId}`,
              success: function (result) {
                const product = result.data.data.result;
                const row2 = `
              <div class="row px-3 py-1 -1">
                <div class="col-1 py-1 bg-light text-start w-350p">
                  ${product.name}
                </div>
                <div class="col-1 py-1 bg-light text-start w-150p">
                  ${orderItem.quantity}
                </div>
                <div class="col-1 py-1 bg-light text-start w-150p">
                  ${orderItem.unitPrice}
                </div>
                <div class="col-1 py-1 bg-light text-start w-150p">
                  ${product.Brand.name}
                </div>
                <div class="col-1 py-1 bg-light text-start w-150p">
                  ${product.Category.name}
                </div>
                <img class="col-1 py-1 bg-light text-start w-70p"
                  src="${product.imgUrl}"
                />
              </div>`;

                $(`#product-container-${order.id}`).append(row2);
              },
              error: function (err) {
                hideSpinner();
                console.log(err);
                showToast('Error', err.responseJSON.data.data);
              },
            });
          }
        });
      } else {
        showToast('No Orders', 'No Orders found');
        hideSpinner();
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
