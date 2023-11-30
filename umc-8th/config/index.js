// index.js

import express from 'express';
import { tempRouter } from '../routes/temp.route.js';
import { response } from './response.js';
import { status } from './response.status.js';

const app = express();
const port = 3000;

// router setting
app.use('/temp', tempRouter);

app.get('/', (req, res) => {
    console.log("/");
    res.send('Hello UMC!');
});

app.get('/hello', (req, res) => {
    console.log("/hello");
    res.send('Hello world!');
});

//에러 핸들링 미들웨어
/*
app.use((err, req, res, next) => {
    console.error(err.stack);
    //클라이언트에게 적절한 에러 응답 제공
    res.status(500).send(err.stack);
});
*/
app.use((req,res,next)=>{
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});
app.use((err, req, res, next) => {
    console.log(err.data.status);
    console.log(err.data.message);
    //쳄플릿 엔진 변수 설정
    res.locals.message = err.message;
    //개발환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.sourceMapsEnabled.NODE_ENV !== 'production' ? err : {};
    res.status(err.data.status).send(response(err.data));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});