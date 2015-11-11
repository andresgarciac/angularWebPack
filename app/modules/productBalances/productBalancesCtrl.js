'use strict'



module.exports = ['$q','$cookies','$window','commonFunctions','sessionService','masterServices','productCategoryService','productDetailService',
function($q,$cookies,$window,commonFunctions,sessionService,masterServices,productCategoryService,productDetailService){

    return {
        restrict:'A',
        templateUrl: 'productBalances.html',
        link : linkFunction
    };

    function linkFunction(scope){

        scope.gridsObject = [];
        scope.currencyValue = null;
        scope.products = [];
        scope.currencies = [];
        scope.countries = [];
        scope.banks = [];
        scope.showProductDetail = false;
        scope.productDetailList = [];
        scope.heigth = {};

        scope.showError = false;
        scope.loadingGrids = true;

        var sessionVar = sessionService.sessionVar();

        var masterServicesLoad = function(session){
            scope.languageCode = session.data.user.properties.LANGUAGETYPE;
            return $q.all([
                masterServices.productsRequest( scope.languageCode ),
                masterServices.currenciesRequest( scope.languageCode ),
                masterServices.countriesRequest( scope.languageCode ),
                masterServices.banksRequest( scope.languageCode ),
                productCategoryService.productCategoryService("6000","1544",scope.languageCode)
            ])
            .then( function(response){
                scope.loadingGrids = false;
                for (var i = 0; i < response[0].data.length; i++)scope.products.push(response[0].data[i]);
                for (var i = 0; i < response[1].data.length; i++)scope.currencies.push(response[1].data[i].code);
                for (var i = 0; i < response[2].data.length; i++)scope.countries.push(response[2].data[i]);
                for (var i = 0; i < response[3].data.length; i++)scope.banks.push(response[3].data[i]);
                for (var i = 0; i < response[4].data.length; i++)commonFunctions.configureGrid(scope,response[4].data[i],45);
                for(var i = 0; i < scope.products.length; i++){
                  if(scope[scope.products[i].code] !== undefined){
                    if(scope[scope.products[i].code].paginationPageSize > scope[scope.products[i].code].data.length){
                        scope.heigth[scope.products[i].code] = scope[scope.products[i].code] !== undefined ?   scope[scope.products[i].code].data.length * 45 : 0;
                    }else {
                      scope.heigth[scope.products[i].code] = scope[scope.products[i].code] !== undefined ?   scope[scope.products[i].code].paginationPageSize * 45 : 0;
                    }
                  }


                }

                if (typeof $cookies.accountType != 'undefined' && typeof $cookies.currency != 'undefined'){
                    scope.productValue = atob($cookies.accountType);
                    scope.productTypeFilter();
                    delete $cookies.accountType;

                    scope.currencyValue = atob($cookies.currency);
                    scope.updateTables();
                    delete $cookies.currency;
                }
            }, function(reason) {
                scope.loadingGrids = false;
                commonFunctions.loadErrorDirective(scope,reason.data);
            });
        };

        var labelsServiceFunction = function(session){
            commonFunctions.labelsServiceFunction(scope,"6000",session.data.user.properties.LANGUAGETYPE);
            return session;
        };

        sessionVar.then(labelsServiceFunction).then(masterServicesLoad);

        scope.isUndefined = function(value){
            return typeof value === 'undefined';
        }
        scope.applyformat = function(gridOptions,modifiedData,totalBalance,availableBalance){
            var totalBalanceFormat = "";
            var availableBalanceFormat = "";
            var foundTotalBlanace = false;
            var foundAvailableBalance = false;
            for(var i = 0 ; i < scope[gridOptions].columnDefs.length && (!foundTotalBlanace || !foundAvailableBalance); i++){
                if(scope[gridOptions].columnDefs[i].field === "_TOTAL_BALANCE"){
                    totalBalanceFormat = scope[gridOptions].columnDefs[i].uiFormat;
                    foundTotalBlanace = true;
                }
                if(scope[gridOptions].columnDefs[i].field === "_AVAILABLE_BALANCE"){
                    availableBalanceFormat = scope[gridOptions].columnDefs[i].uiFormat;
                    foundAvailableBalance = true;
                }
            }

            var rowBalanceFooter = {};
            if(foundTotalBlanace && foundAvailableBalance)
                rowBalanceFooter = {TOTAL_BALANCE:'Total ' + commonFunctions.validateAndApplyFormat(totalBalanceFormat,totalBalance),AVAILABLE_BALANCE:'Total '
                    +commonFunctions.validateAndApplyFormat(availableBalanceFormat,availableBalance) ,isFooter: true};
            else if(foundTotalBlanace)
                rowBalanceFooter = {TOTAL_BALANCE:'Total ' + commonFunctions.validateAndApplyFormat(totalBalanceFormat,totalBalance),isFooter: true};
            else if(foundAvailableBalance)
                rowBalanceFooter = {AVAILABLE_BALANCE:'Total ' + commonFunctions.validateAndApplyFormat(availableBalanceFormat,availableBalance),isFooter: true};

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

        var filterOneGrid = function (values,gridOptions) {
            var modifiedData = [];
            var totalBalance = 0.0;
            var availableBalance = 0.0;
            for (var i = 0; i < scope[gridOptions].originalData.length; i++) {
                var insertData = true;
                for(var j = 0 ; j < values.length && insertData; j++)
                    insertData = insertData && (scope[gridOptions].originalData[i][values[j][0]] === scope[values[j][1]]);

                if(insertData){
                    modifiedData.push(scope[gridOptions].originalData[i]);
                    if(typeof scope[gridOptions].originalData[i]._TOTAL_BALANCE != 'undefined')
                        totalBalance = totalBalance + Number(scope[gridOptions].originalData[i]._TOTAL_BALANCE);
                    if(typeof scope[gridOptions].originalData[i]._AVAILABLE_BALANCE != 'undefined')
                        availableBalance = availableBalance + Number(scope[gridOptions].originalData[i]._AVAILABLE_BALANCE);
                }
            }
            if(scope.currencyValue === null)
                scope[gridOptions].data = modifiedData;
            else
            scope[gridOptions].data = scope.applyformat(gridOptions,modifiedData,totalBalance,availableBalance);
        }

        var filterGrids = function (values) {
            for (var i = 0; i < scope.gridsObject.length; i++) {
                if(scope[scope.gridsObject[i].grid].availableGrid)
                    filterOneGrid(values,scope.gridsObject[i].grid);
            };
        };

        scope.updateTables = function() {
            if(scope.currencyValue != null && scope.countryValue != null && scope.bankValue != null)
                filterGrids([['CURRENCY','currencyValue'],['ID_COUNTRY','countryValue'],['BANK_CODE','bankValue']]);
            else if(scope.countryValue != null && scope.bankValue != null)
                filterGrids([['ID_COUNTRY','countryValue'],['BANK_CODE','bankValue']]);
            else if(scope.currencyValue != null && scope.bankValue != null)
                filterGrids([['CURRENCY','currencyValue'],['BANK_CODE','bankValue']]);
            else if(scope.currencyValue != null && scope.countryValue != null)
                filterGrids([['CURRENCY','currencyValue'],['ID_COUNTRY','countryValue']]);
            else if(scope.currencyValue != null)
                filterGrids([['CURRENCY','currencyValue']]);
            else if(scope.countryValue != null)
                filterGrids([['ID_COUNTRY','countryValue']]);
            else if(scope.bankValue != null)
                filterGrids([['BANK_CODE','bankValue']]);
            else commonFunctions.keepOriginalData(scope);
        };

        scope.productTypeFilter = function() {
            var abort = false;
            if(scope.productValue == null || scope.productValue === ''){
                for (var i = 0; i < scope.gridsObject.length; i++) {
                    scope[scope.gridsObject[i].grid].showGrid = true;
                };
                abort = true;
            }
            for (var i = 0; i < scope.gridsObject.length && !abort; i++) {
                if(scope.productValue === scope.gridsObject[i].grid) scope[scope.gridsObject[i].grid].showGrid = true;
                else scope[scope.gridsObject[i].grid].showGrid = false;
            };
        }

        scope.enableFiltering = function(grid,gridApi){
            scope[grid].enableFiltering = !scope[grid].enableFiltering;
            scope[gridApi].core.notifyDataChange( "all" );
        };

        scope.showModal = function(grid){
            scope[grid].displayModal = !scope[grid].displayModal;
        }

        scope.setColumns = function(grid,gridApi,col,displayGrid){
            scope[grid].displayGrid = false;
            for (var i = 0; i < scope[grid].columnDefs.length; i++) {
                if(scope[grid].columnDefs[i] === col)
                    scope[grid].columnDefs[i].visible = !scope[grid].columnDefs[i].visible;
                scope[grid].displayGrid = scope[grid].displayGrid || scope[grid].columnDefs[i].visible;
            }
            scope[gridApi].core.notifyDataChange( "all" );
        }

        scope.hideAllColumns = function(grid,gridApi,displayGrid){
            for (var i = 0; i < scope[grid].columnDefs.length; i++) {
                scope[grid].columnDefs[i].visible = false;
            }
            scope[grid].displayGrid = false;
            scope[gridApi].core.notifyDataChange( "all" );
        }
        scope.showAllColumns = function(grid,gridApi,displayGrid){
            for (var i = 0; i < scope[grid].columnDefs.length; i++) {
                if(scope[grid].columnDefs[i].field != 'ID_COUNTRY' && scope[grid].columnDefs[i].field != 'ID'
                    && scope[grid].columnDefs[i].field != '_AVAILABLE_BALANCE' && scope[grid].columnDefs[i].field != '_TOTAL_BALANCE')
                        scope[grid].columnDefs[i].visible = true;
            }
            scope[grid].displayGrid = true;
            scope[gridApi].core.notifyDataChange( "all" );
        }
        scope.showProductDetailModal = function(){
            scope.showProductDetail = !scope.showProductDetail;
        }

        var makeProductDatailSection = function(data){
            scope.productDetail.map[data.grid].desc = data.desc;
            for (var i = 0; i < data.columns.length; i++) {
                if(data.columns[i].visible) scope.productDetail.map[data.grid].list.push(data.columns[i].displayName + ': ' + data.data[0][data.columns[i].field]);
            };
        }
        scope.goToProductDetail = function(row,grid){
            scope.loadingProductDetail = true;

            scope.productDetail = {};
            scope.productDetail.header = scope[grid].desc;
            scope.productDetail.map = {};

            var productDetailVar = productDetailService.productDetailService(row.entity.ID,"6000",scope.languageCode);
            productDetailVar.then(function(response) {
                scope.loadingProductDetail = false;
                for(var j = 0; j < response.data.length; j++){
                    scope.productDetail.map[response.data[j].grid] = {};
                    scope.productDetail.map[response.data[j].grid].list = [];
                    makeProductDatailSection(response.data[j]);
                }
                scope.showProductDetailModal();
            }, function(reason) {
                scope.loadingProductDetail = false;
                commonFunctions.loadErrorDirective(scope,reason.data);
            });
        }
        scope.getScopeAttribute = function(key){
            return(scope[key]);
        }
        scope.goToMovements = function(productType,row){
            $cookies.productType = btoa(productType);
            $cookies.balanceId = btoa(row.entity.ID);
            redirectToViewGet('/app/movementsPattern');
        }

        scope.generatePDF = function(){
            printDiv('productDetailInfo');
        };
    }

}];
