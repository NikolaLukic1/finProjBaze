<template>
  <q-page class="q-ma-sm">
    <q-banner
      rounded
      class="bg-primary text-white"
    >
      <span class="text-h5">Pregled proizvoda</span>
    </q-banner>

    <q-list bordered separator>
      <q-item 
        v-for="(product, index) in productDb"
        :key="index"
        clickable
        v-ripple
        @click="updateProduct(product)"
      >
        <q-item-section>
              <q-item-label caption>Sifra</q-item-label>
              {{ product.id }}
        </q-item-section>
            
        <q-item-section class="q-mr-sm">
          <q-item-label caption>Naziv</q-item-label>
          {{ product.name }}
        </q-item-section>
        
        <q-item-section class="q-mr-sm">
          <q-item-label caption>Proizvodna jedinica</q-item-label>
          {{ product.production }}
        </q-item-section>
        
        <q-item-section class="q-mr-sm">
          <q-item-label caption>Jedinica mere</q-item-label>
          {{ product.jedinicaMere }}
        </q-item-section>
        
        <q-item-section class="q-mr-sm">
          <q-item-label caption>Količina</q-item-label>
          {{ product.quantity }}
        </q-item-section>
        
        <q-item-section class="q-mr-sm">
          <q-item-label caption>Cena</q-item-label>
          {{ product.price }}
        </q-item-section>
        
        <q-item-section side>
          <q-btn flat round icon="delete" color="negative" @click.stop="deleteProduct(product.id)"/>
        </q-item-section>
      </q-item>
    </q-list>

    <button-new
      class="absolute-bottom"
      @clicked="insertProduct"
    />
    
    <q-dialog v-model="productDialog">
      <q-card>
        <q-card-section title class="bg-primary text-white text-center text-h6">{{ dialogTitle }}</q-card-section>

        <q-card-section>
          <q-form ref="productForm" @submit.prevent="dialogCommit" @reset="restartForm" style="min-width: 400px">

            <q-input v-model="dialogProduct.name" dense outlined clearable class="q-ma-sm" type="text" label="Naziv proizvoda"/>

            <q-select v-model="dialogProduct.production" dense outlined clearable class="q-ma-sm"
            :options="optionsProduction" option-label="production" option-value="id" emit-value map-options label="Proizvodna jedinica" />

            <q-select v-model="dialogProduct.jedinicaMere" dense outlined clearable class="q-ma-sm" :options="optionsJedinicaMere" map-options label="Jedinica mere" />

            <q-input v-model="dialogProduct.quantity" dense outlined clearable class="q-ma-sm" type="number" label="Količina" />

            <q-input v-model="dialogProduct.price" dense outlined clearable class="q-ma-sm" type="number" label="Cena" />

            <q-card-actions align="right" class="text-primary">
              <q-btn label="Odustani" color="negative" type="reset" />
              <q-space />
              <q-btn label="Nastavi" color="positive" type="submit" />
            </q-card-actions>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- {{ this.productDb }} -->
  </q-page>
</template>

<script>
import vueJoiValidation, {Joi} from 'vue-joi-validation';
import ProizvodService from '../../proizvodService.js'

export default {
  data(){
    return{
      productDb: [],
      // productDb: [
      //   { id: '000001', name: 'Proizvod1', production: 'Fabrika Beograd', jedinicaMere: 'kom', quantity: 20, price: 235},
      //   { id: '000002', name: 'Proizvod2', production: 'Fabrika Nis', jedinicaMere: 'ml', quantity: 20, price: 235},
      //   { id: '000003', name: 'Proizvod3', production: 'Fabrika Novi Sad', jedinicaMere: 'kom', quantity: 20, price: 235},
      //   { id: '000004', name: 'Proizvod4', production: 'Fabrika Beograd', jedinicaMere: 'kg', quantity: 20, price: 235},
      //   { id: '000005', name: 'Proizvod5', production: 'Fabrika Beograd', jedinicaMere: 'kom', quantity: 20, price: 235},
      //   { id: '000006', name: 'Proizvod6', production: 'Fabrika Beograd', jedinicaMere: 'ml', quantity: 20, price: 235}
      // ],
      productDialog: false,
      productToInsert: {name: '', production: '', jedinicaMere: '', quantity: 0, price: 0},
      dialogProduct: {},
      dialogTitle: '',
      optionsProduction : [],
      // optionsProduction: [
      //   { id: 1, production: 'Fabrika Beograd' },
      //   { id: 2, production: 'Fabrika Nis' },
      //   { id: 3, production: 'Fabrika Novi Sad' }
      // ],
      optionsJedinicaMere:['kom', 'kg', 'ml']
    }
  },
  // computed:{
  //   productDb:{
  //     get(){
  //       return this.getProducts();
  //     }
  //   }
  // },
  async created(){
    try {
      this.productDb = await ProizvodService.getProizvod();
      this.optionsProduction = await ProizvodService.getProizvodnaJedinica();
    } catch (err) {
      this.error = err.message;
    }
  },

  components:{
    'button-new': require('../components/buttonNew').default
  },

  methods:{
    async getProducts(){
      return await ProizvodService.getProizvod()
    },
    insertProduct(){

      this.dialogTitle = "Unos proizvoda";
      this.dialogProduct = Object.assign({}, this.productToInsert);
      this.productDialog = true;
    },

    updateProduct(product){
      this.dialogTitle = "Izmena proizvoda";
      this.dialogProduct = Object.assign({}, product);
      this.productDialog = true;
    },

    async dialogCommit(){

      //this.dialogProduct.joiValidate();
      if (this.dialogTitle == 'Unos proizvoda') {
        // API ZA UNOS
      let lastId = this.productDb[this.productDb.length -1].id +1;
      console.log(lastId);
      this.dialogProduct['id'] = lastId;
      await ProizvodService.insertProizvod(this.dialogProduct);

      }
      else{
        // API ZA IZMENU        
        if(isNaN(this.dialogProduct.production)){
          let test = this.optionsProduction.filter(productObj => productObj.production == this.dialogProduct.production);
          this.dialogProduct.production = test[0].id;
        }

        
        await ProizvodService.updateProizvod(this.dialogProduct);
      };

      this.restartForm();
    },

    restartForm(){
      this.dialogProduct = {};
      this.dialogTitle = '';
      this.productDialog = false;
    },

    async deleteProduct(id){
      await ProizvodService.deleteProizvod(id);
    }
  }
}
</script>
