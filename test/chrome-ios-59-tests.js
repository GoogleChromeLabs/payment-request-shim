/**
Copyright 2017 Google Inc.

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

const chromeIosIntervention = require('../src/interventions/chrome-ios-59.js');

require('chai').should();

// SEE: https://bugs.chromium.org/p/chromium/issues/detail?id=734586
describe('Chrome for iOS M59 fix', function() {
  const NON_MATCHING_USER_AGENTS = [
    `Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36`,
    `Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30`,
    `Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19`,
    `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:49.0) Gecko/20100101 Firefox/49.0`,
    `Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/N5D91L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2840.85 Mobile Safari/537.36`,
    `Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/N5D91L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2840.85 Mobile Safari/537.36`,
    // Chrome for iOS versions 60 and 61 are not matched.
    `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/60.0.3103.0 Mobile/16F73 Safari/602.1`,
    `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/61.0.3103.0 Mobile/16F73 Safari/602.1`,
  ];

  NON_MATCHING_USER_AGENTS.forEach((userAgent, index) => {
    it(`should not match for userAgent 'NON_MATCHING_USER_AGENTS[${index}]'`, function() {
      const injectedPaymentRequest = {};
      let window = {
        PaymentRequest: injectedPaymentRequest,
      };
      let navigator = {
        userAgent: userAgent,
      };

      chromeIosIntervention(window, navigator);

      window.PaymentRequest.should.equal(injectedPaymentRequest);
    });
  });

  const MATCHING_USER_AGENTS = [
    `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/59.0.3103.0 Mobile/16F73 Safari/602.1`,
  ];

  MATCHING_USER_AGENTS.forEach((userAgent, index) => {
    it(`should match the userAgent 'MATCHING_USER_AGENTS[${index}]'`, function() {
      const injectedPaymentRequest = {};
      const injectedPaymentAddress = {};
      const injectedPaymentResponse = {};
      const injectedPaymentRequestUpdateEvent = {};

      let window = {
        PaymentRequest: injectedPaymentRequest,
        PaymentAddress: injectedPaymentAddress,
        PaymentResponse: injectedPaymentResponse,
        PaymentRequestUpdateEvent: injectedPaymentRequestUpdateEvent,
      };
      let navigator = {
        userAgent: userAgent,
      };

      chromeIosIntervention(window, navigator);

      (window.PaymentRequest === null).should.equal(true);
      (window.PaymentAddress === null).should.equal(true);
      (window.PaymentResponse === null).should.equal(true);
      (window.PaymentRequestUpdateEvent === null).should.equal(true);
    });
  });
});
