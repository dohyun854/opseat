const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로로 접근 시 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 쿼리 파라미터를 처리할 /main 경로
app.get('/main', (req, res) => {
    const rows = parseInt(req.query.rows) || 5;
    const columns = parseInt(req.query.columns) || 5;
    res.render('main', { rows, columns });
});

// 서버 시작
app.listen(8080, '0.0.0.0', () => {
    console.log('listening on 8080');
});
