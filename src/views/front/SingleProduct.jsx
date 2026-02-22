import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";

const API_Base = import.meta.env.VITE_API_BASE;
const API_Path = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData;

  const { id } = useParams();
  const [product, setProduct] = useState();
  useEffect(() => {
    const handleDetail = async (id) => {
      try {
        const res = await axios.get(
          `${API_Base}/api/${API_Path}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleDetail(id);
  }, [id]);

  const handleAddCart = async (id, qty = 1) => {
    const data = {
      product_id: id,
      qty,
    };
    try {
      const res = await axios.post(`${API_Base}/api/${API_Path}/cart`, {
        data,
      });
      alert(res.data.message);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container my-3">
      {!product ? (
        <h2>產品詳細頁</h2>
      ) : (
        <div className="row gy-3">
          <div className="col-12 col-lg-4">
            <img
              src={product.imageUrl}
              className="card-img-top mb-0"
              alt={product.title}
              style={{ height: 300, objectFit: "cover" }}
            />
          </div>
          <div className="col-12 col-lg-8">
            <div>
              <h1>{product.title}</h1>
              <h5>
                <span className="me-2">{product.description}</span>
                <span className="badge badge bg-warning text-dark">
                  {product.category}
                </span>
              </h5>
              <p>{product.content}</p>
              <p className="text-decoration-line-through">
                <strong>原價:</strong> {product.origin_price} 元 /{" "}
                <small className="text-muted">單位: {product.unit}</small>
              </p>
              <p className="">
                <strong>售價:</strong> {product.price} 元 /{" "}
                <small className="text-muted">單位: {product.unit}</small>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={(e) => handleAddCart(product.id)}
            >
              <i className="bi bi-fork-knife"></i>加入菜單
            </button>
          </div>
          <hr />
          <div className="col">
            <h5>參考圖片：</h5>
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
              {product.imagesUrl
                .filter((img) => img !== "")
                .map((img, index) => (
                  <img
                    src={img}
                    alt={index}
                    key={index}
                    style={{ objectFit: "cover" }}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SingleProduct;
