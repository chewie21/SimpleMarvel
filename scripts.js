'use strict'
const body = document.querySelector(`body`),
    title = document.querySelector(`.title`),
    logo = document.querySelector(`.logo`);
    //Форма
const form = document.querySelector(`form`),
        inputMovie  = form.querySelector(`.inputMovie`),
        movieDataList = form.querySelector(`datalist`),
        cardDeck = document.querySelector(`.card-deck`),
        titleText = document.querySelector(`.title-text`);
    //Титульник
const col1 = document.querySelector(`.col1`),
    col2 = document.querySelector(`.col2`),
    col3 = document.querySelector(`.col3`),
    col4 = document.querySelector(`.col4`);
    //Фильтры
const filters = document.querySelector(`.filters`),
    filtersReset = filters.querySelector(`button`),
    speciesInput = filters.querySelector(`.inputSpecies`),   
    genderInput = filters.querySelector(`.inputGender`),   
    statusInput = filters.querySelector(`.inputStatus`), 
    cityInput = filters.querySelector(`.inputCitizenship`);
    //Навбары
const firstBar = document.querySelector(`.firstBar`),
    secondBar = document.querySelector(`.secondBar`);
    //Модальное окно
const modal = document.querySelector(`.modal`),
    modalImg = modal.querySelector(`img`),
    modalCard = modal.querySelector(`.modal-body`);

//Обращение к серверу
const getData = (cb) => {
    return fetch(`./dbHeroes.json`, {
        method: `GET`,
    }).then((response) => response.json()).then((data) => {
        cb(data);
    }).catch();
};
//Получаем архив с сервера
getData(item => {
    runApplication(item);
});

const runApplication = (defaultArr) => {
    getMovieList(defaultArr);
    vieTitle(defaultArr);
    formSubmit(defaultArr);
};

//Показываем титульник
const vieTitle = (defaultArr) => {
    title.style.top = `-50%`
    title.style.display = `block`;
    document.querySelectorAll(`.titleCol`).forEach((item) => {
        item.style.opacity = 0;
    });
    const titleAnimation = () => {
        let counter = -50;
        function newAnimation () {
            if(counter <= 50) {
                title.style.top = counter + `%`;
                counter += 1;
                requestAnimationFrame(newAnimation)
            } else {
                counter = 0
                function textAnimation () {
                    if(counter < 1) {
                        document.querySelectorAll(`.titleCol`).forEach((item) => {
                            item.style.opacity = counter;
                        });
                        counter += 0.01;
                        requestAnimationFrame(textAnimation);
                    }
                }
                textAnimation();
            }
        }
        newAnimation();
    }
    titleAnimation();
    document.querySelectorAll(`.titleCol`).forEach((col) => {
        col.querySelectorAll(`p`).forEach((p) => {
            p.addEventListener('mouseover', () => {
                p.style.color = `#ED1D24`;
            });
            p.addEventListener(`mouseout`, () => {
                p.style.color= `#f8f9fa`;
            });
            p.addEventListener('click', (event) => {
                title.style.display = `none`;
                document.querySelector(`.modal-backdrop`).remove();
                filterProcess(defaultArr, event.target.textContent);
            });
        })
    });
}
const textRows = (set) => {
    let counter = 1;
    set.forEach((item) => {
        if(counter <= 5) {
            addRows(item, col1);
            counter++
        } else if (counter <= 10) {
            addRows(item, col2);
            counter++
        } else if (counter <= 15) {
            addRows(item, col3);
            counter++
        } else if (counter <= 20 ) {
            addRows(item, col4);
            counter++
        }
    })
};
//Добавляем строки
const addRows = (item, param) => {
    const string = document.createElement(`p`);
    string.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    string.classList.add(`lead`);
    param.append(string);
}
//Создаем сет из фильмов входящих в архив
const getMovieList = (arr) => {
    const movieSet = new Set();
    arr.forEach((item) => {
        if(item.movies) {
            item.movies.forEach((item) => {
                movieSet.add(item.trim().toLowerCase());
            });
        }
    });
    addMovieToSelect(movieSet);
    textRows(movieSet);
}
//Добавляем поля в датаЛист
const addMovieToSelect = (set) => {
    set.forEach((item) => {
        const option = document.createElement(`option`);
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        option.setAttribute(`value`, `${item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}`)
        movieDataList.append(option);
    });
};

//Событие формы
const formSubmit = (defaultArr) => {
    form.addEventListener(`submit`, (event) => {
        event.preventDefault();
        $("#navbarResponsive").collapse('hide');
        filterProcess(defaultArr, inputMovie.value);
        inputMovie.value = ``;
    });
};

