'use strict'

module.exports = [ function(){

    return {
        restrict:'A',
        templateUrl: 'errorsTemplate.html',    
        scope: {
      		show: '=show',
      		message: '=message',
            level: '=level'
    	},
        link : linkFunction
    };
    function linkFunction(scope){

        scope.warn = function(){
            if(scope.level.toLowerCase() === "warn")return true;
            else return false;
        };
        scope.error = function(){
            if(scope.level.toLowerCase() === "error")return true;
            else return false;
        }
        scope.info = function(){
            if(scope.level.toLowerCase() === "info")return true;
            else return false;
        }
    	scope.closeMessage = function(){
    		scope.show = false;
    	}
    }
  }];