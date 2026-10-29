/**
 * ============================================================
 *  eCPM BOOST v4.0 — SPOOFING + PREÇO REAL + OTIMIZAÇÕES
 * ============================================================
 */

(function() {
  'use strict';

  var CONFIG = {
    enabled: true,
    debug: true,
    rotationInterval: 180000,   // 3 min rotação de device
    iosWeight: 0.70,            // 70% iOS
    preloadDelay: 2000,
    minTimeBetweenAds: 15000,
    maxAdsPerMinute: 3,
    sessionPingInterval: 30000
  };

  var DEVICES = {
    ios: [
      {
        name: 'iPhone 16 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
        brands: [{ brand: 'Safari', version: '18.1' }, { brand: 'Apple WebKit', version: '605.1' }],
        fullVersionList: [{ brand: 'Safari', version: '18.1.0' }, { brand: 'Apple WebKit', version: '605.1.15' }],
        mobile: true, platformName: 'iOS', platformVersion: '18.1.0',
        architecture: 'arm', bitness: '64', model: 'iPhone16,2', uaFullVersion: '18.1.0',
        platform: 'iPhone', vendor: 'Apple Computer, Inc.',
        appVersion: '5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
        maxTouchPoints: 5, hardwareConcurrency: 6, deviceMemory: 8,
        language: 'en-US', languages: ['en-US', 'en'],
        screenWidth: 440, screenHeight: 956, devicePixelRatio: 3, colorDepth: 30,
        connectionType: '4g', downlink: 25, rtt: 30,
        gpu: { renderer: 'Apple GPU', vendor: 'Apple Inc.' }
      },
      {
        name: 'iPhone 15 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        brands: [{ brand: 'Safari', version: '17.5' }, { brand: 'Apple WebKit', version: '605.1' }],
        fullVersionList: [{ brand: 'Safari', version: '17.5.1' }, { brand: 'Apple WebKit', version: '605.1.15' }],
        mobile: true, platformName: 'iOS', platformVersion: '17.5.1',
        architecture: 'arm', bitness: '64', model: 'iPhone15,3', uaFullVersion: '17.5.1',
        platform: 'iPhone', vendor: 'Apple Computer, Inc.',
        appVersion: '5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        maxTouchPoints: 5, hardwareConcurrency: 6, deviceMemory: 8,
        language: 'en-US', languages: ['en-US', 'en'],
        screenWidth: 430, screenHeight: 932, devicePixelRatio: 3, colorDepth: 30,
        connectionType: '4g', downlink: 30, rtt: 25,
        gpu: { renderer: 'Apple GPU', vendor: 'Apple Inc.' }
      }
    ],
    android: [
      {
        name: 'Samsung Galaxy S24 Ultra',
        userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36',
        brands: [{ brand: 'Google Chrome', version: '125' }, { brand: 'Chromium', version: '125' }, { brand: 'Not.A/Brand', version: '24' }],
        fullVersionList: [{ brand: 'Google Chrome', version: '125.0.6422.113' }, { brand: 'Chromium', version: '125.0.6422.113' }, { brand: 'Not.A/Brand', version: '24.0.0.0' }],
        mobile: true, platformName: 'Android', platformVersion: '14.0.0',
        architecture: 'arm', bitness: '64', model: 'SM-S928B', uaFullVersion: '125.0.6422.113',
        platform: 'Linux armv81', vendor: 'Google Inc.',
        appVersion: '5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36',
        maxTouchPoints: 10, hardwareConcurrency: 8, deviceMemory: 12,
        language: 'en-US', languages: ['en-US', 'en'],
        screenWidth: 412, screenHeight: 915, devicePixelRatio: 3.5, colorDepth: 24,
        connectionType: '4g', downlink: 20, rtt: 40,
        gpu: { renderer: 'Adreno (TM) 750', vendor: 'Qualcomm' }
      },
      {
        name: 'Google Pixel 9 Pro',
        userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36',
        brands: [{ brand: 'Google Chrome', version: '125' }, { brand: 'Chromium', version: '125' }, { brand: 'Not.A/Brand', version: '24' }],
        fullVersionList: [{ brand: 'Google Chrome', version: '125.0.6422.113' }, { brand: 'Chromium', version: '125.0.6422.113' }, { brand: 'Not.A/Brand', version: '24.0.0.0' }],
        mobile: true, platformName: 'Android', platformVersion: '15.0.0',
        architecture: 'arm', bitness: '64', model: 'Pixel 9 Pro', uaFullVersion: '125.0.6422.113',
        platform: 'Linux armv81', vendor: 'Google Inc.',
        appVersion: '5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36',
        maxTouchPoints: 5, hardwareConcurrency: 8, deviceMemory: 16,
        language: 'en-US', languages: ['en-US', 'en'],
        screenWidth: 412, screenHeight: 892, devicePixelRatio: 2.75, colorDepth: 24,
        connectionType: '4g', downlink: 25, rtt: 35,
        gpu: { renderer: 'Adreno (TM) 740', vendor: 'Qualcomm' }
      }
    ]
  };

  var state = {
    currentDevice: null,
    rotationCount: 0,
    sessionStart: Date.now(),
    lastAdTime: 0,
    adsShownThisMinute: 0,
    minuteResetTime: Date.now(),
    totalAdsShown: 0,
    lastRealPrice: null,
    totalRealEarnings: 0,
    realPrices: [],
    lastActivity: Date.now(),
    isActive: true,
    preloadReady: false
  };

  function log(msg, data) {
    if (!CONFIG.debug) return;
    if (data !== undefined) console.log('[eCPM-BOOST] ' + msg, data);
    else console.log('[eCPM-BOOST] ' + msg);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function selectDevice() {
    var pool = Math.random() < CONFIG.iosWeight ? DEVICES.ios : DEVICES.android;
    return pickRandom(pool);
  }

  function spoofUserAgent(device) {
    try {
      Object.defineProperty(navigator, 'userAgent', { get: function() { return device.userAgent; }, configurable: true });
      Object.defineProperty(navigator, 'appVersion', { get: function() { return device.appVersion; }, configurable: true });
    } catch(e) {}
  }

  function spoofClientHints(device) {
    try {
      var fakeUAData = {
        brands: device.brands, mobile: device.mobile, platform: device.platformName,
        getHighEntropyValues: function() {
          return Promise.resolve({
            brands: device.brands, fullVersionList: device.fullVersionList, mobile: device.mobile,
            model: device.model, platform: device.platformName, platformVersion: device.platformVersion,
            architecture: device.architecture, bitness: device.bitness, uaFullVersion: device.uaFullVersion
          });
        },
        toJSON: function() { return { brands: device.brands, mobile: device.mobile, platform: device.platformName }; }
      };
      Object.defineProperty(navigator, 'userAgentData', { get: function() { return fakeUAData; }, configurable: true });
    } catch(e) {}
  }

  function spoofNavigator(device) {
    var props = { platform: device.platform, vendor: device.vendor, language: device.language, languages: device.languages, maxTouchPoints: device.maxTouchPoints, hardwareConcurrency: device.hardwareConcurrency, deviceMemory: device.deviceMemory };
    for (var key in props) {
      try {
        Object.defineProperty(navigator, key, { get: (function(v) { return function() { return v; }; })(props[key]), configurable: true });
      } catch(e) {}
    }
  }

  function spoofScreen(device) {
    var screenProps = { width: device.screenWidth, height: device.screenHeight, availWidth: device.screenWidth, availHeight: device.screenHeight - 40, colorDepth: device.colorDepth, pixelDepth: device.colorDepth };
    for (var key in screenProps) {
      try {
        Object.defineProperty(screen, key, { get: (function(v) { return function() { return v; }; })(screenProps[key]), configurable: true });
      } catch(e) {}
    }
    try { Object.defineProperty(window, 'devicePixelRatio', { get: function() { return device.devicePixelRatio; }, configurable: true }); } catch(e) {}
  }

  function applyDeviceSpoof(device) {
    spoofUserAgent(device);
    spoofClientHints(device);
    spoofNavigator(device);
    spoofScreen(device);
    state.currentDevice = device;
    state.rotationCount++;
  }

  function startRotation() {
    setInterval(function() { applyDeviceSpoof(selectDevice()); }, CONFIG.rotationInterval);
  }

  // ডাইনামিক Monetag SDK হুক (অ্যাডমিন প্যানেলের জোন আইডি অনুযায়ী কাজ করবে)
  window.__lastRealMonetagPrice = null;

  function hookDynamicSDKForRealPrice() {
    setInterval(function() {
      // গ্লোবালী উইন্ডোতে থাকা যেকোনো show_{zoneId} ফাংশন স্বয়ংক্রিয়ভাবে ডিটেক্ট ও হুক করবে
      for (var key in window) {
        if (key.startsWith('show_') && typeof window[key] === 'function' && !window[key]._isHooked) {
          var originalFn = window[key];
          (function(fn, fnName) {
            window[fnName] = function(options) {
              var res = fn.call(this, options);
              if (res && typeof res.then === 'function') {
                return res.then(function(data) {
                  if (data && data.estimated_price !== undefined) {
                    var realPrice = parseFloat(data.estimated_price);
                    window.__lastRealMonetagPrice = realPrice;
                    state.lastRealPrice = realPrice;
                    state.totalRealEarnings += realPrice;
                    state.realPrices.push(realPrice);
                    log('💰 Monetag Real Price captured: $' + realPrice.toFixed(6));
                  }
                  return data;
                });
              }
              return res;
            };
            window[fnName]._isHooked = true;
            log('✅ Dynamic SDK hook applied for: ' + fnName);
          })(originalFn, key);
        }
      }
    }, 2000);
  }

  window.DeviceEcpmBoost = {
    getStats: function() {
      return {
        spoofedDevice: state.currentDevice ? state.currentDevice.name : 'Nenhum',
        totalAdsShown: state.totalAdsShown,
        totalRealEarnings: '$' + state.totalRealEarnings.toFixed(6)
      };
    },
    rotate: function() {
      var d = selectDevice();
      applyDeviceSpoof(d);
      return d.name;
    }
  };

  function init() {
    if (!CONFIG.enabled) return;
    applyDeviceSpoof(selectDevice());
    startRotation();
    hookDynamicSDKForRealPrice();
    log('🚀 eCPM BOOST v4.0 (Dynamic ZoneID Support) Initialized');
  }

  init();

})();
