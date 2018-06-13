(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('UploadEvidencesCtrl', UploadEvidencesCtrl);

    /** @ngInject */
    function UploadEvidencesCtrl($scope,$http,$uibModal,FileUploader,bizId,localStorage,FileItem,FileLikeObject) {
        
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://localhost:8080/api/attachment',
            headers:{Authorization:localStorage.getObject('JWT')},
            formData:[{bizId:bizId}]
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        //load bizId
        $http.get('/api/attachment/biz',{params:{bizId:bizId}}).then(function(response){
            if(response.data.code==200){
                response.data.data.forEach(function(element){
                    var file = new FileLikeObject({size:element.size,name:element.name});
                    var item = new FileItem(uploader,file);
                    item.isSuccess=true;
                    item.isUploaded=true;
                    item.id=element.id;
                    uploader.queue.push(item);
                    uploader.onAfterAddingFile(item);
                });
            }
            
        });

        // CALLBACKS
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if(response.code!=200){
                fileItem.isError=true;
                fileItem.isSuccess=false;
                fileItem.isUploaded=false;
                fileItem.progress=0;
            }else{
                fileItem.id=response.data;
            }
        };
        uploader.onAfterAddingFile = function(fileItem, response, status, headers) {
            fileItem.remove = function(){
                this.uploader.onDeleteItem(this);
                this.uploader.removeFromQueue(this);
            }
        }
        uploader.onDeleteItem = function(item){
            if(item.id){
                $http.delete('/api/attachment/'+item.id);
            }
        }
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
       

    }; 
})();