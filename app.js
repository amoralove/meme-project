const chatFlow = [
  {
    question: "First things first - do you live in a house or an apartment?",
    options: ["House with yard", "House without yard", "Apartment"],
    key: "living"
  },
  {
    question: null,
    dynamicQuestion: function(answers) {
      return "Got it! Do you have any kids or other pets at home?";
    },
    options: ["Kids, no pets", "Pets, no kids", "Both kids and pets", "Neither"],
    key: "household"
  },
  {
    question: "How would you describe your activity level?",
    options: ["Very active (running, hiking)", "Moderately active", "Relaxed / homebody"],
    key: "activity"
  },
  {
    question: null,
    dynamicQuestion: function(answers) {
      if (answers.activity === "Very active (running, hiking)") {
        return "A runner! There are some amazing high-energy dogs who'd love a partner like you. Any size preference?";
      } else if (answers.activity === "Relaxed / homebody") {
        return "Nothing wrong with a good couch session! Plenty of dogs feel the same way. Any size preference?";
      }
      return "Nice - a good mix of active and chill. What size dog are you thinking?";
    },
    options: ["Small (under 25 lbs)", "Medium (25-60 lbs)", "Large (60+ lbs)", "No preference"],
    key: "size"
  },
  {
    question: "Are you looking for a specific age?",
    options: ["Puppy (under 1 year)", "Young adult (1-3 years)", "Adult (3-7 years)", "Senior (7+ years)", "No preference"],
    key: "age"
  },
  {
    question: "Have you had dogs before?",
    options: ["Yes, I'm experienced", "I had dogs growing up", "This would be my first dog"],
    key: "experience"
  }
];

const sampleDogs = [
  {
    name: "Luna",
    breed: "Lab Mix",
    age: "2 years",
    size: "Medium",
    energy: "High",
    icon: "\u{1F415}",
    traits: ["Great with kids", "House trained"],
    shelter: "Happy Tails Rescue",
    fee: "$250",
    goodWith: { kids: true, dogs: true, cats: false },
    sizeCategory: "medium",
    ageCategory: "young",
    energyLevel: "high",
    experienceNeeded: "beginner"
  },
  {
    name: "Benny",
    breed: "Beagle",
    age: "5 years",
    size: "Small",
    energy: "Low",
    icon: "\u{1F9AE}",
    traits: ["Good with cats", "Calm companion"],
    shelter: "Second Chance Shelter",
    fee: "$175",
    goodWith: { kids: true, dogs: true, cats: true },
    sizeCategory: "small",
    ageCategory: "adult",
    energyLevel: "low",
    experienceNeeded: "beginner"
  },
  {
    name: "Rosie",
    breed: "Poodle Mix",
    age: "9 years",
    size: "Small",
    energy: "Low",
    icon: "\u{1F429}",
    traits: ["Apartment friendly", "Gentle soul"],
    shelter: "Golden Years Rescue",
    fee: "$100",
    goodWith: { kids: true, dogs: true, cats: true },
    sizeCategory: "small",
    ageCategory: "senior",
    energyLevel: "low",
    experienceNeeded: "beginner"
  },
  {
    name: "Duke",
    breed: "German Shepherd Mix",
    age: "3 years",
    size: "Large",
    energy: "High",
    icon: "\u{1F43A}",
    traits: ["Loyal", "Needs space"],
    shelter: "Paws of Hope",
    fee: "$300",
    goodWith: { kids: true, dogs: false, cats: false },
    sizeCategory: "large",
    ageCategory: "young",
    energyLevel: "high",
    experienceNeeded: "experienced"
  },
  {
    name: "Maple",
    breed: "Corgi Mix",
    age: "1.5 years",
    size: "Medium",
    energy: "Moderate",
    icon: "\u{1F436}",
    traits: ["Playful", "Smart"],
    shelter: "Furever Friends",
    fee: "$275",
    goodWith: { kids: true, dogs: true, cats: true },
    sizeCategory: "medium",
    ageCategory: "young",
    energyLevel: "moderate",
    experienceNeeded: "beginner"
  },
  {
    name: "Bear",
    breed: "Chow Mix",
    age: "6 years",
    size: "Large",
    energy: "Low",
    icon: "\u{1F43B}",
    traits: ["Calm giant", "Independent"],
    shelter: "New Beginnings",
    fee: "$200",
    goodWith: { kids: false, dogs: false, cats: false },
    sizeCategory: "large",
    ageCategory: "adult",
    energyLevel: "low",
    experienceNeeded: "experienced"
  }
];

