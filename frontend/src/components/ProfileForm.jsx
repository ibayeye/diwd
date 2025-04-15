import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Komponen untuk menampilkan field profil
const ProfileField = ({ label, value }) => (
  <div className="text-start m-2">
    <label className="block font-medium">{label}</label>
    <div className="bg-white border border-gray-300 rounded-sm px-2 h-10 flex items-center">
      {value || "Tidak tersedia"}
    </div>
  </div>
);

const ProfileForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // Data pengguna dari cookie
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};

  // Field profil untuk ditampilkan
  const profileFields = [
    { label: "Nama Lengkap", value: userData.nama },
    { label: "Username", value: userData.username },
    { label: "Email", value: userData.email },
    { label: "NIP", value: userData.nip },
    { label: "Nomor Telepon", value: userData.no_hp },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userData");
    navigate("/login");
    console.log("Token dihapus. Token:", userData.token || "Guest");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File yang dipilih bukan gambar!");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File terlalu besar! Maksimum 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar?")) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="fixed bg-gray-500 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-lg h-5/6 w-3/4 max-w-2xl">
        {/* Tombol Back */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-700"
        >
          Back
        </button>

        {/* Konten Profil */}
        <div className="grid grid-cols-3 text-center">
          {/* Bagian Kiri: Foto Profil */}
          <div className="border-e-2 flex flex-col items-center p-4">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="object-cover rounded-full h-28 w-28"
              />
            ) : (
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="bg-gray-300 h-28 w-28 m-4 flex items-center justify-center rounded-full cursor-pointer"
              >
                <span>Upload Image</span>
              </div>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {selectedImage && (
              <button
                onClick={handleRemoveImage}
                className="bg-red-400 px-4 py-2 rounded text-white mt-2"
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
            {profileFields.map(({ label, value }) => (
              <ProfileField key={label} label={label} value={value} />
            ))}
            <div className="col-span-2 flex justify-around mt-4">
              <button className="bg-blue-400 border hover:bg-blue-500 rounded-sm px-4 py-2">
                Edit
              </button>
              <button className="bg-green-400 border hover:bg-green-500 rounded-sm px-4 py-2">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
