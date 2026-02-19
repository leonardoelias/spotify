import { Pagination } from "../Pagination";

import type { ReactNode } from "react";

interface SearchResultsProps<T> {
  items: T[];
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage: string;
  isLoading?: boolean;
}

export function SearchResults<T extends object>({
  items,
  total,
  page,
  pageSize = 20,
  onPageChange,
  renderItem,
  emptyMessage,
  isLoading = false,
}: SearchResultsProps<T>) {
  if (isLoading) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3 className="text-lg font-semibold text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {total > pageSize && (
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
