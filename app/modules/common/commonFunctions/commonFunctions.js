'use strict'

module.exports = ['sortingFunctions','uiGridConstants','$cookies','labelsService',function (sortingFunctions,uiGridConstants,$cookies,labelsService) {
    return {
        configureGrid: function (scope,data,rowHeight) {
        	   	var gridApi = data.grid +'gridApi';

                scope.gridsObject.push({
                    grid : data.grid,
                    gridApi : gridApi
                });
                scope[data.grid] = {
                    gridApi: gridApi,
                    onRegisterApi: function(gridApiP){
                        scope[this.gridApi] = gridApiP;
                    }
                };
                scope[data.grid].onRegisterApi = function( gridApiP ) {
                  scope[this.gridApi] = gridApiP;
                  scope[this.gridApi].core.on.sortChanged( scope, sortingFunctions.sortData );
                  sortingFunctions.sortData(scope[this.gridApi].grid, [scope[this.gridApi].grid.options.columnDefs[1] ] );
                };
                scope[data.grid].useExternalSorting = true;
                scope[data.grid].displayGrid = true;
                scope[data.grid].rowHeight = rowHeight;
                scope[data.grid].enablePaginationControls = false;
                scope[data.grid].paginationPageSize = data.pag;
                scope[data.grid].enableFiltering = false;
                scope[data.grid].enableHorizontalScrollbar = 0;
                scope[data.grid].enableVerticalScrollbar = 0;
                scope[data.grid].displayModal = false;
                scope[data.grid].desc = data.desc;
                scope[data.grid].columnDefs = data.columns;
                scope[data.grid].data = data.data;
                scope[data.grid].originalData = data.data;
                if(scope[data.grid].data.length > scope[data.grid].paginationPageSize )
                    scope[data.grid].gridStyle = ((scope[data.grid].paginationPageSize * scope[data.grid].rowHeight) + 70);
                else
                    scope[data.grid].gridStyle = ((scope[data.grid].data.length * scope[data.grid].rowHeight) + 70);
                scope[data.grid].showGrid = true;
                scope[data.grid].availableGrid = true;
                scope[data.grid].sort= { direction: uiGridConstants.ASC, priority: 0 };
        },
        validateAndApplyFormat : function(format,balance){
            if(format != null || format != "") {
                var arrayOfSeparators = format.split("&");
                balance = balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&'+arrayOfSeparators[0])
                balance = balance.substr(0, balance.lastIndexOf('.')) + arrayOfSeparators[1] + balance.substr(balance.lastIndexOf('.') + 1);
                if (arrayOfSeparators.length == 3) balance = arrayOfSeparators[2] + balance;
            }
            return balance;
        },
        keepOriginalData : function (scope) {
            for (var i = 0; i < scope.gridsObject.length; i++) {
               	scope[scope.gridsObject[i].grid].data = scope[scope.gridsObject[i].grid].originalData;
            }
        },
        loadErrorDirective : function(scope,data){
            scope.errorMessage = data.message;
            scope.showError = true;
            scope.levelMessage = data.level;
        },
        labelsServiceFunction : function(scope,bank,regionCode){
            if(typeof $cookies.labelsMap != 'undefined' )
                scope.labelsMap = JSON.parse($cookies.labelsMap);
            else labelsService.labelsService(bank,regionCode).then(function(response){
                scope.labelsMap = response.data;
                $cookies.labelsMap = JSON.stringify(response.data);
            });
        }
    }
}];
