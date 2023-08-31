# Technecians 
## API Reference

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
