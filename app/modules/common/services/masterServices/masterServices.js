'use strict'

module.exports = ['$http',function ($http) {
    return {
 		productsRequest : function( languageType ){
 			return $http({
            	method: "post",
            	url: "/app/maestros/products",
            	headers: {
                	'cst':getCstParam()
            	},
            	data: {
                	languageCode: languageType
            	}
        	});
 		},
 		currenciesRequest : function( languageType ){
 			return $http({
            	method: "post",
            	url: "/app/maestros/currencies",
            	headers: {
                	'cst':getCstParam()
            	},
            	data: {
                	languageCode: languageType
            	}
        	});
 		},
 		countriesRequest : function( languageType ){
 			return $http({
            	method: "post",
            	url: "/app/maestros/countries",
            	headers: {
                	'cst':getCstParam()
            	},
            	data: {
                	languageCode: languageType
            	}
        	});
    	},
 		banksRequest : function( languageType ){
 			return $http({
            	method: "post",
            	url: "/app/maestros/banks",
            	headers: {
                	'cst':getCstParam()
            	},
            	data: {
                	languageCode: languageType
            	}
        	});
		}
    }
}];
