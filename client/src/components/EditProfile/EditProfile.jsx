import React, { useState, useEffect, useCallback } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import app from "../../firebase";
import axios from "axios";
import { changeProfile, logout } from "../../redux/userSlice";
import { Link } from "react-router-dom";

const EditProfile = ({ setOpen }) => {
  const [img, setImg] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const uploadImg = useCallback((file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            await axios.put(`/users/${currentUser._id}`, {
              profilePicture: downloadURL,
            });
          } catch (err) {
            console.log("error", err);
          }

          dispatch(changeProfile({ profilePicture: downloadURL }));
        });
      }
    );
  }, []);

  useEffect(() => {
    img && uploadImg(img);
  }, [img, uploadImg]);

  const handleDelete = async () => {
    await axios.delete(`/users/${currentUser._id}`);
    dispatch(logout());
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
      <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          X
        </button>
        <h2 className="font-bold text-xl">Edit Profile</h2>
        <p>Choose a new profile picture</p>
        {imgUploadProgress > 0 ? (
          "Uploading " + imgUploadProgress + "%"
        ) : (
          <input
            type="file"
            className="bg-transparent border border-slate-500 rounded p-2"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}

        <p>Delete account</p>
        <Link to="/signin">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 rounded-full"
          >
            Delete Account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
