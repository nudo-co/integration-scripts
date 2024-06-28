function processUTM(){
    let url = new URL(window.location.href);

    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');

    let leadSource;
    let actionPoint;
    let campaign;
    let isPaidLead;

    if(utmCampaign){
        isPaidLead = true;
        campaign = utmCampaign;
    }

    if(utmMedium === 'ig'){
        leadSource = isPaidLead ? 'Instagram - Paid' : 'Instagram - Organic'
    }

    if(url.hostname === 'nudo.com.au'){
        actionPoint = 'Nudo Website';
    }else if(url.pathname.includes("contact")){
        // Venue website - we don't need the parth
        actionPoint = url.hostname;
    }else{
        actionPoint = `${url.hostname}${url.pathname}`;
    }

    return {
        utmCampaign: campaign,
        utmSource: leadSource,
        utmActionPoint: actionPoint,
   }
}

function initiateCalendly(calendarURL, embedDivId){
    Calendly.initInlineWidget({
        url: calendarURL,
        parentElement: document.getElementById(embedDivId),
        prefill: {},
        utm: processUTM()
    });
}

