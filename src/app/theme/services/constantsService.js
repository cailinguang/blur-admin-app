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
                userStatus:[
                    {label: 'Unlock', value: '1'},
                    {label: 'Lock', value: '2'}
                ],
                evaluationType:[
                    {label:'Self Assessment',value:'1'},
                    {label:'Internal Audit',value:'2'}
                ],
                evaluationStatus:[
                    {label:'New',value:'0'},
                    {label:'In review',value:'1'},
                    {label:'Completed',value:'2'}
                ],
                standardType:[
                    {label:'VDA',value:'vda'}
                ],

                evaluationQuestionNodeStatus:[
                    {label:'Pending',value:'0'},
                    {label:'Processing',value:'1'},
                    {label:'Submitted',value:'2'},
                    {label:'Review completed',value:'3'}
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
                    {label:'Yes',value:'0'},
                    {label:'No',value:'1'},
                    {label:'N/A',value:'2'}
                ]
                
            };
        });

    }
  })();
  