function generateContent() {
  const userInput = document.getElementById('userInput').value.trim();
  const resultDiv = document.getElementById('result');
  const generateBtn = document.getElementById('generateBtn');

  if (!userInput) {
    resultDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  // Show processing state on button
  document.getElementById("btnText").textContent = "Processing...";
  generateBtn.disabled = true;
  generateBtn.style.opacity = "0.6";
  generateBtn.style.cursor = "not-allowed";
  document.getElementById("spinner").classList.remove("hidden");

  resultDiv.innerHTML = '';

  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(userInput)}`;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;

  img.onload = function () {
    const cropPercent = 0.1;
    const cropHeight = img.height * (1 - cropPercent);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = cropHeight;

    ctx.drawImage(img, 0, 0, img.width, cropHeight, 0, 0, img.width, cropHeight);

    const croppedDataURL = canvas.toDataURL("image/jpeg");

    const croppedImg = new Image();
    croppedImg.src = croppedDataURL;

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download Image";
    downloadBtn.style.backgroundColor = "#4f46e5";
    downloadBtn.style.color = "#ffffff";
    downloadBtn.style.padding = "10px 20px";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "8px";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.fontSize = "16px";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.marginTop = "15px";
    downloadBtn.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    downloadBtn.style.transition = "background-color 0.3s ease";

    downloadBtn.onmouseover = () => {
      downloadBtn.style.backgroundColor = "#4338ca";
    };

    downloadBtn.onmouseleave = () => {
      downloadBtn.style.backgroundColor = "#4f46e5";
    };

    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = croppedDataURL;
      a.download = 'image.jpg';
      a.click();
    };

    resultDiv.innerHTML = '';
    resultDiv.appendChild(croppedImg);
    resultDiv.appendChild(downloadBtn);

    // Reset the generate button
document.getElementById("btnText").textContent = "Generate Image";
    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";
    resultDiv.innerHTML = '';
resultDiv.appendChild(croppedImg);
resultDiv.appendChild(downloadBtn);

document.getElementById("spinner").classList.add("hidden");


  };

  img.onerror = function () {
    document.getElementById("spinner").classList.add("hidden");
    resultDiv.innerHTML = "<p>Error loading image.</p>";
    generateBtn.textContent = "Generate Image";
    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";
    
  };
}
