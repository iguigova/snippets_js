
include('Ph');

var pp = require('paypal-website-payments-pro');

var redirectPath = function(view){
    return function(planId) {
        return '/jack/Payment/' + view + ((planId) ? '?planId=' + planId + '&': '');
    };
};
var redirectBilling = redirectPath('billinginfo');
var redirectConfirmation = redirectPath('confirmation');
var redirectCancel = redirectPath('cancel');
var redirectError = redirectPath('error');

exports.Payment = defineController({

    plans: function(){

        if (this.getEnv().isPost){

            var info = this.getPaymentInfo();
            if (info){
                if (info.isDirectPayment){
		    return this.redirect(redirectBilling(info.planId));
                } else {
                    return this.tryPaymentAPI(info.planId, this.getECSetInfo, pp.ECSetAPI);
                }
            }
        }

        return this.view('Payment/plans', {
            caption: 'Please select subscription plan',
            plans: this.getPlans()
        }, 'master');
    },

    billinginfo: function(){
        var plan = this.getPlan();

        if (!plan.id){
            return this.redirect(redirectError());
        }

        if (this.getEnv().isPost){
            return this.tryPaymentAPI(plan.id, this.getBillingInfo, pp.DirectPaymentAPI);
        }

        return this.view('Payment/billinginfo', {
            caption: 'Please provide billing details',
            plan: plan,
            patterns: pp.Patterns,
            countryCodes: pp.CountryCodes,
            stateCodes: pp.StateCodes,
            cardTypes: pp.CardTypes
        }, 'payment/master');
    },

    review: function(){
        var plan = this.getPlan();

        if (!plan.id){
            return this.redirect(redirectError());
        }
        
        // complete the ExpressCheckout transaction
        return this.tryPaymentAPI(plan.id, this.getECDoInfo, pp.ECDoAPI);
    },

    cancel: function(){
        return this.viewDefault('Payment/cancel', 'Your request has been canceled.');
    },

    confirmation: function() {
        return this.viewDefault('Payment/confirmation', 'Your request has been processed.');
    },

    error: function(){
        return this.viewDefault('Payment/error', 'There has been an error ');
    },

    viewDefault: function(page, caption){
        var params = this.getParams();

        return this.view(page, {
            plan: this.getPlan(),
            caption: caption || '',
            params: ph.toNVA(params)
        }, 'payment/master');
    },

    getPlans: function(){
        //TODO: implement for real based on the Plan model
        return [
            {id: 1, name: 'BasicPlan', description: 'Basic Plan: 3 projects, 1GB upload, 1 year, CAD $1.00', price: '0.01'},
            {id: 2, name: 'PremiumPlan', description: 'Premium Plan: unlimited projects, 10GB upload, 1 year, CAD $3.00', price: '0.03'}
        ];
    },

    getPlan: function(planId){
        planId = planId || (this.getParams() || {}).planId;

        var plans = this.getPlans(); // print('plans: ' + JSON.stringify(plans)); print('planId: ' + planId);

        for (var i = 0, len = plans.length; i < len; i++){
            if ((plans[i].name == planId) || plans[i].id == planId){
                return plans[i];
            }
        }

        return {description: 'No plan is selected!'};
    },

    getPaymentInfo: function(){
        var params = this.getParams();  //print('getPaymentInfo Params: ' + JSON.stringify(params));

        if (params){
            if (params.planId){
                return {
                    planId: params.planId,
                    isDirectPayment: params['directPayment.x'],
                    isPayPalPayment: params['payPalPayment.x']
                };
            }
        }
    },

    getBillingInfo: function(){
        var params = this.getParams();  // print('getBillingInfo Params: ' + JSON.stringify(params));

        if (params){
            return {
                AMT: this.getPlan().price,
                CREDITCARDTYPE: params.cardType,
                ACCT: params.cardNumber,
                EXPDATE: params.expiryMonth + params.expiryYear,
                CVV2: params.cvv2,
                FIRSTNAME: params.firstName,
                LASTNAME: params.lastName,
                STREET: params.billingAddress,
                CITY: params.city,
                STATE: params.stateCode,
                ZIP: params.zipCode,
                COUNTRYCODE: params.countryCode,
                isCanceled: params['cancel'] || params['cancel.x'],
            };
        }
    },

    getECInfo: function(plan){
        plan = plan || this.getPlan();

        if (plan){
            return {
                PAYMENTREQUEST_0_DESC: plan.description,
                PAYMENTREQUEST_0_AMT: plan.price
            }
        }
    },

    getECSetInfo: function(){
        var params = this.getParams();  // print('getECSetInfo Params: ' + JSON.stringify(params));
        var plan = this.getPlan();

        if (plan){
            // https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_SetExpressCheckout#id09BHC0S0230
            return ph.apply(this.getECInfo(plan), {
                RETURNURL: pp.ECReturnUrl + plan.id,
                CANCELURL: pp.ECCancelUrl + plan.id
            });
        }
    },

    getECDoInfo: function(){
        var params = this.getParams();  // print('getECDoInfo Params: ' + JSON.stringify(params));
        var plan = this.getPlan();

        if (plan){
            // https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_DoExpressCheckoutPayment#id09BGHL0E0YE
            return ph.apply(this.getECInfo(plan), {
                TOKEN: params.token,
                PAYERID: params.PayerID
            });
        }
    },

    tryPaymentAPI: function(planId, getInfo, makePayment){
        var self = this;
        var info = getInfo.call(self);

        if (info){
            if (info.isCanceled) return self.redirect(redirectCancel(planId));

            var onSuccess = function(content, status){
                // TODO: Persist Payment information

                var json = ph.fromNVP(content);

                json.status = status;

                if (json.ACK.indexOf('Success') > -1){
                    if (makePayment == pp.ECSetAPI && json.TOKEN){ // execute the Express Checkout Command
                        return self.redirect(pp.ECCmdUrl + json.TOKEN);
                    }

                    return self.redirect(redirectConfirmation(planId) + ph.toNVP(json));
                }
                
                return self.redirect(redirectError(planId) + ph.toNVP(json));
            };

            var onError = function(message, status){
                return self.redirect(redirectError(planId) + ph.toNVP({message: message, status: status}));
            };

            return makePayment.call(self, self.getEnv(), info).execute(onSuccess, onError);
        }
    }
});
