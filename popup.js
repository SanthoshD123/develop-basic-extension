document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', saveEmail);
});

function saveEmail() {
  const email = document.getElementById('emailInput').value;
  if (!email) {
    document.getElementById('status').textContent = "Please enter an email!";
    return;
  }

  chrome.storage.local.set({ userEmail: email }, () => {
    document.getElementById('status').textContent = "Saved!";
  });
}