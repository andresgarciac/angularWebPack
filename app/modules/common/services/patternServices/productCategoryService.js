'use strict'

module.exports = ['$http',function ($http) {
    return {
        productCategoryService : function(bank,triggerEvent,regionCode){
            return $http({
                method: "post",
                url: "/app/balances",
                headers: {
                    'cst':getCstParam()
                },
                params: {
                    bank: bank,
                    triggerEvent: triggerEvent,
                    regionCode: regionCode
                }
            });
        }
    }
}];