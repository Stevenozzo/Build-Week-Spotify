const img = document.getElementById("album-image");

const extractColor = (image) => {
   console.log("Image loaded successfully.");

   // Use Vibrant.js to get the dominant color
   Vibrant.from(image)
     .getPalette()
     .then((palette) => {
       const dominantColor = palette.Vibrant ? palette.Vibrant.hex : "#000";
       
       console.log(`Dominant color: ${dominantColor}`);

       // Apply gradient background with the dominant color
       document.body.style.background = `linear-gradient(to bottom, ${dominantColor} 0%, #121212 60%)`;
    })
     .catch((error) => {
       console.error("Error extracting color with Vibrant.js:", error);
    });
 };

 if (img.complete) {
    extractColor(img); // If image is already loaded
  } else {
    img.onload = () => extractColor(img); // If the image is still loading
  }
  

