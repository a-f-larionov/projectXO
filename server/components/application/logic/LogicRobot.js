LogicRobot = function () {
    var self = this;

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };

    var generateAllLineForField = function (game, state) {
        var allLines, lines;
        var prid = Profiler.start(Profiler.ID_GENERATE_LINES);
        allLines = [];
        if (game.fieldTypeId == LogicXO.FIELD_TYPE_15X15) {
            for (var y = 0; y < state.fieldSize; y++) {
                for (var x = 0; x < state.fieldSize; x++) {
                    if (game.field[y][x] != LogicXO.SIGN_ID_Empty) {
                        lines = generateAllLinesAtPoint(game, x, y, state);
                        allLines = allLines.concat(lines);
                    }
                }
            }
        }
        else {
            for (var y = 0; y < state.fieldSize; y++) {
                for (var x = 0; x < state.fieldSize; x++) {
                    lines = generateAllLinesAtPoint(game, x, y, state);
                    allLines = allLines.concat(lines);
                }
            }
        }
        Profiler.stop(Profiler.ID_GENERATE_LINES, prid);
        return allLines;
    };

    var generateAllLinesAtPoint = function (game, X, Y, state) {
        var lines, line;
        lines = [];
        for (var i in LogicXO.lineIds) {
            line = generateOneLine(game, X, Y, LogicXO.lineIds[i], true, state);
            if (line.length == state.lineSize)lines.push(line);
            line = generateOneLine(game, X, Y, LogicXO.lineIds[i], false, state);
            if (line.length == state.lineSize)lines.push(line);
        }
        return lines;
    };

    var generateOneLine = function (game, X, Y, lineId, direction, state) {
        var vector, line, x, y;
        vector = LogicXO.getLineVector(lineId, direction);
        line = {};
        line.length = 0;
        line.points = {};
        line.points[LogicXO.SIGN_ID_Empty] = [];
        line.points[LogicXO.SIGN_ID_X] = [];
        line.points[LogicXO.SIGN_ID_O] = [];
        x = X;
        y = Y;
        for (var i = 0; i < state.lineSize; i++) {
            if (x < 0 || x >= state.fieldSize || y < 0 || y >= state.fieldSize) {
                continue;
            }
            line.length++;
            line.points[game.field[y][x]].push({x: x, y: y});
            x += vector.x;
            y += vector.y;
        }
        return line;
    };

    /**
     * Генерирует координаты хода для робота.
     * Выбирает оптимальный ход аналитически.
     * @param game {Object}
     */
    this.generateMovementCoords = function (game) {
        var state, max, target, line, robotSignId, playerSignId, lines, randomIndex, emptyPoints;

        state = {
            fieldSize: LogicXO.getFieldSize(game.fieldTypeId),
            robotSignId: game.XUserId == 0 ? LogicXO.SIGN_ID_X : LogicXO.SIGN_ID_O,
            playerSignId: game.XUserId == 0 ? LogicXO.SIGN_ID_O : LogicXO.SIGN_ID_X,
            lineSize: LogicXO.getLineSize(game.fieldTypeId)
        };

        robotSignId = state.robotSignId;
        playerSignId = state.playerSignId;

        if (game.fieldTypeId == LogicXO.FIELD_TYPE_3X3) {

            lines = generateAllLineForField(game, state);
            // ищем линии с длиной 2 нашего знака
            for (var i in lines) {
                if (lines[i].points[robotSignId].length == state.fieldSize - 1 && lines[i].points[LogicXO.SIGN_ID_Empty].length > 0) {
                    return lines[i].points[LogicXO.SIGN_ID_Empty][0];
                }
            }
            // ищем линии с длиной 2 у противоположного знака
            for (var i in lines) {
                if (lines[i].points[playerSignId].length == state.fieldSize - 1 && lines[i].points[LogicXO.SIGN_ID_Empty].length > 0) {
                    return lines[i].points[LogicXO.SIGN_ID_Empty][0];
                }
            }
            // ищем линии с длиной 1 нашего знака
            for (var i in lines) {
                if (lines[i].points[robotSignId].length == state.fieldSize - 2 && lines[i].points[LogicXO.SIGN_ID_Empty].length > 0) {
                    //return lines[i].points[LogicXO.SIGN_ID_Empty][0];
                }
            }
            // ищем линии с длиной 1 у противоположного знака
            for (var i in lines) {
                if (lines[i].points[playerSignId].length == state.fieldSize - 2 && lines[i].points[LogicXO.SIGN_ID_Empty].length > 0) {
                    //return lines[i].points[LogicXO.SIGN_ID_Empty][0];
                }
            }
            // если центр пуст, ставим туда
            if (game.field[1][1] == LogicXO.SIGN_ID_Empty) {
                return {x: 1, y: 1};
            }
            // возвращаем случайную пустую
            emptyPoints = [];
            for (var y = 0; y < state.fieldSize; y++) {
                for (var x = 0; x < state.fieldSize; x++) {
                    if (game.field[y][x] == LogicXO.SIGN_ID_Empty) {
                        emptyPoints.push({x: x, y: y});
                    }
                }
            }
            randomIndex = Math.round(Math.random() * (emptyPoints.length - 1));
            x = emptyPoints[randomIndex].x;
            y = emptyPoints[randomIndex].y;
            return {x: x, y: y};
        }

        lines = generateAllLineForField(game, state);

        /* Find 4 robot & 1 empty */
        for (var i in  lines) {
            if (lines[i].points[robotSignId].length == 4 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 1) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 4 opponent & 1 empty */
        for (var i in  lines) {
            if (lines[i].points[playerSignId].length == 4 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 1) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 3 opponent & 2 empty */
        for (var i in  lines) {
            if (lines[i].points[playerSignId].length == 3 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 2) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 3 robot & 2 empty */
        for (var i in  lines) {
            if (lines[i].points[robotSignId].length == 3 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 2) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 2 opponent & 3 empty */
        for (var i in  lines) {
            if (lines[i].points[playerSignId].length == 2 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 3) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 1 robot & 4 empty */
        for (var i in  lines) {
            if (lines[i].points[robotSignId].length == 1 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 4) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Find 1 opponent & 4 empty */
        for (var i in  lines) {
            if (lines[i].points[playerSignId].length == 1 & lines[i].points[LogicXO.SIGN_ID_Empty].length == 4) {
                return lines[i].points[LogicXO.SIGN_ID_Empty][0];
            }
        }
        /* Set random position */
        // возвращаем случайную пустую
        emptyPoints = [];
        for (var y = 0; y < state.fieldSize; y++) {
            for (var x = 0; x < state.fieldSize; x++) {
                if (game.field[y][x] == LogicXO.SIGN_ID_Empty) {
                    emptyPoints.push({x: x, y: y});
                }
            }
        }
        randomIndex = Math.round(Math.random() * (emptyPoints.length - 1));
        x = emptyPoints[randomIndex].x;
        y = emptyPoints[randomIndex].y;
        return {x: x, y: y};
    };
};

/**
 * Статичный класс.
 * @type {LogicRobot}
 */
LogicRobot = new LogicRobot();
