import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI environment variable is required.');
  process.exit(1);
}

app.use(express.json({ limit: '10kb' }));

const submissionSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  },
  { timestamps: true },
);

const Submission = mongoose.model('Submission', submissionSchema);

app.get('/health', (_request, response) => {
  response.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? 'ok' : 'database-not-connected',
  });
});

app.post('/api/submissions', async (request, response) => {
  const firstName = typeof request.body.firstName === 'string' ? request.body.firstName.trim() : '';
  const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';

  if (!firstName || firstName.length > 80) {
    return response.status(400).json({ error: 'Enter a first name up to 80 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }

  try {
    await Submission.create({ firstName, email });
    return response.status(201).json({ message: 'Submission saved.' });
  } catch (error) {
    console.error('Could not save submission:', error.message);
    return response.status(500).json({ error: 'Could not save your submission.' });
  }
});

try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  app.listen(port, '0.0.0.0', () => console.log(`API listening on port ${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
