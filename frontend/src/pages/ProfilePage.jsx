import { useNavigate } from "react-router-dom";
import ImgProfile from "../assets/Icons/profile.svg";
import EditProfileForm from "../components/EditProfileForm";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import { AiFillCloseCircle } from "react-icons/ai";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // fullscreen crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showFromEdit, setShowFromEdit] = useState(false);
  const [userData, setUserData] = useState({});
  const role = localStorage.getItem("role");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "https://server.diwd.cloud/api/v1/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(res.data?.data);
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 2 * 1024 * 1024
    ) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("File harus berupa gambar dan maksimal 2MB.");
    }
  };

  const handleUploadCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", croppedBlob);

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
      setUserData((prev) => ({ ...prev, image: uploadedImageUrl }));
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error("Upload gagal:", err);
      alert("Upload gambar gagal.");
    }
  };

  return (
    <div className="dark:text-white">
      <p className="text-2xl font-Inter font-semibold py-4">Detail Pengguna</p>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 font-Inter font-light">
        <div>
          <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 rounded-md py-6 px-4">
            <div className="relative w-60 h-60">
              {/* Preview Profil Bulat */}
              <img
                src={selectedImage || userData.image || ImgProfile}
                alt="Foto profile"
                className="w-60 h-60 rounded-full object-cover"
              />
              {(selectedImage || userData.image) && (
                <button
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 hover:bg-gray-200"
                  onClick={() => {
                    setSelectedImage(null);
                    setUserData((prev) => ({ ...prev, image: null }));
                  }}
                >
                  <AiFillCloseCircle size={20} />
                </button>
              )}
            </div>
            {/* Cropper Fullscreen */}
            {imageSrc && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="relative w-full max-w-3xl h-full max-h-[90vh] bg-gray-900 rounded-md overflow-hidden p-4">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(croppedArea, croppedAreaPixels) =>
                      setCroppedAreaPixels(croppedAreaPixels)
                    }
                    style={{
                      containerStyle: { width: "100%", height: "100%" },
                      cropAreaStyle: { borderRadius: "50%" }, // crop bulat
                    }}
                  />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full mt-2 z-50 relative"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 z-50">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded z-50"
                      onClick={() => setImageSrc(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded z-50"
                      onClick={handleUploadCroppedImage}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!imageSrc && (
              <div className="flex items-center justify-between gap-2 py-4 w-full">
                <span className="text-gray-700 dark:text-gray-300">
                  Unggah Foto :
                </span>
                <label
                  htmlFor="inputImage"
                  className="cursor-pointer flex items-center"
                >
                  <IoCloudUploadOutline className="w-6 h-6" />
                  <input
                    id="inputImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-3 bg-white dark:bg-gray-800 rounded-md mt-4">
            <p className="py-2">{userData.nama}</p>
            <p className="py-2 capitalize">{role}</p>
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
