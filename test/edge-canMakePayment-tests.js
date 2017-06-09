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

const edgeCanMakePaymentIntervention = require('../src/interventions/edge-canMakePayment.js');

require('chai').should();

class InjectedPaymentRequest {}

const injecteCanMakePaymentResult = 'injectedResult';

class InjectedNewPaymentRequest {
  canMakePayment() {
    return injecteCanMakePaymentResult;
  }
}

describe('Edge canMakePayment Shim', () => {
  const NON_MATCHING_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.21 Safari/537.36';
  const MATCHING_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063';

  it('should not override canMakePayment method', () => {
    let window = {
      PaymentRequest: InjectedNewPaymentRequest,
    };
    let navigator = {
      userAgent: MATCHING_USER_AGENT,
    };

    edgeCanMakePaymentIntervention(window, navigator);

    ('canMakePayment' in window.PaymentRequest.prototype).should.equal(true);

    const paymentRequest = new window.PaymentRequest();
    paymentRequest.canMakePayment().should.equal(injecteCanMakePaymentResult);
  });

  it(`should not add canMakePayment method when user agent is "${NON_MATCHING_USER_AGENT}"`, () => {
    let window = {
      PaymentRequest: InjectedPaymentRequest,
    };
    let navigator = {
      userAgent: NON_MATCHING_USER_AGENT,
    };

    edgeCanMakePaymentIntervention(window, navigator);

    ('canMakePayment' in window.PaymentRequest.prototype).should.equal(false);
  });

  it(`should add missing canMakePayment method when user agent is "${MATCHING_USER_AGENT}"`, () => {
    let window = {
      PaymentRequest: InjectedPaymentRequest,
    };
    let navigator = {
      userAgent: MATCHING_USER_AGENT,
    };

    edgeCanMakePaymentIntervention(window, navigator);

    ('canMakePayment' in window.PaymentRequest.prototype).should.equal(true);
  });
});
