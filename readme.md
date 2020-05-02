# Car Rental Service Web App

## Application hosted [here](https://whitepanda-car-rental-service.herokuapp.com)

## Postman [API Collection](https://documenter.getpostman.com/view/4199768/SzmZcfrD?version=latest)


## Run it on your machine

**First of all clone this repo** then follow these below steps,

```
$   npm install
$   npm run start-server
```

## API endpoints (in case postman collection link breaks in future)


### Users

1. `/api/users/addUser`

```js
    // kind of sign up functionality
    // saves the user and credentials in database
    // **return auth-token in the response header**
    http method: POST
    req.body: {
	    "name": "farhan",
	    "email": "farhan1@gmail.com",
	    "password": "password1"
    }
```

### Auth

1. `/api/users/addUser`

```js
    // log in functionality
    // returns the auth-token in the response body
    http method: POST
    req.body: {
	    "email": "farhan1@gmail.com",
	    "password": "password1"
    }
```

### Cars

**Must send the auth-token in the request header to access any endpoint of Cars API**

1. `/api/cars/addCar`

```js
    http method: POST
    req.body: {
        "carNumber": "UP ASK 2859",
        "companyName": "Toyota",
        "dailyRentalRate": 2000,
        "model": "Fortuner",
        "year": 2018,
        "seatingCapacity": 8
    }
```

2. `/api/cars/bookCar`

```js
    http method: POST
    req.body: {
	    "carId": "5eabb4207188623f02fa30ff",
	    "rentalDays": 3
    }
```

3. `/api/cars/availabeCars`

```js
    http method: POST
    req.body: {
        "filter": companyName/seatingCapacity/year/date,
        "filterValue": appropriate value according to filter
    }
```

4. `/api/cars/carDetails/:id`

```js
    http method: GET
```

5. `/api/cars/updateCar`

```js
    //  can't update a car's details when it is booked by someone
    http method: PUT
    req.body: {
        "carNumber": "xxx",
        "companyName": "xxx",
        "dailyRentalRate": xxx,
        "model": "xxx",
        "year": xxx,
        "seatingCapacity": xxx
    }
```


6. `/api/cars/carDetails/:id`

```js
    //  can't delete a car when it is booked by someone
    http method: DELETE
```