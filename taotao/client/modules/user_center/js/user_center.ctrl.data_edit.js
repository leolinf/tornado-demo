/**
 * 用户发布和编辑数据
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'dataEditCtrl', dataEditCtrl );

    dataEditCtrl.$inject = [ '_', 'MyDataFactory', 'DetailFactory', 'dataCategoryArr', 'dataCategoryObj', 'dataCategoryReverseObj', 'dataSizeFormatArr', 'dataSizeFormatObj', 'dataFormatArr', 'dataFormatObj', 'priceTypeArr', 'priceTypeObj', 'priceFormatArr', 'priceFormatObj', 'isSampleAttachmentArr', 'isSampleAttachmentObj', 'defaults', 'errorCode', '$state', '$stateParams' ];

    function dataEditCtrl( _, MyDataFactory, DetailFactory, dataCategoryArr, dataCategoryObj, dataCategoryReverseObj, dataSizeFormatArr, dataSizeFormatObj, dataFormatArr, dataFormatObj, priceTypeArr, priceTypeObj, priceFormatArr, priceFormatObj, isSampleAttachmentArr, isSampleAttachmentObj, defaults, errorCode, $state, $stateParams ){
        // jshint validthis : true
        var vm = this;


        vm.tagnumLimit      = defaults.tagnumLimit;
        vm.tagwordLimit     = defaults.tagwordLimit;

        vm.saveData         = saveData;
        vm.deleteAttachment = deleteAttachment;

        vm.error = {
            title           : {
                flag    : false,
                msg     : '数据标题不能为空且长度不能超过30个字'
            },
            tags            : {
                flag    : false,
                msg     : '数据标签不能为空'
            },
            dataSizeRows    : {
                flag    : false,
                msg     : '数据大小不能为空'
            },
            cost            : {
                flag    : false,
                msg     : '请填写具体数值'
            },
            intro           : {
                flag    : false,
                msg     : '字数不得超过300个字/数据简介不能为空'
            },
            interface       : {
                flag    : false,
                msg     : '接口信息不能为空'
            },
            sample          : {
                flag    : false,
                msg     : '字数不得超过300字'
            },
            linkman         : {
                flag    : false,
                msg     : '联系人不能为空'
            },
            contact         : {
                flag    : false,
                msg     : '联系方式不正确/联系方式不能为空'
            }
        };

        vm.detail = {
            dataCategoryArr         : dataCategoryArr,
            dataCategoryReverseObj  : dataCategoryReverseObj,
            dataSizeFormatArr       : dataSizeFormatArr,
            dataFormatArr           : dataFormatArr,
            dataFormatObj           : dataFormatObj,
            priceTypeArr            : priceTypeArr,
            priceTypeObj            : priceTypeObj,
            priceFormatArr          : priceFormatArr,
            priceFormatObj          : priceFormatObj,
            isSampleAttachmentArr   : isSampleAttachmentArr,
        };

        active();

        function active(){
            init();
        }

        /**
         * 初始化数据
         */
        function init(){
            // 初次发布的时候无回填
            if( typeof $stateParams.dataId === 'undefined' ){
                vm.detail.title                 = '';
                vm.detail.category              = dataCategoryObj.socialNetwork.value;
                vm.detail.tags                  = [];
                vm.detail.dataSizeFormat        = dataSizeFormatObj.Bytes.value;
                vm.detail.dataSize              = 0;
                vm.detail.dataRows              = 0;
                vm.detail.dataFormat            = dataFormatObj.text.value;
                vm.detail.priceType             = priceTypeObj.charge.value;
                vm.detail.priceFormat           = priceFormatObj.yuan.value;
                vm.detail.attachment            = "";
                vm.detail.attachmentName        = "";
                vm.detail.intro                 = "";
                vm.detail.sample                = "";
                vm.detail.isSample              = isSampleAttachmentObj.yes.value;
                vm.detail.interface             = "";
                vm.detail.linkman               = "";
                vm.detail.contact               = "";
            }else{
                DetailFactory.getDataDetail({ dataId : $stateParams.dataId })
                .then( function( response ){
                    if( response.errorCode === errorCode.SUCCESS ){
                        vm.detail.title                 = response.data.title;
                        vm.detail.category              = response.data.category;
                        vm.detail.tags                  = response.data.tags;
                        vm.detail.dataFormat            = response.data.dataFormat;
                        vm.detail.dataSize              = response.data.dataSize;
                        vm.detail.dataRows              = response.data.rows;
                        vm.detail.priceType             = response.data.priceType;
                        vm.detail.priceFormat           = response.data.units;
                        vm.detail.cost                  = response.data.cost;
                        vm.detail.attachment            = response.data.attachment;
                        vm.detail.attachmentName        = response.data.attachmentName;
                        vm.detail.intro                 = response.data.intro;
                        vm.detail.sample                = response.data.sample;
                        vm.detail.isSample              = response.data.isSampleAttachment;
                        vm.detail.interface             = response.data.interface;
                        vm.detail.linkman               = response.data.linkman;
                        vm.detail.contact               = response.data.contact;
                        vm.detail.reviewContent         = response.data.reviewContent;
                        convertDataSizeFormat( vm.detail.dataSize );
                    }else{
                        console.log( response );
                    }
                });
            }
        }

        /**
         * 发布数据
         */
        function saveData(){
            if( validateTitle() && validateTags() && validateSizeAndRows() && validateCost() && validateIntro() && validateSample() && validateLinkman() && validateContact() ){
                if( vm.detail.dataFormat === dataFormatObj.api.value ){
                    validateInterface();
                }
                vm.detail.dataSize = convertDataSize( vm.detail.dataSize, vm.detail.dataSizeFormat );
                var toBeSavedData = {
                    attachment  : vm.detail.attachment,
                    category    : vm.detail.category,
                    contact     : vm.detail.contact,
                    cost        : vm.detail.cost,
                    dataRows    : vm.detail.dataRows,
                    dataSize    : vm.detail.dataSize,
                    dataFormat  : vm.detail.dataFormat,
                    interface   : vm.detail.interface,
                    intro       : vm.detail.intro,
                    isSample    : vm.detail.isSample,
                    linkman     : vm.detail.linkman,
                    priceType   : vm.detail.priceType,
                    units       : vm.detail.priceFormat,
                    sample      : vm.detail.sample,
                    tags        : vm.detail.tags,
                    title       : vm.detail.title
                };

                if( typeof $stateParams.dataId !== 'undefined' ){
                    toBeSavedData.dataId = $stateParams.dataId;
                }

                MyDataFactory.saveData( toBeSavedData )
                .then( function( response ){
                    if( response.errorCode === errorCode.SUCCESS ){
                        $state.go( 'userCenter.my_data' );
                    }else{
                        console.log( response );
                    }
                });
            }
        }

        /**
         * 转换数据大小格式
         */
        function convertDataSizeFormat( dataSize ){
            if( Math.floor( dataSize/1000000000000 ) > 0 ){
                vm.detail.dataSize = ( dataSize/1000000000000 ).toFixed( 3 );
                vm.detail.dataSizeFormat = dataSizeFormatObj.TeraBytes.value;
            }else if( Math.floor( dataSize/1000000000 ) > 0 ){
                vm.detail.dataSize = ( dataSize/1000000000 ).toFixed( 3 );
                vm.detail.dataSizeFormat = dataSizeFormatObj.GigaBytes.value;
            }else if( Math.floor( dataSize/1000000 ) > 0 ){
                vm.detail.dataSize = ( dataSize/1000000 ).toFixed( 3 );
                vm.detail.dataSizeFormat = dataSizeFormatObj.MebiBytes.value;
            }else if( Math.floor( dataSize/1000 ) > 0 ){
                vm.detail.dataSize = ( dataSize/1000 ).toFixed( 3 );
                vm.detail.dataSizeFormat = dataSizeFormatObj.KiloBytes.value;
            }else{
                vm.detail.dataSizeFormat = dataSizeFormatObj.Bytes.value;
            }
        }

        /**
         * 统一转换数据大小为以B为单位
         */
        function convertDataSize( dataSize, dataSizeFormat ){
            if( dataSizeFormat === dataSizeFormatObj.TeraBytes.value ){
                return dataSize*1000000000000;
            }else if( dataSizeFormat === dataSizeFormatObj.GigaBytes.value ){
                return dataSize*1000000000;
            }else if( dataSizeFormat === dataSizeFormatObj.MebiBytes.value ){
                return dataSize*1000000;
            }else if( dataSizeFormat === dataSizeFormatObj.KiloBytes.value ){
                return dataSize*1000;
            }else{
                return dataSize;
            }
        }

        /**
         * 验证标题
         */
        function validateTitle(){
            if( vm.detail.title === '' || vm.detail.title.length >= defaults.dataTitleLimit ){
                vm.error.title.flag = true;
                return false;
            }else{
                vm.error.title.flag = false;
                return true;
            }
        }
        
        /**
         * 验证标签
         */
        function validateTags(){
            var tags = vm.detail.tags;
            if( tags.length === 0 ){
                vm.error.tags.flag = true;
                return false;
            }else{
                vm.error.tags.flag = false;
                return true;
            }
        }

        /**
         * 验证数据大小和条数
         */
        function validateSizeAndRows(){
            var dataSize = Number( vm.detail.dataSize ),
                dataRows = Number( vm.detail.dataRows );
            if( ( _.isNaN( dataSize ) || dataSize <= 0 ) && ( _.isNaN( dataRows ) || dataRows <= 0 ) ){
                vm.error.dataSizeRows.flag = true;
                return false;
            }else{
                vm.error.dataSizeRows.flag = false;
                return true;
            }
        }

        /**
         * 验证标价
         */
        function validateCost(){
            var cost = Number( vm.detail.cost );
            if( _.isNaN( cost ) || cost <= 0 ){
                vm.error.cost.flag = true;
                return false;
            }else{
                vm.error.cost.flag = false;
                return true;
            }
        }

        /**
         * 验证简介
         */
        function validateIntro(){
            var intro = vm.detail.intro.trim();
            if( intro.length === 0 || intro.length > 300 ){
                vm.error.intro.flag = true;
                return false;
            }else{
                vm.error.intro.flag = false;
                return true;
            }
        }
        
        /**
         * 验证接口信息
         */
        function validateInterface(){
            var interfaceInfo = vm.detail.interface.trim();
            if( interfaceInfo.length === 0 ){
                vm.error.interface.flag = true;
                return false;
            }else{
                vm.error.interface.flag = false;
                return true;
            }
        }

        /**
         * 验证数据样例
         */
        function validateSample(){
            var sample = vm.detail.sample.trim();
            if( sample.length === 0 ){
                vm.error.sample.flag = true;
                return false;
            }else{
                vm.error.sample.flag = false;
                return true;
            }
        }

        /**
         * 验证联系人
         */
        function validateLinkman(){
            var linkman = vm.detail.linkman.trim();
            if( linkman.length === 0 ){
                vm.error.linkman.flag = true;
                return false;
            }else{
                vm.error.linkman.flag = false;
                return true;
            }
        }

        /**
         * 验证联系方式
         */
        function validateContact(){
            var contact = vm.detail.contact.trim();
            if( contact.length === 0 ){
                vm.error.contact.flag = true;
                return false;
            }else{
                vm.error.contact.flag = false;
                return true;
            }
        }

        /**
         * 删除附件
         */
        function deleteAttachment(){
            vm.detail.attachment        = "";
            vm.detail.attachmentName    = "";
            vm.detail.attachmentSize    = 0;
        }
    }

})();
