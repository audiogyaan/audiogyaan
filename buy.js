// ✅ Google Apps Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuUzLvifyvpbx2gJ5kjh5I6_WQh3FtIJ57E9TmH-T2MkRJ3xJeuuK7_K9hetuuGAhe/exec";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  const msg = document.getElementById('formMessage');

  // ✅ Autofill Book Name + Price from URL
  const params = new URLSearchParams(window.location.search);

  const bookName = params.get("book");
  const bookPrice = params.get("price");

  if (bookName && form.querySelector('#book')) {
    form.querySelector('#book').value = decodeURIComponent(bookName.replace(/\+/g, ' '));
  }

  if (bookPrice && form.querySelector('#price')) {
    form.querySelector('#price').value = "₹" + decodeURIComponent(bookPrice.replace(/\+/g, ' '));
  }

  // ✅ Handle form submit
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

        // ✅ Reset ke baad bhi Book Name & Price dobara set
        if (bookName && form.querySelector('#book')) {
          form.querySelector('#book').value = decodeURIComponent(bookName.replace(/\+/g, ' '));
        }
        if (bookPrice && form.querySelector('#price')) {
          form.querySelector('#price').value = "₹" + decodeURIComponent(bookPrice.replace(/\+/g, ' '));
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
