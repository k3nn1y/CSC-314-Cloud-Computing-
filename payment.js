document.addEventListener("DOMContentLoaded", () => {
    const stripe = Stripe('your-publishable-key-here'); // Replace with your actual Stripe publishable key
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    const paymentForm = document.getElementById('paymentForm');

    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const amount = document.getElementById('amount').value;

        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, amount })
        });

        const { clientSecret } = await response.json();

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: name,
                    email: email
                }
            }
        });

        if (error) {
            console.error('Error:', error);
        } else {
            alert('Payment successful!');
        }
    });
});
