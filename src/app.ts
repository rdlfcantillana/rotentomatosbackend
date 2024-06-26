import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport'; // Modulo passport
import passportMiddleware from './middlewares/passport' // Middleware passport

import authRoutes from './routes/auth.routes';
import specialRoutes from './routes/general.routes';
import adminRoutes from './routes/admin.routes'

// initializations
const app = express()

//settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

// routes
app.get('/', (req, res) =>{
  res.send(`THE API is at http://localhost:${app.get('port')}`);
})

app.use(authRoutes);
app.use(specialRoutes);
app.use(adminRoutes);

export default app;