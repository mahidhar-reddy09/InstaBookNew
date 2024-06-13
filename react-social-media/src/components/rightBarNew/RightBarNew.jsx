import React, { useContext, useEffect, useState } from "react";
import "./rightBarNew.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RightBarNew = () => {
    const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  
    const { isLoading, error, data: suggestions } = useQuery({
      queryKey: ["suggestions"],
      queryFn: () => axios.get("http://localhost:8800/api/users/suggestions", { withCredentials: true }).then((res) => res.data),
    });
  
    const followMutation = useMutation({
      mutationFn: (userId) => axios.post("http://localhost:8800/api/relationships", { userId }, { withCredentials: true }),
      onSuccess: () => {
        queryClient.invalidateQueries(["suggestions"]);
      },
      onError: (error) => {
        console.error("Follow error:", error);
      },
    });

    console.log(suggestions)
  
    const handleFollow = (userId) => {
      followMutation.mutate(userId);
    };
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading suggestions</div>;


  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <span>Suggestions</span>
          {suggestions.map(user => (
            <div className='user' key={user.id}>
              <div className='userinfo'>
                <img src={`/public/upload/${user.profilePic}`} alt={user.username} onClick={() => navigate(`/profile/${user.id}`)}/>
                <span>{user.name}</span>
              </div>
              <div className="buttonsUser">
                <button onClick={() => handleFollow(user.id)}>Follow</button>
                <button>Message</button>
              </div>
            </div>
          ))}
          <div className="user">
            <div className="userinfo">
              <img src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"></img>
              <span>Jack</span>
            </div>
            <div className="buttonsUser">
              <button>Follow</button>
              <button>Message</button>
            </div>
          </div>

        </div>

        <div className="item">
          <span>Updates for you</span>
          <div className="user">
            <div className="userinfo">
              <img src="https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=2627&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <p>
                <span>Mahi </span>
                changed their cover photo
              </p>
            </div>
            <span>10 min ago</span>
          </div>

          <div className="user">
            <div className="userinfo">
              <img src="https://plus.unsplash.com/premium_photo-1671070290623-d6f76bdbb3db?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <p>
                <span>Josh </span>
                liked a post
              </p>
            </div>
            <span>30 min ago</span>
          </div>

          <div className="user">
            <div className="userinfo">
              <img src="https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <p>
                <span>Samuel </span>
                liked a comment
              </p>
            </div>
            <span>1 day ago</span>
          </div>

          <div className="user">
            <div className="userinfo">
              <img src="https://images.unsplash.com/photo-1506014739647-c231072489c4?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <p>
                <span>Lebron </span>
                posted
              </p>
            </div>
            <span>4 days ago</span>
          </div>
        </div>

        <div className="item">
          <span>Close Friends</span>
          <div className="user">
            <div className="userinfo">
              <img src="https://plus.unsplash.com/premium_photo-1663047342299-be7fdb28da60?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <div className="online"></div>
              <span>Johnson</span>
            </div>
          </div>

          <div className="user">
            <div className="userinfo">
              <img src="https://images.unsplash.com/photo-1491067852826-a60f365ff611?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <div className="online"></div>
              <span>Kyrie</span>
            </div>
          </div>

          <div className="user">
            <div className="userinfo">
              <img src="https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
              <div className="online"></div>
              <span>Timothy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBarNew;
