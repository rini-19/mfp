const TextHandler = require("./textMessages/textHandler");
const QuickReplyHandler = require("./quick_replies/quickReplyHandler");
const AttachmentHandler = require("./attachMents/attachmentHandler");
const PostbackHandler = require("./postbackHandler/postbackHandler");
const ReferralHandler = require("./referralHandler/referralHandler");
const FormCallbackHandler = require("./FormCallBackHandler/formCallbackHandler");
const dbhandler = require("../dbHandlers/insert");

module.exports = class HandlerFactory {
    constructor (user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    getHanlder () {
        let event = this.webhookEvent;

        let responses, handler, messageBody, type;

        try {
            if ( event.message ) {
                let message = event.message;

                if ( message.quick_reply ) {
                    type = 'QUICK REPLY';
                    messageBody = this.webhookEvent.message.quick_reply.payload;
                    handler = new QuickReplyHandler(this.user, this.webhookEvent);
                } else if ( message.attachments ) {
                    handler = new AttachmentHandler(this.user, this.webhookEvent);
                } else if ( message.text ) {
                    type = "TEXT";
                    messageBody = this.webhookEvent.message.text;
                    handler = new TextHandler(this.user, this.webhookEvent);
                }
            } else if ( event.postback ) {
                type = "QUICK REPLY";
                messageBody = this.webhookEvent.postback.payload;
                handler = new PostbackHandler(this.user, this.webhookEvent);
            } else if ( event.referral ) {
                handler = new ReferralHandler(this.user, this.webhookEvent);

            } else if ( event.formCallBack ) {
                type = "FORM";
                messageBody = this.webhookEvent.formType;
                handler = new FormCallbackHandler(this.user, this.webhookEvent);
            }
        } catch ( error ) {
            console.error(error);
            responses = {
                text: `An error has occured: '${ error }'. We have been notified and \
        will fix the issue shortly!`
            };
            return responses;
        }
        dbhandler.insertMessage(this.user.psid, type, messageBody);
        return handler.getHandler();
    }


};