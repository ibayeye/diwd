import React, { useMemo, useState } from "react";
import { RiEditFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { CgSortAz, CgSortZa } from "react-icons/cg";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import Lottie from "lottie-react";
import Load from "./ReportError/load.json";
import LoadDark from "./ReportError/load_dark.json";

const TableWrapper = ({
  columns,
  data = [],
  loading,
  error,
  onEdit,
  onDelete,
  ItemsPage = 10,
  pageType = "user",
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrrentpage] = useState(1);
  const defaultKey = columns[0]?.key || "";
  const [sortConfig, setSortConfig] = useState({
    key: defaultKey,
    direction: "asc",
  });

  const filteredData = useMemo(() => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter((item) =>
        columns.some((col) =>
          String(item[col.key] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, columns, search, sortConfig]);

  const totalPage = Math.ceil(filteredData.length / ItemsPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ItemsPage,
    currentPage * ItemsPage
  );

  const handlePrevPage = () => setCurrrentpage((prev) => Math.max(prev - 1, 1));
  const handlNextPage = () =>
    setCurrrentpage((prev) => Math.min(prev + 1, totalPage));

  if (loading)
    return (
      <div className="w-32 h-32 mx-auto">
        <div className="block dark:hidden">
          <Lottie animationData={Load} className="w-full h-full" />
        </div>
        <div className="hidden dark:block">
          <Lottie animationData={LoadDark} className="w-full h-full" />
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border dark:bg-gray-700">
      {/* Search & Sort */}
      <div className="flex justify-end gap-2 mb-4 dark:text-white">
        <button
          onClick={() =>
            setSortConfig((prev) => ({
              key: defaultKey,
              direction: prev.direction === "asc" ? "desc" : "asc",
            }))
          }
          className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer dark:text-white"
        >
          {sortConfig.direction === "asc" ? <CgSortAz /> : <CgSortZa />}
        </button>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrrentpage(1);
          }}
          className="dark:bg-gray-700 dark:text-white p-2 border border-gray-300 rounded sm:w-auto w-full"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm">
          <thead className="bg-blue-500 text-white dark:bg-orange-500">
            <tr>
              <th className="p-2 text-center">No</th>
              {columns.map((col) => (
                <th key={col.key} className="text-start">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900 dark:text-white"
                  }
                >
                  <td className="px-4 py-2 border-b font-medium text-center dark:border-none">
                    {(currentPage - 1) * ItemsPage + index + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-2 py-1 border-b max-w-[120px] truncate text-xs md:text-sm dark:border-none"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="flex justify-center items-center gap-1 py-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row.id)}
                          className="bg-blue-500 dark:bg-orange-500 w-10 h-8 rounded-md flex justify-center items-center text-white"
                        >
                          {pageType === "user" ? <RiEditFill /> : <BsEyeFill />}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row.id)}
                          className="bg-red-500 dark:bg-red-700 w-10 h-8 rounded-md flex justify-center items-center text-white"
                        >
                          <MdDeleteForever />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-6 text-gray-500 dark:text-gray-300"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 dark:text-white">
          <button
            onClick={handlePrevPage}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPage}
          </span>
          <button
            onClick={handlNextPage}
            disabled={currentPage === totalPage}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            <MdKeyboardDoubleArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableWrapper;
