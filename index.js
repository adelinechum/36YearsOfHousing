var svg = d3.select("body").append("svg")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)

/*
* Global Size Variables
*/

// columns
var colWidth = 30;
var colHeight = 0;
var colXMargin = 1;
var expansionFactor = 2.5;
var backgroundGrey = "#333"

// panels
var panelPerCol = 13 //number of panels we want per column and sets startight height of viz
var panelHeightMargin = 5;
var panelHeight = 35;
var panelWidth = colWidth - colXMargin;

// window //location of grid matrix
var centerX = window.innerWidth / 2;
// var centerY = window.innerHeight / 2 - (panelPerCol * (panelHeightMargin + panelHeight)); // to use for later when entire visualization is more reactive
var centerY = window.innerHeight * 0.12
var eventsEnabled = true

// legends
var legendX = window.innerWidth * 0.1
var legendY = window.innerHeight * 0.80
var legendMargin = 25
var subcateogryMargin = 25
var categoryXMargin = 25;

// header
var headerX = window.innerWidth * 0.1
var headerY = window.innerHeight * 0.10

var header = createHeader()


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

class Column extends Rectangle{

  // collection of all column
  static all = [];

  // add a new column:
  // 1. move center to left
  // 2. update position of all columns
  static addCol(year, tags){
    if (Column.all.length) {
      Column.all.forEach(col => {
        // here shift all columns over to left to keep centered
        col.setX(col.getX() - (colWidth + colXMargin) / 2);
        col.updateTextPosition()
        col.updatePanelsPositions();
      });
    }

    var res = new Column(centerX + (colWidth + colXMargin) * Column.all.length / 2, year, tags);
    Column.all.push(res);
    return res;
  }

  static greyAll(){
    Column.all.forEach(col => {
      col.setColor(backgroundGrey)
    });

  }

  constructor(x, year, tags){
    super()

    this.form = svg.append("rect")

    this.panelNum = 0;

    this.tags = tags.split(",").map( str => {
        return str.trim();
      });

    this.panels = [];

    // initialize col position
    this.setX(x)
      .setY(centerY)
      .setWidth(colWidth)
      .setHeight(colHeight)
      .setColor(backgroundGrey)

    // add year label
    this.text = svg.append("text")
      .text(year)
      .attr("x", this.getX())
      .attr("y", this.getY())
      .style("font-size", "50%")
      .style("fill", "white")

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

  }
legend
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
    Column.all.forEach(col => {
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
      this.setHeight(this.getHeight() + panelHeight + panelHeightMargin + 1)
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

// esc key to remove
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
    tag: d.Tags
  };
}).then(function(data) {

  // TODO: add shaded boxes for empty lines
  // filter out any empty images
  data = data.filter(function (e) {
    return e.img != "";
  })

// organize year and images
  var groupedData = uniq(data.map(function (e) {
                return e.year
              }))
              .map(function (f) {
                return {year: f, images: [], tags: null}
              })

  console.log(groupedData);


// group years and images
      groupedData.forEach((g) => {
        data.forEach((h) => {
          if (g.year == h.year) {
            g.images.push(h.img)
            g.tags = h.tag
          }
        });
      });

//create columns for years, panels for image
  groupedData.forEach((e) => {
      var col = Column.addCol(e.year, e.tags);
      e.images.forEach((img) => {
        col.addPanel(img);
      });
  });

  createLegend()

});

function createHeader(){
  var header = svg.append("text")

  header.attr("x", headerX)
    .attr("y", headerY)
    .style("font-size", "30")
    .style("fill", "white")
  return header
}

function clearHeaderText() {
  header.text('')
}

function setHeaderText(text){
  header.text('STUDIO BRIEFS THAT INCLUDE OR EMPHASIZE: ' + text)
}

class CategoryAbstract{

   constructor(name){
     this.name = name
     this.text = svg.append("text")
      .text(name)
      .style("fill", "white")
      // .on('click', () => {
      //   Category.highlight(name)
      //   this.setColor(Category.colorScale(name))
      // })
   }

   setFontSize(fontSize){
     this.text.style("font-size", fontSize)
     return this
   }

   setX(x){
     this.text.attr("x", x)
     return this
   }

   setY(y){
     this.text.attr("y", y)
     return this
   }

   setColor(color){
     this.text.style("fill", color)
     return this
   }

   getLength(){
     return +this.text.node().getBBox().width
   }

   getX(){
     return +this.text.attr("x")
   }

}

class Category extends CategoryAbstract {

  static count = 0

  static all = []

  static greyAll(){
    Category.all.forEach(cat => {
      cat.setColor("white")
      cat.subCategories.forEach(subCat => {
        subCat.setColor("white")
      });

    });

  }


  static createCategories(categories){
    var xStart = legendX
    categories.forEach(cat => {
      var category = new Category(cat, xStart)
      Category.all.push(category)
      xStart = category.getStartX()
    });
  }

