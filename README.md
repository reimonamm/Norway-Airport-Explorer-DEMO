# Norway-Airport-Explorer 🛫

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

## Testing

**To test out the Norway-Airport-Explorer:**

**Clone the repo**
`git clone` https://github.com/reimonamm/Norway-Airport-Explorer-DEMO.git

**Install dependencies**
`npm install`

**Start the development server**
`ng serve`

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Features

1. Complete list of Norwegian airports
2. Clicking the airtport name leads to detailed info page
3. Airports on the map
4. Hovering over airport name highlights the airport
5. Clicking on airport marker leads to detailed info page
6. About page
7. Contact page for demo purposes
8. Switchable language from navbar
9. Followed good practices of ccessibility: keyboard navigation, contrast, text to speech
10. 3 example tests 


## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
### Test 1: Default language check
To verify this test works: Change 'en' to any other language code (e.g., 'fr' or 'de') 

### Test 2: Supported languages check
To verify this test works: Change array length expectation from 2 to 1

### Test 3: Component structure check
To verify this test works: Change any of the selectors to a non-existent one (e.g., 'wrong-selector')


## Security Note
The current implementation includes API keys directly in the source code for ease of review and demo purposes. In a production environment, these should be properly secured using environment variables or a secret management system.

