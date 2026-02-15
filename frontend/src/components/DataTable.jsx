import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
  ChevronDown,
} from "lucide-react";
import ButtonDropdown from "./ButtonDropdown";
import Skeleton from "./Skeleton";

const DataTable = ({
  loading = false,
  data = [],
  selectedRows = [],
  onSelectAll = () => {},
  onSelectRow = () => {},
  onRowClick = () => {},
  onRowDoubleClick = () => {},
  columns = [], // [{ key, label, render?: (row) => ReactNode, width?: string }]
  visibleColumns = [], // Default to empty array, will be handled below
  sortConfig = {},
  onSort = () => {},
  getSortIcon = () => null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  itemsPerPage = 10,
  onItemsPerPageChange = () => {},
  itemsPerPageOptions = [10, 20, 50],
  totalResults = 0,
  emptyState = null,
}) => {
  // If visibleColumns is empty, show all columns by default
  const effectiveVisibleColumns =
    visibleColumns.length > 0 ? visibleColumns : columns.map((col) => col.key);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm max-w-full">
      {/* Horizontal scrolling container - responsive on small devices */}
      <div className="w-full overflow-x-auto overflow-y-visible min-w-0">
        <table className="w-full min-w-max">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {/* Regular columns */}
              {columns
                .filter((col) => effectiveVisibleColumns.includes(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider select-none whitespace-nowrap ${
                      col.width || "min-w-[100px]"
                    } ${
                      col.sortable !== false
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                    onClick={() => {
                      if (col.sortable !== false) {
                        onSort(col.key);
                      }
                    }}
                    style={{ width: col.width || (col.key === "checkbox" ? "40px" : "auto") }}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={effectiveVisibleColumns.length}
                  className="px-4 py-8 text-center"
                >
                  <div className="flex items-center justify-center h-32">
                    <div className="flex flex-col items-center gap-2 p-4 bg-white bg-opacity-75 rounded-lg">
                      <div className="w-12 h-12 border-[1.5px]  border-[#1c573c] border-y-0 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={effectiveVisibleColumns.length}
                  className="px-4 py-8 text-center"
                >
                  {emptyState || (
                    <div className="py-8 text-center">
                      <div className="flex justify-center w-full mb-3 text-4xl text-primary">
                        <div
                          className="flex items-center justify-center rounded-full  h-14 w-14 bg-gradient-to-br from-blue-100 to-purple-200"
                        >
                          <span role="img" aria-label="No data">
                            <SearchX />
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-[#172b4d] mb-1">
                        No data found
                      </h3>
                      <p className="text-xs text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                // Generate a unique key for each row
                let rowKey;

                // Try to use the most unique identifier first
                if (row.payment_id) {
                  // This is a payment row - use payment_id as it's unique
                  rowKey = `payment_${row.payment_id}`;
                } else if (row.assignment_id) {
                  // This is an assignment row - use assignment_id as it's unique
                  rowKey = `assignment_${row.assignment_id}`;
                } else if (row.id) {
                  // Generic id field
                  rowKey = `id_${row.id}`;
                } else if (row.tenant_id) {
                  // Tenant id
                  rowKey = `tenant_${row.tenant_id}`;
                } else if (row.room_id) {
                  // Room id
                  rowKey = `room_${row.room_id}`;
                } else {
                  // Last resort: use index with a more descriptive prefix
                  rowKey = `row_${index}`;
                }

                // Add index to ensure uniqueness even if IDs are duplicated
                rowKey = `${rowKey}_${index}`;

                return (
                  <tr
                    key={rowKey}
                    className={`transition-colors duration-300 ${
                      onRowClick || onRowDoubleClick ? "cursor-pointer" : ""
                    } ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                    } hover:bg-gray-100 ${
                      selectedRows.includes(row.id)
                        ? "bg-green-50/80 hover:bg-green-100"
                        : ""
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                    onDoubleClick={() =>
                      onRowDoubleClick && onRowDoubleClick(row)
                    }
                  >
                    {/* Regular columns */}
                    {columns
                      .filter((col) =>
                        effectiveVisibleColumns.includes(col.key)
                      )
                      .map((col) => (
                        <td
                          key={col.key}
                          className={`py-3 whitespace-nowrap ${
                            col.key === "checkbox" ? "px-2" : "px-4"
                          } ${
                            col.width || (col.key === "checkbox" ? "" : "min-w-[100px]")
                          }`}
                          style={{ width: col.width || (col.key === "checkbox" ? "40px" : "auto") }}
                        >
                          {col.render
                            ? col.render(row) // Pass entire row object, not just value
                            : row[col.key]}
                        </td>
                      ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="grid items-center justify-between grid-cols-2 gap-2 px-4 pb-4 mt-4 sm:grid-cols-3 md:gap-0">
        <div className="flex items-center gap-2 mb-2 md:mb-0 relative z-[1]">
          <span className="text-xs text-[#172b4d] whitespace-nowrap">Rows per page:</span>
          <ButtonDropdown
            buttonContent={
              <span className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 text-gray-700 min-w-[72px] justify-between">
                <span>{itemsPerPage}</span>
                <ChevronDown size={14} className="shrink-0" />
              </span>
            }
            buttonClassName="inline-flex"
            options={itemsPerPageOptions.map((v) => ({
              label: String(v),
              value: v,
              onClick: () => onItemsPerPageChange(v),
            }))}
          />
        </div>
        <div className="text-xs text-[#172b4d] mb-2 md:mb-0 flex justify-center">
          {totalResults === 0 ? (
            "Showing 0 of 0 results"
          ) : data.length === 0 ? (
            "Showing 0 of 0 results"
          ) : (
            <>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalResults)} of&nbsp;
              <span className="font-bold"> {totalResults}</span>&nbsp; results
            </>
          )}
        </div>
        <div className="flex items-center justify-center col-span-2 gap-2 md:justify-end sm:col-span-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 border border-gray-300 rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-gray-700 hover:bg-gray-50"
          >
            <ChevronsLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 border border-gray-300 rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5 && currentPage > 3) {
              if (currentPage + 2 > totalPages) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-[26px] h-[26px] rounded-lg text-sm border transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-[#17563a] text-white border-[#17563a]"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage + 2 < totalPages && (
            <span className="px-3 py-1 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 border border-gray-300 rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-gray-700 hover:bg-gray-50"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 border border-gray-300 rounded-lg bg-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
            text-gray-700 hover:bg-gray-50"
          >
            <ChevronsRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
