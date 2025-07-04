import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImgProfile from "../assets/Icons/profile.svg";
import EditeForm from "./EditeForm";
import EditProfileForm from "./EditProfileForm";
const ProfileForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFromEdit, setShowFromEdit] = useState(false);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  const role = localStorage.getItem("role");

  const profileFields = [
    { label: "Nama Lengkap :", value: userData.nama },
    { label: "NIP :", value: userData.nip },
    // { label: "Username :", value: userData.username },
    { label: "Email :", value: userData.email },
    { label: "Nomor Telepon :", value: userData.no_hp },
    { label: "Alamat :", value: userData.address },
  ];

  const ProfileField = ({ label, value }) => (
    <div className="text-start m-2">
      <label>{label}</label>
      <div className="border my-3 p-2 rounded-md">
        {value || "Tidak tersedia"}
      </div>
    </div>
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 2 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dark:text-white">
      <p className="text-2xl font-Inter font-semibold py-4">Detail Pengguna</p>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 font-Inter font-light ">
        <div>
          <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-md py-6 px-4">
            <img
              src={selectedImage || ImgProfile}
              alt=""
              className="w-60 h-60 rounded-md"
            />
            <label
              htmlFor="inputImage"
              className="cursor-pointer border border-blue-500 dark:border-orange-500 rounded-md w-full h-8 flex justify-center my-2"
            >
              Unggah Foto
              <input
                id="inputImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col justify-center p-3 bg-white dark:bg-gray-800 rounded-md mt-4">
            <p className="py-2">{userData.nama}</p>
            <p className="py-2">{role}</p>
          </div>
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-md mt-4 p-2">
            <p>Edit Akun Pengguna :</p>
            <button
              className="bg-blue-500 dark:bg-orange-500 rounded-md text-white p-2"
              onClick={() => setShowFromEdit(!showFromEdit)}
            >
              {showFromEdit ? "Batal" : "Edit akun"}
            </button>
          </div>
          {showFromEdit && (
            <EditProfileForm
              dataPengguna={userData}
              onClose={() => setShowFromEdit(false)}
              onUpdateSuccess={(updatedData) => {
                localStorage.setItem("userData", JSON.stringify(updatedData));
                setUserData(updatedData); // ⬅️ Refresh tanpa reload
                setShowFromEdit(false);
              }}
            />
          )}
        </div>

        <div className="col-span-2 p-4 bg-white dark:bg-gray-800 rounded-md">
          <p className="text-lg font-semibold">Informasi Data Pengguna</p>
          <div className="py-4">
            {profileFields.map(({ label, value }) => (
              <ProfileField key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
