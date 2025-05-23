function generateText() {
  const userInput = document.getElementById('userInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!userInput) {
    resultDiv.innerHTML = '<p>Please enter a prompt.</p>';
    return;
  }

  const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(userInput)}`;

  resultDiv.innerHTML = '<p>Generating text...</p>';

  fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
      resultDiv.innerHTML = `<p>${data}</p>`;
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
