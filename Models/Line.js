function Line(startPoint, endPoint)
{
	var line = paper.path("M " + startPoint.X + " " + startPoint.Y + " L " + endPoint.X + " " + endPoint.Y);
	line.attr("stroke-width", 3);
	startPoint.Point.toFront();
	endPoint.Point.toFront();
	startPoint.Text.toFront();
	endPoint.Text.toFront();
	
	this.Line = line;
	this.Start = startPoint.Id;
	this.End = endPoint.Id;
	this.StartPoint = startPoint;
	this.EndPoint = endPoint;
	
	this.Hide = function()
	{
		line.hide();
	}
	
	this.Show = function()
	{
		line.show();
	}

	this.Mark = function(color, text)
	{
		if (!color){
			color = "#0f0";
		}
		line.attr("stroke", color);		
		$("#renderLog")[0].textContent = text;
	}

	this.UnMark = function(){
		line.attr("stroke", "#000");
	}
	
	this.Select = function(color)
	{
		if (!color){
			color = "#0f0";
		}
		line.attr("stroke", color);		
	}
	
	this.Unselect = function()
	{		
		line.attr("stroke", "#000");		
	}
	
	return this;
}