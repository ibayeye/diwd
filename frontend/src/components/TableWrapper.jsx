import React, { useMemo, useState } from "react";
import { RiEditFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { CgSortAz } from "react-icons/cg";
import { CgSortZa } from "react-icons/cg";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import Lottie from "lottie-react";
import Load from "./ReportError/load.json";
import LoadDark from "./ReportError/load_dark.json";

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handlePrevPage = () => setCurrrentpage((prev) => Math.max(prev - 1, 1));
  const handlNextPage = () =>
    setCurrrentpage((prev) => Math.min(prev + 1, totalPage));

  if (loading)
    return (
      <div className="">
        <Lottie animationData={isDarkMode ? LoadDark : Load} className="w-32 h-32 mx-auto" />
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border dark:bg-gray-700 ">
      <div className="flex justify-end mb-2 dark:text-white">
        <button
          onClick={() =>
            setSortConfig((prev) => ({
              key: defaultKey,
              direction: prev.direction === "asc" ? "desc" : "asc",
            }))
          }
          // disabled={!sortConfig.key}
          className="px-3 py-2 border rounded disabled:opacity-50 cursor-pointer mr-2 dark:text-white"
        >
          {sortConfig.direction === "asc" ? <CgSortAz /> : <CgSortZa />}
        </button>
        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrrentpage(1);
          }}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm">
          <thead className="bg-blue-500 text-white dark:bg-orange-500">
            <tr>
              <th className=" p-2 text-center">No</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  // onClick={() => handleSort(col.key)}
                  className="text-start"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="">Aksi</th>
              )}
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
                    <td className="flex justify-center items-center">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row.id)}
                          className="bg-blue-500 dark:bg-orange-500 w-10 h-8 k m-1 rounded-md flex justify-center items-center"
                        >
                          {pageType === "user" ? <RiEditFill /> : <BsEyeFill />}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row.id)}
                          className="bg-red-500 dark:bg-red-700 w-10 rounded-md m-1 h-8 flex justify-center items-center"
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
                  className="text-center py-6 text-gray-500"
                >
                  {" "}
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPage > 1 && (
        <div className="flex justify-center items-center my-3 dark:text-white">
          <button onClick={handlePrevPage} className="">
            <MdKeyboardDoubleArrowLeft className=" w-full h-6" />
          </button>
          <span className="mx-3 text-sm">
            Page {currentPage} of {totalPage}
          </span>
          <button onClick={handlNextPage} disabled={currentPage === totalPage}>
            <MdKeyboardDoubleArrowRight className=" w-full h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableWrapper;
