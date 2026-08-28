import type { OfficeConfig } from '@/types';

// World Relief U.S. office configs. Voice/audience fields are VERBATIM from each
// director's questionnaire (Microsoft Forms export, 2026). Operational fields
// (director title/phone, givingUrl, signatureBlock) were NOT in the questionnaire
// and are left blank until World Relief supplies them — the app flags rather than
// invents them. givingUrl '' disables the giving-link swap for that office.

export const offices: OfficeConfig[] = [
  {
    id: "western-washington",
    name: "World Relief Western Washington",
    director: {
      name: "Medard Ngueita",
      title: "Executive Director",
      email: "MNgueita@wr.org",
      phone: "206.446.8769",
    },
    givingUrl: "https://give.worldrelief.org/site/Donation2?df_id=3220&3220.donation=form1&mfc_pref=T",
    signatureBlock: "Medard Ngueita\nExecutive Director\nWorld Relief Western Washington\n206.446.8769 | MNgueita@wr.org",
    audienceReligious: "Our audience is highly mixed.",
    audiencePolitical: "Overall, our area is progressive and leans strongly liberal. However, the Whatcom area leans more conservative than the other two offices. Because of the contentious nature between the two main political parties and because a certain “flavor” of Christianity is seen as a common trait of ultra conservatives, Christians/Christianity is sometimes regarded negatively by many our area.",
    politicalPhrasesToAvoid: "We avoid partisan language, especially language that solely blames a political party for a certain action or situation. Medard very clearly calls out injustices and myths about immigrants but is careful.",
    preferredBiblicalPhrases: "Medard always gives thanks to God for the blessings that we have and using those blessings to help others. He is always sure to reference Scripture as a grounding for the ideas he presents.",
    preferredBibleVerses: "Micah 6:8\n\nMatthew 25:35\n\nEcclesiastes 4:9-10\n\nPhilippians 2: 3-4\n\nLuke 5",
    faithPhrasesToAvoid: "We avoid blaming a particular denomination or group for a situation.",
    programming: "Resettlement; Extended Case Management; Immigration Legal Services; Children & Family Services; ESL Services; Employment Services; Resiliency Services – community garden, environmental education, commercial & teaching kitchen; Detention Center Ministry",
    distinctive: "WRWW’s holistic approach to caring for refugees and immigrants sets our work apart, providing not only practical care, but also meeting the emotional and spiritual needs of our participants. Our partnership with the church is also distinctive in this area, as most other organizations in the region are either non-religious or intentionally multi-religious. We also believe in diversity and representation of those we serve and who is on staff, as a foundation for community trust.",
    accomplishments: "We are proud of the resiliency of our staff throughout these heavy, discouraging, and contentious times. Even with a large layoff last year and the restructuring of our office/business model to move away from mostly resettlement to focusing on other areas, the staff has remained steadfast and has continued to provide excellent care to our participants.\n\nWe are also proud of the incredible ways in which we have been able to increase our donor base and appeal to our existing donors, which has allowed us to quickly expand our team, especially ILS, to meet the increasing needs of the immigrants in our area.",
    sentenceStyle: "Medard generally is more narrative, but he uses shorter sentences to emphasize a particular point. This contrast makes the shorter sentence more impactful.",
    celebrationTone: "Medard begins by praising God for his gracious provision. He also is careful to recognize the staff and volunteers that help make success possible. His tone is enthusiastic, gracious, humble, and thankful.",
    crisisTone: "Medard uses a serious tone, but he always leans into the faith that God will provide, the hope that God will do more than we can ever imagine, and the call to discern how God wants us to act/respond to the crisis.",
    financialAskStyle: "Medard creates a compelling vision of what God is calling us into and then invites people into action. EX: “Let us continue to be the kind of people who don’t just witness suffering—but respond. Who don’t just admire resilience—but invest in it.”\n\nHe also emphasizes giving as a partnership in the work that we are doing rather than “charity.”\n\nMedard provides specific metrics to show what we’ve been able to do, what we hope to do in the future, and what we can do with a certain amount raised.",
    personalAnecdotes: "Medard often speaks of some of his own personal experiences, including growing up in hardship in Chad, arriving in the U.S. with his wife as an asylum seeker, and the help that World Relief provided after they arrived. He also speaks of his work at World Relief prior to becoming the Executive Director.",
    outOfCharacterTone: "A tone of anger, frustration, or feeling overwhelmed would feel uncharacteristic. It would also feel odd if he was too serious or too silly – any extreme would be uncharacteristic.",
    active: true,
  },
  {
    id: "chicagoland",
    name: "World Relief Chicagoland",
    director: {
      name: "Susan Sperry",
      title: "Executive Director",
      email: "ssperry@wr.org",
      phone: "630-580-5101",
    },
    givingUrl: "https://give.worldrelief.org/site/Donation2?2226.donation=form1&df_id=2226&mfc_pref=T",
    signatureBlock: "Serving with you,\n\nSusan Sperry\nExecutive Director\nWorld Relief Chicagoland",
    audienceReligious: "Wide continuum, including evangelical churches, mainline churches, Catholic. We tend to be \"religiously central\" in what we write, and only somewhat faith forward (we think about 1-2 mentions of faith in each newsletter, not overly preachy)",
    audiencePolitical: "A wide continuum, but mostly center-left and center-right (moderate)",
    politicalPhrasesToAvoid: "•\toverly patriotic language\n–\texample: American dream, “our great country”\n•\tphrases that would make a former client feel uncomfortable if they read it\n–\texample: immigrants come with so many needs, and you can help them get on their feet\n•\tlanguage with politically charged/partisan overtones\n–\t”unwelcoming policies” is generally better than “harsh” or “dehumanizing policies\n–\tsoften “Food Stamps” to “Food aid” or “Food support”\n\n\nThis isn't asked, but here is some “this, not that” phrase guidance:\n•\tpartners, rather than donors\n•\tfamilies or people, rather than clients\n•\twalk with, rather than serve, support, help",
    preferredBiblicalPhrases: "-\tJustice oriented\n-\tHope\n-\tWelcome\n-\tStability\n-\tPartnership\n-\tHope\n-\tCommunity\n-\tFaithfulness\n-\tTogether\n-\tHuman dignity\n-\tGod's image\n-\tChurches responding\n•\tglimpse of Heaven\n•\tfriendship\n•\tawe and gratitude\n•\thuman beings created in God's image\n•\theartbreaking\n•\tboldly welcome\n•\tremain in peace\n•\tmoments of connection\n•\tpursue their calling\n•\tsteady belief",
    preferredBibleVerses: "-\tIsaiah 58\n-\tMicah 6:8\n-\tMatthew 25",
    faithPhrasesToAvoid: "- Blessing\n- being saved\n- overly \"insider\" language - - avoid language that assumes a common \"insider\" Christianity, and if I do need to use a word or phrase or concept that does, explain it. I want to be welcoming in tone and invite people who don't believe in Jesus to feel comfortable and welcome reading",
    programming: "- Immigration legal services, Adult Education (many incredible classes, including entrepreneurship, sewing for work, and foundations of literacy), initial resettlement, case management, workforce development (career pathways), children & youth programs (after school programming, summer clubs, case management), counseling center (individual therapy, group programming, equestrian-based therapy), volunteer engagement, church engagement\n- We can send a broader service overview separately, and in particular can send over specific program emphasis for FY27",
    distinctive: "-\tA whole-person approach to each of our program areas\n-\tAn emphasis on education and empowerment throughout all of our service delivery; we want each person we serve to know how to meet their needs and have access to resources, tools, and people in the future\n-\tOur work with the church and overall community engagement\n-\tTrying to move people who are undecided/ on fence about immigrants into a position of support – particularly people in the church",
    accomplishments: "-\tStrong in crisis response… responded to Afghan Evacuation by submitting lists of people who needed evacuation to Senators, and resettling people quickly through OAW. Mobilized around southern border arrival response, and Ukrainian arrivals\n-\tExcellent, state-recognized English language program\n-\tStrong legal support… growing this team\n- MORE TO COME!",
    sentenceStyle: "- Naturally uses longer sentences, but edits down to be shorter. Somewhat indirect in communication (usually review to strengthen to a more direct tone)",
    celebrationTone: "-\tWarm, always focused on the people who made success possible especially our clients -\tPastoral without sounding preachy  -\tHopeful while acknowledging difficult realities  -\tCommunity-oriented  -\tDeeply relational",
    crisisTone: "-\tSharing facts, not dramatizing, pointing people to what we can do to engage with it -\tCalm rather than alarmist  -\tFocused on dignity rather than pity",
    financialAskStyle: "- Tie financial support to specific mission and impact. If a story was told, tie the request to the story \"your gift will support families like X\"\n- Bold, not begging\n- Invitational, not coercive or manipulative",
    personalAnecdotes: "-\tAnything that has been seen/ done recently to experience our work\n-\tStories about personal interests/ hobbies\n-\tStories about background with WR\n-\tVery limited stories about family (only with permission)",
    outOfCharacterTone: "-\tBragging, disconnected from current events  -\tDistant from the people we serve -\tOverly formal  -\tBig words",
    active: true,
  },
  {
    id: "california",
    name: "World Relief California",
    director: {
      name: "Mark Dandeneau",
      title: "Regional Director",
      email: "MDandeneau@wr.org",
      phone: "",
    },
    // California is a region with 3 sub-sites; the user picks which giving link to swap in
    // per generation. Default is Sacramento — WR plans to consolidate all CA giving to it next FY.
    givingUrl: "https://give.worldrelief.org/site/Donation2?2024.donation=form1&df_id=2024&mfc_pref=T&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fwww.google.com%2F",
    givingUrlOptions: [
      { label: "Sacramento", url: "https://give.worldrelief.org/site/Donation2?2024.donation=form1&df_id=2024&mfc_pref=T&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fwww.google.com%2F" },
      { label: "Modesto", url: "https://give.worldrelief.org/site/Donation2?df_id=1984&mfc_pref=T&1984.donation=form1&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fwww.google.com%2F" },
      { label: "SoCal", url: "https://give.worldrelief.org/site/Donation2?df_id=1981&mfc_pref=T&1981.donation=form1&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fwww.google.com%2F" },
    ],
    signatureBlock: "Mark Dandeneau, MSW\nRegional Director\nWorld Relief California",
    audienceReligious: "Our donors and partners come from diverse religious backgrounds. In Sacramento and San Diego, they often lean ecumenical, focusing on social justice and systemic support. Modesto draws heavily from traditional, evangelical roots centered on personal charity and stewardship. Garden Grove connects diverse immigrant congregations, including Hispanic and Vietnamese churches, with local suburban parishes, all joined in a shared commitment to welcome those in need.",
    audiencePolitical: "Political views vary across our four regions. Sacramento and San Diego generally hold more progressive perspectives focused on advocacy and human dignity. Modesto is a more conservative community that values personal responsibility and local stewardship. Garden Grove is quite moderate, where different cultural backgrounds shape a practical, family-first approach. We find common ground by focusing entirely on our shared responsibility to care for our neighbors.",
    politicalPhrasesToAvoid: "We avoid partisan political jargon, policy debates, and divisive terms like \"open borders\" or \"illegal aliens.\" Instead, we frame our conversations around human dignity and practical community support. By focusing on the value of every individual rather than ideological talking points, we build unity and invite all people of goodwill to join us in helping newcomers settle safely.",
    preferredBiblicalPhrases: "I prefer using phrases like \"welcome the stranger,\" \"walk alongside those who are vulnerable,\" and \"love our neighbors as ourselves.\" These terms emphasize inclusion and shared accompaniment. They represent an invitation to practice practical hospitality and extend love to every person, recognizing that everyone we serve has inherent value and deserves our respect.",
    preferredBibleVerses: "I anchor our mission in Matthew 25:35, \"I was a stranger and you welcomed me,\" which highlights our duty to help newcomers. I also rely on Luke 10:27, the command to \"love your neighbor as yourself,\" and Leviticus 19:34, which reminds us to treat foreigners as our own citizens, recognizing our shared human journey.",
    faithPhrasesToAvoid: "I avoid rigid, exclusionary, or transactional religious language, such as \"saving the lost\" or phrases that create an \"us versus them\" mentality. Service should never feel conditional or coercive. Since our faith is expressed through walking humbly with people, we avoid any tone that makes our help seem like a transaction rather than an act of love.",
    programming: "We provide trauma informed and holistic wraparound care through immigration legal services, comprehensive case management—including CalAIM health coordination—and employment assistance. Our educational services include ESL, women's empowerment, cultural orientation, and driving preparation, alongside youth and teen programming. Beyond direct services, we lead local advocacy efforts and build strong church and community engagement. Through our Good Neighbor Teams, we mobilize local congregations and volunteer groups to walk alongside arriving families, helping them set up apartments and navigate their new neighborhoods. This comprehensive approach ensures newcomers receive reliable support at every stage of their transition.",
    distinctive: "What sets us apart is our complete, wraparound approach backed by decades of local experience. We do not just manage files; we walk alongside families through the entire process. Crucially, many of our staff members have lived experience as former refugees or immigrants themselves. This creates deep trust and understanding, moving our work beyond standard social services into real, community-driven support.",
    accomplishments: "We are proud of bringing our four offices together into a unified regional model to increase our efficiency. Over the past few years, we scaled our CalAIM healthcare integration, moved our San Diego office to a better location for clients, and helped thousands of newcomers find steady jobs and housing. These achievements reflect our focus on good stewardship and respecting those we serve.",
    sentenceStyle: "I prefer using longer, narrative sentences rather than short directives. A narrative style leaves room for context, empathy, and storytelling. It better reflects the complex journeys of the families we serve, allowing us to explain our mission and values clearly while keeping the human element at the center of our communication with donors and partners.",
    celebrationTone: "When celebrating success, I keep a humble tone that focuses on our staff rather than myself. They do the hard work on the ground every day to make our programs succeed. Celebrating accomplishments is a chance to show genuine gratitude for their dedication and to recognize that our progress comes from teamwork and shared commitment.",
    crisisTone: "In a crisis, I use a calm, steady, and reassuring tone. Instead of reacting with panic, our communication should offer stability while acknowledging people's valid worries. The goal is to balance empathy for the hardship with a quiet confidence that, by working together as a community, we can navigate difficult challenges safely.",
    financialAskStyle: "I look at financial support as a partnership rather than a transaction, focusing on building long-term relationships and mutual respect. Asking for funds is an invitation to work together. We respect our donors by showing them exactly how their gifts provide housing, jobs, and legal help, turning their financial support into a meaningful, collaborative effort.",
    personalAnecdotes: "I prefer sharing simple, personal stories, like having coffee with a newly arrived family or watching a staff member guide a client. I also draw from my own journey through foster care, which taught me the true meaning of hospitality and belonging, and my joy of woodworking, where patience shapes raw material into a strong, stable foundation. These reflections highlight our shared humanity and the steady work of building up a community together.",
    outOfCharacterTone: "An aggressive, overly corporate, or purely transactional tone would feel completely out of character for me. We should avoid language that sounds boastful or cold and numbers-driven. Our voice must never seem exclusionary or slick. It should always remain grounded, warm, and respectful of the real-life struggles and journeys of the people we serve.",
    active: true,
  },
  {
    id: "quad-cities",
    name: "World Relief Quad Cities",
    director: {
      name: "Jen Osing",
      title: "Office Director",
      email: "JOsing@wr.org",
      phone: "563-349-2141",
    },
    givingUrl: "https://give.worldrelief.org/site/Donation2?2022.donation=form1&df_id=2022&mfc_pref=T",
    // Jen supplied a sign-off phrase only ("With gratitude or with heartfelt gratitude"),
    // not a full block. Name/title/office below are her own questionnaire answers.
    signatureBlock: "With gratitude,\n\nJen Osing\nOffice Director\nWorld Relief Quad Cities",
    audienceReligious: "Our donors and partners come from diverse faith backgrounds. However, many are Christian.",
    audiencePolitical: "Our audience generally leans more liberal or politically moderate.",
    // Left blank in the questionnaire — the app flags rather than invents.
    politicalPhrasesToAvoid: "",
    preferredBiblicalPhrases: "Loving your neighbor, welcoming the stranger, seeing the image of God in every person",
    preferredBibleVerses: "Matthew 22:39, Matthew 25:35, Leviticus 19:33-34",
    faithPhrasesToAvoid: "Avoid language that feels exclusionary because we have such a diverse audience",
    programming: "Refugee resettlement\nFamily Literacy classes\nGood Neighbor Teams\nCitizenship classes\nImmigration legal services\nYouth mentoring\nAfter school and summer programming\nEmployment services\nCase management\nPublic benefits application support and referrals\nMental health services",
    distinctive: "We are the only refugee resettlement agency within a 100-mile radius\nWe provide wrap-around services that support families from arrival through long-term integration\nWe combine direct services with strong volunteer engagement through Good Neighbor Teams\nWe serve communities across the Quad Cities as well as Southeastern Iowa",
    accomplishments: "Opened the Scott County, IA office in 2023 and a small office in Southeast Iowa in 2024\nExpanded immigration legal services through a site extension at the Scott County, IA office\nContinued growing Good Neighbor Team programming\nCelebrated significant progress and learning gains among Family Literacy participants last year\nExpanded services into southeast Iowa",
    sentenceStyle: "short, direct sentences",
    celebrationTone: "Uplifting, grateful, and hopeful",
    crisisTone: "Steady and reassuring",
    financialAskStyle: "Emphasize the impact of gifts by connecting financial support to lives changed and communities strengthened. Express gratitude for both past support and future partnership.",
    personalAnecdotes: "Client achievements, volunteer experiences, program successes, office milestones and community partnerships.",
    outOfCharacterTone: "An overly corporate, impersonal, or generic tone",
    active: true,
  },
  {
    // Covers the whole Texas region (Fort Worth, Dallas, Austin), confirmed by Joel
    // 2026-08-27: the questionnaire answers are valid region-wide, and WR brands the
    // region publicly as World Relief Texas. Submitted by Bethany Fort on Jonathan
    // Parsons' behalf; Joel confirmed the answers are his, so they go out under his
    // signature. Renamed from the id "fort-worth", which is now in RETIRED_OFFICE_IDS
    // in officesStore so the superseded record is dropped from KV rather than lingering.
    id: "texas",
    name: "World Relief Texas",
    director: {
      name: "Jonathan Parsons",
      title: "Interim Executive Director",
      // STILL BLANK. Joel confirmed on 2026-08-27 that the ANSWERS are Jonathan's,
      // but no email address for him was ever supplied: the form captured the
      // submitter's (BFort@wr.org). Every other WR director follows first-initial +
      // surname, which would suggest JParsons@wr.org, but that is a guess and a wrong
      // address in a donor-facing signature is not worth it. Fill in when WR sends it.
      email: "",
      phone: "(817) 615-9331",
    },
    givingUrl: "https://give.worldrelief.org/site/Donation2?2107.donation=form1&df_id=2107&mfc_pref=T&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fteams.public.onecdn.static.microsoft%2F",
    signatureBlock: "Sincerely,\n\nJonathan Parsons\nInterim Executive Director",
    audienceReligious: "Evangelical, mostly Baptist and non-denominational or Bible churches with a few that are more liturgical and a few mainline",
    audiencePolitical: "Majority Republican and conservative, but mixed with progressive and moderate. Some may have voted for and support Trump and some may not have.",
    politicalPhrasesToAvoid: "We should be cautious about how \"know your rights\" language could and has appeared to some of our partners in the past as helping people work around the law or protecting those who shouldn't be here. We can and should be critical of ICE and detention facilities when there are blatant human rights violations but otherwise should not advocate for ICE to be abolished or infer that we do not want them to do their job. Most people do recognize us as a trusted voice for understanding what is happening in our nation and communities through a Biblical lens even when we are critical. We always want to appeal to Scripture and the example of Jesus",
    preferredBiblicalPhrases: "Phrases that I like to use tend to be along the lines of:\n\nFaithful Stewardship\n\nTrusting in the Lord for provision both physical and in wisdom to respond\n\nWalking faithfully in seasons of uncertainty (Hebrews 11 is one of my favorite chapters)",
    preferredBibleVerses: "I like the idea of Psalm 139 talking about God's detailed knowledge of who we are and what we are doing. I normally would tie this into how we should treat our refugee neighbors as image bearers.\n\nHowever, I don't have a favorite verse in regards to the engaging the world's greatest crisis",
    faithPhrasesToAvoid: "Prosperity gospel clichés? Things like \"just have more faith!\" \"God wants you to succeed!\"",
    programming: "Resettlement services, cash assistance, employment, ESL classes, preschool programming, extended case management, church & volunteer mobilization",
    distinctive: "We support all needs of clients whereas others provide limited programs of support like ESL only. We are well-established and part of a larger international support system. We also lead advocacy initiatives across the state, meeting with representatives and other advocacy organizations. We are distinct from many other Christian non-profits in that we offer holistic case management services and are partnering with the federal government in refugee resettlement. We are distinct from other refugee resettlement agencies that partner with the federal government because we prioritize the church's involvement.",
    accomplishments: "When federal funding was suspended in 2025, we raised over $1 million in private funding and mobilized 318 volunteers to serve the shifting needs of clients and sustain services. We expanded to Dallas in March of 2023 and opened an Austin office and September of 2023. In response to needs of clients, we have created new programs including an early childhood education program, in-person ESL classes at our Dallas location, volunteer opportunities, and virtual ESL programs.",
    sentenceStyle: "Medium sentences, I think. I prefer to explain context before conclusions or decisions.",
    celebrationTone: "I want to be team oriented when it comes to success and also roll it into momentum and the \"what comes next?\" after a win.",
    crisisTone: "Ideally my tone would be calm, talk about the desire for transparency, and hope that the difficult season will pass.",
    financialAskStyle: "Try to give reasons why we are personally passionate about a topic. Ask the partner to join in if they feel a similar connection or feel like the issue is important enough.",
    // Restored 2026-08-27. Bethany Fort filled the form out FOR Jonathan Parsons, and
    // Joel confirmed these are his answers, so the family story is his to tell.
    personalAnecdotes: "I like to tie my mom's journey to the US and how I am here because of all the things she went through and the help that she got from organizations and churches along the way.\n\nAlso any particular staff or client stories that have been impactful over the years.",
    outOfCharacterTone: "Tone of crisis when a situation isn't directly affecting Texas clients, implication that we are aligning with politically liberal values without including a Biblical framework. Language that characterizes clients as victims or helpless.",
    active: true,
  },
  {
    id: "wisconsin",
    name: "World Relief Wisconsin",
    director: {
      name: "Gail Cornelius",
      title: "Regional Director",
      email: "GCornelius@wr.org",
      phone: "920-231-3600",
    },
    givingUrl: "https://give.worldrelief.org/site/Donation2?df_id=1987&mfc_pref=T&1987.donation=form1&utm_source=referral&utm_medium=external&utm_campaign=https%3A%2F%2Fteams.public.onecdn.static.microsoft%2F",
    signatureBlock: "Warmly,\nGail\n\nGAIL CORNELIUS\nRegional Director- Wisconsin\nWorld Relief Wisconsin | worldrelief.org/wisconsin\nInstagram | Facebook\nO: 920.231.3600 | C: 920.808.5991",
    audienceReligious: "Conservative Christian, I usually use a very light Christian tone.",
    audiencePolitical: "Varied. Wisconsin is a purple state, so our audience carries political beliefs across the spectrum. Due to this, we typically avoid any sort of political statements.",
    politicalPhrasesToAvoid: "We try to avoid speaking about political things in general. We should never name Trump and when needed, use the current administration. We would also avoid any condemnation of political alignment.",
    preferredBiblicalPhrases: "Dependent on the focus of the email/newsletter. Generally, I use phrases like loving your neighbor, welcoming the stranger.",
    preferredBibleVerses: "Dependent on the focus of the email/newsletter.",
    // Left blank in the questionnaire — the app flags rather than invents.
    faithPhrasesToAvoid: "",
    programming: "Initial resettlement, economic empowerment, intensive case management, immigration legal services, advocacy",
    distinctive: "We are the only resettlement agency (partnered with the federal government) in the communities we serve.",
    accomplishments: "Welcoming over 2,000 refugees across the state of Wisconsin, building strong partnerships with churches and local government partners, offering services to an expanded number of communities.",
    sentenceStyle: "Longer, narrative sentences.",
    celebrationTone: "Christian tone, pride in team and community, referencing blessings/praise",
    crisisTone: "Resilient, Christian, committed, responsive.",
    financialAskStyle: "Avoid direct ask, seek partnership, name what the ask is for (specifically)",
    personalAnecdotes: "Family stories, experiences with clients, community partnership observations.",
    outOfCharacterTone: "Negative, defeated, aggressive.",
    active: true,
  },
  {
    id: "spokane",
    name: "World Relief Spokane",
    director: {
      name: "Christi Armstrong",
      title: "Executive Director",
      email: "CArmstrong@wr.org",
      phone: "509-321-1865",
    },
    // Christi supplied two links. Default is the one-time gift link, which is what a
    // general appeal asks for; the monthly link is selectable per generation for
    // monthly-giving campaigns. Confirm the default with World Relief.
    givingUrl: "https://give.worldrelief.org/site/Donation2?df_id=2110&mfc_pref=T&2110.donation=form1",
    givingUrlOptions: [
      { label: "One-time giving", url: "https://give.worldrelief.org/site/Donation2?df_id=2110&mfc_pref=T&2110.donation=form1" },
      { label: "Monthly giving", url: "https://give.worldrelief.org/site/Donation2?df_id=3241&mfc_pref=T&3241.donation=form1" },
    ],
    // Christi supplied sign-off phrases only ("With gratitude" / "In partnership with
    // gratitude"). Name/title/office below are her own questionnaire answers.
    signatureBlock: "With gratitude,\n\nChristi Armstrong\nExecutive Director\nWorld Relief Spokane",
    audienceReligious: "Spokane's donor/partner audience tends to range from moderately conservative to moderately progressive. They tend to appreciate citing Bible verses and using language that speaks to the Biblical value of people being image bearers and supporting the vulnerable.",
    audiencePolitical: "My interactions with donors/partners indicate that they prefer not to mix politics and faith. We had one of our long time, very generous church partners disengage during a campaign that was politically flavored. We were able to win them back but they clearly told us they are interested in the humanitarian aspect of our work rather than advocacy. Based on responses we get to appeals, I would say this is true for the majority of our support base. Our audience generally prefers humanitarian content rather than political or advocacy content.",
    politicalPhrasesToAvoid: "Please avoid addressing issues that may be in the center of the radar in some areas of the country but not in this area. I'm sure you will avoid inflammatory or divisive language. I hope this thought helps - I have a deeply held conviction that every human being, regardless of any political opinions, faith persuasions, or personal preferences, is deeply loved by their Creator and is worthy of the kindness, grace, and caring extended by the Lord Himself to all of us. If you are referring to our vision to see restorative relationships with God... and creation (that nature) that does not seem to be a high priority in our demographic.",
    preferredBiblicalPhrases: "I thank my God every time I remember you. In all my prayers for all of you, I always pray with joy because of your partnership in the gospel Philippians 1:3-4\nPartnership in the gospel\n\nI will rejoice in the LORD, I will be joyful in God my Savior.\nHabakkuk 3:18\n\nO give thanks unto the Lord, for he is good: for his mercy endures for ever.\nPsalm 107:1\n\nLet us hold unswervingly to the hope we profess, for he who promised is faithful. And let us consider how we may spur one another on toward love and good deeds.\nHebrews 10:23-24\n\nSome key words I often use - Refugee/immigrant friend and neighbors, Gratitude, partnership in the gospel, image bearers of Christ, Unity, Encouragement, Purpose",
    // "Q9" refers back to a question on the source Microsoft Form (the preferred
    // biblical phrases field above). Kept verbatim; worth resolving with Christi.
    preferredBibleVerses: "Anything in Matthew 25:34-40 and anything stated in Q9. I have a very strong conviction that God is Sovereign in all things, deeply loves His people, deeply longs for all people to be His people and that we must look to Him in every situation for help and as our first and most reliable authority.",
    faithPhrasesToAvoid: "Please don't use words or phrases that suggest a connection between faith and politics such as liberal, conservative, progressive, right, left, center",
    programming: "Much of this information is on our website under the \"Our work\" tab. The Spokane office has\n\n- Economic Empowerment - Employment case management, job readiness training, job placement and retention assistance, career advancement support, employer relations development, etc\n- Integration & Wellness - Extended case management; medical resource navigation; mental health and psycho social support groups and community resource navigation for adults and youth; housing stabilization resources; an Education Center that offers a wide variety of learning experiences; our Friendship Centers offers outreach and drop in services for refugee and immigrant communities and are staffed by Community Ambassadors who are leaders in the various ethnic communities.\n- Resettlement - welcoming new arrivals and giving assistance during the 1st 90 days following arrival to secure housing, placement in schools, connection to resources for employment support and other community resources, accessing public benefits, accessing medical and legal services as needed, etc.\n- Church and Community Engagement - assists volunteers, churches, businesses, and other community partners with engaging in the mission of World Relief",
    distinctive: "World Relief Spokane has been serving refugees and immigrants in Spokane for 35 years. We are a distinctly Christian organization that collaborates with a wide network of community partners, and rely primarily on our partnership with local churches to create a welcoming community where refugees feel wanted and supported; seen, respected, and valuable; and like members of a community where they belong and make valuable contributions.",
    accomplishments: "World Relief Spokane has continuously provided high quality, professionally staffed services to the refugee community. Our Community Ambassador team is a one of a kind group in Spokane made up of former refugees/immigrants who are leaders in the various ethnic communities providing support and assistance to any refugee/immigrant in need of assistance. Our Education Center is staffed by highly qualified individuals who provide a wide variety of learning experiences from ESL classes and tutoring, to employment development, health and well-being, banking and finances management, computer literacy, driver license prep, citizenship prep, sewing classes and many others. We have developed a robust Youth Programs that that enable youth to engage in healthy and wholesome activities like hiking, basketball, BMX groups, trips to our local Children's Discovery Center and family day at Silverwood Theme Park, and many more.",
    sentenceStyle: "This Director appreciates Smart Brevity with a relational rather than direct tone. I believe it is true that clarity is kindness. As a pastor, my tendency regarding outward communication style is to gather, explore together, and with intentionality and purpose engage people in a worthy and compelling cause.",
    celebrationTone: "I love to celebrate successes and will often use words like fabulous, wonderful, outstanding. I do endeavor to give credit where credit is due and always prefer to give credit to someone else - and to the Lord.",
    crisisTone: "When addressing a crisis, I prefer to focus on the human side of the story. I am committed to avoiding overstating or sensationalizing a crisis for any reason. I like to relate the presenting situation to the human experience. For example, our recent fires in Spokane was a prime opportunity to tie the refugee experience to the experience people in our community were feeling in a very practical, compelling, non-sensational way.",
    financialAskStyle: "There must be a compelling reason for asking for support. I prefer a clear, direct, and grateful ask for support. So, answering the questions: Why are we asking? What are we asking for? How will the finances be used? And clearly stating that every bit of support is appreciated. I don't like high pressure. I prefer compelling.",
    personalAnecdotes: "I often share stories of my personal experience of joining the World Relief staff with little knowledge of refugees and fairly strong beliefs related to my faith foundation, and my early experiences serving the Sudanese community. I was completely unprepared for, and at first completely unwilling to be the \"Sudanese mom.\" I have a plethora of stories of my own personal growth and the fairly radical shift in my world view as a result of engaging in community with my Sudanese friends.",
    outOfCharacterTone: "Any tone that is overly direct or lacks an expression of gratitude, humility and a desire to engage and understand would be uncharacteristic of my personal beliefs and goals for communication. I embrace that the position of leadership in WR comes with an expectation of a level of expertise. I believe there is a line dividing humbly sharing that expertise and becoming over bearing or braggadocious.",
    active: true,
  },
];
