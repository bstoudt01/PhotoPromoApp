import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../providers/UserProfileProvider";
import { GalleryContext } from "../../providers/GalleryProvider";
import { PhotoContext } from "../../providers/PhotoProvider";
import { Card, Button, Col, Row, Image, Form } from "react-bootstrap";
import GalleryOption from "./AddPhotoGalleryOption";
import { ImageContext } from "../../providers/ImageProvider";
export default function AddPhotoMultiple() {
    const { activeUser } = useContext(UserProfileContext);
    const { getAllGalleriesByUser, galleries } = useContext(GalleryContext);
    const { addPhoto } = useContext(PhotoContext);
    const { addImage } = useContext(ImageContext);
    const [imageName, setImageName] = useState();
    const [imageGalleryId, setImageGalleryId] = useState();
    const [imageAttribute, setImageAttribute] = useState();
    const [checked, setChecked] = useState(false);
    const handleClick = () => setChecked(!checked)

    //TRY to fix this, currently not getting file info from state from event input, instead using queryselector
    const [imageFile, setImageFile] = useState(null);

    const onChangeHandler = event => {
        debugger
        console.log(event.target.files[0])
        var files = event.target.files
        //if (this.maxSelectFile(event) && this.checkMimeType(event)) {
        // if return true allow to setState
        setImageFile(event.target.files)
        //}
    }

    const checkMimeType = (event) => {
        //getting file object
        let files = event.target.files
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type + ' is not a supported format\n';
            }
        };

        if (err !== '') { // if message not same old that mean has error 
            event.target.value = null // discard selected file
            console.log(err)
            return false;
        }
        return true;

    }

    const handleAddPhoto = (e) => {
        e.preventDefault();
        debugger
        const file = document.querySelector('input[type="file"]').files[0];

        const fileType = file.name.split('.').pop();
        const newImageName = `${new Date().getTime()}.${fileType}`
        console.log(imageFile, "StateimageFile")
        const formData = new FormData();
        for (var x = 0; x < imageFile.length; x++) {
            formData.append('file', imageFile[x])
        }
        addImage(formData);

        //formData.append('file', imageFile, newImageName);


        const newPhoto = {
            Name: imageName,
            PhotoLocation: newImageName,
            IsPublic: checked,
            Attribute: imageAttribute,

            GalleryId: parseInt(imageGalleryId),
            UserProfileId: activeUser.id
        }
        debugger
        // addImage(formData);

        addPhoto(newPhoto);

    };
    useEffect(() => {
        getAllGalleriesByUser(activeUser.id);

    }, []);


    return (
        <Col>
            <Card body>
                <Row>
                    <Col>
                        <Form onSubmit={handleAddPhoto} >
                            <Form.Group>
                                {/* <Form.File id="imageFile" label="Add Image" onChange={(e) => setImageFile(e.target.files[0])} /> */}

                                <Form.File id="imageFile" label="Add Image" multiple onChange={onChangeHandler} />

                            </Form.Group>
                            <Form.Group controlId="imageName">
                                <Form.Label>Name: </Form.Label>
                                <Form.Control type="text" placeholder="Photo Name" onChange={e => setImageName(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="imageName">
                                <Form.Label>Attribute: </Form.Label>
                                <Form.Control type="text" placeholder="Taken by...." onChange={e => setImageAttribute(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="imageGallery">
                                <Form.Label>Gallery Name</Form.Label>
                                <Form.Control as="select" onChange={e => setImageGalleryId(e.target.value)}>
                                    <option>Select Gallery</option>
                                    {
                                        galleries.map(g =>
                                            <GalleryOption key={g.id} gallery={g} />

                                        )
                                    }
                                </Form.Control>
                            </Form.Group>


                            <div className="mb-3">
                                <Form.Check type="checkbox" id="public">
                                    <Form.Check.Input type="checkbox" isValid onClick={handleClick} />
                                    <Form.Check.Label>{`Make this Public?`}</Form.Check.Label>
                                    <Form.Control.Feedback>Thanks for Sharing</Form.Control.Feedback>
                                </Form.Check>
                            </div>

                            <Form.Group>
                                <Button type="submit">Submit</Button>
                            </Form.Group>
                        </Form>

                    </Col>

                </Row>
            </Card >
        </Col >
    );
}