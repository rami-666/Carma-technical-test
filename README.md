
# Carma Technical Assesment
## Questions

### question 1

*var*: if a variable is defined with a "var" inside a function, it is accessbile from anywhere in the function regardless of where in the function it has been declared.

take the following example

```javascript
function example() {
    if (true) {
        var a = 10;
        console.log(a); // Output: 10
    }
    console.log(a); // Output: 10
}
```

*let*: if a variable is defined with a "let" inside a function, are limited to be accessbile only within the {} they have been declared in. 

for clarification, take the same example

```javascript
function example() {
    if(true) {
        let a = 10;
        console.log(a); //Output 10
    }
    console.log(a); //Error: a is not defined
}
```

*const*: has the same limited accessibility as "let", with the additional point that a variable defined with const cannot be reassigned to a different value after it has been given its initial assignment

*it is noteworthy that const variables must be assigned a value upon declaration*

```javascript
function example() {
    if(true) {
        const a = 10;
        console.log(a); //Output 10
        a = 20; //Error: assignment to constant variable
    }
    console.log(a); //Error: a is not defined
}
```

### question 2

To design the system, I will first assume that i have the following predefined desgin decisions as stated in the task description:

1. client_id is the client id, a way to uniquely identify a client.
2. client_time_zone would be the client time zone, like "Europe/Paris" i.e GMT+3 and so on.
3. the code is expected to run once every minute 

> I will also make the assumption that the timezone of the user is enough for me to know their current local time (including daylight savings conditions)

The system database fields and algorythm design will look as follows:

> In the following system design, I will refer to "Unix epoch time" as **timestamp**

***DATABASE FIELDS***
- client_id: this field allows us to track each user individually and ensure that they recieve their newsletter on time
- client_time_zone: this field allows me to track the current user local time in order to ensure that the newsletter is being sent at 9:00 A.M according to their local time
- last_sent_timestamp: it records the **timestamp** of the last time this specific user recieved a newsletter. This will allow us to schedule the next newsletter for this client. (more on this in the algorythm section)

***ALGORITHM***

- the code runs every minute of the day and checks the last_sent_timestamp for each client
- for each client, it calculates the next 9 A.M **timestamp** in their own local time (using the last_sent_timestamp and client_time_zone)

    - here, the client_time_zone is used to accomodate for possible daylight savings local time change  

- the next 9 A.M is then compared with the current timestamp, if the current timestamp exceeds the next 9 A.M timestamp, then we send the user a newsletter and update the last_sent_timestamp to our current timestamp value


### question 3

the code snippet provided will print "100" 100 times in the console. this is due to the fact that "setTimeout" is an asynchronous function. meaning that by the time the first timout is complete, and the first value is printed, i would have already been incremented to 100 and that means that the asynchronous function will just print "100" 100 times.

To fix this issue, we can ensure that each iteraiton of the loop creates a closure that captures the current value of i. We can achieve this by passing i as a parameter to a functino that returns the function to be passed to setTimeout.

the following is a possible fix to make the code seem more "natural" and intuitive

```javascript
for(var i = 0; i < 100; i++) {
    setTimeout((function(i) {
        return function() {
            console.log(i);
        }
    })(i), 200);
}
```

### question 4

the output of the first module would reveale the contents of the arr inside test.js to be ["hello"]. however the output of the second module that is used afterwards will reveal the updated contents of arr inside test.js to be ["hello", "another"].

The above output is due to the fact that both modules are referencing the same array, which is the arr variable inside the test.js file, and appending values to it. This would explain why the changes that module 1 made to the array were reflected when module 2 printed the value of the array.

## Exercise

### Luhn Algorithm

The Luhn algorithm is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers. The algorithm works by calculating a check digit on the partial account number, which is then included as the last (rightmost) digit of the full account number. The Luhn checksum works by doubling every second digit from the right, subtracting 9 from the product if it's greater than 9, and then summing all the digits. If the sum modulo 10 is equal to 0, then the number is valid according to the Luhn formula

This algorithm will be used in our implementation to validate that the user has entered a valid credit card number before we encrypt and add to the databse.

## Encryption Algorithm

the encryption algorithm that will be used is the aes-256-cbc wich takes in an initialization vector and a certain key. This encryption was chosen due to the following factors:

1. 2-way encryption: an encryption that can be decrypted at any point in time is important since we might need to retrieve the real value of the credit card number at some point in time. for the purpose of this demo, both encryption key and initalization vector will be stored within the code base.

2. high security: AES 256 is an industry standard encryption which achieves diffusion and confusion where the time complexity of a potential brute force attack increaes exponentially with the increase of a single byte of key length.

## Code Architecture

the code is divided into 3 main subdirectories

1. root directory: which contains the app.js file, which is the main node.js express server
2. client: which contains a react application (along with the build to be used by the node application)
3. database: which contains 3 files
    - databseConstants: holds connection string to our postgres server
    - database: contains initialization code which connects to the server using the connection string and defines a new table called credit_cards
    - queries: contains querying functions, namely inserting an entry (along with encryption) and retrieving all recorded credit cards (along with decryption)

## Prerequisites

### postgresql
For this code to function correctly, postgres must be installed and configured properly for a working connection with the application. this configuration includes the following

```javascript
{
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    port: '5432'
}
```

note that the password is assumed nonexistant, should there be a password in your current configuration, you can add i as follows

```javascript
{
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'your_password_here',
    port: '5432'
}
```

the following version of postgresql was used in development

```bash
psql (PostgreSQL) 14.9
```

### node

This implementation was developed usign the following node version

```bash
v20.7.0
```