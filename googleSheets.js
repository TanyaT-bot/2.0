const { google } = require('googleapis');

// Настройка аутентификации
const auth = new google.auth.GoogleAuth({
    keyFile: '/Users/tangrit/Downloads/telegram-bot-access-451514-ab926236812c.json', // Укажите путь к вашему JSON-файлу
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Получение данных из Google Sheets
async function getDataFromSheet() {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '11XyhXUVgSJhRvsgJyT3488ISVWwLvosFISvh5K6qE1I', // Ваш ID таблицы
        range: 'Sheet1!A1:G', // Укажите диапазон, включая все необходимые столбцы
    });
    return response.data.values; // Возвращает массив значений
}

// Фильтрация данных по категории
function filterDataByCategory(data, category) {
    return data.filter(point => point[2] === category); // Предполагается, что категория находится в третьем столбце (индекс 2)
}

async function fetchRecyclingPoints() {
    const sheetId = '11XyhXUVgSJhRvsgJyT3488ISVWwLvosFISvh5K6qE1I'; // Ваш ID таблицы
    const apiKey = 'ab926236812c5feacfb30d7458782d132b3cbfe8'; // Ваш API ключ
    const range = 'Sheet1!A1:G'; // Укажите диапазон, включая все необходимые столбцы

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data.values; // Возвращает массив значений
    } catch (error) {
        console.error("Ошибка при получении данных из Google Sheets:", error);
    }
}

// Инициализация карты и отображение маркеров
async function initMap() {
    const points = await getDataFromSheet(); // Получаем данные из Google Sheets
    const map = new ymaps.Map('map', {
        center: [59.9343, 30.3351], // Координаты Санкт-Петербурга
        zoom: 10
    });

    points.forEach(point => {
        const [address, name, category, contact, longitude, latitude, workingHours] = point;
        const placemark = new ymaps.Placemark([parseFloat(latitude), parseFloat(longitude)], {
            balloonContent: `
                <strong>${name}</strong><br>
                Адрес: ${address}<br>
                Категория: ${category}<br>
                Контакт: ${contact}<br>
                Время работы: ${workingHours}
            `
        });
        map.geoObjects.add(placemark);
    });
}

// Вызов функции при загрузке карты
ymaps.ready(initMap);