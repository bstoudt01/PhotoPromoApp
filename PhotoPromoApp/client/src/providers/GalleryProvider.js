import React, { useState, createContext, useContext } from "react";

import { useHistory } from "react-router-dom";

import { UserProfileContext } from "./UserProfileProvider";

export const GalleryContext = createContext();

export function GalleryProvider(props) {
    const apiUrl = "/api/gallery";

    const history = useHistory();

    const [galleries, setGalleries] = useState([]);
    const [gallery, setGallery] = useState([]);




    const { getToken } = useContext(UserProfileContext);

    const getAllGalleriesByUser = (userProfileId) =>
        getToken().then((token) =>
            fetch(`${apiUrl}/UserProfile/${userProfileId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
                .then(setGalleries));

    const getSingleGallery = (id) =>
        getToken().then((token) =>
            fetch(`${apiUrl}/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                if (resp.ok) {
                    return resp.json().then(setGallery);
                }
                history.push("/gallery")
                //throw new Error("Unauthorized");
            }));

    const addGallery = (gallery) =>
        getToken().then((token) =>
            fetch("/api/gallery", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(gallery)
            }).then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            }));

    const updateGallery = (updatedGallery) =>
        getToken().then((token) =>
            fetch(`/api/gallery/${updatedGallery.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedGallery)

            }).then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            }));


    const deleteCategory = (deletedCategory) =>
        getToken().then((token) =>
            fetch(`/api/category/${deletedCategory.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(deletedCategory)
            }).then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error("Unauthorized");
            }));
    return (
        <GalleryContext.Provider value={{ getToken, galleries, gallery, getAllGalleriesByUser, getSingleGallery, addGallery, updateGallery }}>
            {props.children}
        </GalleryContext.Provider>
    );
}