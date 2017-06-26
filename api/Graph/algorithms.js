//поиск в глубину
function depthSearch (){
    var depthSearchRecursive = function(vertex){  
        vertex.Viewed = true;
        graph.markVertex(vertex, selected, "Ищем смежные вершины.");
        var result = "";
        var neighbors = graph.getNeighbors(vertex);  
        if (neighbors.length > 0){
            result = "Все смежные вершины просмотрены.";
            graph.markVertex(vertex, selected, "Смежные вершины найдены. Просматриваем соседей данной вершины.");
        } else{
            result = "Смежных вершин не найдено.";
        }
        for (var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];
            if (!neighbor.Viewed) {
                graph.markEdge(vertex, neighbor, selected, "Данная вершина не была просмотрена, продолжаем поиск с этой вершины.");
                graph.markVertex(vertex, inQueue, "Отмечаем родительскую вершину.");
                depthSearchRecursive(neighbor);
                graph.markVertex(vertex, selected, "Продолжаем поиск с данной вершины.");
            } else{
                graph.markEdge(vertex, neighbor, selected, "Данную вершину пропускаем, т.к. она была просмотрена."); 
            }
        }
        graph.markVertex(vertex, selected, result);        
        graph.markVertex(vertex, viewed, "Отмечаем точку как просмотренную.");
    }

    var graph = new Graph();
    for (var i = 0; i < graph.vertices.length; i++){        
        var vertex = graph.vertices[i];
        graph.markVertex(vertex, selected, "Берём вершину. Проверяем, были ли эта вершина просмотрена ранее.");
        if (!vertex.Viewed) {
            graph.markVertex(vertex, selected, "Данная вершина не была просмотрена. Начинаем поиск.");
            depthSearchRecursive(vertex);
        } else{
            graph.markVertex(vertex, viewed, "Данную вершину пропускаем, т.к. она была отмечена ранее.");    
        }
    }
}

//поиск в ширину
function breadthSearch () {
    var graph = new Graph();
    var queue = new Array();
    for (var i = 0; i < graph.vertices.length; i++) {
        var startVertex = graph.vertices[i];
        if (!startVertex.Viewed){
            queue.push(startVertex);
        }        
        while (queue.length > 0) {
            var vertex = queue[0];
            queue = queue.slice(1);
            graph.markVertex(vertex, selected, "Достаём вершину из очереди. Проверяем, были ли эта вершина просмотрена ранее.");
            if (!vertex.Viewed){
                graph.markVertex(vertex, selected, "Данная вершина не была просмотрена. Ищем соседей данной вершины.");
                var neighbors = graph.getNeighbors(vertex);
                if (neighbors.length > 0){
                    graph.markVertex(vertex, selected, "Просматриваем соседей данной вершины.");
                }
                for (var j = 0; j < neighbors.length; j++){
                    var neighbor = neighbors[j];
                    if (!neighbor.Viewed){
                        if (!neighbor.InQueue){  
                            neighbor.InQueue = true;                    
                            queue.push(neighbor);
                            graph.markEdge(vertex, neighbor, selected, "Данная вершина не была просмотрена, добавляем её в очередь.");
                            graph.markVertex(neighbor, inQueue, "Вершина добавлена в очередь.");
                        } else {
                            graph.markEdge(vertex, neighbor, selected, "Данную вершину пропускаем, т.к. она уже находится в очереди.");                            
                        }                    
                    } else{
                        graph.markEdge(vertex, neighbor, selected, "Данную вершину пропускаем, т.к. она была просмотрена.");                       
                    }                                
                }                
                graph.markVertex(vertex, viewed, "Отмечаем точку как просмотренную.");
                vertex.Viewed = true;
            } else{
                graph.markVertex(vertex, viewed, "Данную вершину пропускаем, т.к. она была отмечена ранее.");                
            }            
        }
    }    
}