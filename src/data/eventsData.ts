import { GameEvent } from '../types/game';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'event_day1_maya_project',
    title: 'The Group Capstone Dilemma',
    subtitle: 'University Courtyard Encounter',
    description:
      'Maya catches up to you near the university quad. "Two members of our team haven’t submitted any commits, and our intermediate progress milestone is due tomorrow night! If we don’t cover for them, our grade drops. But if we do, we’re doing all their work for free."',
    npcId: 'npc_maya',
    locationId: 'university',
    triggerCondition: (stats, day, hour, flags) =>
      day === 1 && hour >= 11 && !flags.has('event_day1_maya_project_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Offer to pull an all-nighter with Maya to finish it',
        description: 'Carry the burden. Guaranteed top evaluation, but costs significant time and sanity.',
        timeHours: 3,
        energyCost: 35,
        statEffects: { knowledge: 15, relationships: 18, stress: 20 },
        flagSet: 'maya_helped_allnighter',
        outcomeText:
          'You and Maya grind through the night with coffee. The project submission is flawless, and Maya will never forget your loyalty.',
      },
      {
        text: 'Encourage Maya to report the inactive members and set firm boundaries',
        description: 'Protect your energy and health. Request an extension from the professor.',
        timeHours: 1,
        energyCost: 10,
        statEffects: { confidence: 12, stress: -5, relationships: 8 },
        flagSet: 'maya_set_boundaries',
        outcomeText:
          'You draft a professional notice to the professor. The instructor appreciates your maturity and grants an individual grading rubric.',
      },
      {
        text: 'Politely step back and only do your assigned portion',
        description: 'Preserve personal time for your own freelance work or hobbies.',
        timeHours: 0.5,
        energyCost: 5,
        statEffects: { confidence: 6, relationships: -8, stress: -10 },
        flagSet: 'maya_detached',
        outcomeText:
          'Maya looks disappointed but accepts your choice. You keep your energy intact, but a chill settles in your teamwork.',
      },
    ],
  },

  {
    id: 'event_day2_laptop_repair',
    title: 'Hardware Catastrophe',
    subtitle: 'Apartment Emergency',
    description:
      'You sit down at your apartment desk to boot up your development machine, but the screen flickers violently with static error bands. A blown power regulator. An authorized repair center nearby can fix it immediately for $110, or you can order a cheap replacement part and solder it yourself.',
    locationId: 'apartment',
    triggerCondition: (stats, day, hour, flags) =>
      day === 2 && hour >= 10 && !flags.has('event_day2_laptop_done'),
    choices: [
      {
        text: 'Pay the $110 express repair bill',
        description: 'Fixed in 30 minutes, but puts a noticeable dent in your bank balance.',
        timeHours: 1,
        energyCost: 10,
        statEffects: { money: -110, stress: 15, confidence: 5 },
        flagSet: 'laptop_paid_shop',
        outcomeText:
          'The technician returns your laptop in mint condition. Your bank app flashes a balance alert, but your schedule stays intact.',
      },
      {
        text: 'Buy a $25 DIY solder kit and repair it yourself at Creative Hub',
        description: 'Demands patience and electrical skills, but teaches you real hardware chops.',
        timeHours: 3,
        energyCost: 30,
        statEffects: { money: -25, knowledge: 20, confidence: 16, stress: 8 },
        flagSet: 'laptop_diy_solder',
        outcomeText:
          'With Kai’s magnifier lamp at the Creative Hub, you replace the blown capacitors. The laptop springs back to life! What a victory.',
      },
      {
        text: 'Borrow a loaner terminal from the university library for the week',
        description: 'Free of charge, but slow and restricted by university firewalls.',
        timeHours: 1.5,
        energyCost: 15,
        statEffects: { money: 0, stress: 10, knowledge: 5 },
        flagSet: 'laptop_library_loaner',
        outcomeText:
          'You lug home a bulky university loaner laptop. It gets the job done, even if compiling takes three times longer.',
      },
    ],
  },

  {
    id: 'event_day2_leo_barista_rush',
    title: 'Bean & Byte Afternoon Rush',
    subtitle: 'Cafe Emergency Encounter',
    description:
      'As you step past Bean & Byte Cafe, you see a line trailing out the door. The second barista called in sick, and Leo is running back and forth steaming milk with sweat on his brow. "Hey! If you have any spare time, I’d pay double hourly if you can hop behind the register!"',
    npcId: 'npc_leo',
    locationId: 'cafe',
    triggerCondition: (stats, day, hour, flags) =>
      day === 2 && hour >= 14 && !flags.has('event_day2_barista_done'),
    choices: [
      {
        text: 'Tie on an apron and jump behind the counter ($60 bonus)',
        description: 'Sweat, steam, and speed. Good cash and deep appreciation from Leo.',
        timeHours: 2.5,
        energyCost: 30,
        statEffects: { money: 60, relationships: 18, energy: -20, stress: 8 },
        flagSet: 'helped_leo_rush',
        outcomeText:
          'You take orders rapidly and hand out espresso shots. Leo gives you a massive high-five and an envelope of tips: "You saved my life today!"',
      },
      {
        text: 'Decline politely—you have pressing obligations elsewhere',
        description: 'Focus on your own academic and career objectives.',
        timeHours: 0.2,
        energyCost: 0,
        statEffects: { confidence: 4 },
        flagSet: 'declined_leo_rush',
        outcomeText:
          'You wish Leo luck and continue on your way. You protect your time, even if you feel a pang of guilt.',
      },
    ],
  },

  {
    id: 'event_day3_elena_opportunity',
    title: 'The Venture Pitch Opening',
    subtitle: 'Apex Ventures Office Plaza',
    description:
      'Elena spots you near the glass entrance of Apex Ventures. "Our flagship AI-powered logistics team just had a junior role open up for the upcoming term. Three candidates are interviewing. Are you ready to present your work and tackle a live architectural case study?"',
    npcId: 'npc_elena',
    locationId: 'office',
    triggerCondition: (stats, day, hour, flags) =>
      day === 3 && hour >= 11 && !flags.has('event_day3_elena_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Confidently pitch your technical portfolio',
        description: 'Demonstrate system thinking and showcase previous project repositories.',
        timeHours: 2,
        energyCost: 25,
        statEffects: { confidence: 18, knowledge: 10, stress: 12, relationships: 10 },
        flagSet: 'elena_pitch_given',
        outcomeText:
          'Elena tests your thinking with curveball edge-cases. You answer articulately. She nods: "Very rare to see this depth of ownership in an undergraduate."',
      },
      {
        text: 'Admit you need more preparation and ask for study recommendations',
        description: 'Honest humility over premature posturing.',
        timeHours: 1,
        energyCost: 10,
        statEffects: { knowledge: 14, stress: -5, relationships: 8 },
        flagSet: 'elena_honest_humility',
        outcomeText:
          'Elena respects your candor: "Knowing your current boundaries is a sign of a senior engineer." She gives you a reading list on distributed consensus.',
      },
    ],
  },

  {
    id: 'event_day3_burnout_warning',
    title: 'The Warning Tremor',
    subtitle: 'Physical & Mental Overload Alert',
    description:
      'Your eyelids are twitching, your temples throb with a dull ache, and the streetlights of New Day City blur together. You’ve been pushing yourself relentless hours without adequate downtime.',
    triggerCondition: (stats, day, hour, flags) =>
      stats.stress >= 65 || stats.energy <= 20,
    choices: [
      {
        text: 'Head to Starlight City Park immediately to decompress',
        description: 'Disconnect from all screens. Breathe fresh air and listen to Sam’s music.',
        timeHours: 2,
        energyCost: -15,
        statEffects: { stress: -28, energy: 15, confidence: 6 },
        outcomeText:
          'Sitting under the willow trees as cool evening breezes blow, the tight knot in your chest loosens. You realize you can’t sprint a marathon.',
      },
      {
        text: 'Power through with another energy drink and continue working',
        description: 'Ignore bodily feedback and grind regardless.',
        timeHours: 1,
        energyCost: -10,
        statEffects: { stress: 20, energy: -15, knowledge: 6 },
        outcomeText:
          'A jittery caffeine spike carries you for sixty minutes, but the inevitable crash leaves your hands shaking.',
      },
    ],
  },

  {
    id: 'event_day4_kai_hackathon',
    title: 'The Midnight Nexus Jam',
    subtitle: 'Creative Hub 24-Hour Invitation',
    description:
      'Kai hands you a glowing phosphor flyer: "We’re hosting the 24-Hour Experimental Audio-Visual Jam tonight at Nexus! Prize pool is $200 and indie studio founders will be scouting. You should enter your generative sound-grid project!"',
    npcId: 'npc_kai',
    locationId: 'creative_hub',
    triggerCondition: (stats, day, hour, flags) =>
      day === 4 && hour >= 15 && !flags.has('event_day4_hackathon_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Enter the Jam and compete for the prize ($200 possible)',
        description: 'Burn midnight oil to build a jaw-dropping audio-visual prototype.',
        timeHours: 4,
        energyCost: 40,
        statEffects: { knowledge: 24, confidence: 20, stress: 18, money: 120 },
        flagSet: 'won_nexus_jam',
        outcomeText:
          'At 3 AM your interactive sound visualizer captivates the room! The judges award you 2nd place and a $120 prize purse.',
      },
      {
        text: 'Attend as a spectator and test other creators’ demos',
        description: 'Enjoy the creative community vibe without competitive strain.',
        timeHours: 2,
        energyCost: 15,
        statEffects: { relationships: 14, confidence: 8, stress: -8 },
        flagSet: 'spectated_nexus_jam',
        outcomeText:
          'You socialize with digital artists, test wild interactive controllers, and leave inspired without burning out.',
      },
      {
        text: 'Decline and dedicate the evening to a healthy home dinner and rest',
        description: 'Prioritize physical recovery and peace of mind.',
        timeHours: 1,
        energyCost: -15,
        statEffects: { stress: -15, energy: 20 },
        flagSet: 'rested_instead_jam',
        outcomeText:
          'You cook a nutritious meal at home and get an early night’s sleep. Your body thanks you.',
      },
    ],
  },

  {
    id: 'event_day4_friend_birthday',
    title: 'Surprise Birthday Dinner for Maya',
    subtitle: 'Bean & Byte Cafe Gathering',
    description:
      'Leo sends you a text: "Psst! It’s Maya’s 21st birthday tonight! A few of us are chipping in $30 for a cake and gift at the cafe backroom. Can you make it?"',
    locationId: 'cafe',
    triggerCondition: (stats, day, hour, flags) =>
      day === 4 && hour >= 18 && !flags.has('event_day4_birthday_done'),
    choices: [
      {
        text: 'Join the party and contribute $30 for the gift',
        description: 'Celebrate your closest peer and cement a lasting bond.',
        timeHours: 2.5,
        energyCost: 15,
        statEffects: { money: -30, relationships: 24, stress: -14, confidence: 8 },
        flagSet: 'attended_maya_birthday',
        outcomeText:
          'Maya’s eyes light up when the candles are lit. The laughter, stories, and warm toasts will stick with you for years.',
      },
      {
        text: 'Send a warm congratulatory message but stay home to study',
        description: 'Save $30 and stay focused on academic deadlines.',
        timeHours: 0.5,
        energyCost: 5,
        statEffects: { relationships: 2, knowledge: 8 },
        flagSet: 'skipped_maya_birthday',
        outcomeText:
          'Maya texts back: "Thanks! We missed you though." You made progress on your textbook, but the silence feels a bit lonely.',
      },
    ],
  },

  {
    id: 'event_day5_sam_sunset_jam',
    title: 'The Philosophy of the Unfinished',
    subtitle: 'Starlight Park Bench Session',
    description:
      'The sun is dipping below the skyline, painting the clouds in shades of lavender and bronze. Sam waves you over to the bench by the fountain: "You look like someone who is trying to solve the puzzle of life in one week. Sit with me. What is it you really want out of this university sprint?"',
    npcId: 'npc_sam',
    locationId: 'park',
    triggerCondition: (stats, day, hour, flags) =>
      day === 5 && hour >= 16 && !flags.has('event_day5_sam_done'),
    choices: [
      {
        text: '"I want to build real mastery and prove what I’m capable of."',
        description: 'Reflect on high craft and self-actualization.',
        timeHours: 1.5,
        energyCost: 5,
        statEffects: { confidence: 15, knowledge: 6, stress: -12 },
        outcomeText:
          'Sam nods thoughtfully: "Mastery is a noble pursuit, provided you don’t mistake perfectionism for growth."',
      },
      {
        text: '"I want deep human connections that outlast grades and titles."',
        description: 'Value relationships and shared vulnerability.',
        timeHours: 1.5,
        energyCost: 5,
        statEffects: { relationships: 16, stress: -16, confidence: 8 },
        outcomeText:
          'Sam plays a warm harmonic on the strings: "Projects get deprecated, companies merge, but the people who stood in the rain with you stay forever."',
      },
      {
        text: '"I honestly don’t know yet, and that uncertainty scares me."',
        description: 'Admit honest vulnerability and seek grounded perspective.',
        timeHours: 1.5,
        energyCost: 0,
        statEffects: { stress: -22, confidence: 12, energy: 10 },
        outcomeText:
          'Sam smiles warmly: "Nobody in those skyscrapers knows either. The beauty of LIFE.EXE is you get to write the executable as you run it."',
      },
    ],
  },

  {
    id: 'event_day5_freelance_crisis',
    title: 'Client Rush Contract Surge',
    subtitle: 'Remote Work Offer via Apex',
    description:
      'An urgent ping arrives on your phone from a startup client: "Our server configuration crashed ahead of our investor demo. If you can fix our Docker deployment in the next 2 hours, we will pay you $120 immediate wire transfer!"',
    locationId: 'office',
    triggerCondition: (stats, day, hour, flags) =>
      day === 5 && hour >= 12 && !flags.has('event_day5_freelance_done'),
    choices: [
      {
        text: 'Accept the emergency deployment sprint ($120)',
        description: 'High pressure, tight deadline, excellent payout.',
        timeHours: 2.5,
        energyCost: 35,
        statEffects: { money: 120, knowledge: 12, stress: 20, confidence: 10 },
        flagSet: 'completed_rush_contract',
        outcomeText:
          'You debug the reverse proxy logs, restart the cluster, and watch the green health checks illuminate. Client wires $120 with high praise.',
      },
      {
        text: 'Pass on the gig—your mental bandwidth is full',
        description: 'Money isn’t worth burning your remaining weekend reserves.',
        timeHours: 0.2,
        energyCost: 0,
        statEffects: { stress: -5, confidence: 4 },
        outcomeText:
          'You reply with a polite decline. It feels refreshing to say no when money tries to commandeer your life.',
      },
    ],
  },

  {
    id: 'event_day6_exam_cram',
    title: 'The Final Term Assessment Eve',
    subtitle: 'University Academic Quad',
    description:
      'Tomorrow morning is the comprehensive software systems and design evaluation. Maya is camped out in the library atrium with five empty energy drink cans and color-coded flashcards. How will you tackle this pivotal academic milestone?',
    locationId: 'university',
    triggerCondition: (stats, day, hour, flags) =>
      day === 6 && hour >= 13 && !flags.has('event_day6_exam_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Commit to a rigorous 4-hour structured review session',
        description: 'Thorough review of algorithms, architecture, and case studies.',
        timeHours: 4,
        energyCost: 35,
        statEffects: { knowledge: 28, stress: 15, confidence: 14 },
        flagSet: 'crammed_deep_study',
        outcomeText:
          'You dissect every theorem and diagram. When you close the book, you feel solidly prepared for whatever question the professor throws.',
      },
      {
        text: 'Form a rapid collaborative review circle with Maya and Kai',
        description: 'Combine academic rigor with creative analogies and peer testing.',
        timeHours: 2.5,
        energyCost: 20,
        statEffects: { knowledge: 18, relationships: 14, confidence: 12, stress: 5 },
        flagSet: 'group_reviewed_exam',
        outcomeText:
          'Teaching concepts to each other cements understanding faster than solo reading. You walk away confident and energized.',
      },
      {
        text: 'Trust your existing knowledge and prioritize getting 8 hours of sleep',
        description: 'A sharp, rested brain outperforms an exhausted genius.',
        timeHours: 1,
        energyCost: -10,
        statEffects: { stress: -18, energy: 20, confidence: 10 },
        flagSet: 'rested_for_exam',
        outcomeText:
          'You shut your notebook, take a deep breath, and trust your semester foundations. Clarity of mind is your secret weapon.',
      },
    ],
  },

  {
    id: 'event_day6_elena_offer',
    title: 'Elena’s Formal Internship Offer',
    subtitle: 'Apex Ventures Executive Floor',
    description:
      'Elena invites you to the glass boardroom: "We evaluated all applicant submissions. Based on your performance this week in New Day City, I would like to offer you the Summer Lead Systems Intern position—contingent on how you plan to balance your commitments."',
    npcId: 'npc_elena',
    locationId: 'office',
    triggerCondition: (stats, day, hour, flags) =>
      day === 6 && hour >= 16 && !flags.has('event_day6_elena_offer_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Accept with enthusiasm and negotiate high performance milestones',
        description: 'Commit fully to launching your tech career trajectory.',
        timeHours: 1,
        energyCost: 10,
        statEffects: { confidence: 25, money: 100, stress: 10, relationships: 8 },
        flagSet: 'accepted_elena_internship',
        outcomeText:
          'Elena shakes your hand with a firm smile. "Welcome aboard Apex Ventures. You earned this through tangible grit and capability."',
      },
      {
        text: 'Accept on part-time terms to ensure you don’t sacrifice friendships or health',
        description: 'A balanced contract that respects your holistic well-being.',
        timeHours: 1,
        energyCost: 5,
        statEffects: { confidence: 18, stress: -10, relationships: 10, money: 60 },
        flagSet: 'accepted_part_time_internship',
        outcomeText:
          'Elena nods with genuine respect: "Few young people have the courage to advocate for sustainable hours. Deal."',
      },
      {
        text: 'Decline to pursue your own independent creative studio with Kai and Leo',
        description: 'Choose the adventurous, entrepreneurial path of freedom.',
        timeHours: 1,
        energyCost: 10,
        statEffects: { confidence: 22, relationships: 20, stress: 8 },
        flagSet: 'chose_indie_studio_path',
        outcomeText:
          'Elena smiles knowingly: "The city needs brave builders. If you ever need venture backing down the line, my door is always open."',
      },
    ],
  },

  {
    id: 'event_day7_creative_showcase',
    title: 'The New Day City Weekend Showcase',
    subtitle: 'Nexus Creative Hub & Plaza',
    description:
      'It’s Sunday, the final day of your week in New Day City. The entire city gathers at the Nexus Plaza for the community showcase. Music echoes across the cobblestones, food trucks line the street, and all the friends you met along the way are gathered.',
    locationId: 'creative_hub',
    triggerCondition: (stats, day, hour, flags) =>
      day === 7 && hour >= 14 && !flags.has('event_day7_showcase_done'),
    isPivotal: true,
    choices: [
      {
        text: 'Take the stage and present your week’s accomplishments and creations',
        description: 'Step into the spotlight and share what you discovered.',
        timeHours: 2.5,
        energyCost: 20,
        statEffects: { confidence: 25, relationships: 20, knowledge: 10 },
        flagSet: 'presented_at_showcase',
        outcomeText:
          'Applause ripples through the crowd. Maya, Leo, Elena, and Sam cheer from the front row. You realize how much you’ve grown in seven days.',
      },
      {
        text: 'Spend the afternoon strolling through the booths, enjoying your friends’ company',
        description: 'Soak in the community atmosphere without the pressure of performing.',
        timeHours: 2.5,
        energyCost: 10,
        statEffects: { relationships: 25, stress: -20, confidence: 15 },
        flagSet: 'enjoyed_showcase_fellowship',
        outcomeText:
          'Sharing stories, cold brew, and street food with people who care about you. There are no deadlines today, just human connection.',
      },
    ],
  },
];
