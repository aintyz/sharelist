const base = require('../utils/base')
const request = require('request')
const config = require('../config')
const cache = require('../utils/cache')

module.exports = {

  async home(ctx , next){
    if(config.installed() ){
      ctx.redirect('/')
    }
    else{
      await ctx.render('install' , {vendors:config.getVendors()})
    }
  }
  ,
  async save(ctx){
    let { token , name , path , vendor , title = 'ShareList'} =  ctx.request.body
    let cfg = {token , title}
    if(Array.isArray(name)){
      cfg.path = name.map((i ,index)=>{
        return { name:i , path:vendor[index]+':'+path[index]}
      })
    }else{
      cfg.path = [{name , path:vendor+':'+path}]
    }
    let result = { status : 0 , message : ''}
    if( token && path ){
      await config.save( cfg )
      ctx.redirect('/')
    }else{
      result.status = -1
      result.message = 'error'
      await ctx.render('install',result)
    }
  }

}