function generateContent() {
  const userInput = document.getElementById('userInput').value.trim();
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const resultDiv = document.getElementById('result');

  if (!userInput) {
    resultDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  resultDiv.innerHTML = '<p>Generating please wait...</p>';

  if (mode === 'text') {
    const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(userInput)}`;

    fetch(apiUrl)
      .then(response => response.text())
      .then(data => {
        resultDiv.innerHTML = `<p>${data}</p>`;
      })
      .catch(error => {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
      });

  } else if (mode === 'image') {
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

      // Create download button
      // Create download button
const downloadBtn = document.createElement("button");
downloadBtn.textContent = "Download Image";

// Style the button beautifully
downloadBtn.style.backgroundColor = "#4f46e5";       // Indigo-600
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

// Hover effect
downloadBtn.onmouseover = () => {
  downloadBtn.style.backgroundColor = "#4338ca"; // Indigo-700
};

downloadBtn.onmouseleave = () => {
  downloadBtn.style.backgroundColor = "#4f46e5"; // Reset to Indigo-600
};


      // Handle download on click
      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = croppedDataURL;
        a.download = 'image.jpg';
        a.click();
      };

      // Display cropped image and download button
      resultDiv.innerHTML = '';
      resultDiv.appendChild(croppedImg);
      resultDiv.appendChild(downloadBtn);
    };

    img.onerror = function () {
      resultDiv.innerHTML = "<p>Error loading image.</p>";
    };
  }
}
