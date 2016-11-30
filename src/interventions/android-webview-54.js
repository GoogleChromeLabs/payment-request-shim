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
 * This intervention handles the scenario where the WebView was exposing
 * the `PaymentRequest` API on the window, even though it was implemented
 * / supported.
 *
 * https://bugs.chromium.org/p/chromium/issues/detail?id=667069
 *
 * FIX
 *
 * This code checks the UserAgent to see if the current environment is a
 * WebView and if it is deletes the `PaymentRequest` API from the `window`.
 *
 * The regex essentially looks for '; wv)' somewhere inside of two brackets
 * and then matchings against 'Chrome/54.'.
 */

module.exports = (window, navigator) => {
  if (!window.PaymentRequest) {
    return;
  }

  const userAgent = navigator.userAgent;
  const regexCheck = /.*\(.*; wv\).*Chrome\/54\.\d.*/g;

  const regexResult = regexCheck.exec(userAgent);
  if (regexResult !== null) {
    window.PaymentRequest = null;
  }
};
