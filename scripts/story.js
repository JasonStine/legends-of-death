// Storyline, battle briefings, quests, and Lore Codex content.
// =========================================================
// scripts/story.js — Enhanced Novel Storyline, Clear Battle
//                    Explanations, Quests, & Lore Codex
// =========================================================
window.Story = {
  // Ordered quest milestones (questStage = 0 .. 8)
  quests: [
    {
      act: "ACT I",
      title: "Starlit Funeral",
      objective: "Enter St. Jude Church (top-left) and comfort Cyrine.",
      mapHint: "church",
      targetLabel: "St. Jude Church"
    },
    {
      act: "ACT II",
      title: "A Night's Rest",
      objective: "Go inside Jacob's House and rest on the Couch or Bed.",
      mapHint: "house",
      targetLabel: "Jacob's Couch / Bed"
    },
    {
      act: "ACT II",
      title: "The Dreamer's Reign",
      objective: "Speak with Letonin across the glowing Cherry Blossom Lake.",
      mapHint: "dream",
      targetLabel: "Letonin"
    },
    {
      act: "ACT III",
      title: "Liar's Cry",
      objective: "Enter the Party House (bottom-right) where Cyrine dragged you.",
      mapHint: "party",
      targetLabel: "Party House"
    },
    {
      act: "ACT III",
      title: "Awaken the Sleeper",
      objective: "Enter the Purgatorio Portal to Limbach Park and summon Letonin.",
      mapHint: "park",
      targetLabel: "Limbach Park Portal"
    },
    {
      act: "ACT IV",
      title: "Blood Moon Rising",
      objective: "Step through the Crimson Portal in Limbach Park to Casa Grande.",
      mapHint: "fortress",
      targetLabel: "Casa Grande Fortress"
    },
    {
      act: "ACT V",
      title: "Deicide Profugo",
      objective: "Confront Crepsus in Casa Grande to end the Reaperian Civil War.",
      mapHint: "fortress",
      targetLabel: "Crepsus"
    },
    {
      act: "EPILOGUE",
      title: "Reset; Start",
      objective: "Peace restored! Talk to Letonin & Cyrine in Colorado Springs.",
      mapHint: "overworld",
      targetLabel: "Colorado Springs"
    }
  ],

  lore: [
    {
      title: "Purgatorio",
      text: "A parallel supernatural dimension layered over the human world. Most humans cannot see or touch beings in Purgatorio, though young children and Nephilim like Jacob are rare exceptions."
    },
    {
      title: "The 4 Reapers of Order",
      text: "Elite servants of Death who balance life and death across the 7 continents: Letonin (Dreams), Illicero (Souls), Navi (Lightning), and Sendex (Fire). Each possesses a Caeleste combat form."
    },
    {
      title: "Alter & Squire Bonds",
      text: "Reapers use 'Alter' to rewrite human memories—like Navi posing as Cyrine's older brother. A Squire Bond links a human's soul to a Reaper guardian, sharing power and memories."
    },
    {
      title: "Jacob's Soul Resonance",
      text: "Unlike ordinary humans whose souls forge weapons for Illicero, Jacob's Nephilim soul heals, amplifies, and FUSES with Reapers—allowing him to fight alongside allies in 2-on-1 battles."
    },
    {
      title: "Deicide Profugo",
      text: "Cyrine's dormant demonic lineage—a Godslayer breed capable of summoning ancestral spirits and annihilating even divine beings. Crepsus murdered her family to awaken and steal this power."
    }
  ],

  // Key story dialogues with crystal-clear context
  dialogues: {
    intro: [
      { id: "jacob", mood: "sad", text: "April 23rd — Colorado Springs. A week and a half ago, Cyrine's entire family was murdered in what detectives call the 'Corpse Circus.'" },
      { id: "jacob", mood: "sad", text: "She's waiting inside St. Jude Church right now. Mom offered to let Cyrine and her older brother Navi stay at our house." },
      { id: "jacob", mood: "neutral", text: "Let's walk north-west into St. Jude Church and check on her. (Follow the golden quest arrow!)" }
    ],

    churchCyrine: [
      { id: "cyrine", mood: "sad", text: "I couldn't even say goodbye, Jacob... The detectives said it was a forked weapon laced with concentrated Iris and Belladonna poison." },
      { id: "cyrine", mood: "angry", text: "What if the man who killed them comes for me next? Staying at your house puts you and your mom in danger!" },
      { id: "jacob", mood: "neutral", text: "You're not going anywhere, Cyrine. You have me, my mom, and your brother Navi right here. We'll be alright—I promise." },
      { id: "cyrine", mood: "sad", text: "...Whatever you gotta tell yourself, Jacob. Let's head back to your house. You look exhausted." },
      { id: "jacob", mood: "neutral", text: "Got it. Let's head inside Jacob's House (north-east) and get some sleep on the living room couch or my bed." }
    ],

    sleepPrompt: [
      { id: "navi", mood: "neutral", text: "I made pancakes and quiche in the kitchen for tomorrow morning. Go ahead and get some rest, Jacob—you've had a long week." },
      { id: "jacob", mood: "neutral", text: "Thanks, Navi. Even if I barely know you, your cooking is unreal... Alright, time to lie down and get some sleep." }
    ],

    dreamLetonin: [
      { id: "letonin", mood: "happy", text: "Hey there, Jacob. Relax—you're safe. You're standing in my Dream Realm, a psychic space I merged with your mind while you sleep." },
      { id: "jacob", mood: "intense", text: "Wait... you're not just a dream?! Who are you? And how do you know about Cyrine?!" },
      { id: "letonin", mood: "sad", text: "My name is Letonin, one of the four Reapers of Order. I've been trapped in a poison-induced coma for two years—and the killer who murdered Cyrine's family is after you both." },
      { id: "letonin", mood: "blush", text: "Take this—the Ring of Night. Even when you wake up in the real world, it will stay on your finger so I can protect you and reach you again." },
      { id: "letonin", mood: "neutral", text: "One more thing: Navi is NOT Cyrine's real brother. He's a Reaper hiding under a memory spell called 'Alter'—he means well, though. Now wake up... trouble is already heading to your friend's party!" }
    ],

    afterDreamWake: [
      { id: "jacob", mood: "intense", text: "Whoa... the Ring of Night is ACTUALLY on my hand! It wasn't just a dream!" },
      { id: "cyrine", mood: "happy", text: "Come on, Jacob! I'm dragging you and Navi to my classmate's house party down south-east to take our minds off things!" },
      { id: "jacob", mood: "sad", text: "(Letonin warned me we're in danger... I better follow Cyrine to the Party House and keep an eye on her!)" }
    ],

    // EXPLICITLY EXPLAINS WHY THERE ARE 2 FIGHTERS ON YOUR SIDE!
    partyConfrontation: [
      { id: "sendex", mood: "angry", text: "There you are! A mere human carrying Letonin's Dream energy?! I'll block everyone's perception and kill you right here!" },
      { id: "navi", mood: "intense", text: "You're not laying a finger on Jacob, Sendex! What the hell has gotten into you?!" },
      { id: "illicero", mood: "intense", text: "Easy, Navi—I've got your back. Jacob, don't panic! I'm Illicero, another Reaper of Order." },
      { id: "navi", mood: "neutral", text: "Listen carefully, Jacob: Sendex is the strongest of us, so neither of us can stop him alone. Your pure soul is already resonating with ours!" },
      { id: "illicero", mood: "happy", text: "That means YOU'LL be commanding BOTH of us in this 2-on-1 battle—Navi with his Lightning Halberd and me with my Soul Rapier! Let's knock some sense into Sendex!" }
    ],

    // POST-FIGHT CUTSCENE DIALOGUE (Before Sendex walks out!)
    partyPostBattle: [
      { id: "illicero", mood: "intense", text: "Enough, Sendex. You're outnumbered and out of line. Start walking." },
      { id: "sendex", mood: "angry", text: "...Tch. Fine. Enjoy your little human while you still can, Illicero." }
    ],

    partyAfterWalkout: [
      { id: "jacob", mood: "intense", text: "Wait... he just walked straight out the front door! Who WAS that guy, and why did he call you Reapers?!" },
      { id: "illicero", mood: "happy", text: "I'm Illicero—Latin for seduction, if you're wondering. Look, Letonin's ring is pulsing hard. He wants you to meet him at Limbach Park." },
      { id: "navi", mood: "sad", text: "The Purgatorio Portal just opened north of town. Head through it to Limbach Park—I'll guard Cyrine and meet you there." }
    ],

    // LIMBACH PARK — EXPLAINS SOUL FUSION & WHY 2 CHARACTERS FIGHT!
    parkAwaken: [
      { id: "letonin", mood: "happy", text: "You actually chanted the Latin summoning incantation... Jacob, you broke my two-year coma! I'm finally awake in Purgatorio!" },
      { id: "jacob", mood: "blush", text: "Letonin! You're really standing right here in front of me!" },
      { id: "sendex", mood: "angry", text: "There you are, Letonin! And you brought the human! I'll burn you both to ash with Ultor!" },
      { id: "illicero", mood: "intense", text: "Wait—Sendex has a glowing crimson brand on his arm! Crepsus is mind-controlling him! Jacob, place my hand over your heart!" },
      { id: "jacob", mood: "intense", text: "Whoa!! I can feel our souls fusing together! Every ounce of my healing power is flowing straight into Illicero!" },
      { id: "letonin", mood: "intense", text: "Incredible! With Jacob FUSED inside Illicero's soul, you'll fight as a 2-unit team: [Jacob + Illicero] together alongside [Letonin] with his Dream Mallet! Break Crepsus's brand!" }
    ],

    parkPostBattle: [
      { id: "jacob", mood: "sad", text: "I shattered the chains inside his mind... The crimson brand on Sendex's arm just burned away!" },
      { id: "sendex", mood: "sad", text: "...Jacob? You saved me—even after I tried to kill you? Then I swear a Squire Bond to you. I'll be your guardian." },
      { id: "death", mood: "neutral", text: "Well done, Jacob Menos. I am Death. Crepsus—my own Rogue Advisor—is hiding in Casa Grande, Arizona, preparing a Blood Moon ritual to steal Cyrine's demonic power." },
      { id: "death", mood: "intense", text: "I cannot slay my own child unless balance is broken. Step through the Crimson Portal here in Limbach Park and stop Crepsus!" }
    ],

    fortressEnvyIntro: [
      { id: "crepsus", mood: "angry", text: "Welcome to Casa Grande! Too late—Messes Luna! I drain the moon's light to summon the Divine Sin of Poison: ENVY!" },
      { id: "emillia", mood: "intense", text: "Not so fast, Crepsus! I'm Emillia—Siren Princess—and that giant serpent is my corrupted sister Clarica! She murdered our mother!" },
      { id: "navi", mood: "intense", text: "Letonin, link your mana to mine! Jacob, direct Navi (Lightning Storm) and Emillia (Siren Royal Voice) in this 2-on-1 fight to bring Envy down!" }
    ],

    fortressEnvyPost: [
      { id: "emillia", mood: "intense", text: "By the Royal Voice of Sonasa... Clarica, your reign of poison ends NOW!" },
      { id: "sendex", mood: "happy", text: "Envy's fallen... and Cyrine—holding Mandie's orb—you're my cousin! I remember my human life... I'm Daniel Flora!" },
      { id: "sendex_angel", mood: "happy", text: "My black wings just turned pure white... I've ascended into an Angel! Before Heaven pulls me upward, I'm awakening your true power, Cyrine—avenge our family!" }
    ],

    fortressCrepsusIntro: [
      { id: "cyrine", mood: "intense", text: "Crepsus... YOU killed my family. You hurt Jacob, Illicero, and Danny. My Deicide Profugo flames are awake!" },
      { id: "jacob", mood: "intense", text: "You're not fighting him alone, Cyrine! My Nephilim healing light will keep you standing—let's end this 2-on-1!" }
    ],

    fortressCrepsusPost: [
      { id: "crepsus", mood: "sad", text: "Impossible... a human and a demoness... I only wanted power beyond Death..." },
      { id: "death", mood: "intense", text: "You shattered the balance of life and death, Crepsus. Your betrayal ends here." },
      { id: "death", mood: "neutral", text: "It is finished. Return home to Colorado Springs—your new beginning awaits." }
    ],

    epilogueLetonin: [
      { id: "letonin", mood: "blush", text: "Months later... I gave up my immortality and memories so we could both start over as normal Seniors at Colorado Springs High." },
      { id: "jacob", mood: "happy", text: "And somehow, even without remembering Purgatorio, we still found our way right back to each other under the stars." },
      { id: "cyrine", mood: "happy", text: "You two are hopeless! Congratulations on completing Legends of Death and the Reapers of Time!" }
    ]
  }
};
