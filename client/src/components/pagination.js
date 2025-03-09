const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-between items-center mt-6">
        <button
          className={`bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-yellow-500">
          Page {page} of {totalPages}
        </span>
        <button
          className={`bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;