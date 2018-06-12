(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme')
        .config(config);
  
    /** @ngInject */
    function config($provide) {

        $provide.factory('Constants', function(){
            return {
                translate:function(ary,value){
                    for(var i in ary){
                        if(ary[i].value==value) return ary[i].label;
                    }
                    return null;
                },
                evaluationType:[
                    {label:'自评性质',value:'1'},
                    {label:'内审性质',value:'2'}
                ],
                evaluationStatus:[
                    {label:'评审中',value:'1'},
                    {label:'已完成',value:'2'}
                ],
                standardType:[
                    {label:'VDA',value:'vda'}
                ],

                evaluationQuestionNodeStatus:[
                    {label:'待处理',value:'0'},
                    {label:'处理中',value:'1'},
                    {label:'已提交',value:'2'},
                    {label:'复核完成',value:'3'}
                ],
                severityLevel:[
                    {label:'High',value:'0'},
                    {label:'Medium',value:'1'},
                    {label:'Low',value:'2'},
                    {label:'SL',value:'3'},
                    {label:'None',value:'4'}
                ],
                levelApproved:[
                    {label:'Yes',value:'1'},
                    {label:'No',value:'0'}
                ],
                complianceLevel:[
                    {label:'Compliant',value:'0'},
                    {label:'Partial Compliant',value:'1'},
                    {label:'Non Compliant',value:'2'},
                    {label:'Inapplicable',value:'3'},
                    {label:'Other',value:'4'}
                ]
                
            };
        });

    }
  })();
  