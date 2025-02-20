const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Настройка почтового сервиса
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Эндпоинт для отправки обратной связи
app.post('/api/feedback', (req, res) => {
    const { name, message } = req.body;
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@gmail.com',
        subject: 'Обратная связь от пользователя',
        text: `Имя: ${name}\nСообщение: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Сообщение отправлено!');
    });
}); 