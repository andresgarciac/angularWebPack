'use strict'

module.exports = ['$http',function ($http) {
    return {
        movementsService : function(id,fromDate,toDate,bank,regionCode){
            return $http({
                method: "post",
                url: "/app/movimientos",
                headers: {
                    'cst':getCstParam()
                },
                params: {
                    id: id,
                    from: fromDate,
                    to: toDate,
                    bank: bank,
                    regionCode: regionCode
                }
            });
        },
        ownAccountsService : function(bank,regionCode){
            return $http({
                method: "post",
                url: "/app/ownAccountService",
                headers: {
                    'cst':getCstParam()
                },
                params: {
                    bank: bank,
                    regionCode: regionCode
                }
            });
        }
    }
}];