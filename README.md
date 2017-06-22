[![Travis Build Status](https://travis-ci.org/GoogleChrome/payment-request-shim.svg?branch=master)](https://travis-ci.org/GoogleChrome/payment-request-shim) [![Dependency Status](https://david-dm.org/googlechrome/payment-request-shim.svg)](https://david-dm.org/googlechrome/payment-request-shim) [![devDependency Status](https://david-dm.org/googlechrome/payment-request-shim/dev-status.svg)](https://david-dm.org/googlechrome/payment-request-shim#info=devDependencies)

# Payment Request Shim

This shim is designed to mitigate the pains of keeping up to date with the living standard for the Payment Request API.

> This is intended to be used via a CDN and **NOT** used directly.

The goal will be to keep your code working for at least 2 major Chrome releases.

For more details on the Payment Request API itself, please [see this guide](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/).

## Usage

To make use of the shim, simply add this script tag to your page *before* making use of the Payment Request API.

    <script src="https://storage.googleapis.com/prshim/v1/payment-shim.js">

## Current Interventions

- Android WebView exposed the Payment Request API [by mistake](https://bugs.chromium.org/p/chromium/issues/detail?id=667069). The shim sets the API to null when this occurs.
- Chrome for iOS exposed the Payment Request API [by mistake](https://bugs.chromium.org/p/chromium/issues/detail?id=734586). The shim sets the API to null when this occurs.

## License

Copyright 2016 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
