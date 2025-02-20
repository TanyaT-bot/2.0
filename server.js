const express = require('express');
const path = require('path');

const app = express();

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница WebApp
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера на порту 5001
app.listen(5001, () => {
    console.log('Сервер запущен на http://localhost:5001');
}); 