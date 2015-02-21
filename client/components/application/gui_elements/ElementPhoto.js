/**
 * Элемент фотография.
 * @constructor
 * Инициирующие параметры:
 * x : number координта X
 * y : number координта Y
 */
ElementPhoto = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Координата X.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ссылка на картинку фотографии.
     * @type {string}
     */
    this.src = '/path/to/image.png';

    /**
     * Загрушка, на случай, если фотографии нет.
     * @type {string}
     */
    var srcDummy = '/images/photo/camera_c.gif';

    /**
     * Текст появляется при наведении мышки.
     * @type {string}
     */
    var title = '';

    /**
     * Кэллбэк при нажатии левой кнопки мыши.
     * @type {Function}
     */
    var onClick = null;

    /**
     * Состояние индикатора онлайн.
     * @type {boolean}
     */
    var online = false;

    /**
     * Дом фотографии.
     * @type {GUIDom}
     */
    var domPhoto = null;

    /**
     * Дом рамки.
     * @type {GUIDom}
     */
    var domFrame = null;

    /**
     * Дом бордюр.
     * @type {GUIDom}
     */
    var domBorder = null;

    /**
     * Дом границ фоторгафии.
     * @type {GUIDom}
     */
    var domRegion = null;

    /**
     * Дом онлайн индикатора.
     * @type {GUIDom}
     */
    var domOnlineIndicator = null;

    /**
     * Ширина бордюра рамки.
     * @type {number}
     */
    var borderWidth = 1;

    /**
     * Ширина рамки
     * @type {number}
     */
    this.frameWidth = 6;

    /**
     * Диапазон поворота фотографии.
     * @type {number}
     */
    this.degreesDiapazon = 16;

    /**
     * Угол поворота фотографии, расчитывается во время перерисовки.
     * @type {number}
     */
    var degress = 0;

    /**
     * Ширина фотографии.
     * Стандартная 50 на 50 фотография.
     * @type {number}
     */
    this.photoWidth = 50;

    /**
     * Высота фотографии.
     * Стандартная 50 на 50 фотография.
     * @type {number}
     */
    this.photoHeight = 50;

    /**
     * Ширина области активности вокруг фотографии.
     * @type {number}
     */
    var regionWidth = 80;

    /**
     * Высота области активности вокруг фотографии.
     * @type {number}
     */
    var regionHeight = 145;

    /**
     * Пользовательская информация.
     * Будет передаваться при клике.
     * @type {{}}
     */
    var photoInfo = {};

    /**
     * Далее идут переменные кнопки пригласить\играём? и индикатора ждём...
     */

    /**
     * Кнопка пригласить в игру.
     * @type {ElementButton}
     */
    var buttonInvite = null;

    /**
     * Калбэк при нажатии кнопки пригласить в игру.
     * @type {Function}
     */
    var onButtonInviteClick = null;

    /**
     * Активна ли кнопка приглашения в игру.
     * @type {boolean}
     */
    var enableButtonInvite = false;

    /**
     * Кнопка "Играём?".
     * @type {ElementButton}
     */
    var buttonLetsPlay = null;

    /**
     * Калбэк при нажатии кнопки "Играём?".
     * @type {ElementButton}
     */
    var onButtonLetsPlayClick = null;

    /**
     * Индикатор "ждём...".
     * @type {null}
     */
    var domIndicatorWaiting = null;

    /**
     * Показывать ли кнопку пригласить.
     * @type {boolean}
     */
    var showButtonInvite = false;

    /**
     * Показывать ли кнопку "Играем?".
     * @type {boolean}
     */
    var showButtonLetsPlay = false;

    /**
     * Показывать ли индикатор "Ждём...".
     * @type {boolean}
     */
    var showIndicatorWaiting = false;

    /**
     * Показывать ли онлайн индикатор.
     * @type {boolean}
     */
    var showOnlineIndicator = false;

    /**
     * Текст: "занят".
     * @type {GUIDom}
     */
    var elementBusyText = false;

    /**
     * Текст "оффлайн".
     * @type {GUIDom}
     */
    var elementOfflineText = false;

    var showBusyText = false;
    var showOfflineText = false;

    /**
     * Указатель мыши при наведении.
     * @type {string}
     */
    this.pointer = GUI.POINTER_HAND;

    /**
     * Создадим домы и настроем их.
     */
    this.init = function () {
        /* Границы фотографии */
        domRegion = GUI.createDom();
        domRegion.x = self.x;
        domRegion.y = self.y;
        domRegion.width = regionWidth;
        domRegion.height = regionHeight;
        domRegion.pointer = self.pointer;
        GUI.bind(domRegion, GUI.EVENT_MOUSE_CLICK, onClickMediator, this);
        /* Бордюр рамки фотографии */
        domBorder = GUI.createDom(domRegion);
        domBorder.x = 8;
        domBorder.y = 5;
        domBorder.border = borderWidth + 'px solid #ebb';
        domBorder.width = self.frameWidth * 2 + self.photoWidth;
        domBorder.height = self.frameWidth * 2 + self.photoHeight;
        /* Рамка фотографии */
        domFrame = GUI.createDom(domBorder);
        domFrame.border = self.frameWidth + 'px solid #eee';
        domFrame.x = 0;
        domFrame.y = 0;
        domFrame.width = self.photoWidth;
        domFrame.height = self.photoHeight;
        /* Фотография */
        domPhoto = GUI.createDom(domFrame);
        domPhoto.x = 0;
        domPhoto.y = 0;
        domPhoto.height = self.photoHeight;
        domPhoto.width = self.photoWidth;
        domPhoto.backgroundSize = self.photoWidth;
        domPhoto.isItsepia = true;
        /* Индикатор онлайн пользователя */
        domOnlineIndicator = GUI.createDom(domRegion);
        domOnlineIndicator.x = 12;
        domOnlineIndicator.y = 77;
        domOnlineIndicator.width = 15;
        domOnlineIndicator.height = 14;
        /* Кнопка приглашения в игру */
        buttonInvite = GUI.createElement("ElementButton", {
            x: 0,
            y: 77,
            width: 80,
            height: 17,
            srcRest: '/images/photo/buttonInviteRest.png',
            srcHover: '/images/photo/buttonInviteHover.png',
            srcActive: '/images/photo/buttonInviteActive.png',
            title: 'Пригласить в игру.',
            onClick: function (mouseEvent, dom) {
                onButtonInviteClick.call(null, photoInfo);
            }
        }, domRegion);
        /* Кнопка "Играём?" */
        buttonLetsPlay = GUI.createElement("ElementButton", {
            x: -2,
            y: 65,
            width: 90,
            height: 41,
            srcRest: '/images/photo/buttonLetsPlayRest.png',
            srcHover: '/images/photo/buttonLetsPlayHover.png',
            srcActive: '/images/photo/buttonLetsPlayActive.png',
            title: 'Согласиться и войти в игру.',
            onClick: function (mouseEvent, dom) {
                onButtonLetsPlayClick.call(null, photoInfo);
            }
        }, domRegion);
        /* Индикатор "Ждём..." */
        domIndicatorWaiting = GUI.createDom(domRegion);
        domIndicatorWaiting.x = 3;
        domIndicatorWaiting.y = 64;
        domIndicatorWaiting.width = 90;
        domIndicatorWaiting.height = 41;
        domIndicatorWaiting.backgroundImage = '/images/photo/indicatorWait.png';
        domIndicatorWaiting.title = 'Ожидание оппонента.';
        /* Текст оффлайн. */
        elementOfflineText = GUI.createDom(domRegion);
        elementOfflineText.x = 8;
        elementOfflineText.y = 73;
        elementOfflineText.width = 62;
        elementOfflineText.height = 15;
        elementOfflineText.backgroundImage = '/images/photo/textOffline.png';
        elementOfflineText.opacity = 0.21;
        /* Текст занят. */
        elementBusyText = GUI.createDom(domRegion);
        elementBusyText.x = 15;
        elementBusyText.y = 72;
        elementBusyText.width = 49;
        elementBusyText.height = 14;
        elementBusyText.backgroundImage = '/images/photo/textBusy.png';
        elementBusyText.opacity = 0.37;
    };

    /**
     * Покажем домы.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        domRegion.show();
        domBorder.show();
        domFrame.show();
        domPhoto.show();
        domOnlineIndicator.show();
        self.redraw();
        /**
         *  Элементы:
         *  domIndicatorWaiting, buttonInvite, buttonLetsPlay
         *  показываются в функции redraw(), т.к. их отобржение не безусловно.
         */
    };

    /**
     * Спрячем домы.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        domRegion.hide();
        domBorder.hide();
        domFrame.hide();
        domPhoto.hide();
        domOnlineIndicator.hide();
        domIndicatorWaiting.hide();
        buttonInvite.hide();
        buttonLetsPlay.hide();
    };

    /**
     * Перерисуем фотографию.
     */
    this.redraw = function () {
        if (!showed) return;
        degress = getRealRandom(self.src);
        domRegion.title = title;
        /* Если, нет фотографии, то отображаем заглушку */
        if (self.src == null || self.src == undefined || self.src == '') {
            self.src = srcDummy;
        }
        domPhoto.backgroundImage = self.src;
        domRegion.transform = 'rotate(' + degress + 'deg)';
        domRegion.redraw();
        domPhoto.redraw();
        domBorder.redraw();
        domFrame.redraw();
        if (showOnlineIndicator) {
            if (online) {
                domOnlineIndicator.backgroundImage = '/images/photo/iconOnline.png';
                domOnlineIndicator.title = 'онлайн';
            } else {
                domOnlineIndicator.backgroundImage = '/images/photo/iconOffline.png';
                domOnlineIndicator.title = 'оффлайн';
            }
            domOnlineIndicator.show();
            domOnlineIndicator.redraw();
        } else {
            domOnlineIndicator.hide();
        }
        if (showIndicatorWaiting) {
            domIndicatorWaiting.show();
            domIndicatorWaiting.redraw();
        } else {
            domIndicatorWaiting.hide();
        }
        if (showButtonInvite) {
            buttonInvite.enabled = enableButtonInvite;
            buttonInvite.show();
            buttonInvite.redraw();
        } else {
            buttonInvite.hide();
        }
        if (showButtonLetsPlay) {
            buttonLetsPlay.show();
            buttonLetsPlay.redraw();
        } else {
            buttonLetsPlay.hide();
        }
        if (showBusyText) {
            elementBusyText.show();
        } else {
            elementBusyText.hide();
        }
        if (showOfflineText) {
            elementOfflineText.show();
        } else {
            elementOfflineText.hide();
        }
    };

    /**
     * Обновление данных фотографии.
     * @param params { {
     *       src: string,
     *       title: string,
     *       online: boolean,
     *       photoInfo: object,
     *       showButtonInvite: boolean,
     *       showButtonLetsPlay: boolean,
     *       showIndicatorWaiting: boolean,
     *       onClick: Function,
     *       onButtonInviteClick: Function,
     *       onButtonLetsPlayClick: Function,
     *       enableButtonInvite: boolean,
     *       showOnlineIndicator: boolean
     *   }}
     */
    this.update = function (params) {
        self.src = params.src;
        title = params.title;
        online = params.online;
        photoInfo = params.photoInfo;
        showButtonInvite = params.showButtonInvite;
        showButtonLetsPlay = params.showButtonLetsPlay;
        showIndicatorWaiting = params.showIndicatorWaiting;
        showOnlineIndicator = params.showOnlineIndicator;
        onClick = params.onClick;
        onButtonInviteClick = params.onButtonInviteClick;
        onButtonLetsPlayClick = params.onButtonLetsPlayClick;
        enableButtonInvite = params.enableButtonInvite;
        showBusyText = params.showBusyText;
        showOfflineText = params.showOfflineText;
    };

    /**
     * Случайное условно-постоянное число на основе строки.
     * @returns {number}
     */
    var getRealRandom = function (string) {
        /* random rotate photo */
        /* super real-random */
        /* считаем сумму всех кодов знаков из строки, умноженных на позицию знака(*256) */
        var deg, number, date, superPosition;
        superPosition = 360;
        number = 0;
        for (var i in string) {
            number += string.charCodeAt(i) * ((i * 256) + 1);
        }
        date = new Date;
        number += date.getDay(); //TODO switch to getTime()
        /* super real-random */
        deg = (number % ( superPosition + 1)) - (( superPosition + 1) / 2);
        deg = deg / superPosition * self.degreesDiapazon;
        return deg;
    };

    /**
     * Посредник кэллбэка, т.к. кэллбак присваивается один раз.
     * И в процессе может меняться.
     */
    var onClickMediator = function () {
        if (onClick) {
            onClick.call(null, photoInfo);
        }
    }
};
