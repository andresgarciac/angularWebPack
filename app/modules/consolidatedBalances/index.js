'use strict'

require('ui.grid');
require('ngTouch');
require('angular-module-cookies');


var ConsolidatedBalancesCtrl = require('./consolidatedBalancesCtrl')

require('ng-cache!./templates/consolidatedBalances.html');
//require("bootstrap-webpack!../../../node_modules/bootstrap-webpack/bootstrap.config.js");
require("../../css/ui-grid-styles/ui-grid.css");
//require("../../bower_components/angular-ui-grid/ui-grid.css");
//require("./styles/app.css");
//require("style!css!less!./bootstrap-styles!./bootstrap.config.js");
//require('../styles/ui-grid.css');


angular.module('todo1Ui.consolidatedBalances', ['ui.grid','ngTouch', 'ui.grid.pagination','ngCookies', 'ui.grid.moveColumns']);

angular.module('todo1Ui.consolidatedBalances').directive('todo1ConsolidatedBalances', ConsolidatedBalancesCtrl);
