'use strict'

require('ui.grid');
require('ngTouch');
//require('angular-bootstrap');
require('angular-module-cookies');

var productBalancesCtrl = require('./productBalancesCtrl');
var productGridCtrl =  require('./gridsCtrl/productGridCtrl');

require('ng-cache!./templates/productBalances.html');
require('ng-cache!./templates/productsGrids/productGrid.html');

require("../../css/ui-grid-styles/ui-grid.css");

angular.module('todo1Ui.productBalances', ['ui.grid','ngTouch','ui.grid.pagination','ngCookies', 'ui.grid.moveColumns']);

angular.module('todo1Ui.productBalances').directive('todo1ProductBalances', productBalancesCtrl);
angular.module('todo1Ui.productBalances').directive('todo1ProductGrid', productGridCtrl);
