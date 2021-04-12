let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
});

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}
function closeMenu() {
  menu.classList.remove('openMenu');
}
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: 'pie',
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      'Louvre 雙人床架': '#DACBFF',
      'Antony 雙人床架': '#9D7FEA',
      'Anty 雙人床架': '#5434A7',
      其他: '#301E5F',
    },
  },
});
//
const myToken = `Czca4lCbdIOGfTUFicQIcpX03ca2`;
const apiPath = `jordanttcdesign`;
const domOrderList = document.querySelector('.orderPage-table');
let orderData;
function adminInit() {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${apiPath}/orders`,
      {
        headers: {
          authorization: myToken,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      orderData = response.data.orders;
      console.log(orderData);
      adminGetOrderData();
    })
    .catch(function (error) {
      console.log(error);
    });
}
adminInit();

function adminGetOrderData() {
  let str = `<thead>
  <tr>
    <th>訂單編號</th>
    <th>聯絡人</th>
    <th>聯絡地址</th>
    <th>電子郵件</th>
    <th>訂單品項</th>
    <th>訂單日期</th>
    <th>訂單狀態</th>
    <th>操作</th>
  </tr>
</thead>`;
  orderData.forEach(function (item) {
    let productTxt = ``;
    item.products.forEach(function (product) {
      productTxt += `${product.title}/`;
    });
    let user = item.user;
    str += `<tr>
    <td>${item.id}</td>
    <td>
      <p>${user.name}</p>
      <p>${user.tel}</p>
    </td>
    <td>${user.address}</td>
    <td>${user.email}</td>
    <td>
      <p>${productTxt}</p>
    </td>
    <td>2021/03/008</td>
    <td class="orderStatus">
      <a class="changeStatus" href="#" data-paid="${item.paid}" data-orderId="${
      item.id
    }">${item.paid ? '已處理' : '未處理'}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-orderId="${
        item.id
      }" />
    </td>
  </tr>`;
  });
  domOrderList.innerHTML = str;
}
domOrderList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.dataset.orderid) {
    let orderId = e.target.dataset.orderid;
    if (e.target.classList.contains('delSingleOrder-Btn')) {
      adminDeleteOrderData(orderId);
    } else if (e.target.classList.contains('changeStatus')) {
      console.log('okok');
      adminChangeOrderStatus(orderId, e.target.dataset.paid);
    }
  }
});
function adminDeleteOrderData(orderId) {
  console.log(orderId);
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${apiPath}/orders/${orderId}`,
      {
        headers: {
          authorization: myToken,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      adminInit();
    })
    .catch(function (error) {
      console.log(error);
    });
}
function adminChangeOrderStatus(orderId, nowStatus) {
  console.log(nowStatus);
  let changeStatus = true;
  // let changeStatus = nowStatus ? false : true;
  if (nowStatus == true) {
    changeStatus = false;
  }
  console.log(changeStatus);
  axios
    .put(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${apiPath}/orders`,
      {
        data: {
          id: orderId,
          paid: changeStatus,
        },
      },
      {
        headers: {
          authorization: myToken,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      adminInit();
    })
    .catch(function (error) {
      console.log(error);
    });
}
