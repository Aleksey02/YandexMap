let myGeoPoints = [
    {
        type: 'myPoint',
        geoposition: [41.365238, 69.286795]
    },
    {
        type: 'myPoint',
        geoposition: [41.365138, 69.286895]
    },
    {
        type: 'myPoint',
        geoposition: [41.364038, 69.286995]
    },
    {
        type: 'myPoint',
        geoposition: [41.364538, 69.286895]
    },
    {
        type: 'myPoint',
        geoposition: [41.364238, 69.287595]
    },
    {
        type: 'myPoint',
        geoposition: [41.367638, 69.285795]
    },
]


// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init(){

    // let coordinates;
    // ymaps.geolocation.get().then(function(result) {
    //     coordinates = result.geoObjects.position;
    //     console.log("Широта: " + coordinates[0]);
    //     console.log("Долгота: " + coordinates[1]);
    //     var myPlacemark = new ymaps.Placemark([coordinates[0], coordinates[1]], {
    //         iconContent: 'Ты тут'
    //     }, {
    //         // Иконка будет зеленой и
    //         // растянется под iconContent.
    //         preset: 'islands#greenStretchyIcon'
    //     });
    //     myMap.geoObjects.add(myPlacemark)
    //     myMap.setCenter(coordinates)
    // });

    var inputSearch = new ymaps.control.SearchControl({
        options: {
            // Пусть элемент управления будет
            // в виде поисковой строки.
            size: 'large',
            // Включим возможность искать
            // не только топонимы, но и организации.
            provider: 'yandex#search',
            results: 500            
        }
    })

    
    // Создание карты.
    let myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [41.364238, 69.286995],
        controls:[],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 15
    });


    myMap.events.add('boundschange', function(event) { // дает результаты поиска только по видимомоу участку
        // Получаем новые границы карты
        var newBounds = event.get('newBounds');
    
        // Обновляем boundedBy у SearchControl с новыми границами карты
        inputSearch.options.set('boundedBy', newBounds);
    });

    let myBtn = document.getElementById('box__btn');
    let myInput = document.getElementById('box__input');
    let suggestView1 = new ymaps.SuggestView('box__input'); // Подсказки к инпуту
    let objectManagerForYandex = new ymaps.ObjectManager({
        clusterize: true,
        hasBalloon: true,
    });
    let objectManagerForAvito = new ymaps.ObjectManager({
        clusterize: true,
        hasBalloon: true,
    });
    myMap.geoObjects.add(objectManagerForYandex);
    myMap.geoObjects.add(objectManagerForAvito);

    myBtn.addEventListener('click', function(){

        inputSearch.search(myInput.value).then(function () {
            objectManagerForYandex.removeAll();
            objectManagerForAvito.removeAll();
            let geoObjectsArray = inputSearch.getResultsArray();
            //geoObjectsArray.push(...myGeoPoints)
            console.log(geoObjectsArray);
            if (geoObjectsArray.length) {
                // Выводит свойство name первого геообъекта из результатов запроса.
                console.log(geoObjectsArray[0].properties.get('name'));
                
            }

            
        
            let objectsYandex = []; 
            
            console.log('length');
            for (let i = 0; i < geoObjectsArray.length; i++) {
                objectsYandex.push({
                    type: 'Feature',
                    id: i+1,
                    geometry: {
                        type: 'Point',
                        coordinates: geoObjectsArray[i].geometry._coordinates
                    },
                    properties: {
                        // balloonContentHeader:geoObjectsArray[i].properties._data.name, // Задайте содержимое балуна для каждой точки
                        // balloonContentBody: geoObjectsArray[1].properties._data.phoneNumbers[0], // Задайте содержимое балуна для каждой точки
                        // balloonContentFooter: geoObjectsArray[1].properties._data.address, // Задайте содержимое балуна для каждой точки
                        balloonContent: 
                            `<div>${geoObjectsArray[i].properties._data.name}</div><br>
                            <div>${geoObjectsArray[i].properties._data.phoneNumbers??'Телефон не указан'}</div><br>
                            <div>${geoObjectsArray[i].properties._data.address}</div>`
                    },
                    options: {
                        iconColor: '#ED1111'
                    }
                });
                
            }
            let objectsAvito = [];
            for (let i = 0; i < myGeoPoints.length; i++) { 
                objectsAvito.push({
                    type: 'Feature',
                    id: geoObjectsArray.length+i+1,
                    geometry: {
                        type: 'Point',
                        coordinates: myGeoPoints[i].geoposition
                    },
                    properties: {
                        balloonContentHeader: 'Это балун точки ' + i, // Задайте содержимое балуна для каждой точки
                        balloonContentBody: 'Это балун точки ' + i, // Задайте содержимое балуна для каждой точки
                        balloonContentFooter: 'Это балун точки ' + i, // Задайте содержимое балуна для каждой точки
                    },
                    options: {
                        iconColor: '#1e98ff'
                    }
                });
                
                
            }
            
            //objectManagerForAvito.clusters.options.set('preset', 'islands#greenClusterIcons');
            objectManagerForYandex.clusters.options.set('preset', 'islands#redClusterIcons');
            // for (var i = 0; i < geoObjectsArray.length; i++) { запасной вариант
            //     objects.push({
            //         type: 'Feature',
            //         id: i+1,
            //         geometry: {
            //             type: 'Point',
            //             coordinates: geoObjectsArray[i].type?geoObjectsArray[i].geoposition:geoObjectsArray[i].geometry._coordinates
            //         },
            //         properties: {
            //             balloonContentHeader: geoObjectsArray[i].type=='myPoint'? ('Это балун точки ' + i) :(geoObjectsArray[i].properties._data.name), // Задайте содержимое балуна для каждой точки
            //             balloonContentBody: geoObjectsArray[i].type=='myPoint'?('Это балун точки ' + i):(geoObjectsArray[1].properties._data.phoneNumbers[0]||'Нет информации'), // Задайте содержимое балуна для каждой точки
            //             balloonContentFooter: geoObjectsArray[i].type=='myPoint'?('Это балун точки ' + i):(geoObjectsArray[1].properties._data.address||'Нет информации'), // Задайте содержимое балуна для каждой точки
            //         },
            //         options: {
            //             iconColor: geoObjectsArray[i].type?'#1e98ff':'#ED1111'
            //         }
            //     });
                
            // }
            console.log(objectsYandex);
            objectManagerForYandex.add(objectsYandex);
            objectManagerForAvito.add(objectsAvito);
            
                
            });

    })

    
    // inputSearch.events.add('submit', function(event) {                        //Запасной вариант
    //     var searchQuery = event.get('target').getRequestString()
    //     console.log('Q',searchQuery);
    // })
        // for(let i=0;i<10;i++){
        //     let placemark =new ymaps.Placemark([40+0.25*i,51+0.25*i],{
        //         balloonContent: `<div class=container>метка №${i+1}</div>`
        //     },{
        //         draggable: true
        //         // iconLayout: 'default#image',
        //         // // Своё изображение иконки метки.
        //         // iconImageHref: 'https://t4.ftcdn.net/jpg/04/49/79/11/240_F_449791126_PIFD5UWu1LOb39hOP3dIbtqxHNNvpLDH.jpg',
        //         // // Размеры метки.
        //         // iconImageSize: [30, 42],
        //         // // Смещение левого верхнего угла иконки относительно
        //         // // её "ножки" (точки привязки).
        //         // iconImageOffset: [-5, -38]
        //     })
        //     myMap.geoObjects.add(placemark)
        // }
    
}
