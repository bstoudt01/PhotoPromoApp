﻿using PhotoPromoApp.Models;
using System.Threading.Tasks;

namespace PhotoPromoApp.Services
{
   
        public interface IS3Service
        {
        Task<S3Response> CreateBucketAsync(string bucketName);
        };
}