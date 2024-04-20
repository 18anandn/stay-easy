# StayEasy.site

[Link to website](https://stayeasy.site)

StayEasy.site is a website for booking homes or rooms. Users can book for accommodation and home/hotel owners can register and see analytics about their home/hotel.

Note: This is a hobby project for showcasing full stack development for solving real world problems efficiently. Except the domain name, all the resources used are free.

## Features implemented

### Maximum availability approach

If a booking can be done is possible in multiple cabins/rooms, an approach inspired by Best Fit allocation strategy in memory management is used. This ensures that the home/hotel is available for longer durations and hence increasing profit.

![Example 1](/assets/example/example_1.png)
![Example 2](/assets/example/example_2.png)
![Example 3](/assets/example/example_3.png)

### Locking to prevent the double booking problem

Row level locks are used to prevent double bookings for a home/hotel. A row level lock is acquired on the hotel to be booked. And the query is executed to get available cabin/room. If available, the booking entry is created otherwise an error is thrown. All of these operations are done in the database itself using PLpgSQL functions to avoid multiple calls between database and the backend.

### Images

For images, AWS S3 and Cloudfront is used to minimize cost and faster delivery. The images are also protected using presigned URLs. Uploads are done using presigned POST URLs with an expiry time of a few minutes. File size and extensions are taken care of by S3, but it does not check contents of the image. Users could upload a PDF by changing the extensions. So the files are uploaded to temporary paths (keys) first to the S3 bucket. The files are then verified by the backend by fetching only the first few bytes from the S3 bucket. The invalid files are then deleted periodically using bucket lifecycle policies.

### Use of CTEs over ORM

CTEs are used with SQL queries over ORM in many scenarios for reusing queried data for variety of aggregations to reduce DB calls. This helps in reducing DB connection bandwidth along with Redis caching.

### Map interaction and geocoding service

[Geopify](https://www.geoapify.com/) is used for geocoding which provide a limited quota per day. Since they do not have any hard limit, a basic limiter has been implemented in the backend to ensure that daily quotas are not crossed. The quotas are reset every day using [pg_cron](https://github.com/citusdata/pg_cron).

React leaflet is used to mimic most of the features from Airbnb like popup carousel, auto adjust position of popup in the map container, etc.

### Back-end

- Typescript is used in both backend and frontend to ensure type safety.
- NestJs is used for better code organization of data validation, authentication, authorization and many services like image upload and URL presigning, geocoding, etc. 

### Front-end

Many common front-end development patterns were following like lazy loading, infinite-scroll, etc. Some of them which standout are:

- Resize Observer API used to hide long text paragraphs with "show more" option.
- A lot of reusable components were made. Some of them are
  1. Date range picker (on top of [react-day-picker](https://react-day-picker.js.org/))
  2. Modal (using native HTML &lt;dialog&gt;)
  3. Carousel (scroll based)
  4. File selector

## Tech Stack

Typescript, NestJs, ReactJs, TypeORM, PostgreSQL, Nginx

## Services

AWS (EC2, RDS, Elasticache, S3, Cloudfront)