'use strict'



module.exports = ['$q','$cookies','commonFunctions','sessionService','masterServices','consolidateBalancesService',
 function($q,$cookies,commonFunctions,sessionService,masterServices,consolidateBalancesService){

    return {
        restrict:'A',
        templateUrl: 'consolidatedBalances.html',
        link : linkFunction
    };

    function linkFunction(scope){

        scope.gridsObject = [];
        scope.products = [];
        scope.currencies = [];
        scope.columnsId = [];
        scope.dataGrid = [];
        scope.row = [];
        scope.productValue = '';
        scope.currencyValue = '';
        scope.loadingGrids = true;
        scope.showError = false;

                var sessionVar = sessionService.sessionVar();

                var masterServicesLoad = function(session){
                    return $q.all([
                        masterServices.productsRequest( session.data.user.properties.LANGUAGETYPE ),
                        masterServices.currenciesRequest( session.data.user.properties.LANGUAGETYPE  ),
                        consolidateBalancesService.consolidatedBalanceService("6000","1544",session.data.user.properties.LANGUAGETYPE)      
                    ])
                    .then( function(response){ 
                        scope.loadingGrids = false;
                        for (var i = 0; i < response[0].data.length; i++)scope.products.push(response[0].data[i]);
                        for (var i = 0; i < response[1].data.length; i++)scope.currencies.push(response[1].data[i].code);
                        commonFunctions.configureGrid(scope,response[2].data,30);

                    }, function(reason) {
                        failure();
                        commonFunctions.loadErrorDirective(scope,reason.data);
                    });
                };
                
                var labelsServiceFunction = function(session){
                    commonFunctions.labelsServiceFunction(scope,"6000",session.data.user.properties.LANGUAGETYPE);
                    return session;
                };

                sessionVar.then(labelsServiceFunction).then(masterServicesLoad);


           
                var failure = function(){
                    scope.loadingGrids = false;
                };

                scope.applyformat = function(gridOptions,modifiedData,totalActive,totalDebits){
                    var activeFormat = "";
                    var debitsFormat = "";
                    var foundActive = false;
                    var foundDebits = false;
                    for(var i = 0 ; i < scope[gridOptions].columnDefs.length && (!foundActive || !foundDebits); i++){
                        if(scope[gridOptions].columnDefs[i].field === "_ACTIVE"){
                            activeFormat = scope[gridOptions].columnDefs[i].uiFormat;
                            foundActive = true;
                        }
                        if(scope[gridOptions].columnDefs[i].field === "_DEBITS"){
                            debitsFormat = scope[gridOptions].columnDefs[i].uiFormat;
                            foundDebits = true;
                        }
                    }  
                    
                    var rowBalanceFooter = {};
                    if(foundActive && foundDebits)
                        rowBalanceFooter = {ACTIVE:'Total ' + commonFunctions.validateAndApplyFormat(activeFormat,totalActive),DEBITS:'Total '
                                            +commonFunctions.validateAndApplyFormat(debitsFormat,totalDebits) ,isFooter: true};
                    else if(foundActive)
                        rowBalanceFooter = {ACTIVE:'Total ' + commonFunctions.validateAndApplyFormat(activeFormat,totalActive),isFooter: true};
                    else if(foundDebits)
                        rowBalanceFooter = {DEBITS:'Total ' + commonFunctions.validateAndApplyFormat(debitsFormat,totalDebits),isFooter: true};
                    
                    if(scope[gridOptions].paginationPageSize - 1 >= modifiedData.length){
                        modifiedData.push(rowBalanceFooter);
                    }else{
                        var makeFooter = true;
                        var pagSize = 1;
                        while(makeFooter){
                            if((scope[gridOptions].paginationPageSize) * pagSize <= modifiedData.length){
                                modifiedData.splice((scope[gridOptions].paginationPageSize * pagSize) - 1 , 0, rowBalanceFooter);
                                pagSize++;
                            }else{
                                modifiedData.push(rowBalanceFooter);
                                makeFooter = false;
                            }
                        }
                    }
                    return modifiedData;
                }

                var filterGrid = function (values) {
                    var modifiedData = [];
                    var totalActive = 0.0;
                    var totalDebits = 0.0;
                for (var j = 0; j < scope.gridsObject.length; j++) {
                    
                    for (var i = 0; i < scope[scope.gridsObject[j].grid].originalData.length; i++) {
                        var insertData = true;
                        for(var k = 0 ; k < values.length && insertData; k++)
                                insertData = insertData && (scope[scope.gridsObject[j].grid].originalData[i][values[k][0]] === scope[values[k][1]]);
                             
                        if(insertData){
                            modifiedData.push(scope[scope.gridsObject[j].grid].originalData[i]);
                            if(typeof scope[scope.gridsObject[j].grid].originalData[i]._ACTIVE != 'undefined')
                                totalActive = totalActive + Number(scope[scope.gridsObject[j].grid].originalData[i]._ACTIVE);
                            if(typeof scope[scope.gridsObject[j].grid].originalData[i]._DEBITS != 'undefined')
                                totalDebits = totalDebits + Number(scope[scope.gridsObject[j].grid].originalData[i]._DEBITS);
                        }
                    }
                    if(scope.currencyValue === null)
                        scope[scope.gridsObject[j].grid].data = modifiedData;
                    else
                        scope[scope.gridsObject[j].grid].data = scope.applyformat(scope.gridsObject[j].grid,modifiedData,totalActive,totalDebits);
                };
                };
                scope.updateTable = function() {

                    if(scope.productValue==="") scope.productValue = null;
                    if(scope.currencyValue==="") scope.currencyValue = null;
                    
                    if(scope.productValue != null && scope.currencyValue != null)
                        filterGrid([['ACCOUNT_TYPE','productValue'],['CURRENCY','currencyValue']]);
                    else if(scope.productValue != null) 
                        filterGrid([['ACCOUNT_TYPE','productValue']]);                       
                    else if(scope.currencyValue != null) 
                        filterGrid([['CURRENCY','currencyValue']]); 
                    else 
                        commonFunctions.keepOriginalData(scope);
                };
                scope.enableFiltering = function(grid,gridApi){
                    scope[grid].enableFiltering = !scope[grid].enableFiltering;
                    scope[gridApi].core.notifyDataChange( "all" );
                };

                scope.goToProductBalances = function(row){
                    $cookies.accountType = btoa(row.entity.ACCOUNT_TYPE);
                    $cookies.currency = btoa(row.entity.CURRENCY);
                    redirectToViewGet('/app/newProductCategory');
                }
                scope.isUndefined = function(value){
                    return typeof value === 'undefined';
                }
                scope.getScopeAttribute = function(key){
                    return(scope[key]);
                }
    }

}];