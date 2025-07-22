const express = require('express');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Use the usersRouter for all /users endpoints
app.use('/users', usersRouter);

// ...other routes (e.g., trainers, programs) can be added similarly

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
