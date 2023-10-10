# Technecians 
## API Reference

#### root uri
```http
 https://technicans.mooo.com:3000
```
#### Register Client
```http
  POST /api/auth/client/register
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`       | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `username`   | `string`  | **Required** |
| `password`       | `string` | **Required** must have lowecase,uppercase,nums,special chracters and more than 8 |
| `phoneNumber`       | `string` | **Required** **Unique**  must be valid phoneNumber starts with +20 |
| `government`     | `string` | **Required** |
| `gender`       | `string` | **Required** male and female no 🌈 |

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `email`       | `string` | 
| `username`   | `string`  | 
| `message`       | `string` | 
| `phoneNumber`       | `string` | 
| `government`     | `string` | 
| `gender`       | `string` | 
| `role`       | `string` | 


```http
  POST /api/auth/tech/register
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`       | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `username`   | `string`  | **Required** |
| `password`       | `string` | **Required** must have lowecase,uppercase,nums,special chracters and more than 8 |
| `phoneNumber`       | `string` | **Required** **Unique**  must be valid phoneNumber starts with +20 |
| `government`     | `string` | **Required** |
| `gender`       | `string` | **Required** male and female no 🌈 |
| `fullName`       | `string` | **Required** |
| `nationalId`       | `string` | **Required** **Unique** |
| `jobTitle`       | `string` | **Required** |
| `nationalIdImage`       | `string` | **Required** extintion must be .png,.jpg,jpeg|
### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `email`       | `string` | 
| `username`   | `string`  | 
| `message`       | `string` | 
| `phoneNumber`       | `string` | 
| `government`     | `string` | 
| `gender`       | `string` | 
| `role`       | `string` |
| `fullName`       | `string` | 
| `jobTitle`       | `string` | 
| `nationalIdImage`       | `string` |


```http
  POST /api/auth/login
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`       | `string` | **Required** |
| `password`       | `string` | **Required** |

### Response 
| Body Parameter | Type     | Description                | 
| :-------- | :------- | :------------------------- |
| `email`       | `string` | |
| `username`   | `string`  | |
| `message`       | `string` | |
| `phoneNumber`       | `string` | |
| `government`     | `string` | |
| `gender`       | `string` | |
| `role`       | `string` | |
| `accessToken`       | `string` | if techncian |
| `fullName`       | `string` | if techncian |
| `jobTitle`       | `string` | if techncian |
| `nationalIdImag`       | `string` | if techncian |

```http
  POST /api/auth/tech/logout
```

| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `message`       | `string` | 

#### Forget password
```http
  POST /api/auth/verifyPhoneNumber
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `phoneNumber`  | `string` | **Required** |
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
```http
  POST /api/auth/verifyResetPassword/{token}
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `phoneNumber`  | `string` | **Required** |
| `token`        | `string` | **Required** |
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
```http
  POST /api/auth/resetPassword/{token}
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `password`     | `string` | **Required** |
| `token`        | `string` | **Required** |
### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `email`        | `string` | 
| `username`     | `string` | 
| `phoneNumber`  | `string` | 
| `government`   | `string` | 
| `gender`       | `string` | 
| `role`         | `string` | 
| `message`      | `string` | 


#### update user
```http
  PATCH /api/auth/{id}
```

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `email`        | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `username`     | `string` | **Required** |
| `password`     | `string` | **Required** must have lowecase,uppercase,nums,special chracters and more than 8 |
| `phoneNumber`  | `string` | **Required** **Unique**  must be valid phoneNumber starts with +20 |
| `government`   | `string` | **Required** |
| `gender`       | `string` | **Required** male or female |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `email`        | `string` | 
| `username`     | `string` | 
| `phoneNumber`  | `string` | 
| `government`   | `string` | 
| `gender`       | `string` | 
| `role`         | `string` | 
| `message`      | `string` | 
----------------------------------------------------------------
#### reserve a Technician 
```http
  POST /api/booking/bookTechnician
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `technicianId` | `number` | **Required** |
| `date`         | `string` | **Required** |
### Response 
| Body Parameter | Type    | 
| :------------- | :-------|
| `userId`      | `string` |
| `TechnicianId`| `string` |
| `date`        | `string` |
| `message`     | `string` | 
```http
  GET /api/booking/allBookings
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
### Response 
| Body Parameter | Type    | 
| :------------- | :-------|
| `userId`      | `string` |
| `TechnicianId`| `string` |
| `date`        | `string` |
```http
  GET /api/booking/myBookings
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
### Response 
| Body Parameter | Type    | 
| :------------- | :-------|
| `userId`      | `string` |
| `TechnicianId`| `string` |
| `date`        | `string` |
```http
  DELETE /api/booking/cancelBooking/{bookingId}
```
| Body Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `bookingId`    | `string` |
### Response 
| Body Parameter | Type    | 
| :------------- | :-------|
| `userId`      | `string` |
| `TechnicianId`| `string` |
| `date`        | `string` |
| `message`     | `string` | 

