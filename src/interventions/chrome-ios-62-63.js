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

/**
 * README
 *
 * This intervention handles the scenario where Chrome cannot handle a number
 * passed as the PaymentCurrencyAmount.value for iOS.
 *
 * https://bugs.chromium.org/p/chromium/issues/detail?id=785429
 *
 * FIX
 *
 * This code checks the UserAgent to see if the current environment is Chrome
 * for iOS version 62 or 63 and if it is converts the numbers in all
 * PaymentCurrencyAmount.value instances to strings before passing the objects
 * to the browser.
 */

/**
 * Converts a PaymentCurrencyAmount.value from number to string, if any.
 * @param {(window.PaymentCurrencyAmount|undefined)} amount
 */
function convertPaymentCurrencyAmount(amount) {
  if (!amount) {
    return;
  }

  // Convert the value to String if it isn't one already.
  amount.value = String(amount.value);
}

/**
 * Converts PaymentCurrencyAmount.value instances from number to string inside
 * instances of PaymentItem, if any.
 * @param {(Array<!window.PaymentItem>|undefined)} displayItems
 */
function convertDisplayItems(displayItems) {
  if (!displayItems || !(displayItems instanceof Array)) {
    return;
  }

  for (let i = 0; i < displayItems.length; i++) {
    convertPaymentCurrencyAmount(displayItems[i].amount);
  }
}

/**
 * Converts PaymentCurrencyAmount.value instances from number to string inside
 * instances of PaymentShippingOption, if any.
 * @param {(Array<!window.PaymentShippingOption>|undefined)} shippingOptions
 */
function convertShippingOptions(shippingOptions) {
  if (!shippingOptions || !(shippingOptions instanceof Array)) {
    return;
  }

  for (let i = 0; i < shippingOptions.length; i++) {
    convertPaymentCurrencyAmount(shippingOptions[i].amount);
  }
}

/**
 * Converts PaymentCurrencyAmount.value instances from number to string inside
 * an instance of PaymentDetails, if any.
 * @param {(window.PaymentDetails|undefined)} details
 */
function convertPaymentDetails(details) {
  if (!details) {
    return;
  }

  if (details.total) {
    convertPaymentCurrencyAmount(details.total.amount);
  }
  convertDisplayItems(details.displayItems);
  convertShippingOptions(details.shippingOptions);
  convertPaymentDetailsModifiers(details.modifiers);
}

/**
 * Converts PaymentCurrencyAmount.value instances from number to string inside
 * instances of PaymentDetailsModifier, if any.
 * @param {(Array<!window.PaymentDetailsModifier>|undefined)} modifiers
 */
function convertPaymentDetailsModifiers(modifiers) {
  if (!modifiers || !(modifiers instanceof Array)) {
    return;
  }

  for (let i = 0; i < modifiers.length; i++) {
    if (modifiers[i].total) {
      convertPaymentCurrencyAmount(modifiers[i].total.amount);
    }
    convertDisplayItems(modifiers[i].additionalDisplayItems);
  }
}

module.exports = (window, navigator) => {
  if (!window.PaymentRequest) {
    return;
  }

  if (/CriOS\/(62|63)/.test(navigator.userAgent)) {
    let originalPaymentRequest = window.PaymentRequest;

    window.PaymentRequest = function(methodData, details, optOptions) {
      convertPaymentDetails(details);
      originalPaymentRequest.call(this, methodData, details, optOptions);
    };

    window.PaymentRequest.prototype.__proto__ =
        originalPaymentRequest.prototype;

    /* eslint-disable no-undef */
    let originalUpdateWith = __gCrWeb['paymentRequestManager'].updateWith;

    __gCrWeb['paymentRequestManager'].updateWith = function(detailsOrPromise) {
      // if |detailsOrPromise| is not an instance of a Promise, wrap it in a
      // Promise that fulfills with |detailsOrPromise|.
      if (!detailsOrPromise || !(detailsOrPromise.then instanceof Function) ||
          !(detailsOrPromise.catch instanceof Function)) {
        detailsOrPromise = Promise.resolve(detailsOrPromise);
      }

      let self = this;
      detailsOrPromise
          .then(function(paymentDetails) {
            convertPaymentDetails(paymentDetails);
            originalUpdateWith.call(self, paymentDetails);
          });
    };
  }
};
