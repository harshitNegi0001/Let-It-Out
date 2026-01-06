

export const returnRes=(res,code,data)=>{
     return res.status(code).json(data);
}