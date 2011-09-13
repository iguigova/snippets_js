
exports.Patterns = function(config){
    config = config || {};

    // Note: forward slashes need to be escaped
    var patterns = {
        amount: {pattern: '(([1-9],*)*\\d{3,3}|\\d{1,3})\\.\\d\\d', value: config.AMT || config.PAYMENTREQUEST_0_AMT, desc: 'Payment Amount (required,  must not exceed $10,000 USD in any currency, no currency symbol, must have two decimal places, decimal separator must be a period (.), and the optional thousands separator must be a comma (,))', isEnabled: true},
        cardType: {pattern: 'Visa|MasterCard|Discover|Amex|Maestro|Solo', value: config.CREDITCARDTYPE, desc: 'Card Type (required, not to exceed 10 alphabetic characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        cardNumber: {pattern: '\\d{16,16}', value: config.ACCT, desc: 'Card Number (required, numeric characters only, no spaces or punctutation, must conform with modulo and length required by each credit card type)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        expiryMonth: {pattern: '[0-2]\\d', desc: 'Expiry Month (required, format: MM, 2 characters, including zero)', isEnabled: false},
        expiryYear: {pattern: '(19|20)\\d\\d', desc: 'Expiry Year (required, format: YYYY, 4 characters)', isEnabled: false},
        expiryDate: {pattern: '[0-2]\\d(19|20)\\d\\d', value: config.EXPDATE, desc: 'Expiry Date (required, format: MMYYYY, 6 alphanumeric characters, including leading zero)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        cvv2: {pattern: '\\d{3,3}', value: config.CVV2, desc: 'CVV2 (required, 3 digits)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        firstName: {pattern: '.{1,25}', value: config.FIRSTNAME, desc: 'First Name (required, not to exceed 25 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        lastName: {pattern: '.{1,25}', value: config.LASTNAME, desc: 'Last Name (required, not to exceed 25 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        billingAddress: {pattern: '.{1,100}', value: config.STREET, desc: 'Street (required, not to exceed 100 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        city: {pattern: '.{1,40}', value: config.CITY, desc: 'City (required, not to exceed 40 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        stateCode: {pattern: '.{1,40}', value: config.STATE, desc: 'State (required, not to exceed 40 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},
        countryCode: {pattern: '[A-Z]{2,2}', value: config.COUNTRYCODE, desc: 'CountryCode (required, not to exceed 2 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')},        
        zipCode: {pattern: '\\w{1,20}', value: config.ZIP, desc: 'Zip (required, not to exceed 20 characters)', isEnabled: (config.METHOD == 'DoDirectPayment')}
    };

    for (var i in patterns){
        var pattern = patterns[i];
        patterns[i].regex = new RegExp('^' + patterns[i].pattern + '$');
    }
    
    return patterns;
};

exports.CURRENCYCODE = 'CAD';

// https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_WPWebsitePaymentsPro
exports.CardTypes = [
    {name: 'Visa', code: 'Visa'}, 
    {name: 'MasterCard', code: 'MasterCard'}
];

// https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_country_codes
exports.CountryCodes = [    
    {name: 'Canada', code: 'CA'},
    {name: 'United States', code: 'US'}
];

// https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_StateandProvinceCodes
exports.StateCodes = [
    {name: 'Alberta', code: 'AB'},
    {name: 'British Columbia', code: 'BC'},
    {name: 'Manitoba', code: 'MB'},
    {name: 'New Brunswick', code: 'NB'},
    {name: 'Newfoundland and Labrador', code: 'NL'},
    {name: 'Northwest Territories', code: 'NT'},
    {name: 'Nova Scotia', code: 'NS'},
    {name: 'Nunavut', code: 'NU'},
    {name: 'Ontario', code: 'ON'},
    {name: 'Prince Edward Island', code: 'PE'},
    {name: 'Quebec', code: 'QC'},
    {name: 'Saskatchewan', code: 'SK'},
    {name: 'Yukon', code: 'YT'},
    {name: 'Alabama', code: 'AL'},
    {name: 'Alaska', code: 'AK'},
    {name: 'American Samoa', code: 'AS'},
    {name: 'Arizona', code: 'AZ'},
    {name: 'Arkansas', code: 'AR'},
    {name: 'California', code: 'CA'},
    {name: 'Colorado', code: 'CO'},
    {name: 'Connecticut', code: 'CT'},
    {name: 'Delaware', code: 'DE'},
    {name: 'District of Columbia', code: 'DC'},
    {name: 'Federated States of Micronesia', code: 'FM'},
    {name: 'Florida', code: 'FL'},
    {name: 'Georgia', code: 'GA'},
    {name: 'Guam', code: 'GU'},
    {name: 'Hawaii', code: 'HI'},
    {name: 'Idaho', code: 'ID'},
    {name: 'Illinois', code: 'IL'},
    {name: 'Indiana', code: 'IN'},
    {name: 'Iowa', code: 'IA'},
    {name: 'Kansas', code: 'KS'},
    {name: 'Kentucky', code: 'KY'},
    {name: 'Louisiana', code: 'LA'},
    {name: 'Maine', code: 'ME'},
    {name: 'Marshall Islands', code: 'MH'},
    {name: 'Maryland', code: 'MD'},
    {name: 'Massachusetts', code: 'MA'},
    {name: 'Michigan', code: 'MI'},
    {name: 'Minnesota', code: 'MN'},
    {name: 'Mississippi', code: 'MS'},
    {name: 'Missouri', code: 'MO'},
    {name: 'Montana', code: 'MT'},
    {name: 'Nebraska', code: 'NE'},
    {name: 'Nevada', code: 'NV'},
    {name: 'New Hampshire', code: 'NH'},
    {name: 'New Jersey', code: 'NJ'},
    {name: 'New Mexico', code: 'NM'},
    {name: 'New York', code: 'NY'},
    {name: 'North Carolina', code: 'NC'},
    {name: 'North Dakota', code: 'ND'},
    {name: 'Northern Mariana Islands', code: 'MP'},
    {name: 'Ohio', code: 'OH'},
    {name: 'Oklahoma', code: 'OK'},
    {name: 'Oregon', code: 'OR'},
    {name: 'Palau', code: 'PW'},
    {name: 'Pennsylvania', code: 'PA'},
    {name: 'Puerto Rico', code: 'PR'},
    {name: 'Rhode Island', code: 'RI'},
    {name: 'South Carolina', code: 'SC'},
    {name: 'South Dakota', code: 'SD'},
    {name: 'Tennessee', code: 'TN'},
    {name: 'Texas', code: 'TX'},
    {name: 'Utah', code: 'UT'},
    {name: 'Vermont', code: 'VT'},
    {name: 'Virgin Islands', code: 'VI'},
    {name: 'Virginia', code: 'VA'},
    {name: 'Washington', code: 'WA'},
    {name: 'West Virginia', code: 'WV'},
    {name: 'Wisconsin', code: 'WI'},
    {name: 'Wyoming', code: 'WY'}
];