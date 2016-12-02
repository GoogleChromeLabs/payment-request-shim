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

/**
 * README
 *
 * This intervention adds toJSON to the PaymentResponse prototype on Chrome 54.
 */

const toJSONShim = function() {
  const instrumentObject = {
    methodName: this.methodName,
    details: this.details,
    shippingAddress: this.shippingAddress || null,
    shippingOption: this.shippingOption || null,
    payerEmail: this.payerEmail || null,
    payerPhone: this.payerPhone || null,
  };

  return instrumentObject;
};

module.exports = (window) => {
  if (!window.PaymentResponse) {
    return;
  }

  if ('toJSON' in window.PaymentResponse.prototype) {
    return;
  }

  window.PaymentResponse.prototype.toJSON = toJSONShim;
};
