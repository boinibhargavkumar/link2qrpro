/**
 * Convert file to base64 data URL for local storage/display
 * This replaces the base44 file upload functionality with client-side handling
 */
export const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      reject(new Error('File size must be less than 5MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve({
        file_url: e.target.result, // base64 data URL
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Optional: Upload file to your own backend server
 * Uncomment and modify this if you want to implement server-side file storage
 */
/*
export const uploadFileToServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      file_url: data.url,
      file_name: data.name,
    };
  } catch (error) {
    throw new Error('Failed to upload file: ' + error.message);
  }
};
*/
