/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/assets/css/0.4dfeea563f06a4c3d67a.css","6e51ed8de12dca5249715d59e5a92f85"],["/assets/css/1.bc48eb2874e981e7c99a.css","9ecb658c49a04025afcfb50393b5b46d"],["/assets/css/7.952e09cf1dba2c1dd2a3.css","669be53d5d26ce79d482c380efd5df40"],["/assets/favicon.ico","772a3ac7d1bb1c2da386b93f4d520707"],["/assets/js/403.4359215cf0e33ed28c31.js","a7c4c863a08048fc8eae36f6b79c793c"],["/assets/js/403.4359215cf0e33ed28c31.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/404.e4776c59b26008fea97a.js","80d86d5cd961759ad376d5fa3693e2d9"],["/assets/js/404.e4776c59b26008fea97a.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/500.ac6a0b3aa7deb1e6fff9.js","e1ae58911f0dec49325d1f35203c72ea"],["/assets/js/500.ac6a0b3aa7deb1e6fff9.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/app.be7624084d60c12abc0c.js","6f5730232b75933ed656269a90a5d688"],["/assets/js/app.be7624084d60c12abc0c.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/chunk-common.10283b8c555cfd4c7d48.js","2cde4a61343127ba3581532680f3dfc9"],["/assets/js/chunk-common.10283b8c555cfd4c7d48.js.LICENSE","e83c29577e1b9b7ec6cdbec46ad63346"],["/assets/js/chunk-common.10283b8c555cfd4c7d48.js.gz","bfc0076fca02ac185852421a63e8d73a"],["/assets/js/commonStyle.329d6a540ccdf2e5bce5.js","831f43de956c12584d899c08124e7069"],["/assets/js/commonStyle.329d6a540ccdf2e5bce5.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/index.206e2242acfb343c7fd1.js","5b45df173f7d833a2357374a66ebe7de"],["/assets/js/index.206e2242acfb343c7fd1.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/lang-en-us.b0814219a1f456be2268.js","19746d409b17b9fbbff13b5f90dad7bf"],["/assets/js/lang-en-us.b0814219a1f456be2268.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/manifest.bdfb267fc6471293c7fa.js","211105cc3ca9cb48a7aae116e55dcbd4"],["/assets/js/manifest.bdfb267fc6471293c7fa.js.LICENSE","ef70708fbf3379fc9443273c5f7f82cf"],["/assets/js/vendors~index.84e8486b3a4b9b6b5379.js","bb4c7c4925883c94ffdd97476a773cfb"],["/assets/js/vendors~index.84e8486b3a4b9b6b5379.js.LICENSE","0289676307ef28e842deb4d88d7a5731"],["/assets/js/vendors~index.84e8486b3a4b9b6b5379.js.gz","9e3ee4b541f01bb651b0f3061860c589"],["/assets/js/vueBase.4fde12c336278006cb2d.js","e96808dbd03be7831f4fb23ee5a6a0cb"],["/assets/js/vueBase.4fde12c336278006cb2d.js.LICENSE","6cabf3e53f6f1ec2607dcfe91ced5c72"],["/assets/js/vueBase.4fde12c336278006cb2d.js.gz","d8f712aac87a1743800f8376da90d063"]];
var cacheName = 'sw-precache-v3-sako-vue-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, /\.\w{8}\./);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted(["^(?!\\/__).*"], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







