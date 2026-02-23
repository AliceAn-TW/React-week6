import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "/src/utils/filter";
import { Link } from "react-router";

const API_Base = import.meta.env.VITE_API_BASE;
const API_Path = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);
  // 取得購物車 api
  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_Base}/api/${API_Path}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();
  }, []);
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

      // alert(res.data.message);
      // 重新取得購物車資料
      const cartRes = await axios.get(`${API_Base}/api/${API_Path}/cart`);
      setCart(cartRes.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  // 刪除特定 item
  const delCartItem = async (cartId) => {
    if (!window.confirm("確定要刪除嗎？")) return;
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
    if (!window.confirm("確定要刪除嗎？")) return;
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

  return (
    <div className="container">
      <h2>購物車列表</h2>
      {cart?.carts?.length === 0 ? (
        <div className="my-5">
          <h3 className="mb-3">目前購物車沒有商品</h3>
          <button type="button" className="btn btn-outline-primary btn-lg">
            <Link to="/products">前往選購</Link>
          </button>
        </div>
      ) : (
        <>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => delAllCartItem()}
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
                          e.target.value > 0
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
        </>
      )}
    </div>
  );
}
export default Cart;
