'use strict'

module.exports = [function () {
    return {
      sortWords : function(data,columnName,direction){

        if(direction === 'asc'){

          data.sort(function(a,b){
            if (a[columnName] > b[columnName]) {
               return 1;
             }else if (a[columnName] < b[columnName]) {
               return -1;
             }
              return 0;
          });

           }else{
             data.sort(function(a,b){
               if (a[columnName] < b[columnName]) {
                  return 1;
                }else if (a[columnName] > b[columnName]) {
                  return -1;
                }
                  return 0;
             });
           }

       return data;

    },
    sortNumbers : function(data,columnName,direction){
          var aux = {};
          if(direction === 'asc'){
            for(var i = 1 ; i  < data.length; i++){
              for(var j = 0; j < data.length - i ; j++){
                if(toNumber(data[j][columnName]) > toNumber(data[j + 1][columnName])){
                    aux = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = aux;
                }
              }
            }
          }else {
            for(var i = 1 ; i  < data.length; i++){
              for(var j = 0; j < data.length - i; j++){
                if(toNumber(data[j][columnName]) < toNumber(data[j + 1][columnName])){
                    aux = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = aux;
                }
              }
            }
          }

          return data;
      }


    }
}];

function replaceAll (string,target, replacement) {
  if(typeof(string) !== 'undefined'){
    return string.split(target).join(replacement);
  }
  return string;
};

function toNumber (string){

      return parseFloat(replaceAll(string,',',''));
  }
