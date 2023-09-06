import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserPlaceholder = ({ setUserData, userData }) => {
  const { id } = useParams();
  //const location = useLocation().pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await axios.get(`/users/find/${id}`);
        setUserData(userProfile.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [id]);

  return <div>{userData?.username}</div>;
};

export default UserPlaceholder;
