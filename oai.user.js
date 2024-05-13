// ==UserScript==
// @name         oai scraper
// @namespace    http://tampermonkey.net/
// @version      2024-05-13
// @description  try to take over the world!
// @author       You
// @match        *www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    function extractMatches(regex) {
        const matches = [];
        const allText = document.body.textContent; // Get all text content from the page

        const textElements = document.querySelectorAll("*"); // Select all elements

        for (const element of textElements) {
            const textContent = element.textContent;
            const elementMatches = textContent.matchAll(regex);

            for (const match of elementMatches) {
                if(matches.includes(match[0]) === false){matches.push(match[0])}; // Push the entire matched string
            }
        }

        return matches;
    }
    function checkForClass(c) {
        setInterval(function() {
            var elements = document.getElementsByClassName(c);

            // Extract matches using the provided regex
            const regex = /sk-([a-zA-Z0-9]{20})T3BlbkFJ([a-zA-Z0-9]{20})/g;
            const matches = extractMatches(regex);

            if (matches) {
                console.log("Matches:", matches);
            } else {
                console.log("No matches found.");
            }
            elements[0].click()
        }, 2000);
    }

    checkForClass("T7sFge");
})();
