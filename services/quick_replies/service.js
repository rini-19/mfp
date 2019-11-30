"use strict";
const dataStore = require("../../constants/dataStore");
const Response = require("../response");
const config = require("../config");
const i18n = require("../../i18n.config");
const links = require("../../constants/dataStore");
const template = require("../../constants/templates");
module.exports = class Service {
    constructor (user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    async handlePayload (payload) {

        if ( payload === "SERVICE" ) {
            let button = Response.genWebUrlButtonExtension(
                i18n.__("service.prompt"),
                config.shopUrl + '/' + dataStore.servieForm,
            );

            return Response.genButtonTemplate("Please fill out this form", [button]);


        } else {
            console.log("Not a valid service");
        }
    };
};