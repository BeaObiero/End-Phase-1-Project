document.addEventListener('DOMContentLoaded', function () {
    class Quote {
        constructor(text, author) {
            this._quoteText = text;
            this._quoteAuthor = author;
        }

        get quoteText() {
            return this._quoteText;
        }

        set quoteText(text) {
            this._quoteText = text;
        }

        get quoteAuthor() {
            return this._quoteAuthor;
        }

        set quoteAuthor(author) {
            this._quoteAuthor = author;
        }

        display() {
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');

            // Quote text
            const quoteText = document.createElement('p');
            quoteText.textContent = `"${this._quoteText}" - ${this._quoteAuthor}`;
            quoteElement.appendChild(quoteText);

            // Copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => this.copyToClipboard());
            quoteElement.appendChild(copyButton);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => this.removeQuote());
            quoteElement.appendChild(deleteButton);

            quoteDisplay.appendChild(quoteElement);
        }

        copyToClipboard() {
            const textToCopy = `"${this._quoteText}" - ${this._quoteAuthor}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Quote copied to clipboard!');
            }).catch((err) => {
                console.error('Error copying to clipboard:', err);
            });
        }

        removeQuote() {
            const quoteElement = event.target.parentElement;
            quoteElement.remove();
            regenerateQuote();
        }
    }

    class QuoteGenerator {
        constructor() {
            this.quotes = [];
        }

        generateQuote(text = 'Placeholder quote from API', author = 'Unknown Author') {
            const quote = new Quote(text, author);
            this.quotes.push(quote);
            return quote;
        }

        displayQuotes() {
            quoteDisplay.innerHTML = '';
            this.quotes.forEach((quote) => {
                quote.display();
            });
        }

        removeQuote(quote) {
            const quoteIndex = this.quotes.indexOf(quote);
            if (quoteIndex !== -1) {
                this.quotes.splice(quoteIndex, 1);
                this.displayQuotes();
                regenerateQuote();
            }
        }
    }

    class RandomQuoteGenerator extends QuoteGenerator {
        constructor() {
            super();
        }

        async generateRandomQuote(keywords) {
            try {
                const apiUrl = keywords ? `${QUOTABLE_API_URL}?tags=${keywords}` : QUOTABLE_API_URL;
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Generate and store the new quote
                const randomQuote = this.generateQuote(data.content, data.author);
                this.quotes.push(randomQuote);

                // Display the updated list of quotes
                this.displayQuotes();

                return randomQuote;
            } catch (error) {
                console.error('Error fetching or generating quote:', error);
                return null;
            }
        }
    }

    const quoteDisplay = document.getElementById('quoteDisplay');
    const keywordInput = document.getElementById('keywordInput');
    const randomQuoteGenerator = new RandomQuoteGenerator();
    const QUOTABLE_API_URL = 'https://api.quotable.io/random';

    // Event listener for the "Get Quotes" button
    const getQuotesButton = document.getElementById('getQuotesButton');
    getQuotesButton.addEventListener('click', async function (e) {
        e.preventDefault();
        await getQuotes();
    });

    async function getQuotes() {
        try {
            const inputKeywords = keywordInput.value.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'motivational';

            // Clear previous quotes
            randomQuoteGenerator.quotes = [];

            // Generate and display up to 5 quotes
            for (let i = 0; i < 5; i++) {
                await randomQuoteGenerator.generateRandomQuote(inputKeywords);
            }
        } catch (error) {
            console.error('Error in getQuotes:', error);
        }
    }

    function regenerateQuote() {
        const inputKeywords = keywordInput.value.replace(/[^a-zA-Z]/g, '').toLowerCase() || null;
        if (inputKeywords) {
            randomQuoteGenerator.generateRandomQuote(inputKeywords);
        } else {
            // Generate a random quote if no keyword was used
            randomQuoteGenerator.generateRandomQuote();
        }
    }

    // ... (other code if needed)
});
