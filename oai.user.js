// ==UserScript==
// @name         oai scraper with base64 encoding and automatic navigation
// @namespace    http://tampermonkey.net/
// @version      2024-05-13
// @description  Scrape OAI keys, encode to base64, append to URL, and automatically navigate to next page
// @author       You
// @match        *www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let matches = [];

    function extractMatches(regex) {
        const textElements = document.querySelectorAll("*");

        for (const element of textElements) {
            const textContent = element.textContent;
            const elementMatches = textContent.matchAll(regex);

            for (const match of elementMatches) {
                if(!matches.includes(match[0])) {
                    matches.push(match[0]);
                }
            }
        }
    }

    function getNextPageUrl() {
        const nextPageLink = document.getElementById('pnnext');
        if (nextPageLink) {
            return nextPageLink.getAttribute('href');
        }
        return null;
    }

    function encodeKeysToBase64(keys) {
        return btoa(encodeURIComponent(keys.join(',')));
    }

    function decodeKeysFromBase64(encodedKeys) {
        return decodeURIComponent(atob(encodedKeys)).split(',');
    }

    function appendKeysToURL(url) {
        const encodedKeys = encodeKeysToBase64(matches);
        return url + (url.includes('?') ? '&' : '?') + 'apikeys=' + encodedKeys;
    }

    function scrapeAndNavigate() {
        // Extract matches using the provided regex
        extractMatches(/sk-([a-zA-Z0-9]{20})T3BlbkFJ([a-zA-Z0-9]{20})/g);
        extractMatches(/sk-proj-([a-zA-Z0-9]{20})T3BlbkFJ([a-zA-Z0-9]{20})/g);

        // Format the matches array as "key" , "key" , "key"
        const formattedKeys = matches.map(key => `"${key}"`).join(', ');

        console.log('Scraped matches:', formattedKeys);

        // Get the next page URL
        let nextUrl = getNextPageUrl();
        if (nextUrl) {
            // Append keys to the next page URL
            nextUrl = appendKeysToURL(nextUrl);

            console.log('Navigating to:', nextUrl);

            // Navigate to the next page
            window.location.href = nextUrl;
        } else {
            console.log('No next page found. Scraping complete.');
        }
    }

    function initializeScraper() {
        // If there are existing keys in the URL, decode them and add to matches
        const urlParams = new URLSearchParams(window.location.search);
        const existingEncodedKeys = urlParams.get('apikeys');
        if (existingEncodedKeys) {
            try {
                matches = decodeKeysFromBase64(existingEncodedKeys);
                console.log('Existing keys found and decoded:', matches);
            } catch (error) {
                console.error('Error decoding existing keys:', error);
            }
        }

        // Wait for the page to load completely
        if (document.readyState === 'complete') {
            scrapeAndNavigate();
        } else {
            window.addEventListener('load', scrapeAndNavigate);
        }
    }

    // Start the scraping process
    initializeScraper();
})();