//Процесс фильтрации
const filterProcess = (defaultArr, inputMovie) => {
    body.scrollIntoView(top, {behavior: 'smooth'});
    const thisArr = filter(defaultArr, `movies`, inputMovie);
    removeFilter();
    removeCards();
    if(thisArr.length) {
        console.log(thisArr);
        console.log(defaultArr);
        renderCards(thisArr, defaultArr);
        setFilter(thisArr);
        titleText.textContent = inputMovie;
    } else {
        titleText.textContent = `There is no such movie...`;
    }      
}

//Фильтр - возвращает отфильтрованный архив
const filter = (arr, param, value) => {
    const filterArr = [];
    console.log(param);
    arr.forEach((item) => {
        if(item[param]) {
            if(param === `movies`) {
                item[param].forEach((movie) => {
                    if(movie.trim().toLowerCase() === value.toLowerCase()) filterArr.push(item);
                });
            } 
        }
    });
    return filterArr;
}

//Карточный стол
//Создание пустой карты
const newCard = () => {
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
//Отображение карт
const renderCards = (thisArr, defaultArr) => {
    removeCards();
    //Наполнение карт контентом
    thisArr.forEach((item) => {
        const card = newCard();
        for(let key in item) {
            if(key === `photo`) {
                card.querySelector(`.card-img-top`).setAttribute(`src`, `${item[key]}`);
            } else if (key === `name`) {
                card.querySelector(`.card-body`).insertAdjacentHTML(`afterbegin`, `<h5 class='card-title main-title card-${key}'> 
                                    <span class='${key}'>${item[key]}</span></h5>`);
            }  else if(key !== `name` && key !== `movies`) {
                card.querySelector(`.card-body`).insertAdjacentHTML(`beforeend`, `<p class='card-text main-text card-${key}'>
                                    ${key.charAt(0).toUpperCase()+key.slice(1).toLowerCase()}: 
                                    <span class='${key}'>${item[key]}</span></p>`);
            } else if(key === `movies`) {
                card.querySelector(`.card-body`).insertAdjacentHTML(`beforeend`, `<ul class="main-text list-group list-group-flush card-${key}">`)
                item[key].forEach((item => {
                    card.querySelector(`.card-${key}`).insertAdjacentHTML(`afterbegin`, `<li class="list-group-item card-li" type="button">${item}</li>`);
                }));
            }
        }
        //Анимация появления
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
    });
    cardsEvents(defaultArr);
};
//Удаление карточек
const removeCards = () => {
    const cards = cardDeck.querySelectorAll(`.card`);
    cards.forEach((card) => {
        card.remove();
    });
};
//Эвенты на карточках
const cardsEvents = (defaultArr) => {
    const cards = cardDeck.querySelectorAll(`.card`);
    //Делаем кликабельными
    const setButton = (item, param) => {
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
    //Активные карты
    const activeCard = (event) => {
        let card = event.target;
        while(!card.classList.contains(`card`)) {
            card = card.parentElement;
        }
        card.classList.add(`activeCard`);
        card.addEventListener(`mouseout`, () => {
            card.classList.remove(`activeCard`);
        }, {once: true});
    };
    //Модальное окно
    const modalContent = (event) => {
        modalCard.childNodes.forEach((item) => {
            item.remove();
        });
        let card = event.target;
        while(!card.classList.contains(`card`)) {
            card = card.parentElement;
        }
        modalImg.setAttribute(`src`, `${card.querySelector(`img`).src}`);
        const cloneCardBody = card.querySelector(`.card-body`).cloneNode(true);
        cloneCardBody.querySelectorAll(`.main-text`).forEach((item) => {
            item.classList.add(`modal-text`);
            item.querySelectorAll(`li`).forEach((li) => {
                li.addEventListener(`click`, modalFilter);
            });
        });
        modalCard.append(cloneCardBody);
    };
    //Закрытие окна
    const modalClose = () => {
        $("#modal").modal('hide');
    }
    //Поиск по фильму из модального окна
    const modalFilter = (event) => {
        modalClose();
        filterProcess(defaultArr, event.target.textContent);
    }
    //Поиск по фильму из основной карточки
    const mobileFilter = (event) => {
        filterProcess(defaultArr, event.target.textContent)
    };
    cards.forEach((item) => { 
        item.querySelectorAll(`li`).forEach((li) => {
            li.addEventListener(`click`, mobileFilter);
        });
    });
    //Навешивание событий
    if (window.screen.width >= 767) {
        cards.forEach((card) => {
            card.addEventListener(`mouseover`, activeCard);
            card.addEventListener(`click`, modalContent);
            setButton(card, true);
        })
    }
    //Изменение окна
    window.addEventListener(`resize`, () => {
        if(window.screen.width <= 767) {
            cards.forEach((card) => {
                setButton(card, false);
                card.removeEventListener(`mouseover`, activeCard);
                card.removeEventListener(`click`, modalContent);
                card.classList.remove(`activeCard`);
                modalClose();
            });
        } else {
            cards.forEach((card) => {
                setButton(card, true);
                card.addEventListener(`mouseover`, activeCard);
                card.addEventListener(`click`, modalContent);
            });
        }
    });
};
//Фильтры
//Удаляем фильтры
const removeFilter = () => {
    filters.classList.add(`hide`);
    filters.querySelectorAll(`select`).forEach((select) => {
        select.querySelectorAll(`option`).forEach((option, index) => {
            if(index !== 0) {
                option.remove();
            }
        });
    });
}
//Заполняем сеты значиниями для фильтрации
const setFilter = (arr) => {
    console.log(arr);
    filters.classList.remove(`hide`);
    const speciesSet = new Set(),
        genderSet = new Set(),
        statusSet = new Set(),
        citySet = new Set();
    arr.forEach((item) => {
        for(let key in item) {
            if(key === `species`) {
                speciesSet.add(item[key].trim().toLowerCase());
            } else if (key === `gender`) {
                genderSet.add(item[key].trim().toLowerCase());
            } else if (key === `status`) {
                statusSet.add(item[key].trim().toLowerCase());
            } else if (key === `citizenship`) {
                citySet.add(item[key].trim().toLowerCase());
            }
        }
    });
    //Заполняем селекторы этими значениями
    speciesSet.forEach((item) => {
        const option = document.createElement(`option`);
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        option.setAttribute(`value`, `${item}`);
        speciesInput.append(option);
    });
    genderSet.forEach((item) => {
        const option = document.createElement(`option`);
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        option.setAttribute(`value`, `${item}`);
        genderInput.append(option);
    });
    statusSet.forEach((item) => {
        const option = document.createElement(`option`);
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        option.setAttribute(`value`, `${item}`);
        statusInput.append(option);
    });
    citySet.forEach((item) => {
        const option = document.createElement(`option`);
        option.textContent = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        option.setAttribute(`value`, `${item}`);
        cityInput.append(option);
    });
    addFilter(arr);
};
//Изменение и пременение фильтров
const addFilter = (arr) => {
    //Создаем новый массив из полученного в параметре
    let thisArr = arr;
    //Фильтрация
    function changeFunction (event) {
        //Консоль помогает увидеть ошибку - повторный вызов функции
        console.log(`Функция`);
        console.log(thisArr);

        const select = event.target,
        //Создаем новый массив
        filterArr = new Array();

        if(select.value === ``) {
            select.classList.remove(`error-filters`);
            return;
        }
        //Фильтруем созданный архив исходя из действия на селекте
        thisArr.forEach((item) => {
            for(let key in item) {
                if(key !== `movies` && key !== `photo` && 
                    key !== `actors` && key !== `name` && key !== `realName`) {
                    if(item[key].trim().toLowerCase() === select.value) {
                        //Записываем в новый массиф итоги фильтрации
                        filterArr.push(item);
                    } 
                }
            }
        });

        if(filterArr.length) {
            select.classList.remove(`error-filters`);
            select.classList.add(`success-filters`);
            select.setAttribute(`disabled`, `true`);
            //Отображаем карочки;
            renderCards(filterArr);
            //Перезаписываем архив, чтобы при слудующем селекте использовать уже отфильтрованные данные
            thisArr = filterArr;
        } else {
            select.classList.add(`error-filters`);
        }
    };
    // Сброс фильтров
    const resetFilter = () => {
        console.log(`Сброс`);
        //Удаляем события с селектов
        filters.querySelectorAll(`select`).forEach((select) => {
            select.removeEventListener(`change`, changeFunction);
            console.log(`Удалил`);
        });
        filters.querySelectorAll(`select`).forEach((item) => {
            item.classList.remove(`error-filters`);
            item.classList.remove(`success-filters`);
            item.removeAttribute(`disabled`);
            item.value = '';
        });
        //Удаляем событие с кнопки
        filtersReset.removeEventListener(`click`, resetFilter);
        //Отображаем карты из исходного массива, который передали в функцию при вызове
        renderCards(arr);
        addFilter(arr);
    };
    //Навешиваем события на селекты
    filters.querySelectorAll(`select`).forEach((select) => {
        select.addEventListener(`change`, changeFunction);
        console.log(`Навесил`);
    });
    //Кнопка ресета
    filtersReset.addEventListener(`click`, resetFilter);
};


