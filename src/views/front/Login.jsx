import axios from "axios";
import { useForm } from "react-hook-form";
import { emailValidation, passwordValidation } from "../../utils/validation";
import { useNavigate } from "react-router";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 初始化跳轉工具

function Login({ getProducts, setIsAuth }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 登入 API
  const onSubmit = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      // 設定 Cookie 加入 token 和 時間
      document.cookie = `myToken=${token};expires=${new Date(expired)};`;
      // 將 Token 設定到 axios 的預設 Header，之後所有 API 請求都會自動帶上 Token
      axios.defaults.headers.common["Authorization"] = token;
      // 登入成功後轉至 /products 頁面
      if (res.data.success) {
        alert(res.data.message);
        navigate("/products");
      }
    } catch (error) {
      // 登入失敗
      // console.log(error.response);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container login ">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
        <div className="col-8">
          <form
            id="form"
            className="form-signin"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                id="username"
                placeholder="name@product.com"
                {...register("username", emailValidation)}
              />
              <label htmlFor="username">Email address</label>
              {errors.username && (
                <p className="text-danger text-start">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="password"
                {...register("password", passwordValidation)}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <p className="text-danger text-start">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              disabled={!isValid}
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
