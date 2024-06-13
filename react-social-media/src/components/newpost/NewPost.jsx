import React, { useContext, useState } from 'react';
import './newpost.scss';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined.js";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined.js";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined.js";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined.js";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz.js";
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments.jsx';
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { AuthContext } from '../../context/authContext.jsx';

const NewPost = ({ post }) => {
    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ["likes", post.id],
        queryFn: () =>
            makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
    });

    const liked = data?.includes(currentUser.id);

    const likeMutation = useMutation({
        mutationFn: () =>
            liked
                ? makeRequest.delete("/likes", { data: { postId: post.id } })
                : makeRequest.post("/likes", { postId: post.id }),
        onSuccess: () => {
            queryClient.invalidateQueries(["likes"]);
        },
        onError: (error) => {
            console.error("Like/Unlike error:", error);
        },
    });

    const handleLike = (e) => {
        likeMutation.mutate();
    };

    const deleteMutation = useMutation({
        mutationFn: (postId) => 
            makeRequest.delete(`/posts/${postId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
        onError: (error) => {
            console.error("Delete post error:", error);
        },
    });

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    }

    return (
        <div className="post">
            <div className="container">
                <div className="user">
                    <div className="userinfo">
                        <img src={`/public/upload/` + post.profilePic} alt="" />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: 'inherit' }}>
                                <span className='name'>{post.name}</span>
                            </Link>
                            <span className='date'>{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
                    {menuOpen && <button className="delete-button" onClick={handleDelete}>Delete</button>}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={"/public/upload/" + post.img} alt='' />
                </div>
                <div className="info">
                    <div className="item">
                        {liked ? (
                            <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                        ) : (
                            <FavoriteBorderOutlinedIcon onClick={handleLike} />
                        )}
                        {data ? data.length : 0} Likes
                    </div>
                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        Comments
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={post.id} />}
            </div>
        </div>
    );
};

export default NewPost;
