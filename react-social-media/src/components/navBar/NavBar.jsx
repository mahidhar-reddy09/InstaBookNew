import React, { useContext } from 'react';
import './navBar.scss';
import { Link, useNavigate } from 'react-router-dom';

// Use MUI good library
import BungalowIcon from '@mui/icons-material/Bungalow';
import ContrastIcon from '@mui/icons-material/Contrast';
import AppsIcon from '@mui/icons-material/Apps';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

const NavBar = () => {

    const {toggle} = useContext(DarkModeContext)
    const {currentUser, logout} = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8800/api/auth/logout', {}, {
                withCredentials: true
            });
            logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <div className='navbar'>
            <div className='left'>
                <Link to = "./" style={{textDecoration: "none"}}>
                    <span>InstaBookGram</span>
                </Link>
                <BungalowIcon onClick = {() => navigate("./")} style={{cursor: "pointer"}}/>
                <ContrastIcon onClick = {toggle} style={{cursor: "pointer"}}/>
                <AppsIcon/>
                <div className='search'>
                    <SearchIcon/>
                    <input type='text' placeholder='Find...'></input>
                </div>
            </div>
            <div className='right'>
                <AccountCircleIcon onClick = {() => navigate(`/profile/${currentUser.id}`)} style={{cursor: "pointer"}}/>
                <EmailIcon/>
                <NotificationsIcon/>
                <div className='user' onClick = {() => navigate(`/profile/${currentUser.id}`)} style={{cursor: "pointer"}}>
                    <img src={`/public/upload/` + currentUser.profilePic} alt=""/>
                    <span>{currentUser.name}</span>
                </div>
                <LogoutIcon onClick = {handleLogout} style={{cursor: "pointer"}}/>
            </div>            
        </div>
    );
};

export default NavBar;