import { useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed.');

      setMessage('Submitted successfully. Your details were saved.');
      setFirstName('');
      setEmail('');
    } catch (error) {
      setMessage(error.message || 'Could not submit the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Contact form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
