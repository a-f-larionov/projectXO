/**
 * ApiRouter
 * Клиент-серверный компонент!
 * @constructor
 */
ApiRouter = function () {
    var self = this;

    var map = null;

    var connections = {};
    var onDisconnectCallbacks = [];
    var onFailedSendCallbacks = [];

    this.setup = function (setup) {
        if (setup.map) map = setup.map;
    };

    /**
     * Обрабатываем поступающие данные.
     * @param packet {string} пакет данных, фомат:JSON, {group:string, method:string, args:[...]}
     * @param id {Number} id соединения.
     */
    this.onData = function (packet, id) {
        var group, method, args;
        try {
            packet = JSON.parse(packet);
        } catch (e) {
            Logs.log("Wrong data:parse error", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet != 'object') {
            Logs.log("Wrong data: packet must be 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.group == undefined) {
            Logs.log("Wrong data: packet must have .group", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.group != 'string') {
            Logs.log("Wrong data: packet.group must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.method == undefined) {
            Logs.log("Wrong data: packet must have .method", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.method != 'string') {
            Logs.log("Wrong data: packet.method must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.args == undefined) {
            Logs.log("Wrong data: packet must have .args", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.args != 'object') {
            Logs.log("Wrong data: packet.args must have type 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] == undefined) {
            Logs.log("Wrong data: group not found " + group, Logs.LEVEL_WARNING, packet);
            return;
        }
        if (map[group][method] == undefined) {
            Logs.log("Wrong data: method not found " + method, Logs.LEVEL_WARNING, packet);
            return;
        }
        // добавим к аргументам контекст соединения.
        args.unshift(connections[id]);
        // выполним запрашиваемый метод.
        Logs.log(">> " + group + "." + method + JSON.stringify(args), Logs.LEVEL_DETAIL);
        map[group][method].apply(self, args);
    };

    this.onConnect = function (id) {
        Logs.log("connection created: id=" + id, Logs.LEVEL_DETAIL);
        connections[id] = {
            connectionId: id
        };
    };

    this.onDisconnect = function (id) {
        Logs.log("connection close: id=" + id, Logs.LEVEL_DETAIL);
        for (var i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        delete connections[id];
    };

    this.executeRequest = function (group, method, args, cntxList) {
        /* Конвертируем объект в массив. */
        args = Array.prototype.slice.call(args);
        Logs.log("<< " + group + "." + method + JSON.stringify(args), Logs.LEVEL_DETAIL);
        var packet = {
            group: group,
            method: method,
            args: args
        };
        packet = JSON.stringify(packet);
        var cntxListLength = 0;
        for (var i in cntxList) {
            if (!this.sendData(packet, cntxList[i].connectionId)) {
                Logs.log("ApiRouter.failedToSend", Logs.LEVEL_WARNING, {packet: packet, cntx: cntxList[i]});
                for (var i in onFailedSendCallbacks) {
                    onFailedSendCallbacks[i].call(self, cntxList[i]);
                }
            }
            cntxListLength++;
        }
        if (cntxListLength == 0) {
            Logs.log("ApiRouter. Try send to empty contextlist.", Logs.LEVEL_WARNING, {packet: packet, cntxList: cntxList});
        }
    };

    /**
     * Добавлить каллбэк дисконнекта.
     * Будет вызван при дисконнекте соедеинения.
     * @param callback
     */
    this.addOnDisconnectCallback = function (callback) {
        onDisconnectCallbacks.push(callback);
    };

    /**
     * Добавлить каллбэк неудачной отправки.
     * Будет вызван при неудачной отправки данных, в разорванное соединение.
     * @param callback
     */
    this.addOnFailedSendCallback = function (callback) {
        onFailedSendCallbacks.push(callback);
    };
};