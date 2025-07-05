import Lottie from "lottie-react";
import forbidden from "../assets/Icons/forbiden.json";

const UnauthorizedPage = () => (
  <div className="p-10 text-center">
    <div className="w-full flex justify-center">
      <Lottie animationData={forbidden} className="w-64 h-64" />
    </div>
    <h1 className="text-3xl font-bold">403 - Tidak Diizinkan</h1>
    <p>Kamu tidak punya akses ke halaman ini.</p>
  </div>
);

export default UnauthorizedPage;
