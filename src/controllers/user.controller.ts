import {Request, Response} from 'express'
import User, {IUser} from '../models/user';
import Movie from '../models/movie';
import jwt from 'jsonwebtoken';
import config from '../config/config'
import { extractId } from './id.Extractor';
import * as fuzzy from 'fuzzy';



// Expira en 1209600 Segundos o 14 dias
function createtoken(user: IUser){
  return jwt.sign({id: user.id, email: user.email}, config.jwtSecret, {
    expiresIn: 604800
  });
}
export const testerController = (req: Request, res: Response) =>{

  console.log("Received body: ",req.body);

  console.log("Authorization header: ", req.headers.authorization)


  const authorization: string | undefined = req.headers?.authorization;

  const userId = extractId(authorization);
  console.log("Extracted ID:",userId);


  return res.status(200).json({msg:"Reached the end"});
}


export const signUp = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.email || !req.body.password || !req.body.username || !req.body.fullname){
    return res.status(400).json({msg: 'Please. Provide with all the fields of a User (email, password, username and fullname)'});
  }

  const foundUsers = await User.find({
    $or:[
      {email: req.body.email},
      {username: req.body.username}
    ]
  });


  if(!(foundUsers.length === 0)){
    return res.status(400).json({msg: "The username or email are already used"});
  }


  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json(newUser);
}


export const newCritic = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.email || !req.body.password || !req.body.username || !req.body.fullname){
    return res.status(400).json({msg: 'Please. Provide with all the fields of a User (email, password, username and fullname)'});
  }

  const foundUsers = await User.find({
    $or:[
      {email: req.body.email},
      {username: req.body.username}
    ]
  });


  if(!(foundUsers.length === 0)){
    return res.status(400).json({msg: "The username or email are already used"});
  }

  req.body.isCritic = true;
  req.body.profilePicture = "https://africandelightstore.com/cdn/shop/files/1453_800x.jpg?v=1688339687"

  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json(newUser);
}

// GENERATE JWT FROM USER

export const signIn = async (req: Request, res: Response) =>{
  if (!req.body.password){
    return res.status(400).json({msg:'Please. Send your password'});
  }

  if(req.body.email){
    const user = await User.findOne({email: req.body.email})
    if(!user){
      return res.status(400).json({msg: 'The user does not exist'});
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch){
      return res.status(200).json({token: createtoken(user)})
    }

  }else if(req.body.username){
    const user = await User.findOne({username: req.body.username});
    if(!user){
      return res.status(400).json({msg: 'The user does not exist'});
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch){
      return res.status(200).json({token: createtoken(user)})
    }

  }else{
    return res.status(400).json({msg:'Please. Send email or username'})
  }


  return res.status(400).json({
    msg: 'The email or password are incorrect' 
  })

}



export const deleteUser = async (req: Request, res: Response): Promise<Response> =>{

  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);

  if(!req.body.password){
    return res.status(400).json({msg:"Please. Send the password"});
  }

  try{

    if (userId) {
      const user = await User.findOne({_id: userId})
      if(!user){
        return res.status(400).json({msg:"User does not exist"});
      }
      const isMatch = await user.comparePassword(req.body.password);

      if(isMatch){
        await User.deleteOne({_id: userId})
        return res.status(200).json({msg:`Deleted User with username: ${user.username}`});
      }
      else{
        return res.status(400).json({msg:"Password did not match"});
      }
    }
    else {
      console.log("User ID is undefined");
      return res.status(400).json({msg:"A problem arised with the UserId"});
    }

  }catch(error){
    console.error('Error arised in deleteUser controller:', error)
    return res.status(500).json({msg:`Something went wrong ${error}`})
  }
}

async function isUsernameAvailable(newUsername: String, currentUsername: String) {
  const existingUser = await User.findOne({ username: newUsername });



  return !existingUser || (existingUser.username === currentUsername);
}

export const checkUsername = async (req: Request, res: Response): Promise<Response> => {
  if(!req.body.newUsername || !req.body.username){
    return res.status(400).json({msg:"Please. Pass the usernames to check"})
  }


  const Available = await isUsernameAvailable(req.body.newUsername, req.body.username);
  if(Available){
    return res.status(200).json({isValidUsername: true, msg:"Username is Available."})
  }
  return res.status(400).json({isValidUsername: false, msg:"Username is not Available."} )
}
export const modifyUser = async (req: Request, res: Response): Promise<Response> =>{


  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);
  
  if(!req.body.newUsername && !req.body.newFullname && !req.body.newBio){
    return res.status(400).json({msg: "No parameters passed. No changes to the user", missingParams:"newUsername, newFullname, newBio"})
  }
  try{
    if (userId) {
        const user = await User.findOne({_id: userId})
        if(!user){
          return res.status(400).json({msg: 'The user does not exist'});
        }

        var modifiedFields: {
          username: string;
          bio: string;
          fullname: string;
        } = {
          username: "unchanged",
          bio: "unchanged",
          fullname: "unchanged"
        };

        var changeFail:boolean = false;

        if(req.body.newUsername){
          const Available = await isUsernameAvailable(req.body.newUsername, user.username);
          if(Available){
            await user.modifyUsername(req.body.newUsername)
            modifiedFields['username'] = "Changed Successfully!";
          }
          else{
            modifiedFields['username'] = "Error! Unavailable."
            changeFail = true;
          }
        }
        if(req.body.newBio){
          await user.modifyBio(req.body.newBio);
          modifiedFields['bio'] = "Changed Successfully!"
        }
        if(req.body.newFullname){
          await user.modifyFullname(req.body.newFullname);
          modifiedFields['fullname'] = "Changed Successfully!"
        }

        if(changeFail){

          return res.status(207).json({msg:"Partial Success on the changes", modifiedFields})
        }

        return res.status(200).json({msg:"Changes were done correctly",modifiedFields})

    }
    else {
      console.log("Used Id is undefined");
      return res.status(400).json({msg:"A problem arised with the JWT"});
    }
  }
  catch(error){
    console.error('Error decoding JWT:', error)
    return res.status(500).json({msg:`Something went wrong ${error}`})
  }
}

