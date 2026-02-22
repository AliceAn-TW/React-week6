import { Link, Outlet } from "react-router";

function FrontendLayout() {
  return (
    <>
      <header>
        <nav className="navbar navbar-bark navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <h2>LOGO</h2>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    <h4>首頁</h4>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    <h4>產品列表</h4>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <h4>購物車</h4>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/checkout">
                    <h4>結帳</h4>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <h4>登入</h4>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="text-center p-3 bg-warning">
        <p className="text-light">@React-week5.homework</p>
      </footer>
    </>
  );
}

export default FrontendLayout;
