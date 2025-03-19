//funciones que se ejecutaran antes de que lleguen a una ruta
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'
export const authRequired= (req, res, next) => {
    
    const {token} = req.cookies
    
    if(!token)
        return res.status(401).json({messagge: "No hay token, autorizacion denegada"})
    
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json({messagge:"token invalido"})
            
            req.user = user

            next();
        })
    
}