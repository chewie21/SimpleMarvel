`use strict`

//Обращение к серверу
const getData = (item) => {
    const request = new XMLHttpRequest();
    request.open(`GET`, `./dbHeroes.json`);
    request.responseType = `json`;
    request.addEventListener(`readystatechange`, () => {
        if(request.readyState !== 4) return;
        if(request.status == 200) {
            item(request.response);
        } else {
            new Error(request.status);
        }
    });
    request.send();
}
//Получаем архив с сервера
getData(item => {
    const heroesArr = item;
    runApplication(heroesArr);
});

//Точка входа
function runApplication (heroesArr) {
    //Элементы
    

    const cardRenderAnimation = (card) => {
        let counter = 0;
        card.style.opacity = `0`;
        cardDeck.append(card);
        function newAnimation () {
            if(counter < 1) {
                card.style.opacity = counter;
                counter += 0.1;
                requestAnimationFrame(newAnimation)
            }
        };
        newAnimation();
    };
    cardRenderAnimation(card);

    //Глобальные переменные
    const selectorMoviesSet = new Set(),
        inputMoviesSet = new Set(),
        speciesSet = new Set(),
        genderSet = new Set(),
        statusSet = new Set(),
        citySet = new Set();
    
    let thisHeroesArr = [],
        thisFilterHeroesArr = [];
    
    //Основные функции
    //Заполняем список фильмов
    getFilmList();
    //Слушаем форму
    form.addEventListener(`submit`, (event) => {
        event.preventDefault();
        const movieTitle = inputMovie.value;
        inputMovie.value = "";
        //addToFilmSelect(selectorMoviesSet);
        thisHeroesArr = filter(heroesArr, `movies`, movieTitle);
        if (thisHeroesArr.length) {
            titleText.textContent = movieTitle;
            cardContent(thisHeroesArr);
            getFilmList();
        } else {
            titleText.textContent = `There is no such movie...`;
        }
        
    });


    // //Заполняем архив названиями фильмов
    // //Получаем список фильмов
    // function getFilmList () {
    //     heroesArr.forEach((item) => {
    //         if(item.movies) {
    //             item.movies.forEach((item) => {
    //                 selectorMoviesSet.add(item.trim());
    //             });
    //         }
    //     });
    //     addToFilmSelect(selectorMoviesSet);
    // };
    // //Добавляем поля в датаЛист
    // function addToFilmSelect (item) {
    //     removeFilmSelect();
    //     item.forEach((item) => {
    //         const option = document.createElement(`option`);
    //         option.textContent = item;
    //         option.setAttribute(`value`, `${item}`)
    //         movieDataList.append(option);
    //     });
    // };
//     //Очищаем датаЛист
// const removeFilmSelect = () => {
//     movieDataList.querySelectorAll(`option`).forEach((item) => {
//         item.remove();
//     });
// };
// //Подсказка ввода
// const inputPrompt = (defaultSet) => {
//     inputMovie.addEventListener(`input`, () => {
//         console.log(1);
//         if(inputMovie.value === "") {
//             addMovieToSelect(defaultSet);
//         } else {
//             const newMovieSet = checkFilm(inputMovie.value, defaultSet);
//             addMovieToSelect(newMovieSet);
//         }
//     });
// // };
// //Проверяем, содержит ли set из названий фильмов элемент с введеной строкой
// const checkFilm = (param, oldSet) => {
//     const newMovieSet = new Set();
//     oldSet.forEach((item) => {
//         if (item.indexOf(param) !== -1) {
//             newMovieSet.add(item);
//         }
//     });
// //     return newMovieSet;
// // };
    
//     //Слушаем поле ввода
//     inputMovie.addEventListener(`input`, () => {
//         if(inputMovie.value === "") {
//             addToFilmSelect(selectorMoviesSet);
//         } else {
//             checkFilm(inputMovie.value, selectorMoviesSet, inputMoviesSet);
//             addToFilmSelect(inputMoviesSet);
//         }
//     });
//     //Проверяем, содержит ли set из названий фильмов элемент с введеной строкой
//     function checkFilm (param, oldSet, newSet) {
//         oldSet.forEach((item) => {
//             if (item.indexOf(param) !== -1) {
//                 newSet.add(item);
//             }
//         });
//     };

    //Фильтр - возвращает отфильтрованный архив
    function filter (arr, param, value) {
        const heroesCards = [];
        arr.forEach((item) => {
            if(item[param]) {
                if(item[param].includes(value)) {
                    heroesCards.push(item);
                }
            }
        });
        return heroesCards;
    }

    //Заполняем карточный стол
    //Удаление карточек
    function removeCards () {
        cards = cardDeck.querySelectorAll(`.card`);
        cards.forEach((card) => {
            card.remove();
        });
    };
    //Создание карточки
    function newCard () {
        const card = document.createElement(`div`),
            img = document.createElement(`img`),
            cardBody = document.createElement(`div`);
        card.classList.add(`card`, `bg-dark`);
        img.classList.add(`card-img-top`);
        cardBody.classList.add(`card-body`);
        card.prepend(img);
        card.append(cardBody);
        return card;
    };
    function renderCards (arr) {
        arr.forEach((item) => {
            const heroCard = newCard();
            for(key in item) {
                if(key === `photo`) {
                    heroCard.querySelector(`.card-img-top`).setAttribute(`src`, `${item[key]}`);
                } else if (key === `name`) {
                    heroCard.querySelector(`.card-body`).insertAdjacentHTML(`afterbegin`, `<h5 class='card-title main-title card-${key}'> 
                                        <span class='${key}'>${item[key]}</span></h5>`);
                }  else if(key !== `name` && key !== `movies`) {
                    heroCard.querySelector(`.card-body`).insertAdjacentHTML(`beforeend`, `<p class='card-text main-text card-${key}'>
                                        ${key.charAt(0).toUpperCase()+key.slice(1).toLowerCase()}: 
                                        <span class='${key}'>${item[key]}</span></p>`);
                } else if(key === `movies`) {
                    heroCard.querySelector(`.card-body`).insertAdjacentHTML(`beforeend`, `<ul class="card-text main-text list-group list-group-flush card-${key}">`)
                    item[key].forEach((item => {
                        heroCard.querySelector(`.card-${key}`).insertAdjacentHTML(`afterbegin`, `<li class="list-group-item card-li" type="button">${item}</li>`);
                    }));
                }
            }
            // heroCard.querySelectorAll(`li`).forEach((item) => {
            //     item.addEventListener('click', () => {
            //         cardContent(filter(heroesArr, `movies`, item.textContent));
            //         document.querySelector(`body`).scrollIntoView();
            //         titleText.textContent = item.textContent;
            //     })
            // })
            cardDeck.append(heroCard);
        });
    }
    //Контент карточки
    function cardContent (arr, filterArr) {
        if(!filterArr) {
            filterArr = arr;
        }
        removeCards();
        renderCards(filterArr);
        setFilterContent(arr);
        filters.classList.remove(`hide`);
        setCardEvent();
    }

    //Действия с карточками
    function setCardEvent  () {
        cards = cardDeck.querySelectorAll(`.card`);
        cards.forEach((card) => {
            card.addEventListener(`mouseover`, () => {
                card.classList.add(`activeCard`);
            });
            card.addEventListener(`mouseout`, () => {
                card.classList.remove(`activeCard`);
            });
        });
        if (window.screen.width >= 767) {
            cards.forEach((item) => {
                setButton(item, true)
            });
        };
        window.addEventListener(`resize`, () => {
            cards = cardDeck.querySelectorAll(`.card`);
            if(window.screen.width <= 767) {
                cards.forEach((item) => {
                    setButton(item, false)
                });
            } else {
                cards.forEach((item) => {
                    setButton(item, true)
                });
            }
        });
    }

    //Делаем кликабельными
    function setButton (item, param) {
        if(param) {
            item.setAttribute(`type`, `button`);
            item.setAttribute(`data-toggle`, `modal`);
            item.setAttribute(`data-target`, `#modal`);
        } else {
            item.removeAttribute(`type`, `button`);
            item.removeAttribute(`data-toggle`, `modal`);
            item.removeAttribute(`data-target`, `#modal`);
        }
    };

    //Фильтры
    //Заполняем сеты значиниями для фильтрации
    function setFilterContent (arr) {
        filters.querySelectorAll(`select`).forEach((items) => {
            items.querySelectorAll(`option`).forEach((item, index) => {
                if(index !== 0) {
                    item.remove();
                }
            })
        });
        arr.forEach((item) => {
            for(key in item) {
                if(key === `species`) {
                    speciesSet.add(item[key]);
                } else if (key === `gender`) {
                    genderSet.add(item[key]);
                } else if (key === `status`) {
                    statusSet.add(item[key]);
                } else if (key === `citizenship`) {
                    citySet.add(item[key]);
                }
            }
        });
        //Заполняем селекторы этими значениями
        speciesSet.forEach((item) => {
            const option = document.createElement(`option`);
            option.textContent = item;
            option.setAttribute(`value`, `${item}`);
            speciesInput.append(option);
        });
        genderSet.forEach((item) => {
            const option = document.createElement(`option`);
            option.textContent = item;
            option.setAttribute(`value`, `${item}`);
            genderInput.append(option);
        });
        statusSet.forEach((item) => {
            const option = document.createElement(`option`);
            option.textContent = item;
            option.setAttribute(`value`, `${item}`);
            statusInput.append(option);
        });
        citySet.forEach((item) => {
            const option = document.createElement(`option`);
            option.textContent = item;
            option.setAttribute(`value`, `${item}`);
            cityInput.append(option);
        });
    }

    //Изменение и пременение фильтров
    filters.querySelectorAll(`select`).forEach((select) => {
        select.addEventListener(`change`, () => {
            if(thisFilterHeroesArr.length) {
                let newThisFilterHeroesArr = [];
                thisFilterHeroesArr.forEach((item) => {
                    for(key in item) {
                        if(item[key] === select.value) newThisFilterHeroesArr.push(item);
                    }
                });
                if(!newThisFilterHeroesArr.length) {
                    select.classList.add(`error-filters`);
                    return;
                } else {
                    thisFilterHeroesArr = newThisFilterHeroesArr;
                    select.classList.remove(`error-filters`);
                    select.classList.add(`success-filters`);
                    select.setAttribute(`disabled`, `true`);
                }
            }
            else {
                select.removeAttribute(`disabled`);
                select.classList.remove(`error-filters`);
                select.classList.add(`success-filters`);
                select.setAttribute(`disabled`, `true`);
                thisHeroesArr.forEach((item) => {
                    for(key in item) {
                        if(item[key] === select.value) thisFilterHeroesArr.push(item);
                    }
                });
            }    
            removeCards();
            renderCards(thisFilterHeroesArr);
        });
    });

    //Кнопка сброса фильтров
    filtersReset.addEventListener(`click`, () => {
        filters.querySelectorAll(`select`).forEach((item) => {
            item.classList.remove(`error-filters`);
            item.classList.remove(`success-filters`);
            item.removeAttribute(`disabled`);
        });
        thisFilterHeroesArr = [];
        cardContent(thisHeroesArr);
    })
    
}
    
    
    


