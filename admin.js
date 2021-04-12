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
function c3Default() {
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
}
c3Default();
//宣告
const myToken = `Czca4lCbdIOGfTUFicQIcpX03ca2`;
const apiPath = `jordanttcdesign`;
const domOrderList = document.querySelector('.orderPage-table');
const domDeleteAllBtn = document.querySelector('.discardAllBtn');
let orderData; //全部的訂單資料
let productObjList = {}; //全部銷售品項
let orderSortData = []; //銷售品項排序
let newC3Data = []; //圖表陣列
//預設最開始的動作
adminInit();
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
      // console.log(response);
      orderData = response.data.orders;
      // console.log(orderData);
      adminGetOrderData(); //渲染畫面訂單
      getC3Data(); //渲染畫面c3圖表
    })
    .catch(function (error) {
      console.log(error);
    });
}
//監聽訂單，這裡透過判斷class來區分執行刪除還是改訂單狀態
domOrderList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.dataset.orderid) {
    let orderId = e.target.dataset.orderid;
    if (e.target.classList.contains('delSingleOrder-Btn')) {
      adminDeleteOrder(orderId);
    } else if (e.target.classList.contains('changeStatus')) {
      adminChangeOrderStatus(orderId, e.target.dataset.paid);
    }
  }
});
//監聽刪除訂單動作
domDeleteAllBtn.addEventListener('click', function (e) {
  e.preventDefault();
  adminDeleteOrderAll();
});

//function區域
//抓取訂單資料
function adminGetOrderData() {
  //預設表頭
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
  //先把訂單品項都整理在一個變數
  orderData.forEach(function (item) {
    let productTxt = ``;
    item.products.forEach(function (product) {
      productTxt += `${product.title}*${product.quantity}/`;
    });
    //處理訂單品項字串最後的符號
    let newProductTxt = productTxt.slice(0, -1);
    //訂單聯絡人資料
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
      <p>${newProductTxt}</p>
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
//刪除特定訂單，直接傳入訂單編號
//這裡跟前台不同，前台只需更新購物車，這裡要更新兩項，所以直接執行adminInit()，畫面更新。
function adminDeleteOrder(orderId) {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${apiPath}/orders${orderId}`,
      {
        headers: {
          authorization: myToken,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      adminInit(); //更新畫面與資料
    })
    .catch(function (error) {
      console.log(error);
    });
}
//刪除全部訂單，只需呼叫
//這裡跟前台不同，前台只需更新購物車，這裡要更新兩項，所以直接執行adminInit()，畫面更新。
function adminDeleteOrderAll() {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${apiPath}/orders`,
      {
        headers: {
          authorization: myToken,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      adminInit(); //更新畫面與資料
    })
    .catch(function (error) {
      console.log(error);
    });
}
//改變定單狀態
function adminChangeOrderStatus(orderId, nowStatus) {
  // console.log(nowStatus);
  //判斷如果目前訂單狀態，調整成相反的狀態
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

//c3圖表
//取得圖表資料
function getC3Data() {
  //先把所有訂單的銷售品項紀錄
  orderData.forEach(function (item) {
    let array = item.products; //該筆訂單的銷售品項
    array.forEach(function (product) {
      if (!productObjList[product.title]) {
        productObjList[product.title] = product.quantity * product.price;
      } else if (productObjList[product.title]) {
        productObjList[product.title] += product.quantity * product.price;
      }
    });
  });
  sortC3Data(productObjList);
}
//整理順序
function sortC3Data(productObjList) {
  let orderProductList = Object.keys(productObjList);
  orderProductList.forEach(function (item) {
    let obj = {};
    obj.name = item;
    obj.revenue = productObjList[item];
    orderSortData.push(obj);
  });
  orderSortData.sort(function (a, b) {
    return b.revenue - a.revenue;
  });
  processC3Top3Data(orderSortData);
}

function processC3Top3Data(data) {
  //先取得第四名之後的資料
  let array = data.splice(3, data.length);
  //產生其他選項，裝銷售第四名以後的產品
  let other = { name: '其他', revenue: 0 };
  //計算第四名之後資料
  array.forEach(function (item) {
    other.revenue += item.revenue;
  });
  data.push(other);
  //推送最終c3圖表需要的陣列
  data.forEach(function (item) {
    let itemArray = [];
    itemArray.push(item.name);
    itemArray.push(item.revenue);
    newC3Data.push(itemArray);
  });
  //產生圖表的顏色陣列
  colorData = {};
  colorData[newC3Data[0][0]] = '#DACBFF';
  colorData[newC3Data[1][0]] = '#9D7FEA';
  colorData[newC3Data[2][0]] = '#5434A7';
  colorData['其他'] = '#301E5F';
  c3Render(newC3Data, colorData);
}
//渲染c3圖表畫面
function c3Render(data, colorData) {
  console.log(colorData);
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: 'pie',
      columns: data,
      colors: colorData,
    },
  });
}
