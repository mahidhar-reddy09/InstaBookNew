import React, { useContext, useEffect, useState } from "react";
import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone.js";
import LinkedInIcon from "@mui/icons-material/LinkedIn.js";
import InstagramIcon from "@mui/icons-material/Instagram.js";
import PinterestIcon from "@mui/icons-material/Pinterest.js";
import TwitterIcon from "@mui/icons-material/Twitter.js";
import PlaceIcon from "@mui/icons-material/Place.js";
import LanguageIcon from "@mui/icons-material/Language.js";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined.js";
import MoreVertIcon from "@mui/icons-material/MoreVert.js";
import Posts from "../../components/posts/Posts.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
import Update from "../../components/update/Update.jsx";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);
  console.log(userId);
  console.log(currentUser.id);


  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const {
    isLoading: relationshipLoading,
    error: relationshipError,
    data: relationshipData,
  } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest
        .get(`/relationships?followedUserId=${userId}`)
        .then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () =>
      relationshipData.includes(currentUser.id)
        ? makeRequest.delete("/relationships", { data: { userId } })
        : makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["relationship"]);
    },
    onError: (error) => {
      console.error("Follow/Unfollow error:", error);
    },
  });

  const handleFollow = (e) => {
    likeMutation.mutate();
  };

  if (isLoading || relationshipLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data: {userError.message}</div>;
  if (relationshipError)
    return <div>Error loading relationships: {relationshipError.message}</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data.coverPic ? `/public/upload/` + data.coverPic : ""}
          alt=""
          className="cover"
        />
        <img
          src={data.profilePic ? `/public/upload/` + data.profilePic : ""}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="userinfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 70px" }}>
        {relationshipData.includes(currentUser.id) && <Posts userId={userId} />}
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};
 
export default Profile;
