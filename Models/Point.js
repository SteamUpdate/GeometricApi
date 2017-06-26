function Point(x, y, id)
{
	var point = paper.circle(x, y, 8);
	point.attr("fill","#f00");
	
	this.Point = point;
	this.Selected = false;	
	this.X = x;
	this.Y = y;
	this.Id = id;
	this.Text = paper.text(x, y, id+1);	
	this.Viewed = false;
	this.InQueue = false;
	
	this.Hide = function()
	{
		point.hide();
	}

	this.Mark = function(color, text){
		if (!color){
			color = '#0f0';
		}
		point.attr("fill", color);
		$("#renderLog")[0].textContent = text;
	}

	this.UnMark = function(){

	}
	
	this.Show = function()
	{
		point.show();
	}
	
	this.Select = function(color)
	{
		if (!color){
			color = '#0f0';
		}
		this.Selected = true;
		point.attr("fill", color);
	}
	
	this.Unselect = function(color)
	{
		if (!color){
			color = "#f00";
		}
		this.Selected = false;
		point.attr("fill", color);
	}
	
	this.Remove = function()
	{
		point.remove();
	}
	
	return this;
}