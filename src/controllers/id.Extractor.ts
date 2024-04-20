import jwt from 'jsonwebtoken';

// Interfaces de typescript
interface JwtPayLoad{
  id: string;
  email: string;
}


export function extractId(authorization: string | undefined){
  if (authorization) {

    const receivedJwt = authorization.split(" ")[1];
   
    const decodedToken = jwt.decode(receivedJwt) as JwtPayLoad;
    
    if(decodedToken.id){

      return decodedToken.id;
    
    }else{
      console.error('Invalid JWT');
      return undefined;
    }
    
  }
  else {
    console.log(" undefined");
    return undefined;
  }
}