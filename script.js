const form = document.querySelector(".my-form");
const inputValue = document.getElementById("input-value");
const generatedImage = document.getElementById("generated-image");
const imageText = document.getElementById("imageContainerText");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = inputValue.value.trim();
    if (!prompt) {
        alert("Please enter some text");
        return;
    }
    imageText.innerText = "Generating image...";
    generatedImage.src = "";
    try {
        // Example using Pollinations AI (Free)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        generatedImage.src = imageUrl;
        imageText.innerText = "Generated Image:";
    } catch (error) {
        imageText.innerText = "Error generating image.";
        console.error(error);
    }
});