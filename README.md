## Video getRtcStats Sample App

This is a simple application that demonstrates how to get some webRTC details such as the protocol being used for media traffic, the upload and download bandwidth as well as the simulcast layers with some important values for every layer (rtt, jitter, packet lost). It also provides statistics for the subscribed stream (it currently supports up to one subscriber). It leverages the [getRtcStatsReport API](https://tokbox.com/developer/sdks/js/reference/Publisher.html#getRtcStatsReport) from Vonage which is a wrapper around the [native API](https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport)

## Requirements

Node JS version 16

## How to run the app

1. Populate `config.js` with test credentials
2. Run `npm install`
3. Run `npm start`
4. Join in two different tabs to see statistics.
