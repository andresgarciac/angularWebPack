'use strict'

module.exports = [ function(){

    return {
        restrict:'A',
        templateUrl: 'queryMovements.html',
        link : linkFunction
    };

    function linkFunction(scope){

    	var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
        dd='0'+dd
        } 
        if(mm<10){
        mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        document.getElementById("fromDate").value = today;
        document.getElementById("toDate").value = today;

    }
  }];