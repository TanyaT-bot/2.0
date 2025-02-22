// Инициализация карты и отображение маркеров
async function fetchRecyclingPoints() {
    const sheetId = '11XyhXUVgSJhRvsgJyT3488ISVWwLvosFISvh5K6qE1I';
    const apiKey = 'AIzaSyCA8jDFmI2pZYzcD7BLkAjk-5g4pzAAbBg';
    const range = 'Лист1!A1:G';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ${response.status}');
        }
        const data = await response.json();
        console.log('Данные из Google Seets:', data.values);
        return data.values.slice(1); // пропускаемые заголовки 
    } catch (error) {
        console.error("Ошибка загрузки данных из Google Sheets:", error);
        return [];
    }
} 

window.allMarkers = [];

async function initMap() {
    const points = await fetchRecyclingPoints();//Получаем данные из таблицы
    if (!points || points.length === 0) {
        console.error('Нет данных для отображения на карте');
        return;
    }

    //Проверка на существование карты
    if (window.map) {
        window.map = new ymaps.Map('map', {
        center: [59.9343, 30.3351], // Координаты Санкт-Петербурга
        zoom: 10
    });

    console.log('Карта успешно инициализирована');
} 

//Добавляем маркеры с пунктами переработки
    points.forEach(point => {
        const [address, name, category, contact, longitude, latitude, workingHours] = point;
        if (!latitude || !longitude) {
            console.warn('Пропущена точка без координат:', point);
            return;
        }
        const placemark = new ymaps.Placemark([parseFloat(latitude), parseFloat(longitude)], {
            balloonContent: `
                <strong>${name}</strong><br>
                Адрес: ${address}<br>
                Категория: ${category}<br>
                Контакт: ${contact}<br>
                Время работы: ${workingHours}
            `
        }); 
        //Добавляем обработчик на клик по маркеру
        placemark.events.add('click', function() {
            //Показываем кнопку для построения маршрута
            showRouteButton([parseFloat(latitude), parseFloat(longitude)]);
        });

        window.map.geoObjects.add(placemark);
        window.allMarkers.push(placemark);
    });
}

//Функция для отображения кнопки построения маршрута
function showRouteButton(destination) {
    //Если кнопка уже ест, не показываем ее заново
    let routeButton = document.getElementById('routeButton');
    if (!routeButton) {
        routeButton = document.createElement('button');
        routeButton.id = 'routeButton';
        routeButton.innerText = 'Построить маршрут';
        routeButton.onclick = function () {
            buildRoute(destination);//Строим маршрут 
        };
        document.body.appendChild(routeButton); //Добавляем кнопку на страницу 
    }
    // Центрируем карту на точке назначения
    window.map.setCenter(destination, 14);
}

// Функция для построения маршрута от местоположения пользователя до выбранной точки
function buildRoute(destination) {
    // Проверяем, что глобальная переменная userLocation определена 
    if (!window.userLocation) {
        alert('Геолокация еще не загружена. Попробуйте снова через несколько секунд.');
        return;
    }

    // Извлекаем координаты пользователя и пункта переработки 
    const [userLat, userLng] = window.userLocation;
    const [destLat, destLng] = destination;

    console.log('Строим маршрут от', window.userLocation, 'до', destination)

    // Формируем Url для Яндекс.Карт с маршрутом (rtt=auto - для авто маршрута)
    const routeUrl = `https://yandex.ru/maps/?rtext=${userLat},${userLng}~${destLat},${destLng}&rtt=auto`; 

    //Открываем Яндекс.Карты с маршрутом в новой вкладке
    window.open(routeUrl, '_blank');

    //Линия маршрута на карте 
    const routeLine = new ymaps.Polyline([window.userLocation, destination], {}, {
        strokeColor: "#0000FF", //Цвет маршрута
        strokeWidth: 4
    });
    window.map.geoObjects.add(routeLine);
}
// Вызов функции при загрузке карты
ymaps.ready(initMap); 
