var pointArray = new Array();

window.onload = function(){
paper = Raphael(500,100,700,500);
rectangle = paper.rect(0,0,700,500);
rectangle.attr("fill","#fff");

rectangle.click(function(e)
{	
	pointArray.push(new Point(e.pageX-500, e.pageY-100));
});

//ctrl+enter event
$(document).keypress("enter", function(e){if(e.ctrlKey) ExecuteCode();})
	$('#download').on('click', (event) => {
  $('#datalink').attr(
    'href',
    'data:Application/octet-stream,' + pointsToJSON(pointArray)
  )[0].click();
});

//Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("file");

        filesInput.addEventListener("change", function(event) {

            var files = event.target.files; //FileList object					

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only plain text
                //if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {

                    var textFile = event.target;

                    var div = document.createElement("div");

                    div.innerText = textFile.result;
					var pointData = $.parseJSON(textFile.result);
					for(var i = 0; i < pointData.points.length; i++)
					{
						pointArray.push(new Point(pointData.points[i].x, pointData.points[i].y));
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

function ExecuteCode()
{
	var code = $('#code').val();
	eval(code);
}

function pointsToJSON(pointData)
{	
	var data = {
    type: 'points',
    points: []
  };
  
  for(var i = 0; i < pointData.length; i++)
  {
	  data.points.push({
		  x: pointData[i].X,
		  y: pointData[i].Y
	  });
  }
  
  return JSON.stringify(data, null, 4);
}