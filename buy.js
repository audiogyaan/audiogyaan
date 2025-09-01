// script.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuUzLvifyvpbx2gJ5kjh5I6_WQh3FtIJ57E9TmH-T2MkRJ3xJeuuK7_K9hetuuGAhe/exec";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMessage');

  // Autofill book name from URL parameter
  const params = new URLSearchParams(window.location.search);
  if (params.has('book')) {
    const bookField = form.querySelector('input[name="book"]');
    if (bookField) bookField.value = decodeURIComponent(params.get('book').replace(/\+/g, ' '));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Placing Order...';

    const data = new FormData(form);
    const body = new URLSearchParams();
    for (let [key, value] of data.entries()) {
      body.append(key, value);
    }

    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: body.toString()
      });
      const json = await res.json();

      if (res.ok && json.status === 'success') {
        msg.style.color = 'green';
        msg.textContent = '✅ Your order has been placed successfully!';
        form.reset();
        if (params.has('book') && form.querySelector('input[name="book"]')) {
          form.querySelector('input[name="book"]').value = decodeURIComponent(params.get('book').replace(/\+/g,' '));
        }
      } else {
        msg.style.color = 'red';
        msg.textContent = '⚠️ Order failed — please try again.';
      }
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = '⚠️ Network error — please try again.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Place Order';
    }
  });
});




// Auto-fill book name from URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const bookName = params.get("book");
  if (bookName) {
    document.getElementById("book").value = bookName;
  }
});
