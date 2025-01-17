// Create elements
const minimap = document.createElement("div");
const minimapSize = document.createElement("div");
const viewer = document.createElement("div");
const minimapContent = document.createElement("iframe");

// Constants
let realScale;

// Set class names
minimap.className = "minimap__container";
minimapSize.className = "minimap__size";
viewer.className = "minimap__viewer";
minimapContent.className = "minimap__content";

// Append elements to the minimap and body
minimap.append(minimapSize, viewer, minimapContent);
document.body.appendChild(minimap);

// Remove scripts from the HTML
const html = document.documentElement.outerHTML
	.replace(/<script\s+src="js\/about\.js"><\/script>/gi, "")
	.replace(
		/\s*<div class="line flex">\s*<p class="header-sub-title" id="word"><\/p>\s*<p class="header-sub-title blink">\|<\/p>\s*<\/div>/gi,
		'<div class="line">in despair</div>'
	);

// Write the HTML to the iframe
const iframeDoc = minimapContent.contentWindow.document;
iframeDoc.open();
iframeDoc.write(html);
iframeDoc.close();

// Function to calculate and set dimensions
function getDimensions() {
	const bodyWidth = document.body.clientWidth;
	const bodyRatio = document.body.clientHeight / bodyWidth;
	const winRatio = window.innerHeight / window.innerWidth;

	minimap.style.width = "20%";
	realScale = minimap.clientWidth / bodyWidth;

	minimapSize.style.paddingTop = `${bodyRatio * 100}%`;
	viewer.style.paddingTop = `${winRatio * 100}%`;

	minimapContent.style.transform = `scale(${realScale})`;
	minimapContent.style.width = `${100 / realScale}%`;
	minimapContent.style.height = `${100 / realScale}%`;
}

// Function to track scroll position
function trackScroll() {
	viewer.style.transform = `translateY(${window.scrollY * realScale}px)`;
}

// Drag and click handling
let isDragging = false;
let isClick = false;
let dragStartY = 0; // Track the initial mouse position when dragging starts
let initialScrollY = 0; // Track the initial scroll position when dragging starts

function handleDrag(e) {
	if (isDragging && !isClick) {
		// Calculate the mouse movement in pixels
		const dragY = e.clientY - minimap.getBoundingClientRect().top;
		const deltaY = dragY - dragStartY; // Difference from the initial click position

		// Calculate the corresponding scroll distance in the main document
		const scrollDelta = deltaY / realScale;

		// Update the scroll position
		window.scrollTo({
			top: initialScrollY + scrollDelta,
			behavior: "auto",
		});
	}
}

minimap.addEventListener("mousedown", (e) => {
	const rect = viewer.getBoundingClientRect();
	const clickY = e.clientY - minimap.getBoundingClientRect().top;

	// Check if the click is inside the viewer
	if (clickY >= rect.top && clickY <= rect.bottom) {
		isDragging = true;
		isClick = true;
		dragStartY = e.clientY - minimap.getBoundingClientRect().top; // Set the initial drag position
		initialScrollY = window.scrollY; // Set the initial scroll position
	} else {
		// If the click is outside the viewer, treat it as a click (not a drag)
		isDragging = false;
		isClick = true;
	}
});

minimap.addEventListener("mousemove", (e) => {
	if (isDragging) {
		if (isClick) isClick = false; // If the mouse moves, it's no longer just a click
		handleDrag(e);
	}
});

minimap.addEventListener("mouseup", (e) => {
	if (isClick) {
		// If it's just a click (no dragging), scroll smoothly to the clicked position
		const clickY = e.clientY - minimap.getBoundingClientRect().top;
		const scrollY =
			(clickY / minimap.clientHeight) * document.body.scrollHeight;
		window.scrollTo({
			top: scrollY - window.innerHeight / 2,
			behavior: "smooth",
		});
	}
	isDragging = false;
	isClick = false;
});

minimap.addEventListener("mouseleave", () => {
	isDragging = false;
	isClick = false;
});

// Initialize and add event listeners
getDimensions();
window.addEventListener("scroll", trackScroll);
window.addEventListener("resize", getDimensions);

// Reset scroll position and update the minimap on page load
window.addEventListener("load", () => {
	// Prevent the browser from restoring the previous scroll position
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}

	// Force the scroll position to reset
	window.scrollTo(0, 0);

	// Update the minimap viewer position
	trackScroll();
});

// Typing effect
const words = ["unraveling the mysteries     ", "trash-coding     "];
let i = 0;
let timer;

function typingEffect() {
	let word = words[i].split("");
	var loopTyping = function () {
		if (word.length > 0) {
			document.getElementById("word").innerHTML += word.shift();
		} else {
			deletingEffect();
			return false;
		}
		timer = setTimeout(loopTyping, 150);
	};
	loopTyping();
}

function deletingEffect() {
	let word = words[i].split("");
	var loopDeleting = function () {
		if (word.length > 0) {
			word.pop();
			document.getElementById("word").innerHTML = word.join("");
		} else {
			if (words.length > i + 1) {
				i++;
			} else {
				i = 0;
			}
			typingEffect();
			return false;
		}
		timer = setTimeout(loopDeleting, 20);
	};
	loopDeleting();
}

typingEffect();
