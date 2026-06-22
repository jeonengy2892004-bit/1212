/* ============================================
   12:12 CAFE — IMAGE COMPRESSION UTILITY
   Resizes and compresses an image file in the browser before it's
   stored as base64 in Firestore (which has a 1MB-per-document limit).

   Exposes window.ImageUtils with: fileToCompressedBase64(file) -> Promise<string>
   ============================================ */

(function(){

  const MAX_DIMENSION = 800;   // longest side, in pixels
  const JPEG_QUALITY = 0.72;   // 0–1, lower = smaller file, more compression artifacts

  function fileToCompressedBase64(file){
    return new Promise((resolve, reject) => {
      if(!file || !file.type.startsWith('image/')){
        reject(new Error('Please select a valid image file.'));
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the selected file.'));

      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Could not load the selected image.'));

        img.onload = () => {
          let { width, height } = img;

          if(width > height && width > MAX_DIMENSION){
            height = Math.round(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          } else if(height > MAX_DIMENSION){
            width = Math.round(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

          // Rough safety check: warn if still large (Firestore doc limit is 1MB total,
          // and a single product is one field among many in a shared document).
          const approxBytes = Math.round((base64.length * 3) / 4);
          if(approxBytes > 600 * 1024){
            reject(new Error('This image is too large even after compression. Please try a simpler or smaller photo.'));
            return;
          }

          resolve(base64);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });
  }

  window.ImageUtils = { fileToCompressedBase64 };

})();