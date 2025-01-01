import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleBack = () => {
    navigate(-1);  // Kembali ke halaman sebelumnya
  };

  let pengguna = null;
  try {
    const penggunaJSON = localStorage.getItem("pengguna");
    pengguna = penggunaJSON ? JSON.parse(penggunaJSON) : null;
  } catch (error) {
    console.error("Error parsing pengguna:", error);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="justify-start items-start w-5/6" onClick={handleBack}><button onClick={handleBack}>Back</button></div>
      <div className="grid grid-cols-3 text-center border-2 h-96">
        <div className="border-e-2 flex flex-col items-center p-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-52 h-52 object-cover rounded-full"
            />
          ) : (
            <div className="bg-gray-200 h-24 w-28 m-4">pilih file</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="fileInput"
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer mt-2 mb-3"
          >
            Pilih Gambar
          </label>
          {selectedImage && (
            <button
              onClick={() => setSelectedImage(null)}
              className="bg-red-400"
            >
              remove image
            </button>
          )}
          <button
            className="bg-red-400 rounded-md mt-4"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        <div className="col-span-2 grid grid-cols-2 p-4">
          <div>
            <div className="text-start m-2">
              Nama Lengkap
              <div className="bg-white border border-black rounded-md px-2 w-80">
                {pengguna ? pengguna.username.nama : "Guest"}
              </div>
            </div>
            <div className="text-start m-2">
              Username
              <div className="bg-white border border-black rounded-md px-2">
                {pengguna ? pengguna.username.username : "Guest"}
              </div>
            </div>
            <div className="text-start m-2">
              Email
              <div className="bg-white border border-black rounded-md px-2">
                {pengguna ? pengguna.username.email : "Guest"}
              </div>
            </div>
            <div className="text-start m-2">
              NIP
              <div className="bg-white border border-black rounded-md px-2">
                {pengguna ? pengguna.username.nip : "Guest"}
              </div>
            </div>
          </div>
          <div className="">
            <div className="text-start m-2">
              Nomor Telepon
              <div className="bg-white border border-black rounded-md px-2">
                {pengguna ? pengguna.username.no_hp : "Guest"}
              </div>
            </div>

            <div className="grid grid-cols-2 m-2 text-white">
              <div className="bg-blue-400 border hover:bg-blue-500 rounded-md m-2">
                Edit
              </div>
              <div className="bg-green-400 border hover:bg-green-500 rounded-md m-2">
                Save
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
