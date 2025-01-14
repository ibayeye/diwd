import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProfileForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const userData = JSON.parse(Cookies.get("userData") || "{}");

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove(userData.token)
    navigate('/login')
    console.log('token dihappus',userData.username)
  };

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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-4xl">
        {/* Tombol Back */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          Back
        </button>

        {/* Konten Profil */}
        <div className="grid grid-cols-3 text-center h-96">
          {/* Bagian Kiri: Foto Profil */}
          <div className="border-e-2 flex flex-col items-center p-4">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-52 h-52 object-cover rounded-full"
              />
            ) : (
              <div className="bg-gray-200 h-24 w-28 m-4 flex items-center justify-center">
                Pilih file
              </div>
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
                className="bg-red-400 px-4 py-2 rounded text-white"
              >
                Remove Image
              </button>
            )}
            <button
              className="bg-red-400 rounded-md mt-4 px-4 py-2 text-white"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          {/* Bagian Kanan: Data Profil */}
          <div className="col-span-2 grid grid-cols-2 p-4">
            <div>
              <div className="text-start m-2">
                Nama Lengkap
                <div className="bg-white border border-black rounded-md px-2 w-80">
                  {userData.nama || "Guest"}
                </div>
              </div>
              <div className="text-start m-2">
                Username
                <div className="bg-white border border-black rounded-md px-2">
                  {userData.username || "Guest"}
                </div>
              </div>
              <div className="text-start m-2">
                Email
                <div className="bg-white border border-black rounded-md px-2">
                  {userData.email || "Guest"}
                </div>
              </div>
              <div className="text-start m-2">
                NIP
                <div className="bg-white border border-black rounded-md px-2">
                  {userData.nip || "Guest"}
                </div>
              </div>
            </div>
            <div>
              <div className="text-start m-2">
                Nomor Telepon
                <div className="bg-white border border-black rounded-md px-2">
                  {userData.no_hp || "Guest"}
                </div>
              </div>
              <div className="grid grid-cols-2 m-2 text-white">
                <button className="bg-blue-400 border hover:bg-blue-500 rounded-md m-2 px-4 py-2">
                  Edit
                </button>
                <button className="bg-green-400 border hover:bg-green-500 rounded-md m-2 px-4 py-2">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
