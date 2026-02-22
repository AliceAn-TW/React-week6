import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { currency } from "/src/utils/filter";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import FrontProductModal from "../../components/frontProductModal";
import * as bootstrap from "bootstrap";
import {
  emailValidation,
  nameValidation,
  telValidation,
  addressValidation,
} from "../../utils/validation";

const API_Base = import.meta.env.VITE_API_BASE;
const API_Path = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);

  // 表單驗證
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange", //及時驗證
  });

  // 處理表單提交
  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const res = await axios.post(`${API_Base}/api/${API_Path}/order`, {
        data,
      });
      alert(res.data.message);
      // 重置購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
      // 重置表單
      reset();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 取得購物車 api
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_Base}/api/${API_Path}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_Base}/api/${API_Path}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
    getCart();

    // 初始化
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  // 加入購物車
  const handleAddCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    const data = {
      product_id: id,
      qty,
    };
    try {
      const res = await axios.post(`${API_Base}/api/${API_Path}/cart`, {
        data,
      });
      // 重新取得購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingCartId(null);
    }
  };

  // 更新購物車 api
  const updateQty = async (cartId, product_id, num) => {
    const data = {
      product_id,
      qty: num,
    };
    try {
      const res = await axios.put(
        `${API_Base}/api/${API_Path}/cart/${cartId}`,
        { data },
      );
      alert(res.data.message);
      // 重新取得購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  //查看更多 按鈕
  const handleDetail = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${API_Base}/api/${API_Path}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }

    productModalRef.current.show();
  };
  // 控制 modal
  const closeModal = () => {
    productModalRef.current.hide();
  };

  // 刪除特定 item
  const delCartItem = async (cartId) => {
    try {
      const res = await axios.delete(
        `${API_Base}/api/${API_Path}/cart/${cartId}`,
      );
      alert(res.data.message);
      // 重新取得購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  // 刪除全部 item
  const delAllCartItem = async () => {
    try {
      const res = await axios.delete(`${API_Base}/api/${API_Path}/carts`);
      alert("成功清空購物車");
      // 重新取得購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  // 確認是否執行指令
  const checkoutDel = () => {
    if (!window.confirm("確定要刪除嗎？")) return;
    delAllCartItem();
  };

  return (
    <div className="container">
      <h2>結帳頁</h2>
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleDetail(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {/* <i className="fas fa-spinner fa-pulse"></i> */}
                    {loadingProductId === product.id ? (
                      <ThreeDots color="orange" width={80} height={16} />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleAddCart(product.id)}
                    disabled={loadingCartId === product.id} //loading期間不可點擊
                  >
                    {/* <i className="fas fa-spinner fa-pulse"></i> */}
                    {loadingCartId === product.id ? (
                      <ThreeDots color="orange" width={80} height={16} />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 購物車列表 */}
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => checkoutDel()}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col" className="text-center">
              小計
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <th scope="row" className="col-4">
                {cartItem.product.title}
              </th>
              <td className="col-3">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    defaultValue={cartItem.qty}
                    onChange={(e) => {
                      e.target.value > 1
                        ? updateQty(
                            cartItem.id,
                            cartItem.product_id,
                            Number(e.target.value),
                          )
                        : delCartItem(cartItem.id);
                    }}
                  />
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="col-3 text-center">
                {currency(cartItem.final_total)}
              </td>
              <td className="col-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCartItem(cartItem.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="h4">
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test123@gamil.com"
              {...register("email", emailValidation)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="your name"
              {...register("name", nameValidation)}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register("tel", telValidation)}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺中市西屯區六角路6段123號8樓"
              {...register("address", addressValidation)}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")} //非必填
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <FrontProductModal
        product={product}
        handleAddCart={handleAddCart}
        closeModal={closeModal}
      />
    </div>
  );
}
export default Checkout;
