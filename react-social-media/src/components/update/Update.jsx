import React, { useState } from 'react';
import "./update.scss";
import { makeRequest } from '../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Update = ({ setOpenUpdate, user }) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        name: "",
        city: "",
        website: "",
    });

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "cover") {
            setCover(files[0]);
        } else if (name === "profile") {
            setProfile(files[0]);
        }
    };

    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (user) => makeRequest.put("/users", user),
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        },
        onError: (error) => {
            console.error("Update error:", error);
        }
    });

    const handleClick = async (e) => {
        e.preventDefault();
        let coverUrl = user.coverPic;
        let profileUrl = user.profilePic;
        try {
            if (cover) {
                coverUrl = await upload(cover);
            }
            if (profile) {
                profileUrl = await upload(profile);
            }
            mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
            setOpenUpdate(false);
        } catch (error) {
            console.error("Handle click error:", error);
        }
    };

    return (
        <div className="update">
            <div className="update-container">
                <h2>Update Profile</h2>
                <form>
                    <label>
                        Cover Picture
                        <input type="file" name="cover" onChange={handleFileChange} />
                    </label>
                    <label>
                        Profile Picture
                        <input type="file" name="profile" onChange={handleFileChange} />
                    </label>
                    <label>
                        Name
                        <input type="text" name="name" value={texts.name} onChange={handleChange} placeholder="Name" />
                    </label>
                    <label>
                        City
                        <input type="text" name="city" value={texts.city} onChange={handleChange} placeholder="City" />
                    </label>
                    <label>
                        Website
                        <input type="text" name="website" value={texts.website} onChange={handleChange} placeholder="Website" />
                    </label>
                    <button onClick={handleClick} className="update-button">Update</button>
                </form>
                <button onClick={() => setOpenUpdate(false)} className="close-button">X</button>
            </div>
        </div>
    );
};

export default Update;
