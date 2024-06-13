import React from 'react';
import './home.scss'
import Posts from '../../components/posts/Posts';
import Stories from '../../components/stories/Stories';
import Share from '../../components/share/Share';

const Home = () => {
    return (
        <div className='home'>
            <Stories/>
            <Share/>
            <Posts/>
            {/* <h1 style={{margin: "0"}}>Home</h1>
            <h1 style={{margin: "0"}}>Home</h1> */}
        </div>
    )
}

export default Home