let currentStep = 0;
let answers = {};

function addMessage(text, isUser) {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "message " + (isUser ? "user-message" : "ai-message");

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = isUser ? "You" : "\u{1F43E}";

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = "<p>" + text + "</p>";

  div.appendChild(avatar);
  div.appendChild(content);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showOptions(options) {
  const container = document.getElementById("chatOptions");
  container.innerHTML = "";
  container.style.display = "flex";

  options.forEach(function(opt) {
    const btn = document.createElement("button");
    btn.className = "chat-option";
    btn.textContent = opt;
    btn.onclick = function() { selectOption(opt); };
    container.appendChild(btn);
  });
}

function hideOptions() {
  document.getElementById("chatOptions").style.display = "none";
}

function startChat() {
  hideOptions();
  addMessage("Yes, let's do it!", true);

  setTimeout(function() {
    addMessage(chatFlow[0].question);
    showOptions(chatFlow[0].options);
  }, 600);
}

function browseDogs() {
  hideOptions();
  addMessage("I'd rather browse dogs first", true);

  setTimeout(function() {
    addMessage("No problem! Scroll down to see some of the dogs currently looking for homes. When you're ready for personalized matches, come back and we'll chat.");
  }, 600);
}

function selectOption(option) {
  hideOptions();
  addMessage(option, true);

  var step = chatFlow[currentStep];
  answers[step.key] = option;
  currentStep++;

  if (currentStep < chatFlow.length) {
    setTimeout(function() {
      var nextStep = chatFlow[currentStep];
      var question = nextStep.dynamicQuestion
        ? nextStep.dynamicQuestion(answers)
        : nextStep.question;

      addMessage(question);
      showOptions(nextStep.options);
    }, 700);
  } else {
    setTimeout(function() {
      showResults();
    }, 700);
  }
}

function scoredog(dog) {
  var score = 50;

  var activityMap = {
    "Very active (running, hiking)": "high",
    "Moderately active": "moderate",
    "Relaxed / homebody": "low"
  };
  var preferredEnergy = activityMap[answers.activity];
  if (dog.energyLevel === preferredEnergy) {
    score += 25;
  } else if (
    (preferredEnergy === "moderate") ||
    (dog.energyLevel === "moderate")
  ) {
    score += 10;
  }

  var sizeMap = {
    "Small (under 25 lbs)": "small",
    "Medium (25-60 lbs)": "medium",
    "Large (60+ lbs)": "large"
  };
  var preferredSize = sizeMap[answers.size];
  if (!preferredSize || dog.sizeCategory === preferredSize) {
    score += 15;
  }

  var hasKids = answers.household === "Kids, no pets" || answers.household === "Both kids and pets";
  if (hasKids && !dog.goodWith.kids) {
    score -= 30;
  } else if (hasKids && dog.goodWith.kids) {
    score += 10;
  }

  var hasPets = answers.household === "Pets, no kids" || answers.household === "Both kids and pets";
  if (hasPets && !dog.goodWith.dogs) {
    score -= 20;
  }

  if (answers.experience === "This would be my first dog" && dog.experienceNeeded === "experienced") {
    score -= 15;
  }

  if (answers.living === "Apartment") {
    if (dog.sizeCategory === "large" && dog.energyLevel === "high") {
      score -= 20;
    }
  }

  var ageMap = {
    "Puppy (under 1 year)": "puppy",
    "Young adult (1-3 years)": "young",
    "Adult (3-7 years)": "adult",
    "Senior (7+ years)": "senior"
  };
  var preferredAge = ageMap[answers.age];
  if (preferredAge && dog.ageCategory === preferredAge) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

function getMatchReason(dog, score) {
  var reasons = [];

  if (answers.activity === "Very active (running, hiking)" && dog.energyLevel === "high") {
    reasons.push("high energy match for your active lifestyle");
  } else if (answers.activity === "Relaxed / homebody" && dog.energyLevel === "low") {
    reasons.push("perfect couch companion");
  }

  if (dog.goodWith.kids && (answers.household === "Kids, no pets" || answers.household === "Both kids and pets")) {
    reasons.push("great with kids");
  }

  if (dog.goodWith.cats && answers.household === "Both kids and pets") {
    reasons.push("gets along with other pets");
  }

  if (answers.living === "Apartment" && dog.sizeCategory === "small") {
    reasons.push("apartment-friendly size");
  }

  if (reasons.length === 0) {
    reasons.push("good overall compatibility");
  }

  return reasons.slice(0, 2).join(" & ");
}

function showResults() {
  var scored = sampleDogs.map(function(dog) {
    return { dog: dog, score: scoredog(dog) };
  });

  scored.sort(function(a, b) { return b.score - a.score; });

  var topMatches = scored.slice(0, 3);

  addMessage("Based on everything you've told me, here are your top matches:");

  var messages = document.getElementById("chatMessages");
  var resultsDiv = document.createElement("div");
  resultsDiv.className = "message ai-message";

  var avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "\u{1F43E}";

  var content = document.createElement("div");
  content.className = "message-content";

  var matchResults = document.createElement("div");
  matchResults.className = "match-results";

  topMatches.forEach(function(match) {
    var card = document.createElement("div");
    card.className = "match-card";

    var reason = getMatchReason(match.dog, match.score);

    card.innerHTML =
      '<div class="match-card-icon">' + match.dog.icon + '</div>' +
      '<div class="match-card-info">' +
        '<h4>' + match.dog.name +
          '<span class="match-score">' + match.score + '% match</span>' +
        '</h4>' +
        '<p>' + match.dog.breed + ' &middot; ' + match.dog.age + ' &middot; ' + match.dog.size + '</p>' +
        '<p style="margin-top:4px;color:var(--primary);font-size:0.82rem;">' + reason + '</p>' +
      '</div>';

    matchResults.appendChild(card);
  });

  content.appendChild(matchResults);
  resultsDiv.appendChild(avatar);
  resultsDiv.appendChild(content);
  messages.appendChild(resultsDiv);

  setTimeout(function() {
    addMessage("These matches are based on your " + answers.living.toLowerCase() + " living situation, " +
      answers.activity.toLowerCase() + " lifestyle, and preferences. In the full platform, you'd be able to apply to adopt any of these dogs with one click!");
  }, 800);

  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  var input = document.getElementById("chatInput");
  var text = input.value.trim();
  if (!text) return;

  addMessage(text, true);
  input.value = "";

  setTimeout(function() {
    addMessage("Thanks for sharing! In the full version of Wescue, I'd use everything you tell me to find the best matches. For now, try the guided chat above to see how matching works.");
  }, 600);
}

document.addEventListener("DOMContentLoaded", function() {
  var menuBtn = document.querySelector(".mobile-menu-btn");
  var navLinks = document.querySelector(".nav-links");

  if (menuBtn) {
    menuBtn.addEventListener("click", function() {
      navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
      if (navLinks.style.display === "flex") {
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "72px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "var(--bg)";
        navLinks.style.padding = "20px 24px";
        navLinks.style.borderBottom = "1px solid var(--border)";
        navLinks.style.gap = "16px";
      }
    });
  }
});
