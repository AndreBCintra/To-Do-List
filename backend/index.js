const express = require('express');
const cors = require('cors');
const taskRouter = require('./routes/router');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', taskRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));