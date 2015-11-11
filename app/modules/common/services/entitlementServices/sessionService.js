'use strict'

module.exports = ['$http',function ($http) {
    return {
        sessionVar : function(){
            return $http({
                method: "post",
                url: "/app/entitlement/session",
                headers: {
                    'cst':getCstParam()
                }
            });
        }
    }
}];
