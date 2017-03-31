// You can run these unit tests by running "npm test" inside the /functions directory.

// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
const assert = chai.assert;

// Chai As Promised extends Chai so that a test function can be asynchronous with promises instead
// of using callbacks. It is recommended when testing Cloud Functions for Firebase due to its heavy
// use of Promises.
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

describe('Cloud Functions', () =>{
    // [START stubConfig]
    var myFunctions, configStub, adminInitStub, functions, admin;

    before(() =>{
        // Since index.js makes calls to functions.config and admin.initializeApp at the top of the file,
        // we need to stub both of these functions before requiring index.js. This is because the
        // functions will be executed as a part of the require process.
        // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
        admin = require('firebase-admin');
        adminInitStub = sinon.stub(admin, 'initializeApp');
        // Next we stub functions.config(). Normally config values are loaded from Cloud Runtime Config;
        // here we'll just provide some fake values for firebase.databaseURL and firebase.storageBucket
        // so that an error is not thrown during admin.initializeApp's parameter check
        functions = require('firebase-functions');
        configStub = sinon.stub(functions, 'config').returns({
            firebase: {
                databaseURL: 'https://not-a-project.firebaseio.com',
                storageBucket: 'not-a-project.appspot.com',
            }
            // You can stub any other config values needed by your functions here, for example:
            // foo: 'bar'
        });
        // Now we can require index.js and save the exports inside a namespace called myFunctions.
        // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
        // and myFunctions.addMessage
        myFunctions = require('../index');
    });

    after(() =>{
        // Restoring our stubs to the original methods.
        configStub.restore();
        adminInitStub.restore();
    });






    describe('formatTable', () =>{
        it('should return a nice table', () =>{
            const firebasePlayersMock = {
                "am": {"defeats": 2, "name": "Alan Martini", "victories": 1},
                "cf": {"defeats": 2, "name": "Cristiano Franco", "victories": 1},
                "ds": {"defeats": 1, "name": "Dennis da Silva", "victories": 0},
                "fk": {"defeats": 6, "name": "Fernando Kruse", "victories": 4},
                "ga": {"defeats": 4, "name": "Gabriel Allegreti", "victories": 1},
                "gs": {"defeats": 4, "name": "Gianei Sebastiany", "victories": 3},
                "lr": {"defeats": 6, "name": "Leonardo", "victories": 5},
                "ps": {"defeats": 3, "name": "Paulo Santos", "victories": 5},
                "rb": {"defeats": 3, "name": "Regis Brand", "victories": 6},
                "rd": {"defeats": 4, "name": "Rafael Dutra", "victories": 3},
                "rm": {"defeats": 1, "name": "Renata Machado", "victories": 0},
                "tf": {"defeats": 1, "name": "Thiagus Ferreira", "victories": 5},
                "tg": {"defeats": 2, "name": "Tiago Graff", "victories": 5}
            };

            console.log(myFunctions.messageTable(myFunctions.formatTable(firebasePlayersMock)));
        });
    });
});


