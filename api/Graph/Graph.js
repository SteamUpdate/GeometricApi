// API для работы с визуализацией алгоритмов на графах
function Graph(){    

    //список всех вершин графа
    this.vertices = new Array();

    //поиск соседних точек, которые начинаются или заканчиваются  с той же точки, что и передаётся в функцию
    var findNeighborsPoints = function(point) {
        var result = new Array();
        for (var i = 0; i < lineArray.length; i++) {
            var line = lineArray[i];
            if (line.Start === point.Id) {
                result.push(line.EndPoint);
            }
            if (line.End === point.Id) {
                result.push(line.StartPoint);
            }
        }
        return result;
    }

    var graphMap = {};
    for (var i = 0; i < pointArray.length; i++){
        var point = pointArray[i];
        this.vertices.push(point);
        graphMap[point.Id] = findNeighborsPoints(point);
    }

    //подсветить точку и вывести информацию
    this.markVertex = function(point, color, text) {
        renderQueue.push({element: point, color: color, text: text});
    }

    //подсветить ребро и вывести информацию
    this.markEdge = function(startPoint, endPoint, color, text){
        for (var i = 0; i < lineArray.length; i++){
            var line = lineArray[i];
            if (line.Start === startPoint.Id && line.End === endPoint.Id
             || line.Start === endPoint.Id && line.End === startPoint.Id) {
                renderQueue.push({element: line, color: color, text: text});
                return;
            }
        }
    }

    //получить соседей точки
    this.getNeighbors = function(vertex){
        return graphMap[vertex.Id];
    }

    return this;
}