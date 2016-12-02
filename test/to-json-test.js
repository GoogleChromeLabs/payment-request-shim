/**
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const toJSONIntervention = require('../src/interventions/to-json.js');

require('chai').should();

const injectedToJSONResult = {injected: 'example'};

class InjectedUpToDatePaymentResponse {
  toJSON() {
    return injectedToJSONResult;
  }
}

const injectedDetails = {
  'injected-details': 'example-details',
};
const injectedMethodName = 'injected-method-name';
const injectedPayerEmail = 'injected-email';
const injectedPayerPhone = 'injected-phone';
const injectedShippingAddress = 'injected-shipping-address';
const injectedShippingOption = 'injected-shipping-options';

class InjectedOldPaymentResponse {
  get details() {
    return injectedDetails;
  }

  get methodName() {
    return injectedMethodName;
  }

  get payerEmail() {
    return injectedPayerEmail;
  }

  get payerPhone() {
    return injectedPayerPhone;
  }

  get shippingAddress() {
    return injectedShippingAddress;
  }

  get shippingOption() {
    return injectedShippingOption;
  }
}

// This is to test the added toJSON method that was added in M54.
describe('toJSON Shim', function() {
  it(`should not override toJSON method`, function() {
    let window = {
      PaymentResponse: InjectedUpToDatePaymentResponse,
    };

    toJSONIntervention(window);

    ('toJSON' in window.PaymentResponse.prototype).should.equal(true);

    const paymentResponse = new window.PaymentResponse();
    paymentResponse.toJSON().should.equal(injectedToJSONResult);
  });

  it(`should add missing toJSON method`, function() {
    let window = {
      PaymentResponse: InjectedOldPaymentResponse,
    };

    toJSONIntervention(window);

    ('toJSON' in window.PaymentResponse.prototype).should.equal(true);

    const paymentResponse = new window.PaymentResponse();
    paymentResponse.toJSON().should.deep.equal({
      details: injectedDetails,
      methodName: injectedMethodName,
      payerEmail: injectedPayerEmail,
      payerPhone: injectedPayerPhone,
      shippingAddress: injectedShippingAddress,
      shippingOption: injectedShippingOption,
    });
  });
});
