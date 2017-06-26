//построение выпуклой оболчки
function graham() {
    var locus = new Locus();
    var sortredArray = new Array();
    for (var i = 0; i < locus.points.length; i++){
        sortredArray.push(locus.points[i]);
    }

    var minIndex = 0;
    var min = sortredArray[0].X;

    //поиск крайней точки
	for (var i = 1; i < sortredArray.length; i++)
	{
        var x = sortredArray[i].X;
		if (x < min) 
		{
			min = x;
            minIndex = i;
		}
	}

    //меняем местами точки
    var minPoint = sortredArray[minIndex];
    sortredArray[minIndex] = sortredArray[0];
    sortredArray[0] = minPoint;

    locus.markVertex(minPoint, viewed, "Выбираем точку с наименьшей x координатой. Эта точка гарантированно входит в МВО.");    

    //сортировка оставшихся точек
	for (var i = 1; i < sortredArray.length - 1; i++)
	{
		for (var j = i + 1; j < sortredArray.length; j++) 
		{	
			/*если векторное произведение меньше 0, следовательно вершина j левее вершины i. Меняем их местами*/
			if (locus.classify(sortredArray[0], sortredArray[i], sortredArray[j]) < 0)
			{
				temp = sortredArray[i];
				sortredArray[i] = sortredArray[j];
				sortredArray[j] = temp;
			}
		}
	}

    var grahamArray = new Array();
    grahamArray.push(sortredArray[0]);
    grahamArray.push(sortredArray[1]);

    locus.markVertex(sortredArray[1], viewed, "Эта точка гарантированно входит в МВО.");
    locus.createEdge(sortredArray[0], sortredArray[1]);

    //построение линий
	for (var i = 2; i < sortredArray.length; i++) 
	{               
		while (true)
		{
            var currentPoint = sortredArray[i];
            locus.markVertex(currentPoint, selected, "Точка-кандидат"); 

            var startPoint = grahamArray[grahamArray.length - 2];
            var endPoint = grahamArray[grahamArray.length - 1];			

            locus.markEdge(startPoint, endPoint, selected, "Вычисляем векторное произведние между последним построенным вектором и точкой-кандидатом");
			if(locus.classify(startPoint, endPoint, currentPoint) > 0) 
			{
                /*добавляем новую точку в оболочку*/
				grahamArray.push(currentPoint);
                locus.markVertex(currentPoint, viewed, "Векторное произведение больше нуля. Точка добавлена в выпуклую оболочки.");
                /*создание нового ребра*/
                locus.createEdge(endPoint, currentPoint);
                /*покраска построенного до этого ребра в чёрный цвет*/
                locus.markEdge(startPoint, endPoint, "#000");
				break;
			}
			else
			{		
                /*пока встречается правый поворот, убираем точку из оболочки*/	
                var point = grahamArray.pop();
                locus.markVertex(currentPoint, unselected, "Векторное произведение меньше нуля. Точка удаляется из выпуклой оболочки.");
                locus.markVertex(point, unselected, "Удаление точки из оболочки.");
                locus.deleteEdge(startPoint, endPoint);               
			}			
		}		
	} 
    locus.markVertex(sortredArray[sortredArray.length - 1], viewed, "Последняя точка выпуклой оболчки найдена. Строим последнюю линию.");
    locus.createEdge(sortredArray[sortredArray.length - 1], sortredArray[0]);
}