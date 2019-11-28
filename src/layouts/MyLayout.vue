<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title class="text-center">
          {{ productNameLocal }} v.{{ versionLocal }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Navigacija</q-item-label>
        <q-item
          v-for="(nav, index) in navs"
          :key="index"
          clickable
          :to="nav.to"
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
            <q-item-label caption>{{ nav.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { productName, version } from '../../package.json';
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      navs:[
        {to: '/product', icon: 'list', label: 'Proizvodi', caption: 'Pregled, unos i ispravka proizvoda'},
        {to: '/order', icon: 'reorder', label: 'Porudžbine', caption: 'Pregled porudžbina'}
      ],
      productNameLocal: productName,
      versionLocal: version
    }
  }
}
</script>
