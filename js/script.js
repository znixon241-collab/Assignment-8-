
console.log("script.js connected!");

const selections = {}; 

const categoryDescriptions = {
  Explorer:
    "Curious and adventurous—you thrive on new ideas, places, and experiences. You’re great at finding opportunities others miss.",
  Artist:
    "Imaginative and expressive—you turn concepts into compelling visuals, sounds, or experiences. Originality is your superpower.",
  Leader:
    "Organized and energizing—you bring people together and move projects forward. You create clarity and momentum.",
  Thinker:
    "Analytical and deliberate—you love patterns, systems, and depth. You make smart calls with strong reasoning."
};

const categoryEmojis = {
  Explorer: "🧭",
  Artist: "🎨",
  Leader: "🧩",
  Thinker: "🧠"
};


function initAnswerToggles() {
  const blocks = document.querySelectorAll(".question-block");
  blocks.forEach(block => {
    const qid = block.getAttribute("data-question-id");
    const buttons = block.querySelectorAll(".answer-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
    
        buttons.forEach(b => {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        })

        btn.classList.add("selected");
        btn.setAttribute("aria-pressed", "true");

    
        const points = Number(btn.getAttribute("data-points"));
        const category = btn.getAttribute("data-category");
        const answer = btn.getAttribute("data-answer");

        selections[qid] = { points, category, answer };
    
        console.log(`Selected ${qid}:`, selections[qid]);
      });
    });
  });
}

function displayResult() {
  const requiredBlocks = document.querySelectorAll(".question-block");
  const answeredCount = Object.keys(selections).length;

  if (answeredCount < requiredBlocks.length) {
    updateResultHTML({
      title: "Almost there!",
      lead:
        `You’ve answered ${answeredCount} of ${requiredBlocks.length} questions. Pick one answer per question.`,
      category: null
    });
    return;
  }

  
  const categoryTotals = { Explorer: 0, Artist: 0, Leader: 0, Thinker: 0 };
  let totalPoints = 0;

  Object.values(selections).forEach(({ points, category }) => {
    totalPoints += points;
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += points;
    }
  });

  
  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      
      const maxA = maxPointsForCategory(a[0]);
      const maxB = maxPointsForCategory(b[0]);
      if (maxB !== maxA) return maxB - maxA;
      return a[0].localeCompare(b[0]); 
    })[0][0];

  updateResultHTML({
    title: `${categoryEmojis[topCategory]} You’re a ${topCategory}!`,
    lead: categoryDescriptions[topCategory],
    category: topCategory,
    totals: categoryTotals,
    score: totalPoints
  });
}

function maxPointsForCategory(cat) {
  
  const chosen = Object.values(selections).filter(s => s.category === cat);
  return chosen.length ? Math.max(...chosen.map(s => s.points)) : 0;
}


function updateResultHTML({ title, lead, category, totals = null, score = null }) {
  const container = document.getElementById("result-container");
  container.innerHTML = ""; 

  const wrapper = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = title;
  wrapper.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = lead;
  wrapper.appendChild(p);

  if (category) {
    const badge = document.createElement("span");
    badge.className = "result-badge";
    badge.textContent = category;
    wrapper.appendChild(badge);
  }

  if (totals) {
    const list = document.createElement("ul");
    list.className = "mt-3 small";
    list.innerHTML = `
      <li>Explorer: ${totals.Explorer}</li>
      <li>Artist: ${totals.Artist}</li>
      <li>Leader: ${totals.Leader}</li>
      <li>Thinker: ${totals.Thinker}</li>
      ${score !== null ? `<li class="mt-1 fw-semibold">Total Points: ${score}</li>` : ""}
    `;
    wrapper.appendChild(list);
  }

  container.appendChild(wrapper);
}


function resetQuiz() {

  for (const k in selections) delete selections[k];

  
  document.querySelectorAll(".answer-btn").forEach(btn => {
    btn.classList.remove("selected");
    btn.setAttribute("aria-pressed", "false");
  });

  
  updateResultHTML({
    title: "Your result will appear here",
    lead: "Complete the quiz to see your match!",
    category: null
  });
}


document.getElementById("resultBtn").addEventListener("click", displayResult);
document.getElementById("resetBtn").addEventListener("click", resetQuiz);


initAnswerToggles();
