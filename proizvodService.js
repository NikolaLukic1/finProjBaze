import axios from 'axios';

const url = 'http://localhost:3000/'
//const url = 'http://localhost:5000/api/partnerorder/'

class ProizvodService{
    //Get posts
    static getProizvod(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getproizvod/');
                resolve(
                    res.data
                );
            } catch(err){
                reject(err);
            }
        })
    }
    static getProizvodnaJedinica(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getproizvodnajedinica/');
                resolve(
                    res.data
                );
            } catch(err){
                reject(err);
            }
        })
    }
    
    static insertProizvod(data){
        return axios.post(url + 'insertproizvod/', data);
    }

     static updateProizvod(data){
         return axios.put(url + 'updateproizvod/', data);
     }

     static deleteProizvod(id){
        return axios.delete(url + 'deleteproizvod/' + id);
    }

}

export default ProizvodService;