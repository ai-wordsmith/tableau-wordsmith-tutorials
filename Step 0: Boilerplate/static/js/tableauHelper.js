// default options for Tableau's getData framework
const defaultOptions = {
    maxRows: 0,
    ignoreAliases: false,
    ignoreSelection: false,
    includeAllColumns: true
  }
  
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  //
  // Generally useful as certain Tableau event listeners tend to fire > 1 time
  // which can cause problems with UI elements or just overload the server
  debounce = function(func, wait, immediate) {
      var timeout;
      return function() {
          var context = this, args = arguments;
          var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
      };
  };
  
  // viz/workbook wrapper
  function TableauHelper(viz) {
    let _this = this;
    this.viz = viz;
    this.sheets = [];
    // get all worksheets
    viz.getWorkbook().getActiveSheet().getWorksheets().forEach((sheet) => {
      _this.sheets.push(new Sheet(sheet));
    });
  }
  
  // get a single worksheet by name
  TableauHelper.prototype.getSheet = function(sheetName) {
    let sheetMatch = this.sheets.filter((sheet) => {return sheet.name === sheetName;})
    return sheetMatch.length === 1 ? sheetMatch[0] : null;
  }
  
  // get all parameters on the workbook object
  TableauHelper.prototype.getParams = function() {
    return new Promise((resolve, reject) => {
      try {
        let paramArray = [];
        this.viz.getWorkbook().getParametersAsync().then((params) => {
          params.forEach( (param) => {
            paramArray.push(new Param(param));
          });
          resolve(paramArray);
        });
      } catch(err) {
        reject(err);
      }
    });
  }
  
  // param object wrapper
  // this may break on certain param types, hasn't been broadly tested
  function Param(paramObj) {
    this.paramObj = paramObj;
    let props = paramObj._impl;
    this.dataType = props.$dataType;
    this.name = props.$name;
    this.value = props.$currentValue.value;
    this.formattedValue = props.$currentValue.formattedValue;
  }
  
  // worksheet object wrapper
  function Sheet(sheetObj) {
    this.sheetObj = sheetObj;
    let props = sheetObj._impl;
    this.name = props.$name;
    this.type = props.$type;
  }
  
  // get marks
  Sheet.prototype.getMarks = function() {
    return new Promise((resolve, reject) => {
      try {
        this.sheetObj.getSelectedMarksAsync().then( (marks) => {
          resolve(marks.map((mark) => {return mark.getPairs();}));
        })
      } catch(err) {
        reject(err);
      }
    })
  }
  
  // set mark
  Sheet.prototype.setMarks = function(fieldMap, updateType) {
    return new Promise((resolve, reject) => {
      try {
        this.sheetObj.selectMarksAsync(fieldMap, updateType).then( () => {
          resolve();
        })
      } catch(err) {
        reject(err);
      }
    });
  }
  
  Sheet.prototype.clearMarks = function() {
    return new Promise((resolve, reject) => {
      try {
        this.sheetObj.clearSelectedMarksAsync().then( () => {
          resolve();
        })
      } catch(err) {
        reject(err);
      }
    })
  }
  
  // pseudo-private method to change the data formatting returned by Tableau
  Sheet.prototype._fixData = function(dataObj, useFormattedValue) {
    let cols = dataObj.getColumns().map((col) => {return new Column(col)});
    let data = [];
    dataObj.getData().forEach((row) => {
      let rowTransformed = [];
      for (i = 0; i < row.length; i++) {
        if (useFormattedValue.indexOf(cols[i].name) == -1) {
          rowTransformed.push(row[i].value);
        } else {
          rowTransformed.push(row[i].formattedValue);
        }
      }
      data.push(rowTransformed);
    });
    return {
      columns: cols,
      data: data
    }
  }
  
  // get an array of filter objects from the worksheet
  Sheet.prototype.getFilters = function() {
    return new Promise( (resolve, reject) => {
      try {
        this.sheetObj.getFiltersAsync().then((filters) => {
          resolve(filters);
        });
      } catch(err) {
        reject(err);
      }
    });
  }
  
  // get and reformat summary data
  Sheet.prototype.getSummaryData = function(options, useFormattedValue) {
    return new Promise( (resolve, reject) => {
      try {
        this.sheetObj.getSummaryDataAsync(options).then((data) => {
          resolve(this._fixData(data, useFormattedValue));
        });
      } catch(err) {
        reject(err);
      }
    });
  }
  
  // get and reformat full data
  Sheet.prototype.getFullData = function(options, useFormattedValue) {
    return new Promise( (resolve, reject) => {
      try {
        this.sheetObj.getUnderlyingDataAsync(options).then((data) => {
          resolve(this._fixData(data, useFormattedValue));
        })
      } catch(err) {
        reject(err);
      }
    });
  }
  
  // column object wrapper
  function Column(columnObj) {
    this.name = columnObj.getFieldName();
    this.dataType = columnObj.getDataType();
    this.index = columnObj.getIndex();
    this.isReferenced = columnObj.getIsReferenced();
  }