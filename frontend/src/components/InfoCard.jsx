import React from "react";

const InfoCard = ({ icon: Icon, count, label, loading, borderColor }) => {
  return (
    <div
      className={`border-b-2 ${borderColor} h-28 bg-white rounded-lg p-2 flex flex-row`}
    >
      <div className="w-16 h-16 bg-gray-300 rounded-full flex justify-center items-center my-auto mr-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col my-auto">
        <span className="text-2xl font-bold">
          {loading ? "Loading..." : count}
        </span>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default InfoCard;
