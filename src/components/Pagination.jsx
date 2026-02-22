function Pagination({ pagination, onChangePage }) {
  // 取消預設事件
  const handleClick = (e, page) => {
    e.preventDefault();
    onChangePage(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
          {/* 判斷沒有前一頁 顯示 disable*/}
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            {/* current_page=當前頁 */}
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
          // 使用箭頭函式作為 map 函式來操作元素 // 產生數值序列
          Array.from({ length: pagination.total_pages }, (_, index) => (
            <li
              className={`page-item ${pagination.current_page === index + 1 && "active"}`}
              key={`${index}_page`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => handleClick(e, index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))
        }
        <li className={`page-item ${!pagination.has_next && "disabled"}`}>
          {/* 判斷沒有下一頁 顯示 disable*/}
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
