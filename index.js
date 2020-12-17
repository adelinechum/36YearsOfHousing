var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)

/*
* Global Size Variables
*/

var colWidth = 30;
var colHeight = 0;
var colXMargin = 5;
var expansionFactor = 2;
var panelPerCol = 7 //number of panels we want per column
var panelHeightMargin = 10;
var panelHeight = 35;
var panelWidth = colWidth - colXMargin;
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2 - (panelPerCol * (panelHeightMargin + panelHeight)); //location of grid matrix visualization
var eventsEnabled = true

class Rectangle{

  static count = 0;

  constructor(){
    this.form = null;
    this.id = Rectangle.count;
    Rectangle.count++;
  }

  setColor(color){
    this.form.style("fill", color);
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

// TODO: make column height adjust to panels
// TODO: center adjust columns instead of top aligned

class Column extends Rectangle{

  // collection of all column
  static cols = [];

  // add a new column:
  // 1. move center to left
  // 2. update position of all columns
  static addCol(year){
    if (Column.cols.length) {
      Column.cols.forEach(col => {
        // here shift all columns over to left to keep centered
        col.setX(col.getX() - (colWidth + colXMargin) / 2);
        col.updateTextPosition()
        col.updatePanelsPositions();
      });
    }

    var res = new Column(centerX + (colWidth + colXMargin) * Column.cols.length / 2, year);
    Column.cols.push(res);
    return res;
  }

  constructor(x, year){
    super()

    this.form = svg.append("rect")

    this.panelNum = 0;

    this.panels = [];

    // initialize col position
    this.setX(x)
      .setY(centerY)
      .setWidth(colWidth)
      .setHeight(colHeight)
      .setColor("#333")

    // add year label
    this.text = svg.append("text")
      .text(year)
      .attr("x", this.getX())
      .attr("y", this.getY())
      .style("font-size", "50%")
      .style("stroke", "white")

// expanding when hover column only
    this.form
      .on("mouseenter",
          () => {
            if (1) {
              this.transform(expansionFactor);
            }
          }
      )
      .on("mouseout",
          () => {
            if (1) {
              this.transform(1 / expansionFactor)
            }
        }
      )

      // TODO: associate tags with panels
  }

  updatePanelsPositions(){
    this.panels.forEach(panel => {
      panel.updatePosition();
    });

  }

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

    // TODO: 'encapsulate' some in the panel class

    var panelR = r

    if(r < 1){
      panelR = 1
    }

    this.panels.forEach(panel => {
      panel.setWidth(panelWidth * panelR)
      panel.setHeight(panelHeight * panelR)
      panel.setY(this.getY() + panelHeightMargin * panelR * (panel.pos + 1) + panelHeight * (panel.pos) * panelR)
      panel.setX(this.getX() + colXMargin)
    });

    // TODO: need a better way of differntiating on and off...
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
      if (col.id != this.id) {
        col.updatePanelsPositions()
      }
      col.updateTextPosition()
    });

    }

    updateTextPosition(){
      return this.text.attr("x", this.getX())
        .attr("y", this.getY())
    }

    // add a new panel to the column
    addPanel(img){
      var panel = new Panel(this, img)
      this.panels.push(panel);
      this.panelNum ++;
      this.setHeight(this.getHeight() + panelHeight + panelHeightMargin)
    }
}

class Panel extends Rectangle{

  constructor(col, img){

    super();
    this.col = col;
    this.form = svg.append("image")
      .attr("href", img);

      //
    this.img = img

    // position of panel in col. 0 being highest
    this.pos = col.panelNum

    this.setX(col.getX() + colXMargin / 2)
      .setY(col.getY() + panelHeightMargin * (this.pos + 1) + panelHeight * (this.pos))
      .setWidth(panelWidth)
      .setHeight(panelHeight);

      // expanding panels
      this.form.on ("mouseenter", () => {
        if (1) {
          this.col.transform(expansionFactor);
          this.transform(1.3);
        }
      })
      .on("mouseleave",() => {
        if (1) {
          this.col.transform( 1 / expansionFactor)
        }
      })

      .on("click", () => {
        if (1) {
          this.enlarge()
        }
      }
    )

  }

  transform(r){

    var oldWidth = this.getWidth()
    var newWidth = this.getWidth() * r
    var oldHeight = this.getHeight()
    var newHeight = this.getHeight() * r


    this.setWidth(newWidth)
    this.setHeight(newHeight)
    this.setX(this.getX() + (oldWidth - newWidth) / 2)
    this.setY(this.getY() + (oldHeight - newHeight) / 2)
  }

  //click for fullscreen panel

  enlarge(){

    eventsEnabled = false;

    var enlargedImage = svg.append("image")
    .attr("href", this.img)
    .attr("width", this.getWidth())
    .attr("height", this.getHeight())
    .attr ("x", this.getX())
    .attr ("y", this.getY())

    var t = d3.transition()
    .duration(250)
    .ease(d3.easeLinear);

    window.setTimeout(() => {
      eventsEnabled = true;
    }, 250)

    enlargedImage.transition(t)
    .attr("width", window.innerWidth * 0.75)
    .attr("height", window.innerHeight * 0.75)
    .attr("x", (window.innerWidth * 0.25) / 2)
    .attr("y", (window.innerHeight * 0.25) / 2)

    enlargedImage.on("mouseleave", () => {
      if (eventsEnabled) {
        enlargedImage.remove()
      }
    })

    d3.select("body").on("keydown", () => {
      if (d3.event.keyCode == 27) {
        enlargedImage.remove()
        // remove event listener
        d3.select('body').on("keydown", null)
      }
    })

  }

  updatePosition(){
    this.setX(this.col.getX() + colXMargin / 2)
      .setY(this.col.getY() + panelHeightMargin * (this.pos + 1) + panelHeight * (this.pos))
  }


}

d3.dsv(",", "./MasterData.csv", function(d) {
  return {
    year: d.Year, // convert "Year" column to Date
    img: d.DocLink,
    // tag: d.Tags
  };
}).then(function(data) {

  // TODO: add shaded boxes for empty lines
  // filter out any empty images
  data = data.filter(function (e) {
    return e.img != "";
  })

// organize year and images
  var years = uniq(data.map(function (e) {
                return e.year
              }))
              .map(function (f) {
                return {year: f, images: [] }
              });

// group years and images
      years.forEach((g) => {
        data.forEach((h) => {
          if (g.year == h.year) {
            g.images.push(h.img)
          }
        });
      });

//create columns for years, panels for image
  years.forEach((e) => {
      var col = Column.addCol(e.year);
      e.images.forEach((img) => {
        col.addPanel(img);
      });
  });

});

// to return an array of unique values
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