export const changePicture = async (req: Request, res: Response): Promise<Response> =>{
  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);

  if(!req.body.newProfilePicture){
    return res.status(400).json({msg:"Please. Provide with the profile picture link"})
  }

  if(userId){
    const user = await User.findOne({_id: userId})
    if(!user){
      return res.status(400).json({msg: 'The user does not exist'});
    }
    await user.modifyPFP(req.body.newProfilePicture);
    return res.status(200).json({msg: "Profile Picture modified correctly"})

  }else{
    return res.status(400).json({msg: "Error parsing the JWT"})
  }
}


export const modifyUserPassword = async (req: Request, res: Response): Promise<Response>=>{
 
    const authorization: string | undefined = req.headers?.authorization;
    const userId = extractId(authorization);
    if(!req.body.newPassword){
      return res.status(400).json({msg: "Please pass the req.body.newPassword"})
    }
    try{


      if (userId) {
          const user = await User.findOne({_id: userId})
          if(!user){
            return res.status(400).json({msg: 'The user does not exist'});
          }
          const modifiedUser = await user.modifyPassword(req.body.newPassword);
          if(modifiedUser){
            return res.status(200).json({msg:`User ${modifiedUser} modified successfully with New Password`});
          }else{
            return res.status(500).json({msg:"Something went wrong modifying the user"})
          }
      }
      else {
        console.log("User Id is undefined");
        return res.status(400).json({msg:"A problem arised with the JWT"});
      }
  
    }catch(error){
      console.error('Error decoding JWT:', error)
      return res.status(500).json({msg:`Something went wrong ${error}`})
    }
}

// READ THE USER DATA

export const getUserData = async (req: Request, res: Response): Promise<Response>=>{

    const authorization: string | undefined = req.headers?.authorization;
    const userId = extractId(authorization);

    if(!req.body.userId){
      return res.status(400).json({msg: "Please. Provide with the desired userId"})
    }

    try{
  
      if (userId) {
          const user = await User.findOne({_id: req.body.userId})
          if(!user){
            return res.status(400).json({msg: 'The user does not exist'});
          }

          return res.status(200).json(
            {
              msg: "User data sent", 
              id:`${user._id}`,
              username:`${user.username}`,
              fullname:`${user.fullname}`,
              bio:`${user.bio}`,
              PFP:`${user.profilePicture}`,
              isCritic:`${user.isCritic}`
            });
        
      }
      else {
        console.log("User Id is undefined");
        return res.status(400).json({msg:"A problem arised with the JWT"});
      }
  
    }catch(error){
      console.error('Error decoding JWT:', error)
      return res.status(500).json({msg:`Something went wrong ${error}`})
    }
}


export const fuzzySearchUsers = async (req: Request, res: Response): Promise<Response> =>{
  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);

  if(!req.body.username){
    return res.status(400).json({msg: "Please. Provide with the username to search"})
  }

  const user = await User.findOne({_id: userId});
  if(!user){
    return res.status(400).json({msg: 'The user does not exist'});
  }

  const allUsers = await User.find({}, 'username fullname profilePicture bio');
  const results = fuzzy.filter(req.body.username, allUsers, { extract: user => user.username });

  const matchedUsers = results.map(result => result.original);

  return res.status(200).json(matchedUsers);
}

// RATE MOVIE


export const movieRating = async (req: Request, res: Response): Promise<Response> =>{


    const authorization: string | undefined = req.headers?.authorization;
    const userId = extractId(authorization);
   
    
    if(!req.body.userRating){
      req.body.userRating = 0;
    }
    if(!req.body.movieId){
      return res.status(400).json({msg: "Please. Provide with the movie Id (movieId)"})
    }

    if(req.body.userRating < 0 || req.body.userRating > 5){
      return res.status(400).json({msg: "Invalid user rating, must be between 0 and 5"})
    }

    try{
      if (userId) {
          const user = await User.findOne({_id: userId})
          if(!user){
            return res.status(400).json({msg: 'The user does not exist'});
          }
          
          const movie = await Movie.findOne({apiId: req.body.movieId})
          if(!movie){
            return res.status(400).json({msg: 'Movie not found by its apiId'});
          }
          
          if(user.isCritic){
            // @ts-ignore
            movie.updateRunningMeanCritics(userId, req.body.userRating);

          }
          else{
            // @ts-ignore
            movie.updateRunningMeanUsers(userId, req.body.userRating);
          }

          return res.status(200).json({msg: "Movie rated successfully"})
  
      }
      else {
        console.log("Used Id is undefined");
        return res.status(400).json({msg:"A problem arised with the JWT"});
      }
    }
    catch(error){
      console.error('Error decoding JWT:', error)
      return res.status(500).json({msg:`Something went wrong ${error}`})
    }
}

