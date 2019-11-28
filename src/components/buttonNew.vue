<template>
  <div class="text-center">
    <q-btn
      round
      icon="add"
      color="primary"
      class="q-mb-lg"
      size="20px"
      @click="emitBtnClick"
    />
  </div>
</template>

<script>
export default {
    props:[],

    methods:{
      emitBtnClick(){
        this.$emit('clicked')
      }
    }
}
</script>