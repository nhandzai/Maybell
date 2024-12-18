const forms = document.querySelectorAll('[id^="addToCartForm-"]');
forms.forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result);
                alert(result);
            } else {
                alert(result);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });
});