'use strict'



module.exports = ['$q','$cookies','$window','commonFunctions','sessionService','masterServices','movementsService',
function($q,$cookies,$window,commonFunctions,sessionService,masterServices,movementsService){

    return {
        restrict:'A',
        templateUrl: 'movements.html',
        link : linkFunction
    };

    function linkFunction(scope){

      scope.requiredFields = [];

      scope.showErrorProductValue = false;
      scope.showErrorProductNumber = false;

        scope.gridsObject = [];
        scope.products = [];

        scope.loadingGrid = false;
        scope.movementsModal = false;
        scope.modal = false;
        scope.showDownloadButton = false;
        scope.showError = false;

        scope.heigth = 0;

        var sessionVar = sessionService.sessionVar();

        var masterServicesLoad = function(session){
            scope.languageCode = session.data.user.properties.LANGUAGETYPE;
            return masterServices.productsRequest( scope.languageCode )
            .then( function(response){
                for (var i = 0; i < response.data.length; i++)scope.products.push(response.data[i]);
            });
        };
        var ownAccountService = function(){
            return movementsService.ownAccountsService( "6000", scope.languageCode )
            .then( function(response){
                scope.ownAccountsList = response.data;

                if (typeof $cookies.productType != 'undefined' && typeof $cookies.balanceId != 'undefined'){
                    scope.productValue = atob($cookies.productType);
                    delete $cookies.productType;
                    scope.updateOwnAccountList();
                    scope.productNumber = Number(atob($cookies.balanceId));
                    delete $cookies.balanceId;
                    scope.searchMovements();
                }
            });
        };
        var labelsServiceFunction = function(session){
            commonFunctions.labelsServiceFunction(scope,"6000",session.data.user.properties.LANGUAGETYPE);
            return session;
        };
        sessionVar.then(labelsServiceFunction).then(masterServicesLoad).then(ownAccountService);

        scope.refreshGrid = function(grid){
            var container = document.getElementById(grid);

            if(null != container){
                var content = container.innerHTML;
                container.innerHTML= content;
            }
        }

        scope.cleanGrid = function(){
          for(var i = 0 ; i < scope.gridsObject.length ; i++) {
              scope.refreshGrid(scope.gridsObject[i].grid);
              scope[scope.gridsObject[i].grid] = {};
          }
          scope.gridsObject = [];

          scope.refreshGrid('movementsGrid');
        }

        scope.validateRequiredFields = function(){
          var valid = true;
          scope.requiredFields = [];
          scope.requiredFields.push(scope.productValue);
          scope.requiredFields.push(scope.productNumber);
          scope.showErrorProductValue = false;
          scope.showErrorProductNumber = false;

          angular.forEach(scope.requiredFields,function(value){

            if(value === null || !angular.isDefined(value) || value === ''){
              scope.showErrorProductValue = true;
              scope.showErrorProductNumber = true;
             scope.cleanGrid();
              valid = false;
            }

          });

          return valid;

        }

        scope.searchMovements = function(){
            scope.showDownloadButton = false;
            scope.loadingGrid = true;
            scope.availableMovementsGrid = false;
            scope.showMovementsGrid = false;

            if(!scope.validateRequiredFields()){
              scope.loadingGrid = false;
              return;
            }

            for(var i = 0 ; i < scope.gridsObject.length ; i++) {
                scope.refreshGrid(scope.gridsObject[i].grid);
                scope[scope.gridsObject[i].grid] = {};
            }
            scope.gridsObject = [];

            scope.refreshGrid('movementsGrid');

            var movementsServiceVar = movementsService.movementsService(scope.productNumber,$('#fromDate').val(),
                $('#toDate').val(),"6000",scope.languageCode);

            movementsServiceVar.then(function(response) {
                    scope.showError = false;
                    scope.showDownloadButton = true;
                    scope.loadingGrid = false;
                    if(typeof(response) !== 'undefined' && typeof(response.data.grids) !== 'undefined' && typeof(response.data.grids.length) !== 'undefined'){
                      for (var i = 0; i < response.data.grids.length ; i++) {
                          commonFunctions.configureGrid(scope,response.data.grids[i],30);
                          console.log('response',response);
                          scope.heigth = response.data.grids[i].pag * 30 ;
                      };
                    }
                },
                function(reason) {
                    scope.loadingGrid = false;
                    commonFunctions.loadErrorDirective(scope,reason.data);
            });
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
                        scope[grid].columnDefs[i].visible = true;
                }
                scope[grid].displayGrid = true;
                scope[gridApi].core.notifyDataChange( "all" );
            }

            scope.updateOwnAccountList = function() {
                scope.ownAccountsListModified = [];
                for (var i = 0; i < scope.ownAccountsList.length; i++) {
                    if(scope.ownAccountsList[i].type === scope.productValue) {
                        var stringOfData = "";
                        for (var j = 0; j < scope.ownAccountsList[i].ownAccountDataList.length; j++) {
                                if(j < scope.ownAccountsList[i].ownAccountDataList.length - 1 && scope.ownAccountsList[i].ownAccountDataList[j].visible)
                                    stringOfData = stringOfData + scope.ownAccountsList[i].ownAccountDataList[j].data + " - ";
                                else if(scope.ownAccountsList[i].ownAccountDataList[j].visible)
                                    stringOfData = stringOfData + scope.ownAccountsList[i].ownAccountDataList[j].data;
                        }
                        scope.ownAccountsListModified.push({data:stringOfData, id:scope.ownAccountsList[i].id});
                    }
                };
            }

            scope.showMovementAndNoteModal = function(){
                scope.modal = !scope.modal;
            }

            var makeMovementAndNoteDetailSection = function(data){
                scope.movementAndNoteDetail.map[data.grid].desc = data.desc;
                for (var i = 0; i < data.columns.length; i++) {
                   if(data.columns[i].visible) scope.movementAndNoteDetail.map[data.grid].list.push(data.columns[i].displayName + ': ' + data.data[0][data.columns[i].field]);
                };
            }
            scope.goToMovementDetail = function(row){

                scope.movementAndNoteDetail = {};
                scope.movementAndNoteDetail.header = row.entity.$PANEL_DETAIL_MOVEMENTS.name;
                scope.movementAndNoteDetail.map = {};

                for (var i = 0; i < row.entity.$PANEL_DETAIL_MOVEMENTS.grids.length; i++) {
                    scope.movementAndNoteDetail.map[row.entity.$PANEL_DETAIL_MOVEMENTS.grids[i].grid] = {};
                    scope.movementAndNoteDetail.map[row.entity.$PANEL_DETAIL_MOVEMENTS.grids[i].grid].list = [];
                    makeMovementAndNoteDetailSection(row.entity.$PANEL_DETAIL_MOVEMENTS.grids[i]);
                };
                scope.showMovementAndNoteModal();
            }

            scope.goToNoteDetail = function(row){

                scope.movementAndNoteDetail = {};
                scope.movementAndNoteDetail.header = row.entity.$PANEL_NOTE_DETAIL_MOVEMENTS.name;
                scope.movementAndNoteDetail.map = {};

                for (var i = 0; i < row.entity.$PANEL_NOTE_DETAIL_MOVEMENTS.grids.length; i++) {
                    scope.movementAndNoteDetail.map[row.entity.$PANEL_NOTE_DETAIL_MOVEMENTS.grids[i].grid] = {};
                    scope.movementAndNoteDetail.map[row.entity.$PANEL_NOTE_DETAIL_MOVEMENTS.grids[i].grid].list = [];
                    makeMovementAndNoteDetailSection(row.entity.$PANEL_NOTE_DETAIL_MOVEMENTS.grids[i]);
                };
                scope.showMovementAndNoteModal();
            }
            scope.generatePayCheck = function(row){
                var url = '/app/CreateStatementInquiryPDF?numCheq='+row.entity.$PANEL_CHKLINK.grids[0].data[0].numCheq+
                '&acctid='+row.entity.$PANEL_CHKLINK.grids[0].data[0].acctid+'&date='+row.entity.$PANEL_CHKLINK.grids[0].data[0].date;
                $window.open(url);
            };
            scope.getScopeAttribute = function(key){
                return(scope[key]);
            }
            scope.generatePDF = function(id){
                printDiv(id);
            };


        }

}];
