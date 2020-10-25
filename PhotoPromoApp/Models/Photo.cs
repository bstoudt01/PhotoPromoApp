﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoPromo.Models
{
    public class Photo
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string PhotoLocation { get; set; }

        public int IsPublic { get; set; }

        public string Attribute { get; set; }

        public int ResolutionLevel { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public int UserProfileId { get; set; }

        public UserProfile UserProfile { get; set; }

        public int GalleryId { get; set; }

        public Gallery Gallery { get; set; }


    }
}