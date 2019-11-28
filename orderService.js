import axios from 'axios';

const url = 'http://localhost:3000/'
//const url = 'http://localhost:5000/api/partnerorder/'

class OrderService{

    static getOptionStorage(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getskladiste/');
                resolve(
                    res.data
                );
            } catch(err){
                reject(err);
            }
        })
    }
    
    static getOptionsProduct(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getproizvod1/');
                
                resolve(
                    res.data 
                );
            } catch(err){
                reject(err);
            }
        })
    }

    static getOptionsProizvodnaJedinica(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getproizvodnajedinica1/');
                
                resolve(
                    res.data 
                );
            } catch(err){
                reject(err);
            }
        })
    }
    static getpreviewDataSet(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getnarudzbenicaset/');
                
                resolve(
                    res.data 
                );
            } catch(err){
                reject(err);
            }
        })
    }
    static getNextId(){
        return new Promise(async (resolve,reject) => {
            try{
                const res = await axios.get(url + 'getlastid/');
                
                resolve(
                    res.data 
                );
            } catch(err){
                reject(err);
            }
        })
    }
    
    static insertOrder(data){
        return axios.post(url + 'insertorder/', data);
    }

    static insertOrderData(data){
        return axios.post(url + 'insertorderdata/', data);
    }

}

export default OrderService;