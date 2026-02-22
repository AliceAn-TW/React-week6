import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";

// style.css
import "./assets/style.css";

// 元件化
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "../views/back/Login";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 建立初始化產品表單資料
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function BackendLayout() {
  // 登入狀態管理（判斷是否可以進入商品頁面）
  const [isAuth, setIsAuth] = useState(false); //預設未登入
  // 產品資料狀態，預設空陣列
  const [products, setProducts] = useState([]);
  // 頁籤
  const [pagination, setPagination] = useState({});
  // 產品表單資料
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);
  // modal 控制相關狀態
  const [modalType, setModalType] = useState("");

  // 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err.res?.data.message);
    }
  };

  // 確認登入按鈕
  const checkLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    // 從 Cookie 取得 Token
    // 檢查登入狀態
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("myToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    // split 使用分號 ; 進行切割
    // find 找到 "myToken=" 開頭的物件
    // 再一次 split 使用等於 = 進行切割 myToken 是[0]，${token} 是 [1] >>>取得 Token

    // 初始化 Bootstrap Modal
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

    // 檢查是否登入並載入資料
    checkLogin();
  }, []);

  // 開啟 modal
  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct((prevProduct) => ({
      ...INITIAL_TEMPLATE_DATA, //確保每次都是乾淨的初始表單
      ...product,
    }));
    productModalRef.current.show();
  };
  //  關閉 modal
  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
        // {/* 登入 */}
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      ) : (
        // {/* 產品列表 */}
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table mb-5">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td>
                    <span
                      className={`${item.is_enabled ? "text-success" : ""}`}
                    >
                      {item.is_enabled ? "啟用" : "未啟用"}
                    </span>
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic product"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => openModal("edit", item)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => openModal("delete", item)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}
      <ProductModal
        modalType={modalType}
        getProducts={getProducts}
        templateProduct={templateProduct}
        closeModal={closeModal}
      />
    </>
  );
}

export default BackendLayout;
