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
 * This intervention handles the scenario where Chrome for iOS was exposing
 * the `PaymentRequest` API on the window, even though it was not yet
 * fully implemented or supported.
 *
 * https://bugs.chromium.org/p/chromium/issues/detail?id=734586
 *
 * FIX
 *
 * This code checks the UserAgent to see if the current environment is Chrome
 * for iOS version 59 and if it is deletes the `PaymentRequest` API from the
 * `window` (as well as related objects).
 *
 * The regex essentially looks for 'CriOS/59'.
 */

module.exports = (window, navigator) => {
  if (!window.PaymentRequest) {
    return;
  }

  if (/CriOS\/59/.test(navigator.userAgent)) {
    window.PaymentRequest = null;
    window.PaymentAddress = null;
    window.PaymentResponse = null;
    window.PaymentRequestUpdateEvent = null;
  }
};
