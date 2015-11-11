'use strict'

module.exports = ['$http',function ($http) {
    return {
        productDetailService : function(id,bank,regionCode){
            return $http({
                method: "post",
                url: "/app/detail",
                headers: {
                    'cst':getCstParam()
                },
                params: {
                    id: id,
                    bank: bank,
                    regionCode: regionCode
                }
            });
        }
    }
}];