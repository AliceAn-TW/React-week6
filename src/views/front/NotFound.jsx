import { useNavigate } from "react-router";
function NotFound() {
  const navigate = useNavigate();
  const handleReturn = () => {
    // 返回上一頁
    navigate(-1);
  };
  return (
    <>
      <div className="container my-5">
        <h2>404 找不到頁面</h2>
        <button
          type="button"
          className="btn btn-lg btn-warning my-3"
          onClick={handleReturn}
        >
          返回上一頁
        </button>
      </div>
    </>
  );
}
export default NotFound;
