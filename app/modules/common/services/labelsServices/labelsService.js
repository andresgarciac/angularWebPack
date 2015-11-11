'use strict'

module.exports = ['$http',function ($http) {
    return {
        labelsService : function(bank,regionCode){
            return $http({
                method: "post",
                url: "/app/labels",
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