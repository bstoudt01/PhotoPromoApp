﻿using PhotoPromo.Models;
using System.Collections.Generic;

namespace PhotoPromo.Repositories
{
    public interface IPhotoRepository
    {
        List<Photo> GetAllPhotosByUserProfileId(int userProfileId);
        
        List<Photo> GetPhotosByGalleryId(int galleryId);
        
        Photo GetSinglePhotobyId(int id);
        Photo GetRandomSinglePhoto();


        void Add(Photo photo);
        
        void Update(Photo photo);
        
        void Delete(int id);

    }
}