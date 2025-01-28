let inputData = {
  // contactAttributionUTMSource: "paid_social",
  // contactAttributionSourceReferrer: "http://m.facebook.com",
  // contactAttributionSourceCampaign: "NUDO BR TOF Leads - Website NEW",
  contactAttributionSourceURL:
    "https://www.eventsbynudo.com.au/landing-page-page730496?utm_source=paid_social&utm_medium=fb&utm_campaign=NUDO+BR+TOF+Leads+-+Website+NEW&utm_content=TWM+LP+|+Colourful+Image+|+Personalised&fbclid=IwAR17oP4oLoSvR_DZJatLa_eushFMVlPCMQ_K_RKV9JLqo-UBcKN3U0_KPe4_aem_ASfQN-wfa6IPYIEnQY7Zk8wX8wpZWCIVu7RuZ57w_OgRAbwtMx78_yu1fLs459yS3zNe-zC2Ep6o0EX_U3fL7Yep#section-zggJWREjTP",

  lastAttributionUTMSource: "paid_social_website",
  // lastAttributionSourceReferrer: "http://m.facebook.com",
  lastAttributionSourceCampaign: "TTM x IMMERSO BR TOF Leads - Website",
  lastAttributionSourceURL:
    "https://eventsbynudo.com.au/nudo-mof-landing-page?utm_source=googleads&utm_source=adwords&utm_medium=cpc&utm_medium={adname}&utm_campaign=PMAX&utm_campaign={campaignname}&utm_term={keyword&utm_content={adgroupname}&utm_keyword=&utm_matchtype=&campaign_id=21106583272&ad_group_id=&ad_id=&gad_source=5&gclid=EAIaIQobChMIpIPqsKeWiAMVsahmAh0uvCxOEAEYASAAEgJFjvD_BwE",
  attributionSourceURL: "",
  attributionUTMSource: "",
  attributionSourceReferrer: "",
  attributionSourceCampaign: "",

  // facebookID: "tests",
  // sourceCampaign: "testes"
}
let sourceRef
let sourceURL
let sourceCampaign
let utmSource

if (inputData.lastAttributionSourceReferrer) {
  sourceRef = inputData.lastAttributionSourceReferrer
} else if (inputData.attributionSourceReferrer) {
  sourceRef = inputData.attributionSourceReferrer
} else {
  sourceRef = inputData.contactAttributionSourceReferrer
}

if (inputData.lastAttributionSourceURL) {
  sourceURL = inputData.lastAttributionSourceURL
} else if (inputData.attributionSourceURL) {
  sourceURL = inputData.attributionSourceURL
} else {
  sourceURL = inputData.contactAttributionSourceURL
}

if (inputData.lastAttributionSourceCampaign) {
  sourceCampaign = inputData.lastAttributionSourceCampaign
} else if (inputData.attributionSourceCampaign) {
  sourceCampaign = inputData.attributionSourceCampaign
} else {
  sourceCampaign = inputData.contactAttributionSourceCampaign
}

if (inputData.lastAttributionUTMSource) {
  utmSource = inputData.lastAttributionUTMSource
} else if (inputData.attributionUTMSource) {
  utmSource = inputData.attributionUTMSource
} else {
  utmSource = inputData.contactAttributionUTMSource
}

if (sourceURL && sourceURL.includes("services.leadconnectorhq.com")) {
  sourceURL = inputData.contactAttributionSourceURL
}

// Define outputs
let isPaidLead = false
let leadCampaign = null
let leadSource = null
let leadAction = null

function getSourceAndAction(referrer, sourceUrl, isPaid) {
  let source
  let actionPoint
  let url

  try {
    url = new URL(sourceUrl)
    // Continue processing with the valid URL here
  } catch {
    return {
      source: "Direct URL",
      actionPoint: null,
    }
  }

  const utmMedium = url.searchParams.get("utm_medium")
  const utmSource = url.searchParams.get("utm_source")

  if (utmMedium) {
    // First processing preference is directly taking from the URL

    if (utmMedium === "fb") {
      source = `Facebook ${isPaid ? "Paid" : "Organic"}`
    } else if (utmMedium === "ig") {
      source = `Instagram ${isPaid ? "Paid" : "Organic"}`
    } else if (utmMedium === "cpc" || (utmSource && utmSource === "adwords")) {
      source = `Google Search Paid`
    } else if (utmMedium === "pinterest") {
      source = `Pinterest ${isPaid ? "Paid" : "Organic"}`
    }
  }

  if (!utmMedium || !source) {
    if (!referrer) {
      source = "Direct URL"
    } else if (referrer.includes("facebook") || referrer.includes("fb")) {
      source = `Facebook ${isPaid ? "Paid" : "Organic"}`
    } else if (referrer.includes("instagram")) {
      source = `Instagram ${isPaid ? "Paid" : "Organic"}`
    } else if (referrer.includes("google")) {
      source = `Google Search ${isPaid ? "Paid" : "Organic"}`
    } else {
      source = "Direct URL"
    }
  }

  if (url.hostname === "nudo.com.au") {
    actionPoint = "Nudo Website"
  } else if (url.pathname.includes("contact")) {
    // Venue website - we don't need the path
    actionPoint = url.hostname
  } else {
    actionPoint = `${url.hostname}${url.pathname}`
  }

  return {
    source,
    actionPoint,
  }
}

// First check if this is a paid lead
// Has to come from a campaign or has "paid" inside the UTM source
if (sourceCampaign || (utmSource && utmSource.toLowerCase().includes("paid"))) {
  isPaidLead = true
  leadCampaign = sourceCampaign

  const sourceAndAction = getSourceAndAction(sourceRef, sourceURL, true)
  leadSource = sourceAndAction.source
  leadAction = sourceAndAction.actionPoint
} else {
  if (inputData.facebookID) {
    // Special case for instant forms
    isPaidLead = true
    leadCampaign = inputData.sourceCampaign
    leadSource = "Facebook Paid (Instant form)"
    leadAction = "Instant form"
  } else {
    // This has to be organic
    const sourceAndAction = getSourceAndAction(sourceRef, sourceURL, false)
    leadSource = sourceAndAction.source
    leadAction = sourceAndAction.actionPoint
  }
}

output = {
  isPaidLead,
  leadCampaign,
  leadSource,
  leadAction,
}

console.log(output)
