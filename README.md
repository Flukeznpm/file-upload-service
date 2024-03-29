# File Upload Service

This service is about uploading file and send email notification when uploaded.

# Rest API

- PORT : 8000

## User Register

`POST /file-upload-service/initial/user/register`

### Body request

```
{
    "email": "", # This email will used to receive a mail notification
    "password": ""
}
```

## User Login

`POST /file-upload-service/auth/login`

### Body request

```
{
    "email": "",
    "password": ""
}
```

## File Library (Upload logs)

`POST /file-upload-service/workflow/file/library`

### Body request

```
{
    "search": "",
    "sortBy": "", # "asc" | "desc"
    "page": 1,
    "limit": 10,
    "timezone": 7
}
```

## File Upload

`POST /file-upload-service/workflow/file/upload`

### form-data request

- Key
  - "file" `File`

## File Download

`GET /file-upload-service/workflow/file/download?uploadLogId=`

### Query Param

- uploadLogId

## File Delete

`DELETE /file-upload-service/workflow/file/delete`

### Body request

```
{
    "uploadLogId": ""
}
```

# Run service

1. Add .env file
2. Go to root project
3. Run cmd

```
docker-compose up -d --build
```

or

1. Add .env file
2. Go to root project
3. Run cmd following step

```
yarn
```

```
yarn start
```

# Run test

```
yarn test
```
