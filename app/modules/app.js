'use strict';

require('./common');
require('./consolidatedBalances');
require('./productBalances');
require('./movements');

angular.module('todo1Ui', [
	'todo1Ui.consolidatedBalances',
	'todo1Ui.productBalances',
	'todo1Ui.movements',
	'todo1Ui.errors',
	'todo1Ui.commonFunctions',
	'todo1Ui.sortingFunctions',
	'todo1Ui.sortUtils',
	'todo1Ui.sessionService',
	'todo1Ui.masterServices',
	'todo1Ui.patternServices',
	'todo1Ui.labelsServices'
]);