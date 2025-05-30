import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FcEditImage } from "react-icons/fc";
import ImgProfile from "../assets/Icons/profile.svg";
import EditeForm from "./EditeForm";
// Komponen untuk menampilkan field profil

const ProfileForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  // Data pengguna dari cookie
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : {};

  const role = localStorage.getItem("role");
  // Field profil untuk ditampilkan
  const profileFields = [
    { label: "Nama Lengkap :", value: userData.nama },
    { label: "NIP :", value: userData.nip },
    { label: "Username :", value: userData.username },
    { label: "Email :", value: userData.email },
    { label: "Nomor Telepon :", value: userData.no_hp },
    { label: "Alamat :", value: userData.addres },
  ];

  const ProfileField = ({ label, value }) => (
    <div className="text-start m-2">
      <label className="">{label}</label>
      <div className="border my-3 p-2 rounded-md">
        {value || "Tidak tersedia"}
      </div>
    </div>
  );

  const nav =()=>{
    navigate("/editform")
  }

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

  const [showFromEdit, setShowFromEdit] = useState(false);

  return (
    <div>
      <p className="text-2xl font-Inter font-semibold py-4">Detail Pengguna</p>
      <div className="grid grid-cols-3 gap-4 font-Inter font-light">
        <div>
          <div className="flex flex-col justify-center items-center bg-white rounded-md py-6 px-4">
            <img
              src={selectedImage || ImgProfile}
              alt=""
              className="w-60 h-72"
            />
            <label
              htmlFor="inputImage"
              className="cursor-pointer border border-blue-500 rounded-md w-full h-8 flex justify-center"
            >
              Unggah Foto
              <input
                id="inputImage"
                type="file"
                accept="image/"
                alt="Unggah Foto"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col justify-center p-3 bg-white rounded-md mt-4">
            <p className="py-2">{userData.username}</p>
            <p className="py-2">{role}</p>
          </div>
          <div className="flex justify-between items-center bg-white rounded-md mt-4 p-2">
            <p>Edit Akun Pengguna :</p>
            <button className="bg-blue-500 rounded-md text-white p-2" onClick={()=> setShowFromEdit(!showFromEdit)}>
              
                {showFromEdit ? "batal" : "Edit akun"}
              
            </button>
            {showFromEdit && (
              <div className="">
                <EditeForm dataPengguna = {userData} onClose={() => setShowFromEdit(false)}/>
              </div>
            )}
          </div>
          {/* <button
          className="bg-red-400 rounded-md mt-4 px-4 py-2 text-white"
          onClick={handleLogout}
        >
        Log Out
        </button> */}
        </div>

        <div className="col-span-2 p-4 bg-white rounded-md">
          <div className="py-4">
            {profileFields.map(({ label, value }) => (
              <ProfileField key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Bagian Kanan: Data Profil */}
      </div>
    </div>
  );
};

export default ProfileForm;
