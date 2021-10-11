## Video getRtcStats Sample App

This is a simple application that demonstrates how to get some webRTC details such as the protocol being used for media traffic, the IP of the Media or TURN server in use or the srtp cipher. It leverages the [getRtcStatsReport API](https://tokbox.com/developer/sdks/js/reference/Publisher.html#getRtcStatsReport) from Vonage which is a wrapper around the [native API](https://developer.mozilla.org/en-US/docs/Web/API/RTCStatsReport)

Disclaimer: Note that some details such as the VPN flag (whether you are behind a VPN) are provided by the browser, not by Vonage APIs and according to the [API reference](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidateStats/networkType#browser_compatibility), this may be deprecated in the future
