interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string>;
}

function buildPageUrl(page: number, searchParams: Record<string, string> = {}) {
  const params = new URLSearchParams(searchParams);
  params.set("page", String(page));
  return `/?${params.toString()}`;
}

export default function Pagination({ currentPage, totalPages, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      {currentPage > 1 ? (
        <a
          href={buildPageUrl(currentPage - 1, searchParams)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all bg-white"
        >
          <span className="material-icons text-base">chevron_left</span>
          Prev
        </a>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg border border-nordic-dark/5 text-nordic-muted text-sm font-medium bg-white cursor-not-allowed">
          <span className="material-icons text-base">chevron_left</span>
          Prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <a
            key={page}
            href={buildPageUrl(page, searchParams)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-nordic-dark text-white shadow-sm"
                : "border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque bg-white"
            }`}
          >
            {page}
          </a>
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <a
          href={buildPageUrl(currentPage + 1, searchParams)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all bg-white"
        >
          Next
          <span className="material-icons text-base">chevron_right</span>
        </a>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg border border-nordic-dark/5 text-nordic-muted text-sm font-medium bg-white cursor-not-allowed">
          Next
          <span className="material-icons text-base">chevron_right</span>
        </span>
      )}
    </div>
  );
}
