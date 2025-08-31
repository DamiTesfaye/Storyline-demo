// @ts-nocheck
// IMPORTANT - load up ensighten script tag in document head
// script(src='//nexus.ensighten.com/sbs/sbsprod/Bootstrap.js')

/* global digitalData */

window.digitalData = {
  events: [],
  page: {
    pageInfo: {
      pageID: "",
      language: "en",
      pageName: "Story Line: messages from a pandemic - The Feed - SBS",
      destinationURL: "https://www.sbs.com.au/storyline",
      referralURL: "",
      originalReferrerURL: "",
      previousPageURL: "",
      previousPageName: "",
      title: document.title,
      siteName: "Story Line: messages from a pandemic - The Feed - SBS",
      domain: "www.sbs.com.au",
      path: window.location.pathname,
      clickSource: "",
      campaign: {
        trackingCode: "",
        campaignType: "",
        channelSource: "",
      },
    },
    category: {
      primaryCategory: "interactive",
      siteSubSection1: "",
      siteSubSection2: "",
      siteSubSection3: "",
      siteSubSection4: "",
    },
    attributes: {
      content: {
        contentType: "Creative Content",
        publishedDate: "",
        updatedDate: "",
      },
      error: {
        errorPage: "",
        errorMessage: "",
      },
    },
  },
  user: {
    userInfo: {
      loggedIn: "",
      userID: "",
      syncUserID: [],
      loggedInVisit: "",
      loggedInType: "",
      userType: "",
      newsletterName: "",
    },
    userSegment: {
      cxenseSegmentIDs: "",
      adobeSegmentIDs: "",
      strategicSegmentIDs: "",
    },
  },
  environment: {
    browser: {
      userAgent: "",
      version: "",
    },
    platform: {
      deviceType: "",
      deviceName: "",
      sourceType: "web",
      osName: "",
    },
  },
};

//populate previousPageURL and previousPageName from sessionStorage when available
digitalData.page.pageInfo["previousPageURL"] =
  sessionStorage.getItem("pageURL") || "";
digitalData.page.pageInfo["previousPageName"] =
  sessionStorage.getItem("pageName") || "";

// add in the user agent string
if (digitalData.environment.browser !== undefined) {
  digitalData.environment.browser["userAgent"] = navigator.userAgent;
} else {
  digitalData.environment.browser = {};
  digitalData.environment.browser["userAgent"] = navigator.userAgent;
}

//save current page URL and name so we can use it in previous page properties if user clicks to another page
if (digitalData.page.pageInfo.hasOwnProperty("destinationURL")) {
  sessionStorage.setItem("pageURL", digitalData.page.pageInfo.destinationURL);
}
if (digitalData.page.pageInfo.hasOwnProperty("pageName")) {
  sessionStorage.setItem("pageName", digitalData.page.pageInfo.pageName);
}

//setting the referrer properties
if (
  document.referrer !== "" &&
  document.referrer.indexOf("sbs.com.au") === -1
) {
  digitalData.page.pageInfo["referralURL"] = document.referrer;

  if (localStorage.getItem("originalReferrerURL") === null) {
    localStorage.setItem("originalReferrerURL", document.referrer);
  }
}

digitalData.page.pageInfo["originalReferrerURL"] =
  localStorage.getItem("originalReferrerURL") || "";

var analytics = {
  initialised: false,
  init: function () {
    window.addEventListener("load", () => {
      (window.observerService = window.observerService || []).push([
        "notify",
        "pageLoadSuccess",
      ]);
      analytics.initialised = true;
    });
  },

  /*
  Custom User Interaction Events
  action - click/scrollDown etc
  siteName - football/theBoat etc
  interactionName - scrollChapter
  // Docs
  https://docs.google.com/spreadsheets/d/1h79JNky6wGRn3d-8Iqq9Qvhh_2rL0l3HO7KgHn9OTXY/edit#gid=221055457
  */

  trackRoute: function (route) {
    route = route.replace(/^\//g, ""); // remove proceeding slash
    route = route.replace(/\/$/g, ""); // remove tailing slash
    analytics.trackUserInteraction(
      "route",
      "route:" + route.split("/").join(":")
    );
    // console.log("analytics route", route);
    // (window.observerService = window.observerService || []).push([
    //   "notify",
    //   "fireEvent",
    //   {
    //     event: "userInteraction",
    //     eventAttribute: {
    //       action : "click",
    //       siteName:"football",
    //       interactionName : "click",
    //       additionalInfo: {
    //         page: {
    //           pageID: "",
    //           language: "en",
    //           pageName: "Story Line: Six Months of COVID-19 - The Feed - SBS",
    //           destinationURL: `https://www.sbs.com.au/storyline/${route}`,
    //           referralURL: "",
    //           originalReferrerURL: "",
    //           previousPageURL: "",
    //           previousPageName: "",
    //           title: document.title,
    //           siteName: "Story Line: Six Months of COVID-19 - The Feed - SBS",
    //           domain: "www.sbs.com.au",
    //           path: window.location.pathname,
    //           clickSource: "",
    //         }
    //       }
    //     }
    //   }
    // ]);
  },
};

export default analytics;
