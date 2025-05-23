function generateContent() {
  const userInput = document.getElementById('userInput').value.trim();
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const resultDiv = document.getElementById('result');

  if (!userInput) {
    resultDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  resultDiv.innerHTML = '<p>Generating...</p>';

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
    img.crossOrigin = "anonymous"; // Allow loading from external source
    img.src = imgUrl;

    img.onload = function () {
      const cropPercent = 0.5; // Crop bottom 10%
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const croppedHeight = img.height * (1 - cropPercent);

      canvas.width = img.width;
      canvas.height = croppedHeight;

      ctx.drawImage(img, 0, 0, img.width, croppedHeight);

      // Convert canvas to image
      const croppedImg = new Image();
      croppedImg.src = canvas.toDataURL("image/jpeg");

      // Clear result area and display cropped image
      resultDiv.innerHTML = '';
      resultDiv.appendChild(croppedImg);
    };

    img.onerror = function () {
      resultDiv.innerHTML = "<p>Error loading image.</p>";
    };
  }
}
