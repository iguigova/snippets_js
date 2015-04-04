var usertypes = require('../../bin/usertypes.js').usertypes;
var configs = require('../harness_configs.js').configs[process.env.environment];
var utils = require('../../bin/utils.js'); var fw = require('../../bin/frisbywrap.js');

exports.build = function(callback){
    return {
        testcase: 'VPS-984',
        description: 'PUT  /api/messages/{MessageGuid}/attachments/{AttachmentGuid}/link',
        usertype: usertypes.guest,
        method: 'PUT',
        route: utils.format('/messages/{0}/attachments/{1}/link', configs.messageguids.guest.draft, configs.attachmentguids.guest), 
        data: { },    
        status: 200,
        obj: '',
        response: { },
        callback: function() {
            fw.run({
                testcase: 'VPS-984',
                description: ' Call LinkAttachment Again.  PUT  /api/messages/{MessageGuid}/attachments/{AttachmentGuid}/link',
                usertype: usertypes.guest,
                method: 'PUT',
                route: utils.format('/messages/{0}/attachments/{1}/link', configs.messageguids.guest.draft, configs.attachmentguids.guest), 
                data: { },    
                status: 403,
                obj: '',
                response: {
                    responseStatus:{
                        errorCode: '800',
                        message: String
                    }
                },
                callback: function() {
                    fw.run({
                        testcase: 'VPS-984',
                        description: 'Call UnlinkAttahcment. PUT /api/messages/{MessageGuid}/attachments/{AttachmentGuid}/unlink',
                        usertype: usertypes.guest,
                        data: { },    
                        method: 'PUT',
                        route: utils.format('/messages/{0}/attachments/{1}/unlink', configs.messageguids.guest.draft, configs.attachmentguids.guest),
                        status: 200,
                        obj: '',
                        response: {},
                        callback: callback
                    });
                }
            });
        }
    };
};
