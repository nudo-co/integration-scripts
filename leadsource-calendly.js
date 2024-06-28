function processUTM(){
    let url = new URL(window.location.href);

    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');
    const fbClickID = url.searchParams.get('fbclid');
    const googleClickID = url.searchParams.get('gclid');
    const gAdSource = url.searchParams.get('gad_source');

    let leadSource;
    let actionPoint;
    let campaign;
    let isPaidLead;

    if(utmCampaign){
        isPaidLead = true;
        campaign = utmCampaign;
    }

    if(!utmMedium){
        if(fbClickID){
            leadSource = 'Facebook Organic';
        }else if(googleClickID){
            leadSource = 'Google Search Organic';
        }else{
            leadSource = 'Direct URL';
        }
    }else if(utmMedium === 'ig'){
        leadSource = isPaidLead ? 'Instagram Paid' : 'Instagram Organic'
    }else if(utmMedium === 'fb'){
        leadSource = isPaidLead ? 'Facebook Paid' : 'Facebook Organic'
    }else if(utmSource === 'googleads' && utmMedium === 'cpc'){
        leadSource = 'Google Search Paid';
    }
    
    if(gAdSource){
        isPaidLead = true;
        leadSource = 'Google Search Paid';
    }

    if(url.hostname === 'nudo.com.au'){
        actionPoint = 'Nudo Website';
    }else if(url.pathname.includes("contact")){
        // Venue website - we don't need the parth
        actionPoint = url.hostname;
    }else{
        actionPoint = `${url.hostname}${url.pathname}`;
    }

    const utm = {
        utmCampaign: campaign,
        utmSource: leadSource,
        utmContent: actionPoint
    }

    console.log("Deubg:", utm);

    return utm;
}

function initiateCalendly(calendarURL, embedDivId){
    Calendly.initInlineWidget({
        url: calendarURL,
        parentElement: document.getElementById(embedDivId),
        prefill: {},
        utm: processUTM()
    });
}

