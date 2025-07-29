import { useNavigate } from "react-router-dom";
import ImgProfile from "../assets/Icons/profile.svg";
import EditProfileForm from "../components/EditProfileForm";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFromEdit, setShowFromEdit] = useState(false);
  const [userData, setUserData] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("https://server.diwd.cloud/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data?.data;
        setUserData(user);
        setRole(user?.role || "");
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        alert("Sesi Anda habis. Silakan login ulang.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const profileFields = [
    { label: "Nama Lengkap :", value: userData.nama },
    { label: "NIP :", value: userData.nip },
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "https://server.diwd.cloud/file-upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const uploadedImageUrl = res.data.data.url;

        setSelectedImage(uploadedImageUrl);
        setUserData((prev) => ({
          ...prev,
          image: uploadedImageUrl,
        }));
      } catch (err) {
        console.error("Upload gagal:", err);
        alert("Upload gambar gagal.");
      }
    } else {
      alert("File harus berupa gambar dan maksimal 2MB.");
    }
  };

  return (
    <div className="dark:text-white">
      <p className="text-2xl font-Inter font-semibold py-4">Detail Pengguna</p>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 font-Inter font-light">
        <div>
          <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-md py-6 px-4">
            <img
              src={selectedImage || userData.image || ImgProfile}
              alt="Foto profile"
              className="w-60 h-60 rounded-md object-cover"
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
            <p className="py-2 capitalize">{role === 2 ? "Super Admin" : role === 1 ? "Admin" : role === 0 ? "Pengguna" : "Tidak Ditemukan Role"}</p>
          </div>
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-md my-2 md:mt-4 p-2">
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
                setUserData(updatedData);
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

export default ProfilePage;
