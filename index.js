var pointArray = new Array();
var lineArray = new Array();
var paintPoints = true;
var paintLines = false;
var selectedForLine = [];
var grahamLines = new Array();

//очередь для рендера
var renderQueue = new Array();

//Colors
var unselected = "#f00";
var selected = "#0f0";
var inQueue = "#00f";
var viewed = "#ff0";

var cachedCode = "";

//рефакторинг
//разобраться с тултипами

window.onload = function() {

	//открытие выбора файла с помощью клика на кнопку
	$("#upload_button")[0].onclick = function() {
		$('#file')[0].click();
	};

	//отмена функции нажатия на кнопку, если она disabled
	$('#labelLines').click(function (ev) {
		if ($(ev.target).find('input:disabled, input.disabled').length) {
			return false;
		}
	});

	//изменение режима работы с графическим объектом
	$('input:radio[name=mainOptions]').change(function() {
		var rbLines = $('#labelLines');
		var optionGraham = $("#optionGraham");
		var optionBreadthSearch = $("#optionBreadthSearch");
		var optionDepthSearch = $("#optionDepthSearch");
		$('#functionSelector').val("empty");

		if (this.value === "locus") {			
			if (!rbLines.hasClass("disabled")) {
				rbLines.addClass("disabled");
				$('#lines').attr("disabled", true);
			}
			$('#points')[0].click();		

			//изменение значения селекторов
			optionGraham[0].hidden = false;
			optionBreadthSearch[0].hidden = true;
			optionDepthSearch[0].hidden = true;

			//прячем все линии, которые были нарисованы в режиме графов
			for (var i = 0; i < lineArray.length; i++){
				var line = lineArray[i];				
				line.Hide();
			}			
		}
		else if (this.value === "graph") {
			//режим рисования доступен	
			if (rbLines.hasClass("disabled")) {
				rbLines.removeClass("disabled");
				$('#lines').attr("disabled", false);
			}

			//изменение значения селекторов
			optionGraham[0].hidden = true;
			optionBreadthSearch[0].hidden = false;
			optionDepthSearch[0].hidden = false;

			//показываем линии, которые были нарисованы в режиме графов
			for (var i = 0; i < lineArray.length; i++) {
				var line = lineArray[i];				
				line.Show();
			}
		}

		//запоминаем старый код и очищаем редактор
		var previouseCode = editor.getValue();
		if (cachedCode) {
			editor.setValue(cachedCode);			
		} else{
			editor.setValue("");
		}
		cachedCode = previouseCode;		
	});	

	//изменение режима рисования
	$('input:radio[name=paintOptions]').change(function() {
		if (this.value == 'points') {
			paintLines = false;
			paintPoints = true;	
		}
		else if (this.value == 'lines') {
			paintPoints = false;
			paintLines = true;
		}
	});

	//создание редактора кода
	editor = ace.edit("aceEditor");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");

	//создание графического редактора
	rpw = $('#raphaelEditor').width() - 20;
	paper = Raphael("raphaelEditor",rpw,500);
	rectangle = paper.rect(0,0,rpw,500);
	rectangle.attr("fill","#fff");

	rectangle.click(function(e)
	{
		if(paintPoints)
		{
			var point = new Point(e.layerX-10, e.layerY, pointArray.length);		
			pointArray.push(point);		
			point.Point.click(function(e)
			{
				PointClick(point);			
			});
			point.Text.click(function(e)
			{
				PointClick(point);			
			});
		}	
	});	

	//ctrl+enter event
	$(document).keypress("enter", function(e)
		{
			if(e.ctrlKey) ExecuteCode();
		})
		
	$('#download').on('click', (event) => {
		$('#datalink').attr(
			'href',
			'data:Application/octet-stream,' + objectToJson(pointArray, lineArray)
		)[0].click();
		});

	//Check File API support
	if (window.File && window.FileList && window.FileReader) {
		var filesInput = document.getElementById("file");

		if (!filesInput) return;

		filesInput.addEventListener("change", function(event) {

			var files = event.target.files; //FileList object					

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var picReader = new FileReader();
				picReader.addEventListener("load", function(event) {

					var textFile = event.target;

					var div = document.createElement("div");
					div.innerText = textFile.result;
					var data = $.parseJSON(textFile.result);
					var pointData = data.types[0];
					for(var i = 0; i < pointData.points.length; i++)
					{
						pointArray.push(new Point(pointData.points[i].x, pointData.points[i].y, i));
					}

					var mainOption = getMainOptionsValue();
					if (mainOption === "graph" && data.types.length >= 2)
					{
						var lineData = data.types[1];
						for(var i = 0; i < lineData.points.length; i++)
						{
							lineArray.push(new Line(pointArray[lineData.points[i].start], pointArray[lineData.points[i].end]));
						}
					}
				});

				//Read the text file
				picReader.readAsText(file);				
			}
		});
	}
	else {
		console.log("Your browser does not support File API");
	}
}

