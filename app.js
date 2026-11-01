/**
 * DDSA - Delhi Duggar Student Association Client-Side Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mainNav.classList.toggle('active');
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mainNav.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. Sticky Header Scroll Effect
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update active nav links based on scroll section
        updateActiveLinkOnScroll();
    });

    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealItems = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-scroll');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, observerOptions);

        revealItems.forEach(item => {
            if (item) scrollObserver.observe(item);
        });
    } else {
        revealItems.forEach(item => {
            if (item) item.classList.add('active-scroll');
        });
    }

    // ==========================================
    // 4. Jammu vs Himachal Interactive Tabs
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Deactivate all buttons and hide contents
                tabButtons.forEach(b => { if (b) b.classList.remove('active'); });
                tabContents.forEach(c => { if (c) c.classList.remove('active'); });

                // Activate current button and target content
                btn.classList.add('active');
                const contentPanel = document.getElementById(targetTab);
                if (contentPanel) {
                    contentPanel.classList.add('active');
                }
            });
        }
    });

    // ==========================================
    // 5. Automatic Carousel (Moments Slideshow)
    // ==========================================
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let slideTimer;

    function showSlide(index) {
        if (slides.length === 0) return;
        
        if (index >= slides.length) currentSlideIndex = 0;
        else if (index < 0) currentSlideIndex = slides.length - 1;
        else currentSlideIndex = index;

        slides.forEach(slide => { if (slide) slide.classList.remove('active'); });
        dots.forEach(dot => { if (dot) dot.classList.remove('active'); });

        if (slides[currentSlideIndex]) {
            slides[currentSlideIndex].classList.add('active');
        }
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    }

    function startSlideShow() {
        stopSlideShow();
        if (slides.length > 0) {
            slideTimer = setInterval(() => {
                currentSlideIndex++;
                showSlide(currentSlideIndex);
            }, 4500); // Transitions automatically every 4.5 seconds
        }
    }

    function stopSlideShow() {
        if (slideTimer) clearInterval(slideTimer);
    }

    if (slides.length > 0) {
        showSlide(currentSlideIndex);
        startSlideShow();

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlideIndex--;
                showSlide(currentSlideIndex);
                startSlideShow();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlideIndex++;
                showSlide(currentSlideIndex);
                startSlideShow();
            });
        }

        dots.forEach(dot => {
            if (dot) {
                dot.addEventListener('click', (e) => {
                    const targetIndex = parseInt(e.target.getAttribute('data-slide'));
                    currentSlideIndex = targetIndex;
                    showSlide(currentSlideIndex);
                    startSlideShow();
                });
            }
        });

        const container = document.getElementById('slideshow-container');
        if (container) {
            container.addEventListener('mouseenter', stopSlideShow);
            container.addEventListener('mouseleave', startSlideShow);
        }
    }

    // ==========================================
    // 6. Active Link Highlight on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section');

    function updateActiveLinkOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                    currentSectionId = section.getAttribute('id');
                }
            }
        });

        navLinks.forEach(link => {
            if (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            }
        });
    }

    // ==========================================
    // 7. INTERACTIVE WIDGET 1: Folk Audio Player
    // ==========================================
    const tracksList = [
        { title: "Chamba Kitni Door", artist: "Traditional Himachali Folk", duration: 192, durationStr: "3:12" },
        { title: "Kud Dance rhythms", artist: "Traditional Dogri Ritual", duration: 165, durationStr: "2:45" },
        { title: "Dogri Bhakh Medley", artist: "Pahari Folklore Singers", duration: 210, durationStr: "3:30" },
        { title: "Laman Pahari Tune", artist: "Himachali Acoustic Love", duration: 245, durationStr: "4:05" }
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let trackPlayTime = 0;
    let audioTimer = null;

    const playBtn = document.getElementById('player-play');
    const prevTrackBtn = document.getElementById('player-prev');
    const nextTrackBtn = document.getElementById('player-next');
    const trackTitleEl = document.getElementById('player-track-title');
    const trackArtistEl = document.getElementById('player-track-artist');
    const currentTimerEl = document.getElementById('player-time-current');
    const durationTimerEl = document.getElementById('player-time-duration');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarBg = document.getElementById('progress-bar-bg');
    const visualizerWave = document.getElementById('audio-wave-container');

    function loadTrack(idx) {
        if (tracksList.length === 0) return;
        const track = tracksList[idx];
        if (trackTitleEl) trackTitleEl.textContent = track.title;
        if (trackArtistEl) trackArtistEl.textContent = track.artist;
        if (durationTimerEl) durationTimerEl.textContent = track.durationStr;
        if (currentTimerEl) currentTimerEl.textContent = "0:00";
        trackPlayTime = 0;
        updateProgressUI();
    }

    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function playTrack() {
        isPlaying = true;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (visualizerWave) visualizerWave.classList.add('playing');
        
        clearInterval(audioTimer);
        audioTimer = setInterval(() => {
            trackPlayTime++;
            const track = tracksList[currentTrackIdx];
            
            if (trackPlayTime >= track.duration) {
                nextTrack();
            } else {
                updateProgressUI();
            }
        }, 1000);
    }

    function pauseTrack() {
        isPlaying = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (visualizerWave) visualizerWave.classList.remove('playing');
        clearInterval(audioTimer);
    }

    function nextTrack() {
        currentTrackIdx = (currentTrackIdx + 1) % tracksList.length;
        loadTrack(currentTrackIdx);
        if (isPlaying) playTrack();
    }

    function prevTrack() {
        currentTrackIdx = (currentTrackIdx - 1 + tracksList.length) % tracksList.length;
        loadTrack(currentTrackIdx);
        if (isPlaying) playTrack();
    }

    function updateProgressUI() {
        const track = tracksList[currentTrackIdx];
        const minutes = Math.floor(trackPlayTime / 60);
        const seconds = trackPlayTime % 60;
        if (currentTimerEl) {
            currentTimerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        
        const pct = (trackPlayTime / track.duration) * 100;
        if (progressBarFill) {
            progressBarFill.style.width = `${pct}%`;
        }
    }

    if (playBtn) {
        loadTrack(currentTrackIdx);
        playBtn.addEventListener('click', togglePlay);
        if (prevTrackBtn) prevTrackBtn.addEventListener('click', prevTrack);
        if (nextTrackBtn) nextTrackBtn.addEventListener('click', nextTrack);

        // Click timeline background to seek
        if (progressBarBg) {
            progressBarBg.addEventListener('click', (e) => {
                const track = tracksList[currentTrackIdx];
                const clickX = e.offsetX;
                const totalWidth = progressBarBg.clientWidth;
                const newPct = clickX / totalWidth;
                trackPlayTime = Math.floor(newPct * track.duration);
                updateProgressUI();
            });
        }
    }

    // ==========================================
    // 8. INTERACTIVE WIDGET 2: Weather Station
    // ==========================================
    const weatherData = {
        shimla: { temp: 14, cond: "Heavy Clouds", wind: "12 km/h", alt: "2,206m", icon: "fa-cloud" },
        bhaderwah: { temp: 19, cond: "Sunny Valley", wind: "8 km/h", alt: "1,613m", icon: "fa-sun" },
        jammu: { temp: 34, cond: "Warm Breezes", wind: "15 km/h", alt: "327m", icon: "fa-temperature-high" },
        manali: { temp: 11, cond: "Light Snowfall", wind: "18 km/h", alt: "2,050m", icon: "fa-snowflake" },
        kishtwar: { temp: 16, cond: "Cool Mist", wind: "10 km/h", alt: "1,638m", icon: "fa-smog" }
    };

    const weatherSelect = document.getElementById('weather-city-select');
    const weatherDisplay = document.getElementById('weather-display');
    const weatherIcon = document.getElementById('weather-main-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherCond = document.getElementById('weather-condition');
    const weatherWind = document.getElementById('weather-wind');
    const weatherAlt = document.getElementById('weather-altitude');
    const weatherSyncBtn = document.getElementById('weather-sync');

    function updateWeather(cityKey, delay = 0) {
        if (!weatherDisplay) return;
        
        weatherDisplay.classList.add('loading');
        
        setTimeout(() => {
            const data = weatherData[cityKey];
            if (data) {
                if (weatherIcon) weatherIcon.className = `fa-solid ${data.icon}`;
                if (weatherTemp) weatherTemp.textContent = data.temp;
                if (weatherCond) weatherCond.textContent = data.cond;
                if (weatherWind) weatherWind.textContent = data.wind;
                if (weatherAlt) weatherAlt.textContent = data.alt;
            }
            weatherDisplay.classList.remove('loading');
        }, delay);
    }

    if (weatherSelect) {
        weatherSelect.addEventListener('change', (e) => {
            updateWeather(e.target.value, 300);
        });

        if (weatherSyncBtn) {
            weatherSyncBtn.addEventListener('click', () => {
                weatherSyncBtn.classList.add('syncing');
                const currentCity = weatherSelect.value;
                
                // Add a small randomized change during sync to look alive
                if (weatherData[currentCity]) {
                    const baseTemp = weatherData[currentCity].temp;
                    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
                    weatherData[currentCity].temp = baseTemp + change;
                }

                updateWeather(currentCity, 1000);
                
                setTimeout(() => {
                    weatherSyncBtn.classList.remove('syncing');
                }, 1000);
            });
        }
        
        // Load initial weather
        updateWeather('shimla', 0);
    }

    // ==========================================
    // 9. INTERACTIVE WIDGET 3: Word Dictionary
    // ==========================================
    const vocabList = [
        { word: "Mithri", lang: "Dogri", meaning: `"Sweet / Gentle" (Often used to describe the Dogri language: "Mithri Dogre Di Boli")` },
        { word: "Tunda", lang: "Pahari", meaning: `"Cold / Freezing" (Commonly used by Pahari speakers to refer to cold mountain wind: "Tunda Paa")` },
        { word: "Kud", lang: "Dogri", meaning: `"Dogra Folk Dance" (A traditional ritual dance performed to please local devtas, accompanied by flutes and Ransingha)` },
        { word: "Nati", lang: "Pahari", meaning: `"Himachali Folk Dance" (A famous synchronized group dance representing harmony and celebration, holds a Guinness World Record)` },
        { word: "Gajjru", lang: "Dogri", meaning: `"Heavy Silver Bracelet" (A beautiful traditional wrist ornament worn by Dogra women during marriages and local fairs)` },
        { word: "Chiri", lang: "Pahari", meaning: `"Traditional Head Ornament" (A beautiful silver forehead jewelry worn by Himachali women with traditional attire)` }
    ];

    let currentVocabIdx = 0;
    const cardEl = document.getElementById('flashcard');
    const vocabWordEl = document.getElementById('vocab-word');
    const vocabMeaningEl = document.getElementById('vocab-meaning');
    const vocabNextBtn = document.getElementById('vocab-next');
    const vocabPrevBtn = document.getElementById('vocab-prev');

    function loadVocab(idx) {
        if (!cardEl) return;
        
        // Remove flipped class to reset back to front before changing text
        cardEl.classList.remove('flipped');
        
        setTimeout(() => {
            const item = vocabList[idx];
            if (item) {
                if (vocabWordEl) vocabWordEl.textContent = item.word;
                if (vocabMeaningEl) vocabMeaningEl.textContent = item.meaning;
                const langTag = cardEl.querySelector('.lang-tag');
                if (langTag) langTag.textContent = item.lang;
            }
        }, 150); // delay matching transition
    }

    if (cardEl) {
        cardEl.addEventListener('click', () => {
            cardEl.classList.toggle('flipped');
        });

        if (vocabNextBtn) {
            vocabNextBtn.addEventListener('click', () => {
                currentVocabIdx = (currentVocabIdx + 1) % vocabList.length;
                loadVocab(currentVocabIdx);
            });
        }

        if (vocabPrevBtn) {
            vocabPrevBtn.addEventListener('click', () => {
                currentVocabIdx = (currentVocabIdx - 1 + vocabList.length) % vocabList.length;
                loadVocab(currentVocabIdx);
            });
        }
        
        // Load initial card
        loadVocab(0);
    }

    // ==========================================
    // 10. INTERACTIVE WIDGET 4: College PG Finder
    // ==========================================
    const collegeData = {
        miranda: { metro: "Vishwavidyalaya", line: "Yellow Line", pg: "Kamla Nagar / Hudson Lane", time: "~5 mins walk", mentor: "Yati Chaudhary (BA Philosophy)" },
        ramjas: { metro: "Vishwavidyalaya", line: "Yellow Line", pg: "Kamla Nagar / Bungalow Road", time: "~8 mins walk", mentor: "Lakshay Jandial (BA Pol Sci Passout)" },
        sbs: { metro: "Malviya Nagar / Chirag Delhi", line: "Yellow / Magenta Line", pg: "Malviya Nagar / Saket", time: "~12 mins travel", mentor: "Urmiya Sharma (BA English)" },
        mln: { metro: "Durgabai Deshmukh South Campus", line: "Pink Line", pg: "Satya Niketan / Moti Bagh", time: "~10 mins walk", mentor: "Porshia Bisht (BA Pol Sci)" },
        dbrac: { metro: "Mansarovar Park / Shahdara", line: "Red Line", pg: "Dilshad Garden / Yamuna Vihar", time: "~15 mins travel", mentor: "Sanchit Chaudhary (B.Com Program)" }
    };

    const collegeSelect = document.getElementById('college-select');
    const displayCard = document.getElementById('travel-display-card');
    const metroVal = document.getElementById('college-metro');
    const metroLine = document.getElementById('college-line');
    const pgArea = document.getElementById('college-pg');
    const travelTime = document.getElementById('college-time');
    const mentorName = document.getElementById('college-mentor');

    function updateCollegeFinder(colKey) {
        if (!displayCard) return;
        
        displayCard.style.opacity = '0.4';
        
        setTimeout(() => {
            const data = collegeData[colKey];
            if (data) {
                if (metroVal) metroVal.textContent = data.metro;
                if (metroLine) metroLine.textContent = data.line;
                if (pgArea) pgArea.textContent = data.pg;
                if (travelTime) travelTime.textContent = data.time;
                if (mentorName) mentorName.textContent = data.mentor;
            }
            displayCard.style.opacity = '1';
        }, 200);
    }

    if (collegeSelect) {
        collegeSelect.addEventListener('change', (e) => {
            updateCollegeFinder(e.target.value);
        });
        
        // Load initial college details
        updateCollegeFinder('miranda');
    }

    // ==========================================
    // 11. Student Registration Form Submission
    // ==========================================
    const supportForm = document.getElementById('student-support-form');
    const formFeedback = document.getElementById('form-feedback');

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('student-name').value.trim();
            const phone = document.getElementById('student-phone').value.trim();
            const email = document.getElementById('student-email').value.trim();
            const state = document.getElementById('student-state').value;
            const assistance = document.getElementById('support-type').value;

            if (!name || !phone || !email || !state || !assistance) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone.replace(/[\s-]/g, ''))) {
                showFeedback('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            const submitBtn = supportForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Processing Request...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                showFeedback(`Thank you, ${name}! Your request for ${assistance} assistance has been successfully recorded. A DDSA core volunteer will contact you shortly on ${phone}.`, 'success');
                supportForm.reset();
            }, 1500);
        });
    }

    function showFeedback(message, type) {
        if (formFeedback) {
            formFeedback.textContent = message;
            formFeedback.className = 'form-feedback';
            formFeedback.classList.add(type);
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

const spinStyle = document.createElement('style');
spinStyle.innerHTML = `
    .animate-spin {
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);
