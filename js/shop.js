//開始寫資料呈現的部分
const domProductList = document.querySelector('.productWrap');
const domCartList = document.querySelector('.shoppingCart-table tbody');
const domProductSelect = document.querySelector('.productSelect');
const apiPath = `jordanttcdesign`;
const apiUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1`;
let sendCheck = false;
let data; //產品資料陣列
let cartData; //購物車資料陣列
//一開始的動作
dataInit();
function dataInit() {
  axios
    .get(`${apiUrl}/customer/${apiPath}/products`)
    .then(function (response) {
      // console.log(response);
      data = response.data.products;
      console.log(data);
      getCartData();
      renderProductList(data);
    })
    .catch(function (response) {
      console.log(response);
    });
}

//監聽動作
//監聽新增購物車動作
domProductList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.dataset.id) {
    //抓出產品id
    let productId = e.target.dataset.id;
    processAddCartData(productId);
  }
});
//監聽刪除購物車，這裏直接監聽全部，判斷是要刪除單一品項還是全部購物車
domCartList.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.dataset.cartid) {
    let cartId = e.target.dataset.cartid;
    deleteCart(cartId);
  } else if (e.target.classList.contains('discardAllBtn')) {
    deleteCartAll();
  } else {
    return;
  }
});
domProductSelect.addEventListener('change', function (e) {
  let selectValue = e.target.value;
  let selectList = [];
  if (selectValue == '全部') {
    selectList = data;
    console.log(selectValue);
  } else {
    data.forEach(function (item) {
      if (selectValue == item.category) {
        selectList.push(item);
      }
    });
  }
  renderProductList(selectList);
});

//function區域

//渲染產品卡片
function renderProductList(productRenderArray) {
  let str = ``;
  productRenderArray.forEach(function (item) {
    str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt="${item.title}"
    />
    <a href="#" id="addCardBtn" data-Id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>`;
  });
  domProductList.innerHTML = str;
}
//取得購物車資料
function getCartData() {
  axios
    .get(`${apiUrl}/customer/${apiPath}/carts`)
    .then(function (response) {
      // console.log(response);
      cartData = response.data.carts;
      // console.log(cartData);
      renderCartList();
    })
    .catch(function (response) {
      console.log(response);
    });
}
//渲染購物車樣式
function renderCartList() {
  let total = 0;
  let str = ``;
  cartData.forEach(function (item) {
    let productPrice = item.quantity * item.product.price;
    str += `<tr>
    <td>
      <div class="cardItem-title">
        <img src="${item.product.images}" alt="" />
        <p>${item.product.title}</p>
      </div>
    </td>
    <td>${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>${productPrice}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-cartId="${item.id}"> clear </a>
    </td>
  </tr>
    `;
    total += productPrice;
  });
  if (total !== 0) {
    str += `<tr>
    <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
      <p>總金額</p>
    </td>
    <td>${total}</td>
  </tr>`;
  } else if (total == 0) {
    //多加一個顯示購物車沒東西
    str += `<tr><td colspan="5"><p class ="text-center text-secondary">目前購物車沒東西</p></td></tr>`;
  }
  domCartList.innerHTML = str;
}
//把新增購物車動作拆成兩個function：
//1.處理資料->processAddCartData(productId)
function processAddCartData(productId) {
  //預設產品數量1
  let data = {};
  data.productId = productId;
  data.quantity = 1;
  cartData.forEach(function (item) {
    //如果購物車裡面已有產品，原數量+1
    if (item.product.id == productId) {
      data.quantity = item.quantity + 1;
    }
  });
  AddCart(data);
}
//2.推到資料庫->AddCart(data)
function AddCart(data) {
  axios
    .post(`${apiUrl}/customer/${apiPath}/carts`, {
      data,
    })
    .then(function (response) {
      console.log(response);
      cartData = response.data.carts;
      //重新更新購物車資料
      renderCartList();
    })
    .catch(function (response) {
      console.log(response);
    });
}
//刪除購物車特定品項，直接帶入品項編號即可
function deleteCart(cartId) {
  axios
    .delete(`${apiUrl}/customer/${apiPath}/carts/${cartId}`)
    .then(function (response) {
      //更新購物車資料
      cartData = response.data.carts;
      renderCartList();
    })
    .catch(function (response) {
      console.log(response);
    });
}

//刪除全部購物車，直接執行即可
function deleteCartAll() {
  axios
    .delete(`${apiUrl}/customer/${apiPath}/carts`)
    .then(function (response) {
      console.log(response);
      //重新更新購物車資料
      getCartData();
    })
    .catch(function (response) {
      console.log(response);
    });
}

//驗證區域
//聯絡人資料驗證物件
const constraints = {
  姓名: {
    presence: {
      message: '是必填欄位',
    },
  },
  Email: {
    presence: {
      message: '是必填欄位',
    },
    email: {
      message: '必須是正確的電子郵件地址',
    },
  },
  電話: {
    presence: {
      message: '是必填欄位',
    },
    // equality: {
    //   attribute: 'tel', // 要比對的屬性
    //   message: '請填寫數字',
    // },
  },
  寄送地址: {
    presence: {
      message: '是必填欄位',
    },
  },
  交易方式: {
    presence: {
      message: '請選擇一個',
    },
  },
};
//宣告表單元素
const domOrderInfoForm = document.querySelector('.orderInfo-form');
const domOrderInfoBtn = document.querySelector('.orderInfo-btn');
const domInputTxtList = document.querySelectorAll(
  '.orderInfo-form input[type = "text"],.orderInfo-form input[type = "email"],.orderInfo-form input[type = "tel"],.orderInfo-form select'
);
//綁定每一個選項的失焦監聽
domInputTxtList.forEach(function (item) {
  item.addEventListener('blur', function () {
    renderOrderInfoCheck(item);
  });
});
//監聽送出預定資料資料是否填寫
domOrderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (cartData.length > 0) {
    //想要減少執行監聽次數多一個if判斷式放在前面sendCheck，如果是true直接不檢查了。
    if (sendCheck == true) {
      console.log(`我想要送出`);
      processOrderInfo();
    } else {
      domInputTxtList.forEach(function (item) {
        renderOrderInfoCheck(item);
      });
    }
  } else {
    alert('購物車沒東西！');
  }
});
//顯示沒有填寫的資訊
function renderOrderInfoCheck(item) {
  let alertTxt = item.nextElementSibling; //錯誤顯示區
  alertTxt.textContent = '';
  let errors = validate(domOrderInfoForm, constraints);
  if (errors) {
    console.log(errors);
    alertTxt.textContent = errors[item.name];
    sendCheck = false; //有錯就不ＯＫ
  } else if (!errors) {
    sendCheck = true; //沒錯就ＯＫ，儘速待傳送狀態
  }
}
//取得並整理所有的輸入匡內容
function processOrderInfo() {
  let obj = {};
  domInputTxtList.forEach(function (item) {
    obj[item.id] = item.value;
  });
  sendOrderInfo(obj);
  //每一個input清空
  domInputTxtList.forEach(function (item) {
    item.value = '';
  });
}
//傳送表單
function sendOrderInfo(obj) {
  console.log(obj);
  axios
    .post(`${apiUrl}/customer/${apiPath}/orders`, {
      data: {
        user: {
          name: obj.customerName,
          tel: obj.customerPhone,
          email: obj.customerEmail,
          address: obj.customerAddress,
          payment: obj.tradeWay,
        },
      },
    })
    .then(function (response) {
      console.log(response);
      getCartData();
    })
    .catch(function (response) {
      console.log(response);
    });
}
