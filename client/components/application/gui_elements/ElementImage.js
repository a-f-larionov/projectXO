/**
 * Элемент картинки.
 * @constructor
 */
ElementImage = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Координата X картинки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина картинки.
     * @type {number}
     */
    this.width = 0;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src = '/path/to/image.png';

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    var dom = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.x = self.x;
        dom.y = self.y;
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.src;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = true;
        dom.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        dom.redraw();
    };
};