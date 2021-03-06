﻿using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using PhotoPromo.Models;
using PhotoPromo.Repositories;
using System.Linq;

namespace PhotoPromoApp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IWebHostEnvironment _webhost;
        private readonly IPhotoRepository _photoRepository;
        public ImageController(IWebHostEnvironment webhost, IPhotoRepository photoRepository)
        {
            _webhost = webhost;
            _photoRepository = photoRepository;
        }

        [HttpPost]
        public IActionResult Add(IFormFile file)
        {

            //where images are stored
            var savedImagePath = Path.Combine(_webhost.WebRootPath, "images/");
            try
            {
                using Image image = Image.Load(file.OpenReadStream());
                {
                    //1.4 MP 3:2
                    //Low Resolution Image Encoder
                    int maxWidthLowRes = 1440;
                    int newHeight = 0;
                    if (image.Width > maxWidthLowRes)
                    {
                        //saves image with width of 1440, height is determined by imagesharp to keep aspect ratio (set height to 0)
                        using (Image lowResCopy = image.Clone(x => x.Resize(maxWidthLowRes, newHeight)))
                        {
                            string FileName = "low_" + file.FileName;
                            lowResCopy.Save(savedImagePath + FileName);
                        }
                    }
                    else
                    {
                        //saves image with actual width and height
                        string FileName = "low_" + file.FileName;
                        image.Save(savedImagePath + FileName);
                    }
//                }
               // using Image imageCopy = Image.Load(file.OpenReadStream());
                //{

                    //24 MP 3:2
                    //High Resolution Image Encoder
                    //int newHeight = 0;
                    int maxWidthHighRes = 6016;
                    if (image.Width > maxWidthHighRes)
                    {
                        using (Image highResCopy = image.Clone(x => x.Resize(maxWidthHighRes, newHeight)))
                        {
                            string FileName = "high_" + file.FileName;
                            highResCopy.Save(savedImagePath + FileName);
                        }
                    }
                    else
                    {
                        string FileName = "high_" + file.FileName;
                        image.Save(savedImagePath + FileName);
                    }
                }

            }
            catch
            {
                return Conflict();
            }

            return Ok();
        }


        [HttpGet("{imageName}")]
        public IActionResult GetName(string imageName)
        {

            if (imageName != null)
            {
                var lowResImage = "low_" + imageName;
                var lowResImagePath = Path.Combine(_webhost.WebRootPath, "images/", lowResImage);
                if ((System.IO.File.Exists(lowResImagePath)))
                {
                    return File("images/" + lowResImage, "image/jpeg");                    
                }
            }
            return NoContent();
        }


        [HttpGet("{imageId:int}")]
        public IActionResult GetId(string imageId)
        {
            if (imageId != null)
            {

                Photo publicPhoto = _photoRepository.GetSinglePhotobyId(Int32.Parse(imageId));
                int index1 = publicPhoto.PhotoLocation.LastIndexOf('\\');
                if (index1 != -1)
                {
                    string imageName = publicPhoto.PhotoLocation.Substring(index1 + 1);
                    var highResImage = imageName.Insert(0, "high_");
                    var highResImagePath = Path.Combine(_webhost.WebRootPath, "images/", highResImage);
                    if ((System.IO.File.Exists(highResImagePath)))
                    {
                        return File("images/" + highResImage, "image/jpeg");
                    }

                }
            }
            return NoContent();
        }

        //Creates image sized similar to user requests, to keep aspect ratio of the image the same
        //Returns image with requested width but not necesarily height
        [HttpGet("custom/{photoId}/{width}/{userId}")]
        public IActionResult GetCustomImage(string photoId, string width, string userId)
        {

            if (photoId != null && photoId.All(char.IsDigit) && userId.All(char.IsDigit) && width.All(char.IsDigit))
            {
                var savedImagePath = Path.Combine(_webhost.WebRootPath, "images/");
                //Locate File by Name assoicated with Photo.Id
                Photo publicPhoto = _photoRepository.GetSinglePhotobyId(Int32.Parse(photoId));

                //publicPhoto.PhotoLocation holds the entire path, not just the file name, even though the photo table only shows the image filename
                if (publicPhoto == null || publicPhoto.UserProfileId != Int32.Parse(userId))
                {
                    //var UserIdStockImagePath = Path.Combine(_webhost.WebRootPath, "stockimages/", "404_not_found.webp");
                    //var UserIdStockImageFileStream = System.IO.File.OpenRead(UserIdStockImagePath);

                    //return File(UserIdStockImageFileStream, "image/jpeg");
                    return File("stockimages/" + "404_not_found.webp", "image/jpeg");


                }
                //Locate File by locating the index of last directory call
                int index1 = publicPhoto.PhotoLocation.LastIndexOf('\\');
                if (index1 != -1)
                {
                    //assign varialbe the file name pulled from  the file location 
                    string imageName = publicPhoto.PhotoLocation.Substring(index1 + 1);
                    // use the "high_" quality image uploaded
                    var highResImage = imageName.Insert(0, "high_");
                    var pathbyfullprop = Path.Combine(savedImagePath, highResImage);

                    using (var imageFileStream = System.IO.File.OpenRead(pathbyfullprop))
                    {

                        //Create Image instance from openRead fileStream path
                        using Image image = Image.Load(imageFileStream);
                        {
                            int customWidth = Convert.ToInt32(width);
                            if (image.Width >= customWidth)
                            {

                                //declare the image to be a custom size
                                string FileName = "custom_" + imageName;
                                //handle keeping aspect ratio by declaring a newHeight that matches the custom width
                                //var divisor = image.Width / customWidth;
                                //var newHeight = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));
                                int newHeight = 0;
                                //Resize the file in hand and save the new version, if this file already has a "custom_" tag it will be overwritten with this new mutation. 
                                //it would nice to call previously created images instead of making a new one but even better if i did that using a middleware like imagesharp.web
                                image.Mutate(x => x.Resize(customWidth, newHeight));

                                //Save the mutated file to the assigned path using the assigned file name
                                image.Save(savedImagePath + FileName);

                                //Load image and return to user
                                var Newpathbyfullprop = Path.Combine(savedImagePath, FileName);
                                var NewimageFileStream = System.IO.File.OpenRead(Newpathbyfullprop);
                                return File(NewimageFileStream, "image/jpeg");
                            }
                            else
                            {

                                //Load highest resolution image available and return to user
                                var Newpathbyfullprop = Path.Combine(savedImagePath, highResImage);
                                var NewimageFileStream = System.IO.File.OpenRead(Newpathbyfullprop);
                                return File(NewimageFileStream, "image/jpeg");
                            }
                        }
                    }
                }
            }
           
            return File("stockimages/"+"404_not_found.webp", "image/jpeg");

        }



        //Get Random Image this is marked as "IsPublic" by photographer in custom size
        //Creates image sized similar to user requests, to keep aspect ratio of the image the same
        [HttpGet("random/{width}")]
        public IActionResult GetRandomCustomImageByPublic(string width)
        {
            Photo randomPublicPhoto = _photoRepository.GetRandomSinglePhoto();


            if (randomPublicPhoto != null && width.All(char.IsDigit))
            {
                var savedImagePath = Path.Combine(_webhost.WebRootPath, "images/");
                //Locate File by Name assoicated with Photo.Id
                //Photo publicPhoto = _photoRepository.GetSinglePhotobyId(Int32.Parse(photoId));
                //publicPhoto.PhotoLocation holds the entire path, not just the file name, even though the photo table only shows the image filename

                //Locate File by locating the index of last directory call
                int index1 = randomPublicPhoto.PhotoLocation.LastIndexOf('\\');
                if (index1 != -1)
                {
                    //assign varialbe the file name pulled from  the file location 
                    string imageName = randomPublicPhoto.PhotoLocation.Substring(index1 + 1);
                    // use the "high_" quality encoded image
                    var highResImage = imageName.Insert(0, "high_");
                    var pathbyfullprop = Path.Combine(savedImagePath, highResImage);

                    using (var imageFileStream = System.IO.File.OpenRead(pathbyfullprop))
                    {
                        //Create Image instance from openRead fileStream path
                        using (Image image = Image.Load(imageFileStream))
                        {
                            int customWidth = Convert.ToInt32(width);
                            if (image.Width >= customWidth)
                            {

                                //declare the image to be a custom size
                                string FileName = "custom_" + imageName;
                                //handle keeping aspect ratio by declaring a newHeight that matches the custom width
                                //var divisor = image.Width / customWidth;
                                //var newHeight = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));
                                int newHeight = 0;
                                //Resize the file in hand and save the new version, if this file already has a "custom_" tag it will be overwritten with this new mutation. 
                                //it would nice to call previously created images instead of making a new one but even better if i did that using a middleware like imagesharp.web
                                image.Mutate(x => x.Resize(customWidth, newHeight));

                                //Save the mutated file to the assigned path using the assigned file name
                                image.Save(savedImagePath + FileName);

                                var Newpathbyfullprop = Path.Combine(savedImagePath, FileName);

                                var NewimageFileStream = System.IO.File.OpenRead(Newpathbyfullprop);

                                return File(NewimageFileStream, "image/jpeg");

                            }
                            else
                            {

                                //Load highest resolution image available and return to user
                                var Newpathbyfullprop = Path.Combine(savedImagePath, highResImage);
                                var NewimageFileStream = System.IO.File.OpenRead(Newpathbyfullprop);

                                return File(NewimageFileStream, "image/jpeg");

                            }

                        }
                    }
                }
            }
            //adjust to include status code of 404
            //var StockImagePath = Path.Combine(_webhost.WebRootPath, "stockimages/", "404_not_found.webp");
            //using (var StockImageFileStream = System.IO.File.OpenRead(StockImagePath))
            
                return File("stockimages/"+"404_not_found.webp", "image/jpeg");
            
        }


    }
}