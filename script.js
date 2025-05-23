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
    resultDiv.innerHTML = `<img src="${imgUrl}" alt="Generated image from prompt">`;
  }
}
