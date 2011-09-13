
var paymentAction = 'Sale';
var currencyCode = 'CAD';

exports.CommonConfig = {
    URL: 'https://api-3t.sandbox.paypal.com/nvp',
    VERSION: '74.0',

    USER: 'pro_1313454117_biz_api1.gmail.com',
    PWD: '1313454167',
    SIGNATURE: 'AOlc8PesDmWVz2jsPUfYYAfeHBjTAAevhNNIvp2X2ohLKmRwAivPqogx'
};

exports.DirectPaymentConfig = {
    // https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_DoDirectPayment
    METHOD: 'DoDirectPayment',
    PAYMENTACTION: paymentAction,
    CURRENCYCODE: currencyCode
};

exports.ECSetConfig = {
    // https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_SetExpressCheckout#id09BHC0S0230
    METHOD: 'SetExpressCheckout', 
    PAYMENTREQUEST_0_PAYMENTACTION: paymentAction, 
    PAYMENTREQUEST_0_CURRENCYCODE: currencyCode,

    RETURNURL: 'http://renoplan.localhost/jack/Payment/review?planId=',
    CANCELURL: 'http://renoplan.localhost/jack/Payment/cancel?planId=',
    CMDURL: 'https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=',

    NOSHIPPING: 1, 
    LOCALCODE: 'CA'
};

exports.ECDoConfig = {
    // https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_r_DoExpressCheckoutPayment#id09BGHL0E0YE
    METHOD: 'DoExpressCheckoutPayment',
    PAYMENTREQUEST_0_PAYMENTACTION: paymentAction,
    PAYMENTREQUEST_0_CURRENCYCODE: currencyCode
};