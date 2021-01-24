import get from '../softget' ;



module.exports = (req:any, res:any) => {
  res.text(get());
}