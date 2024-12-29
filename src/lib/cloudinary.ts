import { v2 as cloudinary } from 'cloudinary';

// Define a more specific type for the result of the upload
interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  url: string;
  secure_url: string;
}

interface CloudinaryError {
  error: {
    message: string;
  };
}

const cloudinaryConfigs = [
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_API_SECRET_2,
  },
  // Add more configurations as needed
];

let currentConfigIndex = 0;

export const switchCloudinaryConfig = () => {
  currentConfigIndex = (currentConfigIndex + 1) % cloudinaryConfigs.length;
  cloudinary.config(cloudinaryConfigs[currentConfigIndex]);
};

// Initialize with first config
cloudinary.config(cloudinaryConfigs[0]);

// Updated upload function with specific return type
export const uploadToCloudinary = async (
  buffer: Buffer, 
  options = {}
): Promise<CloudinaryUploadResult> => { 
  try {
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', ...options },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      ).end(buffer);
    });
    return result;
  } catch (error: unknown) { // Explicitly typing error as unknown
    if (isCloudinaryError(error)) { // Type guard for Cloudinary-specific error
      if (error.error?.message?.includes('resource limit')) {
        switchCloudinaryConfig();
        return uploadToCloudinary(buffer, options); // Retry with new config
      }
    }
    throw error; // Rethrow if the error doesn't match expected structure
  }
};

// Type guard to check if the error is a Cloudinary error
function isCloudinaryError(error: unknown): error is CloudinaryError {
  return typeof error === 'object' && error !== null && 'error' in error && typeof (error as CloudinaryError).error?.message === 'string';
}

export default cloudinary;
