const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fetch = require('node-fetch');
const { getDataFromSheet } = require('./googleSheets'); // Импорт функции для получения данных из Google Sheets

// Создаем бота с токеном
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Добро пожаловать! Используйте команды /faq и /feedback для получения информации.');
});

// Обработка команды /faq
bot.onText(/\/faq/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Часто задаваемые вопросы: ...');
});

// Обработка команды /feedback
bot.onText(/\/feedback/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Ваши отзывы важны для нас! Напишите, что вы думаете.');
});

// Кнопки для рекомендаций и источников
bot.onText(/Рекомендации/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Рекомендации по подготовке отходов: ...');
});

bot.onText(/Источники/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Список источников по переработке: ...');
});

// Обработка команды для получения пунктов переработки
bot.onText(/Пункты переработки/, async (msg) => {
    const chatId = msg.chat.id;
    const data = await getDataFromSheet();
    // Логика фильтрации и сортировки данных
    const filteredData = filterDataByCategory(data, 'ваша категория'); // Замените на нужную категорию
    const nearestPoints = calculateNearestPoints(filteredData, userLocation); // userLocation нужно получить от пользователя
    bot.sendMessage(chatId, `Ближайшие пункты: ${nearestPoints}`);
});

bot.onText(/Открыть WebApp/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = 'https://your-webapp-url.com'; // URL вашего WebApp
    bot.sendMessage(chatId, 'Открыть WebApp', {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Открыть', url: webAppUrl }
            ]]
        }
    });
});

// Запуск сервера
const app = express();
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
}); 