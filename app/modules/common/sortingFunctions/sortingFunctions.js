'use strict'

module.exports = ['sortUtils',function (sortUtils) {
    return {


    sortData : function(grid, sortColumns ){

        var data = grid.options.data;

        var columnName = typeof(sortColumns[0]) !== 'undefined' &&
                         typeof(sortColumns[0].field) != 'undefined'        ?
                         sortColumns[0].field : 'undefined' ;

        var direction = typeof(grid.options) !== 'undefined'                &&
                        typeof(grid.options.sort) !== 'undefined'           &&
                        typeof(grid.options.sort.direction) !== 'undefined' ?
                        grid.options.sort.direction : 'asc';

        var isNumberColumn = typeof(data[0]) !== 'undefined' && typeof(data[0][columnName]) !== 'undefined' ?
                            !isNaN(data[0][columnName].toNumber()) : false;

        if(columnName !== 'undefined'){
                if(!isNumberColumn){

                      data = sortUtils.sortWords(data,columnName,direction);

                  }else{

                      data = sortUtils.sortNumbers(data,columnName,direction);

                  }

                  grid.options.sort.direction = direction === 'asc' ? 'desc' : 'asc';

                }


    }


    }
}];
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};
String.prototype.toNumber = function(){
      return parseFloat(this.replaceAll(',',''));
  }
