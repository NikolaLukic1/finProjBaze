<template>
  <q-page class="q-ma-sm">
    <q-expansion-item
      dark
      class="bg-primary"
      expand-separator
      icon="reorder"
      label="Unos Porudžbine"
      default-opened
    >
      <q-form
        ref="orderForm"
        @submit.prevent="insertOrder"
        @reset="restartForm"
      >
        <q-card
          class="q-ma-sm"
        >
          <q-card-section>
            <q-input class="q-ma-sm cursor-pointer" readonly dense outlined v-model="orderDataObj.orderDate" label="Datum porudžbine" @click="$refs.qDateProxy.show()">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="orderDataObj.orderDate" mask="DD.MM.YYYY" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            
            <q-select
              v-model="orderDataObj.storage"
              dense
              outlined
              clearable
              class="q-ma-sm"
              :options="optionsStorage"
              option-label="storage"
              option-value="id"
              emit-value
              map-options
              label="Storage"
            />
            
            <q-select
              v-model="orderDataObj.jedinica"
              dense
              outlined
              clearable
              class="q-ma-sm"
              :options="optionsJedinica"
              option-label="jedinica"
              option-value="id"
              emit-value
              map-options
              label="Proizvodna jedinica"
            />

          </q-card-section>
        </q-card>

        <q-card
          class="q-ma-sm"
          v-if="orderDataObj.orderDate && orderDataObj.storage  && orderDataObj.jedinica"
        >
          <q-card-section>
            <q-item class="column">
              <div class="q-mb-md">
                <q-item-label class="text-h5" style="margin: 0; padding: 0;">Unos proizvoda</q-item-label>
              </div>
              <div class="row q-mt-sm"
                v-for="(product, index) in productDataObj"
                :key="index"
              >
                <q-item-section>
                  <q-select v-model="product.id" dense outlined clearable class="q-ma-sm" :options="optionsProduct" option-label="product" option-value="id" emit-value map-options label="Proizvod" />
                </q-item-section>
                <q-item-section>
                  <q-input v-model="product.quantity" label='Količina' type="number" dense outlined></q-input>
                </q-item-section>

                <q-item-section >
                  <q-btn v-if="index + 1 == productDataObj.length" class="q-ml-xl" color="primary" round icon="add" @click="addProduct" />
                  <q-btn v-if="index + 1 !== productDataObj.length" class="q-ml-xl" color="negative" round icon="delete" @click="deleteProduct(index)" />
                </q-item-section>
              </div>
            </q-item>
          </q-card-section>
        </q-card>



          <q-card-actions align="right" class="text-primary">
            <q-btn label="Restart" color="negative" type="reset" />
            <q-btn label="Nastavi" color="positive" type="submit" />
          </q-card-actions>
      </q-form>
    </q-expansion-item>


<!-- ****************************************************************************************************************** -->
    <q-separator />
    <div class="q-mb-lg" />
<!-- ****************************************************************************************************************** -->
  <div
    v-if="previewDataSet.length > 0"
  >
    <q-banner
      rounded
      class="bg-primary text-white"
    >
      <span class="text-h5">Pregled porudžbina</span>
    </q-banner>
    
    <q-list
      bordered
      separator
    >
      <q-item
        v-for="(storage, index) in previewDataSet"
        :key="index"
        style="padding: 0px;"
      >
        <q-item-section>
          <q-expansion-item
            expand-separator
            icon="list"
            :label="`${storage.storage.toString()} - ${storage.jedinica.toString()} - porudžbina na dan ${storage.orderDate}`"
          >
            <q-table
              :data="storage.data"
              :columns="columns"
              row-key="name"
            />
          </q-expansion-item>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  </q-page>
</template>

<script>
import orderService from '../../orderService';

export default {
  data(){
    return{
      orderDataObj:{
        orderDate: null,
        storage: null,
        jedinica: null,
        data:[]
      },

      productDataObj: [{ id: '', quantity: 0 }],

      optionsJedinica:[
        { id: 1, jedinica: 'test jedinica' }
      ],
      optionsStorage: [
        { id: 1, storage: 'Fabrika Beograd' },
        { id: 2, storage: 'Fabrika Nis' },
        { id: 3, storage: 'Fabrika Novi Sad' }
      ],

      optionsProduct:[
        { id: '000001', product: 'Proizvod1' },
        { id: '000002', product: 'Proizvod2' },
        { id: '000003', product: 'Proizvod3' },
        { id: '000004', product: 'Proizvod4' },
        { id: '000005', product: 'Proizvod5' },
        { id: '000006', product: 'Proizvod6' },
      ],

      previewDataSet:[
        {orderDate: '26.11.2019', storage: 'Fabrika Beograd', jedinica: 'test jedinica neka', data:[{ name: 'Proizvod1', quantity: 50 }] }
      ],

      columns: [
        {
          name: 'name',
          required: true,
          label: 'Naziv proizvoda',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'quantity', align: 'center', label: 'Količina', field: 'quantity', sortable: true },
      ]
    }
  },
  
  async created(){
    try {
      // // add api get optionsStorage
      this.optionsStorage = await orderService.getOptionStorage();

      // // add api get optionsProduct
      this.optionsProduct = await orderService.getOptionsProduct();
      // add api ger getOptionsProizvodnaJedinica
      this.optionsJedinica = await orderService.getOptionsProizvodnaJedinica();
      // // add api get previewDataSet
       this.previewDataSet = await orderService.getpreviewDataSet();

      // this.productDb = await ProizvodService.getProizvod();
      // this.optionsProduction = await ProizvodService.getProizvodnaJedinica();
    } catch (err) {
      this.error = err.message;
    }
  },

  methods:{
    addProduct(){
      this.productDataObj.push({ id: '', quantity: 0 })
    },

    restartForm(){
      this.orderDataObj = {
        orderDate: null,
        storage: null,
        jedinica: null,
        data:[]
      }
      this.productDataObj = [{ id: '', quantity: 0 }]
    },

    async insertOrder(){
      this.orderDataObj.data = this.productDataObj;

      let nextId = await orderService.getNextId();
      this.orderDataObj["id"] = nextId.id;
      orderService.insertOrder(this.orderDataObj);
      orderService.insertOrderData(this.orderDataObj);
      //this.previewDataSet.push(this.orderDataObj);
      // add api insert order-a
      // add api get previewDataSet

      console.log(this.orderDataObj);
      
      this.restartForm();
    },

    deleteProduct(index){
      this.productDataObj.splice(index, 1)
    }
  }
}
</script>
