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
 * This intervention adds canMakePayment to the PaymentRequest prototype on
 * Microsoft Edge 40.15063.0.0.
 * The canMakePayment polyfill returns true if the logged in user has a card on
 * file that is supported by Microsoft wallet; otherwise, returns false.
 * Note: The payment instruments the user has on file are not mediated against
 * the supported networks listed in the PaymentRequest methodData since this
 * field is internal.
 */

'use strict';

const baseUrl = 'https://wallet.microsoft.com';
const canMakePaymentUrl = `${baseUrl}/preview/canMakePayment`;
const timeoutInMs = 30000;

/**
 * Ensure the document is ready.
 * @return {Promise}
 */
function ready() {
    return new Promise((resolve, reject) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

/**
 * Create a promise that rejects in <ms> milliseconds.
 * @param {number}  ms - timeout in milliseconds.
 * @return {Promise}
 */
function timeout(ms) {
    return new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject(`canMakePayment timed out in ${ms} ms.`);
        }, ms);
    });
}

/**
 * The canMakePayment function returns true if the logged in user has a card on
 * file that is supported by Microsoft wallet; otherwise, returns false.
 * @return {Promise}
 */
function canMakePayment() {
    return new Promise((resolve, reject) => {
        const body = document.body;
        const iframe = document.createElement('iframe');
        iframe.id = 'edge-canMakePayment-iframe';
        iframe.src = canMakePaymentUrl;
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';

        const messageHandler = (event) => {
            if (event.origin !== baseUrl ||
                event.data.canMakePayment === undefined) {
                return;
            }

            window.removeEventListener('message', messageHandler);
            body.removeChild(iframe);
            const result = event.data.canMakePayment;
            resolve(result);
        };

        const errorHandler = () => {
            // Failed to load the canMakePayment iframe.
            window.removeEventListener('message', messageHandler);
            body.removeChild(iframe);
            resolve(false);
        };

        window.addEventListener('message', messageHandler);
        iframe.onerror = errorHandler;
        body.appendChild(iframe);
    });
}

/**
 * The canMakePayment polyfill returns true if the logged in user has a card on
 * file that is supported by Microsoft wallet; otherwise, returns false.
 * Rejects if the canMakePayment promise is not resolved in the alloted timeout.
 * @return {Promise}
 */
function canMakePaymentPolyfill() {
    return ready()
        .then(() => {
            return Promise.race([canMakePayment(), timeout(timeoutInMs)]);
        });
}

module.exports = (window, navigator) => {
    if (!window.PaymentRequest) {
        return;
    }

    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Edge/') < 0) {
        return;
    }

    if ('canMakePayment' in window.PaymentRequest.prototype) {
        return;
    }

    window.PaymentRequest.prototype.canMakePayment = canMakePaymentPolyfill;
};
