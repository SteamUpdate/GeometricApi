//API для работы с визуализацией алгоритмов на геометрическом месте точек
function Locus() {

    //список всех точек
    this.points = new Array();

    for (var i = 0; i < pointArray.length; i++) {
        var point = pointArray[i];
        this.points.push(point);
    }

    //функция вычисления векторного произведения
    this.classify = function(start, end, target) {
        return (end.X - start.X) * (target.Y - start.Y) - (end.Y - start.Y) * (target.X - start.X);
    }   

    //подсветить точку и вывести информацию
    this.markVertex = function(point, color, text) {
        renderQueue.push({element: point, color: color, text: text});
    }

    //подсветить ребро и вывести информацию
    this.markEdge = function(start, end, color, text) {
        renderQueue.push({action: "markEdge", sp: start, ep: end, color: color, text: text});
    }

    //создать ребро (линию)
    this.createEdge = function(start, end) {
        renderQueue.push({action: "createEdge", sp: start, ep: end});
    }

    //удалить ребро (линию)
    this.deleteEdge = function(start, end) {
        renderQueue.push({action: "deleteEdge", sp: start, ep: end});
    }

    return this;
}