function objectToJson(pointData, lineData)
{
	var data = 
	{
		types: []
	};
	
	var dataPoints = {
		type: 'points',
		points: []
	};
  
	for(var i = 0; i < pointData.length; i++)
	{
		dataPoints.points.push({
			x: pointData[i].X,
			y: pointData[i].Y
		});
	}
	
	data.types[0] = dataPoints;
	
	var dataLines = {
		type: 'lines',
		points: []
	};
	
	for(var i = 0; i < lineData.length; i++)
	{
		dataLines.points.push({
			start: lineData[i].Start,
			end: lineData[i].End
		});
	}
	
	data.types[1] = dataLines;
	
	return JSON.stringify(data, null, 4);
}

function PointClick(point)
	{
		if(point.Selected)
		{
			point.Unselect();
			if(paintLines)
			{
				var index = selectedForLine.indexOf(point);
				selectedForLine.splice(index, 1);			
			}
		}
		else
		{
			point.Select();
			if(paintLines)
			{
				selectedForLine.push(point);
			}
		}
		
		if(paintLines)
		{
			if(selectedForLine.length == 2)
			{					
				var newLine = new Line(selectedForLine[0], selectedForLine[1]);				

				newLine.Line.click(function(e)
				{
					var x = e.layerX-10;
					var y = e.layerY;				
					var pointAtLength = line.Line.getPointAtLength();
					var sdx = Math.abs(pointAtLength.start.x - x);
					var sdy = Math.abs(pointAtLength.start.y - y);
					var edx = Math.abs(pointAtLength.end.x - x);
					var edy = Math.abs(pointAtLength.end.y - y);
					if(sdx < edx && sdy < edy)
					{
						PointClick(line.StartPoint);
					}
					else
					{
						PointClick(line.EndPoint);
					}
				});			
				selectedForLine[0].Unselect();
				selectedForLine[1].Unselect();
				selectedForLine.splice(0, 2);	

				for (var i = 0; i < lineArray.length; i++) {
					var line = lineArray[i];
					if (line.Start === newLine.Start && line.End === newLine.End) {
						return;
					}
					if (line.Start === newLine.End && line.End === newLine.Start) {
						return;
					}
				}

				lineArray.push(newLine);					
			}
		}
	}

function getMainOptionsValue(){
	return $('input[name="mainOptions"]:checked').val()
}

