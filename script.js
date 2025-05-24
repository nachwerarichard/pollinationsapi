// Add this outside of generateContent() to avoid duplicate listeners
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("imageModal").classList.add("hidden");
  document.getElementById("imageModal").scrollTop = 0;
  document.getElementById("imageModal").scrollLeft = 0;
});

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
    Object.assign(downloadBtn.style, {
      backgroundColor: "#4f46e5",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      marginTop: "15px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease"
    });

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
Object.assign(copyBtn.style, {
  backgroundColor: "#10b981", // Tailwind's emerald-500
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  marginTop: "10px",
  marginLeft: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease"
});

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

const shareBtn = document.createElement("button");
shareBtn.textContent = "Share";
Object.assign(shareBtn.style, {
  backgroundColor: "#3b82f6", // Tailwind's blue-500
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  marginTop: "10px",
  marginLeft: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease"
});

shareBtn.onmouseover = () => {
  shareBtn.style.backgroundColor = "#2563eb"; // blue-600
};
shareBtn.onmouseleave = () => {
  shareBtn.style.backgroundColor = "#3b82f6";
};

shareBtn.onclick = async () => {
  try {
    shareBtn.textContent = "Sharing...";
    shareBtn.disabled = true;

    const response = await fetch(croppedImg.src);
    const blob = await response.blob();
    const file = new File([blob], "image.png", { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      // Use Web Share API
      await navigator.share({
        files: [file]
      });
    } else {
      // Fallback: open image in new tab for manual sharing
      const blobUrl = URL.createObjectURL(blob);
      const fallbackLink = document.createElement("a");
      fallbackLink.href = blobUrl;
      fallbackLink.download = "image.png";
      fallbackLink.target = "_blank";
      fallbackLink.click();
      URL.revokeObjectURL(blobUrl);
      alert("Your device does not support direct sharing. The image has been opened/downloaded for manual sharing.");
    }
  } catch (error) {
    alert("Error while sharing: " + error.message);
  } finally {
    shareBtn.textContent = "Share";
    shareBtn.disabled = false;
  }
};



 





    resultDiv.innerHTML = '';
    resultDiv.appendChild(croppedImg);
    resultDiv.appendChild(downloadBtn);
    resultDiv.appendChild(copyBtn);
    document.body.appendChild(shareBtn);



    document.getElementById("btnText").textContent = "Create Image";
    generateBtn.disabled = false;
    generateBtn.style.opacity = "1";
    generateBtn.style.cursor = "pointer";
    document.getElementById("spinner").classList.add("hidden");
  };

  img.onerror = function () {
    document.getElementById("spinner").classList.add("hidden");
    resultDiv.innerHTML = "<p class='text-red-500'>Error loading image.</p>";
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
