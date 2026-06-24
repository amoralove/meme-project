/* ===== Carousel ===== */
(function() {
  var track = document.getElementById("carouselTrack");
  var prevBtn = document.getElementById("carouselPrev");
  var nextBtn = document.getElementById("carouselNext");
  var dotsContainer = document.getElementById("carouselDots");
  var cards = track ? track.querySelectorAll(".carousel-card") : [];

  var currentIndex = 0;
  var autoInterval = null;

  function getVisibleCount() {
    var w = window.innerWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function getCardWidth() {
    if (!cards.length) return 0;
    return cards[0].offsetWidth + 24;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateTrack() {
    var offset = currentIndex * getCardWidth();
    track.style.transform = "translateX(-" + offset + "px)";
    updateDots();
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    var max = getMaxIndex();
    for (var i = 0; i <= max; i++) {
      var dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === currentIndex ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener("click", function() {
        currentIndex = parseInt(this.dataset.index);
        updateTrack();
        resetAuto();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach(function(dot, i) {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goNext() {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateTrack();
  }

  function goPrev() {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateTrack();
  }

  function startAuto() {
    autoInterval = setInterval(goNext, 4000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener("click", function() { goPrev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function() { goNext(); resetAuto(); });

  // Touch / swipe support
  var startX = 0;
  var isDragging = false;

  if (track) {
    track.addEventListener("touchstart", function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener("touchend", function(e) {
      if (!isDragging) return;
      isDragging = false;
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
        resetAuto();
      }
    }, { passive: true });
  }

  window.addEventListener("resize", function() {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    buildDots();
    updateTrack();
  });

  if (cards.length) {
    buildDots();
    updateTrack();
    startAuto();
  }
})();


/* ===== Mobile Nav ===== */
(function() {
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function() {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        navLinks.classList.remove("open");
      });
    });
  }
})();


/* ===== Chat Demo ===== */
var chatFlow = [
  {
    question: "First things first - do you live in a house or an apartment?",
    options: ["House with yard", "House without yard", "Apartment"],
    key: "living"
  },
  {
    question: null,
    dynamicQuestion: function() {
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
    dynamicQuestion: function() {
      if (answers.activity === "Very active (running, hiking)") {
        return "A runner! There are some amazing high-energy dogs who'd love a partner like you. Any size preference?";
      }
      if (answers.activity === "Relaxed / homebody") {
        return "Nothing wrong with a good couch session! Plenty of dogs feel the same way. Size preference?";
      }
      return "Nice - a good mix of active and chill. What size dog are you thinking?";
    },
    options: ["Small (under 25 lbs)", "Medium (25-60 lbs)", "Large (60+ lbs)", "No preference"],
    key: "size"
  },
  {
    question: "Are you looking for a specific age?",
    options: ["Puppy (under 1 yr)", "Young adult (1-3 yrs)", "Adult (3-7 yrs)", "Senior (7+ yrs)", "No preference"],
    key: "age"
  },
  {
    question: "Have you had dogs before?",
    options: ["Yes, I'm experienced", "I had dogs growing up", "First dog!"],
    key: "experience"
  }
];

var sampleDogs = [
  { name: "Luna", breed: "Lab Mix", age: "2 yrs", size: "Medium", icon: "\u{1F415}", energy: "high", sizeCategory: "medium", ageCategory: "young", goodWith: { kids: true, dogs: true, cats: false }, experienceNeeded: "beginner", shelter: "Happy Tails", fee: "$250" },
  { name: "Benny", breed: "Beagle", age: "5 yrs", size: "Small", icon: "\u{1F9AE}", energy: "low", sizeCategory: "small", ageCategory: "adult", goodWith: { kids: true, dogs: true, cats: true }, experienceNeeded: "beginner", shelter: "Second Chance", fee: "$175" },
  { name: "Rosie", breed: "Poodle Mix", age: "9 yrs", size: "Small", icon: "\u{1F429}", energy: "low", sizeCategory: "small", ageCategory: "senior", goodWith: { kids: true, dogs: true, cats: true }, experienceNeeded: "beginner", shelter: "Golden Years", fee: "$100" },
  { name: "Duke", breed: "GSD Mix", age: "3 yrs", size: "Large", icon: "\u{1F43A}", energy: "high", sizeCategory: "large", ageCategory: "young", goodWith: { kids: true, dogs: false, cats: false }, experienceNeeded: "experienced", shelter: "Paws of Hope", fee: "$300" },
  { name: "Maple", breed: "Corgi Mix", age: "1.5 yrs", size: "Medium", icon: "\u{1F436}", energy: "moderate", sizeCategory: "medium", ageCategory: "young", goodWith: { kids: true, dogs: true, cats: true }, experienceNeeded: "beginner", shelter: "Furever Friends", fee: "$275" },
  { name: "Bear", breed: "Chow Mix", age: "6 yrs", size: "Large", icon: "\u{1F43B}", energy: "low", sizeCategory: "large", ageCategory: "adult", goodWith: { kids: false, dogs: false, cats: false }, experienceNeeded: "experienced", shelter: "New Beginnings", fee: "$200" }
];

var currentStep = 0;
var answers = {};

function addMessage(text, isUser) {
  var messages = document.getElementById("chatMessages");
  var div = document.createElement("div");
  div.className = "message " + (isUser ? "user-message" : "ai-message");

  var avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = isUser ? "You" : "\u{1F43E}";

  var bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  if (!isUser) {
    bubble.style.borderRadius = "255px 15px 225px 15px / 15px 225px 15px 255px";
  }
  bubble.innerHTML = "<p>" + text + "</p>";

  div.appendChild(avatar);
  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showOptions(options) {
  var container = document.getElementById("chatOptions");
  container.innerHTML = "";
  container.style.display = "flex";
  options.forEach(function(opt) {
    var btn = document.createElement("button");
    btn.className = "btn-sketchy chat-opt";
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
  addMessage("I'd rather browse first", true);
  setTimeout(function() {
    addMessage("No problem! Scroll down to meet some of the dogs waiting for homes. Come back when you're ready for personalized matches!");
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
      var question = nextStep.dynamicQuestion ? nextStep.dynamicQuestion() : nextStep.question;
      addMessage(question);
      showOptions(nextStep.options);
    }, 700);
  } else {
    setTimeout(showResults, 700);
  }
}

function scoreDog(dog) {
  var score = 50;
  var energyMap = { "Very active (running, hiking)": "high", "Moderately active": "moderate", "Relaxed / homebody": "low" };
  var preferred = energyMap[answers.activity];
  if (dog.energy === preferred) score += 25;
  else if (preferred === "moderate" || dog.energy === "moderate") score += 10;

  var sizeMap = { "Small (under 25 lbs)": "small", "Medium (25-60 lbs)": "medium", "Large (60+ lbs)": "large" };
  var prefSize = sizeMap[answers.size];
  if (!prefSize || dog.sizeCategory === prefSize) score += 15;

  var hasKids = answers.household === "Kids, no pets" || answers.household === "Both kids and pets";
  if (hasKids && !dog.goodWith.kids) score -= 30;
  else if (hasKids && dog.goodWith.kids) score += 10;

  var hasPets = answers.household === "Pets, no kids" || answers.household === "Both kids and pets";
  if (hasPets && !dog.goodWith.dogs) score -= 20;

  if (answers.experience === "First dog!" && dog.experienceNeeded === "experienced") score -= 15;

  if (answers.living === "Apartment" && dog.sizeCategory === "large" && dog.energy === "high") score -= 20;

  return Math.max(0, Math.min(100, score));
}

function getMatchReason(dog) {
  var reasons = [];
  if (answers.activity === "Very active (running, hiking)" && dog.energy === "high") reasons.push("high energy match");
  else if (answers.activity === "Relaxed / homebody" && dog.energy === "low") reasons.push("perfect couch companion");
  if (dog.goodWith.kids && (answers.household === "Kids, no pets" || answers.household === "Both kids and pets")) reasons.push("great with kids");
  if (answers.living === "Apartment" && dog.sizeCategory === "small") reasons.push("apartment-friendly");
  if (!reasons.length) reasons.push("good overall fit");
  return reasons.slice(0, 2).join(" & ");
}

function showResults() {
  var scored = sampleDogs.map(function(dog) {
    return { dog: dog, score: scoreDog(dog) };
  }).sort(function(a, b) { return b.score - a.score; });

  var top = scored.slice(0, 3);
  addMessage("Based on everything you've told me, here are your top matches:");

  var messages = document.getElementById("chatMessages");
  var wrapper = document.createElement("div");
  wrapper.className = "message ai-message";

  var avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "\u{1F43E}";

  var bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.style.borderRadius = "255px 15px 225px 15px / 15px 225px 15px 255px";

  var results = document.createElement("div");
  results.className = "match-results";

  top.forEach(function(match) {
    var card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML =
      '<div class="match-card-icon">' + match.dog.icon + '</div>' +
      '<div class="match-card-info">' +
        '<h4>' + match.dog.name + '<span class="match-score">' + match.score + '%</span></h4>' +
        '<p>' + match.dog.breed + ' &middot; ' + match.dog.age + ' &middot; ' + match.dog.size + '</p>' +
        '<p style="color:var(--accent);font-size:0.88rem;margin-top:2px;">' + getMatchReason(match.dog) + '</p>' +
      '</div>';
    results.appendChild(card);
  });

  bubble.appendChild(results);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  messages.appendChild(wrapper);

  setTimeout(function() {
    addMessage("In the full version, you'd apply to adopt any of these dogs with one click. Your " + answers.living.toLowerCase() + " setup and " + answers.activity.toLowerCase() + " lifestyle helped us narrow it down!");
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
    addMessage("Thanks for sharing! In the full version, I'd use everything you tell me to find the best matches. Try the guided chat above to see matching in action!");
  }, 600);
}
