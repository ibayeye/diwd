import React, { useMemo, useState } from "react";

const TableWrapper = ({
  columns,
  data = [],
  loading,
  error,
  onEdit,
  onDelete,
  ItemsPage = 10,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrrentpage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border">
      <div>
        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrrentpage(1);
          }}
          className="className=w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="border-b cursor-pointer text-start"
                >
                  {col.label}{" "}
                  {sortConfig.key === col.key &&
                    (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                </th>
              ))}
              {(onEdit || onDelete) && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td>
                      {onEdit && (
                        <button type="button" onClick={() => onEdit(row)}>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button type="button" onClick={() => onDelete(row)}>
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1}> No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPage > 1 && (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPage}
          </span>
          <button onClick={handlNextPage} disabled={currentPage === totalPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TableWrapper;