// let cards = document.querySelectorAll(`.card`);

// const 
//     inputFilm = document.querySelector(`.inputFilm`),
//     dataList = document.getElementById(`films`),
//     titleText = document.querySelector(`.title-text`);




// //Работа с карточками
// const ,
//     filmForm = document.querySelector(`form`);

// // filmForm.addEventListener(`submit`, (event) => {
// //     event.preventDefault();
// //     titleText.textContent = inputFilm.value;
// //     cardContent(filter(heroesArr, `movies`, inputFilm.value));
// //     setFilterContent(filter(heroesArr, `movies`, inputFilm.value));
// //     inputFilm.value = "";
// //     addToFilmSelect(films);
// // });




// //Модальное окно
// const modal = document.querySelector(`.modal`);
//     modalImg = modal.querySelector(`img`);
//     modalCard = modal.querySelector(`.modal-body`);

// function setModalContent (card) {
//     modalCard.childNodes.forEach((item) => {
//         item.remove();
//     })
//     modal.querySelector(`img`).setAttribute(`src`, `${card.querySelector(`img`).src}`);
//     const cloneCardBody = card.querySelector(`.card-body`).cloneNode(true);
//     cloneCardBody.querySelectorAll(`.main-text`).forEach((item) => {
//         item.classList.add(`modal-text`);
//     })
//     modalCard.append(cloneCardBody);
// }



// filters.addEventListener('mouseover', () => {
//     filters.classList.add(`active-filters`);
//     filters.querySelector(`.btn`).addEventListener('click', () => {
        
//     })
// });
// filters.addEventListener(`mouseout`, () => {
//     filters.classList.remove(`active-filters`);
// })