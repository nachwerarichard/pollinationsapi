// Add this outside of generateContent() to avoid duplicate listeners
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("imageModal").classList.add("hidden");
  document.getElementById("imageModal").scrollTop = 0;
  document.getElementById("imageModal").scrollLeft = 0;
});
const buttonContainer = document.createElement("div");
buttonContainer.className = `
  flex 
  flex-col 
  sm:flex-row 
  gap-4 
  mt-4 
  items-start 
  sm:items-center
`;
function generateContent() {
  const userInput = document.getElementById('userInput').value.trim();
  const resultDiv = document.getElementById('result');
  const generateBtn = document.getElementById('generateBtn');

  if (!userInput) {
    resultDiv.innerHTML = '<p class="text-red-500">Please enter a prompt.</p>';
    return;
  }

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

    const croppedDataURL = canvas.toDataURL("image/png");
    const croppedImg = new Image();
    croppedImg.src = croppedDataURL;
    croppedImg.classList.add("cursor-pointer", "rounded", "shadow-md");

    // 👉 Open modal on image click
    croppedImg.onclick = () => {
        currentZoom = 1; // Reset zoom when modal opens
      document.getElementById("modalImage").src = croppedDataURL;
        modalImage.style.transform = `scale(${currentZoom})`;
      document.getElementById("imageModal").classList.remove("hidden");
    };

    const downloadBtn = document.createElement("button");
downloadBtn.textContent = "Download Image";
downloadBtn.className = `
  bg-indigo-600 
  hover:bg-indigo-700 
  text-white 
  px-10
  py-2.5 
  rounded-lg 
  cursor-pointer 
  text-base 
  font-semibold 
  shadow-md 
  transition-colors 
  duration-300
`;

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
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy to Clipboard";
    copyBtn.className = `
      bg-emerald-500 
      hover:bg-emerald-600 
      text-white 
      px-10
      py-2.5 
      rounded-lg 
      cursor-pointer 
      text-base 
      font-semibold 
      shadow-md 
      transition-colors 
      duration-300
    `;

copyBtn.onmouseover = () => {
  copyBtn.style.backgroundColor = "#059669"; // emerald-600
};
copyBtn.onmouseleave = () => {
  copyBtn.style.backgroundColor = "#10b981";
};

copyBtn.onclick = async () => {
  try {
    const res = await fetch(croppedImg.src);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy to Clipboard";
    }, 2000);
  } catch (err) {
    alert("Failed to copy image: " + err);
  }
};
    resultDiv.innerHTML = '';
    resultDiv.appendChild(croppedImg);
    resultDiv.appendChild(downloadBtn);
    resultDiv.appendChild(copyBtn);


    document.getElementById("btnText").textContent = "Create Image";
    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";
    document.getElementById("spinner").classList.add("hidden");
  };

  img.onerror = function () {
    document.getElementById("spinner").classList.add("hidden");
    resultDiv.innerHTML = "<p class='text-red-500'>Error loading image.Refresh and try again</p>";
    document.getElementById("btnText").textContent = "Create Image";
    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";
  };
}
let currentZoom = 1;
const modalImage = document.getElementById("modalImage");

document.getElementById("zoomIn").addEventListener("click", () => {
  currentZoom += 0.1;
  modalImage.style.transform = `scale(${currentZoom})`;
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (currentZoom > 0.2) {
    currentZoom -= 0.1;
    modalImage.style.transform = `scale(${currentZoom})`;
  }
});