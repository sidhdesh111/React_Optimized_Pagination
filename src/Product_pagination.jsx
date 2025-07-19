import react, { useEffect, useState, useCallback, useMemo } from "react";

const Product_pagination = () => {
  const LIMIT_PER_PAGE = 14;
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT_PER_PAGE}&skip=${
          (page - 1) * LIMIT_PER_PAGE
        }`
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / LIMIT_PER_PAGE));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePagination = (selectedPage) => {
    if (selectedPage !== page) setPage(selectedPage);
  };

  const paginationButtons = useMemo(() => {
    const pages = [];
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(2, page - 2);
      const endPage = Math.min(totalPages - 1, page + 2);

      pages.push(1);
      if (startPage > 2) pages.push("...");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  return (
    <>
      <h2 className="title">Product Data Show Pagination</h2>

      <div className="product_list">
        {products.map((prod) => (
          <div key={prod.id} className="product_item">
            <div className="product_img">
              <img src={prod.thumbnail} alt={prod.title} />
            </div>
            <h2>{prod.title}</h2>
          </div>
        ))}
      </div>

      <div className="pagination_div">
        <button onClick={handlePrev} disabled={page === 1}>
          ◀
        </button>

        {paginationButtons.map((pg, idx) =>
          pg === "..." ? (
            <span key={idx} className="dots">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => handlePagination(pg)}
              className={page === pg ? "selected_button" : ""}
            >
              {pg}
            </button>
          )
        )}

        <button onClick={handleNext} disabled={page === totalPages}>
          ▶
        </button>
      </div>
    </>
  );
};
export default Product_pagination;
