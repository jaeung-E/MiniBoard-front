const express = require('express');
const path = require('path');
const app = express();

app.use('/resource', express.static(path.resolve(__dirname, 'resource')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'resource', 'static', 'html', 'index.html'));
});

app.listen(8082, () => console.log('8082 port is running......'));