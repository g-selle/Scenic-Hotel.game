function showScreen(screenToShow) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    if (screenToShow) {
        screenToShow.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {

    /* ───────── BASIC ELEMENTS ───────── */
    const landingScreen = document.getElementById("landing-screen");
    const storyScreen = document.getElementById("story-screen");
    const landingContinue = document.getElementById("landing-continue");
    const storyText = document.getElementById("story-text");
    const storyContinue = document.getElementById("story-continue");
    const introVideo = document.getElementById("background-video");
    const backgroundMusic = document.getElementById("background-music");

    const puzzle1Screen = document.getElementById("puzzle1-screen");
    const puzzle2Screen = document.getElementById("puzzle2-screen");
    const puzzle3Screen = document.getElementById("puzzle3-screen");
    const puzzle4Screen = document.getElementById("puzzle4-screen");
    const suspectScreen = document.getElementById("suspect-screen");
    const resultScreen = document.getElementById("result-screen");

    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    const caseNumber = document.getElementById("case-number");
    const closeModal = document.getElementById("close-modal");
    const chooseButton = document.getElementById("choose-suspect-button");
    const resultText = document.getElementById("result-text");

    const heartbeatSound = document.getElementById("heartbeat-sound");
    const endingMusic = document.getElementById("ending-music");
    const backButton = document.getElementById("go-back-button");

    let selectedSuspect = null;
    const realCulprit = "Mr. Gray";

    /* ───────── SUSPECT INFO ───────── */
    const suspectInfo = {
        "Mr. Black": {
            case: "SH-017",
            content: `
NAME: Marcus Black
ROLE: Hotel Manager

CLAIMED ALIBI:
In office reviewing quarterly finances (9:30–11:00 PM)

EVIDENCE:
• Financial logs accessed at 10:42 PM
• System administrator confirms late-night override request
• Witness #2 reports seeing him near server hallway

⚠ CONTRADICTION:
Minor inconsistencies in reported timeline.
States he "doesn't recall" leaving his office.
`
        },
        "Ms. White": {
            case: "SH-023",
            content: `
NAME: Elaine White
ROLE: Housekeeping

ALIBI:
Clocked out at 9:00 PM
Keycard shows brief re-entry at 9:18 PM

INVOLVEMENT:
• Assisted victim with internal documents
• Aware of possible financial misconduct
• Reported missing files days prior

WITNESS NOTE:
States the victim seemed anxious.
Claimed she feared someone "closer than she realized."
`
        },
        "Mr. Gray": {
            case: "SH-031",
            content: `
NAME ON FILE: Thomas Gray
ROLE: Maintenance

Employment began 6 months prior to hotel closure.

CLAIMED ALIBI:
Responding to basement leak (9:40–10:30 PM)

EVIDENCE:
• Maintenance log updated at 10:42 PM
• Basement security camera temporarily offline
• Personnel file processed under temporary identification
• Background documentation partially restricted

⚠ INVESTIGATION NOTE:
Employment records appear recently amended.
Original legal name currently sealed under review.
`
        }
    };

    /* ───────── BACK BUTTON & MODAL ───────── */
    backButton.classList.add("hidden"); // start hidden

    document.querySelectorAll(".inspect-button").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".suspect-card");
            const name = card.dataset.suspect;
            selectedSuspect = name;

            caseNumber.textContent = "CASE " + suspectInfo[name].case;
            modalText.textContent = suspectInfo[name].content;

            modal.classList.remove("hidden");
            backButton.classList.remove("hidden");
        });
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
        backButton.classList.add("hidden");
    });

    backButton.addEventListener("click", () => {
        modal.classList.add("hidden");
        backButton.classList.add("hidden");
    });

    /* ───────── LANDING → STORY ───────── */
    landingContinue.addEventListener("click", () => {
        showScreen(storyScreen);

        if (introVideo) {
            introVideo.currentTime = 0;
            introVideo.play().catch(() => {});
        }

        typeStory([
            "The Scenic Hotel changed overnight.\n\n",
            "Rooms once full… now empty.\n",
            "Guests… vanished without a trace.\n\n",
            "The official story?\n",
            "\"Nothing to worry about.\"\n\n",
            "But hotels don’t fall silent overnight without a reason.\n",
            "They don’t erase records.\n",
            "They don’t hide people.\n\n",
            "Something happened here.\n",
            "Something buried in the shadows of these halls.\n\n",
            "A journalist… by the name of Evelyn Bloom…\n",
            "was the first to search for answers.\n\n",
            "She like many others entered the hotel.\n",
            "And never came out.\n\n",
            "Now it’s up to you to figure out what happened.\n"
        ]);
    });

    function typeStory(lines) {
        backgroundMusic?.play().catch(() => {});
        storyText.textContent = "";
        storyContinue.classList.add("hidden");

        let line = 0;
        let char = 0;

        function type() {
            if (line < lines.length) {
                if (char < lines[line].length) {
                    storyText.textContent += lines[line][char++];
                    setTimeout(type, 40);
                } else {
                    char = 0;
                    line++;
                    setTimeout(type, 300);
                }
            } else {
                storyContinue.classList.remove("hidden");
            }
        }

        type();
    }

    storyContinue.addEventListener("click", () => {
        showScreen(puzzle1Screen);
    });

    /* ───────── PUZZLES (1 → 4) ───────── */
    // Puzzle 1
    document.querySelectorAll(".object").forEach(obj => {
        obj.addEventListener("click", () => {
            const msg = document.getElementById("puzzle1-message");
            if (obj.dataset.id === "clock") {
                msg.textContent = "You move the clock... a folded paper slips out.";
                setTimeout(() => { msg.textContent = 'It reads: "MERCER"'; }, 1500);
                setTimeout(() => { showScreen(puzzle2Screen); }, 3000);
            } else {
                msg.textContent = "That doesn't match the clues. Try again.";
            }
        });
    });

    // Puzzle 2
    document.querySelectorAll(".room").forEach(room => {
        room.addEventListener("click", () => {
            const msg = document.getElementById("puzzle2-message");
            if (room.dataset.room === "204") {
                msg.textContent = "Room 204. Maintenance visited twice.";
                setTimeout(() => { showScreen(puzzle3Screen); }, 1200);
            } else {
                msg.textContent = "That room doesn't match the clues. Try again.";
            }
        });
    });

    // Puzzle 3
    let timelineOrder = [];
    const correctOrder = ["1", "2", "3", "4"];
    const timelineContainer = document.querySelector(".timeline-options");
    const progress = document.getElementById("timeline-progress");

    function shuffleTimelineButtons() {
        const buttons = Array.from(timelineContainer.children);
        for (let i = buttons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            timelineContainer.appendChild(buttons[j]);
        }
    }

    function resetPuzzle3() {
        timelineOrder = [];
        progress.textContent = "Progress: 0/4";
        document.querySelectorAll(".event").forEach(btn => btn.disabled = false);
        shuffleTimelineButtons();
    }

    resetPuzzle3();

    document.querySelectorAll(".event").forEach(event => {
        event.addEventListener("click", () => {
            event.disabled = true;
            timelineOrder.push(event.dataset.step);
            progress.textContent = `Progress: ${timelineOrder.length}/4`;

            if (timelineOrder.length === 4) {
                if (JSON.stringify(timelineOrder) === JSON.stringify(correctOrder)) {
                    setTimeout(() => { 
                        showScreen(puzzle4Screen); 
                        startPhaseOne();
                    }, 1000);
                } else {
                    progress.textContent = "Incorrect order. Try again.";
                    setTimeout(resetPuzzle3, 1000);
                }
            }
        });
    });

    // Puzzle 4
    let targetWord = "";
    let currentWord = "";
    let phaseTwo = false;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderLetters(word) {
        const letters = shuffleArray(word.split(""));
        const container = document.querySelector(".scramble-options");
        container.innerHTML = letters.map(letter => `<button class="letter">${letter}</button>`).join("");
        attachLetterEvents();
    }

    function attachLetterEvents() {
        document.querySelectorAll(".letter").forEach(btn => {
            btn.addEventListener("click", () => {
                currentWord += btn.textContent;
                document.getElementById("scramble-progress").textContent = currentWord;
                btn.disabled = true;

                if (currentWord.length === targetWord.length) {
                    if (currentWord === targetWord) {
                        if (!phaseTwo) setTimeout(startPhaseTwo, 1000);
                        else setTimeout(() => showScreen(suspectScreen), 1000);
                    } else {
                        document.getElementById("scramble-progress").textContent = "Incorrect. Try again!";
                        setTimeout(() => { 
                            currentWord = ""; 
                            renderLetters(targetWord); 
                            document.getElementById("scramble-progress").textContent = ""; 
                        }, 1000);
                    }
                }
            });
        });
    }

    function startPhaseOne() {
        phaseTwo = false;
        targetWord = "DANIEL";
        currentWord = "";
        document.getElementById("scramble-progress").textContent = "";
        renderLetters(targetWord);
    }

    function startPhaseTwo() {
        phaseTwo = true;
        targetWord = "TRUSTNOONE";
        currentWord = "";
        document.getElementById("scramble-progress").textContent = "";
        renderLetters(targetWord);
    }

    /* ───────── CHOOSE CULPRIT / ENDING ───────── */
    chooseButton.addEventListener("click", () => {
        modal.classList.add("hidden");
        backButton.classList.add("hidden");
        showScreen(resultScreen);
        triggerEnding();
    });

    function triggerEnding() {
        resultText.textContent = "";

        // Lower background music volume
        backgroundMusic.volume = 0.2;

        // Play heartbeat
        heartbeatSound.currentTime = 0;
        heartbeatSound.play().catch(() => {});
        heartbeatSound.loop = true;

        let lines;
   if (selectedSuspect === realCulprit) {
    lines = [
        "You chose Thomas Gray…\n\n",
        "But that was never his real name.\n",
        "He is Daniel Mercer, hiding a past tangled with corruption, secrets, and danger.\n\n",
        "Every clue Evelyn left pointed here.\n",
        "He knew the hotel inside out and covered his tracks.\n",
        "Rooms that should have been empty… weren’t.\n",
        "Logs that looked ordinary… lied.\n\n",
        "Evelyn uncovered scandals, erased records, and silenced witnesses.\n",
        "Her disappearance was deliberate… she realized the danger too late.\n\n",
        "All that remains are her notes… scattered clues… and a warning.\n",
        "Daniel Mercer waits in the shadows, patient and unseen.\n",
        "The hotel’s secrets are exposed, but some doors remain locked, some whispers unheard…\n",
        "The shadows are still watching.\n"
    ];

        } else {
            lines = [
                "You made your accusation.\n\n",
                "But something doesn't fit.\n\n",
                "The real truth slipped past you.\n"
            ];
        }

        typeWriter(lines, () => {
            heartbeatSound.pause();
            backgroundMusic.volume = 1;
        });
    }

    function typeWriter(lines, onComplete) {
    let line = 0;
    let char = 0;
    function type() {
        if (line < lines.length) {
            if (char < lines[line].length) {
                resultText.textContent += lines[line][char++];
                fitTextToContainer(resultText, resultScreen.clientHeight); // new line!
                setTimeout(type, 40);
            } else {
                char = 0;
                line++;
                setTimeout(type, 300);
            }
        } else {
            if (onComplete) onComplete();
        }
    }
    type();
}
function fitTextToContainer(element, maxHeight) {
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    
    while (element.scrollHeight > maxHeight && fontSize > 8) { // stop shrinking at 8px
        fontSize--;
        element.style.fontSize = fontSize + "px";
    }
}

});