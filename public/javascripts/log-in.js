document.addEventListener('DOMContentLoaded', () => {
    // Check if 'Remember me' is selected and autofill email and password if stored in localStorage
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && savedEmail && savedPassword) {
      document.getElementById('email').value = savedEmail;
      document.getElementById('password').value = savedPassword;
      document.getElementById('rememberMe').checked = true;
    }

    document.getElementById('loginButton').addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe').checked;

      // Clear previous error messages
      document.getElementById('emailError').classList.add('hidden');
      document.getElementById('passwordError').classList.add('hidden');

      let hasError = false;

      // Validate inputs
      if (!email || !password) {
        if (!email) {
          document.getElementById('emailError').textContent = 'Email is required.';
          document.getElementById('emailError').classList.remove('hidden');
        }
        if (!password) {
          document.getElementById('passwordError').textContent = 'Password is required.';
          document.getElementById('passwordError').classList.remove('hidden');
        }
        hasError = true;
      }

      if (hasError) return;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          
         /* if (rememberMe) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
          }
            */

          window.location.href = '/home';
        } else {
          document.getElementById('emailError').textContent = data.message || 'Login failed.';
          document.getElementById('emailError').classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('emailError').textContent = 'An error occurred during login.';
        document.getElementById('emailError').classList.remove('hidden');
      }
    });
  });