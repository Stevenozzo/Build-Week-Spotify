const img = document.getElementById("album-image");

const darkenColor = (hex, factor) => {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Darken the RGB values
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
    
    // Convert back to hex
    const darkenedHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    return darkenedHex;
};

const extractColor = (image) => {
    console.log("Image loaded successfully.");

    // Use Vibrant.js to get the dominant color
    Vibrant.from(image)
        .getPalette()
        .then((palette) => {
            const dominantColor = palette.Vibrant ? palette.Vibrant.hex : "#000";
            console.log(`Dominant color: ${dominantColor}`);
            
            // Darken the dominant color (e.g., 0.5 for 50% darker)
            const darkerColor = darkenColor(dominantColor, 0.5);
            console.log(`Darker color: ${darkerColor}`);
            
            // Apply gradient background with the darker color
            document.body.style.background = `linear-gradient(to bottom, ${darkerColor} 0%, #121212 60%)`;
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
