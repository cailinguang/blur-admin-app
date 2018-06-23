(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('UploadEvidencesCtrl', UploadEvidencesCtrl);

    /** @ngInject */
    function UploadEvidencesCtrl($scope,$http,$uibModal,FileUploader,node,localStorage,FileItem,FileLikeObject,RouteServcie,toastr) {
        var bizId = node.id;
        var uploader = $scope.uploader = new FileUploader({
            url: RouteServcie.getUrl('/api/attachment'),
            headers:{Authorization:localStorage.getObject('JWT')},
            formData:[{bizId:bizId}],
            autoUpload:true
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
                toastr.error('上传失败');
            }else{
                fileItem.id=response.data;
                node.attachments.push({});
                toastr.success('上传成功');
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
                node.attachments.splice(0,1);
                $http.delete('/api/attachment/'+item.id);
            }
        }
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            toastr.error('上传失败');
        };
       

    }; 
})();