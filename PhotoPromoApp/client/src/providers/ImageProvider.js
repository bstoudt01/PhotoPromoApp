import React, { useContext, createContext, useState } from 'react';
import { UserProfileContext } from './UserProfileProvider';

export const ImageContext = createContext();

export const ImageProvider = (props) => {
    const apiUrl = "/api/image";
    const [singleImage3rdParty, setSingleImage3rdParty] = useState();
    const { getToken } = useContext(UserProfileContext);
    const [publicPhotoId, setPublicPhotoId] = useState();
    const [publicPhotoUserId, setPublicPhotoUserId] = useState();

    const [publicPhotoWidth, setPublicPhotoWidth] = useState();
    const [publicPhotoHeight, setPublicPhotoHeight] = useState();


    const addImage = (file) =>
        getToken().then((token) =>
            fetch(apiUrl, {
                method: "POST",
                body: file,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {

                if (resp.ok) {
                    return;
                }
                throw new Error("Image Upload Failed.")
            }));


    const deleteImage = (deletedImage) =>
        getToken().then((token) =>
            fetch(`${apiUrl}/${deletedImage.photoLocation}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(deletedImage)
            }).then(resp => {
                if (resp.ok) {
                    return;
                }
                throw new Error("Unauthorized");
            }));

    const getImageName = (imageName) => {
        if (imageName != undefined || imageName != null) {
            const getName = `${apiUrl}/${imageName}`

            return (getName)
        }
    };
    const getImageId = (imageId) => {

        if (imageId != undefined || imageId != null) {
            const getId = `${apiUrl}/${imageId}`

            return (getId)
        }
    };
    //if useparams doesnt work. remove it and try with strings from a searchh
    const decoder = new TextDecoder('utf-8')

    const getSingleImageThirdParty = (imageParams) => {

        if (imageParams != undefined) {

            const get3rdParty = `${apiUrl}/unique/${imageParams.photoId}/${imageParams.width}/${imageParams.height}/${imageParams.userId}`

            return (get3rdParty)



            // return fetch(`${apiUrl}/unique/${imageParams.photoId}/${imageParams.width}/${imageParams.height}/${imageParams.userId}`, {
            //     method: "GET"
            // }).then(resp => {
            //     const reader = resp.body.getReader();
            //     //.then(resp => {
            //     if (resp.ok) {
            //         debugger

            //         return new ReadableStream({
            //             start(controller) {
            //                 return pump();
            //                 function pump() {
            //                     return reader.read().then(({ done, value }) => {
            //                         // When no more data needs to be consumed, close the stream
            //                         if (done) {
            //                             controller.close();
            //                             return;
            //                         }
            //                         // Enqueue the next data chunk into our target stream
            //                         controller.enqueue(value);
            //                         return pump();
            //                     });
            //                 }
            //             }
            //         })


            //             // return resp.body.getReader().read().then(({ value, done }) => {
            //             //     console.log(decoder.decode(value))
            //             // })
            //             //.then((resp) => setSingleImage3rdParty(resp.url));

            //             //return resp.json().then((resp) => setSingleImage3rdParty(resp.url));
            //             .then(stream => new Response(stream))
            //             .then(response => response.blob())
            //             .then(blob => URL.createObjectURL(blob))
            //             .then(url => console.log(image.src = url))
            //             .catch(err => console.error(err));
            //     }
            //history.push("/gallery")
            //throw new Error("Unauthorized");
            // })
        }
    };


    return (
        <ImageContext.Provider value={{ getImageId, getImageName, addImage, deleteImage, getSingleImageThirdParty, singleImage3rdParty, setPublicPhotoId, setPublicPhotoWidth, setPublicPhotoHeight, setPublicPhotoUserId }}>
            {props.children}
        </ImageContext.Provider>
    );
};