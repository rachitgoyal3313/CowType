
    const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');
    const wordsCount = words.length;
    let gameTime = 30 * 1000; // default 30 seconds
    window.timer = null;
    window.gameStart = null;
    window.pauseTime = 0;

    function addClass(el, name) {
        el.classList.add(name);
    }

    function removeClass(el, name) {
        el.classList.remove(name);
    }

    function randomWord() {
        const randomIndex = Math.floor(Math.random() * wordsCount);
        return words[randomIndex];
    }

    function formatWord(word) {
        return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
    }

    function updateCursorPosition() {
        const nextLetter = document.querySelector('.letter.current');
        const cursor = document.getElementById('cursor');
        
        if (nextLetter) {
            const rect = nextLetter.getBoundingClientRect();
            const gameRect = document.getElementById('game').getBoundingClientRect();
            const wordsRect = document.getElementById('words').getBoundingClientRect();
            
            // Position cursor exactly at the start of the next letter to be typed
            cursor.style.top = `${rect.top - gameRect.top}px`;
            cursor.style.left = `${rect.left - wordsRect.left}px`;
            cursor.style.height = `${rect.height}px`;
        }
    }

    function newGame(time = 30) {
        // Reset game settings
        gameTime = time * 1000;
        const wordsContainer = document.getElementById('words');
        wordsContainer.innerHTML = '';
        
        // Generate words
        for (let i = 0; i < 200; i++) {
            wordsContainer.innerHTML += formatWord(randomWord());
        }
        
        // Set initial current word and letter
        addClass(document.querySelector('.word'), 'current');
        addClass(document.querySelector('.letter'), 'current');
        
        // Reset display
        document.getElementById('info').innerHTML = `${time} sec`;
        window.timer = null;
        window.gameStart = null;
        window.pauseTime = 0;
        
        // Remove game over state
        removeClass(document.getElementById('game'), 'over');
        
        // Reset time buttons
        document.querySelectorAll('#controls button[data-time]').forEach(btn => {
            removeClass(btn, 'active');
            if (parseInt(btn.dataset.time) === time) {
                addClass(btn, 'active');
            }
        });

        // Reset scroll and cursor
        wordsContainer.style.marginTop = '0px';
        updateCursorPosition();
    }

    function getWpm() {
        const words = [...document.querySelectorAll('.word')];
        const lastTypedWord = document.querySelector('.word.current');
        const lastTypedWordIndex = words.indexOf(lastTypedWord);
        const typedWords = words.slice(0, lastTypedWordIndex);
        const correctWords = typedWords.filter(word => {
            const letters = [...word.children];
            const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
            const correctLetters = letters.filter(letter => letter.className.includes('correct'));
            return incorrectLetters.length === 0 && correctLetters.length === letters.length;
        });
        return Math.round((correctWords.length / gameTime) * 60000);
    }

    function gameOver() {
        clearInterval(window.timer);
        addClass(document.getElementById('game'), 'over');
        const result = getWpm();
        document.getElementById('info').innerHTML = `WPM: ${result}`;
    }

    document.getElementById('game').addEventListener('keydown', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.word.current');
        const currentLetter = document.querySelector('.letter.current');
        const expected = currentLetter?.innerHTML || ' ';
        const isLetter = key.length === 1 && key !== ' ';
        const isSpace = key === ' ';
        const isBackspace = key === 'Backspace';
        const isFirstLetter = currentLetter === currentWord.firstChild;

        if (document.querySelector('#game.over')) {
            return;
        }

        if (!window.timer && isLetter) {
            window.timer = setInterval(() => {
                if (!window.gameStart) {
                    window.gameStart = (new Date()).getTime();
                }
                const currentTime = (new Date()).getTime();
                const msPassed = currentTime - window.gameStart;
                const sPassed = Math.round(msPassed / 1000);
                const sLeft = Math.round((gameTime / 1000) - sPassed);
                if (sLeft <= 0) {
                    gameOver();
                    return;
                }
                document.getElementById('info').innerHTML = sLeft + '';
            }, 1000);
        }

        if (isLetter) {
            if (currentLetter) {
                addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
                removeClass(currentLetter, 'current');
                if (currentLetter.nextSibling) {
                    addClass(currentLetter.nextSibling, 'current');
                }
            }
        }

        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
                lettersToInvalidate.forEach(letter => {
                    addClass(letter, 'incorrect');
                });
            }
            removeClass(currentWord, 'current');
            addClass(currentWord.nextSibling, 'current');
            if (currentLetter) {
                removeClass(currentLetter, 'current');
            }
            addClass(currentWord.nextSibling.firstChild, 'current');
        }

        if (isBackspace) {
            if (currentLetter && isFirstLetter) {
                // Move to previous word
                removeClass(currentWord, 'current');
                addClass(currentWord.previousSibling, 'current');
                removeClass(currentLetter, 'current');
                addClass(currentWord.previousSibling.lastChild, 'current');
                removeClass(currentWord.previousSibling.lastChild, 'incorrect');
                removeClass(currentWord.previousSibling.lastChild, 'correct');
            } else if (currentLetter && !isFirstLetter) {
                // Move to previous letter
                removeClass(currentLetter, 'current');
                addClass(currentLetter.previousSibling, 'current');
                removeClass(currentLetter.previousSibling, 'incorrect');
                removeClass(currentLetter.previousSibling, 'correct');
            } else if (!currentLetter) {
                // Move to last letter of current word
                addClass(currentWord.lastChild, 'current');
                removeClass(currentWord.lastChild, 'incorrect');
                removeClass(currentWord.lastChild, 'correct');
            }
        }

        // Scroll management
        const words = document.getElementById('words');
        const currentWordRect = currentWord.getBoundingClientRect();
        const gameRect = document.getElementById('game').getBoundingClientRect();

        if (currentWordRect.bottom > gameRect.bottom) {
            const marginTop = parseInt(words.style.marginTop || '0');
            words.style.marginTop = `${marginTop - 35}px`;
        }
        
        // Update cursor position after each key press
        requestAnimationFrame(updateCursorPosition);
    });

    // New event listeners for time selection buttons
    document.querySelectorAll('#controls button[data-time]').forEach(button => {
        button.addEventListener('click', () => {
            const time = parseInt(button.dataset.time);
            if (window.timer) {
                gameOver();
            }
            newGame(time);
        });
    });

    // Reset button functionality
    document.getElementById('newGameBtn').addEventListener('click', () => {
        const activeButton = document.querySelector('#controls button.active');
        const time = activeButton ? parseInt(activeButton.dataset.time) : 30;
        gameOver();
        newGame(time);
    });

    // Retry button functionality
    document.getElementById('retryBtn').addEventListener('click', () => {
        const activeButton = document.querySelector('#controls button.active');
        const time = activeButton ? parseInt(activeButton.dataset.time) : 30;
        newGame(time);
    });

    // Initial game setup
    newGame(30);

    // Update cursor position on window resize
    window.addEventListener('resize', updateCursorPosition);

    // Color picker functionality
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const resetColorBtn = document.getElementById('resetColorBtn');
    const colorPicker = document.getElementById('colorPicker');
    const defaultColor = '#fd4';

    function setColor(color) {
        document.documentElement.style.setProperty('--primaryColor', color);
        localStorage.setItem('cowtype-color', color);
    }

    function loadColor() {
        const savedColor = localStorage.getItem('cowtype-color');
        if (savedColor) {
            setColor(savedColor);
            colorPicker.value = savedColor;
        }
    }

    colorPickerBtn.addEventListener('click', () => {
        colorPicker.click();
    });

    colorPicker.addEventListener('change', (e) => {
        setColor(e.target.value);
    });

    resetColorBtn.addEventListener('click', () => {
        setColor(defaultColor);
        colorPicker.value = defaultColor;
    });

    // Load saved color on page load
    loadColor();
