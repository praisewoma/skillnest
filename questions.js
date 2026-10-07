/* ==========================================================================
   questions.js — the question banks for the three quiz tools.
   --------------------------------------------------------------------------
   Every question is written for this project. Format:

     { q: "the question",
       options: ["A", "B", "C", "D"],
       answer: 0,          // index of the correct option (0, 1, 2 or 3)
       explain: "one or two sentences of explanation" }

   To add a question, copy one block and keep "answer" pointing at the right
   option. The quiz engine reads these arrays automatically.
   ========================================================================== */

window.SKILLNEST_QUESTIONS = {

  /* ------------------------------------------------------------------
     ENGLISH LEVEL TEST — a general mix of grammar, vocabulary,
     articles, prepositions, tenses and everyday usage.
     ------------------------------------------------------------------ */
  english: [
    {
      q: "She ___ to work by bus every morning.",
      options: ["go", "goes", "going", "is go"],
      answer: 1,
      explain: "In the present simple, he / she / it takes the -s form: she goes."
    },
    {
      q: "I have lived in this city ___ 2015.",
      options: ["for", "since", "from", "during"],
      answer: 1,
      explain: "Since introduces the starting point of a period (2015). For is used with a length of time: for ten years."
    },
    {
      q: "There isn't ___ bread left in the kitchen.",
      options: ["some", "any", "a", "many"],
      answer: 1,
      explain: "Any is normally used in negative sentences and questions; some is used in positive ones."
    },
    {
      q: "She is very good ___ solving difficult problems.",
      options: ["at", "in", "on", "with"],
      answer: 0,
      explain: "The fixed pattern is good at (doing) something."
    },
    {
      q: "They ___ dinner when the phone rang.",
      options: ["had", "were having", "have had", "are having"],
      answer: 1,
      explain: "The past continuous describes an action in progress that another past action interrupted."
    },
    {
      q: "If it rains tomorrow, we ___ at home.",
      options: ["stay", "stayed", "will stay", "staying"],
      answer: 2,
      explain: "First conditional: if + present simple, will + base verb."
    },
    {
      q: "Which word is closest in meaning to “rapid”?",
      options: ["slow", "quick", "late", "heavy"],
      answer: 1,
      explain: "Rapid and quick both describe something that happens at high speed."
    },
    {
      q: "I'm looking forward to ___ you next week.",
      options: ["meet", "meeting", "to meet", "met"],
      answer: 1,
      explain: "Look forward to is followed by a gerund (-ing form), not an infinitive."
    },
    {
      q: "___ apple a day keeps the doctor away.",
      options: ["A", "An", "The", "No article"],
      answer: 1,
      explain: "An is used before words that begin with a vowel sound."
    },
    {
      q: "He has worked in this office ___ six years.",
      options: ["since", "for", "during", "while"],
      answer: 1,
      explain: "For is used with a period of time (six years); since is used with a starting point."
    },
    {
      q: "___ do you visit your grandparents?",
      options: ["How often", "How much", "How many", "How far"],
      answer: 0,
      explain: "How often asks about frequency — the answer would be once a week or twice a month."
    },
    {
      q: "Neither of the answers ___ correct.",
      options: ["are", "is", "have been", "were"],
      answer: 1,
      explain: "Neither (of) is normally followed by a singular verb."
    },
    {
      q: "I wish I ___ more free time.",
      options: ["have", "has", "had", "will have"],
      answer: 2,
      explain: "After I wish, a past tense describes an unreal or imagined present situation."
    },
    {
      q: "The teacher ___ helped me lives nearby.",
      options: ["who", "which", "whose", "what"],
      answer: 0,
      explain: "Who introduces a relative clause about a person; which is used for things."
    },
    {
      q: "He speaks English very ___.",
      options: ["good", "well", "better", "best"],
      answer: 1,
      explain: "An adverb is needed to describe the verb speaks — that adverb is well. Good is an adjective."
    },
    {
      q: "We haven't finished the report ___.",
      options: ["already", "yet", "just", "ever"],
      answer: 1,
      explain: "Yet is used with the present perfect in negative sentences and questions."
    },
    {
      q: "Do you know what time ___?",
      options: ["is it", "it is", "does it be", "it does be"],
      answer: 1,
      explain: "In an indirect question the word order stays subject + verb: what time it is."
    },
    {
      q: "Which word is the opposite of “forget”?",
      options: ["ignore", "remember", "lose", "miss"],
      answer: 1,
      explain: "To remember is to keep something in your memory; to forget is the opposite."
    },
    {
      q: "She ___ her umbrella on the bus yesterday.",
      options: ["leaves", "left", "has left", "was leaving"],
      answer: 1,
      explain: "A finished time in the past (yesterday) requires the past simple."
    },
    {
      q: "I'm not used ___ early on Sundays.",
      options: ["to wake", "waking", "to waking", "wake"],
      answer: 2,
      explain: "Be used to is followed by a gerund: I'm not used to waking early."
    }
  ],

  /* ------------------------------------------------------------------
     VOCABULARY TEST — meanings, synonyms, antonyms and words in context.
     ------------------------------------------------------------------ */
  vocabulary: [
    {
      q: "“Abundant” means:",
      options: ["limited", "plentiful", "expensive", "ancient"],
      answer: 1,
      explain: "Abundant describes something that exists in large quantities. Its opposite is scarce."
    },
    {
      q: "Which word is the antonym of “expand”?",
      options: ["contract", "enlarge", "grow", "widen"],
      answer: 0,
      explain: "Expand means to become larger; contract means to become smaller."
    },
    {
      q: "The medicine had no ___ on my headache.",
      options: ["effect", "affect", "effort", "offer"],
      answer: 0,
      explain: "Effect is the noun: have an effect on. Affect is the verb: to influence something."
    },
    {
      q: "A “reliable” person is someone you can ___.",
      options: ["trust", "avoid", "forget", "punish"],
      answer: 0,
      explain: "Reliable means dependable — you can trust that person to do what they promised."
    },
    {
      q: "Which word is a synonym of “brave”?",
      options: ["fearful", "courageous", "timid", "nervous"],
      answer: 1,
      explain: "Brave and courageous both describe someone who faces fear without running away."
    },
    {
      q: "Which word is the antonym of “ancient”?",
      options: ["old", "modern", "historic", "faded"],
      answer: 1,
      explain: "Ancient means very old, usually from a distant past; modern means belonging to the present."
    },
    {
      q: "Please ___ the application form before Friday.",
      options: ["submit", "permit", "omit", "commit"],
      answer: 0,
      explain: "To submit a form is to hand it in officially. To omit something is to leave it out."
    },
    {
      q: "The instructions were so ___ that nobody understood them.",
      options: ["clear", "ambiguous", "brief", "correct"],
      answer: 1,
      explain: "Ambiguous means open to more than one interpretation, and therefore unclear."
    },
    {
      q: "She was ___ by the sudden loud noise.",
      options: ["startled", "started", "stated", "starved"],
      answer: 0,
      explain: "To be startled is to be suddenly surprised or frightened."
    },
    {
      q: "A person who travels to unknown places in order to learn about them is an ___.",
      options: ["engineer", "explorer", "employer", "editor"],
      answer: 1,
      explain: "An explorer travels to unfamiliar places to discover and study them."
    },
    {
      q: "A “generous” person is someone who ___.",
      options: ["shares freely", "works slowly", "complains often", "arrives late"],
      answer: 0,
      explain: "Generous describes a willingness to give time, money or help to others."
    },
    {
      q: "Which word is the antonym of “lazy”?",
      options: ["idle", "hard-working", "sleepy", "careless"],
      answer: 1,
      explain: "Lazy means unwilling to work; hard-working is the opposite."
    },
    {
      q: "The match was ___ until next Saturday because of the rain.",
      options: ["postponed", "performed", "preferred", "prevented"],
      answer: 0,
      explain: "To postpone something is to move it to a later time."
    },
    {
      q: "Her explanation was so ___ that I understood it immediately.",
      options: ["vague", "confusing", "lucid", "lengthy"],
      answer: 2,
      explain: "Lucid means expressed clearly and easy to understand."
    },
    {
      q: "The phrasal verb “give up” means:",
      options: ["to stop trying", "to continue", "to deliver", "to arrive"],
      answer: 0,
      explain: "Give up means to stop doing something, especially because it is difficult."
    },
    {
      q: "“Diligent” describes someone who is ___.",
      options: ["careless and quick", "careful and hard-working", "tired and bored", "rich and famous"],
      answer: 1,
      explain: "A diligent person works with steady, careful effort."
    },
    {
      q: "Which word is the antonym of “increase”?",
      options: ["raise", "enlarge", "decrease", "double"],
      answer: 2,
      explain: "Increase means to become larger in amount; decrease means to become smaller."
    },
    {
      q: "The new timetable will ___ every student in the school.",
      options: ["effect", "affect", "defect", "infect"],
      answer: 1,
      explain: "Affect is the verb meaning to influence. Effect is the noun (have an effect on)."
    },
    {
      q: "He has a ___ memory for faces — he never forgets one.",
      options: ["weak", "faint", "vivid", "short"],
      answer: 2,
      explain: "A vivid memory is clear, strong and detailed."
    },
    {
      q: "Choose the correct word: Prices have ___ sharply this year.",
      options: ["risen", "raised", "rose", "raise"],
      answer: 0,
      explain: "Rise is intransitive: prices rise / have risen. Raise needs an object: they raised prices."
    }
  ],

  /* ------------------------------------------------------------------
     GRAMMAR TEST — tenses, agreement, articles, prepositions,
     pronouns, sentence structure and common errors.
     ------------------------------------------------------------------ */
  grammar: [
    {
      q: "Each of the students ___ a laptop.",
      options: ["have", "has", "are having", "have been"],
      answer: 1,
      explain: "After each / every one, the verb is singular."
    },
    {
      q: "I would rather ___ at home tonight.",
      options: ["stay", "to stay", "staying", "stayed"],
      answer: 0,
      explain: "Would rather is followed by the bare infinitive (without to)."
    },
    {
      q: "___ sun rises in the east.",
      options: ["A", "An", "The", "No article"],
      answer: 2,
      explain: "The is used with a unique or shared reference such as the sun."
    },
    {
      q: "She has been waiting ___ two hours.",
      options: ["since", "for", "from", "by"],
      answer: 1,
      explain: "For is used with a period of time; since is used with a starting point."
    },
    {
      q: "Neither Tom nor his brothers ___ coming to the party.",
      options: ["is", "are", "has", "was"],
      answer: 1,
      explain: "With neither ... nor, the verb agrees with the subject nearest to it — here, brothers."
    },
    {
      q: "___ she studies regularly, she will improve quickly.",
      options: ["Unless", "Although", "If", "So that"],
      answer: 2,
      explain: "If introduces a real condition. Unless means if not and would reverse the meaning."
    },
    {
      q: "He denied ___ the money.",
      options: ["to take", "taking", "take", "took"],
      answer: 1,
      explain: "Deny is followed by a gerund (-ing form)."
    },
    {
      q: "This is the student ___ project won the first prize.",
      options: ["who", "which", "whose", "whom"],
      answer: 2,
      explain: "Whose shows possession: the student's project."
    },
    {
      q: "I ___ my homework when the lights went out.",
      options: ["did", "was doing", "have done", "am doing"],
      answer: 1,
      explain: "The past continuous describes the longer action that was interrupted."
    },
    {
      q: "There are ___ chairs in this room than in the other one.",
      options: ["less", "fewer", "much", "least"],
      answer: 1,
      explain: "Fewer is used with countable nouns (chairs); less is used with uncountable ones (less water)."
    },
    {
      q: "She is taller ___ her brother.",
      options: ["then", "than", "that", "as"],
      answer: 1,
      explain: "Than is used for comparisons; then refers to time."
    },
    {
      q: "Let's go for a walk, ___?",
      options: ["shall we", "will we", "do we", "are we"],
      answer: 0,
      explain: "After Let's, the question tag is shall we."
    },
    {
      q: "Despite ___ very hard, he failed the exam.",
      options: ["of working", "working", "to work", "worked"],
      answer: 1,
      explain: "Despite is a preposition, so it is followed by a noun or a gerund."
    },
    {
      q: "The children are playing ___ the garden.",
      options: ["on", "at", "in", "by"],
      answer: 2,
      explain: "In is used for enclosed areas such as a garden, a room or a box."
    },
    {
      q: "If I ___ you, I would apologise immediately.",
      options: ["am", "was", "were", "be"],
      answer: 2,
      explain: "The second conditional uses were for all persons in the unreal condition: If I were you."
    },
    {
      q: "Hardly ___ sat down when the phone rang.",
      options: ["he had", "had he", "did he", "he"],
      answer: 1,
      explain: "When hardly begins a sentence, the subject and auxiliary verb change places: had he sat."
    },
    {
      q: "She is one of the best players who ___ ever played for this club.",
      options: ["has", "have", "had", "having"],
      answer: 1,
      explain: "The relative clause refers back to the plural noun players, so the verb is have."
    },
    {
      q: "I can't get used ___ early in winter.",
      options: ["to wake", "wake", "to waking", "waking"],
      answer: 2,
      explain: "Get used to is followed by a gerund: get used to waking early."
    },
    {
      q: "My friend said she ___ help me the next day.",
      options: ["will", "would", "can", "shall"],
      answer: 1,
      explain: "In reported speech, will normally changes to would after a past reporting verb."
    },
    {
      q: "The film was ___ boring that we left early.",
      options: ["so", "such", "too", "very"],
      answer: 0,
      explain: "So is used before an adjective: so ... that. Such is used before a noun: such a boring film that."
    }
  ]
};
