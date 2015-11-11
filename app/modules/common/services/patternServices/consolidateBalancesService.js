'use strict'

module.exports = ['$http',function ($http) {
    return {
        consolidatedBalanceService : function(bank,triggerEvent,regionCode){
            return $http({
                method: "post",
                url: "/app/consolidatebalances",
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