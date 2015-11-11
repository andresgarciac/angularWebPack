'use strict'

var errorsCtrl = require('./errors/controllers/errorsCtrl.js')
var commonFunctions = require('./commonFunctions/commonFunctions.js')
var sortingFunctions = require('./sortingFunctions/sortingFunctions.js')
var sortUtils = require('./sortingFunctions/sortUtils.js')
var sessionService = require('./services/entitlementServices/sessionService.js')
var masterServices = require('./services/masterServices/masterServices.js')
var consolidateBalancesService = require('./services/patternServices/consolidateBalancesService.js')
var productCategoryService = require('./services/patternServices/productCategoryService.js')
var productDetailService = require('./services/patternServices/productDetailService.js')
var movementsService = require('./services/patternServices/movementsService.js')
var labelsService = require('./services/labelsServices/labelsService.js')

require('ng-cache!./errors/templates/errorsTemplate.html');
require('ng-cache!./templates/headerTemplate.html');

angular.module('todo1Ui.errors', []);
angular.module('todo1Ui.commonFunctions', []);
angular.module('todo1Ui.sortingFunctions', []);
angular.module('todo1Ui.sortUtils', []);
angular.module('todo1Ui.sessionService', []);
angular.module('todo1Ui.masterServices', []);
angular.module('todo1Ui.patternServices', []);
angular.module('todo1Ui.labelsServices', []);

angular.module('todo1Ui.errors').directive('todo1Errors', errorsCtrl);
angular.module('todo1Ui.commonFunctions').factory('commonFunctions', commonFunctions);
angular.module('todo1Ui.sortingFunctions').factory('sortingFunctions', sortingFunctions);
angular.module('todo1Ui.sortUtils').factory('sortUtils', sortUtils);
angular.module('todo1Ui.sessionService').factory('sessionService', sessionService);
angular.module('todo1Ui.masterServices').factory('masterServices', masterServices);
angular.module('todo1Ui.patternServices').factory('consolidateBalancesService', consolidateBalancesService);
angular.module('todo1Ui.patternServices').factory('productCategoryService', productCategoryService);
angular.module('todo1Ui.patternServices').factory('productDetailService', productDetailService);
angular.module('todo1Ui.patternServices').factory('movementsService', movementsService);
angular.module('todo1Ui.labelsServices').factory('labelsService', labelsService);
