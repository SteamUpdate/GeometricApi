function Point(x, y)
{
	var point = paper.circle(x, y, 4);
	point.attr("fill","#f00");
	
	this.X = x;
	this.Y = y;
	
	
	this.Hide = function()
	{
		point.hide();
	}
	
	this.Show = function()
	{
		point.show();
	}
	
	this.Select = function()
	{
		point.attr("fill", "#0f0");
	}
	
	this.Unselect = function()
	{
		point.attr("fill", "#f00");
	}
	
	this.Remove = function()
	{
		point.remove();
	}
	
	return this;
}