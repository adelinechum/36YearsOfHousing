var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)

/*
* Global Size Variables
*/

// Columns for YEAR
var colWidth = 35;
var colHeight = 150;
var colXMargin = 1;
var expansionFactor = 5;
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2 - colHeight / 2;

// Super Class
class Rectangle{

  static count = 0;

  constructor(){
    this.form = svg.append("rect")
    this.id = Rectangle.count;
    Rectangle.count++;
  }

  setColor(color){
    this.form.attr("fill", color);
    return this;
  }

  getX(){
    return +this.form.attr("x");
  }
  setX(x) {
    this.form.attr("x", x);
    return this;
  }
  getY() {
    return +this.form.attr("y");
  }
  setY(y) {
    this.form.attr("y", y);
    return this;
  }
  getHeight(){
    return +this.form.attr("height");
  }
  setHeight(h) {
    this.form.attr("height", h);
    return this;
  }
  getWidth() {
    return +this.form.attr("width");
  }
  setWidth(w) {
    this.form.attr("width", w);
    return this;
  }

  }


class Column extends Rectangle{

  // collection of all column
  static cols = [];

  // add a new column:
  // 1. move center to left
  // 2. update position of all columns
  static addCol(){
    if (Column.cols.length) {
      Column.cols.forEach(col => {
        col.setX(col.getX() - (colWidth + colXMargin) / 2)
      });
    }

    Column.cols.push(new Column(centerX + (colWidth + colXMargin) * Column.cols.length / 2));
  }


  constructor(x){
    super()

    this.setX(x)
      .setY(centerY)
      .setWidth(colWidth)
      .setHeight(colHeight)
      .setColor("#5a5a5a")

// Set transform / expand scale and unscale
    this.form
      .on("mouseover",
          () => {
            this.transform(5);
          }
      )
      .on("mouseout",
          () => {
            this.transform(1 / 5)
        }
      )
  }

// Expanding Columns when hover
  transform(r){
    var x = this.getX();
    var y = this.getY();
    var oldWidth = this.getWidth();
    var newWidth = this.getWidth() * r;
    var oldHeight = this.getHeight();
    var newHeight = this.getHeight() * r;
    this.setX(x + oldWidth / 2 - newWidth / 2);
    this.setY(y + oldHeight / 2 - newHeight / 2)
    this.setWidth(this.getWidth() * r);
    this.setHeight(this.getHeight() * r);


    // TODO: need a better way of differntiating on and off...
    // Hacky way of moving columns to each side

    Column.cols.forEach(col => {
      if (col.id < this.id) {
        if (r > 1) {
          col.setX(col.getX() - colWidth * expansionFactor / 2)
        }
        else {
          col.setX(col.getX() + colWidth * expansionFactor / 2)
        }
      }
      else if (col.id > this.id) {
        if (r > 1) {
          col.setX(col.getX() + colWidth * expansionFactor / 2)
        }
        else {
          col.setX(col.getX() - colWidth * expansionFactor / 2)
        }
      }
    });


    }

}

// Here set number of columns
for (var i = 0; i < 36; i++) {
  Column.addCol()
}
