'use strict'

require('ui.grid');
require('ngTouch');
require('angular-module-cookies');

var movementsCtrl = require('./movementsCtrl.js');
var queryMovementsCtrl =  require('./movementsCtrls/queryMovementsCtrl.js');


require('ng-cache!./templates/movements.html');
require('ng-cache!./templates/movementsTemplates/queryMovements.html');
require("../../css/ui-grid-styles/ui-grid.css");

angular.module('todo1Ui.movements', ['ui.grid','ngTouch','ui.grid.pagination','ngCookies', 'ui.grid.moveColumns']);

angular.module('todo1Ui.movements').directive('todo1Movements', movementsCtrl);
angular.module('todo1Ui.movements').directive('todo1QueryMovements', queryMovementsCtrl);