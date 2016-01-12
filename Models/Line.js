function Line(startPoint, endPoint)
{
	var line = paper.path("M " + startPoint.X + " " + startPoint.Y + " L " + endPoint.X + " " + endPoint.Y);
	line.attr("stroke-width",1);
	
	this.Hide = function()
	{
		line.hide();
	}
	
	this.Show = function()
	{
		line.show();
	}
	
	this.Select = function()
	{
		line.attr("stroke", "#0f0");
		line.attr("stroke-width",2);
	}
	
	this.Unselect = function()
	{
		line.attr("stroke", "#000");
		line.attr("stroke-width",1);
	}
	
	return this;
}