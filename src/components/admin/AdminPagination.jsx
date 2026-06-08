'use client';

function buildPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  if (currentPage <= 2) {
    pages.add(2);
    pages.add(3);
  }

  if (currentPage >= totalPages - 1) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export default function AdminPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) {
    return null;
  }

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span>
          Showing {startIndex}-{endIndex} of {totalItems}
        </span>

        <label className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((pageNumber, index) => {
          const previous = pageNumbers[index - 1];
          const shouldShowGap = index > 0 && previous && pageNumber - previous > 1;

          return (
            <div key={pageNumber} className="flex items-center gap-2">
              {shouldShowGap ? <span className="px-1 text-sm text-slate-400">...</span> : null}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pageNumber === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNumber}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
