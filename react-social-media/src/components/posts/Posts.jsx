import React from 'react';
import './posts.scss';
import NewPost from '../newpost/NewPost.jsx';
import {
    useQuery,
} from '@tanstack/react-query'
import { makeRequest } from '../../axios.js';

const Posts = ({userId}) => {
    // Using the tanstack Query
    const { isFetching, error, data } = useQuery({
        queryKey: ['posts'],
        queryFn: () => makeRequest.get('/posts?userId=' + userId).then(res => res.data)
    });

    console.log(data);

    if (isFetching) return <div className='posts'>Loading...</div>;
    if (error) return <div className='posts'>Error: {error.message}</div>;

    return (
        <div className='posts'>
            {data && data.length > 0 ? (
                data.map(post => (
                    <NewPost post={post} key={post.id} />
                ))
            ) : (
                <div>No posts available</div>
            )}
        </div>
    );
};

export default Posts;
