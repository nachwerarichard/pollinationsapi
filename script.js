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
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download Image";
      downloadBtn.style.marginTop = "10px";

      // Handle download on click
      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = croppedDataURL;
        a.download = 'cropped-image.jpg';
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