function OnSelectorChange(){
	var selectorValue = $('#functionSelector')[0].value;	
	var entry = "";
	if (selectorValue !== "empty")
	{
		var mainOption = getMainOptionsValue();
		if (mainOption === "locus") {
			if (selectorValue === "graham") {
				entire = graham.toString(); 
			}
		} else if (mainOption === "graph") {
			if (selectorValue === "breadthSearch") {
				entire = breadthSearch.toString(); 			
			}
			if (selectorValue === "depthSearch") {
				entire = depthSearch.toString(); 
			}
		}
		var body = entire.match(/function[^{]+\{([\s\S]*)\}$/)[1];
		editor.setValue(body);
	} else{
		editor.setValue("");
	}	
}

function* locusAnimate(){	
	for (var i = 0; i < renderQueue.length; i++){
		var target = renderQueue[i];
		if (target.element){
			target.element.Mark(target.color, target.text);
		}

		if (target.action) {
			if (target.action === "createEdge") {
				grahamLines.push(new Line(target.sp, target.ep));
			} else if (target.action === "deleteEdge") {
				for (var j = 0; j < grahamLines.length; j++) {
					var line = grahamLines[j];
					if (line.Start === target.sp.Id && line.End === target.ep.Id) {                
						grahamLines.splice(j, 0);
						line.Line.remove();
						break;
					}
				}
			} else if (target.action === "markEdge"){
				for (var j = 0; j < grahamLines.length; j++) {
					var line = grahamLines[j];
					if (line.Start === target.sp.Id && line.End === target.ep.Id) {                
						line.Mark(target.color, target.text);
						break;
					}
				}
			}
		}		
		yield null;
	}
	$("#renderLog")[0].textContent = "Алгоритм завершён.";
}

function* graphAnimate(){
	for (var i = 0; i < renderQueue.length; i++){
		if (i > 0) {
			var prevTarget = renderQueue[i-1];
			if (target.element){
				target.element.UnMark();
			}						
		}
		var target = renderQueue[i];
		if (target.element){
			target.element.Mark(target.color, target.text);
		}		
		if (target.sp && target.ep) {
			if (target.action === "select") {
				for (var j = 0; j < grahamLines.length; j++){
					var someLine = grahamLines[j];
					if (someLine.Start === target.sp.Id && someLine.End === target.ep.Id){
						someLine.Select();
						break;
					}
				}
			}
			else {			
				var line = new Line(target.sp, target.ep);
				grahamLines.push(line);
			}
		}
		if (target.action === "remove"){
			var line = grahamLines.pop();
			line.Line.remove();
		}
		if (target.action === "unselect"){
			grahamLines[grahamLines.length - 2].Unselect();
		}
		yield null;
	}
	$("#renderLog")[0].textContent = "Алгоритм завершён.";
}

function StartAnimate()
{
	var playButton = $("#startAnimate");
	if (!playButton[0].disabled) {		
		var mainOption = getMainOptionsValue();
		if (mainOption === "locus") {
			gen = locusAnimate();
		} else if (mainOption === "graph") {
			gen = graphAnimate();
		}
		playButton[0].disabled = true;
		$("#nextStep")[0].disabled = false;
		$("#resetAnimate")[0].disabled = false;
	}
}

function NextPoint()
{
	gen.next();
}

function Reset()
{
	//вовзращаем точкам цвет по умолчанию
	for(var i = 0; i < pointArray.length; i++)
	{
		var point = pointArray[i];
		point.Unselect();
		point.Viewed = false;
		point.InQueue = false;
	}

	var mainOption = getMainOptionsValue();
	if (mainOption === "locus") {
		//удаление линий
		for (var i = 0; i < grahamLines.length; i++) {
			grahamLines[i].Line.remove();
		}
		grahamLines = new Array();
		gen = locusAnimate();
	} else if (mainOption === "graph") {
		//вовзращаем линиям цвет по умолчанию
		for (var i = 0; i < lineArray.length; i++) {
			lineArray[i].Unselect();
		}
		gen = graphAnimate();
	}
	$("#renderLog").val("");	
}

function ExecuteCode()
{	
	renderQueue = new Array();
	$("#resetAnimate")[0].click();
	$("#startAnimate")[0].disabled = false
	$("#nextStep")[0].disabled = true;
	$("#resetAnimate")[0].disabled = true;
	var code = editor.getValue();
	eval(code);
}