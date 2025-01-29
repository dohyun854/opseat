const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/main', (req, res) => {
    const rows = parseInt(req.query.rows) || 5;
    const columns = parseInt(req.query.columns) || 5;
    const choices = parseInt(req.query.choices) || 3;
    res.render('main', { rows, columns, choices });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
