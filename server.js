const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const eventRoute = require('./rotues/eventRoutes');
const ngoRoute = require('./rotues/ngoRoutes');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/events', eventRoute);
app.use('/api/ngos', ngoRoute);

app.listen(PORT, () => {
  console.log(`Server start: http://localhost:${PORT}`);
});

