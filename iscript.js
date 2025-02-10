// iscript.js


const featureCards = document.querySelector('.feature-cards');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const circles = document.querySelectorAll('.circle');
const cards = document.querySelectorAll('.card'); // 6 cards

let currentIndex = 1; // which card is active (0..5)

// Helper: get total slide size = card width + container gap
function getSlideSize() {
  if (!cards.length) return 0;
  const cardWidth = cards[0].offsetWidth; // 400
  const style = window.getComputedStyle(featureCards);
  const gap = parseFloat(style.gap) || 0;
  return cardWidth + gap; // e.g., 400 + 25 = 425
}

// Center the card in the container
function scrollToCard(index) {
  const cardWidth = cards[0].offsetWidth; // 400
  const containerWidth = featureCards.offsetWidth; 
  const slideSize = getSlideSize();

  // Middle of the target card
  const cardCenter = (index * slideSize) + (cardWidth / 2);

  // We want cardCenter to appear in the middle of featureCards
  let leftPos = cardCenter - (containerWidth / 2);

  // Clamp to avoid overscrolling
  const maxScroll = featureCards.scrollWidth - containerWidth;
  if (leftPos < 0) leftPos = 0;
  if (leftPos > maxScroll) leftPos = maxScroll;
  

  featureCards.scrollTo({
    left: leftPos,
    behavior: 'smooth',
  });

  updateActiveCard(index);
  updateActiveCircle(index);
  updateArrows();
}

// function updateArrows() {
//   // If at first card
//   if (currentIndex === 0) leftArrow.classList.add('disabled');
//   else leftArrow.classList.remove('disabled');

//   // If at last card
//   if (currentIndex === cards.length - 1) rightArrow.classList.add('disabled');
//   else rightArrow.classList.remove('disabled');
// }

// Highlight the active circle
function updateActiveCircle(index) {
  circles.forEach((circle, i) => {
    circle.classList.toggle('active', i === index);
  });
}

// "Magnify" the active card
function updateActiveCard(index) {
  cards.forEach((card, i) => {
    card.classList.toggle('active-card', i === index);
  });
}

// ARROW EVENTS
leftArrow.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    scrollToCard(currentIndex);
  }
});
rightArrow.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    scrollToCard(currentIndex);
  }
});

// CIRCLE EVENTS
circles.forEach((circle, index) => {
  circle.addEventListener('click', () => {
    currentIndex = index;
    scrollToCard(currentIndex);
  });
});

// MANUAL SCROLL => detect which card is nearest
featureCards.addEventListener('scroll', () => {
  const slideSize = getSlideSize();
  const scrollLeft = featureCards.scrollLeft;
  // approximate the center of the container
  const containerCenter = scrollLeft + (featureCards.offsetWidth / 2);

  // figure out which card's center is nearest containerCenter
  // cardCenter for card i is i*slideSize + (cardWidth/2).
  // We'll pick whichever i has the minimal distance from containerCenter
  let bestIndex = 0;
  let smallestDist = Infinity;

  for (let i = 0; i < cards.length; i++) {
    const cardCenter = (i * slideSize) + (cards[0].offsetWidth / 2);
    const dist = Math.abs(cardCenter - containerCenter);
    if (dist < smallestDist) {
      bestIndex = i;
      smallestDist = dist;
    }
  }

  if (bestIndex !== currentIndex) {
    currentIndex = bestIndex;
    updateActiveCard(currentIndex);
    updateActiveCircle(currentIndex);
    updateArrows();
  }
});

// INIT
updateActiveCard(currentIndex);
updateActiveCircle(currentIndex);
updateArrows();

