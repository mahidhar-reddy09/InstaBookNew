import React, { useContext } from 'react';
import './stories.scss'
import { AuthContext } from '../../context/authContext';

const Stories = () => {

    const {currentUser} = useContext(AuthContext)

    // Temporary Dummy Data
    const stories = [
        {
            id:1, 
            name:"Karen",
            img: "https://images.unsplash.com/photo-1544894079-4184d7a29169?q=80&w=2770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id:2, 
            name:"Beck",
            img: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

        },
        {
            id:3, 
            name:"Leet",
            img: "https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id:4, 
            name:"Stark",
            img: "https://images.unsplash.com/photo-1522860747050-bb0c1af38ae9?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]
    return (
        <div className='stories'>
                <div className='story'>
                    <img src = {`/public/upload/` + currentUser.profilePic}></img>
                    <span>{currentUser.name}</span>
                    <button>+</button>
                </div>
            {stories.map(story => (
                <div className='story' key={story.id}>
                    <img src = {story.img}></img>
                    <span>{story.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Stories;