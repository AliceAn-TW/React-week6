import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const API_Base = import.meta.env.VITE_API_BASE;
const API_Path = import.meta.env.VITE_API_PATH;

function Products() {
  // 取得 產品列表 api
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_Base}/api/${API_Path}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  const handleDetail = (id) => {
    navigate(`/product/${id}`);
    // try {
    //   const res = await axios.get(`${API_Base}/api/${API_Path}/product/${id}`);
    //   console.log(res.data);
    //   navigate(`/product/${id}`, {
    //     state: {
    //       productData: res.data.product,
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };
  return (
    <>
      <div className="container">
        <h2>產品總覽頁</h2>
        <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3 py-5">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <div className="card">
                <img
                  src={product.imageUrl}
                  className="card-img-top mb-0"
                  alt={product.title}
                  style={{ height: 300, objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>價格:</strong> {product.price} 元 /{" "}
                    <small className="text-muted">單位: {product.unit}</small>
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDetail(product.id)}
                  >
                    查看更多
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Products;
