const EarthquakeReport = () => {
  return (
    <div>
      <div className="h-full rounded-md bg-white shadow-md p-4">
        Seismic Activity
        <div className="grid grid-cols-2 mt-4">
          <div>Last 24 hours</div>
          <div className="grid grid-cols-6 gap-4 justify-center items-center ml-20 ">
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer rounded-sm">
              24 H
            </div>
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer">
              24 H
            </div>
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer">
              24 H
            </div>
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer">
              24 H
            </div>
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer">
              24 H
            </div>
            <div className="bg-slate-200 hover:bg-black hover:text-white text-center cursor-pointer">
              24 H
            </div>
          </div>
        </div>
        <div className="h-80 bg-slate-200 mt-4 rounded-md"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 h-full mt-4 rounded-md">
        <div className="bg-white shadow-md p-4 rounded-md">
          Magnitude - This Month
          <div className="bg-slate-200 h-96 mt-4"></div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          Depth - This Month
          <div className="bg-slate-200 h-96 mt-4"></div>
        </div>
      </div>
      <button className="bg-black text-white rounded-md mt-4 px-4 py-2">
        Export
      </button>
    </div>
  );
};

export default EarthquakeReport;
