// =========================================================
// scripts/story.js — Complete Novel Campaign (Ch. I – XXV),
//                    Evolving Lore Codex & Party Discovery
// =========================================================
window.Story = {
  // 15 Playable Story Chapters spanning all 5 Acts of the novel
  quests: [
    { act: "ACT I", ch: "Ch. I", title: "Starlit Funeral", objective: "Walk into St. Jude Church (top-left) and comfort Cyrine.", mapHint: "church" },
    { act: "ACT I", ch: "Ch. I (cont.)", title: "Stars Outside Barnes & Noble", objective: "Walk south to Barnes & Noble and talk with Cyrine.", mapHint: "bookstore" },
    { act: "ACT I", ch: "Ch. II", title: "Alter & Twilight Fireflies", objective: "Go inside Jacob's House (top-right) and talk to Navi in the kitchen.", mapHint: "house" },
    { act: "ACT I", ch: "Ch. IV", title: "A Night's Rest", objective: "Rest on Jacob's living room Couch or Bed inside Jacob's House.", mapHint: "house" },
    { act: "ACT I", ch: "Ch. IV–V", title: "The Dreamer's Reign", objective: "Walk across the glowing Cherry Blossom Lake and speak to Letonin.", mapHint: "dream" },
    { act: "ACT II", ch: "Ch. VI", title: "Liar's Cry", objective: "Head to the Party House (bottom-right) where Cyrine dragged you.", mapHint: "party" },
    { act: "ACT II", ch: "Ch. VII", title: "Snow Cat", objective: "Return inside Jacob's House to meet the stray platinum cat, Crista.", mapHint: "house" },
    { act: "ACT III", ch: "Ch. VIII–IX", title: "Caeleste: Letonin Awake", objective: "Enter the Purgatorio Portal (north of town) to Limbach Park and summon Letonin.", mapHint: "park" },
    { act: "ACT III", ch: "Ch. X–XI", title: "Moonlight Sonata", objective: "Fuse souls with Illicero & Letonin in Limbach Park to free Sendex from Crepsus's Brand.", mapHint: "park" },
    { act: "ACT IV", ch: "Ch. XII–XIII", title: "Death's Story", objective: "Speak with the hooded boy (Lord Death) in Limbach Park to learn the truth.", mapHint: "park" },
    { act: "ACT IV", ch: "Ch. XIV–XV", title: "Earth to Letonin", objective: "Step into the Crimson Portal to Casa Grande and speak to Emillia to rescue Letonin.", mapHint: "fortress" },
    { act: "ACT V", ch: "Ch. XVI–XVII", title: "Envy Rises", objective: "Confront the Divine Sin Envy in Casa Grande with Navi & Emillia.", mapHint: "fortress" },
    { act: "ACT V", ch: "Ch. XVIII–XIX", title: "Royal & Memories", objective: "Speak with Sendex (Daniel) in Casa Grande as Mandie's Orb awakens his past.", mapHint: "fortress" },
    { act: "ACT V", ch: "Ch. XX", title: "Cyrine: Muto", objective: "Face Crepsus with Cyrine's Deicide Profugo form and Jacob's Nephilim Light!", mapHint: "fortress" },
    { act: "EPILOGUE", ch: "Ch. XXI–XXII", title: "Grief & Resolve", objective: "Speak with Lord Death in Casa Grande to witness Letonin's sacrifice.", mapHint: "fortress" },
    { act: "EPILOGUE", ch: "Ch. XXIII–XXV", title: "Reset; Start", objective: "Return to Colorado Springs and reunite with Letonin & Cyrine for Senior Year!", mapHint: "overworld" }
  ],

  // Party roster with Fog of War discovery & evolving trueRole
  partyOrder: ["jacob", "cyrine", "navi", "letonin", "illicero", "sendex", "emillia", "death"],

  // Evolving Lore Codex: each entry has multiple tiers that unlock as dialogue reveals secrets!
  loreDefs: [
    {
      id: "corpse_circus",
      title: "The Corpse Circus",
      tiers: [
        "A brutal massacre in Colorado Springs that claimed Cyrine's entire family. Detectives found wounds from a forked weapon laced with Iris and Belladonna poison.",
        "Confirmed to be the work of a rogue Reaper using demonic alchemy poison—not a human killer.",
        "Masterminded by Crepsus (Death's Advisor) and the Sin Envy to break Cyrine emotionally and awaken her Godslayer bloodline."
      ]
    },
    {
      id: "purgatorio",
      title: "Purgatorio & Reapers",
      tiers: [
        "A parallel supernatural dimension layered over Earth. Reapers are servants of Death who guide human souls and hunt rogue demons unseen.",
        "Led by 4 Reapers of Order (Letonin, Illicero, Navi, Sendex) and billions of Morte Discipuli soldiers. In Caeleste form, Reapers manifest wings and full combat power.",
        "Secret Origin: Per a pact with God, Reapers are born from humans who died by suicide. Recovering all past human memories purifies a Reaper into an Angel."
      ]
    },
    {
      id: "navi_alter",
      title: "Navi & Alter Magic",
      tiers: [
        "Cyrine's quiet, surprisingly muscular 'older brother' who cooks incredible brunch—even though Jacob barely remembers meeting him before.",
        "Revealed by Letonin: Navi is NOT Cyrine's brother. He is a Reaper of Order using 'Alter' (perception manipulation) to live at Jacob's house and guard them.",
        "Navi is haunted by an inner voice named Misnomer—his dormant demonic half. After Crepsus's fall, Death promotes Navi to Death's Advisor."
      ]
    },
    {
      id: "ring_of_night",
      title: "Dream Magic & Ring of Night",
      tiers: [
        "A starry midnight-blue ring gifted to Jacob inside a lucid dream by Letonin—yet it physically stayed on Jacob's finger when he woke up.",
        "Letonin is the only Reaper to invent Dream Magic, forging weapons from sleeping humans' dreams (and stronger obsidian weapons from nightmares).",
        "When Letonin drinks Death's blood potion to become mortal, Death keeps the Ring of Night so Jacob and Letonin can fall in love naturally."
      ]
    },
    {
      id: "soul_fusion",
      title: "Jacob's Soul & Squire Bonds",
      tiers: [
        "Unlike normal humans whose souls form weapons for Illicero, Jacob's soul resonates with Reapers—allowing him to command Navi & Illicero together.",
        "Jacob can fuse his Nephilim soul directly with a Reaper to heal wounds, boost speed, and shatter curses like Crepsus's branding.",
        "By freeing Sendex inside the Moonlight Sonata mindscape, Sendex intentionally forged a rare Squire Bond—linking his mind and guardian oath to Jacob."
      ]
    },
    {
      id: "crista_cat",
      title: "Crista the Snow Cat",
      tiers: [
        "A platinum-furred stray cat with striking blue eyes that mysteriously appeared on Jacob's couch. Its presence strangely calms Cyrine.",
        "Ancient Reapers could disguise themselves as animals to soothe panicked souls. Crista is actually Illicero watching over Cyrine in secret!"
      ]
    },
    {
      id: "sendex_daniel",
      title: "Sendex (Daniel Flora)",
      tiers: [
        "The youngest and strongest Reaper of Order, wielding the fire thorn-whip Ultor and Rage Sensory. Initially hostile toward Jacob.",
        "Sendex wasn't acting on his own—Crepsus branded him with Envy's black toxin, hijacking his mind and erasing his memory of the attacks.",
        "Mandie's celestial orb unlocked his human past: Sendex was Cyrine's beloved cousin, Daniel Flora. Remembering his life transformed him into an Angel!"
      ]
    },
    {
      id: "emillia_envy",
      title: "The Siren Princess & Envy",
      tiers: [
        "Emillia Luve Vi Sonasa: a runaway Siren Princess with sonic screams, plant magic, and phantasm illusions who joins Jacob inside Letonin's dream.",
        "The colossal poison serpent Envy is Emillia's corrupted sister, Clarica Vi Sonasa, who murdered their mother after Emillia refused to abuse the Royal Voice."
      ]
    },
    {
      id: "twilight_fireflies",
      title: "Secret: Twilight Fireflies",
      tiers: [
        "Discovered at Barnes & Noble: A children's book written by Cyrine's mother about a hot-headed red spirit whose jealousy burned the forest, and a stubborn yellow spirit who embraced it to calm the flames—foreshadowing Cyrine and Jacob."
      ]
    },
    {
      id: "church_memorial",
      title: "Secret: St. Jude Inscription",
      tiers: [
        "Discovered in St. Jude Church: The Huesic memorial plaque notes that church bells ringing at night are secretly used by Reapers to signal the start of their nightly demon hunt."
      ]
    },
    {
      id: "hospital_toxicology",
      title: "Secret: Belladonna & Iris Report",
      tiers: [
        "Discovered in Colorado Springs Hospital: Dr. Menos's toxicology note confirms the poison found at the Corpse Circus contained an unknown alchemical compound—identical to Envy's venom."
      ]
    },
    {
      id: "supernatural_novels",
      title: "Secret: 'Unnecessarily Accurate' Novels",
      tiers: [
        "Discovered at Barnes & Noble: A fantasy novel describing Reapers who rewrite human memory by speaking—the exact reason Cyrine later sees through Navi's Alter spell!"
      ]
    },
    {
      id: "purgatorio_secrets",
      title: "Purgatorio Vision: Hidden Traces",
      tiers: [
        "Seen in Purgatorio: Unseen Morte Discipuli patrol Colorado Springs, while glowing black Envy toxin residue lingers in the astral reflection of Jacob's House.",
        "Seen in Purgatorio: Ancient Reaperian Texts hidden across Purgatorio reveal that children and Nephilim can naturally perceive spirits across the veil."
      ]
    },
    {
      id: "kids_purgatorio",
      title: "Secret: Children's Sight",
      tiers: [
        "Discovered in Barnes & Noble's Kids' Play Corner: Young children like Little Leo haven't psychologically separated the mortal and spirit worlds yet, allowing them to naturally see Reapers in Purgatorio!"
      ]
    },
    {
      id: "westside_secrets",
      title: "Secret: Colorado Springs Folklore",
      tiers: [
        "Discovered in Westside (Mr. Henderson's House & CS High): Local folklore speaks of winged silhouettes gliding above Limbach Park at midnight—and Senior Prom is set for two weeks from now."
      ]
    },
    {
      id: "deicide_profugo",
      title: "Cyrine: Deicide Profugo",
      tiers: [
        "Letonin sensed overwhelming demonic energy sleeping inside Cyrine—she isn't fully human.",
        "Crepsus calls her breed the 'Deicide Profugo'—a rare Godslayer demon capable of summoning ancestral spirits and annihilating even divine beings."
      ]
    }
  ],

  // Story Dialogues — with inline lore unlocks & party reveals!
  dialogues: {
    intro: [
      { id: "jacob", mood: "sad", text: "April 23rd — Colorado Springs. A week and a half ago, Cyrine's entire family was murdered in what detectives call the 'Corpse Circus.'", unlockParty: ["jacob", "cyrine"], unlockLore: { id: "corpse_circus", tier: 1 } },
      { id: "jacob", mood: "sad", text: "She's waiting inside St. Jude Church right now. Mom offered to let Cyrine and her older brother Navi stay at our house." },
      { id: "jacob", mood: "neutral", text: "Check the yard signs if you want to explore town, or follow the golden arrow into St. Jude Church (top-left). Tap the Progress Bar anytime to check your Story!" }
    ],

    churchCyrine: [
      { id: "cyrine", mood: "sad", text: "I couldn't even say goodbye, Jacob... The detectives said each of them was killed by a forked weapon laced with Iris and Belladonna poison." },
      { id: "cyrine", mood: "angry", text: "What if the man who killed them comes for me too? Staying with you puts you and your mom in danger!" },
      { id: "jacob", mood: "neutral", text: "You're not going anywhere, Cyrine. You have me, my mom, and your older brother Navi right here. We'll be alright—I promise." },
      { id: "cyrine", mood: "sad", text: "Let's get some air first... Meet me down at Barnes & Noble. I don't want to go straight back yet." }
    ],

    bookstoreCyrine: [
      { id: "cyrine", mood: "sad", text: "Hey Jacob... I don't want you to die or get killed because of me. You can't just promise it won't happen." },
      { id: "jacob", mood: "neutral", text: "Remember how we always look up at the constellations here? We'll be alright, Cyrine. I'm not leaving you alone." },
      { id: "cyrine", mood: "happy", text: "...Whatever you gotta tell yourself, Jacob. Alright—let's head back to your house. Navi's probably already cooking in the kitchen." }
    ],

    naviKitchen: [
      { id: "navi", mood: "neutral", text: "Morning, Jacob. Good to finally meet you—Cyrine tells me all about you. I made quiche, pancakes, and sorted fruits.", unlockParty: ["navi"], unlockLore: { id: "navi_alter", tier: 1 } },
      { id: "jacob", mood: "neutral", text: "Whoa, this brunch is unreal... Funny though, I know next to nothing about you. Did you ever read 'Twilight Fireflies'—the book Cyrine's mom wrote us?" },
      { id: "navi", mood: "sad", text: "...No. I didn't. (A red spirit setting the forest aflame and a yellow spirit dissolving to calm it... What plan does Death have for these two?)" },
      { id: "navi", mood: "neutral", text: "You look exhausted, Jacob. Go get some sleep on the living room couch or your bed whenever you're ready." }
    ],

    sleepPrompt: [
      { id: "jacob", mood: "neutral", text: "My eyes feel heavy... Lying down on this couch feels amazing. Just a quick rest..." }
    ],

    dreamLetonin: [
      { id: "letonin", mood: "happy", text: "Hey there, Jacob. Relax—you're safe. The storm's gone. You're standing in my Dream Realm, a cherry blossom lake under an eclipse.", unlockParty: ["letonin"], unlockLore: { id: "purgatorio", tier: 1 } },
      { id: "jacob", mood: "intense", text: "Wait... you're communicating through my inner monologue?! You're a real person?!" },
      { id: "letonin", mood: "sad", text: "My name is Letonin, a Reaper of Order. I've been trapped in a poison-induced sleep for two years—and the Reaper who murdered Cyrine's family is after you both.", unlockLore: { id: "corpse_circus", tier: 2 } },
      { id: "letonin", mood: "blush", text: "Take this: the Ring of Night. Even when you wake up in reality, it will stay on your finger so I can reach you. One day, I have faith you'll save me.", unlockLore: { id: "ring_of_night", tier: 1 } },
      { id: "letonin", mood: "neutral", text: "Also: Navi is NOT who he says he is—he's using a Reaper memory spell called 'Alter' to pose as Cyrine's brother. He means well, though. Now wake up!", unlockLore: { id: "navi_alter", tier: 2 } }
    ],

    afterDreamWake: [
      { id: "jacob", mood: "intense", text: "No way... the black-trimmed starry ring is ACTUALLY on my finger! Letonin wasn't just a dream!" },
      { id: "cyrine", mood: "happy", text: "Come on, Jacob! You've been staring at that ring all afternoon—I'm dragging you and Navi to my classmate's Party House (bottom-right)!" },
      { id: "jacob", mood: "sad", text: "(Letonin warned me we're in danger... I can't let Cyrine go to that party alone!)" }
    ],

    partyConfrontation: [
      { id: "sendex", mood: "angry", text: "A mere human carrying Letonin's Dream energy?! How ridiculous! I'll block everyone's perception and kill you right here!", unlockParty: ["sendex"], unlockLore: { id: "sendex_daniel", tier: 1 } },
      { id: "navi", mood: "intense", text: "You're not hurting him, Sendex! What the hell are you thinking?!" },
      { id: "illicero", mood: "intense", text: "Easy, Navi—I've got your back. Jacob, breathe! I'm Illicero, another Reaper of Order.", unlockParty: ["illicero"], unlockLore: { id: "purgatorio", tier: 2 } },
      { id: "navi", mood: "neutral", text: "Listen carefully, Jacob: Sendex is the strongest Reaper of Time, so neither of us can stop him alone—but your pure soul is resonating with both of us!", unlockLore: { id: "soul_fusion", tier: 1 } },
      { id: "illicero", mood: "happy", text: "That means YOU command BOTH of us in this 2-on-1 fight—Navi with his Lightning Halberd and me with my Soul Rapier! Let's push Sendex back!" }
    ],

    partyPostBattle: [
      { id: "illicero", mood: "intense", text: "Sendex, I think you need to leave. Start walking." },
      { id: "sendex", mood: "angry", text: "...Tch. Well played, Navi. This isn't over." }
    ],

    partyAfterWalkout: [
      { id: "jacob", mood: "intense", text: "He just walked straight out the front door... Illicero, what does your name even mean?" },
      { id: "illicero", mood: "happy", text: "It's Latin for 'seduction.' Here's my number in case things get dicey. Head home with Navi and Cyrine—there's a nasty storm rolling in." }
    ],

    snowCatCrista: [
      { id: "jacob", mood: "happy", text: "Whoa—where did this platinum white cat with blue eyes come from?! I'm naming him Crista—Latin for 'Crest.'", unlockLore: { id: "crista_cat", tier: 1 } },
      { id: "cyrine", mood: "sad", text: "It's weird... I've felt something eating at me all week, but looking at this cat gives me the exact same calm feeling I felt the night my family died..." },
      { id: "navi", mood: "intense", text: "(Rolls eyes—that's Illicero disguised in animal form watching over her.) Jacob! Your ring is glowing nonstop—Letonin is calling you!", unlockLore: { id: "crista_cat", tier: 2 } },
      { id: "letonin", mood: "intense", text: "(Through the Ring) Jacob, please trust me! Step through the Purgatorio Portal north of town to Limbach Park—only YOU can wake me up!" }
    ],

    parkSummonLetonin: [
      { id: "jacob", mood: "intense", text: "'A Deo factus est re: confusa aperire portam, quia est nomen ejus Letonin!' ...Whoa, a golden border just washed over the whole park!" },
      { id: "letonin", mood: "happy", text: "Hey Jacob. I'm finally awake—and you're even sweeter in real life than in my dreams.", unlockLore: { id: "ring_of_night", tier: 2 } },
      { id: "letonin", mood: "sad", text: "Wait... before we celebrate, I sensed something terrible back at your house. Jacob... Cyrine isn't human. She's a demon.", unlockLore: { id: "deicide_profugo", tier: 1 } },
      { id: "sendex", mood: "angry", text: "There you are, Letonin! And you brought the human! I'll burn you both to ash with Ultor!" },
      { id: "illicero", mood: "intense", text: "Stop! Look at Sendex's arm—that glowing crimson crescent is the Brand of Crepsus! Crepsus is mind-controlling him!" }
    ],

    parkSoulFusion: [
      { id: "illicero", mood: "intense", text: "Jacob, place my hand over your heart! Your soul doesn't make a weapon—it HEALS and AMPLIFIES! Let's fuse!", unlockLore: { id: "soul_fusion", tier: 2 } },
      { id: "jacob", mood: "intense", text: "Whoa!! I can feel every molecule of our souls syncing up! Letonin, ready your Obsidian Nightmare Mallet!" },
      { id: "letonin", mood: "intense", text: "With Jacob FUSED inside Illicero, we fight 2-on-1: [Jacob + Illicero] and [Letonin]! Break Crepsus's brand and save Sendex!" }
    ],

    parkPostBattle: [
      { id: "jacob", mood: "sad", text: "I entered his mindscape while Moonlight Sonata played... shattered his rusty chains and pulled the black-poisoned knife from his shoulder!", unlockLore: { id: "sendex_daniel", tier: 2 } },
      { id: "sendex", mood: "sad", text: "...You saved me, Jacob, even after I tried to kill you. Look at your shoulder and my chest—I intentionally forged a Squire Bond to be your guardian.", unlockLore: { id: "soul_fusion", tier: 3 } },
      { id: "letonin", mood: "neutral", text: "Look over there—a ten-year-old boy in a black hoodie eating a rainbow lollipop. Jacob... that's Lord Death himself. Go talk to him." }
    ],

    deathStory: [
      { id: "death", mood: "neutral", text: "Nice to formally meet you, Jacob Menos. Thank you for saving two of my children—Letonin and Sendex.", unlockParty: ["death"], unlockLore: { id: "purgatorio", tier: 3 } },
      { id: "death", mood: "sad", text: "Here is the truth: God gave me an army of 563 Angels who all died by suicide, and I trained them into Reapers. Crepsus was one of the first—my own Advisor." },
      { id: "death", mood: "intense", text: "Now Crepsus has betrayed us, hiding in a desert fortress in Casa Grande, Arizona, plotting to steal Cyrine's 'Deicide Profugo' Godslayer power.", unlockLore: { id: "corpse_circus", tier: 3 } },
      { id: "death", mood: "neutral", text: "I will not kill my own child unless balance breaks. Step through the Crimson Portal on the right—stop Crepsus!" }
    ],

    fortressEmilliaDream: [
      { id: "jacob", mood: "intense", text: "Crepsus shot Letonin with a cursed bullet and put him back to sleep! Sendex gave me sleeping pills so I could dive into Letonin's mind..." },
      { id: "emillia", mood: "angry", text: "Hmph—a newbie human shattering my phantasm spell? I'm Emillia Luve Vi Sonasa, a Siren Princess! Crepsus hired me, then teamed up with the monster who killed my mother!", unlockParty: ["emillia"], unlockLore: { id: "emillia_envy", tier: 1 } },
      { id: "letonin", mood: "happy", text: "Jacob! You rescued me again! And Emillia's switching sides to fight with us! Now let's wake up—Crepsus just cast Messes Luna!" }
    ],

    fortressEnvyIntro: [
      { id: "crepsus", mood: "angry", text: "Messes Luna! I drain the moon into a Blood Moon and summon my pride and joy—the Divine Sin of Poison, ENVY!" },
      { id: "emillia", mood: "intense", text: "Clarica... my own sister, twisted into the Cobra Sin of Envy! You murdered our mother with those Iris-venom fangs!", unlockLore: { id: "emillia_envy", tier: 2 } },
      { id: "navi", mood: "intense", text: "Letonin just shared his massive mana with me! Jacob, direct BOTH of us in this 2-on-1: Navi's Lightning Storm (Fulgur de Praeda) + Emillia's Siren Royal Voice!" }
    ],

    fortressEnvyPost: [
      { id: "emillia", mood: "intense", text: "By the Royal Voice of Sonasa... Princess Clarica, your reign of poison ends NOW!" },
      { id: "emillia", mood: "sad", text: "Wait... thousands of freed spirits just appeared—and a spirit named Mandie formed a glowing golden orb from Heaven! She told me to give it to Sendex!" }
    ],

    fortressDanielAscend: [
      { id: "cyrine", mood: "sad", text: "Sendex... when I touched Mandie's golden orb, I saw a memory of you handing me sheet music. Your real name is Daniel Flora... you're my cousin!", unlockLore: { id: "sendex_daniel", tier: 3 } },
      { id: "sendex_angel", mood: "happy", text: "...I remember everything! My black wings are turning pure white—I've ascended into an Angel! Mandie's jade axe is in my hands, and Moonlight Sonata echoes across Purgatorio!" },
      { id: "sendex_angel", mood: "sad", text: "Heaven is pulling me upward, Cyrine... Before I go, I'm awakening your true Deicide Profugo power. Avenge our family—I'll always watch over you from the stars!" }
    ],

    fortressCrepsusIntro: [
      { id: "cyrine", mood: "intense", text: "Crepsus!! You murdered my family, poisoned Jacob, and hurt everyone I love! Ancestors of the deceased—rise with my Deicide Profugo flames!", unlockLore: { id: "deicide_profugo", tier: 2 } },
      { id: "jacob", mood: "intense", text: "You're not alone, Cyrine! My Nephilim light will keep you standing—let's end this 2-on-1!" }
    ],

    fortressCrepsusPost: [
      { id: "crepsus", mood: "sad", text: "Impossible... a human and a demoness... I created a power I can't control..." },
      { id: "death", mood: "intense", text: "You threw off the balance of life and death, Crepsus—and let Envy parasite your soul. Your betrayal ends here." }
    ],

    griefAndResolve: [
      { id: "death", mood: "sad", text: "It is finished. Navi—I name you my new Advisor. And Jacob... to protect your human future, I must gently seal your memories of Purgatorio.", unlockLore: { id: "navi_alter", tier: 3 } },
      { id: "letonin", mood: "sad", text: "Wait, Death! I've served 9 years—I'm retiring! Mix Jacob's blood, Cyrine's blood, and a drop of Envy's poison. I'll give up my immortality and memories too...", unlockLore: { id: "ring_of_night", tier: 3 } },
      { id: "letonin", mood: "blush", text: "...so I can enroll as a normal human Senior at Jacob's school and fall in love with him all over again." },
      { id: "death", mood: "sad", text: "I'll miss you, my son. Go—start your new life in Colorado Springs." }
    ],

    epilogueReunion: [
      { id: "letonin", mood: "blush", text: "Months later... Funny how I transferred to Colorado Springs High with Emillia and couldn't stop staring at you in Calculus, Jacob." },
      { id: "jacob", mood: "happy", text: "And you ran all the way to my bus stop with Lindor dark chocolate to ask me to Prom! Under the moon and stars... I feel like I've loved you forever." },
      { id: "cyrine", mood: "happy", text: "Illicero and I are heading to Australia next week—you two better invite us to the wedding! (Years later, Jacob, Letonin, and their adopted son Dolan watch a shooting star... while far away, a mysterious voice whispers: 'Bitten Sweet.')" }
    ]
  }
};