  constructor(cat, xStart) {
    super(cat.name)
    this.subCategories = cat.subCategories
    this.count = Category.count
    this.setFontSize("14px")
      .setX(xStart)
      .setY(legendY)

    Category.count ++;

    // console.log(this.text.node().getBBox().width);

    this.maxWidth = this.getLength()

    this.subCategories.forEach((name, i) => {
      this.subCategories[i] = new Subcategory(name, this, i)
    });

// grey out existing colored text and color new
    this.text.on('click', () => {
      Category.greyAll()
      Column.greyAll()
      setHeaderText(this.name)
      this.setColor(Category.colorScale(this.name))
      this.subCategories.forEach(subCat => {
        subCat.setColor(Category.colorScale(subCat.name))
        Category.highlight(subCat.name)
      });

    })

  }

// gets max length of all category and subcategory text.
// useful for setting Categories close to each OTHER
// on x-axis

  getMaxLength(){
    var maxLength = this.getLength()
    this.subCategories.forEach(subCat => {
      if (maxLength < subCat.getLength()) {
        maxLength = subCat.getLength()
      }
    });
    return maxLength
  }

  getStartX(){
    return this.getMaxLength() + this.getX() + categoryXMargin
  }

// set categories and colors for tags here
  static categoryTags = ['TERMS OF SCALE','LOW RISE HIGH DENSITY','MID DENSITY','HIGH DENSITY',
  'SITE', 'SHARED SITE','DIFFERENT SITES',
  'UNIQUE STUDIOS', 'OLYMPICS BID','STUDENT HOUSING', 'COLUMBIA PROJECT HOUSING',
  'TAKE ON "HOUSING PROBLEM"', 'GRAPPLING WITH GENERIC','PROPOSING NEW MODES',
  'PEDAGOGY', 'TYPOLOGY','PRECEDENT STUDY', 'SITE ANALYSIS',
  'BRIEF LENGTH', 'SHORT','MEDIUM', 'LONG',
  'OTHER', 'FINANCE/POLICY','NEIGHBORHOOD','GOV. AGENCY PARTNERSHIP', 'MIXED-USE']

  static categoryColors = ["#C94D00", "#E6730D", "#FF9326", "#FFAF5D",
  "#94C71E",  "#B1E642", "#DCFF7F",
  "#E0CE00", "#FFF500", "#FFFF70", "#FFFEC8",
  "#8B11CC", "#C76BFF", "#D9B1FF",
  "#3DB88D", "#21D68C", "#7CFFAF", "#B9FFCD",
  "#9E2800", "#CC2E00", "#FF794E", "#FFAB87",
  "#073682", "#0756A6", "#2C8FE6", "#71B0EB", "#B2D7FF"]

  static colorScale = d3.scaleOrdinal()
    .domain(Category.categoryTags)
    .range(Category.categoryColors)

  static highlight(tag){
    Column.all.forEach(col => {
      if (col.tags.includes(tag)) {
        col.setColor(Category.colorScale(tag))
      }
    });

  }

}

class Subcategory extends CategoryAbstract{
  constructor(name, cat, i) {
    super(name)
    this.cat = cat

    this.setFontSize("10px")
        .setX(this.cat.getX())
        .setY(legendY + subcateogryMargin * (i + 1))

  this.text.on('click', () => {
    Category.greyAll()
    Column.greyAll()

    setHeaderText(this.name)
    cat.setColor(Category.colorScale(cat.name))
    this.setColor(Category.colorScale(this.name))
    Category.highlight(this.name)
    });
  }
}

//list of categories and subs
function createLegend() {
  var categories = [{name: 'TERMS OF SCALE', subCategories: ['LOW RISE HIGH DENSITY',
  'MID DENSITY', 'HIGH DENSITY']},

  {name: 'SITE', subCategories: ['SHARED SITE',
  'DIFFERENT SITES']},

  {name: 'UNIQUE STUDIOS', subCategories: ['OLYMPICS BID',
  'STUDENT HOUSING', 'COLUMBIA PROJECT HOUSING']},

  {name: 'TAKE ON "HOUSING PROBLEM"', subCategories: ['GRAPPLING WITH GENERIC',
  'PROPOSING NEW MODES']},

  {name: 'PEDAGOGY', subCategories: ['TYPOLOGY',
  'PRECEDENT STUDY', 'SITE ANALYSIS']},

  {name: 'BRIEF LENGTH', subCategories: ['SHORT',
  'MEDIUM', 'LONG']},

  {name: 'OTHER', subCategories: ['FINANCE/POLICY',
  'NEIGHBORHOOD', 'GOV. AGENCY PARTNERSHIP', 'MIXED-USE']}
  ]

  Category.createCategories(categories)
}

// to return an array of unique values
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
