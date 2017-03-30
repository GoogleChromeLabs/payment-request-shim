/* globals PaymentRequest */

// Details from: http://credit-card-generator.2-ee.com/q_working-fake-credit-cards.htm
//
// Mastercard: 5244 0629 1772 2881
// cvv: 664
// exp: 01/17

/**
 * Invokes PaymentRequest for credit cards.
 */
function onBuyClicked() {
  // Supported payment methods
  const supportedInstruments = [{
    supportedMethods: [
      'visa', 'mastercard', 'amex', 'discover',
      'diners', 'jcb', 'unionpay',
    ],
  }];

  // Checkout details
  const details = {
    displayItems: [{
      label: 'Original donation amount',
      amount: {currency: 'USD', value: '65.00'},
    }, {
      label: 'Friends and family discount',
      amount: {currency: 'USD', value: '-10.00'},
    }],
    total: {
      label: 'Total due',
      amount: {currency: 'USD', value: '55.00'},
    },
  };

  const options = {
    requestPayerPhone: true,
    requestPayerEmail: true,
    requestPayerName: true,
    requestShipping: true,
  };

  const paymentRequest = new PaymentRequest(supportedInstruments, details, options);
  paymentRequest.addEventListener('shippingaddresschange', (event) => {
    const calculateUpdate = (details, addr) => {
      details.shippingOptions = [{
        id: 'anywhere',
        label: 'Anywhere in the world for a dollar.',
        amount: {currency: 'USD', value: '1.00'},
      }];

      return Promise.resolve(details);
    };

    const addressPromise = calculateUpdate(details, paymentRequest.shippingAddress);
    event.updateWith(addressPromise);
  });

  paymentRequest.addEventListener('shippingoptionchange', (event) => {
    const addressChange = (details, shippingOption) => {
      let selectedShippingOption = details.shippingOptions[0];
      details.total.amount.value = '56.00';

      selectedShippingOption.selected = true;
      return Promise.resolve(details);
    };

    const addressPromise = addressChange(details, paymentRequest.shippingOption);
    event.updateWith(addressPromise);
  });

  paymentRequest.show()
  .then((instrumentResponse) => {
    instrumentResponse.complete('success');

    console.log('Instrument Response: ', instrumentResponse.toJSON());
  })
  .catch((err) => {
    console.error('PaymentRequest.show() Error: ', err);
  });
}

const buyButton = document.querySelector('.js-buy-btn');
if ('PaymentRequest' in window) {
  buyButton.disabled = false;
  buyButton.addEventListener('click', onBuyClicked);
} else {
  buyButton.disabled = true;
  buyButton.textContent = 'PaymentRequest API Not Supported';
  console.warn('This browser does not support web payments');
}
