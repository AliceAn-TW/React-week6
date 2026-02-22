import { useEffect, useState } from "react";
import axios from "axios";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ modalType, getProducts, templateProduct, closeModal }) {
  const [tempData, setTempData] = useState(templateProduct);
  //
  useEffect(() => {
    setTempData(templateProduct);
  }, [templateProduct]);

  // 產品表單資料輸入 事件處理
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempData((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
      // 判斷如果 type 是 checkbox 取 checked 值/是否有打勾,否則取 value 的值
    }));
  };

  // 產品表單資料 陣列圖片資料處理
  const handleModalImageChange = (index, value) => {
    setTempData((prevProduct) => {
      const newImg = [...prevProduct.imagesUrl];
      newImg[index] = value;
      return {
        ...prevProduct,
        imagesUrl: newImg,
      };
    });
  };

  // 新增圖片按鈕
  const handleAddImage = () => {
    setTempData((prevProduct) => {
      const newImg = [...prevProduct.imagesUrl];
      newImg.push("");
      return {
        ...prevProduct,
        imagesUrl: newImg,
      };
    });
  };

  // 刪除圖片按鈕
  const handleRemoveImage = () => {
    setTempData((prevProduct) => {
      const newImg = [...prevProduct.imagesUrl];
      newImg.pop();
      return {
        ...prevProduct,
        imagesUrl: newImg,
      };
    });
  };

  // 新增 & 編輯產品列表
  const updateProduct = async (id) => {
    // 新增
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    // 編輯
    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    // 存放資料(注意格式和資料型別 !!!)
    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        // 判斷 true 回傳 1，false回傳 0
        is_enabled: tempData.is_enabled ? 1 : 0,
        // 陣列資料 (防呆機制：避免刪除圖片後，欄位未移除)
        // 使用 filter過濾，避免新陣列內出現空字串
        imagesUrl: [...tempData.imagesUrl.filter((url) => url !== "")],
      },
    };

    try {
      const response = await axios[method](url, productData);
      // 重新渲染
      getProducts();
      // 關閉 modal
      closeModal();
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 刪除特定產品
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      alert(response.data.message);
      getProducts();
      closeModal();
    } catch (error) {
      console.error("刪除失敗", err.response.data.message);
    }
  };

  // 上傳圖片
  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    // 防呆機制
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      // 使用 formData.append() 將加新值到 FormData 物件
      formData.append("file-to-upload", file);

      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );

      setTempData((pre) => ({
        ...pre, //原資料
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      //   ref={productModalRef}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${modalType === "delete" ? "danger" : "dark"} text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除產品"
                  : modalType === "edit"
                    ? "編輯產品"
                    : "新增產品"}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <>
                <p className="fs-4">
                  確定要刪除
                  <span className="text-danger">{tempData.title}</span>
                  嗎？
                </p>
              </>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        name="fileUpload"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        accept=".jpg, .jpeg, .png" //僅限使用 jpg、jpeg 與 png 格式
                        onChange={(e) => uploadImage(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempData.imageUrl}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    {/* 渲染資料前先判斷是否有值避免出錯 */}
                    {tempData.imageUrl && (
                      <img
                        className="img-fluid"
                        src={tempData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {/* 使用陣列方法取值 */}
                    {tempData.imagesUrl.map((image, index) => (
                      <div key={index}>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`圖片網址${index + 1}`}
                          value={image}
                          onChange={(e) =>
                            handleModalImageChange(index, e.target.value)
                          }
                        />
                        {image && (
                          <img
                            className="img-fluid"
                            src={image}
                            alt={`副圖${index + 1}`}
                          />
                        )}
                      </div>
                    ))}
                    {
                      // 限制資料長度不超過5筆且至少有1筆
                      tempData.imagesUrl.length < 5 &&
                        tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                          "" && (
                          <button
                            className="btn btn-outline-primary btn-sm d-block w-100"
                            onClick={() => handleAddImage()}
                          >
                            新增圖片
                          </button>
                        )
                    }
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={() => handleRemoveImage()}
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempData.title}
                      onChange={(e) => handleModalInputChange(e)}
                      disabled={modalType === "edit"} //禁止編輯產品標題
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={tempData.category}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={tempData.unit}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempData.origin_price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempData.price}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={tempData.description}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={tempData.content}
                      onChange={(e) => handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input float-none"
                        type="checkbox"
                        checked={tempData.is_enabled}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                      <label
                        className="form-check-label px-2"
                        htmlFor="is_enabled"
                      >
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteProduct(tempData.id)}
              >
                確定刪除
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => updateProduct(tempData.id)}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
